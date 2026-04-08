"use client";

import Link from "next/link";
import ScrollReveal from "@/components/animations/ScrollReveal";

const COLLECTIONS = [
  {
    name: "Art Deco",
    slug: "art-deco",
    gradient:
      "linear-gradient(145deg, #d4c5b0 0%, #c9a96e 50%, #d4b978 100%)",
    description: "Elegant 1920s-inspired patterns with bold geometric lines",
  },
  {
    name: "Contemporary",
    slug: "contemporary",
    gradient:
      "linear-gradient(145deg, #3a3632 0%, #2c2420 50%, #1a1714 100%)",
    textColor: "text-linen",
    description: "Clean, minimal designs for modern interiors",
  },
  {
    name: "Geometrical",
    slug: "geometrical",
    gradient:
      "linear-gradient(145deg, #9a7b4f 0%, #8b6f3a 50%, #6b5533 100%)",
    textColor: "text-linen",
    description: "Precise repeating patterns with mathematical harmony",
  },
];

function SmallRegister() {
  return (
    <div className="mx-auto w-24">
      <div
        className="rounded border border-white/20 p-2"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div className="grid grid-cols-6 gap-0.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/1] rounded-[1px]"
              style={{
                background: "rgba(0,0,0,0.35)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollectionShowcase() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <span className="text-label-sm uppercase text-antique-gold">
              Our Collections
            </span>
            <h2 className="mt-3 font-display text-display-lg text-espresso">
              Three Distinct Styles
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {COLLECTIONS.map((collection, index) => (
            <ScrollReveal key={collection.slug} delay={index * 0.15}>
              <Link
                href={`/shop?style=${collection.slug}`}
                className="group block overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="relative flex h-72 flex-col items-center justify-center p-8"
                  style={{ background: collection.gradient }}
                >
                  {/* Brushed metal texture */}
                  <div className="texture-brushed-metal absolute inset-0" />

                  <div className="relative z-10 flex flex-col items-center">
                    <SmallRegister />
                    <h3
                      className={`mt-6 font-display text-3xl font-medium ${
                        collection.textColor || "text-espresso"
                      }`}
                    >
                      {collection.name}
                    </h3>
                    <span
                      className={`mt-3 text-sm tracking-wide opacity-80 transition-opacity duration-300 group-hover:opacity-100 ${
                        collection.textColor || "text-umber"
                      }`}
                    >
                      Explore Collection &rarr;
                    </span>
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
