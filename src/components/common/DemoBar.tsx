import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Shield, User, ShoppingBag, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoBar: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white text-xs py-1.5 px-3 border-b border-purple-500/20 shadow-inner flex items-center justify-between flex-wrap gap-2 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold tracking-wide text-purple-200">Sandbox Test Mode:</span>
        <span className="text-slate-300 hidden sm:inline">Active User:</span>
        <span className="font-medium bg-white/10 px-2 py-0.5 rounded text-white flex items-center gap-1">
          {user?.name || 'Guest'} ({user?.role || 'Guest'})
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-slate-400 mr-1 hidden md:inline">Quick Switch:</span>
        <button
          onClick={() => switchDemoUser('creator')}
          className={`px-2 py-0.5 rounded transition font-medium flex items-center gap-1 ${
            user?.username === 'alexrivera' ? 'bg-purple-600 text-white font-semibold' : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-300" /> Alex (Creator)
        </button>
        <button
          onClick={() => switchDemoUser('sarah')}
          className={`px-2 py-0.5 rounded transition font-medium flex items-center gap-1 ${
            user?.username === 'sarahchen' ? 'bg-blue-600 text-white font-semibold' : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-blue-300" /> Sarah (Business)
        </button>
        <button
          onClick={() => switchDemoUser('admin')}
          className={`px-2 py-0.5 rounded transition font-medium flex items-center gap-1 ${
            user?.role === 'admin' ? 'bg-amber-600 text-white font-semibold' : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          <Shield className="w-3 h-3 text-amber-300" /> Admin
        </button>
        <button
          onClick={() => switchDemoUser('customer')}
          className={`px-2 py-0.5 rounded transition font-medium flex items-center gap-1 ${
            user?.role === 'customer' ? 'bg-emerald-600 text-white font-semibold' : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          <ShoppingBag className="w-3 h-3 text-emerald-300" /> Customer
        </button>

        <Link
          to="/my-orders"
          className="ml-2 underline text-purple-300 hover:text-white hidden lg:inline"
        >
          My Downloads
        </Link>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-0.5 ml-1"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
