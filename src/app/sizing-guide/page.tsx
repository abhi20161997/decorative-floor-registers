import type { Metadata } from "next";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sizing Guide",
    description:
      "Learn how to measure your floor duct opening and find the right register size. Complete size chart with duct opening and faceplate dimensions.",
    openGraph: {
      title: "Sizing Guide | Decorative Floor Register",
      description:
        "How to measure for a decorative floor register. Size chart with all 9 available sizes.",
    },
  };
}

const sizeChart = [
  { size: "2x10", ductOpening: '2" x 10"', faceplate: '3.5" x 11.5"' },
  { size: "2x12", ductOpening: '2" x 12"', faceplate: '3.5" x 13.5"' },
  { size: "2x14", ductOpening: '2" x 14"', faceplate: '3.5" x 15.5"' },
  { size: "4x10", ductOpening: '4" x 10"', faceplate: '5.5" x 11.5"' },
  { size: "4x12", ductOpening: '4" x 12"', faceplate: '5.5" x 13.5"' },
  { size: "4x14", ductOpening: '4" x 14"', faceplate: '5.5" x 15.5"' },
  { size: "6x10", ductOpening: '6" x 10"', faceplate: '7.5" x 11.5"' },
  { size: "6x12", ductOpening: '6" x 12"', faceplate: '7.5" x 13.5"' },
  { size: "6x14", ductOpening: '6" x 14"', faceplate: '7.5" x 15.5"' },
];

export default function SizingGuidePage() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <ScrollReveal>
            <p className="text-label-sm mb-4 uppercase tracking-widest text-antique-gold">
              Helpful Resources
            </p>
            <h1 className="font-display text-display-lg text-espresso">
              Sizing Guide
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-umber">
              Getting the right size is simple. Measure your duct opening and
              match it to our chart below.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* How to Measure */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal delay={0.1}>
          <h2 className="font-display text-display-md text-espresso">
            How to Measure
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Remove Existing Register",
                description:
                  "Carefully lift and remove your existing floor register from the duct opening.",
              },
              {
                step: "2",
                title: "Measure the Duct Opening",
                description:
                  'Using a tape measure, measure the width and length of the duct opening in your floor. Measure the hole itself, not the old register faceplate. Record as Width x Length (e.g., 4" x 10").',
              },
              {
                step: "3",
                title: "Match to Our Sizes",
                description:
                  "Find your duct opening dimensions in the size chart below. The faceplate will be slightly larger to overlap the opening and sit flush on your floor.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-lg border border-linen bg-warm-white p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-antique-gold/10">
                  <span className="font-display text-xl font-semibold text-antique-gold">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-medium text-espresso">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-umber">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Size Chart */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-display-md text-espresso">
              Size Chart
            </h2>
            <p className="mt-4 text-umber">
              All dimensions are in inches. The faceplate is the visible portion
              that sits on top of your floor.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-antique-gold/30">
                    <th className="px-4 py-3 text-left text-label-sm uppercase tracking-widest text-antique-gold">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-label-sm uppercase tracking-widest text-antique-gold">
                      Duct Opening
                    </th>
                    <th className="px-4 py-3 text-left text-label-sm uppercase tracking-widest text-antique-gold">
                      Faceplate (Approx.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row, i) => (
                    <tr
                      key={row.size}
                      className={`border-b border-linen ${
                        i % 2 === 0 ? "bg-ivory/50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-display text-lg font-medium text-espresso">
                        {row.size}
                      </td>
                      <td className="px-4 py-3 text-umber">
                        {row.ductOpening}
                      </td>
                      <td className="px-4 py-3 text-umber">{row.faceplate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal delay={0.2}>
          <h2 className="font-display text-display-md text-espresso">
            Helpful Tips
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Always measure the duct opening, never the existing register faceplate.",
              "If your measurement falls between sizes, choose the next size up for a proper fit.",
              "Our registers have a 1.5-inch overlap on each side, so the faceplate will be approximately 1.5 inches wider and longer than the duct opening.",
              "All of our registers are designed for floor installation. They are not recommended for wall or ceiling use.",
              "If you need a size not listed here, contact us to discuss custom options.",
            ].map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 flex-shrink-0 text-antique-gold">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5 4.5L6 12L2.5 8.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-umber">{tip}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>
    </div>
  );
}
