import { ImageResponse } from "next/og";

export const alt =
  "Decorative Floor Register — Premium Floor Registers & Grilles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #faf6f1, #f0ebe4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            color: "#9a7b4f",
            letterSpacing: "6px",
            textTransform: "uppercase",
            marginBottom: "20px",
            fontFamily: "serif",
          }}
        >
          DECORATIVE
        </div>
        <div
          style={{
            fontSize: "64px",
            color: "#2c2420",
            fontFamily: "serif",
            fontWeight: "500",
            marginBottom: "20px",
          }}
        >
          Floor Register
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#6b5d52",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Premium decorative floor registers in Art Deco, Contemporary, and
          Geometrical designs
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d4c5b0, #c9a96e)",
            }}
          />
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3a3632, #2c2420)",
            }}
          />
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b6f3a, #6b5533)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
