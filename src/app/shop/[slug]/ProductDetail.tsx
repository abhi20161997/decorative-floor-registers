"use client";

import { useState, useMemo } from "react";
import ImageGallery from "@/components/product/ImageGallery";
import FinishSelector from "@/components/product/FinishSelector";
import SizeSelector from "@/components/product/SizeSelector";
import AddToCart from "@/components/product/AddToCart";
import SpecsTable from "@/components/product/SpecsTable";
import BulkPricingTable from "@/components/product/BulkPricingTable";
import { formatPrice } from "@/lib/utils";

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

type VariantRef = {
  id: string;
  finishId: string;
  sizeId: string;
  price: number;
  inStock: boolean;
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
    imagesByFinish: Record<string, ProductImage[]>;
    variants: VariantRef[];
    cadUrl: string | null;
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

  const selectedVariant = useMemo(() => {
    if (!selectedFinish || !selectedSize) return null;
    return (
      product.variants.find(
        (v) =>
          v.finishId === selectedFinish.id && v.sizeId === selectedSize.id
      ) ?? null
    );
  }, [product.variants, selectedFinish, selectedSize]);

  const currentPrice =
    selectedVariant?.price ?? selectedSize?.price ?? product.sizes[0]?.price ?? 0;

  const galleryImages = useMemo(() => {
    if (!selectedFinish) return product.images;
    const perFinish = product.imagesByFinish[selectedFinish.id];
    return perFinish && perFinish.length > 0 ? perFinish : product.images;
  }, [product.images, product.imagesByFinish, selectedFinish]);

  const cartVariant = useMemo(() => {
    if (!selectedVariant || !selectedSize || !selectedFinish) return null;
    return {
      id: selectedVariant.id,
      productName: product.name,
      productSlug: product.slug,
      finishName: selectedFinish.name,
      sizeName: selectedSize.label,
      price: selectedVariant.price,
      imageUrl: galleryImages[0]?.url ?? "",
    };
  }, [
    product.name,
    product.slug,
    selectedFinish,
    selectedSize,
    selectedVariant,
    galleryImages,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="lg:flex lg:gap-12">
        {/* Left column: Image gallery */}
        <div className="lg:w-1/2">
          <ImageGallery
            key={selectedFinish?.id ?? "default"}
            images={galleryImages}
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

          {/* Selling points */}
          <ul className="mt-4 space-y-1.5 text-sm text-umber">
            <li className="flex gap-2">
              <span className="text-antique-gold">&bull;</span>
              <span>
                Louvers are real sheet metal &mdash; not cheap plastic.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-antique-gold">&bull;</span>
              <span>
                Works on walls too &mdash; pair with spring clips (sold
                separately) for vertical installs.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-antique-gold">&bull;</span>
              <span>
                Any custom size or design is possible with a development fee
                and lead-time quote.
              </span>
            </li>
          </ul>

          {/* Price */}
          <p className="mt-6 font-display text-3xl font-medium text-antique-gold">
            {formatPrice(currentPrice)}
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

          {/* Bulk pricing tiers */}
          <div className="mt-6">
            <BulkPricingTable unitPrice={currentPrice} />
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

          {/* CAD drawing download */}
          {product.cadUrl && (
            <div className="mt-6">
              <a
                href={product.cadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-linen bg-warm-white px-5 py-3 text-sm font-medium text-espresso transition-colors hover:border-antique-gold hover:text-antique-gold"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                Download CAD Drawing (PDF)
              </a>
              <p className="mt-2 text-xs text-umber">
                For architects &amp; contractors &mdash; includes dimensions
                and cutout details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
