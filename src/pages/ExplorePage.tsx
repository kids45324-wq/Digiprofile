import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag, 
  ExternalLink, 
  Filter, 
  Store,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { CreatorProfile, DigitalProduct } from '../types';
import { api } from '../services/api';

export const ExplorePage: React.FC = () => {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Design', 'Coding', 'Marketing', 'Templates', 'Ebooks', 'Online Courses'];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [creatorsData, productsData] = await Promise.all([
          api.getCreators(),
          api.getProducts(),
        ]);
        setCreators(creatorsData);
        setProducts(productsData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = 
      creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Design' && (creator.tagline.includes('Design') || creator.username === 'alexrivera')) return true;
    if (selectedCategory === 'Coding' && (creator.tagline.includes('Engineer') || creator.username === 'sarahchen')) return true;
    if (selectedCategory === 'Marketing' && (creator.tagline.includes('Marketer') || creator.username === 'marcusvance')) return true;

    // Check if creator has products in that category
    const hasCategoryProduct = products.some(
      p => p.creatorUsername === creator.username && p.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
    return hasCategoryProduct;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Top Digital Creators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Creator Storefronts
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Browse verified creators selling production-ready design systems, coding masterclasses, ebooks, and digital toolkits.
          </p>
        </div>

        {/* Search and Category Filter Bar */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by creator name, topic, or username (@alexrivera)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Creators Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading verified creators...</div>
        ) : filteredCreators.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto p-8">
            <p className="text-lg font-bold text-slate-900 dark:text-white">No creators match your query</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try searching for "Alex", "Design", or "React".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCreators.map(creator => {
              const creatorProds = products.filter(p => p.creatorUsername === creator.username);
              return (
                <div
                  key={creator.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Banner */}
                    <div className="h-32 bg-slate-800 relative overflow-hidden">
                      <img
                        src={creator.coverUrl}
                        alt={creator.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span>{creator.totalSales} sales</span>
                      </div>
                    </div>

                    {/* Avatar & Header */}
                    <div className="px-6 pt-0 relative pb-4">
                      <img
                        src={creator.avatarUrl}
                        alt={creator.displayName}
                        className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-900 -mt-10 object-cover shadow-lg ring-2 ring-purple-500/20"
                      />
                      <div className="mt-3">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                            {creator.displayName}
                          </h3>
                          {creator.isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-purple-500" />
                          )}
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                          @{creator.username}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{creator.location || 'Global'}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {creator.bio}
                        </p>
                      </div>

                      {/* Products preview in card */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Store Preview ({creatorProds.length} Products):
                        </p>
                        {creatorProds.slice(0, 2).map(prod => (
                          <Link
                            key={prod.id}
                            to={`/${creator.username}/product/${prod.id}`}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between text-xs transition"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                              {prod.title}
                            </span>
                            <span className="font-bold text-purple-600 dark:text-purple-400 shrink-0">
                              {prod.isFree ? 'FREE' : `$${prod.discountPrice || prod.price}`}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action footer */}
                  <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Link
                      to={`/${creator.username}`}
                      className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Profile
                    </Link>
                    <Link
                      to={`/${creator.username}/store`}
                      className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition shadow flex items-center justify-center gap-1"
                    >
                      <Store className="w-3.5 h-3.5" /> View Store
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
