interface ProductJsonLdProps {
  name: string;
  description: string;
  slug: string;
  priceRange: { min: number; max: number };
  finishes: string[];
  sizes: string[];
  inStock: boolean;
}

export default function ProductJsonLd({
  name,
  description,
  slug,
  priceRange,
  finishes,
  sizes,
  inStock,
}: ProductJsonLdProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://decorativefloorregister.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${baseUrl}/shop/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Decorative Floor Register",
    },
    category: "Home Improvement > Heating & Cooling > Registers & Grilles",
    material: "Heavy-Gauge Steel",
    color: finishes,
    size: sizes,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: priceRange.min.toFixed(2),
      highPrice: priceRange.max.toFixed(2),
      offerCount: sizes.length * finishes.length,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
