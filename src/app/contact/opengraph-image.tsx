import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Contact Decorative Floor Register";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Get in touch",
    title: "Contact us",
    subtitle: "Sizing help, custom sizes and designs, bulk and trade pricing.",
    chips: ["+1 847-316-1395"],
  });
}
