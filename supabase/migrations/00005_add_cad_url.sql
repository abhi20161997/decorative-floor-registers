-- Migration 00005: CAD drawing sheet URL per product
-- Lets customers (architects, contractors) download a spec/cutout drawing.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS cad_url text;

COMMENT ON COLUMN products.cad_url IS
  'Public URL to a downloadable CAD/spec PDF for this product. NULL = no sheet available.';
