import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#2c2420",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            color: "#c9a96e",
            fontSize: "72px",
            fontFamily: "serif",
            fontWeight: "bold",
            letterSpacing: "-2px",
          }}
        >
          DFR
        </div>
      </div>
    ),
    { ...size }
  );
}
