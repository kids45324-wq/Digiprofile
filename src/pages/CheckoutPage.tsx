import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Tag, 
  Check, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Download,
  DollarSign
} from 'lucide-react';
import { DigitalProduct } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [customerName, setCustomerName] = useState('Jordan Lee');
  const [customerEmail, setCustomerEmail] = useState('customer@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Card simulation fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      try {
        const prod = await api.getProduct(productId);
        setProduct(prod);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim();
    if (!code) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(code);
      setDiscountPercent(res.discountPercent);
      setCouponApplied(true);
      setCouponCode(res.code);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponApplied(false);
      setDiscountPercent(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const calculateAmounts = () => {
    if (!product) return { base: 0, discount: 0, total: 0 };
    if (product.isFree) return { base: 0, discount: 0, total: 0 };

    const base = product.discountPrice !== undefined ? product.discountPrice : product.price;
    const discount = discountPercent > 0 ? Math.round((base * discountPercent) / 100) : 0;
    const total = Math.max(0, base - discount);
    return { base, discount, total };
  };

  const { base, discount, total } = calculateAmounts();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!customerEmail || !customerName) {
      setErrorMessage('Please provide your name and email address for order delivery.');
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      // Step 1: Create server-authoritative order intent
      setProcessingStep('1/3 Creating verified server order intent...');
      const serverOrder = await api.createCheckoutOrder({
        productId: product.id,
        customerName,
        customerEmail,
        couponCode: couponApplied ? couponCode : undefined,
        paymentMethod: product.isFree ? 'free' : paymentMethod,
      });

      // Step 2: Handle Gateway (Razorpay or Stripe)
      if (paymentMethod === 'razorpay' && !product.isFree && total > 0) {
        setProcessingStep('2/3 Initializing Razorpay Gateway (Key: rzp_test_TyqHne0jnrPbXS)...');
        const scriptLoaded = await loadRazorpayScript();

        if (scriptLoaded && typeof (window as any).Razorpay === 'function') {
          // Open Razorpay Standard Checkout Popup
          const razorpayKey = serverOrder.razorpayKeyId || 'rzp_test_TyqHne0jnrPbXS';
          const rzpOptions = {
            key: razorpayKey,
            amount: Math.round(total * 85 * 100), // Converted to INR paise
            currency: 'INR',
            name: 'DigiProfile Store',
            description: product.title,
            image: product.thumbnailUrl,
            prefill: {
              name: customerName,
              email: customerEmail,
              contact: '9999999999',
            },
            notes: {
              order_id: serverOrder.orderId,
              product_id: product.id,
            },
            theme: {
              color: '#7c3aed',
            },
            modal: {
              ondismiss: () => {
                setProcessing(false);
                setProcessingStep('');
              },
            },
            handler: async (response: any) => {
              try {
                setProcessingStep('3/3 Verifying Razorpay signature and releasing digital asset...');
                const verifyRes = await api.verifyPayment({
                  orderId: serverOrder.orderId,
                  orderNumber: serverOrder.orderNumber,
                  productId: product.id,
                  customerName,
                  customerEmail,
                  paymentMethod: 'razorpay',
                  paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                  signature: response.razorpay_signature,
                  amount: total,
                  currency: product.currency,
                  couponCode: couponApplied ? couponCode : undefined,
                });

                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                });

                navigate(`/order-success/${verifyRes.order.id}`);
              } catch (err: any) {
                setErrorMessage(err.message || 'Signature verification failed.');
                setProcessing(false);
              }
            },
          };

          const rzpInstance = new (window as any).Razorpay(rzpOptions);
          rzpInstance.on('payment.failed', function (resp: any) {
            setErrorMessage(resp.error?.description || 'Razorpay payment was not completed.');
            setProcessing(false);
          });
          rzpInstance.open();
          return;
        }
      }

      // Fallback or Stripe Flow
      setProcessingStep(`2/3 Authorizing with ${paymentMethod === 'stripe' ? 'Stripe 3DS' : 'Razorpay Gateway'}...`);
      await new Promise(r => setTimeout(r, 900));

      setProcessingStep('3/3 Verifying signature & issuing download token...');
      const verifyRes = await api.verifyPayment({
        orderId: serverOrder.orderId,
        orderNumber: serverOrder.orderNumber,
        productId: product.id,
        customerName,
        customerEmail,
        paymentMethod: product.isFree ? 'free' : paymentMethod,
        paymentId: serverOrder.paymentOrderId || `pay_rzp_${Date.now()}`,
        amount: total,
        currency: product.currency,
        couponCode: couponApplied ? couponCode : undefined,
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      navigate(`/order-success/${verifyRes.order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed. Please try again.');
    } finally {
      setProcessing(false);
      setProcessingStep('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-bold text-lg">Product not found</p>
          <Link to="/explore" className="text-purple-600 underline text-sm mt-2 block">
            Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to={`/${product.creatorUsername}/product/${product.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return to Product
          </Link>
        </div>

        {/* Sandbox Test Mode Helper Banner */}
        <div className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-blue-900/10 dark:from-purple-950/40 dark:to-slate-900 border border-purple-300 dark:border-purple-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Payment Sandbox Test Mode Active
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                You can test checkout safely. No real card will be charged.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyCoupon('CREATOR50')}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <Tag className="w-3 h-3" /> Apply 50% Off (CREATOR50)
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer Details & Payment Options */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Customer Information
            </h2>

            <form onSubmit={handleCompletePayment} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Jordan Lee"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
                    Email for File Delivery
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {!product.isFree && total > 0 && (
                <>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-3">
                      Select Payment Provider
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('stripe')}
                        className={`p-3.5 rounded-2xl border text-left transition ${
                          paymentMethod === 'stripe'
                            ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 ring-2 ring-purple-600/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">Stripe</span>
                          <CreditCard className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-[11px] text-slate-500">Global Credit/Debit Cards</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`p-3.5 rounded-2xl border text-left transition ${
                          paymentMethod === 'razorpay'
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">Razorpay</span>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">UPI</span>
                        </div>
                        <p className="text-[11px] text-slate-500">UPI, NetBanking, Cards</p>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'razorpay' ? (
                    <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                          Razorpay Gateway Integration
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Live Test Key
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Merchant API Key:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          rzp_test_TyqHne0jnrPbXS
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>UPI Apps (GPay, PhonePe, Paytm)</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span>Instant UPI QR Code</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          <span>NetBanking (SBI, HDFC, ICICI)</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          <span>RuPay / Visa / MasterCard</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Stripe Card fields */
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold uppercase tracking-wider">Test Card Details</span>
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
                        </span>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 transition shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{processingStep || 'Verifying Transaction...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {product.isFree || total === 0 ? 'Confirm Free Download' : `Pay $${total} & Unlock Download`}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Order Summary
              </h3>

              {/* Product item snippet */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="overflow-hidden flex-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {product.title}
                  </h4>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                    By @{product.creatorUsername}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{product.fileName}</p>
                </div>
                <span className="font-black text-sm text-slate-900 dark:text-white shrink-0">
                  {product.isFree ? 'FREE' : `$${base}`}
                </span>
              </div>

              {/* Coupon Input */}
              {!product.isFree && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400">
                    Promo or Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. CREATOR50"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={validatingCoupon || !couponCode}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {validatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {couponApplied && (
                    <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {discountPercent}% coupon '{couponCode}' applied!
                    </p>
                  )}
                  {couponError && (
                    <p className="text-xs text-rose-500 font-semibold">{couponError}</p>
                  )}
                </div>
              )}

              {/* Cost calculation breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${base}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Coupon Discount</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Platform Fee</span>
                  <span className="text-emerald-500 font-bold">$0.00 (Waived)</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Due</span>
                  <span>${total} USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
