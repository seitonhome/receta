"use client";

import { useCountry } from "@/components/country-provider";
import { getCountry, convertFromCOP, formatMoney } from "@/lib/pricing/currency";
import type { Locale } from "@/lib/recipes/types";

const APPROX_LABEL: Record<Locale, string> = {
  es: "Conversión aproximada de moneda, no un precio verificado en tu país.",
  en: "Approximate currency conversion, not a verified price in your country.",
  fr: "Conversion monétaire approximative, pas un prix vérifié dans votre pays.",
};

const REFERENCE_LABEL: Record<Locale, string> = {
  es: "Referencia original",
  en: "Original reference",
  fr: "Référence d'origine",
};

export function PriceDisplay({
  copAmount,
  locale,
  size = "lg",
}: {
  copAmount: number;
  locale: Locale;
  size?: "lg" | "md";
}) {
  const { country } = useCountry();
  const countryOption = getCountry(country);
  const converted = convertFromCOP(copAmount, countryOption);
  const intlLocale = locale === "es" ? "es-CO" : locale === "fr" ? "fr-FR" : "en-US";

  return (
    <div>
      <p
        className={`font-display font-semibold tabular-nums ${size === "lg" ? "text-2xl" : "text-xl"}`}
      >
        {formatMoney(converted, countryOption.currency, intlLocale)}
      </p>
      {countryOption.code !== "CO" && (
        <p className="mt-0.5 text-[11px] text-cacao-soft">
          {APPROX_LABEL[locale]} {REFERENCE_LABEL[locale]}: {formatMoney(copAmount, "COP", "es-CO")}.
        </p>
      )}
    </div>
  );
}
