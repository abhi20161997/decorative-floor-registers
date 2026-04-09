"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const HERO_IMAGE_URL =
  "https://mohjyircqwhmxlkqiasl.supabase.co/storage/v1/object/public/product-images/products/art-deco/antique-brass/4X10/1.webp";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 md:flex-row md:gap-12 md:py-20 lg:px-8">
        {/* Left side: Content */}
        <motion.div
          className="flex flex-1 flex-col items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="mb-3 text-label-sm uppercase tracking-widest text-antique-gold"
            variants={itemVariants}
          >
            Trusted by Homeowners Across America
          </motion.span>

          <motion.h1
            className="mb-4 font-display text-display-xl text-espresso"
            variants={itemVariants}
          >
            Premium Registers That{" "}
            <span className="text-metallic">Transform</span>{" "}
            Your Space
          </motion.h1>

          <motion.p
            className="mb-4 max-w-[440px] text-lg leading-relaxed text-umber"
            variants={itemVariants}
          >
            Handcrafted in heavy-gauge steel with three stunning metallic finishes.
            Our decorative floor registers elevate every room where form meets function.
          </motion.p>

          <motion.p
            className="mb-6 flex items-center gap-1.5 text-sm text-umber/80"
            variants={itemVariants}
          >
            <span className="text-antique-gold">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span>Trusted by 500+ homeowners, contractors, and designers across the US</span>
          </motion.p>

          <motion.div className="flex flex-wrap items-center gap-4" variants={itemVariants}>
            <Link
              href="/shop"
              className="light-sweep inline-block rounded-sm bg-espresso px-8 py-3.5 text-label-md uppercase tracking-wider text-linen transition-shadow duration-300 hover:shadow-lg"
            >
              Shop Collection
            </Link>
            <Link
              href="/sizing-guide"
              className="inline-block rounded-sm border-2 border-espresso px-8 py-3 text-label-md uppercase tracking-wider text-espresso transition-colors duration-300 hover:bg-espresso hover:text-linen"
            >
              View Sizing Guide
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side: Product photo showcase */}
        <motion.div
          className="relative flex flex-1 items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div
            className="relative h-[320px] w-full max-w-[480px] overflow-hidden rounded-2xl md:h-[420px]"
            style={{
              background:
                "linear-gradient(135deg, #d4c5b0 0%, #c9a96e 30%, #b8976a 60%, #d4b978 100%)",
            }}
          >
            {/* Metallic background for premium feel */}
            <div
              className="absolute inset-0 animate-metallic-shift"
              style={{
                background:
                  "linear-gradient(135deg, #d4c5b0 0%, #c9a96e 30%, #b8976a 60%, #d4b978 100%)",
                backgroundSize: "400% 400%",
              }}
            />

            {/* Real product image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE_URL}
              alt="Art Deco decorative floor register in Antique Brass finish"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />

            {/* Subtle gradient overlay for premium feel */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.15) 100%)",
              }}
            />

            {/* Animated light reflection */}
            <div
              className="pointer-events-none absolute inset-0 animate-light-reflect"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
