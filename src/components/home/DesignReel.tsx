"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getProductImageUrl } from "@/lib/image-urls";

type Design = {
  name: string;
  slug: string;
  tagline: string;
  imageUrl: string;
};

const DESIGNS: Design[] = [
  {
    name: "Art Deco",
    slug: "art-deco",
    tagline: "Geometric elegance inspired by the 1920s.",
    imageUrl: getProductImageUrl("Art Deco", "Antique Brass"),
  },
  {
    name: "Contemporary",
    slug: "contemporary",
    tagline: "Clean minimal lines for modern interiors.",
    imageUrl: getProductImageUrl("Contemporary", "Antique Brass"),
  },
  {
    name: "Geometrical",
    slug: "geometrical",
    tagline: "Bold repeating motifs that double as art.",
    imageUrl: getProductImageUrl("Geometrical", "Antique Brass"),
  },
];

const ROTATE_MS = 4500;

export default function DesignReel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % DESIGNS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const current = DESIGNS[index];

  return (
    <section className="px-6 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <span className="text-label-sm uppercase tracking-widest text-antique-gold">
            Three Designs, Every Finish
          </span>
          <h2 className="mt-2 font-display text-display-md text-espresso">
            See the Collection in Motion
          </h2>
        </div>

        <div
          className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-linen shadow-md"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={current.slug}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.imageUrl}
                alt={`${current.name} floor register`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(28,20,14,0.55) 100%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 text-ivory">
                <p className="text-label-sm uppercase tracking-widest text-antique-gold">
                  {current.name}
                </p>
                <p className="mt-1 font-display text-xl md:text-2xl">
                  {current.tagline}
                </p>
                <Link
                  href={`/shop?style=${current.slug}`}
                  className="mt-3 inline-block rounded-sm border border-ivory/70 px-4 py-2 text-xs uppercase tracking-wider text-ivory transition-colors hover:bg-ivory hover:text-espresso"
                >
                  View {current.name}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicator dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {DESIGNS.map((d, i) => (
              <button
                key={d.slug}
                onClick={() => setIndex(i)}
                aria-label={`Show ${d.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-ivory" : "w-1.5 bg-ivory/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
