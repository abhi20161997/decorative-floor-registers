import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Decorative Floor Register — Premium Floor Registers & Grilles";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Premium Floor Registers & Grilles",
    title: "Statement floor vents",
    subtitle: "Art Deco, Contemporary and Geometrical designs in Antique Brass, Black and Bronze.",
    chips: ["9 sizes", "3 finishes", "Free US shipping $50+"],
  });
}
