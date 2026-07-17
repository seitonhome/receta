"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SignInState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

const NOT_CONFIGURED_MESSAGE =
  "El proyecto de Supabase todavía no está conectado (ver .env.example). El inicio de sesión no puede activarse hasta configurarlo.";

export async function requestMagicLink(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Escribe un correo válido." };
  }

  const supabase = await createClient();

  // No emailRedirectTo / clickable link on purpose: a one-time code the
  // person types in themselves can't be silently consumed by a corporate
  // email scanner (e.g. Outlook Safe Links) the way a clickable magic link
  // can -- that was the root cause of the otp_expired loop.
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "sent", message: email };
}

export type VerifyState = {
  status: "idle" | "error";
  message?: string;
};

export async function verifyEmailCode(
  _prevState: VerifyState,
  formData: FormData
): Promise<VerifyState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();
  const next = String(formData.get("next") ?? "/");

  if (!/^\d{4,10}$/.test(token)) {
    return { status: "error", message: "Escribe el código tal como llegó en el correo, solo números." };
  }

  const supabase = await createClient();

  // Supabase classifies the OTP token differently depending on the account's
  // history (first-ever confirmation vs. a returning sign-in), and picking
  // the wrong `type` here fails with the same generic "Token has expired or
  // is invalid" regardless of the real cause. Try the types that can apply
  // to an email-OTP sign-in, in order, instead of gambling on one.
  const typesToTry = ["email", "signup", "magiclink"] as const;
  let lastError: string | undefined;

  for (const type of typesToTry) {
    const { error } = await supabase.auth.verifyOtp({ email, token, type });
    if (!error) {
      redirect(next);
    }
    lastError = error.message;
  }

  return { status: "error", message: lastError };
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.auth.signOut();
}
