# DigiProfile – Complete Creator Monetization Platform

> **"One Profile. Unlimited Possibilities."**

DigiProfile is a production-ready, full-stack creator monetization platform designed for creators, developers, designers, coaches, and digital entrepreneurs to launch customizable profile pages, operate digital storefronts, sell ebooks, courses, and templates, accept global payments via Stripe and Razorpay, and manage customers securely.

---

## 🌟 Key Features

1. **Visual Profile Studio Builder**:
   - Custom handles (e.g., `digiprofile.com/username` or custom domains).
   - 6 theme presets (Deep Purple, Electric Blue, Emerald Forest, Sunset Glow, Cyber Dark, Clean Minimal).
   - Real-time mobile phone mockup preview.
   - Customizable card geometry, button shapes (rounded, pill, sharp), and typography.
   - Bio links, social links, and embedded product showcase.

2. **Digital Store & Product Management**:
   - Sell Ebooks, PDF Files, Figma Templates, Online Courses, and Digital Downloads.
   - Free or paid products with discount pricing and coupon codes (`CREATOR50`, `WELCOME20`).
   - Private Supabase Storage bucket integration with temporary signed download URLs (7-day expiry & 5-download safety limits).

3. **Dual Payment Gateway Integration**:
   - **Stripe**: International credit/debit cards, Apple Pay, Google Pay across 135+ currencies.
   - **Razorpay**: Indian UPI, NetBanking, RuPay cards with instant automated receipts.
   - Server-side signature verification & anti-tamper token generation.

4. **Creator & Admin Dashboards**:
   - Overview metrics: Total Revenue, Total Orders, Total Products, Total Visitors, Conversion Rate.
   - Interactive revenue trends, top-selling items, customer CRM.
   - Superadmin control panel: Global stats, fee configuration, maintenance mode, and audit logs.

5. **Customer Digital Library**:
   - Portal (`/my-orders`) where customers can access and re-download all purchased digital assets anytime with secure DRM tokens.

---

## 🏗️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion, Canvas-Confetti
- **Routing**: React Router DOM
- **Backend / API**: Express 4 running via TypeScript (`server.ts`)
- **Database & Auth**: PostgreSQL via Supabase with full Row Level Security (RLS) policies
- **File Storage**: Private Supabase Storage buckets with encrypted signed download URLs
- **Payment Verification**: Stripe Webhooks and Razorpay HMAC-SHA256 verification

---

## 🚀 Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your configuration:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
STRIPE_SECRET_KEY="sk_test_..."
RAZORPAY_KEY_ID="rzp_test_..."
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Database & Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. The script provisions:
   - 12 PostgreSQL tables (`profiles`, `creator_pages`, `social_links`, `products`, `orders`, `order_items`, `customers`, `payments`, `subscriptions`, `coupons`, `analytics_events`, `platform_settings`).
   - Row Level Security (RLS) policies protecting creator and customer records.
5. Create a **Private Bucket** named `digital-assets` in **Storage** with restricted read permissions.

---

## 💳 Payment Gateway Setup

### Stripe
1. In the Stripe Dashboard, navigate to **Developers > API Keys**.
2. Add your secret key to `STRIPE_SECRET_KEY`.
3. Under **Developers > Webhooks**, create an endpoint pointing to `https://your-domain.com/api/checkout/stripe-webhook`.
4. Deploy the Supabase Edge function located in `supabase/functions/stripe-webhook/`.

### Razorpay
1. In the Razorpay Dashboard, navigate to **Settings > API Keys**.
2. Generate your Key ID and Key Secret.
3. Set your webhook endpoint pointing to `https://your-domain.com/api/checkout/razorpay-webhook` with secret verification.
4. Deploy the Supabase Edge function located in `supabase/functions/razorpay-webhook/`.

---

## 🌐 Vercel & GitHub Deployment

1. Push code to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of DigiProfile"
   git remote add origin https://github.com/your-username/digiprofile.git
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Add all environment variables from `.env.example`.
5. Deploy!
6. For custom root domains, configure a CNAME record to point `store.yourdomain.com` or `@` to `cname.vercel-dns.com`.

---

## 🧪 Testing Accounts & Sandbox

DigiProfile includes an interactive **Sandbox Demo Bar** at the top of the interface:
- **Alex Rivera (Creator)**: Pro plan creator with $54k+ sales and active store.
- **Sarah Chen (Business)**: Full-stack engineer creator with video courses.
- **Admin**: Superadmin dashboard access to platform settings and fees.
- **Customer**: Buyer library test view with sample completed orders.
- Test Promo Code: `CREATOR50` (50% off) and `WELCOME20` (20% off).

---

© 2026 DigiProfile Inc. All rights reserved.
