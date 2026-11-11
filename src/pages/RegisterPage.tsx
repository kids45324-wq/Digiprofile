import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Lock, Mail, User, ArrowRight, CheckCircle2, Globe, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanHandle = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cleanHandle || cleanHandle.length < 3) {
      setError('Username must be at least 3 alphanumeric characters.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, cleanHandle, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different username or email.');
    } finally {
      setLoading(false);
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
          Create Your Creator Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Claim your unique URL and launch your digital store in 2 minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name or Brand
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Taylor Morgan"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

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
                  placeholder="taylor@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Choose Profile Handle
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="yourname"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white font-mono"
                />
              </div>
              {cleanHandle && (
                <p className="mt-1.5 text-xs text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> digiprofile.com/{cleanHandle}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <span>
                  I agree to the <Link to="/terms" className="underline text-purple-600">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="underline text-purple-600">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 transition shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Claim Handle & Get Started Free'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
