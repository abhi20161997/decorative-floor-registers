import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared 1200×630 social card used by every route's opengraph-image.tsx.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const COLORS = {
  ivory: "#faf6f1",
  linen: "#f0ebe4",
  espresso: "#2c2420",
  umber: "#6b5d52",
  gold: "#9a7b4f",
  brass: "#c9a96e",
  warmWhite: "#f5efe8",
};

const FINISH_SWATCHES = [
  "linear-gradient(135deg, #d4c5b0, #c9a96e)",
  "linear-gradient(135deg, #3a3632, #1a1714)",
  "linear-gradient(135deg, #9a7b4f, #6b5533)",
];

async function loadFonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [display, sans, sansBold] = await Promise.all([
    readFile(join(dir, "CormorantGaramond-SemiBold.ttf")),
    readFile(join(dir, "Inter-Regular.ttf")),
    readFile(join(dir, "Inter-SemiBold.ttf")),
  ]);
  return [
    { name: "Cormorant", data: display, weight: 600 as const, style: "normal" as const },
    { name: "Inter", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: sansBold, weight: 600 as const, style: "normal" as const },
  ];
}

/**
 * Fetches a remote image (our product photos are WebP, which the OG renderer
 * can't decode) and returns it as a PNG data URI. Returns null on any failure
 * so the card still renders without the photo.
 */
async function toPngDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const sharp = (await import("sharp")).default;
    const png = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(560, 560, { fit: "inside" })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 14,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: COLORS.gold,
        }}
      >
        Decorative
      </div>
      <div
        style={{
          fontFamily: "Cormorant",
          fontSize: 32,
          marginTop: 6,
          color: light ? COLORS.warmWhite : COLORS.espresso,
        }}
      >
        Floor Register
      </div>
    </div>
  );
}

function Chips({ chips }: { chips: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {chips.map((chip) => (
        <div
          key={chip}
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.espresso,
            background: COLORS.warmWhite,
            border: `1.5px solid ${COLORS.brass}`,
            borderRadius: 999,
            padding: "10px 22px",
          }}
        >
          {chip}
        </div>
      ))}
    </div>
  );
}

export type OgCardInput = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  chips?: string[];
  /** Remote product photo shown on the right of the card. */
  imageUrl?: string;
  /** Footer line under the content; defaults to the site domain. */
  footer?: string;
};

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
  chips,
  imageUrl,
  footer = "decorativefloorregister.com",
}: OgCardInput) {
  const [fonts, photo] = await Promise.all([
    loadFonts(),
    imageUrl ? toPngDataUri(imageUrl) : Promise.resolve(null),
  ]);

  const titleSize = title.length > 40 ? 64 : title.length > 26 ? 76 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(135deg, ${COLORS.ivory} 0%, ${COLORS.linen} 100%)`,
          fontFamily: "Inter",
        }}
      >
        {/* Brass rule down the left edge */}
        <div style={{ width: 14, height: "100%", background: `linear-gradient(180deg, ${COLORS.brass}, ${COLORS.gold})` }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
          }}
        >
          <Wordmark />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: COLORS.gold,
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                fontFamily: "Cormorant",
                fontSize: titleSize,
                lineHeight: 1.02,
                color: COLORS.espresso,
                marginTop: 14,
                maxWidth: photo ? 560 : 960,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: COLORS.umber,
                  marginTop: 18,
                  maxWidth: photo ? 540 : 900,
                }}
              >
                {subtitle}
              </div>
            )}
            {chips && chips.length > 0 && (
              <div style={{ display: "flex", marginTop: 28 }}>
                <Chips chips={chips} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 20, color: COLORS.umber }}>{footer}</div>
            {!photo && (
              <div style={{ display: "flex", gap: 12 }}>
                {FINISH_SWATCHES.map((bg) => (
                  <div key={bg} style={{ width: 34, height: 34, borderRadius: 999, background: bg }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {photo && (
          <div
            style={{
              width: 470,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              borderLeft: `1px solid ${COLORS.linen}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" width={430} height={430} style={{ objectFit: "contain" }} />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts }
  );
}
