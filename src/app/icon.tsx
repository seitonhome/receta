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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f1e7",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 112,
            height: 112,
            borderRadius: "50%",
            background: "#bf7148",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -8,
              right: -14,
              width: 50,
              height: 50,
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
