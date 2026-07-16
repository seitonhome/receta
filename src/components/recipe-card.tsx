import type { Locale, Recipe } from "@/lib/recipes/types";
import { getRecipeContent } from "@/lib/recipes/data";
import { Link } from "@/i18n/navigation";
import { RecipePlate } from "@/components/recipe-plate";

export function RecipeCard({ recipe, locale }: { recipe: Recipe; locale: Locale }) {
  const { content } = getRecipeContent(recipe, locale);

  return (
    <Link
      href={{ pathname: "/recetas/[slug]", params: { slug: recipe.slug } }}
      className="group block"
    >
      <RecipePlate slug={recipe.slug} colors={recipe.plateColors} alt={recipe.imageAlt[locale]} />
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-terracotta">
        {content.eyebrow}
      </p>
      <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-cacao group-hover:underline">
        {content.title}
      </h3>
      <p className="mt-1 text-sm text-cacao-soft line-clamp-2">{content.blurb}</p>
    </Link>
  );
}
