"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SignInState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

export async function requestMagicLink(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "El proyecto de Supabase todavía no está conectado (ver .env.example). El inicio de sesión no puede activarse hasta configurarlo.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const locale = String(formData.get("locale") ?? "es");
  const next = String(formData.get("next") ?? `/${locale}/favoritos`);

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Escribe un correo válido." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "sent", message: email };
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.auth.signOut();
}
