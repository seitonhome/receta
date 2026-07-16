import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AccessStatus =
  | { authenticated: false; hasAccess: false; email: null }
  | { authenticated: true; hasAccess: boolean; email: string };

/**
 * The single place that answers "can this visitor see the paid content?".
 * Access isn't a flag on the user -- it's derived by matching their signed-in
 * email against `purchases` (written by the Hotmart webhook), so a purchase
 * that arrives before or after the account exists both work the same way.
 */
export async function getAccessStatus(): Promise<AccessStatus> {
  if (!isSupabaseConfigured()) {
    return { authenticated: false, hasAccess: false, email: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { authenticated: false, hasAccess: false, email: null };
  }

  const email = user.email.toLowerCase();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, user_id")
    .eq("buyer_email", email)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  // Best-effort: link this purchase to the account for admin/audit purposes.
  // Never blocks or fails the access check -- RLS means a regular session
  // can't write here anyway, so this needs the service-role client.
  if (purchase && !purchase.user_id) {
    createAdminClient()
      .from("purchases")
      .update({ user_id: user.id })
      .eq("id", purchase.id)
      .then(() => {});
  }

  return { authenticated: true, hasAccess: Boolean(purchase), email };
}
