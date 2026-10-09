import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import DesignReel from "@/components/home/DesignReel";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";

// ISR: serve from CDN, revalidate every 60s
export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Decorative Floor Register | Premium Floor Registers & Grilles",
  absoluteTitle: true,
  description:
    "Handcrafted decorative floor registers in Art Deco, Contemporary, and Geometrical designs. Available in Antique Brass, Black, and Bronze finishes.",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <DesignReel />
      <CollectionShowcase />
      <FeaturedProducts />
    </>
  );
}
