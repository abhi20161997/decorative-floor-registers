export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Style = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Finish = {
  id: string;
  name: string;
  slug: string;
  hex_color: string | null;
  gradient_css: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Size = {
  id: string;
  label: string;
  width_inches: number;
  height_inches: number;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  style_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  base_price: number | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  finish_id: string;
  size_id: string;
  sku: string;
  price: number;
  stock_qty: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  finish_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
};

export type Customer = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type CustomerAddress = {
  id: string;
  customer_id: string;
  label: string | null;
  address: ShippingAddress;
  is_default: boolean;
  created_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  customer_id: string | null;
  customer_email: string;
  customer_name: string;
  shipping_address: ShippingAddress;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  subtotal: number;
  discount_amount: number;
  discount_code: string | null;
  shipping_cost: number;
  tax: number;
  total: number;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  variant_id: string;
  product_name: string;
  variant_desc: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type DiscountCode = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_total: number | null;
  max_uses: number | null;
  times_used: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

export type ContentBlock = {
  id: string;
  page: string;
  section_key: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
};

export type SiteSetting = {
  key: string;
  value: unknown;
};

export type ProductWithRelations = Product & {
  style: Style;
  category: Category | null;
  variants: (ProductVariant & { finish: Finish; size: Size })[];
  images: ProductImage[];
};

export type CartItem = {
  variantId: string;
  productSlug: string;
  productName: string;
  finishName: string;
  sizeName: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export type ShopFilters = {
  style?: string;
  finish?: string;
  size?: string;
  category?: string;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "name-asc";
  page?: number;
};
