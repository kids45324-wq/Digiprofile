import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Globe, 
  ShoppingBag, 
  CreditCard, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Palette, 
  Download, 
  Lock, 
  Key, 
  Database,
  Users
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Complete Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Built for Modern Digital Creators
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Every feature in DigiProfile is designed to maximize conversion, eliminate technical maintenance, and keep your business secure.
          </p>
        </div>

        {/* Feature Block 1: Profile Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold">Next-Gen Profile Builder</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Ditch rigid link trees. DigiProfile gives you a full visual studio to craft your personal homepage. Choose from 6 curated color themes, typography styles, button geometries, and glassmorphic card layouts.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Live split-screen real-time editing
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Custom branding & bio links with click analytics
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Custom domain mapping (yourname.com)
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/dashboard?tab=appearance"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Try the Profile Builder <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
                <span>Theme Presets</span>
                <span>Active: Deep Purple</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <div className="p-3 rounded-xl bg-purple-900 text-white border-2 border-purple-500 shadow">
                  Deep Purple
                </div>
                <div className="p-3 rounded-xl bg-blue-900 text-white opacity-80">
                  Electric Blue
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 text-white opacity-80">
                  Cyber Dark
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Live Preview Card</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    AR
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Alex Rivera</p>
                    <p className="text-xs text-purple-500">digiprofile.com/alexrivera</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Block 2: Payments & Digital Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="order-2 lg:order-1 bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Server-Side Signature Verification</h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-1">
                    Every transaction generates a secure cryptographic token. Digital files are never exposed publicly.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-start gap-3">
                <Key className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">Temporary Signed Download URLs</h4>
                  <p className="text-xs text-purple-800 dark:text-purple-400 mt-1">
                    Download tokens expire automatically after 7 days and enforce a 5-download safety threshold.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Stripe & Razorpay Integration</h4>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">
                    Seamless checkout with Cards, Apple Pay, Google Pay, UPI, and international currency conversion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold">Enterprise Payment Security</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We take payment integrity seriously. Zero client-side trust: payment verification occurs on secure backend endpoints with HMAC signature validation and duplicate charge prevention.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Razorpay webhook signature verification
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Stripe PaymentIntent server verification
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Supabase Storage bucket access controls
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                View Plans & Fees <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Block 3: Analytics & Customer Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold">Deep Analytics & CRM</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Understand where your highest-converting visitors come from. Track conversion rates, gross revenue, product popularity, and download frequency.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Real-time order notifications
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> Customer directory with lifetime spend tracking
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500" /> One-click CSV exports for accounting
              </li>
            </ul>
          </div>
          <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>CONVERSION FUNNEL</span>
                <span className="text-emerald-500 font-semibold">5.92% (High)</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>1. Profile Views</span>
                    <span>14,200</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-blue-500"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>2. Product Clicks</span>
                    <span>4,890 (34%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[34%] h-full bg-purple-500"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>3. Completed Checkout</span>
                    <span>842 (17.2%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[17%] h-full bg-emerald-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 pb-4">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/30 text-base"
          >
            Launch Your Store Now Free
          </Link>
        </div>
      </div>
    </div>
  );
};
