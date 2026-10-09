import { createStaticClient } from "@/lib/supabase/static";
import { getProductImageUrl } from "@/lib/image-urls";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Decorative floor register";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 3600;

type OgProduct = {
  name: string;
  styleName: string;
  minPrice: number | null;
  imageUrl: string;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function fallbackProduct(slug: string): OgProduct {
  const name = titleFromSlug(slug);
  const styleName = name.replace(/ Floor Register$/, "");
  return {
    name,
    styleName,
    minPrice: null,
    imageUrl: getProductImageUrl(styleName, "Antique Brass"),
  };
}

async function getOgProduct(slug: string): Promise<OgProduct> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("products")
      .select(
        "name, base_price, styles:style_id (name), product_variants (price), product_images (image_url, is_primary, display_order)"
      )
      .eq("slug", slug)
      .eq("active", true)
      .single();
    if (!data) return fallbackProduct(slug);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const styleName = (data.styles as any)?.name ?? titleFromSlug(slug);
    const prices = ((data.product_variants as any[]) ?? [])
      .map((v) => v.price)
      .filter((p): p is number => typeof p === "number");
    const images = [...((data.product_images as any[]) ?? [])].sort((a, b) =>
      a.is_primary !== b.is_primary ? (a.is_primary ? -1 : 1) : a.display_order - b.display_order
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return {
      name: data.name,
      styleName,
      minPrice: prices.length ? Math.min(...prices) : data.base_price ?? null,
      imageUrl: images[0]?.image_url ?? getProductImageUrl(styleName, "Antique Brass"),
    };
  } catch {
    return fallbackProduct(slug);
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getOgProduct(slug);

  return renderOgImage({
    eyebrow: `${product.styleName} collection`,
    title: product.name,
    subtitle: "Antique Brass, Black and Bronze finishes · 9 sizes",
    chips: product.minPrice != null ? [`From $${product.minPrice.toFixed(2)}`] : undefined,
    imageUrl: product.imageUrl,
  });
}
