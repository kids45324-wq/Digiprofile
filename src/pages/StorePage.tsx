import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowLeft, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { CreatorProfile, DigitalProduct } from '../types';
import { api } from '../services/api';

export const StorePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Templates', 'Ebooks', 'Online Courses', 'PDF Files', 'Digital Downloads'];

  useEffect(() => {
    async function loadStore() {
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
    loadStore();
  }, [username]);

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-bold text-lg">Store not found</p>
          <Link to="/explore" className="text-purple-600 underline text-sm mt-2 block">
            Browse creators
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & Creator mini banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <Link
            to={`/${creator.username}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to @{creator.username}'s Profile
          </Link>

          <div className="flex items-center gap-3">
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                {creator.displayName} Store
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
              </p>
              <p className="text-[10px] text-slate-400">{creator.totalSales} total verified orders</p>
            </div>
          </div>
        </div>

        {/* Store Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Digital Store & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Instant downloads, license keys, and comprehensive educational bundles.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products in this store..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto p-6">
            <p className="font-bold text-sm">No products found</p>
            <p className="text-xs text-slate-400 mt-1">Try another search keyword or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-52 relative overflow-hidden bg-slate-800">
                    <img
                      src={product.thumbnailUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      {product.category}
                    </span>
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-purple-600 text-xs font-black text-white shadow-lg">
                      {product.isFree ? 'FREE' : `$${product.discountPrice || product.price}`}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-1 text-amber-500 text-xs mb-1.5 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-purple-600 transition line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.shortDescription || product.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{product.fileName}</span>
                      <span>{(product.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <Link
                    to={`/${creator.username}/product/${product.id}`}
                    className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/checkout/${product.id}`}
                    className="flex-1 py-2.5 text-center text-xs font-black rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition shadow-md shadow-purple-600/25"
                  >
                    {product.isFree ? 'Get Free' : 'Buy Now'}
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
