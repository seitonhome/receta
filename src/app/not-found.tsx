import Link from "next/link";

/**
 * Root-level fallback for requests that don't match any locale segment at
 * all (e.g. a stray /foo outside /es, /en, /fr). The localized 404 at
 * src/app/[locale]/not-found.tsx handles everything within a locale.
 */
export default function RootNotFound() {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "-apple-system, sans-serif",
          background: "#f6f1e7",
          color: "#3a2a1e",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <p style={{ fontSize: "48px", fontWeight: 600, color: "#bf7148", margin: 0 }}>404</p>
        <h1 style={{ fontSize: "22px", fontWeight: 600, marginTop: "16px" }}>
          Página no encontrada
        </h1>
        <Link
          href="/es"
          style={{
            marginTop: "24px",
            display: "inline-flex",
            alignItems: "center",
            borderRadius: "999px",
            background: "#3a2a1e",
            color: "#f6f1e7",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </body>
    </html>
  );
}
