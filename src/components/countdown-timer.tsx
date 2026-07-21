"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(deadline: string): Remaining {
  const diff = Math.max(0, new Date(deadline).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function CountdownTimer({
  deadline,
  labels,
  tone = "default",
}: {
  deadline: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  tone?: "default" | "onDark";
}) {
  // Starts null so the server-rendered markup and the first client render
  // match; the real countdown fills in after mount to avoid a hydration
  // mismatch against the visitor's clock.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: see comment above about avoiding a hydration mismatch.
    setRemaining(getRemaining(deadline));
    const id = setInterval(() => setRemaining(getRemaining(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const units: [number, string, boolean][] = [
    [remaining?.days ?? 0, labels.days, false],
    [remaining?.hours ?? 0, labels.hours, false],
    [remaining?.minutes ?? 0, labels.minutes, false],
    [remaining?.seconds ?? 0, labels.seconds, true],
  ];

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-2.5 ${remaining ? "" : "invisible"}`}
      aria-hidden={!remaining}
    >
      {units.map(([value, label, tick]) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span
            key={tick ? value : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-terracotta font-display text-lg font-semibold tabular-nums text-cream sm:h-12 sm:w-12 sm:text-xl ${
              tick ? "motion-safe:animate-[countdown-tick_1s_ease-out]" : ""
            }`}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span
            className={`text-[10px] uppercase tracking-wide ${
              tone === "onDark" ? "text-cream/60" : "text-cacao-soft"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
