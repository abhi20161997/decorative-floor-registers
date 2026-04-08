# Decorative Floor Register — Website Redesign Design Spec

**Date:** April 9, 2026
**Domain:** decorativefloorregister.com
**Brand:** DFR / Decorative Floor Register
**Market:** US-only, USD pricing

---

## 1. Overview

Full e-commerce website rebuild for Decorative Floor Register, replacing the old slow WooCommerce site. The new site is a modern, award-winning quality storefront for premium decorative floor registers, built for US homeowners and hardware professionals.

**Business model:** Direct-to-consumer e-commerce. Self-fulfilled shipping. Full online checkout with Stripe.

**Target audience:**
- Middle-aged to older US homeowners doing renovations or new construction
- Hardware professionals, contractors, builders
- Both groups value trust, clarity, readability, and easy navigation

**Launch catalog:** ~81 SKUs (3 styles x 3 finishes x 9 sizes), scalable to thousands.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend & API | Next.js 15 (App Router) on Vercel | SSR/SSG for SEO, React ecosystem, Vercel edge caching |
| Database & Auth | Supabase (Postgres + Auth + Storage) | Relational data, RLS, built-in auth, image storage, self-hostable |
| Payments | Stripe Checkout (redirect-based) | PCI compliant out of box, gold standard for US e-commerce |
| Email | Resend | Transactional emails, simple API, free tier sufficient |
| Styling | Tailwind CSS v4 | Utility-first, custom theme tokens for Warm Ivory palette |
| Animations | Framer Motion | Scroll reveals, page transitions, metallic effects |
| Deployment | Vercel (auto-deploy from GitHub) | Zero-config Next.js hosting, CDN, image optimization |

---

## 3. Visual Design Direction

**Theme: Warm Ivory + Premium Metallic Effects**

A warm, luxurious, and highly readable design that makes product photography the star. Premium feel without sacrificing usability for older demographics.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Ivory (bg-primary) | `#faf6f1` | Page backgrounds |
| Linen (bg-secondary) | `#f0ebe4` | Card backgrounds, sections |
| Espresso (text-primary) | `#2c2420` | Headings, primary text |
| Umber (text-secondary) | `#6b5d52` | Body text, descriptions |
| Antique Gold (accent) | `#9a7b4f` | Labels, taglines, accents |
| Brass (accent-bright) | `#c9a96e` | CTAs, metallic gradients, highlights |
| Warm White (surface) | `#f5efe8` | Feature strips, hover states |

### Metallic Finish Colors (product-specific)

| Finish | Gradient | Usage |
|--------|----------|-------|
| Antique Brass | `linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)` | Product cards, swatches, textures |
| Matte Black | `linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)` | Product cards, swatches, textures |
| Oil Rubbed Bronze | `linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)` | Product cards, swatches, textures |

### Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display/Headings | Cormorant Garamond | 36–56px | 500 |
| Navigation/Labels | Inter | 11–13px | 400–500, letter-spacing 1.5–3px, uppercase |
| Body | Inter | 16px+ | 300–400, line-height 1.7–1.8 |
| Prices | Inter | 15px | 500 |

Body text minimum 16px with high contrast ratio (WCAG AA+) for readability across all age groups.

### Animation Patterns

All animations respect `prefers-reduced-motion` OS preference.

| Effect | Where | Implementation |
|--------|-------|---------------|
| Metallic shimmer | Hero headline, CTA buttons | CSS `background-size` animation on gradient text |
| Brushed metal texture | Product image backgrounds, hero right panel | CSS repeating-linear-gradient overlay |
| Light reflection | Hero metallic panel | Animated radial-gradient with opacity shift |
| Scroll reveal | All sections on scroll entry | Framer Motion `whileInView`, staggered fade-slide-up |
| Card lift + light sweep | Product cards on hover | translateY + sweeping linear-gradient pseudo-element |
| Page transitions | Route changes | Framer Motion `AnimatePresence` cross-fade |
| Parallax depth | Homepage hero, collection headers | Framer Motion `useScroll` + `useTransform` |
| Ambient cursor glow | Hero section | Pointer-tracking radial gradient |
| Finish swatch pulse | Swatch hover on product detail | Scale + border-color transition |
| Cart badge bounce | On add-to-cart | Framer Motion spring animation |

---

## 4. Information Architecture

### Public Pages

| Page | Route | Rendering | Description |
|------|-------|-----------|-------------|
| Homepage | `/` | SSG + ISR (1hr) | Hero with metallic animations, 3 collection showcases, trust strip, featured products, testimonials |
| Shop | `/shop` | SSR | Full product grid with multi-axis filtering, search, sort |
| Product Detail | `/shop/[slug]` | SSG + ISR (1hr) | Image gallery, finish/size selectors, specs, add-to-cart, related products |
| Cart | `/cart` | Client-side | Line items, quantity, totals, proceed to checkout |
| Checkout Success | `/checkout/success` | Client-side | Order confirmation after Stripe redirect |
| Checkout Cancel | `/checkout/cancel` | Client-side | Return page if user cancels Stripe checkout |
| Sizing Guide | `/sizing-guide` | SSG + ISR | How to measure, visual diagrams, size chart |
| About | `/about` | SSG + ISR | Manufacturing story, quality, heritage |
| Contact | `/contact` | SSG | Contact form + phone + email |
| Shipping & Returns | `/shipping-returns` | SSG + ISR | Policies, delivery estimates |
| FAQ | `/faq` | SSG + ISR | Accordion-style Q&A |

### Admin Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/admin/login` | Supabase email+password auth |
| Dashboard | `/admin` | Revenue snapshot, recent orders, low-stock alerts, quick links |
| Products | `/admin/products` | Product table, create/edit with variant management |
| Categories | `/admin/categories` | CRUD with drag-to-reorder |
| Styles | `/admin/styles` | CRUD list |
| Finishes | `/admin/finishes` | CRUD list with color/gradient config |
| Sizes | `/admin/sizes` | CRUD list |
| Orders | `/admin/orders` | Order table with status filter, detail view, status update + tracking |
| Customers | `/admin/customers` | Customer list, detail with order history |
| Discount Codes | `/admin/discounts` | Create/manage promotion codes |
| Content | `/admin/content` | Edit homepage hero, about, FAQ, sizing guide sections |
| Settings | `/admin/settings` | Shipping rates, free shipping threshold, contact info, admin users |
| Export | `/admin/export` | CSV order export with date/status filters |

---

## 5. Database Schema

All tables in Supabase (Postgres) with Row Level Security enabled.

### Product Catalog

```sql
categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,              -- "Floor Registers"
  slug        text UNIQUE NOT NULL,
  description text,
  image_url   text,
  display_order integer DEFAULT 0,
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
)

styles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,              -- "Art Deco", "Contemporary", "Geometrical"
  slug        text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
)

finishes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,            -- "Antique Brass", "Black", "Bronze"
  slug          text UNIQUE NOT NULL,
  hex_color     text,                     -- "#c9a96e"
  gradient_css  text,                     -- full CSS gradient string for metallic swatch rendering
  display_order integer DEFAULT 0,
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
)

sizes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label         text NOT NULL,            -- "4x12"
  width_inches  numeric NOT NULL,         -- 4
  height_inches numeric NOT NULL,         -- 12
  display_order integer DEFAULT 0,
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
)

products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid REFERENCES categories(id),
  style_id      uuid REFERENCES styles(id),
  name          text NOT NULL,            -- "Art Deco Floor Register"
  slug          text UNIQUE NOT NULL,
  description   text,
  base_price    numeric(10,2),            -- "From $X" display price (min of variant prices)
  meta_title    text,                     -- SEO: custom <title>, auto-generated if null
  meta_description text,                  -- SEO: custom meta description
  og_image_url  text,                     -- SEO: Open Graph image, defaults to primary image
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
)

product_variants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  finish_id   uuid REFERENCES finishes(id),
  size_id     uuid REFERENCES sizes(id),
  sku         text UNIQUE NOT NULL,       -- "AD-AB-4X12"
  price       numeric(10,2) NOT NULL,     -- actual selling price
  stock_qty   integer,                    -- null = not tracking inventory
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(product_id, finish_id, size_id)
)

product_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid REFERENCES products(id) ON DELETE CASCADE,
  finish_id     uuid REFERENCES finishes(id),
  image_url     text NOT NULL,
  alt_text      text,
  display_order integer DEFAULT 0,
  is_primary    boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
)
```

### Customers & Orders

```sql
customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  name        text,
  phone       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
)

customer_addresses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  label       text,                       -- "Home", "Office"
  address     jsonb NOT NULL,             -- {line1, line2, city, state, zip, country}
  is_default  boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
)

orders (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id             uuid REFERENCES customers(id),  -- nullable for guest checkout
  customer_email          text NOT NULL,
  customer_name           text NOT NULL,
  shipping_address        jsonb NOT NULL,   -- {line1, line2, city, state, zip, country}
  status                  text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  stripe_session_id       text,
  stripe_payment_intent_id text,
  subtotal                numeric(10,2) NOT NULL,
  discount_amount         numeric(10,2) DEFAULT 0,
  discount_code           text,             -- code used, if any
  shipping_cost           numeric(10,2) DEFAULT 0,
  tax                     numeric(10,2) DEFAULT 0,
  total                   numeric(10,2) NOT NULL,
  tracking_number         text,
  notes                   text,             -- admin internal notes
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
)

order_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid REFERENCES orders(id) ON DELETE CASCADE,
  variant_id  uuid REFERENCES product_variants(id),
  product_name text NOT NULL,             -- denormalized for order history
  variant_desc text NOT NULL,             -- "Art Deco / Antique Brass / 4x12" denormalized
  quantity    integer NOT NULL,
  unit_price  numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at  timestamptz DEFAULT now()
)
```

### Discount Codes

```sql
discount_codes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text UNIQUE NOT NULL,     -- "SUMMER15"
  type            text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value           numeric(10,2) NOT NULL,   -- 15 for 15%, or 5.00 for $5 off
  min_order_total numeric(10,2),            -- minimum order to apply
  max_uses        integer,                  -- null = unlimited
  times_used      integer DEFAULT 0,
  expires_at      timestamptz,
  active          boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
)
```

### Content & Settings

```sql
content_blocks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page          text NOT NULL,              -- "homepage", "about", "faq", "sizing-guide"
  section_key   text NOT NULL,              -- "hero", "intro", "faq-1"
  title         text,
  body          text,                       -- rich text / markdown
  image_url     text,
  display_order integer DEFAULT 0,
  meta_title    text,                       -- page-level SEO
  meta_description text,
  updated_at    timestamptz DEFAULT now(),
  UNIQUE(page, section_key)
)

site_settings (
  key   text PRIMARY KEY,                   -- "shipping_flat_rate", "free_shipping_threshold"
  value jsonb NOT NULL                      -- flexible value storage
)

admin_users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id),  -- Supabase Auth user
  email       text NOT NULL,
  role        text DEFAULT 'admin',
  created_at  timestamptz DEFAULT now()
)
```

### Key Schema Decisions

- **Products are per-style**, variants are style+finish+size combinations. Adding a new finish or size = just create new variant rows.
- **Prices on variants**, not products. `base_price` on product is display-only ("From $X").
- **Images linked to product+finish**, not individual variants. Same photo for all sizes of a given finish.
- **Order items denormalize** product name and variant description. Order history stays readable even if products are later deleted or renamed.
- **Customer is optional on orders** — guest checkout always works. Customer record created/linked when email matches.
- **Categories above products** — when you add wall registers, return air grilles, etc., just create a new category. Everything else (styles, finishes, sizes, variant model) applies cleanly.
- **stock_qty nullable** — null means "not tracking inventory" for that variant. Set a number to enable stock tracking.
- **content_blocks** — lightweight CMS. Admin edits hero text, FAQ, about page without code changes.
- **Discount codes synced to Stripe** — applied as Stripe Promotion Codes so discount appears on Stripe's checkout page.

---

## 6. Frontend Architecture

### Rendering Strategy

| Page | Strategy | Cache |
|------|----------|-------|
| Homepage | SSG + ISR | Revalidate every 1 hour |
| Shop/Catalogue | SSR | No cache (filter params change per request) |
| Product Detail | SSG + ISR | Revalidate every 1 hour |
| Cart | Client-side | N/A |
| Checkout flows | Client-side | N/A |
| Static content pages | SSG + ISR | Revalidate every 1 hour |
| Admin pages | Client-side | N/A |

### Cart Implementation

- **Storage:** localStorage (no account required)
- **State:** React Context (`CartProvider` wrapping the app)
- **Structure:** Array of `{ variantId, productSlug, productName, finishName, sizeName, price, quantity, imageUrl }`
- **Persistence:** Survives browser sessions, cleared on order completion
- **Checkout flow:**
  1. User clicks "Checkout" in cart
  2. Client POSTs cart items to `/api/checkout`
  3. API route validates items, prices, stock, applies discount code if provided
  4. API creates Stripe Checkout Session with line items
  5. User redirected to Stripe's hosted checkout page
  6. After payment: Stripe redirects to `/checkout/success?session_id=...`
  7. Stripe webhook fires → `/api/webhooks/stripe` creates order in Supabase, decrements stock

### Shop/Catalogue UX

- **URL-driven filters:** `/shop?style=art-deco&finish=antique-brass&size=4x12&sort=price-asc`
- **Sidebar filters (desktop):** Expandable accordion sections for Category, Style, Finish, Size, Price range. Each option shows item count.
- **Bottom sheet filters (mobile):** Tap "Filters" button → slides up filter panel
- **Instant updates:** Filters update URL params and re-fetch without full page reload
- **Search:** Text search bar searches product names and descriptions
- **Sort:** Price low-high, Price high-low, Newest, Name A-Z
- **Grid/list toggle:** Default grid (3 columns desktop, 2 mobile), optional list view

### Product Detail UX

- **Image gallery:** Large main image + thumbnail strip. Click thumbnail to switch. Zoom on hover (desktop).
- **Finish selector:** Metallic gradient swatches. Clicking a finish changes all images to that finish's photos.
- **Size selector:** Button group. Selecting a size updates the displayed price live.
- **Specs table:** Material, gauge/thickness, damper type, faceplate dimensions, duct opening dimensions, weight.
- **Add to cart:** Button with quantity selector. Success animation on cart icon.
- **Related products:** "You may also like" — other styles in the same finish, or same style in other finishes.

### Navigation

- **Sticky header:** Logo left, nav center, cart icon right. Subtle backdrop blur + shadow on scroll.
- **Mega-menu:** "Registers" nav item opens dropdown showing categories with thumbnail images, quick links to popular styles/finishes.
- **Mobile:** Hamburger icon → full-screen slide-out drawer with accordion menu sections.

---

## 7. API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/checkout` | POST | Public | Validate cart, apply discount, create Stripe Checkout Session |
| `/api/webhooks/stripe` | POST | Stripe signature | Handle `checkout.session.completed`, create order, decrement stock |
| `/api/contact` | POST | Public | Send contact form email via Resend |
| `/api/admin/products` | GET, POST | Admin | List/create products |
| `/api/admin/products/[id]` | GET, PUT, DELETE | Admin | Read/update/delete product |
| `/api/admin/variants` | POST | Admin | Bulk create variants for a product |
| `/api/admin/variants/bulk-price` | PATCH | Admin | Bulk update prices on selected variants |
| `/api/admin/categories` | GET, POST, PUT, DELETE | Admin | Category CRUD |
| `/api/admin/styles` | GET, POST, PUT, DELETE | Admin | Style CRUD |
| `/api/admin/finishes` | GET, POST, PUT, DELETE | Admin | Finish CRUD |
| `/api/admin/sizes` | GET, POST, PUT, DELETE | Admin | Size CRUD |
| `/api/admin/orders` | GET | Admin | List orders with filters |
| `/api/admin/orders/[id]` | GET, PATCH | Admin | Order detail, update status/tracking |
| `/api/admin/customers` | GET | Admin | List customers |
| `/api/admin/customers/[id]` | GET | Admin | Customer detail + order history |
| `/api/admin/discounts` | GET, POST, PUT, DELETE | Admin | Discount code CRUD |
| `/api/admin/content` | GET, PUT | Admin | Read/update content blocks |
| `/api/admin/settings` | GET, PUT | Admin | Read/update site settings |
| `/api/admin/upload` | POST | Admin | Upload image to Supabase Storage |
| `/api/admin/export/orders` | GET | Admin | CSV order export |

All `/api/admin/*` routes verify Supabase auth token + check `admin_users` table for authorization.

---

## 8. Integrations

### Stripe

- **Checkout Session:** Created server-side with line items (name, price, quantity, image), shipping address collection, discount code support via Stripe Promotion Codes.
- **Webhook:** Listens for `checkout.session.completed`. Parses metadata for variant IDs, creates order + order_items in Supabase, decrements stock_qty.
- **Discount codes:** Synced to Stripe as Coupon + Promotion Code objects so discounts display on Stripe's checkout page.
- **Future:** Stripe Tax for automatic US state-level tax calculation (not needed at launch, easy to enable later).

### Resend (Email)

- **Order confirmation** → customer (on `checkout.session.completed` webhook)
- **Shipping notification** → customer (when admin updates order status to "shipped" with tracking number)
- **New order alert** → admin email (on `checkout.session.completed` webhook)
- **Contact form** → admin email (on contact form submission)
- **Template style:** Warm Ivory brand — cream background, gold accents, Cormorant Garamond headings.

### Supabase Storage

- **Bucket:** `product-images` (public read, admin write)
- **Initial seed:** Upload existing 729 WebP images, mapped to products via `product_images` table
- **Admin upload:** Drag-and-drop in admin panel, auto-generates responsive variants via Next.js Image
- **CDN:** Served through Supabase CDN + Vercel image optimization

---

## 9. Data Seeding Plan

For launch, seed the database with existing product data:

1. **Categories:** Create "Floor Registers" category
2. **Styles:** Create Art Deco, Contemporary, Geometrical
3. **Finishes:** Create Antique Brass, Black, Bronze with hex colors and CSS gradients
4. **Sizes:** Create 2x10, 2x12, 2x14, 4x10, 4x12, 4x14, 6x10, 6x12, 6x14
5. **Products:** Create 3 products (one per style), linked to "Floor Registers" category
6. **Variants:** Generate 81 variants (3 products x 3 finishes x 9 sizes) with size-based pricing
7. **Images:** Upload 729 WebP images to Supabase Storage, create `product_images` rows mapped to product+finish
8. **Content:** Seed homepage hero text, about page, FAQ entries, sizing guide content (sourced from old site + generated)
9. **Settings:** Set shipping rates, contact info, free shipping threshold
10. **Admin user:** Create initial admin account

A seed script (`scripts/seed.ts`) will automate steps 1-9.

---

## 10. Admin Panel Design

**Layout:** Fixed sidebar (240px) + scrollable main content area. Clean and functional.

**Sidebar sections:**
- Dashboard (home icon)
- Products (expandable: All Products, Categories, Styles, Finishes, Sizes)
- Orders
- Customers
- Discounts
- Content
- Settings

**Key admin UX patterns:**
- **Tables** with search, sort, pagination, bulk select
- **Forms** with inline validation, autosave indicators
- **Image upload** with drag-and-drop, preview, reorder
- **Variant management** — bulk generate by selecting finishes + sizes, bulk price edit
- **Order status workflow** — visual pipeline (pending → paid → shipped → delivered), one-click status advance with tracking number modal
- **Content editor** — simple rich text (bold, italic, links, images), live preview

**Auth:** Supabase Auth email+password. `admin_users` table controls access. No public registration — admins are invited by existing admins.

---

## 11. SEO Strategy

- **Dynamic meta tags** on all pages via Next.js `generateMetadata`
- **Product pages** auto-generate title: `{Product Name} - {Finish} | Decorative Floor Register` and description from product description
- **Custom overrides** via `meta_title` and `meta_description` fields on products and content blocks
- **Open Graph images** default to primary product image, customizable per product
- **Structured data** (JSON-LD) on product pages: Product schema with price, availability, images, brand
- **Sitemap** auto-generated at `/sitemap.xml` via Next.js `sitemap.ts`
- **Robots.txt** allowing all public pages, blocking `/admin`

---

## 12. Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Largest Contentful Paint | < 2.5s |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5s |

**Approach:**
- SSG/ISR for static pages (instant loads from CDN)
- Next.js `<Image>` with lazy loading, responsive srcset, WebP format
- Framer Motion with `LazyMotion` to reduce bundle size
- Tailwind CSS purging unused styles
- Code splitting per route
- Supabase queries with proper indexes on slug, category_id, product_id, finish_id, size_id

---

## 13. Project Structure

```
decorative-floor-registers/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 -- root layout, fonts, CartProvider
│   │   ├── page.tsx                   -- homepage
│   │   ├── shop/
│   │   │   ├── page.tsx               -- catalogue with filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx           -- product detail
│   │   ├── cart/
│   │   │   └── page.tsx               -- cart page
│   │   ├── checkout/
│   │   │   ├── success/page.tsx       -- post-payment success
│   │   │   └── cancel/page.tsx        -- payment cancelled
│   │   ├── sizing-guide/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── shipping-returns/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx             -- admin layout with sidebar
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx               -- dashboard
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── discounts/
│   │   │   ├── content/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── checkout/route.ts
│   │       ├── webhooks/stripe/route.ts
│   │       ├── contact/route.ts
│   │       └── admin/
│   │           ├── products/route.ts
│   │           ├── variants/route.ts
│   │           ├── categories/route.ts
│   │           ├── orders/route.ts
│   │           ├── customers/route.ts
│   │           ├── discounts/route.ts
│   │           ├── content/route.ts
│   │           ├── settings/route.ts
│   │           ├── upload/route.ts
│   │           └── export/orders/route.ts
│   ├── components/
│   │   ├── ui/                        -- reusable UI primitives
│   │   ├── layout/                    -- Header, Footer, MegaMenu, MobileNav
│   │   ├── shop/                      -- ProductCard, FilterSidebar, SearchBar
│   │   ├── product/                   -- ImageGallery, FinishSelector, SizeSelector
│   │   ├── cart/                      -- CartDrawer, CartItem, CartSummary
│   │   ├── home/                      -- Hero, CollectionShowcase, TrustStrip
│   │   ├── admin/                     -- AdminSidebar, DataTable, Forms
│   │   └── animations/               -- ScrollReveal, PageTransition, MetallicShimmer
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              -- browser client
│   │   │   ├── server.ts              -- server client
│   │   │   └── admin.ts              -- service role client for API routes
│   │   ├── stripe.ts                  -- Stripe client + helpers
│   │   ├── resend.ts                  -- email client + templates
│   │   └── utils.ts                   -- formatPrice, generateSlug, etc.
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useFilters.ts
│   │   └── useAdmin.ts
│   ├── context/
│   │   └── CartContext.tsx
│   └── types/
│       └── index.ts                   -- TypeScript types for all entities
├── public/
│   └── fonts/
├── scripts/
│   └── seed.ts                        -- database + image seeding script
├── supabase/
│   └── migrations/                    -- SQL migration files
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 14. Out of Scope (for launch)

These are explicitly not included in the initial build but can be added later:

- Customer accounts / login (guest checkout only at launch — customer records are still created from order data for admin tracking, but no customer-facing login/registration)
- Wishlists / saved items
- Product reviews / ratings
- Blog / content marketing section
- State-level tax calculation (use Stripe Tax when needed)
- Multi-currency / international shipping
- Real-time inventory sync
- Advanced analytics dashboard (use Stripe Dashboard + Vercel Analytics for now)
- PWA / mobile app
- Live chat support
