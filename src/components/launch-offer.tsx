import { CountdownTimer } from "@/components/countdown-timer";
import { LAUNCH_OFFER_DEADLINE, LAUNCH_PRICE_USD, REGULAR_PRICE_USD } from "@/lib/launch-offer";

export function LaunchOffer({
  labels,
  compact = false,
}: {
  labels: {
    eyebrow: string;
    returnsNote: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  compact?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border px-6 py-5 text-center ${
        compact
          ? "border-cream/25 bg-cream/5"
          : "border-terracotta/40 bg-terracotta-tint"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${
          compact ? "text-cream/80" : "text-terracotta"
        }`}
      >
        {labels.eyebrow}
      </p>

      <p className="flex items-baseline justify-center gap-2.5">
        <span
          className={`font-display text-4xl font-semibold tabular-nums ${
            compact ? "text-cream" : "text-cacao"
          }`}
        >
          ${LAUNCH_PRICE_USD}
        </span>
        <span
          className={`text-lg tabular-nums line-through decoration-2 ${
            compact ? "text-cream/50 decoration-cream/50" : "text-cacao-soft decoration-cacao-soft/70"
          }`}
        >
          ${REGULAR_PRICE_USD}
        </span>
        <span className={`text-xs font-medium ${compact ? "text-cream/60" : "text-cacao-soft"}`}>
          USD
        </span>
      </p>

      <CountdownTimer
        deadline={LAUNCH_OFFER_DEADLINE}
        labels={{ days: labels.days, hours: labels.hours, minutes: labels.minutes, seconds: labels.seconds }}
        tone={compact ? "onDark" : "default"}
      />

      <p className={`text-xs ${compact ? "text-cream/60" : "text-cacao-soft"}`}>
        {labels.returnsNote}
      </p>
    </div>
  );
}
