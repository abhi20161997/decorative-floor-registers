import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createStaticClient } from "@/lib/supabase/static";
import { getProductGalleryUrls } from "@/lib/image-urls";
import ProductDetail from "./ProductDetail";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductJsonLd from "@/components/product/ProductJsonLd";

export const revalidate = 3600; // ISR: revalidate every hour

// --- Demo data ---

type DemoFinish = {
  id: string;
  name: string;
  slug: string;
  hex: string;
  gradient: string;
};

type DemoSize = {
  id: string;
  label: string;
  price: number;
  inStock: boolean;
};

type DemoRelated = {
  name: string;
  slug: string;
  styleName: string;
  basePrice: number;
  imageUrl?: string;
  finishes: { name: string; hex: string; gradient: string }[];
};

type DemoProduct = {
  name: string;
  slug: string;
  styleName: string;
  description: string;
  finishes: DemoFinish[];
  sizes: DemoSize[];
  images: { url: string; alt: string }[];
  relatedProducts: DemoRelated[];
};

const sharedFinishes: DemoFinish[] = [
  {
    id: "f1",
    name: "Antique Brass",
    slug: "antique-brass",
    hex: "#c9a96e",
    gradient: "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
  },
  {
    id: "f2",
    name: "Black",
    slug: "black",
    hex: "#2c2420",
    gradient: "linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)",
  },
  {
    id: "f3",
    name: "Bronze",
    slug: "bronze",
    hex: "#8b6f3a",
    gradient: "linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)",
  },
];

const sharedSizes: DemoSize[] = [
  { id: "s1", label: "2x10", price: 9.9, inStock: true },
  { id: "s2", label: "2x12", price: 9.9, inStock: true },
  { id: "s3", label: "2x14", price: 9.9, inStock: true },
  { id: "s4", label: "4x10", price: 14.9, inStock: true },
  { id: "s5", label: "4x12", price: 14.9, inStock: true },
  { id: "s6", label: "4x14", price: 14.9, inStock: true },
  { id: "s7", label: "6x10", price: 19.9, inStock: true },
  { id: "s8", label: "6x12", price: 19.9, inStock: true },
  { id: "s9", label: "6x14", price: 19.9, inStock: true },
];

const sharedRelatedFinishes = sharedFinishes.map((f) => ({
  name: f.name,
  hex: f.hex,
  gradient: f.gradient,
}));

const demoProducts: Record<string, DemoProduct> = {
  "art-deco-floor-register": {
    name: "Art Deco Floor Register",
    slug: "art-deco-floor-register",
    styleName: "Art Deco",
    description:
      "Transform your living space with our Art Deco floor register, featuring geometric patterns inspired by the glamour of the 1920s. Precision-engineered from heavy-gauge steel with individually welded diffusion vanes.",
    finishes: sharedFinishes,
    sizes: sharedSizes,
    images: getProductGalleryUrls("Art Deco", "Antique Brass"),
    relatedProducts: [
      {
        name: "Contemporary Floor Register",
        slug: "contemporary-floor-register",
        styleName: "Contemporary",
        basePrice: 9.9,
        finishes: sharedRelatedFinishes,
      },
      {
        name: "Geometrical Floor Register",
        slug: "geometrical-floor-register",
        styleName: "Geometrical",
        basePrice: 9.9,
        finishes: sharedRelatedFinishes,
      },
    ],
  },
  "contemporary-floor-register": {
    name: "Contemporary Floor Register",
    slug: "contemporary-floor-register",
    styleName: "Contemporary",
    description:
      "Clean lines and modern elegance define our Contemporary floor register. Designed for today\u2019s interiors, with precision-cut patterns and a sleek profile that complements any room.",
    finishes: sharedFinishes,
    sizes: sharedSizes,
    images: getProductGalleryUrls("Contemporary", "Antique Brass"),
    relatedProducts: [
      {
        name: "Art Deco Floor Register",
        slug: "art-deco-floor-register",
        styleName: "Art Deco",
        basePrice: 9.9,
        finishes: sharedRelatedFinishes,
      },
      {
        name: "Geometrical Floor Register",
        slug: "geometrical-floor-register",
        styleName: "Geometrical",
        basePrice: 9.9,
        finishes: sharedRelatedFinishes,
      },
    ],
  },
  "geometrical-floor-register": {
    name: "Geometrical Floor Register",
    slug: "geometrical-floor-register",
    styleName: "Geometrical",
    description:
      "Bold geometric motifs make a statement with our Geometrical floor register. Each piece is crafted from heavy-gauge steel with intricate angular patterns that double as functional art.",
    finishes: sharedFinishes,
    sizes: sharedSizes,
    images: getProductGalleryUrls("Geometrical", "Antique Brass"),
    relatedProducts: [
      {
        name: "Art Deco Floor Register",
        slug: "art-deco-floor-register",
        styleName: "Art Deco",
        basePrice: 9.9,
        finishes: sharedRelatedFinishes,
      },
      {
        name: "Contemporary Floor Register",
        slug: "contemporary-floor-register",
        styleName: "Contemporary",
        basePrice: 9.9,
        finishes: sharedRelatedFinishes,
      },
    ],
  },
};

const demoSlugs = Object.keys(demoProducts);

// --- Data fetching ---

async function getProduct(slug: string): Promise<DemoProduct | null> {
  try {
    const supabase = createStaticClient();
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        description,
        base_price,
        meta_title,
        meta_description,
        styles:style_id (name),
        product_variants (
          id,
          price,
          stock_qty,
          finishes:finish_id (id, name, slug, hex_color, gradient_css),
          sizes:size_id (id, label)
        ),
        product_images (
          image_url,
          alt_text,
          display_order,
          is_primary
        )
      `
      )
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error || !product) {
      return demoProducts[slug] ?? null;
    }

    // Transform Supabase data
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const styleData = product.styles as any;
    const variants = (product.product_variants as any[]) || [];
    const images = (product.product_images as any[]) || [];

    // Deduplicate finishes
    const finishMap = new Map<string, DemoFinish>();
    for (const v of variants) {
      const f = v.finishes;
      if (f && !finishMap.has(f.id)) {
        finishMap.set(f.id, {
          id: f.id,
          name: f.name,
          slug: f.slug,
          hex: f.hex_color || "#c9a96e",
          gradient:
            f.gradient_css ||
            "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
        });
      }
    }

    // Deduplicate sizes with prices
    const sizeMap = new Map<string, DemoSize>();
    for (const v of variants) {
      const s = v.sizes;
      if (s && !sizeMap.has(s.id)) {
        sizeMap.set(s.id, {
          id: s.id,
          label: s.label,
          price: v.price ?? product.base_price ?? 9.9,
          inStock: (v.stock_qty ?? 1) > 0,
        });
      }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return {
      name: product.name,
      slug: product.slug,
      styleName: styleData?.name || "Unknown",
      description:
        product.description ||
        "Premium decorative floor register, precision-engineered from heavy-gauge steel.",
      finishes: Array.from(finishMap.values()),
      sizes: Array.from(sizeMap.values()),
      images: images.length > 0
        ? images
            .sort(
              (a: { display_order: number }, b: { display_order: number }) =>
                a.display_order - b.display_order
            )
            .slice(0, 8)
            .map((img: { image_url: string; alt_text: string | null }) => ({
              url: img.image_url,
              alt: img.alt_text || product.name,
            }))
        : getProductGalleryUrls(styleData?.name || "Art Deco", Array.from(finishMap.values())[0]?.name || "Antique Brass"),
      relatedProducts: [], // Will fetch separately if needed
    };
  } catch {
    return demoProducts[slug] ?? null;
  }
}

async function getRelatedProducts(
  currentSlug: string
): Promise<DemoRelated[]> {
  // If we have demo data with related products, use those
  const demo = demoProducts[currentSlug];
  if (demo) return demo.relatedProducts;

  try {
    const supabase = createStaticClient();
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        name,
        slug,
        base_price,
        styles:style_id (name),
        product_variants (
          finishes:finish_id (name, hex_color, gradient_css)
        ),
        product_images (image_url, is_primary, display_order)
      `
      )
      .eq("active", true)
      .neq("slug", currentSlug)
      .limit(3);

    if (error || !products || products.length === 0) {
      return [];
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return products.map((p) => {
      const styleData = p.styles as any;
      const variants = (p.product_variants as any[]) || [];
      const images = (p.product_images as any[]) || [];

      const primaryImage =
        images.find((img: { is_primary: boolean }) => img.is_primary) ||
        images.sort(
          (a: { display_order: number }, b: { display_order: number }) =>
            a.display_order - b.display_order
        )[0];

      const finishMap = new Map<
        string,
        { name: string; hex: string; gradient: string }
      >();
      for (const v of variants) {
        const f = v.finishes;
        if (f && !finishMap.has(f.name)) {
          finishMap.set(f.name, {
            name: f.name,
            hex: f.hex_color || "#c9a96e",
            gradient:
              f.gradient_css ||
              "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
          });
        }
      }
      return {
        name: p.name,
        slug: p.slug,
        styleName: styleData?.name || "Unknown",
        basePrice: p.base_price ?? 9.9,
        imageUrl: primaryImage?.image_url || undefined,
        finishes: Array.from(finishMap.values()),
      };
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch {
    return [];
  }
}

// --- Static params ---

export async function generateStaticParams() {
  try {
    const supabase = createStaticClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug")
      .eq("active", true);

    if (products && products.length > 0) {
      return products.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // Fall through to demo slugs
  }

  return demoSlugs.map((slug) => ({ slug }));
}

// --- Metadata ---

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://decorativefloorregister.com";
  const prices = product.sizes.map((s) => s.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const finishNames = product.finishes.map((f) => f.name).join(", ");

  return {
    title: `${product.name}`,
    description: `${product.name} in ${finishNames}. From $${minPrice.toFixed(2)}. ${product.description}`,
    openGraph: {
      title: `${product.name} | Decorative Floor Register`,
      description: product.description,
      url: `${baseUrl}/shop/${product.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/shop/${product.slug}`,
    },
  };
}

// --- Page ---

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts =
    product.relatedProducts.length > 0
      ? product.relatedProducts
      : await getRelatedProducts(slug);

  const prices = product.sizes.map((s) => s.price);
  const hasStock = product.sizes.some((s) => s.inStock);

  return (
    <main className="bg-ivory">
      <ProductJsonLd
        name={product.name}
        description={product.description}
        slug={product.slug}
        priceRange={{ min: Math.min(...prices), max: Math.max(...prices) }}
        finishes={product.finishes.map((f) => f.name)}
        sizes={product.sizes.map((s) => s.label)}
        inStock={hasStock}
      />

      {/* Breadcrumb */}
      <div className="border-b border-linen bg-warm-white px-6 py-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex text-sm text-umber" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/" className="transition-colors hover:text-espresso">
                  Home
                </a>
              </li>
              <li className="text-linen">/</li>
              <li>
                <a
                  href="/shop"
                  className="transition-colors hover:text-espresso"
                >
                  Shop
                </a>
              </li>
              <li className="text-linen">/</li>
              <li className="text-espresso">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <ProductDetail product={product} />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </main>
  );
}
