"use client";

import { useState, useTransition } from "react";
import { grantManualAccess } from "@/app/admin/actions";

export function AdminGrantForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await grantManualAccess(email);
      if ("error" in result) {
        setMessage(`Error: ${result.error}`);
        return;
      }
      setMessage(`Acceso otorgado a ${email}`);
      setEmail("");
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="grant-email" className="text-xs font-medium text-cacao-soft">
          Correo del comprador
        </label>
        <input
          id="grant-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cliente@correo.com"
          className="h-10 w-64 rounded-lg border border-line bg-cream px-3 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="h-10 rounded-lg bg-cacao px-4 text-sm font-medium text-cream disabled:opacity-60"
      >
        {isPending ? "Guardando…" : "Otorgar acceso"}
      </button>
      {message && <p className="text-xs text-sage-deep">{message}</p>}
    </form>
  );
}
