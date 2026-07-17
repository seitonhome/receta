"use client";

import { useRef, useTransition } from "react";
import { addManualItem } from "@/lib/shopping-list/actions";

export function ShoppingListAddForm({
  labels,
}: {
  labels: { namePlaceholder: string; quantityPlaceholder: string; unitPlaceholder: string; add: string };
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "");
    const quantity = String(formData.get("quantity") ?? "");
    const unit = String(formData.get("unit") ?? "");
    if (!name.trim()) return;

    startTransition(async () => {
      await addManualItem(name, quantity, unit);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="flex flex-wrap gap-2">
      <input
        type="text"
        name="name"
        required
        placeholder={labels.namePlaceholder}
        className="min-w-[10rem] flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-cacao outline-none focus:border-sage"
      />
      <input
        type="text"
        name="quantity"
        inputMode="decimal"
        placeholder={labels.quantityPlaceholder}
        className="w-20 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-cacao outline-none focus:border-sage"
      />
      <input
        type="text"
        name="unit"
        placeholder={labels.unitPlaceholder}
        className="w-24 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-cacao outline-none focus:border-sage"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-cacao px-4 py-2 text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {labels.add}
      </button>
    </form>
  );
}
