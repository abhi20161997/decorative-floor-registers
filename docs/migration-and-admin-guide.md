# Migration & Admin Portal — How to Use

Last updated: 2026-04-21

---

# Part 1 — Applying Migration `00005_add_cad_url.sql`

This migration adds one nullable column (`cad_url`) to the `products` table.
It's safe, non-destructive, and takes <1 second to apply.

## What it does

```sql
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS cad_url text;
```

No existing data changes. Every row starts with `cad_url = NULL` (meaning
"no CAD sheet yet"). The PDP only renders the "Download CAD Drawing" button
when this column is populated for a given product.

## Option A — Apply via Supabase Dashboard (easiest)

1. Open https://supabase.com/dashboard and pick the DFR project.
2. Left sidebar → **SQL Editor**.
3. New query → paste the SQL below:
   ```sql
   ALTER TABLE products
     ADD COLUMN IF NOT EXISTS cad_url text;

   COMMENT ON COLUMN products.cad_url IS
     'Public URL to a downloadable CAD/spec PDF for this product. NULL = no sheet available.';
   ```
4. Click **Run**. You should see "Success. No rows returned."
5. Verify by opening **Table Editor → products** — you should see a new
   `cad_url` column on the right.

## Option B — Apply via Supabase CLI (from your laptop)

If you've used the CLI before (`supabase link` is already set up for this
project):

```bash
# From the repo root
supabase db push
```

This will apply any migrations in `supabase/migrations/` that the remote
database doesn't have yet. For this change that's just `00005_add_cad_url.sql`.

## Verification query (run after)

```sql
select column_name, data_type, is_nullable
  from information_schema.columns
  where table_name = 'products' and column_name = 'cad_url';
```

Expected output: one row showing `cad_url | text | YES`.

---

# Part 2 — Admin Portal Guide

The site has a fully built admin portal at **`/admin`**.

## 2.1. Logging in

**URL:** `https://<your-domain>/admin/login` (or
`http://localhost:3000/admin/login` locally)

**Credentials:** Supabase Auth — you log in with an email/password that
exists both in `auth.users` AND in the `admin_users` table.

### If you've never logged in before

You need to create an admin account first:

1. Go to Supabase Dashboard → **Authentication → Users → Add user**.
2. Enter your email + a strong password. Check "Auto-confirm user".
3. Copy the new user's UUID from the users list.
4. Supabase Dashboard → **SQL Editor** → run:
   ```sql
   insert into admin_users (user_id, email, role)
   values ('<the-uuid-you-copied>', '<your-email>', 'admin');
   ```
5. Now you can sign in at `/admin/login` with that email/password.

### If you forget your password

Supabase Dashboard → **Authentication → Users** → click your row → "Send
password recovery". Or reset via the "Reset password" SQL function.

## 2.2. What each admin page does

Once logged in you'll land on `/admin` (the dashboard). Sidebar links cover:

| Page | URL | What you can do |
|------|-----|-----------------|
| **Dashboard** | `/admin` | Live KPIs: orders today, revenue today, orders this week, revenue this month. Recent 10 orders, low-stock alerts (stock <5), quick-action buttons. |
| **Products** | `/admin/products` | List all products. Create new ones with `/admin/products/new`. Click a product to edit name, description, price, SEO, and variants. |
| **Add Product** | `/admin/products/new` | Wizard to create a new product row. Can pick category/style. |
| **Product Edit** | `/admin/products/[id]` | Edit everything about one product. Also: bulk-generate variants (pick N finishes × M sizes → creates all N×M variant rows at once). |
| **Categories** | `/admin/categories` | Manage product categories (currently just "Floor Registers"). |
| **Styles** | `/admin/styles` | Manage design styles (Art Deco, Contemporary, Geometrical). |
| **Finishes** | `/admin/finishes` | Manage finish options (Antique Brass, Black, Bronze — plus add new ones). |
| **Sizes** | `/admin/sizes` | Manage available sizes (2x10, 4x12, etc). |
| **Orders** | `/admin/orders` | List all orders. Filter by status. |
| **Order Detail** | `/admin/orders/[id]` | View one order. Update status (pending → paid → shipped → delivered / cancelled). Add tracking number and internal notes. |
| **Customers** | `/admin/customers` | Browse customer records. Click into one for their full order history. |
| **Content** | `/admin/content` | Edit the copy that renders on About, FAQ, Shipping & Returns, etc. This is the **content_blocks** table. |
| **Discounts** | `/admin/discounts` | Create coupon codes: percentage or fixed amount, minimum order total, max uses, expiry. Works at checkout. |
| **Settings** | `/admin/settings` | Site-wide settings stored in `site_settings`. |

## 2.3. What the admin portal **can't** do yet (needs SQL)

Some things don't have a UI yet — you'll need to use the Supabase SQL editor
for these until we build forms:

### A. Upload product photos (room shots, angle shots)

The PDP swaps images per finish. To add more, you need to:

1. **Storage tab** → bucket `product-images` → upload files (e.g.
   `products/art-deco/black/install-kitchen.webp`).
2. Copy the file's public URL.
3. **SQL Editor** → insert:
   ```sql
   insert into product_images
     (product_id, finish_id, image_url, alt_text, display_order, is_primary)
   values (
     (select id from products where slug = 'art-deco-floor-register'),
     (select id from finishes where slug = 'black'),
     'https://...',
     'Art Deco in Black — kitchen install',
     10,
     false
   );
   ```

See `docs/product-images-seeding.md` for full details.

### B. Set CAD drawing URL for a product

After applying migration `00005`:

1. **Storage tab** → upload the PDF (e.g. `cad/art-deco.pdf`).
2. Copy the public URL.
3. **SQL Editor**:
   ```sql
   update products
     set cad_url = 'https://.../art-deco.pdf'
     where slug = 'art-deco-floor-register';
   ```

To remove it: `update products set cad_url = null where slug = '...'`.

### C. Per-variant bulk pricing overrides

Today bulk discounts (5+=10%, 10+=15%) are **global** — the same for every
SKU. If you later want different tiers on specific variants, we'll add a
`price_tiers jsonb` column and an admin form.

## 2.4. Typical day-one flow (recommended order)

Once the site is live and you've logged in as admin:

1. **Content** → update About / FAQ / Shipping copy to match your actual policies.
2. **Settings** → confirm site name, tagline, email, phone.
3. **Sizes / Finishes / Styles** → confirm current list is correct; add/remove as needed.
4. **Products** → click each of the 3 products → review description, SEO
   fields, base price. Check that variants (9 sizes × 3 finishes = 27 each)
   exist and have correct prices + stock quantities.
5. **(SQL)** Upload extra images + CAD PDFs per the notes above.
6. **Discounts** → optionally create a launch coupon (e.g. `LAUNCH10` for
   10% off first order).
7. **Orders** → empty for now; will populate as customers buy.

## 2.5. Tips

- All admin routes are server-checked against `admin_users`. Regular
  customers who somehow hit `/admin/*` get a 403.
- The admin portal is already deployed as part of the main site — no
  separate subdomain needed.
- Changes via the admin UI are immediate in the database, but the public
  site is cached (ISR, 60s–1h revalidation). Give it a minute after editing
  before assuming something didn't save.
- If you need to invalidate the cache instantly, redeploy on Vercel or
  bump revalidation settings.
