import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { createStaticClient } from "@/lib/supabase/static";

const FINISH_SWATCHES = [
  {
    name: "Antique Brass",
    gradient: "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a)",
  },
  {
    name: "Black",
    gradient: "linear-gradient(135deg, #3a3632, #2c2420, #1a1714)",
  },
  {
    name: "Bronze",
    gradient: "linear-gradient(135deg, #9a7b4f, #8b6f3a, #6b5533)",
  },
];

const FALLBACK_PRODUCTS = [
  {
    name: "Art Deco Floor Register",
    slug: "art-deco-floor-register",
    style: "Art Deco",
    price: "From $9.90",
    imageUrl: undefined as string | undefined,
    imageGradient:
      "linear-gradient(145deg, #d4c5b0 0%, #c9a96e 40%, #d4b978 100%)",
    dotGradient: "linear-gradient(135deg, #d4c5b0, #c9a96e)",
  },
  {
    name: "Contemporary Floor Register",
    slug: "contemporary-floor-register",
    style: "Contemporary",
    price: "From $9.90",
    imageUrl: undefined as string | undefined,
    imageGradient:
      "linear-gradient(145deg, #3a3632 0%, #2c2420 40%, #1a1714 100%)",
    dotGradient: "linear-gradient(135deg, #3a3632, #2c2420)",
  },
  {
    name: "Geometrical Floor Register",
    slug: "geometrical-floor-register",
    style: "Geometrical",
    price: "From $9.90",
    imageUrl: undefined as string | undefined,
    imageGradient:
      "linear-gradient(145deg, #9a7b4f 0%, #8b6f3a 40%, #6b5533 100%)",
    dotGradient: "linear-gradient(135deg, #9a7b4f, #8b6f3a)",
  },
];

function ProductRegister() {
  return (
    <div className="mx-auto w-20">
      <div
        className="rounded border border-white/15 p-1.5"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid grid-cols-6 gap-[2px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/1] rounded-[1px]"
              style={{ background: "rgba(0,0,0,0.3)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type FeaturedProduct = {
  name: string;
  slug: string;
  style: string;
  price: string;
  imageUrl?: string;
  imageGradient: string;
  dotGradient: string;
};

const FINISH_GRADIENTS: Record<string, { imageGradient: string; dotGradient: string }> = {
  "Antique Brass": {
    imageGradient: "linear-gradient(145deg, #d4c5b0 0%, #c9a96e 40%, #d4b978 100%)",
    dotGradient: "linear-gradient(135deg, #d4c5b0, #c9a96e)",
  },
  "Black": {
    imageGradient: "linear-gradient(145deg, #3a3632 0%, #2c2420 40%, #1a1714 100%)",
    dotGradient: "linear-gradient(135deg, #3a3632, #2c2420)",
  },
  "Bronze": {
    imageGradient: "linear-gradient(145deg, #9a7b4f 0%, #8b6f3a 40%, #6b5533 100%)",
    dotGradient: "linear-gradient(135deg, #9a7b4f, #8b6f3a)",
  },
};

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
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
          finishes:finish_id (name)
        ),
        product_images (image_url, is_primary, display_order)
      `
      )
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error || !products || products.length === 0) {
      return FALLBACK_PRODUCTS;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return products.map((p) => {
      const styleData = p.styles as any;
      const styleName = styleData?.name || "Unknown";
      const variants = (p.product_variants as any[]) || [];
      const images = (p.product_images as any[]) || [];

      // Get primary image
      const primaryImage =
        images.find((img: { is_primary: boolean }) => img.is_primary) ||
        images.sort(
          (a: { display_order: number }, b: { display_order: number }) =>
            a.display_order - b.display_order
        )[0];

      // Get first finish for gradient fallback
      const firstFinish = variants[0]?.finishes?.name || "Antique Brass";
      const gradients = FINISH_GRADIENTS[firstFinish] || FINISH_GRADIENTS["Antique Brass"];

      return {
        name: p.name,
        slug: p.slug,
        style: styleName,
        price: `From $${(p.base_price ?? 9.9).toFixed(2)}`,
        imageUrl: primaryImage?.image_url || undefined,
        imageGradient: gradients.imageGradient,
        dotGradient: gradients.dotGradient,
      };
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-linen px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <span className="text-label-sm uppercase text-antique-gold">
              Featured
            </span>
            <h2 className="mt-3 font-display text-display-lg text-espresso">
              Bestselling Registers
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {products.map((product, index) => (
            <ScrollReveal key={product.name} delay={index * 0.15}>
              <Link
                href={`/shop/${product.slug}`}
                className="group block overflow-hidden rounded-xl bg-warm-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image area */}
                <div
                  className="light-sweep relative flex h-56 items-center justify-center"
                  style={{ background: product.imageGradient }}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <ProductRegister />
                  )}
                  {/* Metallic finish dot */}
                  <div
                    className="absolute right-3 top-3 z-10 h-5 w-5 rounded-full border border-white/20 shadow-sm"
                    style={{ background: product.dotGradient }}
                  />
                </div>

                {/* Product info */}
                <div className="p-5">
                  <span className="text-label-sm uppercase text-antique-gold">
                    {product.style}
                  </span>
                  <h3 className="mt-1.5 font-display text-xl font-medium text-espresso">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-umber">{product.price}</p>

                  {/* Finish swatches */}
                  <div className="mt-3 flex gap-2">
                    {FINISH_SWATCHES.map((swatch) => (
                      <div
                        key={swatch.name}
                        className="h-5 w-5 rounded-full border border-linen shadow-sm"
                        style={{ background: swatch.gradient }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
