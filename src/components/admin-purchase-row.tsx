"use client";

import { useTransition } from "react";
import { setPurchaseStatus } from "@/app/admin/actions";

type Status = "active" | "refunded" | "cancelled" | "chargeback";

export function AdminPurchaseRow({
  id,
  email,
  status,
  transactionId,
  purchasedAt,
}: {
  id: string;
  email: string;
  status: Status;
  transactionId: string | null;
  purchasedAt: string;
}) {
  const [isPending, startTransition] = useTransition();

  function onChange(next: "active" | "refunded" | "cancelled") {
    startTransition(async () => {
      await setPurchaseStatus(id, next);
    });
  }

  return (
    <tr className="border-b border-dashed border-line last:border-none">
      <td className="py-2 pr-4">{email}</td>
      <td className="py-2 pr-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            status === "active"
              ? "bg-sage-tint text-sage-deep"
              : status === "refunded" || status === "cancelled"
                ? "bg-terracotta-tint text-terracotta"
                : "bg-cream-2 text-cacao-soft"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="py-2 pr-4 font-mono text-xs text-cacao-soft">{transactionId ?? "—"}</td>
      <td className="py-2 pr-4 text-xs text-cacao-soft">{new Date(purchasedAt).toLocaleDateString("es-CO")}</td>
      <td className="py-2">
        <select
          disabled={isPending}
          value={status}
          onChange={(e) => onChange(e.target.value as "active" | "refunded" | "cancelled")}
          className="h-8 rounded-md border border-line bg-cream px-2 text-xs"
        >
          <option value="active">active</option>
          <option value="refunded">refunded</option>
          <option value="cancelled">cancelled</option>
        </select>
      </td>
    </tr>
  );
}
