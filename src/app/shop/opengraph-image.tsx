import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Shop decorative floor registers";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "The Collection",
    title: "Shop all registers",
    subtitle: "Art Deco, Contemporary and Geometrical designs in nine standard sizes.",
    chips: ["Antique Brass", "Black", "Bronze"],
  });
}
