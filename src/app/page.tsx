import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CollectionShowcase />
      <FeaturedProducts />
    </>
  );
}
