import type { Metadata } from "next";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ContactForm from "@/components/contact/ContactForm";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us",
    description:
      "Get in touch with Decorative Floor Register. Questions about sizing, finishes, custom orders, or anything else? We are here to help.",
    openGraph: {
      title: "Contact Us | Decorative Floor Register",
      description:
        "Have a question? Reach out to our team for sizing help, custom orders, or general inquiries.",
    },
  };
}

export default function ContactPage() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <ScrollReveal>
            <p className="text-label-sm mb-4 uppercase tracking-widest text-antique-gold">
              Get in Touch
            </p>
            <h1 className="font-display text-display-lg text-espresso">
              Contact Us
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-umber">
              Have a question about our registers, need help with sizing, or want
              to discuss a custom order? We&apos;d love to hear from you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={0.1}>
              <div className="rounded-xl border border-linen bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 font-display text-2xl font-medium text-espresso">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div>
            <ScrollReveal delay={0.2}>
              <div className="space-y-8">
                {/* Phone */}
                <div>
                  <h3 className="text-label-sm mb-3 uppercase tracking-widest text-antique-gold">
                    Phone
                  </h3>
                  <a
                    href="tel:+18473161395"
                    className="text-lg text-espresso transition-colors hover:text-antique-gold"
                  >
                    +1 (847) 316-1395
                  </a>
                  <p className="mt-1 text-sm text-umber">
                    Monday &ndash; Friday, 9am &ndash; 5pm CST
                  </p>
                </div>

                {/* Email */}
                <div>
                  <h3 className="text-label-sm mb-3 uppercase tracking-widest text-antique-gold">
                    Email
                  </h3>
                  <a
                    href="mailto:deepakbrass@gmail.com"
                    className="text-lg text-espresso transition-colors hover:text-antique-gold"
                  >
                    deepakbrass@gmail.com
                  </a>
                  <p className="mt-1 text-sm text-umber">
                    We respond within 1&ndash;2 business days
                  </p>
                </div>

                {/* Response Time */}
                <div className="rounded-lg border border-linen bg-warm-white p-6">
                  <h3 className="font-display text-lg font-medium text-espresso">
                    Quick Response Promise
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-umber">
                    We aim to respond to all inquiries within 1&ndash;2 business
                    days. For urgent matters, please call us directly during
                    business hours.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
