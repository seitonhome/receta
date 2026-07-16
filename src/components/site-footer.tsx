import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-8 text-xs text-cacao-soft">
        {t("note")}
      </div>
    </footer>
  );
}
