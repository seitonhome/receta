import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

/**
 * Target of the magic-link email (set via `emailRedirectTo` in
 * requestMagicLink). Handles both formats Supabase can send here depending
 * on project config:
 *   - `?code=...`                 (PKCE flow, the default -- most projects)
 *   - `?token_hash=...&type=...`  (if the email template was hand-edited to
 *                                  use {{ .TokenHash }} instead of
 *                                  {{ .ConfirmationURL }})
 *
 * IMPORTANT: this route only ever gets hit at all if
 * `https://<your-domain>/auth/confirm` (or a wildcard covering it) is in
 * Supabase's Authentication -> URL Configuration -> Redirect URLs allow
 * list. If it's missing there, Supabase silently ignores our
 * `emailRedirectTo` and sends people to the bare Site URL instead, with no
 * error -- see docs/08-autenticacion-y-acceso.md.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? `/${routing.defaultLocale}`;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const fallbackLocale = next.split("/")[1] || routing.defaultLocale;
  return NextResponse.redirect(`${origin}/${fallbackLocale}/ingresar?error=1`);
}
