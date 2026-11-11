import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  BarChart3, 
  Palette, 
  Settings as SettingsIcon, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  DollarSign, 
  Eye, 
  ArrowUpRight, 
  Trash2, 
  Edit3, 
  Check, 
  CheckCircle2, 
  Copy, 
  Globe, 
  Upload, 
  FileText, 
  Download, 
  RefreshCw, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { DigitalProduct, Order, ProductCategory, ProfileAppearance } from '../types';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const { user, creator, updateCreatorProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Appearance state for live profile builder
  const [appearance, setAppearance] = useState<ProfileAppearance>(
    creator?.appearance || {
      theme: 'deep-purple',
      primaryColor: '#7c3aed',
      secondaryColor: '#3b82f6',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      cardStyle: 'glass',
      buttonStyle: 'rounded',
      fontFamily: 'sans',
      productDisplay: 'grid',
    }
  );

  // New product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Templates' as ProductCategory,
    price: 29,
    discountPrice: 19,
    isFree: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    fileName: 'digital-resource.zip',
    features: ['Instant Download', 'Lifetime Access', 'Free Updates'],
    status: 'published' as 'published' | 'draft',
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: creator?.displayName || '',
    tagline: creator?.tagline || '',
    bio: creator?.bio || '',
    location: creator?.location || '',
    website: creator?.website || '',
    contactEmail: creator?.contactEmail || '',
    avatarUrl: creator?.avatarUrl || '',
    coverUrl: creator?.coverUrl || '',
  });

  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  useEffect(() => {
    if (creator) {
      setAppearance(creator.appearance);
      setProfileForm({
        displayName: creator.displayName,
        tagline: creator.tagline,
        bio: creator.bio,
        location: creator.location,
        website: creator.website,
        contactEmail: creator.contactEmail,
        avatarUrl: creator.avatarUrl,
        coverUrl: creator.coverUrl,
      });
    }
  }, [creator]);

  const loadData = async () => {
    setLoading(true);
    try {
      const username = creator?.username || 'alexrivera';
      const [prods, ords, stats] = await Promise.all([
        api.getProducts({ creator: username }),
        api.getOrders({ creator: username }),
        api.getCreatorAnalytics(username),
      ]);
      setProducts(prods);
      setOrders(ords);
      setAnalytics(stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [creator]);

  const handleCopyProfileUrl = () => {
    const url = `${window.location.origin}/${creator?.username || 'alexrivera'}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCreatorProfile({
      ...profileForm,
      appearance,
    });
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleSaveAppearance = async () => {
    await updateCreatorProfile({ appearance });
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title) return;

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
      });
    } else {
      await api.createProduct({
        ...productForm,
        creatorUsername: creator?.username || 'alexrivera',
        creatorId: creator?.id || 'creator_alex',
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
      });
    }
    setShowProductModal(false);
    setEditingProduct(null);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      loadData();
    }
  };

  const openEditProduct = (prod: DigitalProduct) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      description: prod.description,
      shortDescription: prod.shortDescription,
      category: prod.category,
      price: prod.price,
      discountPrice: prod.discountPrice || 0,
      isFree: prod.isFree,
      thumbnailUrl: prod.thumbnailUrl,
      fileName: prod.fileName,
      features: prod.features,
      status: prod.status as 'published' | 'draft',
    });
    setShowProductModal(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Templates',
      price: 29,
      discountPrice: 19,
      isFree: false,
      thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      fileName: 'design-package.zip',
      features: ['Instant Download', 'Commercial License', 'Lifetime Access'],
      status: 'published',
    });
    setShowProductModal(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'products', label: 'Products & Store', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'appearance', label: 'Profile Builder', icon: Palette },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Creator Profile Summary in Sidebar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={creator?.avatarUrl || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt="Creator Avatar"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500 shadow-sm"
              />
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm truncate text-slate-900 dark:text-white">
                  {creator?.displayName || user?.name}
                </h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-mono truncate">
                  @{creator?.username || user?.username}
                </p>
              </div>
            </div>

            {/* Quick Share Link */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleCopyProfileUrl}
                className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <Link
                to={`/${creator?.username || 'alexrivera'}`}
                target="_blank"
                className="p-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg transition"
                title="View live public profile"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Plan status badge in bottom sidebar */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-purple-900/10 to-indigo-900/10 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white capitalize">
              {creator?.subscriptionPlan || 'Pro'} Plan
            </span>
            <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-extrabold uppercase">
              $1/mo
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            15-Day Free Trial • 0% platform fee
          </p>
          <Link
            to="/pricing"
            className="mt-2 block font-bold text-purple-600 dark:text-purple-400 hover:underline text-[11px]"
          >
            Manage Subscription ($1/mo) →
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* =========================================================
            TAB 1: OVERVIEW
            ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Overview Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Welcome back, {creator?.displayName || user?.name}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Here is how your profile and digital products are performing today.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openNewProduct}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/25 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Digital Product
                </button>
              </div>
            </div>

            {/* 5 KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ${creator?.totalRevenue || analytics?.totalRevenue || 54890}
                </div>
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% this month
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingCart className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {orders.length || creator?.totalSales || 1842}
                </div>
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12 new this week
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
                  <Package className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {products.length}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  {products.filter(p => p.status === 'published').length} published active
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Visitors</span>
                  <Eye className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {creator?.totalViews || 84300}
                </div>
                <span className="text-[11px] text-purple-500 font-semibold mt-1 block">
                  3.4k unique visits / day
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Conversion</span>
                  <BarChart3 className="w-4 h-4 text-teal-500" />
                </div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  {analytics?.conversionRate || 5.92}%
                </div>
                <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">
                  High performing
                </span>
              </div>
            </div>

            {/* Sales Chart Simulation & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Chart Box */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Weekly Revenue & Order Trends
                    </h3>
                    <p className="text-xs text-slate-400">Past 7 days performance</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                    Gross: $2,530.00
                  </span>
                </div>

                {/* Bar chart visualization */}
                <div className="h-48 flex items-end gap-3 sm:gap-6 pt-8 pb-2 border-b border-slate-100 dark:border-slate-800">
                  {[
                    { day: 'Mon', h: '35%', val: '$120' },
                    { day: 'Tue', h: '60%', val: '$280' },
                    { day: 'Wed', h: '45%', val: '$190' },
                    { day: 'Thu', h: '85%', val: '$410' },
                    { day: 'Fri', h: '70%', val: '$350' },
                    { day: 'Sat', h: '95%', val: '$520' },
                    { day: 'Sun', h: '100%', val: '$640' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-7 text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow">
                        {bar.val}
                      </div>
                      <div
                        style={{ height: bar.h }}
                        className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg group-hover:from-purple-500 group-hover:to-indigo-400 transition"
                      />
                      <span className="text-[11px] font-semibold text-slate-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Selling Products */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                    Best-Selling Products
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Ranked by volume</p>

                  <div className="space-y-3">
                    {products.slice(0, 3).map((prod, index) => (
                      <div key={prod.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 max-w-[170px]">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-purple-600">
                            #{index + 1}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {prod.title}
                          </span>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {prod.salesCount} sold
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSearchParams({ tab: 'products' })}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Recent Customer Orders
                  </h3>
                  <p className="text-xs text-slate-400">Verified and delivered orders</p>
                </div>
                <button
                  onClick={() => setSearchParams({ tab: 'orders' })}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-6">Order ID</th>
                      <th className="py-3 px-6">Customer</th>
                      <th className="py-3 px-6">Product</th>
                      <th className="py-3 px-6">Amount</th>
                      <th className="py-3 px-6">Gateway</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {orders.slice(0, 5).map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-6 font-mono font-semibold">{ord.orderNumber}</td>
                        <td className="py-3.5 px-6">
                          <p className="font-semibold text-slate-900 dark:text-white">{ord.customerName}</p>
                          <p className="text-[11px] text-slate-400">{ord.customerEmail}</p>
                        </td>
                        <td className="py-3.5 px-6 font-medium max-w-xs truncate">{ord.productTitle}</td>
                        <td className="py-3.5 px-6 font-bold text-emerald-500">${ord.amount}</td>
                        <td className="py-3.5 px-6 uppercase font-mono text-[10px]">{ord.paymentMethod}</td>
                        <td className="py-3.5 px-6">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
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
        )}

        {/* =========================================================
            TAB 2: MY PROFILE
            ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile Details</h1>
              <p className="text-xs text-slate-400">Configure your public bio, social links, and contact channels.</p>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Profile details saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profileForm.displayName}
                    onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Username Handle</label>
                  <input
                    type="text"
                    disabled
                    value={creator?.username || user?.username}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-sm font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tagline</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  placeholder="e.g. Design Systems Architect & Educator"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bio Description</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={profileForm.contactEmail}
                    onChange={e => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={profileForm.avatarUrl}
                    onChange={e => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={profileForm.coverUrl}
                    onChange={e => setProfileForm({ ...profileForm, coverUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
                >
                  Save Profile Info
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================
            TAB 3: PRODUCTS & DIGITAL STORE
            ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Digital Products & Store
                </h1>
                <p className="text-xs text-slate-400">
                  Manage your ebooks, courses, templates, and digital downloads.
                </p>
              </div>
              <button
                onClick={openNewProduct}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Upload New Product
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(prod => (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 relative bg-slate-800">
                      <img src={prod.thumbnailUrl} alt={prod.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase">
                        {prod.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-purple-600 px-2.5 py-1 rounded-full text-xs font-black text-white shadow">
                        {prod.isFree ? 'FREE' : `$${prod.discountPrice || prod.price}`}
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {prod.shortDescription || prod.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span>{prod.salesCount} sales</span>
                        <span className="font-mono text-[11px] text-purple-500 font-semibold">{prod.fileName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      to={`/${creator?.username || 'alexrivera'}/product/${prod.id}`}
                      target="_blank"
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditProduct(prod)}
                        className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-200 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: ORDERS
            ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Orders</h1>
                <p className="text-xs text-slate-400">All completed digital purchases and secure download tokens.</p>
              </div>
              <button onClick={loadData} className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-6">Order ID</th>
                      <th className="py-3 px-6">Customer</th>
                      <th className="py-3 px-6">Item</th>
                      <th className="py-3 px-6">Amount</th>
                      <th className="py-3 px-6">Gateway</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Downloads</th>
                      <th className="py-3 px-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {orders.map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                          {ord.orderNumber}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-900 dark:text-white">{ord.customerName}</p>
                          <p className="text-[11px] text-slate-400">{ord.customerEmail}</p>
                        </td>
                        <td className="py-4 px-6 max-w-xs truncate font-medium">{ord.productTitle}</td>
                        <td className="py-4 px-6 font-bold text-emerald-500">${ord.amount}</td>
                        <td className="py-4 px-6 uppercase font-mono text-[10px]">{ord.paymentMethod}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {ord.downloadCount}/{ord.maxDownloads}
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CUSTOMERS
            ========================================================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Database</h1>
            <p className="text-xs text-slate-400">Every buyer who purchased your digital products.</p>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="space-y-4">
                {[
                  { name: 'Jordan Lee', email: 'customer@example.com', spent: 58, orders: 2, date: 'Feb 10, 2026' },
                  { name: 'Elena Scott', email: 'elena.scott@designco.com', spent: 19, orders: 1, date: 'Feb 11, 2026' },
                  { name: 'Devon Miller', email: 'devon.m@techstartup.io', spent: 79, orders: 1, date: 'Feb 11, 2026' },
                ].map((cust, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{cust.name}</h4>
                        <p className="text-slate-400">{cust.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 dark:text-white">${cust.spent} Total Spent</p>
                      <p className="text-slate-400 text-[11px]">{cust.orders} order(s) • Last: {cust.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: PAYMENTS
            ========================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Payment Gateways & Payouts</h1>
              <p className="text-xs text-slate-400">Configure Stripe and Razorpay credentials for direct customer settlements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stripe Box */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Stripe Connect</h4>
                      <p className="text-[11px] text-slate-400">Global cards, Apple Pay, Google Pay</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-[10px] font-extrabold">
                    CONNECTED
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Payouts are automatically wired directly to your designated bank account every rolling 48 hours.
                </p>
                <div className="pt-2 text-xs">
                  <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 transition">
                    View Stripe Dashboard
                  </button>
                </div>
              </div>

              {/* Razorpay Box */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                      R
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Razorpay India</h4>
                      <p className="text-[11px] text-slate-400">UPI, NetBanking, RuPay & Cards</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-[10px] font-extrabold flex items-center gap-1">
                    <Check className="w-3 h-3" /> CONNECTED & VERIFIED
                  </span>
                </div>
                
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Key ID:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">rzp_test_TyqHne0jnrPbXS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Secret:</span>
                    <span className="text-slate-500">•••••••••••••••••••••••• (Active)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct settlement for Indian UPI payments and international cards with cryptographic HMAC-SHA256 verification.
                </p>
                <div className="pt-1 text-xs">
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ready for checkout payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 7: ANALYTICS
            ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Deep Sales & Traffic Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Traffic by Device</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Mobile (iOS / Android)</span>
                      <span className="font-bold text-slate-900 dark:text-white">58%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[58%] h-full bg-purple-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Desktop & Laptop</span>
                      <span className="font-bold text-slate-900 dark:text-white">38%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[38%] h-full bg-blue-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Tablets</span>
                      <span className="font-bold text-slate-900 dark:text-white">4%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[4%] h-full bg-teal-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Sales by Category</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Templates & UI Kits</span>
                      <span className="font-bold text-slate-900 dark:text-white">40%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[40%] h-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Ebooks & Guides</span>
                      <span className="font-bold text-slate-900 dark:text-white">30%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[30%] h-full bg-amber-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Online Courses</span>
                      <span className="font-bold text-slate-900 dark:text-white">20%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[20%] h-full bg-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Top Referrers</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Twitter / X</span>
                    <span className="font-bold text-purple-600">42% of sales</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">YouTube Bio Links</span>
                    <span className="font-bold text-purple-600">31% of sales</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Newsletter (Substack)</span>
                    <span className="font-bold text-purple-600">18% of sales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 8: APPEARANCE (LIVE PROFILE BUILDER!)
            ========================================================= */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile Studio Builder</h1>
                <p className="text-xs text-slate-400">Live split-screen customizer with instant smartphone preview.</p>
              </div>
              <button
                onClick={handleSaveAppearance}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
              >
                Save Theme Changes
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls on Left */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Theme Presets</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'deep-purple', name: 'Deep Purple', bg: '#0f172a', p: '#7c3aed', s: '#3b82f6' },
                      { id: 'electric-blue', name: 'Electric Blue', bg: '#0b1329', p: '#2563eb', s: '#06b6d4' },
                      { id: 'emerald-green', name: 'Emerald Forest', bg: '#062017', p: '#10b981', s: '#059669' },
                      { id: 'sunset-amber', name: 'Sunset Glow', bg: '#1c1917', p: '#ea580c', s: '#f59e0b' },
                      { id: 'cyberpunk-dark', name: 'Cyber Dark', bg: '#000000', p: '#ec4899', s: '#8b5cf6' },
                      { id: 'clean-minimal', name: 'Clean White', bg: '#ffffff', p: '#18181b', s: '#71717a' },
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAppearance({
                          ...appearance,
                          theme: t.id as any,
                          backgroundColor: t.bg,
                          primaryColor: t.p,
                          secondaryColor: t.s,
                          textColor: t.bg === '#ffffff' ? '#0f172a' : '#ffffff',
                        })}
                        className={`p-3 rounded-2xl border text-left transition ${
                          appearance.theme === t.id
                            ? 'border-purple-600 ring-2 ring-purple-600/30 font-bold'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex gap-1.5 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.p }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.s }} />
                          <div className="w-4 h-4 rounded-full border border-slate-400" style={{ backgroundColor: t.bg }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Card Style</label>
                    <select
                      value={appearance.cardStyle}
                      onChange={e => setAppearance({ ...appearance, cardStyle: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="rounded">Soft Rounded</option>
                      <option value="glass">Glassmorphic Blur</option>
                      <option value="bordered">Crisp Bordered</option>
                      <option value="neubrutalist">Neo-Brutalist Pop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Button Shape</label>
                    <select
                      value={appearance.buttonStyle}
                      onChange={e => setAppearance({ ...appearance, buttonStyle: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="rounded">Rounded Corners</option>
                      <option value="pill">Pill Shaped</option>
                      <option value="sharp">Sharp Edges</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Typography Font</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['sans', 'serif', 'mono'].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setAppearance({ ...appearance, fontFamily: f as any })}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase ${
                          appearance.fontFamily === f ? 'border-purple-600 bg-purple-50 dark:bg-purple-950 text-purple-600' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Smartphone Mockup on Right */}
              <div className="lg:col-span-5 flex justify-center sticky top-20">
                <div className="w-[340px] h-[640px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
                  {/* Phone notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ml-6" />
                  </div>

                  {/* Inside phone preview container */}
                  <div
                    style={{
                      backgroundColor: appearance.backgroundColor,
                      color: appearance.textColor,
                    }}
                    className="w-full h-full rounded-[34px] overflow-y-auto p-4 pt-10 text-center font-sans scrollbar-none transition-colors"
                  >
                    <img
                      src={creator?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full mx-auto object-cover shadow"
                      style={{ boxShadow: `0 0 0 4px ${appearance.primaryColor}` }}
                    />
                    <h3 className="font-extrabold text-sm mt-2 flex items-center justify-center gap-1">
                      {creator?.displayName || 'Alex Rivera'}
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: appearance.primaryColor }} />
                    </h3>
                    <p className="text-[11px] opacity-80 line-clamp-1">{creator?.tagline || 'Design Systems Creator'}</p>

                    {/* Simulated Links */}
                    <div className="mt-4 space-y-2">
                      <div
                        style={{ backgroundColor: `${appearance.primaryColor}25`, borderColor: appearance.primaryColor }}
                        className="p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between"
                      >
                        <span>Free UI Checklist (2026)</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                      <div
                        style={{ backgroundColor: `${appearance.primaryColor}25`, borderColor: appearance.primaryColor }}
                        className="p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between"
                      >
                        <span>Weekly Newsletter</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Products preview */}
                    <div className="mt-5 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-2">Featured Products</p>
                      <div className="space-y-2">
                        {products.slice(0, 2).map(p => (
                          <div
                            key={p.id}
                            className="p-2 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-between text-xs"
                          >
                            <span className="truncate pr-2 font-semibold text-[11px]">{p.title}</span>
                            <span
                              style={{ backgroundColor: appearance.primaryColor }}
                              className="px-2 py-0.5 rounded-lg text-white font-bold text-[10px]"
                            >
                              ${p.discountPrice || p.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 9: SETTINGS
            ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Account Settings</h1>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Custom Domain Mapping</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Map your root domain (e.g., alexrivera.design) to your DigiProfile. Point a CNAME record to <code className="text-purple-500 font-mono">cname.digiprofile.com</code>.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="store.yourdomain.com"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
                  Connect Domain
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Email Notifications</h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  <span>Send me an instant email when a customer purchases a product</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  <span>Weekly digest of sales and visitor conversion</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Add or Edit Digital Product */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
              {editingProduct ? 'Edit Digital Product' : 'Add New Digital Product'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Fill in product details and attach your downloadable file.
            </p>

            <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={e => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. Complete Figma Design System 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Templates">Templates</option>
                    <option value="Ebooks">Ebooks</option>
                    <option value="PDF Files">PDF Files</option>
                    <option value="Online Courses">Online Courses</option>
                    <option value="Digital Downloads">Digital Downloads</option>
                    <option value="Other Digital Products">Other Digital Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                  <select
                    value={productForm.status}
                    onChange={e => setProductForm({ ...productForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="published">Published (Active)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Discount Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.discountPrice}
                    onChange={e => setProductForm({ ...productForm, discountPrice: Number(e.target.value) })}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed breakdown of what buyers receive..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={productForm.thumbnailUrl}
                  onChange={e => setProductForm({ ...productForm, thumbnailUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              {/* Digital File Upload Simulation */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300 mb-2">
                  <Upload className="w-4 h-4 text-purple-600" /> Secure Digital Download File (Private Storage)
                </div>
                <input
                  type="text"
                  value={productForm.fileName}
                  onChange={e => setProductForm({ ...productForm, fileName: e.target.value })}
                  placeholder="e.g. ui-kit-v2.zip or course-material.pdf"
                  className="w-full px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
                <span className="text-[10px] text-purple-700 dark:text-purple-400 mt-1 block">
                  Files are stored in private Supabase Storage buckets with encrypted signed download URLs.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
                >
                  {editingProduct ? 'Save Changes' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
