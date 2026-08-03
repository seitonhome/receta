import { describe, it, expect } from "vitest";
import { scaleQty, formatQty, formatMoney } from "./scale";

describe("scaleQty", () => {
  it("scales a non-count ingredient proportionally", () => {
    expect(scaleQty(2, 2, false)).toBe(4);
  });

  it("rounds a count ingredient to the nearest half instead of a decimal", () => {
    // 1 egg * (6/4 ratio) = 1.5 eggs, never "1.33 eggs" or similar oddities.
    expect(scaleQty(1, 1.5, true)).toBe(1.5);
  });

  it("never rounds a count ingredient down to zero", () => {
    expect(scaleQty(1, 0.1, true)).toBe(0.5);
  });

  it("rounds small non-count quantities to quarters", () => {
    expect(scaleQty(1, 1.2, false)).toBe(1.25);
  });

  it("rounds large non-count quantities to steps of 5", () => {
    expect(scaleQty(20, 1, false)).toBe(20);
    expect(scaleQty(22, 1, false)).toBe(20);
    expect(scaleQty(23, 1, false)).toBe(25);
  });
});

describe("formatQty", () => {
  it("formats a whole number with no fraction", () => {
    expect(formatQty(4)).toBe("4");
  });

  it("formats a half as a fraction glyph", () => {
    expect(formatQty(1.5)).toBe("1 ½");
  });

  it("formats a bare fraction below one with no leading zero", () => {
    expect(formatQty(0.25)).toBe("¼");
  });

  it("carries a fraction that rounds up into the whole part", () => {
    expect(formatQty(1.9)).toBe("2");
  });
});

describe("formatMoney", () => {
  it("adds thousands separators", () => {
    expect(formatMoney(1234567)).toBe("1.234.567");
  });

  it("rounds to the nearest whole unit", () => {
    expect(formatMoney(999.6)).toBe("1.000");
  });
});
