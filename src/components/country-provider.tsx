"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_COUNTRY, type CountryCode } from "@/lib/pricing/currency";

const STORAGE_KEY = "comidasquetecuidan.country";

const CountryContext = createContext<{
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
}>({ country: DEFAULT_COUNTRY, setCountry: () => {} });

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>(DEFAULT_COUNTRY);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CountryCode | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount; value isn't available during SSR so it can't be a lazy useState initializer.
    if (stored) setCountryState(stored);
  }, []);

  function setCountry(c: CountryCode) {
    setCountryState(c);
    window.localStorage.setItem(STORAGE_KEY, c);
  }

  return (
    <CountryContext.Provider value={{ country, setCountry }}>{children}</CountryContext.Provider>
  );
}

export function useCountry() {
  return useContext(CountryContext);
}
