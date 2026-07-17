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

  if (!/^\d{6}$/.test(token)) {
    return { status: "error", message: "Escribe el código de 6 dígitos tal como llegó en el correo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect(next);
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  await supabase.auth.signOut();
}
