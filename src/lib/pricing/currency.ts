export type CountryCode = "CO" | "MX" | "US" | "CA" | "ES" | "FR" | "GB";

export type CountryOption = {
  code: CountryCode;
  currency: string;
  /** COP it takes to buy 1 unit of this currency. Deliberately rough,
   * hand-set reference values, NOT a live feed -- see the big warning
   * below. Update periodically from a real source (e.g. a central bank
   * page or Numbeo), the same spirit as price_sources in docs/06. */
  copPerUnit: number;
  name: { es: string; en: string; fr: string };
};

/**
 * IMPORTANT: these are illustrative, hand-set reference rates, not a live
 * exchange-rate feed (no API, no cost, per the brief's "sin costo extra").
 * They turn the recipe's COP reference cost into a rough order-of-magnitude
 * figure in the visitor's currency -- a straight currency conversion, NOT a
 * researched local grocery price (those differ by real cost-of-living, not
 * just FX rate). The UI must always show the "aproximado" disclaimer next
 * to any converted figure -- never present it as a verified local price.
 * Rates set 2026-07-15; revisit periodically.
 */
export const COUNTRIES: CountryOption[] = [
  { code: "CO", currency: "COP", copPerUnit: 1, name: { es: "Colombia", en: "Colombia", fr: "Colombie" } },
  { code: "MX", currency: "MXN", copPerUnit: 210, name: { es: "México", en: "Mexico", fr: "Mexique" } },
  { code: "US", currency: "USD", copPerUnit: 4000, name: { es: "Estados Unidos", en: "United States", fr: "États-Unis" } },
  { code: "CA", currency: "CAD", copPerUnit: 2950, name: { es: "Canadá", en: "Canada", fr: "Canada" } },
  { code: "ES", currency: "EUR", copPerUnit: 4300, name: { es: "España", en: "Spain", fr: "Espagne" } },
  { code: "FR", currency: "EUR", copPerUnit: 4300, name: { es: "Francia", en: "France", fr: "France" } },
  { code: "GB", currency: "GBP", copPerUnit: 5000, name: { es: "Reino Unido", en: "United Kingdom", fr: "Royaume-Uni" } },
];

export const DEFAULT_COUNTRY: CountryCode = "CO";

export function getCountry(code: CountryCode): CountryOption {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

/** Converts a COP amount to the target country's currency. Rounds to a
 * sensible number of significant figures instead of fake-precise decimals. */
export function convertFromCOP(amountCOP: number, country: CountryOption): number {
  if (country.code === "CO") return amountCOP;
  const value = amountCOP / country.copPerUnit;
  if (value >= 100) return Math.round(value);
  if (value >= 10) return Math.round(value * 10) / 10;
  return Math.round(value * 100) / 100;
}

export function formatMoney(value: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(
      value
    );
  } catch {
    return `${value} ${currency}`;
  }
}
