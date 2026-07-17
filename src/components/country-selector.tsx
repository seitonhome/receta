"use client";

import { useParams } from "next/navigation";
import { useCountry } from "@/components/country-provider";
import { COUNTRIES, type CountryCode } from "@/lib/pricing/currency";
import type { Locale } from "@/lib/recipes/types";

export function CountrySelector() {
  const { country, setCountry } = useCountry();
  const params = useParams();
  const locale = (params.locale as Locale) ?? "es";

  return (
    <select
      value={country}
      onChange={(e) => setCountry(e.target.value as CountryCode)}
      title="País de referencia para precios"
      className="rounded-full border border-line bg-cream px-2.5 py-1 text-xs text-cacao-soft outline-none focus:border-sage"
    >
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name[locale]} · {c.currency}
        </option>
      ))}
    </select>
  );
}
