import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import DesignReel from "@/components/home/DesignReel";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";

// ISR: serve from CDN, revalidate every 60s
export const revalidate = 60;

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
