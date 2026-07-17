import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/recipes/types";
import { recipes, getRecipe, getRecipeContent } from "@/lib/recipes/data";
import { RecipePlate } from "@/components/recipe-plate";
import { RecipeActions } from "@/components/recipe-actions";
import { PortionRecalculator } from "@/components/portion-recalculator";
import { Link, redirect } from "@/i18n/navigation";
import { getAccessStatus } from "@/lib/access/purchase-status";
import { isFavorited } from "@/lib/favorites/queries";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    recipes.map((r) => ({ locale, slug: r.slug }))
  );
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const access = await getAccessStatus();
  if (!access.hasAccess) {
    redirect({ href: { pathname: "/recetas" }, locale });
  }

  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const { content, isFallback } = getRecipeContent(recipe, locale as Locale);
  const t = await getTranslations({ locale, namespace: "recipe" });
  const favorited = await isFavorited(slug);

  const infoBlocks = [
    { label: t("tips"), value: content.tips },
    { label: t("mistakes"), value: content.mistakes },
    { label: t("substitutions"), value: content.substitutions },
    { label: t("storage"), value: content.storage },
    { label: t("pairing"), value: content.pairing },
    { label: t("versions"), value: content.versions },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link href="/recetas" className="text-sm text-cacao-soft hover:text-cacao">
        ← {t("backToList")}
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-2">
        <RecipePlate
          slug={recipe.slug}
          colors={recipe.plateColors}
          alt={recipe.imageAlt[locale as Locale]}
          caption={recipe.imageAlt[locale as Locale]}
        />

        <div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
              {content.eyebrow}
            </p>
            <RecipeActions
              slug={recipe.slug}
              initialFavorited={favorited}
              labels={{
                favoriteSaved: t("favoriteSaved"),
                favoriteRemoved: t("favoriteRemoved"),
                favoriteError: t("favoriteError"),
                shareSoon: t("shareSoon"),
                printSoon: t("printSoon"),
              }}
            />
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-3xl">
            {content.title}
          </h1>
          <p className="mt-3 text-cacao-soft">{content.blurb}</p>

          {isFallback && (
            <p className="mt-3 rounded-lg border border-line bg-cream-2 px-3 py-2 text-xs text-cacao-soft">
              {t("onlyInSpanish")}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-cacao-soft">
            <span className="rounded-full border border-line px-2.5 py-1">{content.cuisine}</span>
            <span className="rounded-full border border-line px-2.5 py-1">
              {t("prep")} <b className="text-cacao">{content.prep}</b>
            </span>
            <span className="rounded-full border border-line px-2.5 py-1">
              {t("cook")} <b className="text-cacao">{content.cook}</b>
            </span>
            <span className="rounded-full border border-line px-2.5 py-1">
              {t("total")} <b className="text-cacao">{content.total}</b>
            </span>
            <span className="rounded-full border border-line px-2.5 py-1">
              {t("difficulty")} <b className="text-cacao">{content.difficulty}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[0.85fr_1.15fr]">
        <PortionRecalculator
          recipeSlug={recipe.slug}
          ingredients={content.ingredients}
          ingredientsStatic={content.ingredientsStatic}
          baseServings={recipe.baseServings}
          costPerServing={recipe.costPerServing}
          currency={recipe.costCurrency}
          labels={{
            servings: t("servings"),
            ingredients: t("ingredients"),
            note: t("portionNote"),
            addToList: t("addToShoppingList"),
            added: t("addedToShoppingList"),
          }}
        />

        <div>
          <h2 className="font-display text-lg italic font-medium text-sage-deep">{t("steps")}</h2>
          <ol className="mt-3 flex flex-col gap-4">
            {content.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-cacao text-xs font-semibold tabular-nums text-cream">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {infoBlocks.map((block) => (
          <div key={block.label} className="rounded-xl border border-line p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-cacao-soft">
              {block.label}
            </h3>
            <p className="mt-1.5 text-sm">{block.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-rose bg-rose-tint p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-rose">
          {t("allergens")}
        </h3>
        <p className="mt-1.5 text-sm">{content.allergen}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="font-display text-lg italic font-medium text-sage-deep">
            {t("nutrition")}
          </h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {content.nutrition.map(([label, value]) => (
                <tr key={label} className="border-b border-dashed border-line last:border-none">
                  <td className="py-1.5">{label}</td>
                  <td className="py-1.5 text-right font-semibold tabular-nums">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-cacao-soft">{content.nutriSource}</p>
        </div>

        <div className="rounded-xl border border-line bg-cream-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cacao-soft">
            {t("cost")}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
            ${recipe.costPerServing.toLocaleString("es-CO")}{" "}
            <span className="text-sm font-sans font-normal text-cacao-soft">
              {recipe.costCurrency} {t("costPerServing")}
            </span>
          </p>
          <p className="mt-2 text-xs text-cacao-soft">
            {content.costRefLocation} · {recipe.costDate}
          </p>
          <p className="mt-1 text-xs text-cacao-soft">{content.costStores}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {content.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-sage-tint px-3 py-1 text-xs text-sage-deep">
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-8 max-w-xl border-l-2 border-terracotta pl-4 font-display text-lg italic font-medium leading-relaxed">
        {content.note}
      </p>
    </div>
  );
}
