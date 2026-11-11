import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'1month' | '3months'>('1month');
  const { user } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      tagline: 'Ideal for getting started with your first templates and bio link.',
      priceLabel: '$0',
      periodLabel: 'forever',
      templateLimit: 'Host up to 3 Templates',
      platformFee: '5% platform fee',
      features: [
        'Host up to 3 Templates / Digital Products',
        '1 Creator Profile (digiprofile.com/username)',
        'Drag & Drop Image Uploads',
        'Direct Stripe & Razorpay Checkout',
        'Automated Secure File Delivery',
        'Standard Profile Themes',
        'Community Support'
      ],
      ctaText: 'Start Free (3 Templates)',
      isPopular: false,
      ctaLink: '/register',
    },
    {
      id: 'pro',
      name: 'Creator Pro',
      tagline: 'For creators wanting more templates, 0% platform fee, and premium features.',
      priceLabel: billingPeriod === '1month' ? '$1' : '$10',
      periodLabel: billingPeriod === '1month' ? '/ month' : '/ 3 months',
      templateLimit: 'Host up to 5 Templates',
      platformFee: '0% platform fee',
      features: [
        'Host up to 5 Templates / Digital Products',
        '15-Day Free Trial Included',
        '0% Platform Fee (Keep 100% of sales)',
        'Drag & Drop Image Uploads (Avatar & Thumbnails)',
        'Custom Domain Mapping (yourname.com)',
        'All Premium Themes & Visual Customizations',
        'Discount Coupons & Promo Engine',
        'Advanced Analytics & Conversion Tracking',
        'Priority Customer Support'
      ],
      ctaText: user 
        ? `Upgrade to Pro (${billingPeriod === '1month' ? '$1/mo' : '$10 for 3 mos'})` 
        : 'Start 15-Day Free Trial',
      isPopular: true,
      trialBadge: '15-Day Free Trial',
      ctaLink: user ? '/dashboard?tab=settings' : '/register?plan=pro',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-14 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Transparent Creator Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Super Simple Pricing
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Host your templates, customize with drag & drop images, and start selling in minutes.
          </p>

          {/* 1 Month ($1) vs 3 Months ($10) Selector */}
          <div className="pt-4 flex items-center justify-center">
            <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingPeriod('1month')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  billingPeriod === '1month'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1 Month ($1 / mo)
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('3months')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  billingPeriod === '3months'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>3 Months ($10 total)</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  Popular
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 2 Core Plans: Free (3 Templates) vs Pro (5 Templates) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-stretch">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-purple-900/10 via-purple-900/5 to-transparent dark:from-purple-950/40 dark:to-slate-900 border-2 border-purple-500 shadow-xl shadow-purple-500/10 md:-translate-y-1'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs uppercase font-extrabold tracking-wider px-4 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {plan.templateLimit}
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[32px]">
                  {plan.tagline}
                </p>

                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 dark:text-white">
                      {plan.priceLabel}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {plan.periodLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {plan.platformFee}
                    </span>
                    {plan.trialBadge && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {plan.trialBadge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">What is included:</p>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className={i === 0 ? 'font-bold text-slate-900 dark:text-white' : ''}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  to={plan.ctaLink}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center block transition shadow-md ${
                    plan.isPopular
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                  }`}
                >
                  {plan.ctaText}
                </Link>
                {plan.id === 'pro' && (
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                    15-day risk-free trial • {billingPeriod === '1month' ? 'Then $1/month' : 'Then $10 for 3 months'} • Cancel anytime
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Super Clean Comparison Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <h3 className="text-xl font-black mb-6 text-center text-slate-900 dark:text-white">
            Plan Comparison
          </h3>
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase text-slate-400 font-bold">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Free Plan</th>
                <th className="py-3 px-4 text-purple-600 dark:text-purple-400 font-extrabold">Creator Pro ($1/mo or $10/3mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold">Templates Hosted Limit</td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Up to 3 Templates</td>
                <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">Up to 5 Templates</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">Pricing Terms</td>
                <td className="py-3.5 px-4">$0 Free</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">$1 for 1 Month / $10 for 3 Months</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">Free Trial</td>
                <td className="py-3.5 px-4 text-slate-400">—</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">15 Days Free Trial</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">Platform Fee</td>
                <td className="py-3.5 px-4">5%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">0% Platform Fee</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">Drag & Drop Image Uploads</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">Included (Avatar & Thumbnails)</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">Included (High-res & Banner)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">Custom Domain</td>
                <td className="py-3.5 px-4 text-slate-400">—</td>
                <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">Included</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">Stripe & Razorpay Payments</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">✓</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
