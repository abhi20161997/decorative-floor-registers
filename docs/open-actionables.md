# Open Actionables — Things That Need You (Not Code)

Last updated: 2026-04-21

The code for Phase 1 & 2 is done. These items can't be completed inside the
repo — they need decisions, credentials, or asset uploads from you.

---

## 1. Business decisions

### a. Email address (#6)
**Decision:** Gmail vs. professional (`sales@decorativefloorregister.com`)?

- **Recommended:** professional via Google Workspace (~$6/mo). Forward to your
  existing Gmail inbox so nothing changes operationally. A Gmail address on a
  premium-priced product site undercuts the luxury positioning.
- **What changes in code once decided:** update the `mailto:` and `support@`
  addresses in `src/app/contact/page.tsx` and `src/components/layout/Footer.tsx`.
- **What you need to do:** sign up for Workspace, point MX records at Google,
  hand me the new address.

### b. Contact phone number (#7)
**Decision:** keep `+1 (847) 316-1395`, or swap to a dedicated US line?

- Current number is already on the Contact page and Footer. Confirm that
  someone actually answers it during the listed hours (M–F, 9–5 CST).
- **If no one answers:** get a Google Voice number (free) or Twilio line
  (~$1/mo) that forwards to whoever is on call (you / Amol / India team).
  Unanswered phone numbers on a storefront hurt trust more than missing one.
- **What you need to do:** decide, then tell me the number to put on the site.

---

## 2. Credentials to provision

### a. Stripe live keys
Site works against test-mode today. To accept real payments you need:

- `STRIPE_SECRET_KEY` (live)
- `STRIPE_WEBHOOK_SECRET` (live — create a live webhook in Stripe dashboard
  pointing at `https://<your-domain>/api/webhooks/stripe`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live)

Add all three in Vercel → Project → Settings → Environment Variables for
**Production** only. Keep test keys in Preview/Development.

### b. Resend API key (transactional email)
Needed for order-confirmation and contact-form emails.

- `RESEND_API_KEY`
- Verify the sending domain in Resend (DNS records).

---

## 3. Supabase migrations & data

### a. Apply migration `00005_add_cad_url.sql`
Adds the `cad_url` column on `products`. Run once via Supabase SQL editor or
CLI (`supabase db push`). Without it the PDP won't know about CAD sheets and
the new admin CAD field won't save.

### b. Upload product images per finish
The admin portal now has a full image manager at `/admin/products/[id]`:
upload multiple images at once per finish, reorder with arrows, mark primary
per finish, edit alt text inline, delete. No more SQL needed.

Aim for per **finish × design** (9 combinations):
- 1 straight-on, 1–2 angle shots, 1 detail macro, 1–2 room installs

### c. Upload CAD drawing PDFs
The admin portal now has a CAD upload field on the product edit page. Just
click **Upload PDF** next to the CAD URL field, then Save. No more SQL.

---

## 4. Deferred / future phases

Not blocking anything — queue for later:

- Per-variant bulk-tier overrides (DB column + admin UI) — currently
  everyone gets the global 5+=10%, 10+=15% tiers.
- Customer storefront accounts / order history (tables exist, flow not wired
  on the *customer-facing* side — admins can already see everything).
- Analytics / Vercel Web Analytics wiring.
- SEO: sitemap entries for new design reel targets, schema.org review.
- Bulk CSV import of products/variants (export is done; import is not).

---

## How to update this doc

Cross items off as you complete them. When all of section 1–3 is done, the
storefront is fully production-ready.
