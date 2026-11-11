import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Mail, 
  FileText, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Order, DigitalProduct } from '../types';
import { api } from '../services/api';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      setLoading(true);
      try {
        const res = await api.getOrder(orderId);
        if (res) {
          setOrder(res.order);
          setProduct(res.product);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleDownload = () => {
    if (!order) return;
    setDownloading(true);
    // Request secure download endpoint
    const downloadUrl = `/api/download/${order.downloadToken}`;
    
    // Create an invisible anchor to initiate native browser file download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', product?.fileName || 'digital-asset.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      // update count locally
      setOrder(prev => prev ? { ...prev, downloadCount: (prev.downloadCount || 0) + 1 } : null);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-bold text-lg">Order not found</p>
          <Link to="/" className="text-purple-600 underline text-sm mt-2 block">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
          {/* Animated Green Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full">
              Payment Verified & Confirmed
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-3">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Your transaction has completed successfully. Order receipt and license details have been emailed to <strong className="text-slate-800 dark:text-white">{order.customerEmail}</strong>.
            </p>
          </div>

          {/* Order Details Receipt Box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-400">Order Reference</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-400">Digital Product</span>
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{order.productTitle}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-400">Creator</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">@{order.creatorUsername}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-400">Amount Paid</span>
              <span className="font-black text-emerald-500">${order.amount} USD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Payment Gateway</span>
              <span className="uppercase font-mono text-[10px] text-slate-500">{order.paymentMethod} • {order.paymentId.slice(0, 16)}...</span>
            </div>
          </div>

          {/* Secure Download Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/10 via-indigo-900/10 to-transparent dark:from-purple-950/40 dark:to-slate-900 border-2 border-purple-500/40 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Secure Signed Download Link
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {order.downloadCount} of {order.maxDownloads} downloads used
              </span>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 transition shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Decrypting & Streaming File...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {product?.fileName || 'Digital Assets'}</span>
                </>
              )}
            </button>

            {downloadSuccess && (
              <p className="text-xs text-emerald-500 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Download file requested successfully!
              </p>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" /> Link active for 7 days
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-500" /> Commercial license included
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/my-orders"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> View My Digital Library
            </Link>
            <Link
              to={`/${order.creatorUsername}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
            >
              Return to Creator Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
