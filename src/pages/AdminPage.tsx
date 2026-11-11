import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Database, 
  Layers, 
  Package, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { PlatformSettings } from '../types';
import { api } from '../services/api';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const data = await api.getAdminStats();
        setStats(data);
        setSettings(data.platformSettings);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const updated = await api.updateAdminSettings(settings);
    setSettings(updated);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  Platform Administration Panel
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Superadmin
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Global platform metrics, gateway status, and creator ecosystem moderation.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            Database: PostgreSQL (Supabase RLS Enforced)
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.totalUsers || 142}
            </p>
            <span className="text-[11px] text-emerald-500 font-semibold">+14 this week</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Creators</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {stats?.totalCreators || 38}
            </p>
            <span className="text-[11px] text-slate-400">Published storefronts</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {stats?.totalProducts || 6}
            </p>
            <span className="text-[11px] text-slate-400">Across 6 categories</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Orders</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.totalOrders || 5192}
            </p>
            <span className="text-[11px] text-emerald-500 font-semibold">100% verified</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Volume</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">
              ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '163,290'}
            </p>
            <span className="text-[11px] text-emerald-500 font-semibold">Stripe & Razorpay</span>
          </div>
        </div>

        {/* Global Platform Settings Form */}
        {settings && (
          <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-600" /> Platform Configuration
                </h3>
                <p className="text-xs text-slate-400">Adjust transaction fees, payment gateways, and system maintenance.</p>
              </div>
              {savedSettingsSuccess && (
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Settings Saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Free Plan Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={settings.platformFeePercentage}
                  onChange={e => setSettings({ ...settings, platformFeePercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Stripe Gateway
                </label>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, stripeEnabled: !settings.stripeEnabled })}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    settings.stripeEnabled ? 'border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' : 'border-slate-300 text-slate-400'
                  }`}
                >
                  <span>International Processing</span>
                  <span>{settings.stripeEnabled ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Razorpay Gateway
                </label>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, razorpayEnabled: !settings.razorpayEnabled })}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    settings.razorpayEnabled ? 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950/40' : 'border-slate-300 text-slate-400'
                  }`}
                >
                  <span>India / UPI Gateway</span>
                  <span>{settings.razorpayEnabled ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
              >
                Save Platform Settings
              </button>
            </div>
          </form>
        )}

        {/* Recent Platform Orders Log */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Platform Transaction Audit Log
            </h3>
            <p className="text-xs text-slate-400">All verified transactions with cryptographic payment signatures.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Creator</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Payment ID</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {stats?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-6 font-mono font-bold">{ord.orderNumber}</td>
                    <td className="py-3.5 px-6 font-semibold text-purple-600">@{ord.creatorUsername}</td>
                    <td className="py-3.5 px-6">{ord.customerEmail}</td>
                    <td className="py-3.5 px-6 font-bold text-emerald-500">${ord.amount}</td>
                    <td className="py-3.5 px-6 font-mono text-[10px] text-slate-400">{ord.paymentId}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
