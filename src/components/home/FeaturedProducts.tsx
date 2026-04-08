"use client";

import Link from "next/link";
import ScrollReveal from "@/components/animations/ScrollReveal";

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

const PRODUCTS = [
  {
    name: "Victorian Lattice Register",
    style: "Art Deco",
    price: "From $9.90",
    finishIndex: 0,
    imageGradient:
      "linear-gradient(145deg, #d4c5b0 0%, #c9a96e 40%, #d4b978 100%)",
    dotGradient: "linear-gradient(135deg, #d4c5b0, #c9a96e)",
  },
  {
    name: "Horizon Line Register",
    style: "Contemporary",
    price: "From $9.90",
    finishIndex: 1,
    imageGradient:
      "linear-gradient(145deg, #3a3632 0%, #2c2420 40%, #1a1714 100%)",
    dotGradient: "linear-gradient(135deg, #3a3632, #2c2420)",
  },
  {
    name: "Hex Mosaic Register",
    style: "Geometrical",
    price: "From $9.90",
    finishIndex: 2,
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

export default function FeaturedProducts() {
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
          {PRODUCTS.map((product, index) => (
            <ScrollReveal key={product.name} delay={index * 0.15}>
              <Link
                href="/shop"
                className="group block overflow-hidden rounded-xl bg-warm-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image area */}
                <div
                  className="light-sweep relative flex h-56 items-center justify-center"
                  style={{ background: product.imageGradient }}
                >
                  {/* Metallic finish dot */}
                  <div
                    className="absolute right-3 top-3 h-5 w-5 rounded-full border border-white/20 shadow-sm"
                    style={{ background: product.dotGradient }}
                  />

                  <ProductRegister />
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
