import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Heart, Shield, Lock, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                DigiProfile
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "One Profile. Unlimited Possibilities." Launch your customized creator profile, sell digital products, courses, and PDFs, and receive global payments with zero friction.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Supabase RLS Secured
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" /> Stripe & Razorpay Verified
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/features" className="hover:text-purple-400 transition">
                  Features & Tools
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-purple-400 transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-purple-400 transition">
                  Explore Creators
                </Link>
              </li>
              <li>
                <Link to="/alexrivera" className="hover:text-purple-400 transition flex items-center gap-1">
                  Sample Profile <Sparkles className="w-3 h-3 text-purple-400" />
                </Link>
              </li>
              <li>
                <Link to="/alexrivera/store" className="hover:text-purple-400 transition">
                  Sample Digital Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Creator Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-purple-400 transition">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=appearance" className="hover:text-purple-400 transition">
                  Profile Theme Builder
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=products" className="hover:text-purple-400 transition">
                  Product Manager
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=payments" className="hover:text-purple-400 transition">
                  Stripe & Razorpay Setup
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-purple-400 transition">
                  Customer Download Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Legal & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-purple-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-purple-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-400 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-purple-400 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DigiProfile Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Crafted for creators worldwide <Globe className="w-3.5 h-3.5 text-slate-400 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
