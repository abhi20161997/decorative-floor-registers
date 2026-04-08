-- Migration 00002: Row Level Security Policies
-- Enables RLS on all tables and creates public read + admin full access policies

-- ============================================================================
-- Helper function: is_admin()
-- Checks if the current authenticated user exists in the admin_users table
-- ============================================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Public read policies for active items (anonymous + authenticated)
-- ============================================================================

-- Categories: public can read active categories
CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (active = true);

-- Styles: public can read active styles
CREATE POLICY "Public can read active styles"
  ON styles FOR SELECT
  USING (active = true);

-- Finishes: public can read active finishes
CREATE POLICY "Public can read active finishes"
  ON finishes FOR SELECT
  USING (active = true);

-- Sizes: public can read active sizes
CREATE POLICY "Public can read active sizes"
  ON sizes FOR SELECT
  USING (active = true);

-- Products: public can read active products
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (active = true);

-- Product Variants: public can read active variants
CREATE POLICY "Public can read active product variants"
  ON product_variants FOR SELECT
  USING (active = true);

-- Product Images: public can read all images (no active flag on images)
CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  USING (true);

-- Content Blocks: public can read all content blocks
CREATE POLICY "Public can read content blocks"
  ON content_blocks FOR SELECT
  USING (true);

-- Site Settings: public can read all site settings
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Discount Codes: public can read active, non-expired codes
CREATE POLICY "Public can read active discount codes"
  ON discount_codes FOR SELECT
  USING (
    active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR times_used < max_uses)
  );

-- ============================================================================
-- Admin full access policies (SELECT, INSERT, UPDATE, DELETE)
-- ============================================================================

-- Categories
CREATE POLICY "Admins have full access to categories"
  ON categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Styles
CREATE POLICY "Admins have full access to styles"
  ON styles FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Finishes
CREATE POLICY "Admins have full access to finishes"
  ON finishes FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Sizes
CREATE POLICY "Admins have full access to sizes"
  ON sizes FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Products
CREATE POLICY "Admins have full access to products"
  ON products FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Product Variants
CREATE POLICY "Admins have full access to product variants"
  ON product_variants FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Product Images
CREATE POLICY "Admins have full access to product images"
  ON product_images FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Customers
CREATE POLICY "Admins have full access to customers"
  ON customers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Customer Addresses
CREATE POLICY "Admins have full access to customer addresses"
  ON customer_addresses FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Orders
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Order Items
CREATE POLICY "Admins have full access to order items"
  ON order_items FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Discount Codes
CREATE POLICY "Admins have full access to discount codes"
  ON discount_codes FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Content Blocks
CREATE POLICY "Admins have full access to content blocks"
  ON content_blocks FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Site Settings
CREATE POLICY "Admins have full access to site settings"
  ON site_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin Users
CREATE POLICY "Admins have full access to admin users"
  ON admin_users FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
