"use client";

import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { es: "ES", en: "EN", fr: "FR" };

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  return (
    <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
      {routing.locales.map((locale) => {
        const active = params.locale === locale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() =>
              router.replace(
                // @ts-expect-error -- pathname may contain dynamic params not known statically here
                { pathname, params },
                { locale }
              )
            }
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-cacao text-cream"
                : "text-cacao-soft hover:text-cacao"
            }`}
            aria-current={active}
          >
            {LABELS[locale]}
          </button>
        );
      })}
    </div>
  );
}
