import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-black">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Information We Collect</h2>
            <p>
              When you register for DigiProfile, create a storefront, or purchase digital products, we collect information including your name, email address, chosen handle, payment transaction IDs, and IP addresses for fraud prevention and DRM enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Payment Security & Processing</h2>
            <p>
              We do not store complete credit card or debit card numbers on our servers. All financial transactions are securely tokenized and processed through PCI-DSS Level 1 certified gateways: Stripe Inc. and Razorpay Software Private Limited.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Digital Download Tracking</h2>
            <p>
              To protect creators' intellectual property against piracy, we record download counts, IP locations, and user-agent details for each generated download token.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Your Data Rights</h2>
            <p>
              Under GDPR and CCPA regulations, you have the right to request access to, correction of, or permanent deletion of your account and personal data at any time by contacting privacy@digiprofile.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
