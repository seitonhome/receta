import type { Locale, Recipe } from "../types";
import { entradas } from "./entradas";
import { almuerzos } from "./almuerzos";
import { cenas } from "./cenas";
import { postres } from "./postres";

export const recipes: Recipe[] = [...entradas, ...almuerzos, ...cenas, ...postres];

export function getRecipe(slug: string) {
  return recipes.find((r) => r.slug === slug);
}

/**
 * Returns the recipe's content in the requested locale, falling back to
 * Spanish when a professional translation doesn't exist yet (only the
 * salmon pilot recipe is fully trilingual so far — see Phase 5 in the plan).
 */
export function getRecipeContent(recipe: Recipe, locale: Locale) {
  const content = recipe.content[locale] ?? recipe.content.es!;
  const isFallback = recipe.content[locale] === null;
  return { content, isFallback };
}
