import type { Metadata } from "next";
import ScrollReveal from "@/components/animations/ScrollReveal";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shipping & Returns",
    description:
      "Free shipping on orders over $50. Standard shipping $5.99. 30-day return policy on unused items. Learn about our shipping rates, delivery times, and return process.",
    openGraph: {
      title: "Shipping & Returns | Decorative Floor Register",
      description:
        "Free shipping on orders over $50. 30-day return policy. US shipping with 5-7 business day delivery.",
    },
  };
}

export default function ShippingReturnsPage() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <ScrollReveal>
            <p className="text-label-sm mb-4 uppercase tracking-widest text-antique-gold">
              Policies
            </p>
            <h1 className="font-display text-display-lg text-espresso">
              Shipping & Returns
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-umber">
              We want you to be completely satisfied with your purchase. Here is
              everything you need to know about shipping and returns.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Shipping Rates */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal delay={0.1}>
          <h2 className="font-display text-display-md text-espresso">
            Shipping
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-linen bg-warm-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-antique-gold/10">
                  <svg
                    className="h-5 w-5 text-antique-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-medium text-espresso">
                  Free Shipping
                </h3>
              </div>
              <p className="mt-3 text-umber">
                Orders over <strong className="text-espresso">$50</strong>{" "}
                qualify for free standard shipping anywhere in the US.
              </p>
            </div>

            <div className="rounded-xl border border-linen bg-warm-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-antique-gold/10">
                  <svg
                    className="h-5 w-5 text-antique-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-medium text-espresso">
                  Standard Shipping
                </h3>
              </div>
              <p className="mt-3 text-umber">
                Flat rate of <strong className="text-espresso">$5.99</strong>{" "}
                for orders under $50.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="font-display text-xl font-medium text-espresso">
              Delivery Estimates
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-antique-gold/30">
                    <th className="px-4 py-3 text-left text-label-sm uppercase tracking-widest text-antique-gold">
                      Shipping Method
                    </th>
                    <th className="px-4 py-3 text-left text-label-sm uppercase tracking-widest text-antique-gold">
                      Estimated Delivery
                    </th>
                    <th className="px-4 py-3 text-left text-label-sm uppercase tracking-widest text-antique-gold">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-linen">
                    <td className="px-4 py-3 font-medium text-espresso">
                      Standard Shipping
                    </td>
                    <td className="px-4 py-3 text-umber">
                      5&ndash;7 business days
                    </td>
                    <td className="px-4 py-3 text-umber">
                      $5.99 (Free over $50)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-umber">
              We currently ship within the United States only. All orders are
              processed within 1&ndash;2 business days. Delivery times begin
              after processing is complete.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Returns */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-display-md text-espresso">
              Returns
            </h2>

            <div className="mt-8 space-y-8">
              {/* Return Policy */}
              <div>
                <h3 className="font-display text-xl font-medium text-espresso">
                  30-Day Return Policy
                </h3>
                <p className="mt-3 leading-relaxed text-umber">
                  We stand behind the quality of our products. If you are not
                  completely satisfied with your purchase, you may return it
                  within 30 days of delivery for a full refund. Items must be
                  unused and in their original packaging.
                </p>
              </div>

              {/* Return Conditions */}
              <div>
                <h3 className="font-display text-xl font-medium text-espresso">
                  Return Conditions
                </h3>
                <ul className="mt-3 space-y-2">
                  {[
                    "Items must be unused and in original, undamaged packaging",
                    "Returns must be initiated within 30 days of delivery",
                    "Customer is responsible for return shipping costs",
                    "Items that show signs of use or installation are not eligible for return",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-umber">
                      <span className="mt-1 flex-shrink-0 text-antique-gold">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="3"
                            fill="currentColor"
                            opacity="0.3"
                          />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exchange Process */}
              <div>
                <h3 className="font-display text-xl font-medium text-espresso">
                  Exchange Process
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      step: "1",
                      title: "Contact Us",
                      description:
                        "Email or call us to initiate your return or exchange. We will provide a return authorization.",
                    },
                    {
                      step: "2",
                      title: "Ship It Back",
                      description:
                        "Pack the item securely in the original packaging and ship it to our return address.",
                    },
                    {
                      step: "3",
                      title: "Get Your Refund",
                      description:
                        "Once received and inspected, your refund will be processed within 5\u20137 business days to your original payment method.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="rounded-lg border border-linen bg-ivory p-5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-antique-gold/10">
                        <span className="font-display text-sm font-semibold text-antique-gold">
                          {item.step}
                        </span>
                      </div>
                      <h4 className="mt-3 font-display text-lg font-medium text-espresso">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-umber">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8 lg:py-24">
        <ScrollReveal delay={0.2}>
          <h2 className="font-display text-display-md text-espresso">
            Still Have Questions?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-umber">
            Our team is here to help. Reach out and we will get back to you
            within 1&ndash;2 business days.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="light-sweep inline-block rounded-lg bg-antique-gold px-8 py-3 text-label-md uppercase tracking-widest text-white transition-colors hover:bg-brass"
            >
              Contact Us
            </a>
            <a
              href="/faq"
              className="inline-block rounded-lg border border-linen bg-warm-white px-8 py-3 text-label-md uppercase tracking-widest text-espresso transition-colors hover:border-antique-gold"
            >
              View FAQ
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
