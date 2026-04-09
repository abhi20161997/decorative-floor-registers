"use client";

import Link from "next/link";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { getProductImageUrl } from "@/lib/image-urls";

// Use antique-brass finish for all - guaranteed to work. Each style has different patterns.
const COLLECTIONS = [
  {
    name: "Art Deco",
    slug: "art-deco",
    description: "Elegant 1920s-inspired geometric patterns",
    imageUrl: getProductImageUrl("Art Deco", "Antique Brass"),
    accentColor: "#c9a96e",
  },
  {
    name: "Contemporary",
    slug: "contemporary",
    description: "Clean, minimal designs for modern homes",
    imageUrl: getProductImageUrl("Contemporary", "Antique Brass"),
    accentColor: "#9a7b4f",
  },
  {
    name: "Geometrical",
    slug: "geometrical",
    description: "Bold repeating shapes with precision",
    imageUrl: getProductImageUrl("Geometrical", "Antique Brass"),
    accentColor: "#8b6f3a",
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

        <div className="grid gap-8 md:grid-cols-3">
          {COLLECTIONS.map((collection, index) => (
            <ScrollReveal key={collection.slug} delay={index * 0.15}>
              <Link
                href={`/shop?style=${collection.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Product image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-linen">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={collection.imageUrl}
                    alt={`${collection.name} floor register`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Text below image */}
                <div className="p-6 text-center">
                  <h3 className="font-display text-2xl font-medium text-espresso">
                    {collection.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-umber">
                    {collection.description}
                  </p>
                  <span
                    className="mt-4 inline-block text-label-sm uppercase tracking-wide transition-colors"
                    style={{ color: collection.accentColor }}
                  >
                    Explore Collection &rarr;
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
