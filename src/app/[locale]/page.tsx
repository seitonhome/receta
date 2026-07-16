import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { redirect } from "@/i18n/navigation";
import { RecipesLanding } from "@/components/recipes-landing";
import { getAccessStatus } from "@/lib/access/purchase-status";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const access = await getAccessStatus();
  if (access.hasAccess) {
    redirect({ href: { pathname: "/recetas" }, locale });
  }

  return <RecipesLanding locale={locale} access={access} />;
}
