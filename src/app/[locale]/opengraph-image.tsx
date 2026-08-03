import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f1e7",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "#bf7148",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -36,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "#6c7f5c",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
