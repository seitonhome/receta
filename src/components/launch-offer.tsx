import { CountdownTimer } from "@/components/countdown-timer";
import { LAUNCH_OFFER_DEADLINE, LAUNCH_PRICE_USD, REGULAR_PRICE_USD } from "@/lib/launch-offer";

export function LaunchOffer({
  labels,
  compact = false,
}: {
  labels: {
    eyebrow: string;
    savings: string;
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
      className={`mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border px-6 py-6 text-center ${
        compact
          ? "border-cream/20 bg-cream/5"
          : "border-terracotta/30 bg-gradient-to-b from-terracotta-tint to-cream shadow-sm"
      }`}
    >
      <span className="inline-flex items-center rounded-full bg-terracotta px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
        {labels.eyebrow}
      </span>

      <p className="flex items-baseline justify-center gap-2.5">
        <span
          className={`font-display text-5xl font-semibold tabular-nums ${
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

      <span className="inline-flex items-center rounded-full bg-sage-deep px-3 py-1 text-[11px] font-semibold text-cream">
        {labels.savings}
      </span>

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
