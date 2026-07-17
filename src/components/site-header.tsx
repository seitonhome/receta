import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CountrySelector } from "@/components/country-selector";
import { AccountMenu } from "@/components/account-menu";
import { getAccessStatus } from "@/lib/access/purchase-status";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const access = await getAccessStatus();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          {t("brand")}{" "}
          <em className="font-display text-terracotta not-italic italic font-medium">
            {t("brandAccent")}
          </em>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-cacao-soft">
          {access.hasAccess && (
            <>
              <Link href="/recetas" className="hover:text-cacao">
                {t("recipes")}
              </Link>
              <Link href="/lista-de-compras" className="hidden hover:text-cacao sm:inline">
                {t("shoppingList")}
              </Link>
              <Link href="/favoritos" className="hidden hover:text-cacao sm:inline">
                {t("favorites")}
              </Link>
            </>
          )}
          <AccountMenu locale={locale} access={access} />
          <CountrySelector />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
