import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link, redirect } from "@/i18n/navigation";
import { getAccessStatus } from "@/lib/access/purchase-status";
import { getFavoriteSlugs } from "@/lib/favorites/queries";
import { recipes } from "@/lib/recipes/data";
import type { Locale } from "@/lib/recipes/types";
import { RecipeCard } from "@/components/recipe-card";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "auth" });
  const access = await getAccessStatus();

  if (!access.authenticated) {
    redirect({ href: { pathname: "/ingresar" }, locale });
  }

  const favoriteSlugs = access.hasAccess ? await getFavoriteSlugs() : [];
  const favoriteRecipes = recipes.filter((r) => favoriteSlugs.includes(r.slug));

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {t("favoritesTitle")}
      </h1>

      {!access.hasAccess ? (
        <div className="mt-5 max-w-lg rounded-xl border border-terracotta bg-terracotta-tint p-5">
          <p className="font-display text-lg font-semibold text-terracotta">
            {t("noAccessTitle")}
          </p>
          <p className="mt-1.5 text-sm text-cacao-soft">{t("noAccessBody")}</p>
        </div>
      ) : favoriteRecipes.length === 0 ? (
        <div className="mt-5 max-w-lg rounded-xl border border-line bg-cream-2 p-5">
          <p className="text-sm text-cacao-soft">{t("favoritesEmpty")}</p>
          <Link
            href="/recetas"
            className="mt-4 inline-flex items-center rounded-full bg-cacao px-5 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90"
          >
            {t("browseRecipes")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} locale={locale as Locale} />
          ))}
        </div>
      )}
    </div>
  );
}
