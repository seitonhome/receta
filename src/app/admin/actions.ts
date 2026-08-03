"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccessStatus } from "@/lib/access/purchase-status";
import { isAdmin } from "@/lib/admin";

async function requireAdmin() {
  const access = await getAccessStatus();
  if (!isAdmin(access.email)) {
    throw new Error("not authorized");
  }
}

export async function grantManualAccess(
  email: string
): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();

  const buyerEmail = email.trim().toLowerCase();
  if (!buyerEmail) return { error: "empty-email" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("purchases").insert({
    buyer_email: buyerEmail,
    product_id: "comidas-que-te-cuidan",
    status: "active",
    hotmart_transaction_id: `manual-${crypto.randomUUID()}`,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

export async function setPurchaseStatus(
  id: string,
  status: "active" | "refunded" | "cancelled"
): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from("purchases").update({ status }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}
