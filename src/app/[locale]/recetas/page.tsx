import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/recipes/types";
import { recipes } from "@/lib/recipes/data";
import { RecipeCard } from "@/components/recipe-card";
import { RecipesLanding } from "@/components/recipes-landing";
import { getAccessStatus } from "@/lib/access/purchase-status";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const CATEGORY_ORDER = ["entrada", "almuerzo", "cena", "postre"] as const;

export default async function RecipesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const access = await getAccessStatus();
  if (!access.hasAccess) {
    return <RecipesLanding locale={locale} access={access} />;
  }

  const t = await getTranslations({ locale, namespace: "recipesIndex" });
  const tCategory = await getTranslations({ locale, namespace: "category" });

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
        {t("eyebrow")}
      </p>
      <h1 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight text-balance">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-cacao-soft">{t("subtitle")}</p>

      {CATEGORY_ORDER.map((category) => {
        const items = recipes.filter((r) => r.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mt-12">
            <h2 className="font-display text-xl italic font-medium text-sage-deep">
              {tCategory(category)}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              {items.map((recipe) => (
                <RecipeCard key={recipe.slug} recipe={recipe} locale={locale as Locale} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
