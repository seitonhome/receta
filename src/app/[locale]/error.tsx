"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      <p className="font-display text-5xl font-semibold text-terracotta">···</p>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
        {t("title500")}
      </h1>
      <p className="mt-3 text-sm text-cacao-soft">{t("body500")}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-full bg-cacao px-6 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-medium text-cacao transition-colors hover:border-sage"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
