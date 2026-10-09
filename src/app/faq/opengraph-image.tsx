import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Decorative Floor Register FAQ";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Help",
    title: "Frequently asked questions",
    subtitle: "Sizing, finishes, dampers, shipping, returns and care.",
  });
}
