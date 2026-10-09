import type { Metadata } from "next";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { EMPLOYER, JOBS } from "@/lib/careers";

export const revalidate = 3600;

const job = JOBS[0];

export function generateMetadata(): Metadata {
  return pageMetadata({
    path: "/careers",
    title: "Careers",
    description: `Join ${EMPLOYER.name}, the Hathras workshop behind Decorative Floor Register. Now hiring: ${job.title} (${job.pay}, on-site in Hathras).`,
    socialTitle: `Now hiring: ${job.title} at ${EMPLOYER.name}`,
    socialDescription: `${job.tagline} ${job.location} · ${job.pay} · ${job.experience} experience. Apply online.`,
  });
}

const highlights = [
  {
    title: "Real ownership",
    body: "Shape new quality and operating systems yourself, not maintain someone else's paperwork.",
  },
  {
    title: "Global exposure",
    body: "Work directly with US customer teams and see your decisions show up in international customer confidence.",
  },
  {
    title: "Leadership access",
    body: "Collaborate closely with the people running the business. Short decision loops, visible impact.",
  },
  {
    title: "Room to grow",
    body: "Measurable impact in an established export business, with scope for broader leadership as the role evolves.",
  },
];

function jobPostingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `<p>${job.summary}</p><ul>${job.mandate
      .map((m) => `<li><strong>${m.title}.</strong> ${m.body}</li>`)
      .join("")}</ul>`,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: EMPLOYER.name,
      sameAs: SITE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: EMPLOYER.locality,
        addressRegion: EMPLOYER.region,
        addressCountry: EMPLOYER.country,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.payMin,
        maxValue: job.payMax,
        unitText: "YEAR",
      },
    },
    experienceRequirements: {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: 48,
    },
    directApply: true,
    url: `${SITE_URL}/careers`,
  };
}

export default function CareersPage() {
  return (
    <div className="bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingJsonLd()).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero */}
      <section className="bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <ScrollReveal>
            <p className="text-label-sm mb-4 uppercase tracking-widest text-antique-gold">
              Careers at {EMPLOYER.name}
            </p>
            <h1 className="font-display text-display-lg text-espresso">
              Build what the world walks on
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-umber">
              Every Decorative Floor Register is made by our team at {EMPLOYER.name} in {EMPLOYER.locality}, {EMPLOYER.region},
              where we also manufacture brass and bronze door, gate and
              architectural hardware for customers overseas. We&apos;re
              looking for people who care about getting the details right.
            </p>
            <a
              href="#open-roles"
              className="light-sweep mt-10 inline-block rounded-lg bg-antique-gold px-8 py-3 text-label-md uppercase tracking-widest text-white transition-colors hover:bg-brass"
            >
              View open role
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Why join */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal delay={0.1}>
          <h2 className="text-center font-display text-display-md text-espresso">
            Why work with us
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => (
              <div
                key={h.title}
                className="rounded-xl border border-linen bg-white p-6 shadow-sm"
              >
                <p className="font-display text-3xl font-semibold text-antique-gold">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-xl font-medium text-espresso">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-umber">
                  {h.body}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Role */}
      <section id="open-roles" className="scroll-mt-24 border-t border-linen bg-warm-white">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          <ScrollReveal>
            <p className="text-label-sm uppercase tracking-widest text-antique-gold">
              Now hiring · Full-time
            </p>
            <h2 className="mt-3 font-display text-display-md text-espresso">
              {job.title}
            </h2>
            <p className="mt-3 text-lg italic text-umber">{job.tagline}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Location", value: job.location },
                { label: "Experience", value: job.experience },
                { label: "Compensation", value: `${job.pay} (indicative)` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-antique-gold/30 bg-ivory p-4"
                >
                  <dt className="text-label-sm uppercase tracking-widest text-umber">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-display text-lg text-espresso">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-umber">
              Applications welcome from anywhere in India. Pay is set by
              capability and experience.
            </p>

            <p className="mt-10 leading-relaxed text-umber">{job.summary}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h3 className="mt-14 font-display text-2xl font-medium text-espresso">
              Your mandate
            </h3>
            <div className="mt-6 space-y-5">
              {job.mandate.map((m) => (
                <div key={m.title} className="border-l-2 border-brass pl-5">
                  <p className="font-medium text-espresso">{m.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-umber">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h3 className="mt-14 font-display text-2xl font-medium text-espresso">
              What you&apos;ll actually do
            </h3>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-relaxed text-umber marker:text-antique-gold">
              {job.dayToDay.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* First 90 days */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal>
          <h2 className="text-center font-display text-display-md text-espresso">
            Your first 90 days
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {job.firstNinetyDays.map((phase, i) => (
              <li
                key={phase.range}
                className="relative rounded-xl border border-linen bg-white p-6 shadow-sm"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-espresso px-3 py-1 text-label-sm uppercase tracking-widest text-warm-white">
                  {i + 1}
                </span>
                <p className="mt-2 text-label-sm uppercase tracking-widest text-antique-gold">
                  {phase.range}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-umber">
                  {phase.body}
                </p>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </section>

      {/* Who will succeed */}
      <section className="border-t border-linen bg-warm-white">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-5 lg:px-8 lg:py-24">
          <ScrollReveal className="lg:col-span-3">
            <h2 className="font-display text-display-md text-espresso">
              Who will succeed here
            </h2>
            <h3 className="mt-8 text-label-sm uppercase tracking-widest text-antique-gold">
              Must-haves
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-umber">
              {job.mustHaves.map((m) => (
                <li key={m} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" />
                  {m}
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <div className="rounded-xl border border-antique-gold/30 bg-ivory p-6">
              <h3 className="text-label-sm uppercase tracking-widest text-antique-gold">
                Strong advantages, not prerequisites
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-umber">
                {job.niceToHaves}
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-linen bg-white p-6">
              <h3 className="text-label-sm uppercase tracking-widest text-antique-gold">
                How we select
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-umber">
                {job.selectionProcess}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="scroll-mt-24 mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-label-sm uppercase tracking-widest text-antique-gold">
              Apply
            </p>
            <h2 className="mt-3 font-display text-display-md text-espresso">
              Tell us what you&apos;ve built
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-umber">
              Applications go straight to our leadership team. The most useful
              thing you can share is one real example of a quality or process
              problem you solved, and what changed as a result.
            </p>
          </div>
          <div className="relative mt-10 rounded-xl border border-linen bg-white p-6 shadow-sm sm:p-8">
            <ApplicationForm role={job.slug} />
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
