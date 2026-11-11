import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      tagline: 'Ideal for new creators launching their first digital download.',
      priceMonthly: 0,
      priceYearly: 0,
      platformFee: '5% platform fee',
      features: [
        '1 Creator Profile (digiprofile.com/username)',
        'Up to 3 Digital Products',
        'Standard Profile Themes',
        'Direct Stripe & Razorpay Checkout',
        'Automated Secure File Delivery',
        'Basic Visitor & Sales Analytics',
        'Community Support'
      ],
      ctaText: 'Start Free Today',
      isPopular: false,
      ctaLink: '/register',
    },
    {
      id: 'pro',
      name: 'Creator Pro',
      tagline: 'For ambitious creators looking to scale their digital catalog with 15-day risk-free access for just $1/month.',
      priceMonthly: 1,
      priceYearly: 1,
      platformFee: '0% platform fee',
      features: [
        '15-Day Free Trial Included',
        'Unlimited Digital Products & Storefronts',
        'All Premium Themes & Visual Customizations',
        'Custom Domain Mapping (yourname.com)',
        'Advanced Analytics & Conversion Tracking',
        'Remove DigiProfile Branding',
        'Discount Coupons & Promo Engine',
        'Priority Customer Support'
      ],
      ctaText: user ? 'Upgrade to Pro ($1/mo)' : 'Start 15-Day Free Trial',
      isPopular: true,
      trialBadge: '15-Day Free Trial',
      ctaLink: user ? '/dashboard?tab=settings' : '/register?plan=pro',
    },
    {
      id: 'business',
      name: 'Business & Agency',
      tagline: 'For established digital entrepreneurs, coaches, and studios.',
      priceMonthly: 49,
      priceYearly: 39,
      platformFee: '0% platform fee',
      features: [
        'Everything in Pro, plus:',
        'Multiple Creator Profiles & Stores',
        'Advanced CSS & Head Code Injection',
        'Team Member Access (Up to 5 Users)',
        'Private Discord / VIP Slack Channel',
        'Dedicated Account Manager',
        'Webhook & API Integrations',
        '99.9% Uptime SLA'
      ],
      ctaText: user ? 'Upgrade to Business' : 'Contact Sales / Get Started',
      isPopular: false,
      ctaLink: user ? '/dashboard?tab=settings' : '/register?plan=business',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, Creator-Friendly Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Predictable Plans. Zero Hidden Surprises.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Start completely free, and upgrade as your digital product catalog and audience expand.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-purple-600 rounded-full p-1 relative transition flex items-center"
              aria-label="Toggle billing cycle"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Yearly
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {plans.map(plan => {
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 relative ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-purple-900/10 via-purple-900/5 to-transparent dark:from-purple-950/40 dark:to-slate-900 border-2 border-purple-500 shadow-xl shadow-purple-500/10 lg:-translate-y-2'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs uppercase font-extrabold tracking-wider px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[36px]">
                    {plan.tagline}
                  </p>

                  <div className="my-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                        ${price}
                      </span>
                      {price > 0 && (
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          / month
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {plan.platformFee}
                      </p>
                      {plan.id === 'pro' && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          15 Days Free Trial
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Features Included:</p>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className={i === 0 && plan.id !== 'free' ? 'font-semibold text-purple-600 dark:text-purple-400' : ''}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    to={plan.ctaLink}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center block transition shadow-md ${
                      plan.isPopular
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                  {plan.id === 'pro' && (
                    <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                      15 days risk-free trial • Then $1/month • Cancel anytime
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <h3 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
            Detailed Feature Comparison
          </h3>
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-400">
                <th className="py-3 px-4 font-bold">Feature</th>
                <th className="py-3 px-4 font-bold">Free</th>
                <th className="py-3 px-4 font-bold text-purple-600 dark:text-purple-400">Pro</th>
                <th className="py-3 px-4 font-bold">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-medium">Digital Products Allowed</td>
                <td className="py-3.5 px-4">Up to 3</td>
                <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">Unlimited</td>
                <td className="py-3.5 px-4 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">Platform Fee</td>
                <td className="py-3.5 px-4">5%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">0%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">0%</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">Payment Gateways</td>
                <td className="py-3.5 px-4">Stripe & Razorpay</td>
                <td className="py-3.5 px-4">Stripe & Razorpay</td>
                <td className="py-3.5 px-4">Stripe & Razorpay + Custom</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">Custom Domain (yourname.com)</td>
                <td className="py-3.5 px-4 text-slate-400">—</td>
                <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">Included</td>
                <td className="py-3.5 px-4 font-bold">Included (Multiple)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">Temporary Signed Downloads</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">✓</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">✓</td>
                <td className="py-3.5 px-4 font-bold text-emerald-500">✓</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium">Discount Coupon Generator</td>
                <td className="py-3.5 px-4 text-slate-400">—</td>
                <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">Included</td>
                <td className="py-3.5 px-4 font-bold">Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
