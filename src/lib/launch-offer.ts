/**
 * Fixed deadlines, not a rolling window that resets per visit.
 *
 * Phase 1 ("launch"): $12 until LAUNCH_OFFER_DEADLINE.
 * Phase 2 ("second"): still $12, extended for 30 more days as a second
 *   countdown, until SECOND_OFFER_DEADLINE.
 * Phase 3 ("regular"): no more countdown, price shown as REGULAR_PRICE_USD.
 *   Hotmart's actual charged price has to be updated there manually to match.
 */
export const LAUNCH_OFFER_DEADLINE = "2026-10-07T23:59:59-05:00";
export const SECOND_OFFER_DEADLINE = "2026-11-06T23:59:59-05:00";
export const LAUNCH_PRICE_USD = 12;
export const REGULAR_PRICE_USD = 49;

export type OfferPhase = "launch" | "second" | "regular";

export function getOfferPhase(now: Date = new Date()): OfferPhase {
  if (now.getTime() < new Date(LAUNCH_OFFER_DEADLINE).getTime()) return "launch";
  if (now.getTime() < new Date(SECOND_OFFER_DEADLINE).getTime()) return "second";
  return "regular";
}
