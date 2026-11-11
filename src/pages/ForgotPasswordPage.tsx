import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-purple-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            DigiProfile
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Reset Your Password
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-200 dark:border-slate-800">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If an account exists for <strong className="text-slate-800 dark:text-white">{email}</strong>, a secure reset link has been dispatched to your inbox.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition text-xs block text-center"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 text-sm mt-2"
              >
                Send Reset Link
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
