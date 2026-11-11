import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Lock, 
  Star, 
  Clock, 
  Check, 
  FileText, 
  Share2, 
  Copy,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DigitalProduct, CreatorProfile } from '../types';
import { api } from '../services/api';

export const ProductDetailsPage: React.FC = () => {
  const { username, productId } = useParams<{ username: string; productId: string }>();
  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      try {
        const prod = await api.getProduct(productId);
        if (prod) {
          setProduct(prod);
          if (username) {
            const cData = await api.getCreator(username);
            if (cData) setCreator(cData.creator);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId, username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const effectivePrice = product.isFree ? 0 : product.discountPrice || product.price;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={creator ? `/${creator.username}/store` : '/explore'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Product'}</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Product Thumbnail & Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <img
                src={product.thumbnailUrl}
                alt={product.title}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>

            {/* Product In-Depth Description */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                About this Digital Product
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  What is Included in Your Download:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Purchase Box & Creator Info */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Purchase Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-purple-500/30 dark:border-purple-500/40 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.title}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price display */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">One-Time Payment</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {product.isFree ? 'FREE' : `$${effectivePrice}`}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
                {product.discountPrice && (
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                    Save ${product.price - product.discountPrice}
                  </span>
                )}
              </div>

              {/* Buy Button */}
              <Link
                to={`/checkout/${product.id}`}
                className="w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 transition shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 text-sm group"
              >
                <span>{product.isFree ? 'Download Free Resource' : `Buy Now for $${effectivePrice}`}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Security guarantees */}
              <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Instant automated download delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>256-bit encrypted Stripe & Razorpay checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{product.fileName} ({(product.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB)</span>
                </div>
              </div>
            </div>

            {/* Creator Card */}
            {creator && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <img
                  src={creator.avatarUrl}
                  alt={creator.displayName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500"
                />
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {creator.displayName}
                    </h4>
                    {creator.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">@{creator.username}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{creator.tagline}</p>
                </div>
                <Link
                  to={`/${creator.username}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
