import type { Metadata } from "next";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us",
    description:
      "Learn about Decorative Floor Register — precision-engineered decorative floor registers crafted from heavy-gauge steel in three curated finishes.",
    openGraph: {
      title: "About Us | Decorative Floor Register",
      description:
        "Founded with a passion for transforming overlooked details into defining features of your home.",
    },
  };
}

type ContentBlock = {
  id: string;
  title: string | null;
  body: string | null;
  section_key: string;
};

async function getAboutContent(): Promise<ContentBlock[] | null> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("content_blocks")
      .select("id, title, body, section_key")
      .eq("page", "about")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const contentBlocks = await getAboutContent();

  // Extract content from CMS blocks or use hardcoded fallback
  const heroTitle =
    contentBlocks?.find((b) => b.section_key === "hero")?.title || "Our Story";
  const heroBody =
    contentBlocks?.find((b) => b.section_key === "hero")?.body ||
    "Founded with a passion for transforming overlooked details into defining features of your home.";
  const storyBody =
    contentBlocks?.find((b) => b.section_key === "story")?.body ||
    "Our decorative floor registers are precision-engineered from heavy-gauge steel, featuring individually welded diffusion vanes and multi-angle damper systems. Each register is available in three curated finishes \u2014 Antique Brass, Matte Black, and Oil Rubbed Bronze \u2014 designed to complement any interior style.";
  const qualityTitle =
    contentBlocks?.find((b) => b.section_key === "quality")?.title ||
    "Our Commitment to Quality";
  const qualityBody =
    contentBlocks?.find((b) => b.section_key === "quality")?.body ||
    "Every register we produce undergoes rigorous quality inspection before leaving our facility. From the precision of our laser-cut patterns to the consistency of our hand-applied finishes, we hold ourselves to the highest standards. We believe that the details you walk over every day deserve the same attention as the ones you admire on your walls.";

  return (
    <div className="bg-ivory">
      {/* Hero Section */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <ScrollReveal>
            <p className="text-label-sm mb-4 uppercase tracking-widest text-antique-gold">
              About Us
            </p>
            <h1 className="font-display text-display-lg text-espresso">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-umber">
              {heroBody}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Manufacturing Story */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal delay={0.1}>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Decorative element */}
            <div className="relative flex items-center justify-center">
              <div className="h-64 w-full rounded-lg bg-gradient-to-br from-brass/20 via-antique-gold/10 to-brass/20 texture-brushed-metal" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-6xl font-semibold text-antique-gold">
                    3
                  </p>
                  <p className="mt-1 text-label-sm uppercase tracking-widest text-umber">
                    Curated Finishes
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-display-md text-espresso">
                Precision Engineering
              </h2>
              <p className="mt-4 leading-relaxed text-umber">{storyBody}</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Finishes Showcase */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          <ScrollReveal delay={0.15}>
            <h2 className="text-center font-display text-display-md text-espresso">
              Three Signature Finishes
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                {
                  name: "Antique Brass",
                  gradient:
                    "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
                  description:
                    "Warm golden tones that evoke timeless elegance",
                },
                {
                  name: "Matte Black",
                  gradient:
                    "linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)",
                  description:
                    "Sleek and modern for contemporary interiors",
                },
                {
                  name: "Oil Rubbed Bronze",
                  gradient:
                    "linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)",
                  description:
                    "Rich, deep tones with an aged patina character",
                },
              ].map((finish) => (
                <div key={finish.name} className="text-center">
                  <div
                    className="mx-auto h-24 w-24 rounded-full shadow-md"
                    style={{ background: finish.gradient }}
                  />
                  <h3 className="mt-4 font-display text-xl font-medium text-espresso">
                    {finish.name}
                  </h3>
                  <p className="mt-2 text-sm text-umber">
                    {finish.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal delay={0.2}>
          <div className="text-center">
            <h2 className="font-display text-display-md text-espresso">
              {qualityTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-umber">
              {qualityBody}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Stats */}
      <section className="border-t border-linen bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          <ScrollReveal delay={0.25}>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "9", label: "Sizes Available" },
                { value: "3", label: "Premium Finishes" },
                { value: "3", label: "Unique Styles" },
                { value: "30", label: "Day Returns" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl font-semibold text-antique-gold">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-umber">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
