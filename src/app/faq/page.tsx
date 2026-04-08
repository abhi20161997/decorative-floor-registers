import type { Metadata } from "next";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Accordion from "@/components/ui/Accordion";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about our decorative floor registers, sizing, finishes, shipping, returns, and care instructions.",
    openGraph: {
      title: "FAQ | Decorative Floor Register",
      description:
        "Everything you need to know about our premium decorative floor registers.",
    },
  };
}

const faqItems = [
  {
    question: "How do I measure for a floor register?",
    answer:
      "Measure the duct opening in your floor (not the existing register faceplate). Measure width first, then height. For example, a duct opening that is 4 inches wide and 10 inches long would require a 4x10 register. Our faceplate will be slightly larger to overlap the opening and sit flush on your floor.",
  },
  {
    question: "What sizes do you offer?",
    answer:
      "We offer 9 standard sizes ranging from 2x10 through 6x14 inches. Our available sizes are: 2x10, 2x12, 2x14, 4x10, 4x12, 4x14, 6x10, 6x12, and 6x14. Each size is available in all three finishes and all design styles.",
  },
  {
    question: "What finishes are available?",
    answer:
      "We offer three curated finishes: Antique Brass (warm golden tones), Matte Black (sleek and modern), and Oil Rubbed Bronze (rich, deep tones with an aged patina). Each finish is hand-applied for a consistent, premium look.",
  },
  {
    question: "Do your registers come with a damper?",
    answer:
      "Yes, every register includes an adjustable multi-angle steel damper. The damper allows you to control airflow by opening, partially closing, or fully closing the register. It is operated by a simple lever mechanism on the register face.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping within the United States takes 5\u20137 business days. Orders over $50 qualify for free shipping. Standard shipping on smaller orders is $5.99. We currently ship to US addresses only.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on unused items in their original packaging. To initiate a return, contact our support team. The customer is responsible for return shipping costs. Refunds are processed within 5\u20137 business days after we receive the returned item.",
  },
  {
    question: "Can I order custom sizes?",
    answer:
      "We are happy to discuss custom size requests. Please contact us through our contact form or email us directly at deepakbrass@gmail.com with your specific size requirements, and we will work with you to find a solution.",
  },
  {
    question: "How do I care for my registers?",
    answer:
      "To maintain the beauty of your decorative floor register, simply wipe it with a soft, dry cloth as needed. Avoid using abrasive cleaners, steel wool, or harsh chemicals, as these can damage the finish. For stubborn dust in the pattern details, use a soft-bristled brush.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <ScrollReveal>
            <p className="text-label-sm mb-4 uppercase tracking-widest text-antique-gold">
              Support
            </p>
            <h1 className="font-display text-display-lg text-espresso">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-umber">
              Everything you need to know about our decorative floor registers.
              Can&apos;t find the answer you&apos;re looking for? Feel free to{" "}
              <a
                href="/contact"
                className="text-antique-gold underline underline-offset-4 transition-colors hover:text-brass"
              >
                contact us
              </a>
              .
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal delay={0.1}>
          <Accordion items={faqItems} />
        </ScrollReveal>
      </section>
    </div>
  );
}
