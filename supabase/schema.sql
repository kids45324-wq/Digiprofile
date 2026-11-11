-- ==============================================================================
-- DIGIPROFILE PRODUCTION POSTGRESQL & SUPABASE SCHEMA WITH ROW LEVEL SECURITY
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Trigger Function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. PROFILES TABLE (Supabase Auth link)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('creator', 'admin', 'customer')),
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_modtime 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 4. CREATOR_PAGES TABLE (Custom bio, branding, theme, domain)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS creator_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    tagline TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    location TEXT,
    website TEXT,
    contact_email TEXT,
    custom_domain TEXT UNIQUE,
    subscription_plan TEXT NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'business')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    appearance JSONB NOT NULL DEFAULT '{
        "theme": "deep-purple",
        "primaryColor": "#7c3aed",
        "secondaryColor": "#3b82f6",
        "backgroundColor": "#0f172a",
        "textColor": "#ffffff",
        "cardStyle": "glass",
        "buttonStyle": "rounded",
        "fontFamily": "sans",
        "productDisplay": "grid"
    }'::jsonb,
    total_sales INT NOT NULL DEFAULT 0,
    total_revenue NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_views INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_creator_pages_modtime 
    BEFORE UPDATE ON creator_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. SOCIAL_LINKS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_page_id UUID NOT NULL REFERENCES creator_pages(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. PRODUCTS TABLE (Digital Products: Ebooks, Courses, Templates, PDFs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_pages(id) ON DELETE CASCADE,
    creator_username TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Ebooks', 'PDF Files', 'Templates', 'Online Courses', 'Digital Downloads', 'Other Digital Products'
    )),
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_price NUMERIC(10, 2),
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    currency TEXT NOT NULL DEFAULT 'USD',
    thumbnail_url TEXT,
    file_path TEXT NOT NULL, -- Path in private Supabase Storage bucket
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    file_type TEXT NOT NULL DEFAULT 'application/octet-stream',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    sales_count INT NOT NULL DEFAULT 0,
    views_count INT NOT NULL DEFAULT 0,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    reviews_count INT NOT NULL DEFAULT 0,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_products_modtime 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_products_creator ON products(creator_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);

-- ==============================================================================
-- 7. ORDERS & ORDER_ITEMS TABLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    creator_id UUID NOT NULL REFERENCES creator_pages(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_applied NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'razorpay', 'free')),
    payment_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'processing', 'refunded', 'failed')),
    download_token TEXT UNIQUE NOT NULL,
    download_token_expires_at TIMESTAMPTZ NOT NULL,
    download_count INT NOT NULL DEFAULT 0,
    max_downloads INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_creator_id ON orders(creator_id);
CREATE INDEX idx_orders_download_token ON orders(download_token);

-- ==============================================================================
-- 8. CUSTOMERS TABLE (Aggregated Buyer Records)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_pages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    orders_count INT NOT NULL DEFAULT 1,
    last_purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(creator_id, email)
);

-- ==============================================================================
-- 9. PAYMENTS & SUBSCRIPTIONS TABLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    gateway TEXT NOT NULL CHECK (gateway IN ('stripe', 'razorpay')),
    gateway_payment_id TEXT NOT NULL,
    gateway_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_pages(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'business')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. COUPONS & ANALYTICS_EVENTS TABLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creator_pages(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_percent INT NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
    max_uses INT NOT NULL DEFAULT 100,
    used_count INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(creator_id, code)
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creator_pages(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'product_view', 'checkout_started', 'purchase_completed')),
    ip_hash TEXT,
    referrer TEXT,
    device_type TEXT,
    country TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. PLATFORM_SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
    id INT PRIMARY KEY DEFAULT 1,
    platform_fee_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    stripe_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    razorpay_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    allow_free_products BOOLEAN NOT NULL DEFAULT TRUE,
    max_upload_size_bytes BIGINT NOT NULL DEFAULT 524288000, -- 500MB
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    supported_currencies JSONB NOT NULL DEFAULT '["USD", "INR", "EUR", "GBP"]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_settings (id, platform_fee_percentage, stripe_enabled, razorpay_enabled)
VALUES (1, 5.00, true, true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile; public can view basic creator name
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Creator Pages: Anyone can read public creator pages; only owner can modify
CREATE POLICY "Public can view creator pages" ON creator_pages
    FOR SELECT USING (true);

CREATE POLICY "Creators can update own page" ON creator_pages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Creators can insert own page" ON creator_pages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products: Anyone can read published products; creator manages own products
CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can manage own products" ON products
    FOR ALL USING (
        creator_id IN (SELECT id FROM creator_pages WHERE user_id = auth.uid())
    );

-- Orders: Creators see orders for their products; customers see orders by email
CREATE POLICY "Creators can view their store orders" ON orders
    FOR SELECT USING (
        creator_id IN (SELECT id FROM creator_pages WHERE user_id = auth.uid())
    );

CREATE POLICY "Customers can view orders with matching email" ON orders
    FOR SELECT USING (
        customer_email = (SELECT email FROM profiles WHERE id = auth.uid())
    );

-- Platform Settings: Public can read settings; only superadmins can edit
CREATE POLICY "Public can read platform settings" ON platform_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update platform settings" ON platform_settings
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
