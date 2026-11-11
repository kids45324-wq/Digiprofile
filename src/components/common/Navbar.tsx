import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LayoutDashboard, 
  ExternalLink, 
  LogOut, 
  User, 
  Shield, 
  ShoppingBag,
  Store,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, creator, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If viewing a creator's public profile page directly, we might render a tailored minimal bar or keep navbar.
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
              DigiProfile
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 font-medium tracking-wide">
              Creator Monetization
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              location.pathname === '/' 
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>
          <Link
            to="/features"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              location.pathname === '/features' 
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Features
          </Link>
          <Link
            to="/explore"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              location.pathname === '/explore' 
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/pricing"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              location.pathname === '/pricing' 
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Pricing
          </Link>
          <Link
            to="/alexrivera/store"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-purple-500" />
            Live Store Demo
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500"
                />
                <span className="text-xs font-semibold max-w-[90px] truncate hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                      {user.role}
                    </span>
                  </div>

                  {user.role === 'creator' && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-500" />
                        Creator Dashboard
                      </Link>
                      {user.username && (
                        <Link
                          to={`/${user.username}`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-500" />
                          View Public Profile
                        </Link>
                      )}
                    </>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Control Panel
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    My Digital Purchases
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg shadow-md shadow-purple-600/20 hover:shadow-purple-600/40 hover:opacity-95 transition"
              >
                Get Started Free
              </Link>
            </div>
          )}

          {/* If creator, direct link to Dashboard button */}
          {user && user.role === 'creator' && !isDashboard && (
            <Link
              to="/dashboard"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Features
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Creators
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Pricing Plans
          </Link>
          <Link
            to="/alexrivera/store"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Storefront Demo
          </Link>
          <Link
            to="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Customer Downloads
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {user.role === 'creator' && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 bg-purple-600 text-white rounded-lg font-semibold"
                >
                  Go to Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 bg-amber-600 text-white rounded-lg font-semibold"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-sm font-semibold rounded-lg bg-purple-600 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
