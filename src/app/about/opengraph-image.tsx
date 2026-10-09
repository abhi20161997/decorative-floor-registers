import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "About Decorative Floor Register";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Our Story",
    title: "Details you walk over every day",
    subtitle: "Precision-made decorative floor registers in three curated finishes.",
  });
}
