import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Globe, 
  Mail, 
  ExternalLink, 
  ShoppingBag, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  ArrowUpRight,
  Store,
  ArrowRight
} from 'lucide-react';
import { CreatorProfile, DigitalProduct } from '../types';
import { api } from '../services/api';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'store' | 'about'>('all');

  useEffect(() => {
    async function fetchCreator() {
      if (!username) return;
      setLoading(true);
      try {
        const data = await api.getCreator(username);
        if (data) {
          setCreator(data.creator);
          setProducts(data.products);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCreator();
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-4">
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <h2 className="text-2xl font-extrabold mb-2">Creator Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            The profile for <code className="text-purple-600 font-bold">@{username}</code> doesn't exist or is currently private.
          </p>
          <Link
            to="/explore"
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow"
          >
            Explore Other Creators <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const app = creator.appearance || {
    theme: 'deep-purple',
    primaryColor: '#7c3aed',
    secondaryColor: '#3b82f6',
    backgroundColor: '#0f172a',
    textColor: '#ffffff',
    cardStyle: 'glass',
    buttonStyle: 'rounded',
    fontFamily: 'sans',
    productDisplay: 'grid',
  };

  const getButtonRadius = () => {
    if (app.buttonStyle === 'pill') return 'rounded-full';
    if (app.buttonStyle === 'sharp') return 'rounded-none';
    return 'rounded-2xl';
  };

  const getCardStyleClass = () => {
    if (app.cardStyle === 'glass') return 'bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl';
    if (app.cardStyle === 'bordered') return 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-sm';
    if (app.cardStyle === 'neubrutalist') return 'bg-white dark:bg-slate-900 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
    return 'bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-md';
  };

  return (
    <div
      style={{
        backgroundColor: app.backgroundColor,
        color: app.textColor,
      }}
      className="min-h-screen transition-colors font-sans pb-24 selection:bg-purple-600 selection:text-white"
    >
      {/* Cover Banner */}
      <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-slate-900">
        <img
          src={creator.coverUrl}
          alt="Profile Cover"
          className="w-full h-full object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Share Button top right */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-bold border border-white/20 transition flex items-center gap-1.5 shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative -mt-20">
        {/* Creator Info Card */}
        <div className={`${getCardStyleClass()} ${getButtonRadius()} p-6 sm:p-8 text-center relative mb-8`}>
          {/* Avatar */}
          <div className="relative inline-block mx-auto -mt-16 sm:-mt-20 mb-4">
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-2xl"
              style={{ boxShadow: `0 0 0 4px ${app.primaryColor}` }}
            />
            {creator.isVerified && (
              <div 
                style={{ backgroundColor: app.primaryColor }}
                className="absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow"
                title="Verified DigiProfile Creator"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center gap-2">
            {creator.displayName}
          </h1>
          <p className="text-xs sm:text-sm font-semibold opacity-80 mt-1 font-mono" style={{ color: app.secondaryColor }}>
            @{creator.username}
          </p>

          <p className="text-sm sm:text-base font-medium mt-3 max-w-xl mx-auto leading-relaxed opacity-95">
            {creator.tagline}
          </p>

          <p className="text-xs sm:text-sm opacity-80 mt-2 max-w-lg mx-auto leading-relaxed">
            {creator.bio}
          </p>

          {/* Meta badges: Location & Sales */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs opacity-75">
            {creator.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {creator.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" /> {creator.totalSales} digital sales
            </span>
            {creator.website && (
              <a
                href={creator.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:underline font-semibold"
              >
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
          </div>

          {/* Social Links Icons */}
          {creator.socialLinks && creator.socialLinks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-3 flex-wrap">
              {creator.socialLinks.map(s => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 opacity-60" />
                  <span>{s.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Tab Selection (All Links / Store / About) */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold transition ${getButtonRadius()} ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 opacity-80'
            }`}
          >
            All Links & Store
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 text-xs font-bold transition ${getButtonRadius()} ${
              activeTab === 'store'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 opacity-80'
            }`}
          >
            Storefront Only ({products.length})
          </button>
        </div>

        {/* Custom Links Section */}
        {activeTab === 'all' && creator.customLinks && creator.customLinks.length > 0 && (
          <div className="space-y-3 mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 px-1">
              Quick Links & Resources
            </h3>
            {creator.customLinks.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`w-full p-4 ${getCardStyleClass()} ${getButtonRadius()} flex items-center justify-between group hover:scale-[1.01] transition-all`}
              >
                <span className="font-bold text-sm tracking-wide group-hover:underline">
                  {link.title}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ))}
          </div>
        )}

        {/* Digital Products Storefront Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Digital Storefront ({products.length} Items)
            </h3>
            <Link
              to={`/${creator.username}/store`}
              className="text-xs font-bold hover:underline flex items-center gap-1"
              style={{ color: app.secondaryColor }}
            >
              Full Store Page <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(product => (
              <div
                key={product.id}
                className={`${getCardStyleClass()} ${getButtonRadius()} overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition duration-200`}
              >
                <div>
                  <div className="h-44 relative overflow-hidden bg-slate-800">
                    <img
                      src={product.thumbnailUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      {product.category}
                    </span>
                    <span
                      style={{ backgroundColor: app.primaryColor }}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-xl text-xs font-black text-white shadow-lg"
                    >
                      {product.isFree ? 'FREE' : `$${product.discountPrice || product.price}`}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <Link
                      to={`/${creator.username}/product/${product.id}`}
                      className="font-bold text-base hover:underline line-clamp-1 block"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs opacity-75 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.shortDescription || product.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <Link
                    to={`/${creator.username}/product/${product.id}`}
                    className={`flex-1 py-2 text-center text-xs font-bold ${getButtonRadius()} bg-white/10 hover:bg-white/20 transition`}
                  >
                    Details
                  </Link>
                  <Link
                    to={`/checkout/${product.id}`}
                    style={{ backgroundColor: app.primaryColor }}
                    className={`flex-1 py-2 text-center text-xs font-extrabold text-white ${getButtonRadius()} hover:opacity-90 transition shadow-md`}
                  >
                    {product.isFree ? 'Get Free' : `Buy $${product.discountPrice || product.price}`}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-xs opacity-50 space-y-1">
          <p>Powered by <strong className="font-extrabold">DigiProfile</strong></p>
          <p>One Profile. Unlimited Possibilities.</p>
        </div>
      </div>
    </div>
  );
};
