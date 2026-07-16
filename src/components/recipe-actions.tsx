"use client";

import { useState } from "react";

export function RecipeActions() {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    window.clearTimeout((flash as unknown as { t?: number }).t);
    (flash as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="relative flex gap-2">
      <button
        type="button"
        onClick={() => {
          setSaved((s) => !s);
          flash(saved ? "Quitada de favoritos" : "Guardada en favoritos");
        }}
        title="Guardar como favorita"
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-base transition-colors ${
          saved ? "border-terracotta bg-terracotta text-cream" : "border-line bg-cream-2 text-cacao-soft hover:text-cacao"
        }`}
      >
        {saved ? "♥" : "♡"}
      </button>
      <button
        type="button"
        onClick={() => flash("En la app real: genera un enlace para compartir")}
        title="Compartir"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-cream-2 text-cacao-soft hover:text-cacao"
      >
        ↗
      </button>
      <button
        type="button"
        onClick={() => flash("En la app real: abre una vista lista para imprimir")}
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
