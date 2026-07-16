"use client";

import { useMemo, useState } from "react";
import type { Ingredient } from "@/lib/recipes/types";
import { formatMoney, formatQty, scaleQty } from "@/lib/recipes/scale";

type Props = {
  ingredients: Ingredient[];
  ingredientsStatic?: string;
  baseServings: number;
  costPerServing: number;
  currency: string;
  labels: {
    servings: string;
    ingredients: string;
    note: string;
  };
};

export function PortionRecalculator({
  ingredients,
  ingredientsStatic,
  baseServings,
  costPerServing,
  currency,
  labels,
}: Props) {
  const presets = baseServings >= 9 ? [4, 6, 9, 12] : [1, 2, 4, 6, 8];
  const [servings, setServings] = useState(baseServings);
  const [customValue, setCustomValue] = useState("");

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

      <h2 className="mt-6 font-display text-lg italic font-medium text-sage-deep">
        {labels.ingredients}
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {scaled.map((ing) => (
          <li
            key={ing.name}
            className="flex gap-2 border-b border-dashed border-line pb-2 text-sm last:border-none"
          >
            <span className="min-w-[2.4em] font-semibold tabular-nums text-terracotta">
              {formatQty(ing.scaledQty)}
            </span>
            <span className="text-cacao-soft">
              {ing.unit} — <span className="text-cacao">{ing.name}</span>
            </span>
          </li>
        ))}
      </ul>
      {ingredientsStatic && (
        <p className="mt-2 text-xs italic text-cacao-soft">{ingredientsStatic}</p>
      )}

      <p className="mt-4 text-sm text-cacao-soft">
        <span className="font-display text-xl font-semibold text-cacao tabular-nums">
          ${formatMoney(totalCost)}
        </span>{" "}
        {currency}
      </p>
    </div>
  );
}
