import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SUPPORT_EMAIL } from "@/lib/support";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-xs text-cacao-soft sm:flex-row sm:items-center sm:justify-between">
        <p>{t("note")}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/terminos" className="hover:text-cacao">
            {t("terms")}
          </Link>
          <Link href="/privacidad" className="hover:text-cacao">
            {t("privacy")}
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-cacao">
            {t("support")}
          </a>
        </div>
      </div>
    </footer>
  );
}
