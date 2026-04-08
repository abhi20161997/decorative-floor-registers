-- Migration 00003: Performance Indexes
-- Creates indexes on frequently queried columns for optimal performance

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_style_id ON products(style_id);
CREATE INDEX idx_products_slug ON products(slug);

-- Product Variants
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_finish_id ON product_variants(finish_id);
CREATE INDEX idx_product_variants_size_id ON product_variants(size_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- Product Images (composite index for product + finish lookups)
CREATE INDEX idx_product_images_product_finish ON product_images(product_id, finish_id);

-- Orders
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Customers
CREATE INDEX idx_customers_email ON customers(email);

-- Content Blocks
CREATE INDEX idx_content_blocks_page ON content_blocks(page);
