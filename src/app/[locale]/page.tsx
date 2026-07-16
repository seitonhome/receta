import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { recipes } from "@/lib/recipes/data";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
      <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-cacao-soft">{t("subtitle")}</p>

      <Link
        href="/recetas"
        className="mt-8 inline-flex items-center rounded-full bg-cacao px-6 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
      >
        {t("cta")}
      </Link>

      <div className="mx-auto mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8 text-center">
        <div>
          <p className="font-display text-2xl font-semibold tabular-nums">{recipes.length}</p>
          <p className="mt-1 text-xs text-cacao-soft">{t("statsRecipes")}</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold tabular-nums">3</p>
          <p className="mt-1 text-xs text-cacao-soft">{t("statsLangs")}</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold tabular-nums">4</p>
          <p className="mt-1 text-xs text-cacao-soft">{t("statsCategories")}</p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-md rounded-2xl border border-line bg-cream-2 p-6 text-left">
        <h2 className="font-display text-lg italic font-medium text-sage-deep">
          {t("philosophyTitle")}
        </h2>
        <p className="mt-2 text-sm text-cacao-soft">{t("philosophyBody")}</p>
      </div>
    </div>
  );
}
