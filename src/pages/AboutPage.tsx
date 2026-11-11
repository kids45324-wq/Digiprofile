import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart, Sparkles, Globe, Users, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Empowering the World's Creators to Own Their Economy
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            DigiProfile was founded on a simple conviction: creators should not have to stitch together six different overpriced platforms just to sell a PDF, book an audience call, or share their links.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              One Profile. Unlimited Possibilities.
            </h2>
            <p>
              Traditional link-in-bio widgets were built as directory dead-ends. They push high-intent buyers away to external websites where carts are abandoned and fees are duplicated. DigiProfile transforms your bio link into a rich, self-contained ecommerce storefront with native Stripe and Razorpay integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-black text-purple-600 block">$2.4M+</span>
              <span className="text-xs text-slate-400 font-semibold">Paid to Creators</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-black text-blue-600 block">135+</span>
              <span className="text-xs text-slate-400 font-semibold">Countries Supported</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-black text-emerald-500 block">99.98%</span>
              <span className="text-xs text-slate-400 font-semibold">Verified Uptime</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Privacy, Security, and Independence
            </h2>
            <p>
              We believe in server-verified payment security. Files are never stored on public CDNs; every digital download generates a cryptographically signed token with an expiry window, ensuring your digital intellectual property remains protected from unauthorized link sharing.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/30 text-sm inline-flex items-center gap-2"
          >
            Create Your Free Profile Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
