"use client";

import { useState, useTransition } from "react";
import { toggleListItem, removeListItem, updateListItemQuantity } from "@/lib/shopping-list/actions";
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
  const [qty, setQty] = useState(quantity != null ? formatQty(quantity) : "");
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

  function onQtyBlur() {
    const trimmed = qty.trim();
    const parsed = trimmed === "" ? null : Number(trimmed.replace(",", "."));
    const next = parsed !== null && Number.isFinite(parsed) ? parsed : null;
    startTransition(() => updateListItemQuantity(id, next));
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
      <span className={`flex flex-1 items-center gap-1.5 ${checked ? "text-cacao-soft line-through" : "text-cacao"}`}>
        <input
          type="text"
          inputMode="decimal"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          onBlur={onQtyBlur}
          placeholder="—"
          className="w-10 rounded border border-transparent bg-transparent px-1 py-0.5 text-right font-semibold tabular-nums text-terracotta hover:border-line focus:border-sage focus:bg-cream focus:outline-none"
        />
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
