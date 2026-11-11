import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-black">Terms & Conditions</h1>
        <p className="text-xs text-slate-400">Last Revised: January 1, 2026</p>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By signing up for an account, building a creator storefront, or purchasing goods via DigiProfile, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Permitted Digital Goods</h2>
            <p>
              Creators may sell original ebooks, course materials, design systems, software, audio packs, and templates. Selling malware, infringing copyrighted works, or non-consensual media is strictly prohibited and results in immediate account termination.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Platform Fees & Payouts</h2>
            <p>
              Free accounts are subject to a 5% platform fee per transaction. Pro and Business accounts enjoy 0% platform fees. Payment processing fees from Stripe and Razorpay apply independently to all transactions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Digital License Grant</h2>
            <p>
              Unless otherwise specified by the creator, the purchase of a digital product grants the buyer a personal, revocable, non-exclusive license to download and utilize the asset.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
