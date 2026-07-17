"use client";

import { useActionState, useState } from "react";
import {
  requestMagicLink,
  verifyEmailCode,
  type SignInState,
  type VerifyState,
} from "@/app/[locale]/ingresar/actions";

type Labels = {
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  sending: string;
  sentTitle: string;
  sentBody: string;
  useSameEmail: string;
  codeLabel: string;
  codePlaceholder: string;
  codeSubmit: string;
  codeVerifying: string;
  changeEmail: string;
  resend: string;
};

const initialSignInState: SignInState = { status: "idle" };
const initialVerifyState: VerifyState = { status: "idle" };

export function SignInForm({ next, labels }: { next: string; labels: Labels }) {
  const [signInState, signInAction, isSending] = useActionState(
    requestMagicLink,
    initialSignInState
  );
  const [verifyState, verifyAction, isVerifying] = useActionState(
    verifyEmailCode,
    initialVerifyState
  );
  const [resendKey, setResendKey] = useState(0);

  if (signInState.status === "sent") {
    const email = signInState.message ?? "";
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-sage bg-sage-tint p-5">
          <p className="font-display text-lg font-semibold text-sage-deep">{labels.sentTitle}</p>
          <p className="mt-1.5 text-sm text-cacao-soft">
            {labels.sentBody.replace("{email}", email)}
          </p>
        </div>

        <form action={verifyAction} className="flex flex-col gap-3">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next} />

          <label className="text-xs font-semibold uppercase tracking-wide text-cacao-soft">
            {labels.codeLabel}
          </label>
          <input
            type="text"
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            placeholder={labels.codePlaceholder}
            className="rounded-lg border border-line bg-cream px-3.5 py-2.5 text-center text-lg tracking-[0.4em] text-cacao outline-none focus:border-sage"
          />

          {verifyState.status === "error" && (
            <p className="rounded-lg border border-terracotta bg-terracotta-tint px-3 py-2 text-xs text-terracotta">
              {verifyState.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="mt-1 rounded-full bg-cacao px-5 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isVerifying ? labels.codeVerifying : labels.codeSubmit}
          </button>

          <button
            type="button"
            onClick={() => setResendKey((k) => k + 1)}
            className="text-xs text-cacao-soft underline-offset-2 hover:underline"
          >
            {labels.changeEmail}
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={signInAction} key={resendKey} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />

      <label className="text-xs font-semibold uppercase tracking-wide text-cacao-soft">
        {labels.emailLabel}
      </label>
      <input
        type="email"
        name="email"
        required
        placeholder={labels.emailPlaceholder}
        className="rounded-lg border border-line bg-cream px-3.5 py-2.5 text-sm text-cacao outline-none focus:border-sage"
      />
      <p className="text-xs text-cacao-soft">{labels.useSameEmail}</p>

      {signInState.status === "error" && (
        <p className="rounded-lg border border-terracotta bg-terracotta-tint px-3 py-2 text-xs text-terracotta">
          {signInState.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="mt-1 rounded-full bg-cacao px-5 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSending ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
