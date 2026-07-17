"use client";

import { useState, useTransition } from "react";
import { toggleFavorite } from "@/lib/favorites/actions";

type Labels = {
  favoriteSaved: string;
  favoriteRemoved: string;
  favoriteError: string;
  shareSoon: string;
  printSoon: string;
};

export function RecipeActions({
  slug,
  initialFavorited,
  labels,
}: {
  slug: string;
  initialFavorited: boolean;
  labels: Labels;
}) {
  const [saved, setSaved] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    window.clearTimeout((flash as unknown as { t?: number }).t);
    (flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2200);
  }

  function onFavoriteClick() {
    const next = !saved;
    setSaved(next); // optimistic
    startTransition(async () => {
      const result = await toggleFavorite(slug);
      if ("error" in result) {
        setSaved(!next); // roll back
        flash(labels.favoriteError);
        return;
      }
      setSaved(result.favorited);
      flash(result.favorited ? labels.favoriteSaved : labels.favoriteRemoved);
    });
  }

  return (
    <div className="relative flex gap-2">
      <button
        type="button"
        onClick={onFavoriteClick}
        disabled={isPending}
        title={labels.favoriteSaved}
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-base transition-colors disabled:opacity-70 ${
          saved
            ? "border-terracotta bg-terracotta text-cream"
            : "border-line bg-cream-2 text-cacao-soft hover:text-cacao"
        }`}
      >
        {saved ? "♥" : "♡"}
      </button>
      <button
        type="button"
        onClick={() => flash(labels.shareSoon)}
        title="Compartir"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cream-2 text-cacao-soft hover:text-cacao"
      >
        ↗
      </button>
      <button
        type="button"
        onClick={() => flash(labels.printSoon)}
        title="Imprimir"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cream-2 text-cacao-soft hover:text-cacao"
      >
        ⎙
      </button>
      {toast && (
        <span className="absolute top-11 right-0 whitespace-nowrap rounded-lg bg-cacao px-3 py-1.5 text-xs text-cream shadow-lg">
          {toast}
        </span>
      )}
    </div>
  );
}
