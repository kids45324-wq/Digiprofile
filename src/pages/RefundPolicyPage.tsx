import React from 'react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-black">Digital Refund Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: January 1, 2026</p>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Nature of Digital Goods</h2>
            <p>
              Due to the immediate, irrevocable nature of digital downloads (such as PDF files, code repositories, design systems, and video tutorials), items marked as downloaded are generally considered non-refundable once the signed decryption link has been accessed.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Defective or Corrupt Files</h2>
            <p>
              If a downloadable archive is proven to be corrupted, incomplete, or significantly different from the creator's item description, customers are eligible for a replacement file or full refund within 14 days of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Creator Discretion</h2>
            <p>
              Individual creators on DigiProfile have the autonomy to offer a 30-day money-back satisfaction guarantee on their courses and digital products. If a creator specifies a guarantee on their product details page, DigiProfile will honor that refund upon request.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Requesting a Refund</h2>
            <p>
              To initiate a refund review, contact support@digiprofile.com with your Order Reference Number (e.g., DGP-2026-XXXX) and transaction ID.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
