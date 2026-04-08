# Decorative Floor Register — Features & Capabilities

**Website:** decorativefloorregister.com
**Built:** April 2026

---

## Executive Summary

A premium e-commerce platform purpose-built for decorative floor registers, designed to serve US homeowners, contractors, and hardware professionals. The platform combines award-winning visual design with industrial-grade scalability, delivering a complete shopping experience from product discovery to order fulfillment.

---

## 1. Customer-Facing Features

### Homepage
- **Premium hero section** with metallic texture animations, CSS-simulated brushed brass effects, and ambient light reflections
- **Social proof** — "Trusted by 500+ homeowners, contractors, and designers across the US"
- **Collection showcase** — 3 design collections (Art Deco, Contemporary, Geometrical) with metallic card effects
- **Trust strip** — manufacturing quality callouts (1.5mm steel gauge, 3 collections, 3 finishes, free shipping)
- **Featured products** with metallic finish previews and hover light-sweep effects

### Product Catalogue (`/shop`)
- **Multi-axis filtering** — filter by Style, Finish, and Size simultaneously
- **URL-driven filters** — every filter combination produces a shareable URL (`/shop?style=art-deco&finish=antique-brass`)
- **Real-time search** — debounced text search across product names
- **Sort options** — Price (low/high), Newest, Name A-Z
- **Responsive layout** — sidebar filters on desktop, bottom sheet on mobile
- **Product cards** with metallic gradient backgrounds, finish swatches, and hover animations

### Product Detail (`/shop/[slug]`)
- **Image gallery** with zoom-on-hover and thumbnail navigation
- **Finish selector** — metallic gradient swatches that update the entire page
- **Size selector** — button grid with live price updates per size
- **Specifications table** — material, gauge, damper type, construction, mounting
- **Related products** — cross-sell other styles/finishes
- **JSON-LD structured data** — rich search results in Google

### Shopping Cart
- **localStorage persistence** — cart survives browser sessions, no account required
- **Real-time totals** — quantity adjustments update instantly
- **Shipping calculation** — free over $50, $5.99 flat rate otherwise
- **Discount code support** — percentage or fixed amount codes

### Checkout (Stripe)
- **Stripe Checkout** — PCI-compliant hosted checkout page
- **US shipping** — address collection with US-only restriction
- **Discount codes** — applied as Stripe Promotion Codes (visible on checkout page)
- **Automated order creation** — webhook creates order in database on successful payment
- **Stock management** — automatic inventory decrement on purchase
- **Email confirmations** — branded order confirmation sent to customer + admin notification

### Content Pages
- **About** — manufacturing story with quality commitment
- **FAQ** — 8 questions with animated accordion (sizing, ordering, finishes, shipping, returns, care)
- **Sizing Guide** — how-to-measure instructions, full size chart with duct opening and faceplate dimensions
- **Contact** — form with email delivery via Resend
- **Shipping & Returns** — policies, delivery estimates, return process

---

## 2. Admin Panel Features

### Dashboard (`/admin`)
- **Revenue metrics** — today, this week, this month with real-time Supabase queries
- **Order count** — daily, weekly tracking
- **Recent orders** — last 10 with status badges
- **Low stock alerts** — variants below 5 units
- **Quick action links** — add product, view orders, edit content

### Product Management
- **Full CRUD** — create, read, update, soft-delete products
- **Variant management** — bulk generate variants across finish × size combinations
- **Inline price editing** — update individual variant prices
- **Bulk price updates** — select multiple variants, apply new price or percentage adjustment
- **Stock tracking** — per-variant inventory with low stock alerts
- **SKU auto-generation** — format: "AD-AB-4X12" (style-finish-size)
- **SEO fields** — custom meta title, description, OG image per product

### Attribute Management
- **Categories** — CRUD with display ordering
- **Styles** — Art Deco, Contemporary, Geometrical (extensible)
- **Finishes** — with hex color picker and CSS gradient configuration
- **Sizes** — width/height in inches

### Order Management
- **Status workflow** — Pending → Paid → Shipped → Delivered (with Cancelled option)
- **Status filter tabs** — quick filtering by order status
- **Order detail** — full breakdown with items, totals, customer info, shipping address
- **Tracking numbers** — add tracking, auto-sends branded shipping notification email
- **Internal notes** — admin-only notes per order
- **CSV export** — export orders by date range and status for accounting

### Customer Management
- **Customer list** — with search, order count, total spent
- **Customer detail** — contact info, saved addresses, complete order history
- **Auto-creation** — customer records created automatically from orders

### Discount Codes
- **Percentage or fixed** amount discounts
- **Minimum order threshold** — require minimum spend to use code
- **Usage limits** — set max uses per code
- **Expiry dates** — automatic expiration
- **Usage tracking** — see how many times each code has been used

### Content Management
- **Lightweight CMS** — edit homepage, about, FAQ, sizing guide, and shipping pages
- **Per-section editing** — title, body, image URL, SEO fields
- **Page-grouped interface** — tabbed editor by page

### Settings
- **Shipping rates** — flat rate and free shipping threshold
- **Contact info** — phone, email
- **Admin user management** — Supabase Auth-based

---

## 3. Technical Architecture

### Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | SSR/SSG, React 19, TypeScript |
| Styling | Tailwind CSS v4 + Framer Motion | Design system, animations |
| Database | Supabase (Postgres) | Relational data, RLS, Auth |
| Payments | Stripe Checkout | PCI-compliant payments |
| Email | Resend | Transactional emails |
| Hosting | Vercel | Edge CDN, auto-deploy |
| Images | Supabase Storage | Product image CDN |

### Performance

| Strategy | Where Applied |
|----------|--------------|
| Static Site Generation (SSG) | Homepage, product pages, content pages |
| Incremental Static Regeneration (ISR) | Product pages revalidate every hour |
| Server-Side Rendering (SSR) | Shop page (dynamic filters) |
| Client-Side Rendering | Cart, admin panel |
| Image Optimization | Next.js `<Image>` with responsive srcset, WebP |
| Code Splitting | Automatic per-route splitting |
| Edge Caching | Vercel CDN for static assets |

### Database (15 tables)

- **Product catalog:** categories, styles, finishes, sizes, products, product_variants, product_images
- **Commerce:** customers, customer_addresses, orders, order_items, discount_codes
- **Content:** content_blocks, site_settings
- **Auth:** admin_users

All tables have Row Level Security (RLS) enabled with public read policies for active items and admin-only write policies.

### SEO

- Dynamic `<meta>` tags on all pages via `generateMetadata`
- JSON-LD structured data on product pages (Product schema with price, availability, brand)
- Auto-generated `sitemap.xml` with all products and pages
- `robots.txt` blocking admin/API routes
- Open Graph metadata for social sharing

---

## 4. Scalability

### Current Scale
- **81 SKUs** (3 styles × 3 finishes × 9 sizes)
- **729 product images** (optimized WebP, ~40KB each)
- **1 product category** (Floor Registers)

### Growth Path

| Expansion | How It's Supported |
|-----------|-------------------|
| **New product categories** (wall registers, return air grilles, ceiling diffusers) | Add category in admin → create products → assign to category. Navigation auto-updates. |
| **New design styles** | Add style in admin → generate variants across all finishes × sizes. One click. |
| **New finishes** | Add finish with hex + gradient in admin → generate variants for all products × sizes. |
| **New sizes** | Add size in admin → generate variants for all products × finishes. |
| **1,000+ SKUs** | Postgres handles millions of rows. Indexes on all lookup columns. |
| **10,000+ SKUs** | Add pagination to shop page, consider Postgres full-text search. |
| **International** | Add multi-currency support, expand shipping countries in Stripe config. |
| **State tax** | Enable Stripe Tax — one config toggle, automatic per-state calculation. |
| **Customer accounts** | Add login/registration flow, connect to existing customers table. |
| **Bulk/wholesale** | Add trade pricing tier, volume discounts via discount codes or custom pricing. |

### Architecture Decisions for Scale
- **Variant model** (product × finish × size) — same pattern used by Shopify, Medusa, and Saleor. Proven at millions of SKUs.
- **Supabase (Postgres)** — real relational database with JOINs, indexes, and RLS. Not a NoSQL document store.
- **Self-hostable** — Supabase can be self-hosted if you outgrow the hosted plan.
- **No vendor lock-in** — Stripe, Resend, and Supabase are all replaceable. Standard SQL, standard APIs.

---

## 5. Competitive Advantages

| Advantage | vs. Competitors |
|-----------|----------------|
| **Modern tech stack** | Sierra Grates runs broken WooCommerce. Our site is Next.js with SSG/ISR — instant loads. |
| **Award-winning design** | Metallic textures, shimmer animations, parallax effects. Competitors have template designs. |
| **Mobile-first** | Responsive at every breakpoint. Competitors have clunky mobile experiences. |
| **Multi-axis filtering** | Filter by style + finish + size simultaneously. Competitors offer basic category navigation. |
| **SEO-optimized** | JSON-LD, dynamic meta, sitemap, ISR. Built for Google from day one. |
| **Full admin panel** | Custom-built for the business. Not a generic WordPress/WooCommerce admin. |
| **Scalable architecture** | Add new categories, styles, finishes, sizes without code changes. |
| **Performance** | Sub-2s page loads via CDN + SSG. Old site was "too slow." |
| **Professional checkout** | Stripe Checkout — trusted, PCI-compliant, supports Apple/Google Pay. |

---

## 6. Visual Design

**Theme: Warm Ivory + Premium Metallic Effects**

| Element | Design Choice | Rationale |
|---------|--------------|-----------|
| Background | Cream/ivory (#faf6f1) | Warm, easy on eyes, premium feel |
| Typography | Cormorant Garamond + Inter | Elegant headings, readable body (16px+) |
| Accents | Antique gold (#9a7b4f), Brass (#c9a96e) | Mirrors actual product finishes |
| Animations | Metallic shimmer, brushed texture, light sweep | Award-winning polish without disorientation |
| Accessibility | WCAG AA+ contrast, prefers-reduced-motion support | Comfortable for all ages |

**Target audience considerations:**
- Middle-aged to older homeowners: large text, high contrast, clear navigation
- Hardware professionals: efficient filtering, specs tables, bulk ordering path
- Both: trust signals, quality callouts, professional presentation

---

## 7. Cost Structure

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth, unlimited deploys | Pro: $20/month (more bandwidth, analytics) |
| **Supabase** | 500MB DB, 1GB storage, 50K auth users | Pro: $25/month (8GB DB, 100GB storage) |
| **Stripe** | No monthly fee | 2.9% + $0.30 per transaction |
| **Resend** | 3,000 emails/month | $20/month for 50K emails |

**Launch cost: $0/month** (all free tiers are sufficient for initial scale)
**Growth cost: ~$65/month** (when you exceed free tiers)
