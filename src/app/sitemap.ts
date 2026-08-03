import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Only public, unauthenticated pages -- recipe detail pages and the
// authenticated app (favoritos, lista de compras) require a purchase and
// don't belong in a public sitemap.
const PUBLIC_PATHS: Record<string, Record<string, string>> = {
  "/": { es: "/", en: "/", fr: "/" },
  "/recetas": { es: "/recetas", en: "/recipes", fr: "/plats" },
  "/terminos": { es: "/terminos", en: "/terms", fr: "/conditions" },
  "/privacidad": { es: "/privacidad", en: "/privacy", fr: "/confidentialite" },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const localizedPaths of Object.values(PUBLIC_PATHS)) {
    for (const locale of routing.locales) {
      const path = localizedPaths[locale];
      const suffix = path === "/" ? "" : path;
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
