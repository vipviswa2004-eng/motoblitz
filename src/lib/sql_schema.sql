-- ==============================================================================
-- MOTOBLITZ SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT DEFAULT 'Flame',
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  sale_price NUMERIC(10, 2),
  stock_quantity INT DEFAULT 10,
  is_featured BOOLEAN DEFAULT false,
  is_flash_deal BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  compatible_bikes TEXT[] DEFAULT ARRAY['Universal']::text[],
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  review_count INT DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  bike_model TEXT,
  shipping_address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'UPI on Delivery',
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  tracking_id TEXT,
  courier_name TEXT,
  whatsapp_synced BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Banners & Announcements Table
CREATE TABLE IF NOT EXISTS banners (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT DEFAULT '/products',
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Site Settings
INSERT INTO site_settings (key, value) VALUES
('store_info', '{"whatsapp_number": "919342310194", "admin_email": "viswakumar2004@gmail.com", "free_shipping_threshold": 999}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 8. Compatible Bike Models Table
CREATE TABLE IF NOT EXISTS bike_models (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  icon TEXT DEFAULT '🏍️',
  cc INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Row Level Security (RLS) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bike_models ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Public can view banners" ON banners;
DROP POLICY IF EXISTS "Public can view settings" ON site_settings;
DROP POLICY IF EXISTS "Public can view bike models" ON bike_models;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
DROP POLICY IF EXISTS "Public can insert order items" ON order_items;
DROP POLICY IF EXISTS "Admin full access on products" ON products;
DROP POLICY IF EXISTS "Admin full access on categories" ON categories;
DROP POLICY IF EXISTS "Admin full access on orders" ON orders;
DROP POLICY IF EXISTS "Admin full access on order_items" ON order_items;
DROP POLICY IF EXISTS "Admin full access on banners" ON banners;
DROP POLICY IF EXISTS "Admin full access on bike_models" ON bike_models;

-- Public read policies
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Public can view banners" ON banners FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public can view bike models" ON bike_models FOR SELECT TO public USING (true);

-- Public insert policies for WhatsApp checkout
CREATE POLICY "Public can insert orders" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT TO public WITH CHECK (true);

-- Admin full access policy (restricted to viswakumar2004@gmail.com & maxthvel@gmail.com)
CREATE POLICY "Admin full access on products" ON products FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'));

CREATE POLICY "Admin full access on categories" ON categories FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'));

CREATE POLICY "Admin full access on orders" ON orders FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'));

CREATE POLICY "Admin full access on order_items" ON order_items FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'));

CREATE POLICY "Admin full access on banners" ON banners FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'));

CREATE POLICY "Admin full access on bike_models" ON bike_models FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'))
WITH CHECK (auth.jwt() ->> 'email' IN ('viswakumar2004@gmail.com', 'maxthvel@gmail.com'));
