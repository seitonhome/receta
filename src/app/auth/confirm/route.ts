import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

/**
 * Target of the magic-link email. Supabase's email template must point here
 * with `token_hash`/`type` -- in the Supabase dashboard, Authentication ->
 * Email Templates -> Magic Link, set the link to:
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}
 * (this isn't the dashboard's default template, so it has to be edited once
 * per project -- see docs/04-arquitectura-tecnica.md).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? `/${routing.defaultLocale}`;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const fallbackLocale = next.split("/")[1] || routing.defaultLocale;
  return NextResponse.redirect(`${origin}/${fallbackLocale}/ingresar?error=1`);
}
