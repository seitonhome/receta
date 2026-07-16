import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Hotmart webhook (Fase 6). Turns a Hotmart purchase event into a row in
 * `public.purchases`, which is the only thing `getAccessStatus()` checks to
 * grant access -- see src/lib/access/purchase-status.ts.
 *
 * IMPORTANT -- verify before going live: Hotmart's own docs
 * (developers.hotmart.com) were not reachable while building this (blocked
 * by their CDN's bot protection from this environment), so the field paths
 * below come from Hotmart's publicly indexed webhook field list, not a
 * fetched payload sample. Before connecting a real product:
 *   1. Send a test webhook from the Hotmart dashboard (Tools -> Webhook) and
 *      log `JSON.stringify(body)` here to see the actual shape.
 *   2. Confirm whether `hottok` arrives in the body (as assumed below) or as
 *      a header, and update `verifyHottok` accordingly.
 *   3. Confirm the exact status/event values you receive map correctly in
 *      `STATUS_MAP`.
 */

const STATUS_MAP: Record<string, "active" | "refunded" | "cancelled" | "chargeback"> = {
  approved: "active",
  complete: "active",
  completed: "active",
  refunded: "refunded",
  cancelled: "cancelled",
  canceled: "cancelled",
  chargeback: "chargeback",
  dispute: "chargeback",
};

function verifyHottok(body: Record<string, unknown>): boolean {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected) return false; // fail closed if not configured
  return body.hottok === expected;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!verifyHottok(body)) {
    return NextResponse.json({ error: "invalid hottok" }, { status: 401 });
  }

  const data = (body.data ?? body) as Record<string, unknown>;
  const buyer = (data.buyer ?? {}) as Record<string, unknown>;
  const purchase = (data.purchase ?? {}) as Record<string, unknown>;
  const product = (data.product ?? {}) as Record<string, unknown>;

  const email = String(buyer.email ?? data.email ?? "").toLowerCase().trim();
  const transactionId = String(purchase.transaction ?? data.transaction ?? "");
  const rawStatus = String(purchase.status ?? data.status ?? "").toLowerCase();
  const productId = String(product.id ?? data.prod ?? "comidas-que-te-cuidan");
  const status = STATUS_MAP[rawStatus];

  if (!email || !transactionId || !status) {
    // Not an error we want Hotmart to retry forever -- log and acknowledge.
    console.warn("hotmart webhook: unrecognized payload shape", {
      email: Boolean(email),
      transactionId: Boolean(transactionId),
      rawStatus,
    });
    return NextResponse.json({ received: true, ignored: true });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("purchases").upsert(
    {
      buyer_email: email,
      hotmart_transaction_id: transactionId,
      product_id: productId,
      status,
      raw_payload: body,
    },
    { onConflict: "hotmart_transaction_id" }
  );

  if (error) {
    console.error("hotmart webhook: failed to upsert purchase", error);
    return NextResponse.json({ error: "storage failure" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
