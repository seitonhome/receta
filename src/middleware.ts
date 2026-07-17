import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const supabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function middleware(request: NextRequest) {
  // Supabase's magic-link email points at its own /auth/v1/verify endpoint
  // and, after verifying, redirects the browser to the bare Site URL with a
  // ?code= param -- it does this regardless of the emailRedirectTo we
  // request or what's allow-listed in Redirect URLs, at least on this
  // project. Rather than depend on that cooperating, catch the ?code=
  // wherever it lands and forward it to our actual handler.
  const code = request.nextUrl.searchParams.get("code");
  if (code && request.nextUrl.pathname !== "/auth/confirm") {
    const confirmUrl = request.nextUrl.clone();
    confirmUrl.pathname = "/auth/confirm";
    return NextResponse.redirect(confirmUrl);
  }

  const response = intlMiddleware(request) ?? NextResponse.next();

  // Until a real Supabase project is wired up (see .env.example), skip the
  // session refresh instead of throwing on every request.
  if (!supabaseConfigured) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the auth token when it's close to expiring and keeps the
  // session cookie in sync -- Server Components can read cookies but can't
  // write them, so this is the one place the refresh can happen.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|icon|.*\\..*).*)"],
};
