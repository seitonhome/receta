"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      <p className="font-display text-5xl font-semibold text-terracotta">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
        {t("title404")}
      </h1>
      <p className="mt-3 text-sm text-cacao-soft">{t("body404")}</p>
      <Link
        href="/"
        className="mt-7 inline-flex items-center rounded-full bg-cacao px-6 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
