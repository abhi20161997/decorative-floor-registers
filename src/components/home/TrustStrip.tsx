"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";

const TRUST_ITEMS = [
  { icon: "\u2605", label: "Premium Steel", value: "1.5mm Gauge" },
  { icon: "\u2699", label: "3 Collections", value: "Designs" },
  { icon: "\u25C6", label: "3 Metallic", value: "Finishes" },
  { icon: "\u2713", label: "Free over $50", value: "Shipping" },
];

export default function TrustStrip() {
  return (
    <section className="px-6 pt-2 pb-10 lg:px-8">
      <ScrollReveal>
        <p className="mb-4 text-center text-sm font-medium tracking-wide text-umber/70">
          Trusted by homeowners, contractors &amp; designers nationwide
        </p>
        <div className="mx-auto max-w-5xl rounded-xl bg-warm-white p-6 shadow-md">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.label}
                className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-lg text-ivory"
                  style={{
                    background:
                      "linear-gradient(135deg, #c9a96e, #9a7b4f)",
                  }}
                >
                  {item.icon}
                </div>
                <p className="text-label-sm uppercase text-umber">
                  {item.label}
                </p>
                <p className="mt-0.5 font-display text-base font-medium text-espresso">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
