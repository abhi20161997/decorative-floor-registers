# Adding More Product Images (Angles / Room Shots)

The product detail page reads the `product_images` table and groups images
by `finish_id`. When a customer picks a finish, the gallery swaps to that
finish's images. Today each finish shows up to **8 images**; the rest are
ignored.

No admin UI yet — here are the two ways to add images.

## Option A — One-off via SQL + Supabase dashboard (fastest)

1. Open Supabase dashboard → **Storage** → bucket `product-images`.
2. Upload the new image into any path (e.g. `products/art-deco/black/room-1.webp`).
3. Copy the **public URL** it gives you.
4. Open the **SQL editor** and run:

```sql
insert into product_images
  (product_id, finish_id, image_url, alt_text, display_order, is_primary)
values
  (
    (select id from products where slug = 'art-deco-floor-register'),
    (select id from finishes where slug = 'black'),
    'https://...your-public-url...',
    'Art Deco register in Black — installed in living room',
    10,              -- higher number = later in gallery
    false
  );
```

Repeat for each new shot. Display order controls thumbnail order; the lowest
number shows first (and becomes the cart thumbnail).

## Option B — Via the admin upload endpoint (batch / scripted)

The app already exposes `POST /api/admin/upload` (admin-only) which returns
the public URL after upload. You can write a small script that:

1. Reads a folder of files.
2. `POST`s each to `/api/admin/upload` (multipart form with field `file`).
3. Inserts a `product_images` row with the returned URL.

See `scripts/seed.ts` for an example of the Supabase admin client pattern.

## Tips

- Aim for **4–6 images per finish**: 1 straight-on, 1–2 angle shots, 1 detail
  macro, 1–2 room installs.
- File format: WebP or optimized JPEG. Keep each under ~200 KB.
- Images **must** be tagged with `finish_id`. Untagged rows are ignored by
  the PDP (they won't appear in any finish's gallery).
- First image per finish becomes the **cart thumbnail** when added to cart.

---

# Adding a CAD Drawing Sheet per Product

The PDP shows a "Download CAD Drawing (PDF)" button when `products.cad_url`
is set. The column was added in migration `00005_add_cad_url.sql`.

## Steps

1. Upload the PDF to Storage (bucket `product-images`, e.g. path
   `cad/art-deco-floor-register.pdf`). You can drag-and-drop in the
   Supabase dashboard.
2. Copy the public URL.
3. Update the product:

```sql
update products
  set cad_url = 'https://.../art-deco-floor-register.pdf'
  where slug = 'art-deco-floor-register';
```

To hide the button again, set `cad_url = null`.
