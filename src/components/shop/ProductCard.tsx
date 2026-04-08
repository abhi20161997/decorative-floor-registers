"use client";

import Link from "next/link";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    styleName: string;
    basePrice: number;
    finishes: { name: string; hex: string; gradient: string }[];
  };
};

function RegisterGrid() {
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

export default function ProductCard({ product }: ProductCardProps) {
  const primaryFinish = product.finishes[0];

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image area */}
      <div
        className="light-sweep relative flex aspect-square items-center justify-center"
        style={{ background: primaryFinish?.gradient }}
      >
        {/* Finish dot top-right */}
        {primaryFinish && (
          <div
            className="absolute right-3 top-3 h-5 w-5 rounded-full border border-white/20 shadow-sm"
            style={{ background: primaryFinish.gradient }}
          />
        )}
        <RegisterGrid />
      </div>

      {/* Product info */}
      <div className="p-5">
        <span className="text-label-sm uppercase text-antique-gold">
          {product.styleName}
        </span>
        <h3 className="mt-1.5 font-display text-xl font-medium text-espresso">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-umber">
          From ${product.basePrice.toFixed(2)}
        </p>

        {/* Finish swatches */}
        <div className="mt-3 flex gap-2">
          {product.finishes.map((finish) => (
            <div
              key={finish.name}
              className="h-4 w-4 rounded-full border border-linen shadow-sm"
              style={{ background: finish.gradient }}
              title={finish.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
