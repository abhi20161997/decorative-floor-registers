# DFR Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium e-commerce website for Decorative Floor Register at decorativefloorregister.com — full product catalog, Stripe checkout, and admin panel.

**Architecture:** Next.js 15 App Router on Vercel, Supabase (Postgres + Auth + Storage) for data, Stripe Checkout for payments, Resend for email. Warm Ivory visual theme with metallic textures and Framer Motion animations.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Supabase, Stripe, Resend, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-09-dfr-website-redesign-design.md`

---

## Phase 1: Foundation

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.env.local.example`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Accept defaults. This creates the project scaffold in the current directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr stripe @stripe/stripe-js framer-motion resend
npm install -D supabase
```

- [ ] **Step 3: Create environment variable template**

Create `.env.local.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=deepakbrass@gmail.com
```

Add `.env.local` to `.gitignore` (should already be there from create-next-app).

- [ ] **Step 4: Configure Tailwind with Warm Ivory theme**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#faf6f1",
        linen: "#f0ebe4",
        espresso: "#2c2420",
        umber: "#6b5d52",
        "antique-gold": "#9a7b4f",
        brass: "#c9a96e",
        "warm-white": "#f5efe8",
        "finish-brass": {
          light: "#d4c5b0",
          DEFAULT: "#c9a96e",
          mid: "#b8976a",
          bright: "#d4b978",
        },
        "finish-black": {
          light: "#3a3632",
          DEFAULT: "#2c2420",
          dark: "#1a1714",
        },
        "finish-bronze": {
          light: "#9a7b4f",
          DEFAULT: "#8b6f3a",
          dark: "#6b5533",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["3.5rem", { lineHeight: "1.1", fontWeight: "500" }],
        "display-lg": ["2.75rem", { lineHeight: "1.1", fontWeight: "500" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", fontWeight: "500" }],
        "label-sm": [
          "0.6875rem",
          { lineHeight: "1", fontWeight: "500", letterSpacing: "0.15em" },
        ],
        "label-md": [
          "0.8125rem",
          { lineHeight: "1", fontWeight: "500", letterSpacing: "0.1em" },
        ],
      },
      animation: {
        shimmer: "shimmer 4s linear infinite",
        "metallic-shift": "metallic-shift 8s ease infinite",
        "light-reflect": "light-reflect 6s ease infinite",
        "fade-slide-up": "fade-slide-up 0.6s ease both",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "metallic-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "light-reflect": {
          "0%, 100%": { transform: "translate(0, 0)", opacity: "0.6" },
          "50%": { transform: "translate(10%, 5%)", opacity: "0.3" },
        },
        "fade-slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Set up global styles and fonts**

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --font-display: "Cormorant Garamond", serif;
  --font-sans: "Inter", sans-serif;
}

@layer base {
  body {
    @apply bg-ivory text-espresso font-sans antialiased;
    font-size: 16px;
    line-height: 1.7;
  }

  h1,
  h2,
  h3,
  h4 {
    @apply font-display;
  }
}

/* Metallic gradient text utility */
.text-metallic {
  background: linear-gradient(
    135deg,
    #c9a96e 0%,
    #e8d5a8 25%,
    #9a7b4f 50%,
    #d4b978 75%,
    #c9a96e 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

/* Brushed metal texture overlay */
.texture-brushed-metal {
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 1px,
    rgba(255, 255, 255, 0.03) 1px,
    rgba(255, 255, 255, 0.03) 2px
  );
}

/* Light sweep on hover */
.light-sweep::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  transition: left 0.6s ease;
}
.light-sweep:hover::after {
  left: 140%;
}

@keyframes shimmer {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}
```

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Decorative Floor Register | Premium Floor Registers & Grilles",
  description:
    "Handcrafted decorative floor registers in Art Deco, Contemporary, and Geometrical designs. Available in Antique Brass, Black, and Bronze finishes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder homepage**

Replace `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-display-xl text-espresso mb-4">
          Decorative Floor Register
        </h1>
        <p className="text-umber text-lg">Coming soon</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Verify the app runs**

```bash
npm run dev
```

Open http://localhost:3000. Verify: Warm ivory background, Cormorant Garamond heading, correct colors.
Expected: Page renders with "Decorative Floor Register" heading on cream background.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Warm Ivory theme and fonts"
```

---

### Task 2: Database Schema & Supabase Setup

**Files:**
- Create: `supabase/migrations/00001_initial_schema.sql`, `supabase/migrations/00002_rls_policies.sql`, `supabase/migrations/00003_indexes.sql`

**Prerequisite:** Create a Supabase project at https://supabase.com/dashboard and get the project URL, anon key, and service role key. Add them to `.env.local`.

- [ ] **Step 1: Initialize Supabase locally**

```bash
npx supabase init
```

- [ ] **Step 2: Create the initial schema migration**

Create `supabase/migrations/00001_initial_schema.sql`:

```sql
-- Categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Styles
CREATE TABLE styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Finishes
CREATE TABLE finishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  hex_color text,
  gradient_css text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sizes
CREATE TABLE sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  width_inches numeric NOT NULL,
  height_inches numeric NOT NULL,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  style_id uuid REFERENCES styles(id),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  base_price numeric(10,2),
  meta_title text,
  meta_description text,
  og_image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Variants
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  finish_id uuid REFERENCES finishes(id),
  size_id uuid REFERENCES sizes(id),
  sku text UNIQUE NOT NULL,
  price numeric(10,2) NOT NULL,
  stock_qty integer,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, finish_id, size_id)
);

-- Product Images
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  finish_id uuid REFERENCES finishes(id),
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Customers
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer Addresses
CREATE TABLE customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  label text,
  address jsonb NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  shipping_address jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  subtotal numeric(10,2) NOT NULL,
  discount_amount numeric(10,2) DEFAULT 0,
  discount_code text,
  shipping_cost numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  total numeric(10,2) NOT NULL,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id),
  product_name text NOT NULL,
  variant_desc text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Discount Codes
CREATE TABLE discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value numeric(10,2) NOT NULL,
  min_order_total numeric(10,2),
  max_uses integer,
  times_used integer DEFAULT 0,
  expires_at timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Content Blocks
CREATE TABLE content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section_key text NOT NULL,
  title text,
  body text,
  image_url text,
  display_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page, section_key)
);

-- Site Settings
CREATE TABLE site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL
);

-- Admin Users
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);
```

- [ ] **Step 3: Create RLS policies**

Create `supabase/migrations/00002_rls_policies.sql`:

```sql
-- Enable RLS on all tables
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

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Public read policies (active items only)
CREATE POLICY "Public read active categories" ON categories
  FOR SELECT USING (active = true);

CREATE POLICY "Public read active styles" ON styles
  FOR SELECT USING (active = true);

CREATE POLICY "Public read active finishes" ON finishes
  FOR SELECT USING (active = true);

CREATE POLICY "Public read active sizes" ON sizes
  FOR SELECT USING (active = true);

CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "Public read active variants" ON product_variants
  FOR SELECT USING (active = true);

CREATE POLICY "Public read product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public read content blocks" ON content_blocks
  FOR SELECT USING (true);

CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Public read active discount codes" ON discount_codes
  FOR SELECT USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admin full access policies
CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access styles" ON styles
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access finishes" ON finishes
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access sizes" ON sizes
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access variants" ON product_variants
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access images" ON product_images
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access customers" ON customers
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access addresses" ON customer_addresses
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access orders" ON orders
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access order items" ON order_items
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access discount codes" ON discount_codes
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access content" ON content_blocks
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access settings" ON site_settings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access admin users" ON admin_users
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
```

- [ ] **Step 4: Create indexes**

Create `supabase/migrations/00003_indexes.sql`:

```sql
-- Product lookup indexes
CREATE INDEX idx_products_category ON products(category_id) WHERE active = true;
CREATE INDEX idx_products_style ON products(style_id) WHERE active = true;
CREATE INDEX idx_products_slug ON products(slug);

-- Variant lookup indexes
CREATE INDEX idx_variants_product ON product_variants(product_id) WHERE active = true;
CREATE INDEX idx_variants_finish ON product_variants(finish_id) WHERE active = true;
CREATE INDEX idx_variants_size ON product_variants(size_id) WHERE active = true;
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- Image lookup
CREATE INDEX idx_images_product_finish ON product_images(product_id, finish_id);

-- Order lookup
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Customer lookup
CREATE INDEX idx_customers_email ON customers(email);

-- Content lookup
CREATE INDEX idx_content_page ON content_blocks(page);
```

- [ ] **Step 5: Push migrations to Supabase**

```bash
npx supabase db push
```

If using the hosted Supabase dashboard instead, run the SQL files manually in the SQL Editor in order: 00001, 00002, 00003.

- [ ] **Step 6: Create Supabase Storage bucket**

In Supabase Dashboard → Storage → New Bucket:
- Name: `product-images`
- Public: Yes
- File size limit: 5MB
- Allowed MIME types: `image/webp, image/jpeg, image/png`

- [ ] **Step 7: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema, RLS policies, and indexes"
```

---

### Task 3: TypeScript Types, Supabase Clients & Utilities

**Files:**
- Create: `src/types/index.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/admin.ts`, `src/lib/stripe.ts`, `src/lib/resend.ts`, `src/lib/utils.ts`

- [ ] **Step 1: Define TypeScript types**

Create `src/types/index.ts`:

```ts
// === Database row types ===

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

export type CustomerAddress = {
  id: string;
  customer_id: string;
  label: string | null;
  address: ShippingAddress;
  is_default: boolean;
  created_at: string;
};

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
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

// === Joined/enriched types for frontend ===

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

// === Filter types for shop page ===

export type ShopFilters = {
  style?: string;
  finish?: string;
  size?: string;
  category?: string;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "name-asc";
  page?: number;
};
```

- [ ] **Step 2: Create Supabase browser client**

Create `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 3: Create Supabase server client**

Create `src/lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in Server Components (read-only cookies)
          }
        },
      },
    }
  );
}
```

- [ ] **Step 4: Create Supabase admin client (service role)**

Create `src/lib/supabase/admin.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
```

- [ ] **Step 5: Create Stripe client**

Create `src/lib/stripe.ts`:

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});
```

- [ ] **Step 6: Create Resend client**

Create `src/lib/resend.ts`:

```ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

- [ ] **Step 7: Create utility functions**

Create `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateSku(
  styleName: string,
  finishName: string,
  sizeLabel: string
): string {
  const styleCode = styleName.substring(0, 2).toUpperCase();
  const finishCode = finishName.substring(0, 2).toUpperCase();
  const sizeCode = sizeLabel.toUpperCase().replace("X", "X");
  return `${styleCode}-${finishCode}-${sizeCode}`;
}
```

Install clsx and tailwind-merge:

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 8: Verify imports compile**

```bash
npm run build
```

Expected: Build succeeds (page renders static placeholder).

- [ ] **Step 9: Commit**

```bash
git add src/types/ src/lib/
git commit -m "feat: add TypeScript types, Supabase clients, Stripe, Resend, and utils"
```

---

### Task 4: Core Layout Components

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileNav.tsx`, `src/components/animations/ScrollReveal.tsx`, `src/components/animations/PageTransition.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Header component**

Create `src/components/layout/Header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/sizing-guide", label: "Sizing Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide header on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-sm"
            : "bg-ivory"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display text-xl font-semibold text-espresso">
            DFR
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-label-sm uppercase tracking-wider transition-colors ${
                  pathname === link.href
                    ? "text-antique-gold"
                    : "text-umber hover:text-espresso"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative text-espresso hover:text-antique-gold transition-colors"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-espresso"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
```

- [ ] **Step 2: Create MobileNav component**

Create `src/components/layout/MobileNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/sizing-guide", label: "Sizing Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso/50 z-50"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-ivory z-50 p-8 flex flex-col"
          >
            <button
              onClick={onClose}
              className="self-end mb-8 text-espresso"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="font-display text-2xl text-espresso hover:text-antique-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-linen">
              <p className="text-label-sm uppercase text-antique-gold mb-2">
                Contact
              </p>
              <p className="text-umber text-sm">+1 847-316-1395</p>
              <p className="text-umber text-sm">deepakbrass@gmail.com</p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Create Footer component**

Create `src/components/layout/Footer.tsx`:

```tsx
import Link from "next/link";

const footerLinks = {
  shop: [
    { href: "/shop?style=art-deco", label: "Art Deco" },
    { href: "/shop?style=contemporary", label: "Contemporary" },
    { href: "/shop?style=geometrical", label: "Geometrical" },
    { href: "/shop", label: "All Registers" },
  ],
  help: [
    { href: "/sizing-guide", label: "Sizing Guide" },
    { href: "/faq", label: "FAQ" },
    { href: "/shipping-returns", label: "Shipping & Returns" },
    { href: "/contact", label: "Contact Us" },
  ],
  company: [
    { href: "/about", label: "About Us" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-espresso text-warm-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold text-ivory mb-4">
              DFR
            </h3>
            <p className="text-warm-white/60 text-sm leading-relaxed">
              Premium decorative floor registers that transform overlooked details
              into defining features of your home.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-label-sm uppercase text-brass mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-white/60 text-sm hover:text-brass transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-label-sm uppercase text-brass mb-4">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-white/60 text-sm hover:text-brass transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-label-sm uppercase text-brass mb-4">Contact</h4>
            <p className="text-warm-white/60 text-sm mb-1">+1 847-316-1395</p>
            <p className="text-warm-white/60 text-sm">deepakbrass@gmail.com</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-warm-white/10 text-center">
          <p className="text-warm-white/40 text-sm">
            &copy; {new Date().getFullYear()} Decorative Floor Register. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create ScrollReveal animation component**

Create `src/components/animations/ScrollReveal.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function ScrollReveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Create PageTransition wrapper**

Create `src/components/animations/PageTransition.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 6: Update root layout with Header, Footer, and CartProvider placeholder**

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Decorative Floor Register | Premium Floor Registers & Grilles",
    template: "%s | Decorative Floor Register",
  },
  description:
    "Handcrafted decorative floor registers in Art Deco, Contemporary, and Geometrical designs. Available in Antique Brass, Black, and Bronze finishes.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://decorativefloorregister.com"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Verify layout renders**

```bash
npm run dev
```

Open http://localhost:3000. Verify: sticky header with "DFR" logo, nav links, cart icon. Footer with columns. Warm ivory background throughout.
Expected: Full layout visible. Mobile hamburger works (slide-out drawer).

- [ ] **Step 8: Commit**

```bash
git add src/components/ src/app/layout.tsx
git commit -m "feat: add Header, Footer, MobileNav, and animation components"
```

---

## Phase 2: Storefront

### Task 5: Homepage

**Files:**
- Create: `src/components/home/Hero.tsx`, `src/components/home/CollectionShowcase.tsx`, `src/components/home/TrustStrip.tsx`, `src/components/home/FeaturedProducts.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Hero component with metallic effects**

Create `src/components/home/Hero.tsx` — full-width hero with metallic shimmer headline, animated brass background, CTA button with light sweep. Uses Framer Motion for entrance animations and cursor-tracking ambient glow. Left side: tagline + headline (with `text-metallic` on key word) + description + CTA. Right side: metallic brass gradient background with brushed metal texture overlay, animated light reflection, and a 3D-perspective register illustration using CSS grid.

- [ ] **Step 2: Create TrustStrip component**

Create `src/components/home/TrustStrip.tsx` — horizontal strip of 4 trust signals (Premium Steel / 1.5mm Gauge, 3 Collections, 3 Metallic Finishes, Free Shipping over $50). Each item has a metallic gradient icon circle, label, and value. Wrapped in ScrollReveal.

- [ ] **Step 3: Create CollectionShowcase component**

Create `src/components/home/CollectionShowcase.tsx` — 3-column grid showing Art Deco, Contemporary, and Geometrical collections. Each card has a metallic texture background matching the finish colors, a mini register CSS illustration, collection name, and "Explore" link. Cards lift on hover with light sweep effect. Fetches product data from Supabase to show real names/prices.

- [ ] **Step 4: Create FeaturedProducts component**

Create `src/components/home/FeaturedProducts.tsx` — grid of 6 product cards (2 per style). Each card shows: metallic gradient image area with finish dot, product style label, name, "From $X" price, and 3 finish swatches. Cards use the `light-sweep` CSS class for hover effect. Links to `/shop/[slug]`.

- [ ] **Step 5: Assemble homepage**

Update `src/app/page.tsx` to compose: Hero → TrustStrip → CollectionShowcase → FeaturedProducts. Use ScrollReveal on each section. Fetch products/styles from Supabase server client with ISR (revalidate: 3600).

- [ ] **Step 6: Verify homepage renders**

```bash
npm run dev
```

Expected: Full homepage with hero, trust strip, collections, and featured products. Metallic shimmer animation on headline. Cards lift on hover.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/ src/app/page.tsx
git commit -m "feat: add homepage with hero, collections, trust strip, and featured products"
```

---

### Task 6: Shop/Catalogue Page

**Files:**
- Create: `src/app/shop/page.tsx`, `src/components/shop/ProductCard.tsx`, `src/components/shop/FilterSidebar.tsx`, `src/components/shop/FilterMobile.tsx`, `src/components/shop/SearchBar.tsx`, `src/components/shop/SortSelect.tsx`, `src/hooks/useFilters.ts`

- [ ] **Step 1: Create useFilters hook**

Create `src/hooks/useFilters.ts` — reads URL search params (`style`, `finish`, `size`, `search`, `sort`, `page`), provides `filters` object and `setFilter(key, value)` function that updates URL params via `useRouter().replace()` without full page reload. Uses `useSearchParams()` and `usePathname()`.

- [ ] **Step 2: Create FilterSidebar component**

Create `src/components/shop/FilterSidebar.tsx` — desktop sidebar (hidden on mobile). Expandable accordion sections for: Style (Art Deco, Contemporary, Geometrical), Finish (with metallic gradient swatches), Size (2x10 through 6x14). Each option shows item count in parentheses. Uses `useFilters` hook. Active filters highlighted with brass accent.

- [ ] **Step 3: Create FilterMobile component**

Create `src/components/shop/FilterMobile.tsx` — bottom sheet triggered by "Filters" button. Uses Framer Motion slide-up animation. Same filter options as sidebar. Close button and "Apply" button.

- [ ] **Step 4: Create SearchBar component**

Create `src/components/shop/SearchBar.tsx` — text input with search icon, debounced (300ms) update to URL params via `useFilters`. Warm ivory styling with antique-gold focus ring.

- [ ] **Step 5: Create SortSelect component**

Create `src/components/shop/SortSelect.tsx` — styled select dropdown with options: Price Low-High, Price High-Low, Newest, Name A-Z. Updates URL params via `useFilters`.

- [ ] **Step 6: Create ProductCard component**

Create `src/components/shop/ProductCard.tsx` — card with: metallic gradient image area (based on primary finish), product image via Next.js `<Image>`, finish dot badge, light-sweep hover effect, product style label (uppercase, antique-gold), product name (Cormorant Garamond), "From $X" price (antique-gold), finish swatches row (3 metallic gradient circles). Links to `/shop/[slug]`. Uses `relative overflow-hidden` for the light sweep pseudo-element.

- [ ] **Step 7: Create Shop page**

Create `src/app/shop/page.tsx` — Server Component. Reads searchParams for filters. Queries Supabase for products with joins to styles, finishes, variants. Applies filters server-side. Returns: SearchBar + SortSelect top bar, FilterSidebar (desktop) + product grid (3 cols desktop, 2 mobile), FilterMobile button (mobile). Uses `generateMetadata` for SEO.

- [ ] **Step 8: Verify shop page with filters**

```bash
npm run dev
```

Navigate to `/shop`. Expected: product grid displays. Clicking filter options updates URL and filters products. Search works. Sort works.

- [ ] **Step 9: Commit**

```bash
git add src/app/shop/ src/components/shop/ src/hooks/useFilters.ts
git commit -m "feat: add shop page with filtering, search, and sort"
```

---

### Task 7: Product Detail Page

**Files:**
- Create: `src/app/shop/[slug]/page.tsx`, `src/components/product/ImageGallery.tsx`, `src/components/product/FinishSelector.tsx`, `src/components/product/SizeSelector.tsx`, `src/components/product/SpecsTable.tsx`, `src/components/product/RelatedProducts.tsx`, `src/components/product/AddToCart.tsx`

- [ ] **Step 1: Create ImageGallery component**

Create `src/components/product/ImageGallery.tsx` — client component. Large main image with zoom-on-hover (CSS transform scale on mousemove). Thumbnail strip below. Click thumbnail to switch main image. Images filtered by selected finish. Uses Next.js `<Image>` with priority on main image.

- [ ] **Step 2: Create FinishSelector component**

Create `src/components/product/FinishSelector.tsx` — client component. Row of metallic gradient circle swatches. Active swatch has brass border and scale(1.15). Clicking a swatch calls `onFinishChange(finishId)` to update images and available sizes. Shows finish name below swatches.

- [ ] **Step 3: Create SizeSelector component**

Create `src/components/product/SizeSelector.tsx` — client component. Button group of available sizes. Active size has espresso background with ivory text. Shows price next to each size button. Clicking calls `onSizeChange(sizeId)` to update displayed price. Disabled state for out-of-stock sizes (stock_qty === 0).

- [ ] **Step 4: Create SpecsTable component**

Create `src/components/product/SpecsTable.tsx` — two-column table showing: Material (Steel), Gauge (1.5mm), Damper (Adjustable multi-angle), Faceplate dimensions, Duct opening, Construction (Welded). Styled with linen background alternating rows.

- [ ] **Step 5: Create AddToCart button component**

Create `src/components/product/AddToCart.tsx` — client component. Quantity selector (- / number / +) and "Add to Cart" button. Button has espresso background, hover lifts with shadow. On click, adds item to cart context (to be wired in Task 9). Shows brief success animation (Framer Motion scale pulse).

- [ ] **Step 6: Create RelatedProducts component**

Create `src/components/product/RelatedProducts.tsx` — horizontal scroll row of 4 ProductCards. Shows products with the same style in different finishes, or same finish in different styles. Reuses `ProductCard` from shop.

- [ ] **Step 7: Create Product Detail page**

Create `src/app/shop/[slug]/page.tsx` — Server Component with `generateStaticParams` for SSG. Fetches product by slug with all relations (style, variants with finishes and sizes, images). Layout: 2-column (image gallery left, selectors + info right) on desktop, stacked on mobile. Includes JSON-LD structured data (Product schema). Uses `generateMetadata` for SEO title/description.

- [ ] **Step 8: Verify product detail page**

```bash
npm run dev
```

Navigate to `/shop/art-deco-floor-register`. Expected: image gallery, finish swatches (changing images), size buttons (changing price), specs table, add-to-cart button, related products.

- [ ] **Step 9: Commit**

```bash
git add src/app/shop/[slug]/ src/components/product/
git commit -m "feat: add product detail page with gallery, selectors, and specs"
```

---

## Phase 3: Cart & Checkout

### Task 8: Cart System

**Files:**
- Create: `src/context/CartContext.tsx`, `src/hooks/useCart.ts`, `src/app/cart/page.tsx`, `src/components/cart/CartItem.tsx`, `src/components/cart/CartSummary.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create CartContext**

Create `src/context/CartContext.tsx`:

```tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { CartItem } from "@/types";

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "dfr-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // Ignore parse errors
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.variantId !== variantId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
```

- [ ] **Step 2: Wire CartProvider into root layout**

Update `src/app/layout.tsx` — wrap `<body>` children with `<CartProvider>`:

```tsx
import { CartProvider } from "@/context/CartContext";

// ... in the return:
<body className="flex flex-col min-h-screen">
  <CartProvider>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </CartProvider>
</body>
```

- [ ] **Step 3: Update Header to show cart count**

Update `src/components/layout/Header.tsx` — import `useCartContext`, show badge with `itemCount` on the cart icon when > 0. Badge uses Framer Motion spring animation on count change.

- [ ] **Step 4: Create CartItem component**

Create `src/components/cart/CartItem.tsx` — displays: product image (64x64), product name, variant description (finish + size), unit price, quantity selector (- / number / +), line total, remove button. Uses `useCartContext` for updateQuantity and removeItem.

- [ ] **Step 5: Create CartSummary component**

Create `src/components/cart/CartSummary.tsx` — displays: subtotal, shipping estimate ("Free" if over $50, else flat rate from site_settings), estimated total. "Proceed to Checkout" button (posts to `/api/checkout`). Discount code input field.

- [ ] **Step 6: Create Cart page**

Create `src/app/cart/page.tsx` — client component. If cart empty, show "Your cart is empty" with link to shop. Otherwise: list of CartItem components, CartSummary on the right (desktop) or bottom (mobile).

- [ ] **Step 7: Wire AddToCart component to cart context**

Update `src/components/product/AddToCart.tsx` — import `useCartContext`, call `addItem` on click with the selected variant's data.

- [ ] **Step 8: Verify cart flow**

```bash
npm run dev
```

Navigate to a product → select finish + size → click "Add to Cart" → navigate to `/cart`. Expected: item appears in cart. Quantity +/- works. Remove works. Cart persists on page refresh.

- [ ] **Step 9: Commit**

```bash
git add src/context/ src/hooks/ src/components/cart/ src/app/cart/ src/app/layout.tsx src/components/layout/Header.tsx src/components/product/AddToCart.tsx
git commit -m "feat: add cart system with localStorage persistence"
```

---

### Task 9: Stripe Checkout & Order Creation

**Files:**
- Create: `src/app/api/checkout/route.ts`, `src/app/api/webhooks/stripe/route.ts`, `src/app/checkout/success/page.tsx`, `src/app/checkout/cancel/page.tsx`

- [ ] **Step 1: Create Checkout API route**

Create `src/app/api/checkout/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  variantId: string;
  quantity: number;
};

type CheckoutBody = {
  items: CheckoutItem[];
  discountCode?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();
    const supabase = createAdminClient();

    // Validate and fetch variant data
    const variantIds = body.items.map((i) => i.variantId);
    const { data: variants, error } = await supabase
      .from("product_variants")
      .select(
        `*, product:products(name, slug), finish:finishes(name), size:sizes(label)`
      )
      .in("id", variantIds)
      .eq("active", true);

    if (error || !variants?.length) {
      return NextResponse.json(
        { error: "Invalid items" },
        { status: 400 }
      );
    }

    // Check stock
    for (const item of body.items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found` },
          { status: 400 }
        );
      }
      if (variant.stock_qty !== null && variant.stock_qty < item.quantity) {
        return NextResponse.json(
          { error: `${variant.product.name} (${variant.size.label}) is out of stock` },
          { status: 400 }
        );
      }
    }

    // Build Stripe line items
    const lineItems = body.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      return {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(variant.price * 100),
          product_data: {
            name: `${variant.product.name} - ${variant.finish.name} - ${variant.size.label}`,
            metadata: { variant_id: variant.id },
          },
        },
        quantity: item.quantity,
      };
    });

    // Handle discount code
    const discounts: { coupon: string }[] = [];
    if (body.discountCode) {
      const { data: discount } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", body.discountCode.toUpperCase())
        .eq("active", true)
        .single();

      if (
        discount &&
        (discount.max_uses === null || discount.times_used < discount.max_uses) &&
        (discount.expires_at === null || new Date(discount.expires_at) > new Date())
      ) {
        // Create Stripe coupon on the fly
        const coupon = await stripe.coupons.create(
          discount.type === "percentage"
            ? { percent_off: discount.value, duration: "once" }
            : { amount_off: Math.round(discount.value * 100), currency: "usd", duration: "once" }
        );
        discounts.push({ coupon: coupon.id });
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      discounts: discounts.length ? discounts : undefined,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        variant_ids: JSON.stringify(
          body.items.map((i) => ({ id: i.variantId, qty: i.quantity }))
        ),
        discount_code: body.discountCode || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create Stripe Webhook route**

Create `src/app/api/webhooks/stripe/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  const shipping = session.shipping_details;
  const customerEmail = session.customer_details?.email || "";
  const customerName = session.customer_details?.name || "";

  // Parse variant data from metadata
  const variantData: { id: string; qty: number }[] = JSON.parse(
    session.metadata?.variant_ids || "[]"
  );

  // Fetch variants with product info
  const { data: variants } = await supabase
    .from("product_variants")
    .select(`*, product:products(name), finish:finishes(name), size:sizes(label)`)
    .in("id", variantData.map((v) => v.id));

  if (!variants) return;

  // Find or create customer
  let customerId: string | null = null;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", customerEmail)
    .single();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({ email: customerEmail, name: customerName })
      .select("id")
      .single();
    customerId = newCustomer?.id || null;
  }

  // Calculate totals
  const subtotal = variantData.reduce((sum, vd) => {
    const variant = variants.find((v) => v.id === vd.id);
    return sum + (variant ? variant.price * vd.qty : 0);
  }, 0);

  const discountAmount = session.total_details?.amount_discount
    ? session.total_details.amount_discount / 100
    : 0;

  const total = (session.amount_total || 0) / 100;
  const shippingCost = (session.shipping_cost?.amount_total || 0) / 100;

  // Create order
  const { data: order } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: {
        line1: shipping?.address?.line1 || "",
        line2: shipping?.address?.line2 || "",
        city: shipping?.address?.city || "",
        state: shipping?.address?.state || "",
        zip: shipping?.address?.postal_code || "",
        country: shipping?.address?.country || "US",
      },
      status: "paid",
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
      subtotal,
      discount_amount: discountAmount,
      discount_code: session.metadata?.discount_code || null,
      shipping_cost: shippingCost,
      tax: 0,
      total,
    })
    .select("id")
    .single();

  if (!order) return;

  // Create order items and decrement stock
  for (const vd of variantData) {
    const variant = variants.find((v) => v.id === vd.id)!;
    await supabase.from("order_items").insert({
      order_id: order.id,
      variant_id: vd.id,
      product_name: variant.product.name,
      variant_desc: `${variant.product.name} / ${variant.finish.name} / ${variant.size.label}`,
      quantity: vd.qty,
      unit_price: variant.price,
      total_price: variant.price * vd.qty,
    });

    // Decrement stock if tracked
    if (variant.stock_qty !== null) {
      await supabase
        .from("product_variants")
        .update({ stock_qty: variant.stock_qty - vd.qty })
        .eq("id", vd.id);
    }
  }

  // Increment discount code usage
  if (session.metadata?.discount_code) {
    await supabase.rpc("increment_discount_usage", {
      code_value: session.metadata.discount_code,
    });
  }

  // Send order confirmation email
  try {
    await resend.emails.send({
      from: "DFR <orders@decorativefloorregister.com>",
      to: customerEmail,
      subject: `Order Confirmed — ${order.id.slice(0, 8).toUpperCase()}`,
      html: `<h1>Thank you for your order!</h1><p>We've received your order and will ship it soon.</p>`,
    });
  } catch (emailErr) {
    console.error("Failed to send order email:", emailErr);
  }

  // Notify admin
  try {
    await resend.emails.send({
      from: "DFR <orders@decorativefloorregister.com>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Order — $${total.toFixed(2)} from ${customerName}`,
      html: `<p>New order received: ${variantData.length} items, $${total.toFixed(2)}</p>`,
    });
  } catch (emailErr) {
    console.error("Failed to send admin notification:", emailErr);
  }
}
```

- [ ] **Step 3: Create Checkout Success page**

Create `src/app/checkout/success/page.tsx` — client component. Reads `session_id` from URL params. Displays "Order Confirmed" with checkmark animation. Clears cart via `useCartContext().clearCart()`. Shows order summary and "Continue Shopping" link.

- [ ] **Step 4: Create Checkout Cancel page**

Create `src/app/checkout/cancel/page.tsx` — simple page with "Checkout cancelled" message, "Return to Cart" link, and "Continue Shopping" link.

- [ ] **Step 5: Wire CartSummary checkout button**

Update `src/components/cart/CartSummary.tsx` — on "Proceed to Checkout" click, POST to `/api/checkout` with cart items and discount code. On success, redirect to `response.url` (Stripe Checkout). Show loading state during request.

- [ ] **Step 6: Create discount usage increment function in Supabase**

Add to a new migration `supabase/migrations/00004_discount_rpc.sql`:

```sql
CREATE OR REPLACE FUNCTION increment_discount_usage(code_value text)
RETURNS void AS $$
  UPDATE discount_codes
  SET times_used = times_used + 1
  WHERE code = code_value;
$$ LANGUAGE sql SECURITY DEFINER;
```

- [ ] **Step 7: Set up Stripe webhook locally for testing**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

- [ ] **Step 8: Test full checkout flow**

Add item to cart → proceed to checkout → complete Stripe test payment (card 4242 4242 4242 4242) → verify redirect to success page → verify order created in Supabase `orders` table.

- [ ] **Step 9: Commit**

```bash
git add src/app/api/ src/app/checkout/ src/components/cart/CartSummary.tsx supabase/migrations/00004_discount_rpc.sql
git commit -m "feat: add Stripe checkout, webhook order creation, and checkout pages"
```

---

## Phase 4: Admin Panel

### Task 10: Admin Auth & Layout

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`, `src/components/admin/AdminSidebar.tsx`, `src/components/admin/AdminGuard.tsx`, `src/hooks/useAdmin.ts`

- [ ] **Step 1: Create useAdmin hook**

Create `src/hooks/useAdmin.ts` — uses Supabase browser client to check auth state. Returns `{ user, isAdmin, loading, signIn, signOut }`. `signIn` uses `supabase.auth.signInWithPassword`. `isAdmin` checks `admin_users` table for the logged-in user's ID.

- [ ] **Step 2: Create AdminGuard component**

Create `src/components/admin/AdminGuard.tsx` — wrapper that checks `useAdmin()`. If loading, shows spinner. If not authenticated, redirects to `/admin/login`. If authenticated but not admin, shows "Access Denied". Otherwise renders children.

- [ ] **Step 3: Create AdminSidebar component**

Create `src/components/admin/AdminSidebar.tsx` — fixed 240px sidebar with: DFR logo (links to `/`), nav sections (Dashboard, Products with expandable sub-items, Orders, Customers, Discounts, Content, Settings). Active link highlighted with brass accent. Logout button at bottom. Clean, functional styling — no fancy animations.

- [ ] **Step 4: Create Admin layout**

Create `src/app/admin/layout.tsx`:

```tsx
"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-linen">
        <AdminSidebar />
        <main className="flex-1 ml-60 p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
```

- [ ] **Step 5: Create Admin Login page**

Create `src/app/admin/login/page.tsx` — standalone page (no sidebar). Email + password form. Uses `useAdmin().signIn`. On success, redirects to `/admin`. Error display for invalid credentials. Styled with centered card on ivory background.

Note: This page needs its own layout that skips AdminGuard. Create `src/app/admin/login/layout.tsx` that returns just `{children}` without the admin wrapper.

- [ ] **Step 6: Verify admin auth flow**

Create a test admin user: in Supabase Dashboard → Authentication → Users → create user. Then in SQL Editor, insert into `admin_users` with that user's ID.

```bash
npm run dev
```

Navigate to `/admin`. Expected: redirected to `/admin/login`. Login with credentials → redirected to `/admin` dashboard area.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/ src/components/admin/ src/hooks/useAdmin.ts
git commit -m "feat: add admin authentication, layout, and sidebar"
```

---

### Task 11: Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Create Admin Dashboard page**

Create `src/app/admin/page.tsx` — client component. Fetches from Supabase: order count + revenue for today/week/month, last 10 orders, variants with stock_qty < 5. Displays: 4 stat cards (orders today, revenue today, orders this week, revenue this month), recent orders table (date, customer, total, status badge), low stock alerts list. Status badges use color coding: paid=green, shipped=blue, delivered=gray, cancelled=red.

- [ ] **Step 2: Verify dashboard**

Login to admin → dashboard shows stats and recent orders.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: add admin dashboard with stats, recent orders, and stock alerts"
```

---

### Task 12: Admin Product Management

**Files:**
- Create: `src/app/admin/products/page.tsx`, `src/app/admin/products/[id]/page.tsx`, `src/app/admin/categories/page.tsx`, `src/app/admin/styles/page.tsx`, `src/app/admin/finishes/page.tsx`, `src/app/admin/sizes/page.tsx`, `src/components/admin/DataTable.tsx`, `src/components/admin/ProductForm.tsx`, `src/components/admin/VariantManager.tsx`, `src/components/admin/ImageUploader.tsx`, `src/app/api/admin/products/route.ts`, `src/app/api/admin/products/[id]/route.ts`, `src/app/api/admin/variants/route.ts`, `src/app/api/admin/variants/bulk-price/route.ts`, `src/app/api/admin/categories/route.ts`, `src/app/api/admin/styles/route.ts`, `src/app/api/admin/finishes/route.ts`, `src/app/api/admin/sizes/route.ts`, `src/app/api/admin/upload/route.ts`, `src/lib/admin-auth.ts`

- [ ] **Step 1: Create admin auth middleware helper**

Create `src/lib/admin-auth.ts`:

```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!adminUser) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), user: null };
  }

  return { error: null, user };
}
```

- [ ] **Step 2: Create DataTable reusable component**

Create `src/components/admin/DataTable.tsx` — generic table component accepting: columns config (key, label, render function), data array, search input, sort by column click, pagination (20 per page), bulk select checkboxes. Clean functional styling with linen row stripes.

- [ ] **Step 3: Create admin API routes for product attributes**

Create CRUD API routes for categories, styles, finishes, sizes. Each follows the same pattern:
- `GET`: list all (include inactive for admin)
- `POST`: create new
- `PUT`: update existing
- `DELETE`: soft-delete (set active=false)

All routes call `requireAdmin()` first. Example pattern for `src/app/api/admin/categories/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("categories")
    .insert(body)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

Repeat this pattern for styles, finishes, sizes routes.

- [ ] **Step 4: Create image upload API route**

Create `src/app/api/admin/upload/route.ts` — accepts multipart form data. Uploads file to Supabase Storage `product-images` bucket. Returns the public URL. Validates file type (webp/jpeg/png) and size (< 5MB).

- [ ] **Step 5: Create admin attribute pages**

Create pages for `/admin/categories`, `/admin/styles`, `/admin/finishes`, `/admin/sizes`. Each uses DataTable to list items, modal form to create/edit, delete button. Finishes page includes hex color picker and gradient CSS preview.

- [ ] **Step 6: Create Products API routes**

Create `src/app/api/admin/products/route.ts` (GET list, POST create) and `src/app/api/admin/products/[id]/route.ts` (GET detail, PUT update, DELETE). Product GET includes relations (style, category, variants, images).

Create `src/app/api/admin/variants/route.ts` — POST to bulk-create variants for a product (accepts arrays of finish_ids and size_ids, generates all combinations).

Create `src/app/api/admin/variants/bulk-price/route.ts` — PATCH to update price on multiple variant IDs.

- [ ] **Step 7: Create ImageUploader component**

Create `src/components/admin/ImageUploader.tsx` — drag-and-drop zone. Shows previews of uploaded images. Reorder via drag. Set primary image. Delete images. Calls `/api/admin/upload` on drop, stores returned URLs.

- [ ] **Step 8: Create VariantManager component**

Create `src/components/admin/VariantManager.tsx` — shows grid of all variants for a product. Bulk generate button (select finishes + sizes → creates missing combinations). Inline price editing. Stock qty editing. Active/inactive toggle per variant. Bulk price update (select variants → set new price or adjust by %).

- [ ] **Step 9: Create ProductForm component**

Create `src/components/admin/ProductForm.tsx` — form with: name, slug (auto-generated from name), category select, style select, description textarea, SEO fields (meta title, meta description). Below the basic form: VariantManager component and ImageUploader component (per finish tab).

- [ ] **Step 10: Create Products list and detail pages**

Create `src/app/admin/products/page.tsx` — DataTable of products with columns: name, category, style, variant count, base price, status. "Add Product" button opens new product form.

Create `src/app/admin/products/[id]/page.tsx` — ProductForm loaded with existing product data. Save button PUTs to API.

- [ ] **Step 11: Verify product management**

Login to admin → Products → create a product, add variants, upload images, set prices. Edit existing product. Verify data in Supabase.

- [ ] **Step 12: Commit**

```bash
git add src/app/admin/products/ src/app/admin/categories/ src/app/admin/styles/ src/app/admin/finishes/ src/app/admin/sizes/ src/components/admin/ src/app/api/admin/ src/lib/admin-auth.ts
git commit -m "feat: add admin product management with CRUD, variants, and image upload"
```

---

### Task 13: Admin Orders, Customers, Discounts, Content & Settings

**Files:**
- Create: `src/app/admin/orders/page.tsx`, `src/app/admin/orders/[id]/page.tsx`, `src/app/admin/customers/page.tsx`, `src/app/admin/customers/[id]/page.tsx`, `src/app/admin/discounts/page.tsx`, `src/app/admin/content/page.tsx`, `src/app/admin/settings/page.tsx`, `src/app/api/admin/orders/route.ts`, `src/app/api/admin/orders/[id]/route.ts`, `src/app/api/admin/customers/route.ts`, `src/app/api/admin/customers/[id]/route.ts`, `src/app/api/admin/discounts/route.ts`, `src/app/api/admin/content/route.ts`, `src/app/api/admin/settings/route.ts`, `src/app/api/admin/export/orders/route.ts`

- [ ] **Step 1: Create Orders API routes and pages**

API: `src/app/api/admin/orders/route.ts` — GET with status filter, date range, search by customer name/email. Returns orders with order_items joined.

API: `src/app/api/admin/orders/[id]/route.ts` — GET detail (order + items + customer), PATCH to update status and tracking_number. When status changes to "shipped" and tracking_number is provided, send shipping notification email via Resend.

Page: `src/app/admin/orders/page.tsx` — DataTable with columns: order #, date, customer, items count, total, status badge. Filter tabs: All, Pending, Paid, Shipped, Delivered, Cancelled.

Page: `src/app/admin/orders/[id]/page.tsx` — order detail view. Customer info, shipping address, items list, totals breakdown. Status update dropdown + tracking number input + "Update" button. Notes textarea for admin-only notes.

- [ ] **Step 2: Create Customers API routes and pages**

API: `src/app/api/admin/customers/route.ts` — GET with search, pagination. Returns customers with order count and total spent (aggregated).

API: `src/app/api/admin/customers/[id]/route.ts` — GET customer detail with addresses and order history.

Page: `src/app/admin/customers/page.tsx` — DataTable with columns: name, email, orders count, total spent, joined date.

Page: `src/app/admin/customers/[id]/page.tsx` — customer detail with contact info, addresses, and order history table.

- [ ] **Step 3: Create Discounts API routes and page**

API: `src/app/api/admin/discounts/route.ts` — full CRUD. GET lists all codes. POST creates new code. PUT updates. DELETE deactivates.

Page: `src/app/admin/discounts/page.tsx` — DataTable with columns: code, type (% or $), value, usage (times_used/max_uses), expires, status. Create/edit modal form with: code input, type radio (percentage/fixed), value input, min order total, max uses, expiry date picker.

- [ ] **Step 4: Create Content API routes and page**

API: `src/app/api/admin/content/route.ts` — GET returns all content blocks grouped by page. PUT updates a specific content block by id.

Page: `src/app/admin/content/page.tsx` — tabs for each page (Homepage, About, FAQ, Sizing Guide, Shipping & Returns). Each tab shows the content blocks for that page as editable forms: title input, body textarea (with basic formatting), image upload. Preview button opens the page in a new tab. Save button per section.

- [ ] **Step 5: Create Settings API routes and page**

API: `src/app/api/admin/settings/route.ts` — GET returns all settings. PUT updates a setting by key.

Page: `src/app/admin/settings/page.tsx` — form sections: Shipping (flat rate input, free shipping threshold input), Contact (phone, email, address), Admin Users (list current admins, invite new admin by email form).

- [ ] **Step 6: Create Order Export API**

Create `src/app/api/admin/export/orders/route.ts` — GET with query params: status, date_from, date_to. Returns CSV file with headers: Order ID, Date, Customer Name, Email, Items, Subtotal, Discount, Shipping, Total, Status, Tracking Number. Sets `Content-Type: text/csv` and `Content-Disposition: attachment`.

- [ ] **Step 7: Verify all admin sections**

Navigate through each admin section. Create/edit/delete in each. Export an orders CSV. Edit content and verify it shows on the public page.

- [ ] **Step 8: Commit**

```bash
git add src/app/admin/ src/app/api/admin/
git commit -m "feat: add admin orders, customers, discounts, content, settings, and CSV export"
```

---

## Phase 5: Content, Email, SEO & Polish

### Task 14: Static Content Pages

**Files:**
- Create: `src/app/about/page.tsx`, `src/app/faq/page.tsx`, `src/app/sizing-guide/page.tsx`, `src/app/contact/page.tsx`, `src/app/shipping-returns/page.tsx`, `src/app/api/contact/route.ts`

- [ ] **Step 1: Create About page**

Create `src/app/about/page.tsx` — Server Component. Fetches content blocks for "about" page from Supabase. Renders: hero section with headline, manufacturing story, quality commitment, team/heritage section. Uses ScrollReveal for sections. ISR revalidate 3600.

- [ ] **Step 2: Create FAQ page**

Create `src/app/faq/page.tsx` — Server Component. Fetches FAQ content blocks ordered by display_order. Renders accordion-style Q&A using Framer Motion for expand/collapse animation. Categories: Ordering, Sizing, Shipping, Returns, Product Care.

- [ ] **Step 3: Create Sizing Guide page**

Create `src/app/sizing-guide/page.tsx` — Server Component. Visual guide with: "How to measure your duct opening" instructions with diagram placeholder, common sizes table (size label, duct opening dimensions, faceplate dimensions), tips for choosing the right size. Uses ScrollReveal.

- [ ] **Step 4: Create Contact page**

Create `src/app/contact/page.tsx` — client component. Contact form (name, email, subject, message) + contact info sidebar (phone, email, hours). Form submits to `/api/contact`.

Create `src/app/api/contact/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "DFR Contact <contact@decorativefloorregister.com>",
      to: process.env.ADMIN_EMAIL!,
      replyTo: email,
      subject: `Contact Form: ${subject || "General Inquiry"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Create Shipping & Returns page**

Create `src/app/shipping-returns/page.tsx` — Server Component. Fetches content blocks for "shipping-returns" page. Renders shipping policy, delivery estimates, return policy, exchange process. Clean typography with section headers.

- [ ] **Step 6: Verify all content pages**

Navigate to each page. Verify content renders from Supabase content blocks. Contact form sends email.

- [ ] **Step 7: Commit**

```bash
git add src/app/about/ src/app/faq/ src/app/sizing-guide/ src/app/contact/ src/app/shipping-returns/ src/app/api/contact/
git commit -m "feat: add static content pages and contact form"
```

---

### Task 15: SEO, Sitemap & Structured Data

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/product/ProductJsonLd.tsx`
- Modify: `src/app/shop/[slug]/page.tsx`, various pages for `generateMetadata`

- [ ] **Step 1: Create sitemap**

Create `src/app/sitemap.ts`:

```ts
import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://decorativefloorregister.com";

  // Fetch all active products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("active", true);

  const productUrls = (products || []).map((p) => ({
    url: `${baseUrl}/shop/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/shop`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/sizing-guide`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/shipping-returns`, changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  return [...staticPages, ...productUrls];
}
```

- [ ] **Step 2: Create robots.txt**

Create `src/app/robots.ts`:

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://decorativefloorregister.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Create Product JSON-LD component**

Create `src/components/product/ProductJsonLd.tsx`:

```tsx
import type { ProductWithRelations } from "@/types";

type Props = {
  product: ProductWithRelations;
};

export function ProductJsonLd({ product }: Props) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const primaryImage = product.images.find((i) => i.is_primary)?.image_url;
  const inStock = product.variants.some(
    (v) => v.stock_qty === null || v.stock_qty > 0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: primaryImage,
    brand: {
      "@type": "Brand",
      name: "Decorative Floor Register",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: minPrice.toFixed(2),
      highPrice: maxPrice.toFixed(2),
      priceCurrency: "USD",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      offerCount: product.variants.length,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 4: Add generateMetadata to product detail page**

Update `src/app/shop/[slug]/page.tsx` to export a `generateMetadata` function that fetches the product and returns title, description, and Open Graph data.

- [ ] **Step 5: Add generateMetadata to all other pages**

Add `generateMetadata` to: `/shop/page.tsx`, `/about/page.tsx`, `/faq/page.tsx`, `/sizing-guide/page.tsx`, `/contact/page.tsx`, `/shipping-returns/page.tsx`. Each fetches meta_title/meta_description from content_blocks if available, otherwise uses sensible defaults.

- [ ] **Step 6: Verify SEO**

```bash
npm run build
```

Check `/sitemap.xml` and `/robots.txt` in browser. View page source on product page — verify JSON-LD is present. Check `<title>` and `<meta name="description">` on each page.

- [ ] **Step 7: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/components/product/ProductJsonLd.tsx src/app/shop/ src/app/about/ src/app/faq/ src/app/sizing-guide/ src/app/contact/ src/app/shipping-returns/
git commit -m "feat: add SEO — sitemap, robots.txt, JSON-LD, and metadata on all pages"
```

---

### Task 16: Data Seed Script

**Files:**
- Create: `scripts/seed.ts`, `scripts/tsconfig.json`

- [ ] **Step 1: Create seed script tsconfig**

Create `scripts/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "paths": { "@/*": ["../src/*"] }
  },
  "include": ["./**/*.ts"]
}
```

- [ ] **Step 2: Create seed script**

Create `scripts/seed.ts` — uses Supabase admin client (reads env from `.env.local`). Steps:

1. **Seed categories:** Insert "Floor Registers" with slug "floor-registers"
2. **Seed styles:** Insert Art Deco, Contemporary, Geometrical with slugs and descriptions
3. **Seed finishes:** Insert Antique Brass (hex: #c9a96e, gradient_css), Black (#2c2420), Bronze (#8b6f3a)
4. **Seed sizes:** Insert 2x10, 2x12, 2x14, 4x10, 4x12, 4x14, 6x10, 6x12, 6x14 with width/height numeric values
5. **Seed products:** Insert 3 products (Art Deco Floor Register, Contemporary Floor Register, Geometrical Floor Register) linked to Floor Registers category and respective styles
6. **Seed variants:** For each product x finish x size, create variant with SKU (e.g. "AD-AB-2X10") and size-based pricing:
   - 2x_ sizes: $9.90
   - 4x_ sizes: $14.90
   - 6x_ sizes: $19.90
7. **Seed images:** Read file listing from `Compressed 40kb Images-decorative-floor-registers/` directory, upload each WebP to Supabase Storage, create product_images rows mapped to correct product + finish. Set first image per product+finish as primary.
8. **Seed content:** Insert content_blocks for homepage hero, about page, FAQ entries, sizing guide
9. **Seed settings:** Insert site_settings: shipping_flat_rate ($5.99), free_shipping_threshold ($50), contact_email, contact_phone
10. **Seed admin user:** Prompt for email, create Supabase Auth user, insert into admin_users

Add a `seed` script to `package.json`:

```json
"scripts": {
  "seed": "npx tsx scripts/seed.ts"
}
```

Install tsx:

```bash
npm install -D tsx
```

- [ ] **Step 3: Run seed script**

```bash
npm run seed
```

Verify in Supabase Dashboard: all tables populated, images in storage bucket.

- [ ] **Step 4: Verify seeded data on frontend**

```bash
npm run dev
```

Navigate to homepage — featured products show real data and images. Shop page shows all 3 products with real images and prices. Product detail shows image gallery with real photos.

- [ ] **Step 5: Commit**

```bash
git add scripts/ package.json
git commit -m "feat: add data seed script for products, variants, images, and content"
```

---

### Task 17: Email Templates

**Files:**
- Create: `src/lib/email-templates.ts`
- Modify: `src/app/api/webhooks/stripe/route.ts`, `src/app/api/admin/orders/[id]/route.ts`

- [ ] **Step 1: Create branded email templates**

Create `src/lib/email-templates.ts`:

```ts
type OrderEmailData = {
  orderId: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};

type ShippingEmailData = {
  orderId: string;
  customerName: string;
  trackingNumber: string;
};

const baseStyle = `
  font-family: 'Georgia', serif;
  background-color: #faf6f1;
  color: #2c2420;
  padding: 40px 20px;
`;

const headerStyle = `
  text-align: center;
  font-size: 24px;
  color: #2c2420;
  margin-bottom: 8px;
`;

const accentStyle = `color: #9a7b4f;`;

export function orderConfirmationEmail(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #f0ebe4;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #f0ebe4;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #f0ebe4;text-align:right;">$${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="${baseStyle}">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px;">
        <h1 style="${headerStyle}">DFR</h1>
        <p style="text-align:center;${accentStyle}font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px;">Order Confirmation</p>

        <p>Hi ${data.customerName},</p>
        <p>Thank you for your order! We're preparing it for shipment.</p>

        <p style="font-size:13px;${accentStyle}">Order #${data.orderId.slice(0, 8).toUpperCase()}</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="border-bottom:2px solid #f0ebe4;">
              <th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;${accentStyle}">Item</th>
              <th style="padding:8px;text-align:center;font-size:12px;text-transform:uppercase;${accentStyle}">Qty</th>
              <th style="padding:8px;text-align:right;font-size:12px;text-transform:uppercase;${accentStyle}">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right;margin-top:16px;">
          <p style="margin:4px 0;">Subtotal: $${data.subtotal.toFixed(2)}</p>
          ${data.discount > 0 ? `<p style="margin:4px 0;${accentStyle}">Discount: -$${data.discount.toFixed(2)}</p>` : ""}
          <p style="margin:4px 0;">Shipping: ${data.shipping === 0 ? "Free" : "$" + data.shipping.toFixed(2)}</p>
          <p style="margin:4px 0;font-size:18px;font-weight:bold;">Total: $${data.total.toFixed(2)}</p>
        </div>

        <hr style="border:none;border-top:1px solid #f0ebe4;margin:24px 0;">
        <p style="font-size:13px;color:#6b5d52;text-align:center;">Questions? Reply to this email or call +1 847-316-1395</p>
      </div>
    </div>
  `;
}

export function shippingNotificationEmail(data: ShippingEmailData): string {
  return `
    <div style="${baseStyle}">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:40px;">
        <h1 style="${headerStyle}">DFR</h1>
        <p style="text-align:center;${accentStyle}font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px;">Your Order Has Shipped</p>

        <p>Hi ${data.customerName},</p>
        <p>Great news — your order is on its way!</p>

        <div style="background:#f5efe8;padding:20px;border-radius:8px;margin:20px 0;">
          <p style="margin:0;font-size:13px;${accentStyle}text-transform:uppercase;letter-spacing:1px;">Tracking Number</p>
          <p style="margin:8px 0 0;font-size:18px;font-weight:bold;">${data.trackingNumber}</p>
        </div>

        <p style="font-size:13px;color:#6b5d52;">Order #${data.orderId.slice(0, 8).toUpperCase()}</p>

        <hr style="border:none;border-top:1px solid #f0ebe4;margin:24px 0;">
        <p style="font-size:13px;color:#6b5d52;text-align:center;">Questions? Reply to this email or call +1 847-316-1395</p>
      </div>
    </div>
  `;
}
```

- [ ] **Step 2: Update webhook to use branded email template**

Update `src/app/api/webhooks/stripe/route.ts` — replace the inline HTML in the order confirmation email with `orderConfirmationEmail()` from the templates file, passing the real order data.

- [ ] **Step 3: Update order status API to send shipping email**

Update `src/app/api/admin/orders/[id]/route.ts` — when PATCH sets status to "shipped" and tracking_number is provided, send email using `shippingNotificationEmail()`.

- [ ] **Step 4: Verify emails**

Test checkout flow → check email (or Resend dashboard) for branded order confirmation. Update order to shipped in admin → check email for shipping notification.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email-templates.ts src/app/api/webhooks/stripe/route.ts src/app/api/admin/orders/
git commit -m "feat: add branded email templates for order confirmation and shipping"
```

---

### Task 18: Final Polish & Deployment

**Files:**
- Modify: `next.config.ts`
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create custom 404 page**

Create `src/app/not-found.tsx` — styled "Page not found" with DFR branding. Warm ivory background, Cormorant Garamond heading, "Return Home" and "Browse Shop" links.

- [ ] **Step 2: Configure Next.js for production**

Update `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Add .superpowers to .gitignore**

Append to `.gitignore`:

```
# Brainstorming sessions
.superpowers/
```

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Fix any build errors. Expected: clean build with no warnings.

- [ ] **Step 5: Deploy to Vercel**

```bash
npx vercel --prod
```

Or connect the GitHub repo in Vercel Dashboard for auto-deploy. Set environment variables in Vercel: all keys from `.env.local.example`.

- [ ] **Step 6: Configure Stripe webhook for production**

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://decorativefloorregister.com/api/webhooks/stripe`
- Events: `checkout.session.completed`
- Copy the webhook signing secret to Vercel env vars.

- [ ] **Step 7: Verify production deployment**

Visit the live URL. Test: homepage loads, shop page filters work, product detail displays images, add to cart, checkout flow completes, admin login works.

- [ ] **Step 8: Commit any remaining changes**

```bash
git add -A
git commit -m "feat: add 404 page, production config, and deployment setup"
git push origin main
```

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Foundation | 1-4 | Running Next.js app with DB schema, types, layout components |
| 2: Storefront | 5-7 | Homepage, shop with filters, product detail pages |
| 3: Cart & Checkout | 8-9 | Cart system, Stripe checkout, order creation |
| 4: Admin Panel | 10-13 | Full admin panel with product/order/content management |
| 5: Content & Polish | 14-18 | Content pages, SEO, email templates, seed data, deployment |

**Total: 18 tasks** — each task produces a working, committable increment.
