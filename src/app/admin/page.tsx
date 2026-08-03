import { redirect } from "next/navigation";
import { getAccessStatus } from "@/lib/access/purchase-status";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminGrantForm } from "@/components/admin-grant-form";
import { AdminPurchaseRow } from "@/components/admin-purchase-row";

export default async function AdminPage() {
  const access = await getAccessStatus();

  if (!access.authenticated) {
    redirect("/es/ingresar");
  }

  if (!isAdmin(access.email)) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="font-display text-xl font-semibold">No autorizado</p>
        <p className="mt-2 text-sm text-cacao-soft">
          Esta sección es solo para administradores.
        </p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, buyer_email, status, hotmart_transaction_id, purchased_at")
    .order("purchased_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Panel de administración</h1>
      <p className="mt-1 text-sm text-cacao-soft">
        Conectado como {access.email}. Otorga acceso manual o corrige el estado de una compra.
      </p>

      <div className="mt-8 rounded-xl border border-line bg-cream-2 p-5">
        <AdminGrantForm />
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-cacao-soft">
              <th className="px-4 py-3 font-semibold">Correo</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Transacción</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Cambiar</th>
            </tr>
          </thead>
          <tbody>
            {(purchases ?? []).map((p) => (
              <AdminPurchaseRow
                key={p.id}
                id={p.id}
                email={p.buyer_email}
                status={p.status}
                transactionId={p.hotmart_transaction_id}
                purchasedAt={p.purchased_at}
              />
            ))}
            {(purchases ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-cacao-soft">
                  Todavía no hay compras registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
