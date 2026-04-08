import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------- helpers ----------

function log(msg: string) {
  process.stdout.write(msg);
}

function done(count: number) {
  console.log(` done (${count})`);
}

// ---------- seed data ----------

const CATEGORY = {
  name: "Floor Registers",
  slug: "floor-registers",
  description:
    "Premium decorative floor registers crafted from heavy-gauge steel with adjustable dampers.",
};

const STYLES = [
  {
    name: "Art Deco",
    slug: "art-deco",
    description:
      "Geometric patterns inspired by the glamour of the 1920s",
  },
  {
    name: "Contemporary",
    slug: "contemporary",
    description: "Clean lines and modern aesthetics for today's homes",
  },
  {
    name: "Geometrical",
    slug: "geometrical",
    description:
      "Bold geometric shapes creating striking visual patterns",
  },
];

const FINISHES = [
  {
    name: "Antique Brass",
    slug: "antique-brass",
    hex_color: "#c9a96e",
    gradient:
      "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
  },
  {
    name: "Black",
    slug: "black",
    hex_color: "#2c2420",
    gradient:
      "linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)",
  },
  {
    name: "Bronze",
    slug: "bronze",
    hex_color: "#8b6f3a",
    gradient:
      "linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)",
  },
];

const SIZES = [
  { label: "2x10", width: 2, height: 10 },
  { label: "2x12", width: 2, height: 12 },
  { label: "2x14", width: 2, height: 14 },
  { label: "4x10", width: 4, height: 10 },
  { label: "4x12", width: 4, height: 12 },
  { label: "4x14", width: 4, height: 14 },
  { label: "6x10", width: 6, height: 10 },
  { label: "6x12", width: 6, height: 12 },
  { label: "6x14", width: 6, height: 14 },
];

const PRODUCTS = [
  {
    name: "Art Deco Floor Register",
    slug: "art-deco-floor-register",
    description:
      "Inspired by the geometric elegance of the 1920s Art Deco movement, this floor register features intricate repeating patterns that add a touch of vintage glamour to any room. Precision-engineered from heavy-gauge steel with an adjustable damper for airflow control.",
    base_price: 9.9,
    styleSlug: "art-deco",
  },
  {
    name: "Contemporary Floor Register",
    slug: "contemporary-floor-register",
    description:
      "Clean lines and understated sophistication define our Contemporary floor register. Its minimal design pairs seamlessly with modern interiors while the heavy-gauge steel construction and adjustable damper deliver lasting performance.",
    base_price: 9.9,
    styleSlug: "contemporary",
  },
  {
    name: "Geometrical Floor Register",
    slug: "geometrical-floor-register",
    description:
      "Make a statement with bold geometric patterns that create striking visual interest. This register transforms a functional necessity into a design feature, crafted from heavy-gauge steel with an adjustable damper for precise airflow control.",
    base_price: 9.9,
    styleSlug: "geometrical",
  },
];

function priceForWidth(width: number): number {
  if (width === 2) return 9.9;
  if (width === 4) return 14.9;
  return 19.9; // width 6
}

function skuCode(styleName: string, finishName: string, sizeLabel: string): string {
  const s = styleName.replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const f = finishName.replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const sz = sizeLabel.toUpperCase();
  return `${s}-${f}-${sz}`;
}

// ---------- image directory mapping ----------

const IMAGE_BASE_DIR = path.resolve(
  process.cwd(),
  "Compressed 40kb Images-decorative-floor-registers"
);

// Maps style slug -> image folder name
const STYLE_DIR_MAP: Record<string, string> = {
  "art-deco": "ART DECO",
  contemporary: "CONTEMPORARY",
  geometrical: "GEOMETRICAL",
};

// Maps finish slug -> image folder name
const FINISH_DIR_MAP: Record<string, string> = {
  "antique-brass": "AB",
  black: "BLK",
  bronze: "BN",
};

// Maps size label -> image folder name
function sizeLabelToDir(label: string): string {
  // "4x10" -> "4X10"
  return label.toUpperCase().replace("x", "X");
}

// ---------- image upload ----------

async function uploadProductImages(
  productRows: { id: string; slug: string; name: string; style_id: string }[],
  finishRows: { id: string; slug: string }[]
): Promise<number> {
  if (!fs.existsSync(IMAGE_BASE_DIR)) {
    console.log(
      `\n  Image directory not found at ${IMAGE_BASE_DIR} — skipping real image upload, using placeholders.`
    );
    return 0;
  }

  console.log(`\n  Found image directory: ${IMAGE_BASE_DIR}`);
  let uploadedCount = 0;
  let errorCount = 0;

  const imageInserts: {
    product_id: string;
    finish_id: string;
    url: string;
    alt_text: string;
    is_primary: boolean;
    display_order: number;
  }[] = [];

  for (const product of productRows) {
    const styleSlug =
      PRODUCTS.find((p) => p.slug === product.slug)?.styleSlug ?? "";
    const styleDirName = STYLE_DIR_MAP[styleSlug];
    if (!styleDirName) continue;

    for (const finish of finishRows) {
      const finishDirName = FINISH_DIR_MAP[finish.slug];
      if (!finishDirName) continue;

      // Collect all images across all size subdirectories for this product+finish
      const finishDir = path.join(IMAGE_BASE_DIR, styleDirName, finishDirName);
      if (!fs.existsSync(finishDir)) {
        console.log(`  Skipping missing dir: ${finishDir}`);
        continue;
      }

      // Read size subdirectories
      const sizeDirs = fs.readdirSync(finishDir, { withFileTypes: true });
      let displayOrder = 0;

      for (const sizeEntry of sizeDirs) {
        if (!sizeEntry.isDirectory()) continue;

        const sizePath = path.join(finishDir, sizeEntry.name);
        const files = fs
          .readdirSync(sizePath)
          .filter((f) => f.toLowerCase().endsWith(".webp"))
          .sort();

        for (const filename of files) {
          const filePath = path.join(sizePath, filename);
          const fileBuffer = fs.readFileSync(filePath);

          // Storage path: products/{style-slug}/{finish-slug}/{size}/{filename}
          const storagePath = `products/${styleSlug}/${finish.slug}/${sizeEntry.name}/${filename}`;

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(storagePath, fileBuffer, {
              contentType: "image/webp",
              upsert: true,
            });

          if (uploadError) {
            console.error(
              `\n  Upload error for ${storagePath}: ${uploadError.message}`
            );
            errorCount++;
            continue;
          }

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("product-images")
            .getPublicUrl(storagePath);

          const isPrimary = displayOrder === 0;

          imageInserts.push({
            product_id: product.id,
            finish_id: finish.id,
            url: publicUrl,
            alt_text: `${product.name} in ${finish.slug.replace("-", " ")} finish - ${sizeEntry.name}`,
            is_primary: isPrimary,
            display_order: displayOrder,
          });

          uploadedCount++;
          displayOrder++;

          // Progress indicator
          if (uploadedCount % 25 === 0) {
            process.stdout.write(
              `\r  Uploaded ${uploadedCount} images...`
            );
          }
        }
      }
    }
  }

  console.log(`\r  Uploaded ${uploadedCount} images (${errorCount} errors)`);

  // Insert image rows into database
  if (imageInserts.length > 0) {
    log("  Inserting image rows into database...");

    // Delete existing product_images first to avoid conflicts
    const productIds = [...new Set(imageInserts.map((i) => i.product_id))];
    for (const pid of productIds) {
      await supabase.from("product_images").delete().eq("product_id", pid);
    }

    // Insert in batches of 100 to avoid payload limits
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < imageInserts.length; i += batchSize) {
      const batch = imageInserts.slice(i, i + batchSize);
      const { data, error: insertErr } = await supabase
        .from("product_images")
        .insert(batch)
        .select("id");

      if (insertErr) {
        console.error(`\n  Batch insert error: ${insertErr.message}`);
      } else {
        insertedCount += data?.length ?? 0;
      }
    }

    done(insertedCount);
    return insertedCount;
  }

  return 0;
}

// ---------- content blocks ----------

const CONTENT_BLOCKS = [
  // --- homepage ---
  {
    page: "homepage",
    section_key: "hero",
    title: "Where Artistry Meets Airflow",
    body: "Premium decorative floor registers that transform every room. Handcrafted in steel with three stunning metallic finishes, our registers are where form meets function.",
    display_order: 0,
  },
  {
    page: "homepage",
    section_key: "trust_strip",
    title: "Trusted Quality",
    body: "Heavy-gauge steel construction. Three curated finishes. Nine standard sizes. Adjustable dampers. 30-day returns.",
    display_order: 1,
  },
  // --- about ---
  {
    page: "about",
    section_key: "hero",
    title: "Our Story",
    body: "Founded with a passion for transforming overlooked details into defining features of your home.",
    display_order: 0,
  },
  {
    page: "about",
    section_key: "story",
    title: "Precision Engineering",
    body: "Our decorative floor registers are precision-engineered from heavy-gauge steel, featuring individually welded diffusion vanes and multi-angle damper systems. Each register is available in three curated finishes — Antique Brass, Matte Black, and Oil Rubbed Bronze — designed to complement any interior style.",
    display_order: 1,
  },
  {
    page: "about",
    section_key: "quality",
    title: "Our Commitment to Quality",
    body: "Every register we produce undergoes rigorous quality inspection before leaving our facility. From the precision of our laser-cut patterns to the consistency of our hand-applied finishes, we hold ourselves to the highest standards. We believe that the details you walk over every day deserve the same attention as the ones you admire on your walls.",
    display_order: 2,
  },
  // --- faq ---
  {
    page: "faq",
    section_key: "hero",
    title: "Frequently Asked Questions",
    body: "Everything you need to know about our decorative floor registers. Can't find the answer you're looking for? Feel free to contact us.",
    display_order: 0,
  },
  {
    page: "faq",
    section_key: "q_measure",
    title: "How do I measure for a floor register?",
    body: 'Measure the duct opening in your floor (not the existing register faceplate). Measure width first, then height. For example, a duct opening that is 4 inches wide and 10 inches long would require a 4x10 register. Our faceplate will be slightly larger to overlap the opening and sit flush on your floor.',
    display_order: 1,
  },
  {
    page: "faq",
    section_key: "q_sizes",
    title: "What sizes do you offer?",
    body: "We offer 9 standard sizes ranging from 2x10 through 6x14 inches. Our available sizes are: 2x10, 2x12, 2x14, 4x10, 4x12, 4x14, 6x10, 6x12, and 6x14. Each size is available in all three finishes and all design styles.",
    display_order: 2,
  },
  {
    page: "faq",
    section_key: "q_finishes",
    title: "What finishes are available?",
    body: "We offer three curated finishes: Antique Brass (warm golden tones), Matte Black (sleek and modern), and Oil Rubbed Bronze (rich, deep tones with an aged patina). Each finish is hand-applied for a consistent, premium look.",
    display_order: 3,
  },
  {
    page: "faq",
    section_key: "q_damper",
    title: "Do your registers come with a damper?",
    body: "Yes, every register includes an adjustable multi-angle steel damper. The damper allows you to control airflow by opening, partially closing, or fully closing the register. It is operated by a simple lever mechanism on the register face.",
    display_order: 4,
  },
  {
    page: "faq",
    section_key: "q_shipping",
    title: "How long does shipping take?",
    body: "Standard shipping within the United States takes 5-7 business days. Orders over $50 qualify for free shipping. Standard shipping on smaller orders is $5.99. We currently ship to US addresses only.",
    display_order: 5,
  },
  {
    page: "faq",
    section_key: "q_returns",
    title: "What is your return policy?",
    body: "We offer a 30-day return policy on unused items in their original packaging. To initiate a return, contact our support team. The customer is responsible for return shipping costs. Refunds are processed within 5-7 business days after we receive the returned item.",
    display_order: 6,
  },
  {
    page: "faq",
    section_key: "q_custom",
    title: "Can I order custom sizes?",
    body: "We are happy to discuss custom size requests. Please contact us through our contact form or email us directly at deepakbrass@gmail.com with your specific size requirements, and we will work with you to find a solution.",
    display_order: 7,
  },
  {
    page: "faq",
    section_key: "q_care",
    title: "How do I care for my registers?",
    body: "To maintain the beauty of your decorative floor register, simply wipe it with a soft, dry cloth as needed. Avoid using abrasive cleaners, steel wool, or harsh chemicals, as these can damage the finish. For stubborn dust in the pattern details, use a soft-bristled brush.",
    display_order: 8,
  },
  // --- sizing-guide ---
  {
    page: "sizing-guide",
    section_key: "hero",
    title: "Sizing Guide",
    body: "Getting the right size is simple. Measure your duct opening and match it to our chart below.",
    display_order: 0,
  },
  {
    page: "sizing-guide",
    section_key: "how_to_measure",
    title: "How to Measure",
    body: "Step 1: Remove Existing Register — Carefully lift and remove your existing floor register from the duct opening.\nStep 2: Measure the Duct Opening — Using a tape measure, measure the width and length of the duct opening in your floor. Measure the hole itself, not the old register faceplate. Record as Width x Length (e.g., 4\" x 10\").\nStep 3: Match to Our Sizes — Find your duct opening dimensions in the size chart below. The faceplate will be slightly larger to overlap the opening and sit flush on your floor.",
    display_order: 1,
  },
  {
    page: "sizing-guide",
    section_key: "tips",
    title: "Helpful Tips",
    body: "Always measure the duct opening, never the existing register faceplate. If your measurement falls between sizes, choose the next size up for a proper fit. Our registers have a 1.5-inch overlap on each side, so the faceplate will be approximately 1.5 inches wider and longer than the duct opening. All of our registers are designed for floor installation. They are not recommended for wall or ceiling use. If you need a size not listed here, contact us to discuss custom options.",
    display_order: 2,
  },
  // --- shipping-returns ---
  {
    page: "shipping-returns",
    section_key: "hero",
    title: "Shipping & Returns",
    body: "We want you to be completely satisfied with your purchase. Here is everything you need to know about shipping and returns.",
    display_order: 0,
  },
  {
    page: "shipping-returns",
    section_key: "shipping",
    title: "Shipping",
    body: "Orders over $50 qualify for free standard shipping anywhere in the US. Standard shipping on orders under $50 is a flat rate of $5.99. Standard shipping takes 5-7 business days. We currently ship within the United States only. All orders are processed within 1-2 business days.",
    display_order: 1,
  },
  {
    page: "shipping-returns",
    section_key: "returns",
    title: "30-Day Return Policy",
    body: "We stand behind the quality of our products. If you are not completely satisfied with your purchase, you may return it within 30 days of delivery for a full refund. Items must be unused and in their original packaging. Customer is responsible for return shipping costs. Items that show signs of use or installation are not eligible for return.",
    display_order: 2,
  },
  {
    page: "shipping-returns",
    section_key: "exchange_process",
    title: "Exchange Process",
    body: "Step 1: Contact Us — Email or call us to initiate your return or exchange. We will provide a return authorization.\nStep 2: Ship It Back — Pack the item securely in the original packaging and ship it to our return address.\nStep 3: Get Your Refund — Once received and inspected, your refund will be processed within 5-7 business days to your original payment method.",
    display_order: 3,
  },
];

const SITE_SETTINGS = [
  { key: "shipping_flat_rate", value: "5.99" },
  { key: "free_shipping_threshold", value: "50" },
  { key: "contact_phone", value: "+1 847-316-1395" },
  { key: "contact_email", value: "deepakbrass@gmail.com" },
];

// ---------- main ----------

async function seed() {
  console.log("=== Decorative Floor Registers — Database Seed ===\n");

  const summary: Record<string, number> = {};

  // 1. Category
  log("Seeding categories...");
  const { data: categoryData, error: categoryErr } = await supabase
    .from("categories")
    .upsert(CATEGORY, { onConflict: "slug" })
    .select("id")
    .single();

  if (categoryErr) {
    console.error("\n  Error seeding category:", categoryErr.message);
  }
  const categoryId = categoryData?.id;
  done(1);
  summary["categories"] = 1;

  // 2. Styles
  log("Seeding styles...");
  const { data: styleRows, error: stylesErr } = await supabase
    .from("styles")
    .upsert(STYLES, { onConflict: "slug" })
    .select("id, slug");

  if (stylesErr) {
    console.error("\n  Error seeding styles:", stylesErr.message);
  }
  done(styleRows?.length ?? 0);
  summary["styles"] = styleRows?.length ?? 0;

  // 3. Finishes
  log("Seeding finishes...");
  const { data: finishRows, error: finishesErr } = await supabase
    .from("finishes")
    .upsert(FINISHES, { onConflict: "slug" })
    .select("id, slug");

  if (finishesErr) {
    console.error("\n  Error seeding finishes:", finishesErr.message);
  }
  done(finishRows?.length ?? 0);
  summary["finishes"] = finishRows?.length ?? 0;

  // 4. Sizes
  log("Seeding sizes...");
  const { data: sizeRows, error: sizesErr } = await supabase
    .from("sizes")
    .upsert(SIZES, { onConflict: "label" })
    .select("id, label, width");

  if (sizesErr) {
    console.error("\n  Error seeding sizes:", sizesErr.message);
  }
  done(sizeRows?.length ?? 0);
  summary["sizes"] = sizeRows?.length ?? 0;

  // 5. Products
  log("Seeding products...");
  const productInserts = PRODUCTS.map((p) => {
    const style = styleRows?.find((s) => s.slug === p.styleSlug);
    return {
      name: p.name,
      slug: p.slug,
      description: p.description,
      base_price: p.base_price,
      category_id: categoryId ?? null,
      style_id: style?.id ?? null,
      active: true,
    };
  });

  const { data: productRows, error: productsErr } = await supabase
    .from("products")
    .upsert(productInserts, { onConflict: "slug" })
    .select("id, slug, name, style_id");

  if (productsErr) {
    console.error("\n  Error seeding products:", productsErr.message);
  }
  done(productRows?.length ?? 0);
  summary["products"] = productRows?.length ?? 0;

  // 6. Variants (product x finish x size = 81)
  log("Seeding variants...");
  const variantInserts: {
    product_id: string;
    finish_id: string;
    size_id: string;
    sku: string;
    price: number;
    stock_qty: number;
    active: boolean;
  }[] = [];

  if (productRows && finishRows && sizeRows) {
    for (const product of productRows) {
      const styleName =
        PRODUCTS.find((p) => p.slug === product.slug)?.styleSlug ?? "";
      for (const finish of finishRows) {
        for (const size of sizeRows) {
          variantInserts.push({
            product_id: product.id,
            finish_id: finish.id,
            size_id: size.id,
            sku: skuCode(styleName, finish.slug, size.label),
            price: priceForWidth(size.width),
            stock_qty: 100,
            active: true,
          });
        }
      }
    }
  }

  const { data: variantRows, error: variantsErr } = await supabase
    .from("product_variants")
    .upsert(variantInserts, { onConflict: "sku" })
    .select("id");

  if (variantsErr) {
    console.error("\n  Error seeding variants:", variantsErr.message);
  }
  done(variantRows?.length ?? 0);
  summary["variants"] = variantRows?.length ?? 0;

  // 7. Product images — try real images first, fall back to placeholders
  log("Seeding product images...");

  let imageCount = 0;
  const hasRealImages = fs.existsSync(IMAGE_BASE_DIR);

  if (hasRealImages && productRows && finishRows) {
    imageCount = await uploadProductImages(productRows, finishRows);
  }

  // Fallback to placeholder images if no real images were uploaded
  if (imageCount === 0 && productRows && finishRows) {
    console.log("  Using placeholder images...");
    const imageInserts: {
      product_id: string;
      finish_id: string;
      url: string;
      alt_text: string;
      is_primary: boolean;
      display_order: number;
    }[] = [];

    for (const product of productRows) {
      const styleName =
        PRODUCTS.find((p) => p.slug === product.slug)?.styleSlug ?? "style";
      for (const finish of finishRows) {
        const hexBg =
          FINISHES.find((f) => f.slug === finish.slug)?.hex_color?.replace(
            "#",
            ""
          ) ?? "c9a96e";
        const textColor = finish.slug === "black" ? "ffffff" : "2c2420";
        const label = encodeURIComponent(
          `${styleName.replace("-", " ")} ${finish.slug.replace("-", " ")}`
        );
        imageInserts.push({
          product_id: product.id,
          finish_id: finish.id,
          url: `https://placehold.co/600x400/${hexBg}/${textColor}?text=${label}`,
          alt_text: `${product.name} in ${finish.slug.replace("-", " ")} finish`,
          is_primary: true,
          display_order: 0,
        });
      }
    }

    const { data: imageRows, error: imagesErr } = await supabase
      .from("product_images")
      .upsert(imageInserts, {
        onConflict: "product_id,finish_id,display_order",
      })
      .select("id");

    if (imagesErr) {
      console.error(
        "\n  Upsert failed for images, trying plain insert:",
        imagesErr.message
      );
      // Delete existing first, then insert
      for (const product of productRows) {
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", product.id);
      }
      const { data: imgFallback, error: imgFallbackErr } = await supabase
        .from("product_images")
        .insert(imageInserts)
        .select("id");
      if (imgFallbackErr) {
        console.error("  Image insert also failed:", imgFallbackErr.message);
      }
      imageCount = imgFallback?.length ?? 0;
    } else {
      imageCount = imageRows?.length ?? 0;
    }
    done(imageCount);
  }
  summary["product_images"] = imageCount;

  // 8. Content blocks
  log("Seeding content blocks...");
  const { data: contentRows, error: contentErr } = await supabase
    .from("content_blocks")
    .upsert(CONTENT_BLOCKS, { onConflict: "page,section_key" })
    .select("id");

  if (contentErr) {
    console.error("\n  Error seeding content blocks:", contentErr.message);
  }
  done(contentRows?.length ?? 0);
  summary["content_blocks"] = contentRows?.length ?? 0;

  // 9. Site settings
  log("Seeding site settings...");
  const { data: settingsRows, error: settingsErr } = await supabase
    .from("site_settings")
    .upsert(SITE_SETTINGS, { onConflict: "key" })
    .select("id");

  if (settingsErr) {
    console.error("\n  Error seeding site settings:", settingsErr.message);
  }
  done(settingsRows?.length ?? 0);
  summary["site_settings"] = settingsRows?.length ?? 0;

  // ---------- summary ----------
  console.log("\n=== Seed Summary ===");
  for (const [table, count] of Object.entries(summary)) {
    console.log(`  ${table}: ${count}`);
  }
  console.log("\nDone!");
}

seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
