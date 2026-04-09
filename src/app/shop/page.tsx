import { Suspense } from "react";
import type { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { getProductImageUrl } from "@/lib/image-urls";
import ShopContent from "./ShopContent";

// ISR: cache for 60s so pages are served from CDN, not fresh SSR every request
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All Registers | Decorative Floor Registers",
  description:
    "Browse our collection of decorative floor registers in Art Deco, Contemporary, and Geometrical styles. Available in Antique Brass, Black, and Bronze finishes.",
};

const demoProducts = [
  {
    name: "Art Deco Floor Register",
    slug: "art-deco-floor-register",
    styleName: "Art Deco",
    basePrice: 9.9,
    imageUrl: getProductImageUrl("Art Deco", "Antique Brass"),
    finishes: [
      {
        name: "Antique Brass",
        hex: "#c9a96e",
        gradient:
          "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
      },
      {
        name: "Black",
        hex: "#2c2420",
        gradient:
          "linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)",
      },
      {
        name: "Bronze",
        hex: "#8b6f3a",
        gradient:
          "linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)",
      },
    ],
  },
  {
    name: "Contemporary Floor Register",
    slug: "contemporary-floor-register",
    styleName: "Contemporary",
    basePrice: 9.9,
    imageUrl: getProductImageUrl("Contemporary", "Antique Brass"),
    finishes: [
      {
        name: "Antique Brass",
        hex: "#c9a96e",
        gradient:
          "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
      },
      {
        name: "Black",
        hex: "#2c2420",
        gradient:
          "linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)",
      },
      {
        name: "Bronze",
        hex: "#8b6f3a",
        gradient:
          "linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)",
      },
    ],
  },
  {
    name: "Geometrical Floor Register",
    slug: "geometrical-floor-register",
    styleName: "Geometrical",
    basePrice: 9.9,
    imageUrl: getProductImageUrl("Geometrical", "Antique Brass"),
    finishes: [
      {
        name: "Antique Brass",
        hex: "#c9a96e",
        gradient:
          "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
      },
      {
        name: "Black",
        hex: "#2c2420",
        gradient:
          "linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)",
      },
      {
        name: "Bronze",
        hex: "#8b6f3a",
        gradient:
          "linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)",
      },
    ],
  },
];

type ShopProduct = {
  name: string;
  slug: string;
  styleName: string;
  basePrice: number;
  imageUrl?: string;
  finishes: { name: string; hex: string; gradient: string }[];
};

async function getProducts(): Promise<ShopProduct[]> {
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
      .order("created_at", { ascending: false });

    if (error || !products || products.length === 0) {
      return demoProducts;
    }

    // Transform Supabase data to our shape
    const transformed: ShopProduct[] = products.map((p) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const styleData = p.styles as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variants = (p.product_variants as any[]) || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const images = (p.product_images as any[]) || [];

      // Find the primary image, or fall back to first image by display_order
      const primaryImage =
        images.find((img: { is_primary: boolean }) => img.is_primary) ||
        images.sort(
          (a: { display_order: number }, b: { display_order: number }) =>
            a.display_order - b.display_order
        )[0];

      // Deduplicate finishes from variants
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
        imageUrl: primaryImage?.image_url || getProductImageUrl(styleData?.name || "Art Deco", Array.from(finishMap.values())[0]?.name || "Antique Brass"),
        finishes: Array.from(finishMap.values()),
      };
    });

    return transformed.length > 0 ? transformed : demoProducts;
  } catch {
    return demoProducts;
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="bg-ivory">
      {/* Page header */}
      <div className="border-b border-linen bg-warm-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-label-sm uppercase text-antique-gold">
            Collection
          </span>
          <h1 className="mt-3 font-display text-display-md text-espresso lg:text-display-lg">
            Shop All Registers
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-umber">
            Browse our complete collection of decorative floor registers,
            crafted in timeless styles and premium metallic finishes.
          </p>
        </div>
      </div>

      {/* Shop content with filters */}
      <div className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Suspense
            fallback={
              <div className="py-20 text-center text-umber">
                Loading products...
              </div>
            }
          >
            <ShopContent products={products} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
