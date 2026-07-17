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
    setRemaining(getRemaining(deadline));
    const id = setInterval(() => setRemaining(getRemaining(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const units: [number, string][] = [
    [remaining?.days ?? 0, labels.days],
    [remaining?.hours ?? 0, labels.hours],
    [remaining?.minutes ?? 0, labels.minutes],
    [remaining?.seconds ?? 0, labels.seconds],
  ];

  return (
    <div
      className={`flex items-center justify-center gap-3 sm:gap-4 ${remaining ? "" : "invisible"}`}
      aria-hidden={!remaining}
    >
      {units.map(([value, label]) => (
        <div key={label} className="flex flex-col items-center">
          <span
            className={`font-display text-2xl font-semibold tabular-nums sm:text-3xl ${
              tone === "onDark" ? "text-cream" : "text-cacao"
            }`}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span
            className={`mt-0.5 text-[10px] uppercase tracking-wide ${
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
