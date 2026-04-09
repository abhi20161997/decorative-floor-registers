/**
 * Construct Supabase Storage image URLs directly from product attributes.
 * This bypasses the product_images table and uses the known upload path pattern.
 */

const STORAGE_BASE =
  "https://mohjyircqwhmxlkqiasl.supabase.co/storage/v1/object/public/product-images/products";

const STYLE_SLUG_MAP: Record<string, string> = {
  "Art Deco": "art-deco",
  "Contemporary": "contemporary",
  "Geometrical": "geometrical",
};

const FINISH_SLUG_MAP: Record<string, string> = {
  "Antique Brass": "antique-brass",
  "antique-brass": "antique-brass",
  "Black": "black",
  "black": "black",
  "Bronze": "bronze",
  "bronze": "bronze",
};

/**
 * Get the primary product image URL for a given style and finish.
 * Uses the 4X10 size directory and the first image (1.webp) as the representative image.
 */
export function getProductImageUrl(
  styleName: string,
  finishName: string,
  size: string = "4X10",
  filename: string = "1.webp"
): string {
  const styleSlug = STYLE_SLUG_MAP[styleName] || styleName.toLowerCase().replace(/\s+/g, "-");
  const finishSlug = FINISH_SLUG_MAP[finishName] || finishName.toLowerCase().replace(/\s+/g, "-");
  return `${STORAGE_BASE}/${styleSlug}/${finishSlug}/${size}/${filename}`;
}

/**
 * Get multiple image URLs for a product+finish combination across different sizes.
 * Returns one representative image per size for gallery thumbnails.
 */
export function getProductGalleryUrls(
  styleName: string,
  finishName: string
): { url: string; alt: string }[] {
  const sizes = ["2X10", "4X10", "4X12", "6X10", "6X12", "6X14"];
  return sizes.map((size) => ({
    url: getProductImageUrl(styleName, finishName, size, "1.webp"),
    alt: `${styleName} Floor Register in ${finishName} - ${size}`,
  }));
}
