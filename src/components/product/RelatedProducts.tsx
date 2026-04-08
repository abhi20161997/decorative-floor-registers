import ProductCard from "@/components/shop/ProductCard";

type RelatedProduct = {
  name: string;
  slug: string;
  styleName: string;
  basePrice: number;
  imageUrl?: string;
  finishes: { name: string; hex: string; gradient: string }[];
};

type RelatedProductsProps = {
  products: RelatedProduct[];
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  const displayProducts = products.slice(0, 3);

  return (
    <section className="mt-16 border-t border-linen pt-12">
      <h2 className="mb-8 text-center font-display text-display-md text-espresso">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
