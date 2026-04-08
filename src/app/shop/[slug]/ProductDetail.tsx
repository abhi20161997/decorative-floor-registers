"use client";

import { useState, useMemo } from "react";
import ImageGallery from "@/components/product/ImageGallery";
import FinishSelector from "@/components/product/FinishSelector";
import SizeSelector from "@/components/product/SizeSelector";
import AddToCart from "@/components/product/AddToCart";
import SpecsTable from "@/components/product/SpecsTable";

type FinishOption = {
  id: string;
  name: string;
  slug: string;
  hex: string;
  gradient: string;
};

type SizeOption = {
  id: string;
  label: string;
  price: number;
  inStock: boolean;
};

type ProductImage = {
  url: string;
  alt: string;
};

type ProductDetailProps = {
  product: {
    name: string;
    slug: string;
    styleName: string;
    description: string;
    finishes: FinishOption[];
    sizes: SizeOption[];
    images: ProductImage[];
  };
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedFinishId, setSelectedFinishId] = useState(
    product.finishes[0]?.id ?? ""
  );
  const [selectedSizeId, setSelectedSizeId] = useState("");

  const selectedFinish = useMemo(
    () => product.finishes.find((f) => f.id === selectedFinishId) ?? null,
    [product.finishes, selectedFinishId]
  );

  const selectedSize = useMemo(
    () => product.sizes.find((s) => s.id === selectedSizeId) ?? null,
    [product.sizes, selectedSizeId]
  );

  const currentPrice = selectedSize?.price ?? product.sizes[0]?.price ?? 0;

  const cartVariant = useMemo(() => {
    if (!selectedSize || !selectedFinish) return null;
    return {
      id: `${product.slug}-${selectedFinish.slug}-${selectedSize.label}`,
      productName: product.name,
      productSlug: product.slug,
      finishName: selectedFinish.name,
      sizeName: selectedSize.label,
      price: selectedSize.price,
      imageUrl: "",
    };
  }, [product.name, product.slug, selectedFinish, selectedSize]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="lg:flex lg:gap-12">
        {/* Left column: Image gallery */}
        <div className="lg:w-1/2">
          <ImageGallery
            images={product.images}
            productName={product.name}
            finishGradient={
              selectedFinish?.gradient ??
              "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)"
            }
          />
        </div>

        {/* Right column: Product info */}
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          {/* Style label */}
          <span className="text-label-sm uppercase text-antique-gold">
            {product.styleName}
          </span>

          {/* Product name */}
          <h1 className="mt-2 font-display text-display-lg text-espresso">
            {product.name}
          </h1>

          {/* Description */}
          <p className="mt-4 leading-relaxed text-umber">
            {product.description}
          </p>

          {/* Price */}
          <p className="mt-6 font-display text-3xl font-medium text-antique-gold">
            ${currentPrice.toFixed(2)}
          </p>

          {/* Finish selector */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-espresso">Finish</h3>
            <FinishSelector
              finishes={product.finishes}
              selectedId={selectedFinishId}
              onSelect={setSelectedFinishId}
            />
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-espresso">Size</h3>
            <SizeSelector
              sizes={product.sizes}
              selectedId={selectedSizeId}
              onSelect={setSelectedSizeId}
            />
          </div>

          {/* Add to cart */}
          <div className="mt-8">
            <AddToCart variant={cartVariant} />
          </div>

          {/* Specs table */}
          <div className="mt-8">
            <h3 className="mb-3 font-display text-lg font-medium text-espresso">
              Specifications
            </h3>
            <SpecsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
