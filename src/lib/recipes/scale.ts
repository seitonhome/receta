/**
 * Culinary-aware portion scaling. Whole-count ingredients (eggs, cloves,
 * fillets...) snap to the nearest half unit so we never show "0.13 eggs".
 * Everything else snaps to a fraction/step appropriate to its magnitude.
 */
export function scaleQty(base: number, ratio: number, isCountUnit: boolean): number {
  let value = base * ratio;
  if (isCountUnit) {
    value = Math.round(value * 2) / 2;
    if (value < 0.5) value = 0.5;
  } else if (value < 2) {
    value = Math.round(value * 4) / 4;
  } else if (value < 10) {
    value = Math.round(value * 2) / 2;
  } else {
    value = Math.round(value / 5) * 5;
  }
  return value;
}

const FRACTIONS: [number, string][] = [
  [0, ""],
  [0.25, "¼"],
  [0.5, "½"],
  [0.75, "¾"],
  [1, ""],
];

export function formatQty(value: number): string {
  let whole = Math.floor(value);
  const frac = value - whole;
  let best = FRACTIONS[0];
  for (const f of FRACTIONS) {
    if (Math.abs(f[0] - frac) < Math.abs(best[0] - frac)) best = f;
  }
  if (best[0] === 1) {
    whole += 1;
    best = FRACTIONS[0];
  }
  if (whole === 0 && best[1]) return best[1];
  if (!best[1]) return String(whole);
  return `${whole} ${best[1]}`;
}

export function formatMoney(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
