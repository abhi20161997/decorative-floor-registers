import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Floor register sizing guide";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Sizing guide",
    title: "Find your perfect fit",
    subtitle: "Measure the duct opening, not the old faceplate. Nine standard sizes from 2×10 to 6×14.",
    chips: ["2×10", "4×10", "6×14"],
  });
}
