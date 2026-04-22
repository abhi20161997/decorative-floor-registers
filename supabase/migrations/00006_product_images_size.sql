-- Migration 00006: Per-size images
-- Lets an image apply to a specific size (or stay finish-only / product-wide).
-- Storefront resolves images with a fallback chain:
--   1. finish_id = selected AND size_id = selected   (exact variant)
--   2. finish_id = selected AND size_id IS NULL      (any size of this finish)
--   3. finish_id IS NULL    AND size_id = selected   (size-specific, any finish)
--   4. finish_id IS NULL    AND size_id IS NULL      (product-wide fallback)

ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS size_id uuid REFERENCES sizes(id);

COMMENT ON COLUMN product_images.size_id IS
  'Optional size this image represents. NULL = applies to all sizes of the finish.';

-- Replace the finish-only composite index with one that also covers size lookups.
DROP INDEX IF EXISTS idx_product_images_product_finish;
CREATE INDEX IF NOT EXISTS idx_product_images_product_finish_size
  ON product_images(product_id, finish_id, size_id);
