import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DemoBar } from './components/common/DemoBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { ExplorePage } from './pages/ExplorePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { StorePage } from './pages/StorePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';

const AppLayout: React.FC = () => {
  const location = useLocation();

  // Certain views (like a creator's public profile) should look like their custom bio-link/website
  // but still provide access back or keep standard footer
  const isPublicProfileOnly = 
    location.pathname.startsWith('/alexrivera') || 
    location.pathname.startsWith('/sarahchen') ||
    location.pathname.startsWith('/marcusvance');
  
  const isProfileRoot = isPublicProfileOnly && !location.pathname.includes('/store') && !location.pathname.includes('/product');

  return (
    <div className="flex flex-col min-h-screen">
      <DemoBar />
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Main SaaS Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Creator & Admin Dashboards */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Customer Portal & Checkout */}
          <Route path="/my-orders" element={<CustomerOrdersPage />} />
          <Route path="/checkout/:productId" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

          {/* Legal & Info */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* Dynamic Creator Store & Product Routes */}
          <Route path="/:username/store" element={<StorePage />} />
          <Route path="/:username/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          
          {/* Creator Public Profile (Catch-all for usernames like /alexrivera) */}
          <Route path="/:username" element={<PublicProfilePage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
