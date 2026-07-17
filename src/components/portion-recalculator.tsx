"use client";

import { useMemo, useState, useTransition } from "react";
import type { Ingredient, Locale } from "@/lib/recipes/types";
import { formatQty, scaleQty } from "@/lib/recipes/scale";
import { addIngredientsToList } from "@/lib/shopping-list/actions";
import { PriceDisplay } from "@/components/price-display";

type Props = {
  recipeSlug: string;
  locale: Locale;
  ingredients: Ingredient[];
  ingredientsStatic?: string;
  baseServings: number;
  costPerServing: number;
  labels: {
    servings: string;
    ingredients: string;
    note: string;
    addToList: string;
    added: string;
  };
};

export function PortionRecalculator({
  recipeSlug,
  locale,
  ingredients,
  ingredientsStatic,
  baseServings,
  costPerServing,
  labels,
}: Props) {
  const presets = baseServings >= 9 ? [4, 6, 9, 12] : [1, 2, 4, 6, 8];
  const [servings, setServings] = useState(baseServings);
  const [customValue, setCustomValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState(() => new Set(ingredients.map((i) => i.name)));

  const ratio = servings / baseServings;
  const totalCost = costPerServing * servings;

  const scaled = useMemo(
    () =>
      ingredients.map((ing) => ({
        ...ing,
        scaledQty: scaleQty(ing.qty, ratio, Boolean(ing.countUnit)),
      })),
    [ingredients, ratio]
  );

  function selectPreset(n: number) {
    setServings(n);
    setCustomValue("");
  }

  function onCustomChange(v: string) {
    setCustomValue(v);
    const n = parseFloat(v);
    if (n > 0 && n <= 30) setServings(n);
  }

  function toggleSelected(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function onAddToList() {
    const toAdd = scaled.filter((ing) => selected.has(ing.name));
    if (toAdd.length === 0) return;
    startTransition(async () => {
      const result = await addIngredientsToList(
        toAdd.map((ing) => ({ name: ing.name, quantity: ing.scaledQty, unit: ing.unit })),
        recipeSlug
      );
      setToast("error" in result ? null : labels.added);
      window.setTimeout(() => setToast(null), 2500);
    });
  }

  return (
    <div>
      <div className="rounded-xl border border-line bg-cream-2 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cacao-soft">
          {labels.servings} ({servings})
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => selectPreset(n)}
              className={`h-8 w-8 rounded-lg border text-sm tabular-nums transition-colors ${
                servings === n && customValue === ""
                  ? "border-sage bg-sage text-cream font-semibold"
                  : "border-line bg-cream text-cacao hover:border-sage"
              }`}
            >
              {n}
            </button>
          ))}
          <input
            type="number"
            min={1}
            max={30}
            placeholder="…"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            className="h-8 w-14 rounded-lg border border-line bg-cream text-center text-sm tabular-nums text-cacao"
          />
        </div>
        <p className="mt-2 text-xs text-cacao-soft">{labels.note}</p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <h2 className="font-display text-lg italic font-medium text-sage-deep">
          {labels.ingredients}
        </h2>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {scaled.map((ing) => {
          const isSelected = selected.has(ing.name);
          return (
            <li
              key={ing.name}
              className="flex items-center gap-2 border-b border-dashed border-line pb-2 text-sm last:border-none"
            >
              <button
                type="button"
                onClick={() => toggleSelected(ing.name)}
                aria-pressed={isSelected}
                className={`flex h-5 w-5 flex-none items-center justify-center rounded border text-[10px] transition-colors ${
                  isSelected
                    ? "border-sage bg-sage text-cream"
                    : "border-line bg-cream text-transparent"
                }`}
              >
                ✓
              </button>
              <span
                className={`min-w-[2.4em] font-semibold tabular-nums text-terracotta ${!isSelected ? "opacity-50" : ""}`}
              >
                {formatQty(ing.scaledQty)}
              </span>
              <span className={`text-cacao-soft ${!isSelected ? "opacity-50" : ""}`}>
                {ing.unit} — <span className="text-cacao">{ing.name}</span>
              </span>
            </li>
          );
        })}
      </ul>
      {ingredientsStatic && (
        <p className="mt-2 text-xs italic text-cacao-soft">{ingredientsStatic}</p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <PriceDisplay copAmount={totalCost} locale={locale} size="md" />
        <button
          type="button"
          onClick={onAddToList}
          disabled={isPending || selected.size === 0}
          className="rounded-full border border-line bg-cream px-4 py-2 text-xs font-medium text-cacao transition-colors hover:border-sage disabled:opacity-60"
        >
          {labels.addToList}
        </button>
      </div>
      {toast && <p className="mt-2 text-right text-xs text-sage-deep">{toast}</p>}
    </div>
  );
}
