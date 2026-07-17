import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "fr"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/recetas": {
      es: "/recetas",
      en: "/recipes",
      fr: "/plats",
    },
    "/recetas/[slug]": {
      es: "/recetas/[slug]",
      en: "/recipes/[slug]",
      fr: "/plats/[slug]",
    },
    "/ingresar": {
      es: "/ingresar",
      en: "/sign-in",
      fr: "/connexion",
    },
    "/favoritos": {
      es: "/favoritos",
      en: "/favorites",
      fr: "/favoris",
    },
    "/lista-de-compras": {
      es: "/lista-de-compras",
      en: "/shopping-list",
      fr: "/liste-de-courses",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
