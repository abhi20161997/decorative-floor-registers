import { EMPLOYER, JOBS } from "@/lib/careers";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

const job = JOBS[0];

export const alt = `Now hiring at ${EMPLOYER.name}: ${job.title}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: `Now hiring · ${EMPLOYER.name}`,
    title: job.title,
    subtitle: job.tagline,
    chips: [`${EMPLOYER.locality}, UP · On-site`, job.pay, job.experience],
    footer: "decorativefloorregister.com/careers",
  });
}
