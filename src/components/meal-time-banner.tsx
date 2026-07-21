"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export type MealCategory = "entrada" | "almuerzo" | "cena" | "postre";

export type MealBannerRecipe = { slug: string; title: string };

function categoryForHour(hour: number): MealCategory {
  if (hour >= 5 && hour < 11) return "entrada";
  if (hour >= 11 && hour < 16) return "almuerzo";
  if (hour >= 16 && hour < 21) return "cena";
  return "postre";
}

/** Same category all day, but rotates day to day so it doesn't go stale. */
function recipeOfTheDay(items: MealBannerRecipe[], now: Date): MealBannerRecipe | undefined {
  if (items.length === 0) return undefined;
  const startOfYear = new Date(now.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86400000);
  return items[dayOfYear % items.length];
}

export function MealTimeBanner({
  recipesByCategory,
  categoryLabels,
  labels,
}: {
  recipesByCategory: Record<MealCategory, MealBannerRecipe[]>;
  categoryLabels: Record<MealCategory, string>;
  labels: { eyebrow: string; suggestion: string; cta: string };
}) {
  // Starts null so server-rendered markup and the first client render match;
  // the visitor's local hour is only known after mount (see countdown-timer.tsx
  // for the same pattern).
  const [pick, setPick] = useState<{ category: MealCategory; recipe: MealBannerRecipe } | null>(
    null
  );

  useEffect(() => {
    const now = new Date();
    const category = categoryForHour(now.getHours());
    const recipe = recipeOfTheDay(recipesByCategory[category], now);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: see comment above about avoiding a hydration mismatch.
    if (recipe) setPick({ category, recipe });
  }, [recipesByCategory]);

  if (!pick) return null;

  return (
    <div className="mb-10 flex flex-col gap-3 rounded-2xl border border-line bg-cream-2 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
          {labels.eyebrow}
        </p>
        <p className="mt-1 text-sm text-cacao-soft">
          {labels.suggestion.replace("{category}", categoryLabels[pick.category])}{" "}
          <span className="font-semibold text-cacao">{pick.recipe.title}</span>
        </p>
      </div>
      <Link
        href={{ pathname: "/recetas/[slug]", params: { slug: pick.recipe.slug } }}
        className="inline-flex flex-none items-center rounded-full border border-line px-4 py-2 text-xs font-medium text-cacao transition-colors hover:border-sage"
      >
        {labels.cta}
      </Link>
    </div>
  );
}
