import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Shipping and returns";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Policies",
    title: "Shipping & Returns",
    subtitle: "Free US shipping on orders over $50. 30-day returns on unused items.",
    chips: ["5–7 business days", "30-day returns"],
  });
}
