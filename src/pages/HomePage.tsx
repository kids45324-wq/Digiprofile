import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag, 
  Globe, 
  BarChart3, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Video, 
  Layers, 
  Zap, 
  Star, 
  ChevronDown, 
  Download, 
  ExternalLink,
  Laptop
} from 'lucide-react';
import { INITIAL_CREATORS, INITIAL_PRODUCTS } from '../data/mockData';

export const HomePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const sampleCreator = INITIAL_CREATORS[0]; // Alex Rivera

  const faqs = [
    {
      q: 'How does DigiProfile compare to standard link-in-bio tools?',
      a: 'Unlike basic link list apps that redirect customers away, DigiProfile provides a complete digital ecommerce storefront directly inside your profile. You can host and sell ebooks, courses, design templates, and software with native Stripe and Razorpay checkouts, automated file delivery, and zero technical setup.'
    },
    {
      q: 'How do digital product downloads work securely?',
      a: 'When a customer completes payment through Stripe or Razorpay, our backend verifies the cryptographic payment signature server-side. Only then is an encrypted, temporary signed download token generated with expiration timers and IP/download limit protections to prevent unauthorized link sharing.'
    },
    {
      q: 'What payment gateways are supported?',
      a: 'DigiProfile supports Stripe for international credit cards, Apple Pay, and Google Pay across 135+ countries, and Razorpay for Indian UPI, NetBanking, and credit/debit cards with instant settlement.'
    },
    {
      q: 'Can I use my own custom domain?',
      a: 'Yes! On Pro and Business plans, you can connect your own custom domain (e.g. yourname.com or store.yourname.com) with automated SSL certificates, or use our clean handle digiprofile.com/username.'
    },
    {
      q: 'What are the template limits and pricing on DigiProfile?',
      a: 'Our Free plan allows hosting up to 3 templates or digital products forever at $0. Creator Pro allows hosting up to 5 templates for just $1 / month or $10 for 3 months, with a 15-day free trial included, 0% platform transaction fees, and full drag-and-drop image uploads.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow gradients in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-500/20 dark:bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-blue-500/15 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill announcement badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Next-Gen Creator Monetization Platform 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Your Entire Digital Business.{' '}
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                One Profile.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Create your personal brand, sell digital products, share your links, and grow your online business with DigiProfile.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2 group"
              >
                Create Your Free Profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition shadow-sm flex items-center justify-center gap-2"
              >
                Explore Features
              </Link>
            </div>

            {/* Micro assurance */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 15-Day Free Trial on Pro ($1/mo)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Setup in 2 minutes
              </span>
            </div>
          </div>

          {/* Interactive Dual Mockup Preview: Dashboard + Creator Profile */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="p-3 bg-gradient-to-b from-slate-200/60 to-slate-300/40 dark:from-slate-800/60 dark:to-slate-900/40 rounded-3xl shadow-2xl backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80">
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                {/* Mock browser header */}
                <div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="bg-slate-800/80 px-4 py-1 rounded-md text-xs font-mono text-purple-300 flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>digiprofile.com/alexrivera</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>$54,890.00 REVENUE</span>
                  </div>
                </div>

                {/* Split Mockup Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                  {/* Left: Dashboard View Snapshot */}
                  <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4" /> Creator Analytics Hub
                        </span>
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-medium">
                          Last 30 Days
                        </span>
                      </div>

                      {/* Metrics cards */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <p className="text-[11px] text-slate-400">Total Revenue</p>
                          <p className="text-lg font-extrabold text-white mt-1">$54,890</p>
                          <span className="text-[10px] text-emerald-400 font-semibold">+24.8% vs last mo</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <p className="text-[11px] text-slate-400">Total Orders</p>
                          <p className="text-lg font-extrabold text-white mt-1">1,842</p>
                          <span className="text-[10px] text-emerald-400 font-semibold">+18.2%</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <p className="text-[11px] text-slate-400">Conversion</p>
                          <p className="text-lg font-extrabold text-purple-400 mt-1">5.92%</p>
                          <span className="text-[10px] text-slate-400 font-medium">Top 5% creator</span>
                        </div>
                      </div>

                      {/* Recent Verified Orders */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-400">Recent Automated Deliveries</p>
                        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                              UI
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">Nexus UI: Figma Design System</p>
                              <p className="text-[10px] text-slate-400">Jordan Lee • Verified via Stripe</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-400">+$29.00</span>
                        </div>

                        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                              EB
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">Designing for SaaS (Ebook)</p>
                              <p className="text-[10px] text-slate-400">Elena Scott • Instant Download</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-400">+$19.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>Gateway: Stripe & Razorpay Connected</span>
                      <Link to="/dashboard" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                        Open Full Dashboard <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: Live Public Profile Mockup */}
                  <div className="lg:col-span-5 p-6 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
                          <Laptop className="w-4 h-4" /> Live Mobile View
                        </span>
                        <Link 
                          to="/alexrivera"
                          className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1"
                        >
                          Visit Live Profile <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Creator mini card */}
                      <div className="text-center pb-4 border-b border-slate-800">
                        <img
                          src={sampleCreator.avatarUrl}
                          alt={sampleCreator.displayName}
                          className="w-16 h-16 rounded-full mx-auto ring-4 ring-purple-600/60 object-cover shadow-lg"
                        />
                        <h3 className="font-bold text-base text-white mt-2 flex items-center justify-center gap-1">
                          {sampleCreator.displayName}
                          <CheckCircle2 className="w-4 h-4 text-purple-400 inline" />
                        </h3>
                        <p className="text-xs text-purple-300 font-medium">@{sampleCreator.username}</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto line-clamp-2">
                          {sampleCreator.tagline}
                        </p>
                      </div>

                      {/* Products Showcase Inside Profile */}
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-slate-300">Featured Products</p>
                        {INITIAL_PRODUCTS.slice(0, 2).map(prod => (
                          <div 
                            key={prod.id} 
                            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between group hover:border-purple-500/50 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={prod.thumbnailUrl} alt={prod.title} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <p className="text-xs font-semibold text-white line-clamp-1">{prod.title}</p>
                                <span className="text-[10px] text-purple-300">{prod.category}</span>
                              </div>
                            </div>
                            <Link
                              to={`/checkout/${prod.id}`}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition shadow"
                            >
                              ${prod.discountPrice || prod.price}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 text-center">
                      <Link
                        to="/alexrivera/store"
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white underline"
                      >
                        Browse Alex's Full Store (3 Products) <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Complete Monetization Stack
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Everything Creators Need to Launch & Scale
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Replace 6 disconnected subscriptions with one seamless, high-converting creator ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Personal Profile Website</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Build a stunning, custom-branded bio and website with customizable themes, fonts, colors, and button styling.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Digital Product Selling</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sell software, Figma templates, design systems, sound kits, presets, and Notion workspaces effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ebook & PDF Store</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Distribute and monetize PDF guides, workbooks, research papers, and cheat sheets with secure watermarks.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Online Course Selling</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Package video tutorials, project starter code, and cohort access behind simple one-time payments.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Payment Integration</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stripe and Razorpay built-in. Collect payments in 135+ currencies including USD, EUR, GBP, and Indian UPI.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Custom Profile URL</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Claim your memorable handle digiprofile.com/username or link your custom root domain with zero SSL headaches.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Link Management</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Organize all your social channels, podcast episodes, calendar bookings, and newsletters in one place.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sales Analytics</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track visitor sources, conversion rates, customer lifetime value, and best-selling items in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (5 Steps) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Simple 5-Step Launch
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              From Sign-Up to First Sale in Minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Create Account</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pick your unique creator handle (e.g., digiprofile.com/yourname) in under 30 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Customize Profile</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your avatar, banner, bio, and choose color palettes that match your personal brand.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Upload Products</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Attach your PDF, ZIP, or video file, set your price or free download, and add feature bullet points.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Share Your Link</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Put your DigiProfile link in your Instagram bio, YouTube description, TikTok, and Twitter header.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                5
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">Receive Payments</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get paid straight into your bank via Stripe or Razorpay while files deliver automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Banner */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Top Creators on DigiProfile
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Explore Public Storefronts
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              View all creators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_CREATORS.map(creator => (
              <div
                key={creator.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 overflow-hidden hover:shadow-lg transition group"
              >
                <div className="h-28 bg-slate-800 relative overflow-hidden">
                  <img src={creator.coverUrl} alt={creator.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                    {creator.subscriptionPlan} plan
                  </span>
                </div>
                <div className="p-5 pt-0 relative">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.displayName}
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-900 -mt-8 object-cover shadow-md"
                  />
                  <div className="mt-3">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">{creator.displayName}</h4>
                      {creator.isVerified && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">@{creator.username}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{creator.bio}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      <strong className="text-slate-900 dark:text-white font-bold">{creator.totalSales}</strong> sales
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={`/${creator.username}`}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-100 transition"
                      >
                        Profile
                      </Link>
                      <Link
                        to={`/${creator.username}/store`}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition"
                      >
                        Store
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Got Questions?
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === index ? 'rotate-180 text-purple-500' : ''}`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Turn Your Audience Into Customers?
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto font-normal">
            Join thousands of designers, developers, and educators building their independent digital empires with DigiProfile.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white text-purple-950 hover:bg-purple-50 transition shadow-xl text-base"
            >
              Claim Your Free Username
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition text-base"
            >
              Explore Top Stores
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
