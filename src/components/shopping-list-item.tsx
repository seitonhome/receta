"use client";

import { useState, useTransition } from "react";
import { toggleListItem, removeListItem } from "@/lib/shopping-list/actions";
import { formatQty } from "@/lib/recipes/scale";

export function ShoppingListItemRow({
  id,
  name,
  quantity,
  unit,
  checked: initialChecked,
  removeLabel,
}: {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  checked: boolean;
  removeLabel: string;
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [removed, setRemoved] = useState(false);
  const [, startTransition] = useTransition();

  if (removed) return null;

  function onToggle() {
    const next = !checked;
    setChecked(next);
    startTransition(() => toggleListItem(id, next));
  }

  function onRemove() {
    setRemoved(true);
    startTransition(() => removeListItem(id));
  }

  return (
    <li className="flex items-center gap-3 border-b border-dashed border-line py-2 text-sm last:border-none">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={`flex h-5 w-5 flex-none items-center justify-center rounded border text-[10px] transition-colors ${
          checked ? "border-sage bg-sage text-cream" : "border-line bg-cream text-transparent"
        }`}
      >
        ✓
      </button>
      <span className={`flex-1 ${checked ? "text-cacao-soft line-through" : "text-cacao"}`}>
        {quantity != null && (
          <span className="mr-1.5 font-semibold tabular-nums text-terracotta">
            {formatQty(quantity)}
          </span>
        )}
        {unit && <span className="text-cacao-soft">{unit} </span>}
        {name}
      </span>
      <button
        type="button"
        onClick={onRemove}
        title={removeLabel}
        className="text-cacao-soft hover:text-terracotta"
      >
        ✕
      </button>
    </li>
  );
}
