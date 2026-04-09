"use client";

import Link from "next/link";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { getProductImageUrl } from "@/lib/image-urls";

const COLLECTIONS = [
  {
    name: "Art Deco",
    slug: "art-deco",
    gradient:
      "linear-gradient(145deg, #d4c5b0 0%, #c9a96e 50%, #d4b978 100%)",
    description: "Elegant 1920s-inspired patterns with bold geometric lines",
    imageUrl: getProductImageUrl("Art Deco", "Antique Brass"),
  },
  {
    name: "Contemporary",
    slug: "contemporary",
    gradient:
      "linear-gradient(145deg, #3a3632 0%, #2c2420 50%, #1a1714 100%)",
    textColor: "text-linen",
    description: "Clean, minimal designs for modern interiors",
    imageUrl: getProductImageUrl("Contemporary", "Black"),
  },
  {
    name: "Geometrical",
    slug: "geometrical",
    gradient:
      "linear-gradient(145deg, #9a7b4f 0%, #8b6f3a 50%, #6b5533 100%)",
    textColor: "text-linen",
    description: "Precise repeating patterns with mathematical harmony",
    imageUrl: getProductImageUrl("Geometrical", "Bronze"),
  },
];

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
                  {/* Real product image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={collection.imageUrl}
                    alt={`${collection.name} floor register`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />

                  {/* Gradient overlay for text readability */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center">
                    <h3
                      className="mt-6 font-display text-3xl font-medium text-white drop-shadow-md"
                    >
                      {collection.name}
                    </h3>
                    <span
                      className="mt-3 text-sm tracking-wide text-white/80 transition-opacity duration-300 group-hover:text-white"
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
