# Decorative Floor Registers — Market & Competitor Research

**Date:** April 9, 2026
**Prepared for:** Decorative Floor Register (decorativefloorregister.com) website rebuild

---

## 1. Competitor & Reference Websites Analyzed

### Direct Competitors

| Website | Type | Key Observations |
|---------|------|-----------------|
| [Sierra Grates](https://sierragrates.com) | Direct competitor — manufacturer | Family-owned since 1982 (Shargo Manufacturing). Vertically integrated with in-house powder coating. Manufacturing in India, US distribution. Extensive product range but **broken WooCommerce store** (shop page returns zero products). Outdated visual design. No online pricing visible. |
| [Reggio Register](https://www.reggioregister.com) | Direct competitor — manufacturer | US-based manufacturer. 17+ named design patterns. Price range $8–$245. Strong brand positioning as "made in USA." Wide material range (steel, cast iron, brass, aluminum, wood). |
| [Decorative Floor Register](https://www.decorativefloorregister.com) | Our old site | WooCommerce-based store. Price range $9.90–$28.90 (value segment). Navigation by 4 axes: Size, Color, Material, Design. Basic template design. Wishlist and quick-view features. Room-based shopping suggestions. Currently live but extremely slow. |

### Design & UX References

| Website | Type | Why It's Relevant |
|---------|------|-------------------|
| [PKG Group](https://pkggroup.com) | Manufacturing e-commerce | Modern manufacturing website with strong product section. Card-based product grid, WOOF filter system with sidebar categories, quick-view modals. Clean typography (Roboto Condensed + Open Sans). Two-tier fixed header. Professional without being flashy. |
| [Awwwards](https://www.awwwards.com) | Design award showcase | Reference for award-winning web design standards. User wants this caliber of visual creativity applied to the floor register space. |

---

## 2. Industry Product Taxonomy

### Product Categories (by installation location)
- **Floor Registers** (core product) — decorative, heavy gauge steel, drop-in/flush mount
- **Wall/Sidewall Registers** — stamp face (1-way, 2-way, 3-way, 4-way), curved blade, adjustable deflection
- **Ceiling Registers/Diffusers** — square, round, linear slot, T-bar cone, modular
- **Baseboard Registers** — baseboard diffusers, baseboard registers
- **Return Air Grilles** — floor, wall, ceiling variants; filter and non-filter versions
- **Specialty** — toe-kick/toe space grills, linear sidewall registers

### Product Types (by function)
- **Registers** — with damper/louver for airflow control
- **Grilles** — fixed openings, no damper
- **Diffusers** — spread air in multiple directions

### Materials in Market
| Material | Characteristics | Price Segment |
|----------|----------------|---------------|
| Steel (powder-coated) | Most common, affordable, wide finish options | Budget–Mid |
| Cast Iron | Heavy, durable, vintage/industrial aesthetic, historic homes | Mid–Premium |
| Cast Aluminum | Lightweight, rust-proof, good for damp areas | Mid |
| Brass | High-end, traditional/classic, requires maintenance | Premium |
| Wood | Matches hardwood floors | Premium |
| High-impact Plastic | Rust-proof, bathrooms | Budget |

### Common Finishes
Black, White, Oil Rubbed Bronze, Brushed Nickel, Polished Brass, Antique Brass, Chrome, Copper, Satin Nickel, Almond, Silver, Custom Paint-Ready

### Standard Sizes (duct opening dimensions)
| Category | Sizes |
|----------|-------|
| Small | 2x10", 2x12", 2x14" |
| Medium | 4x8", 4x10", 4x12", 4x14" |
| Large | 6x10", 6x12", 6x14" |
| Oversized | 6x24", 6x30", up to 15x15" square |
| Most Popular | 4x10", 4x12", 6x10", 6x12" |

---

## 3. Key Specifications That Matter to Buyers

1. **Size** (measured by duct opening, not faceplate) — the #1 filter criterion
2. **Material** — steel, cast iron, cast aluminum, brass, wood
3. **Finish/Color** — visual match to existing decor
4. **Design Style** — aesthetic preference (Art Deco, Contemporary, Victorian, etc.)
5. **Damper Type** — adjustable louver, fixed, or none
6. **Thickness/Gauge** — face plate thickness, steel gauge
7. **Construction** — welded vs stamped, faceplate vs duct opening dimensions
8. **Mounting** — drop-in, screw-mount, tension spring, wall clips
9. **Airflow** — CFM rating (mainly commercial)

---

## 4. How Competitors Organize & Filter Products

The industry standard is **multi-axis filtering**:
1. **By size** (most important — customers know their duct opening size)
2. **By material** (steel, cast iron, aluminum, brass, wood)
3. **By finish/color** (visual match to decor)
4. **By style/design pattern** (aesthetic preference)
5. **By location** (floor, wall, ceiling, baseboard)
6. **By type** (register vs grille vs return air)

**Our old site** used 4-tab navigation (Size, Color, Material, Design) — an effective approach.

**Sierra Grates** organizes by: Residential > Subcategory > Product Series > Individual product with size/finish selection.

**PKG Group** uses sidebar filter system with expandable categories, checkboxes with item counts, and text search with autocomplete.

---

## 5. Content Strategy — What a Competitive Site Needs

### Essential Pages
- Homepage with hero, featured products, trust signals
- Product category/listing pages with multi-axis filtering
- Individual product detail pages (images, specs table, sizes, finishes, pricing, add-to-cart)
- Shopping cart and checkout (Stripe)
- About Us (manufacturing story, quality, heritage)

### Educational Content (SEO + conversion — biggest gap in competitor sites)
- **Sizing Guide** — "How to Measure for a Floor Register" (the #1 customer question)
- **Installation Guide** — DIY-friendly with visuals
- **Buying Guide** — register vs grille vs diffuser, material comparison, finish guide
- **FAQ** — dampers, measuring, returns, custom sizes
- **Blog/resources** — room-by-room guides, renovation tips, material care

### Trust & Support
- Shipping & delivery information
- Returns/exchange policy
- Contact page with multiple channels
- Customer reviews/testimonials
- Warranty information

### Trade/Pro Pages (differentiator)
- Bulk/wholesale pricing or trade program
- Catalog download (PDF)
- Contractor/builder resources
- Specification sheets

---

## 6. Design Patterns from PKG Group (Applicable to Our Site)

| PKG Pattern | Application to Floor Registers |
|---|---|
| Two-tier fixed header (info bar + main nav) | Top bar: phone, shipping info. Main nav: product categories with mega-menu |
| Full-width hero with gradient overlay | Lifestyle photography of registers in beautiful rooms |
| Card grid with hover effects and shadows | Product cards with register image, name, price range, finish color swatches |
| Sidebar filter system with expandable categories | Filter by size, material, finish, style — with item counts per filter |
| Mega-menu for product navigation | Floor Registers > By Size / By Style / By Material |
| Quick-view modal | Product image, size selector, finish selector, price, add-to-cart |
| Mobile-first responsive (filters collapse) | Critical — homeowners shop on phone during renovation |

---

## 7. Our Current Asset Inventory

### Product Images
- **729 optimized WebP images** (~40KB each, 28MB total)
- **77 original JPEG reference photos** (59MB total)
- **1 PDF** — Heat Vents product specification document

### Image Organization (already structured)
```
Compressed 40kb Images-decorative-floor-registers/
├── ART DECO/          (246 images)
│   ├── AB/            (Antique Brass)
│   ├── BLK/           (Black)
│   └── BN/            (Bronze)
├── CONTEMPORARY/      (247 images)
│   ├── AB/
│   ├── BLK/
│   └── BN/
└── GEOMETRICAL/       (247 images)
    ├── AB/
    ├── BLK/
    └── BN/
```

### Current Product Matrix
| | 2x10 | 2x12 | 2x14 | 4x10 | 4x12 | 4x14 | 6x10 | 6x12 | 6x14 |
|---|---|---|---|---|---|---|---|---|---|
| Art Deco – Antique Brass | x | x | x | x | x | x | x | x | x |
| Art Deco – Black | x | x | x | x | x | x | x | x | x |
| Art Deco – Bronze | x | x | x | x | x | x | x | x | x |
| Contemporary – Antique Brass | x | x | x | x | x | x | x | x | x |
| Contemporary – Black | x | x | x | x | x | x | x | x | x |
| Contemporary – Bronze | x | x | x | x | x | x | x | x | x |
| Geometrical – Antique Brass | x | x | x | x | x | x | x | x | x |
| Geometrical – Black | x | x | x | x | x | x | x | x | x |
| Geometrical – Bronze | x | x | x | x | x | x | x | x | x |

**Total SKUs at launch: ~81** (3 styles x 3 finishes x 9 sizes)

---

## 8. Pricing Context

| Brand | Price Range | Positioning |
|-------|-----------|-------------|
| Our old site | $9.90 – $28.90 | Value/budget segment |
| Reggio Register | $8 – $245 (avg ~$43) | Wide range, premium positioning, Made in USA |
| Sierra Grates | No online pricing | Manufacturer/distributor model, wholesale focused |

**Pricing structure:** Size-based (same style/finish, bigger size = higher price). This is industry standard.

---

## 9. Target Audience Profile

- **Primary:** Middle-aged to older US homeowners doing renovations or new construction
- **Secondary:** Hardware professionals, contractors, builders
- **Both groups value:** Trust, clarity, readability, easy navigation, clear specs and pricing
- **Purchase context:** Buying a luxury decorative product — willing to pay for quality and aesthetics
- **Currency:** USD only (US market)

---

## 10. Technical Stack Decision

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend & API | Next.js (App Router) on Vercel | SSR for SEO, edge caching for speed, React ecosystem |
| Database | Supabase (Postgres) | Relational data for products/variants/orders, built-in auth, storage, row-level security, self-hostable |
| Payments | Stripe | Gold standard for US e-commerce, not a platform dependency |
| Admin Panel | Custom (built into Next.js at /admin) | Full control, Supabase auth-protected |
| Image CDN | Vercel/Supabase Storage | Optimized delivery of product images |

**Scalability:** Architecture supports growth from 81 SKUs to 10,000+ without structural changes. New product categories, styles, and finishes can be added through the admin panel.
