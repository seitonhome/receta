import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SignInForm } from "@/components/sign-in-form";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { locale } = await params;
  const { next, error } = await searchParams;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-cacao-soft">{t("subtitle")}</p>

      {error && (
        <p className="mt-4 rounded-lg border border-terracotta bg-terracotta-tint px-3 py-2 text-xs text-terracotta">
          {t("linkExpired")}
        </p>
      )}

      <div className="mt-6">
        <SignInForm
          locale={locale}
          next={next ?? `/${locale}/recetas`}
          labels={{
            emailLabel: t("emailLabel"),
            emailPlaceholder: t("emailPlaceholder"),
            submit: t("submit"),
            sending: t("sending"),
            sentTitle: t("sentTitle"),
            sentBody: t.raw("sentBody"),
            useSameEmail: t("useSameEmail"),
          }}
        />
      </div>
    </div>
  );
}
