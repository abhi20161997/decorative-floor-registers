-- Migration 00004: Discount Code Increment RPC
-- Server-side function to atomically increment discount code usage count

CREATE OR REPLACE FUNCTION increment_discount_usage(code_value text)
RETURNS void AS $$
  UPDATE discount_codes
  SET times_used = times_used + 1
  WHERE code = code_value;
$$ LANGUAGE sql SECURITY DEFINER;
