// Open roles at Sanjay Overseas, the Hathras workshop that manufactures our registers.
// Single source of truth for the careers page, JobPosting structured data and the apply API.

export const EMPLOYER = {
  name: "Sanjay Overseas",
  locality: "Hathras",
  region: "Uttar Pradesh",
  country: "IN",
};

export type Job = {
  slug: string;
  title: string;
  tagline: string;
  datePosted: string;
  validThrough: string;
  employmentType: "FULL_TIME";
  location: string;
  experience: string;
  pay: string;
  payMin: number;
  payMax: number;
  summary: string;
  mandate: { title: string; body: string }[];
  dayToDay: string[];
  mustHaves: string[];
  niceToHaves: string;
  firstNinetyDays: { range: string; body: string }[];
  selectionProcess: string;
};

export const JOBS: Job[] = [
  {
    slug: "quality-operational-excellence-lead",
    title: "Quality & Operational Excellence Lead",
    tagline:
      "Own product excellence. Build smarter systems. Earn global customer trust.",
    datePosted: "2026-10-09",
    validThrough: "2027-01-31",
    employmentType: "FULL_TIME",
    location: "Hathras, Uttar Pradesh · On-site",
    experience: "4–10 years",
    pay: "₹6–12 LPA",
    payMin: 600000,
    payMax: 1200000,
    summary:
      "This is a build-it role, not a routine inspection job. We are strengthening how quality is defined, verified, documented and delivered. You will help turn proven, largely paper-based factory practices into practical, scalable systems, working directly with leadership and our overseas customer teams.",
    mandate: [
      {
        title: "Make finished inventory dependable",
        body: "Establish clear, product-wise acceptance standards and an effective final quality-release process before packing and dispatch.",
      },
      {
        title: "Prevent recurring defects",
        body: "Use evidence, defect trends and root-cause investigation to improve casting, machining, fitting, finishing, patina, assembly and packing outcomes.",
      },
      {
        title: "Make quality visible",
        body: "Introduce simple SOPs, batch traceability, digital inspection records and actionable Excel-based reporting. Recommend systems the factory will actually use.",
      },
      {
        title: "Represent the factory confidently",
        body: "Understand US customer feedback in live calls, coordinate investigations, and close quality and delivery issues with clear, timely updates.",
      },
      {
        title: "Lead through influence",
        body: "Work respectfully but decisively with experienced production, finishing, QC and packing teams to embed standards and ownership.",
      },
    ],
    dayToDay: [
      "Inspect and release finished goods; document nonconformities, segregation, rework and reinspection before packing.",
      "Introduce risk-based checks, appropriate sampling and defect severity rules alongside product-specific functional and appearance standards.",
      "Maintain a photographic defect library, corrective-action tracker, quality dashboard and clear batch / shipment records.",
      "Analyze customer complaints and recurring process failures; agree corrective actions with the responsible department and confirm effectiveness.",
      "Partner with management to prioritize improvements, train staff and steadily digitalize the most valuable paper records.",
    ],
    mustHaves: [
      "Strong spoken and written English, including confident comprehension of natural American-English business and technical conversations.",
      "4–10 years in manufacturing QA/QC, supplier quality, manufacturing operations, production engineering or export-oriented hardgoods.",
      "Sound practical judgment on measurements, drawings, tolerances, workmanship, inspection and nonconforming product.",
      "Excellent Excel / digital reporting skills, and the ability to implement workable procedures rather than just write manuals.",
      "Initiative, structured problem-solving, strong follow-through and the confidence to work daily on a factory floor.",
    ],
    niceToHaves:
      "Architectural hardware, brass/bronze, locks and fittings, metal components, buying houses or third-party export inspections; exposure to AQL, CAPA, 5 Whys, 8D, ISO 9001 or ERP/MIS. We favor capability and learning agility over narrow product experience.",
    firstNinetyDays: [
      {
        range: "Days 0–30",
        body: "Learn our product range and customer standards, map the factory-to-dispatch journey, and baseline recurring defects and critical records.",
      },
      {
        range: "Days 31–60",
        body: "Implement priority checklists, acceptance criteria, defect photographs and digital issue tracking. Start handling routine customer-quality communication.",
      },
      {
        range: "Days 61–90",
        body: "Run a documented final-release process, present quality metrics, verify corrective actions and propose the next stage of improvement.",
      },
    ],
    selectionProcess:
      "A practical quality assessment, a live-English comprehension conversation and a short systems-improvement exercise. Relocation arrangements can be discussed during selection.",
  },
];

export function getJob(slug: string) {
  return JOBS.find((j) => j.slug === slug);
}
