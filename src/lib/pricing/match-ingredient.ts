import { INGREDIENT_CATALOG, type IngredientPrice } from "./ingredient-catalog";

const SORTED_ENTRIES: { keyword: string; entry: IngredientPrice }[] = INGREDIENT_CATALOG.flatMap(
  (entry) => entry.matchKeywords.map((keyword) => ({ keyword, entry }))
).sort((a, b) => b.keyword.length - a.keyword.length);

/** Longest keyword match wins, so specific entries beat generic ones. */
export function matchIngredient(rawName: string): IngredientPrice | null {
  const name = rawName.toLowerCase();
  for (const { keyword, entry } of SORTED_ENTRIES) {
    if (name.includes(keyword)) return entry;
  }
  return null;
}
