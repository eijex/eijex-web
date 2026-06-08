import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 50%, #f0fdf4 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #2dd4bf, #134e4a)",
            borderRadius: 12,
            marginBottom: 32,
          }}
        >
          <span style={{ color: "white", fontSize: 28, fontWeight: 800, display: "flex" }}>e</span>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: -2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Open tools for</span>
          <span>plant synthetic biology.</span>
        </div>

        <div style={{ fontSize: 28, color: "#64748b", marginBottom: 48, display: "flex" }}>
          From protein sequence to reviewable CDS candidates.
        </div>

        <div style={{ display: "flex", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#0d9488", display: "flex" }}>0.76</span>
            <span style={{ fontSize: 16, color: "#94a3b8", display: "flex" }}>mean CAI</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#0d9488", display: "flex" }}>100%</span>
            <span style={{ fontSize: 16, color: "#94a3b8", display: "flex" }}>AA identity</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#0d9488", display: "flex" }}>3,876</span>
            <span style={{ fontSize: 16, color: "#94a3b8", display: "flex" }}>CDS benchmarked</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 22,
            fontWeight: 700,
            color: "#0d9488",
            display: "flex",
          }}
        >
          www.eijex.com
        </div>
      </div>
    ),
    { ...size }
  );
}
