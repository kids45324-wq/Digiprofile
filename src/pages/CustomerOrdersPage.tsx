import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Download, 
  FileText, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const CustomerOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || 'customer@example.com');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchCustomerOrders = async (targetEmail: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const results = await api.getOrders({ customerEmail: targetEmail });
      setOrders(results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchCustomerOrders(email);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) fetchCustomerOrders(email);
  };

  const handleDownload = (order: Order) => {
    const link = document.createElement('a');
    link.href = `/api/download/${order.downloadToken}`;
    link.setAttribute('download', 'digital-product.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Customer Digital Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Access and re-download all your purchased ebooks, courses, templates, and digital assets anytime.
          </p>
        </div>

        {/* Email Lookup Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter purchase email address..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-purple-600/20"
          >
            Find Orders
          </button>
        </form>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">Retrieving your digital purchases...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
            <p className="font-bold text-sm">No purchases found for this email</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Try searching with <code className="text-purple-600 font-bold">customer@example.com</code> or complete a test checkout.
            </p>
            <Link
              to="/explore"
              className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold inline-block"
            >
              Browse Digital Storefronts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Showing {orders.length} purchased product(s) for <strong>{email}</strong></span>
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified DRM Signed Links
              </span>
            </div>

            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {order.productTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By creator <Link to={`/${order.creatorUsername}`} className="text-purple-600 font-semibold hover:underline">@{order.creatorUsername}</Link> • Paid ${order.amount} USD
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownload(order)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/20 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download Asset
                  </button>
                  <Link
                    to={`/order-success/${order.id}`}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition text-xs font-semibold"
                    title="View Receipt"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
