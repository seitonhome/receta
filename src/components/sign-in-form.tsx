"use client";

import { useActionState } from "react";
import { requestMagicLink, type SignInState } from "@/app/[locale]/ingresar/actions";

type Labels = {
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  sending: string;
  sentTitle: string;
  sentBody: string;
  useSameEmail: string;
};

const initialState: SignInState = { status: "idle" };

export function SignInForm({
  locale,
  next,
  labels,
}: {
  locale: string;
  next: string;
  labels: Labels;
}) {
  const [state, formAction, isPending] = useActionState(requestMagicLink, initialState);

  if (state.status === "sent") {
    return (
      <div className="rounded-xl border border-sage bg-sage-tint p-5">
        <p className="font-display text-lg font-semibold text-sage-deep">{labels.sentTitle}</p>
        <p className="mt-1.5 text-sm text-cacao-soft">
          {labels.sentBody.replace("{email}", state.message ?? "")}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="locale" value={locale} />
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

      {state.status === "error" && (
        <p className="rounded-lg border border-terracotta bg-terracotta-tint px-3 py-2 text-xs text-terracotta">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 rounded-full bg-cacao px-5 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
