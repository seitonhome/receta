import { describe, it, expect } from "vitest";
import { convertIngredientCost } from "./convert-cost";
import type { IngredientPrice } from "./ingredient-catalog";
import type { Ingredient } from "@/lib/recipes/types";

function price(overrides: Partial<IngredientPrice>): IngredientPrice {
  return {
    id: "test",
    name: "Test",
    category: "test",
    matchKeywords: [],
    priceCOP: 1000,
    unit: "kg",
    source: "test",
    sourceDate: "2026-01-01",
    ...overrides,
  };
}

function ing(overrides: Partial<Ingredient>): Ingredient {
  return { name: "test", qty: 1, unit: "g", ...overrides };
}

describe("convertIngredientCost", () => {
  it("returns null when the ingredient has no researched price yet", () => {
    expect(convertIngredientCost(ing({}), price({ priceCOP: 0 }))).toBeNull();
  });

  it("converts grams against a per-kg price", () => {
    const cost = convertIngredientCost(ing({ qty: 250, unit: "g" }), price({ priceCOP: 4000, unit: "kg" }));
    expect(cost).toBe(1000);
  });

  it("converts liters/ml against a per-liter price", () => {
    const cost = convertIngredientCost(ing({ qty: 500, unit: "ml" }), price({ priceCOP: 4000, unit: "l" }));
    expect(cost).toBe(2000);
  });

  it("converts tablespoons of a powder using the powder density", () => {
    const cost = convertIngredientCost(ing({ qty: 2, unit: "cdas" }), price({ priceCOP: 100000, unit: "kg" }));
    // 2 cdas = 30ml * 0.55 g/ml = 16.5g -> 1650 COP
    expect(cost).toBeCloseTo(1650, 5);
  });

  it("uses a lighter density for fresh herbs than for powders", () => {
    const herbCost = convertIngredientCost(
      ing({ qty: 2, unit: "cdas" }),
      price({ priceCOP: 100000, unit: "kg", isFreshHerb: true })
    );
    const powderCost = convertIngredientCost(
      ing({ qty: 2, unit: "cdas" }),
      price({ priceCOP: 100000, unit: "kg", isFreshHerb: false })
    );
    expect(herbCost).toBeLessThan(powderCost!);
  });

  it("prices a whole count unit directly (e.g. an avocado)", () => {
    const cost = convertIngredientCost(ing({ qty: 2, unit: "unidad" }), price({ priceCOP: 2000, unit: "unidad" }));
    expect(cost).toBe(4000);
  });

  // Regression: a recipe measuring a "unidad"-priced ingredient in grams was
  // read as a count of whole units (300 g of avocado priced as 300 avocados).
  it("does not read grams as a count when priced per unidad", () => {
    const cost = convertIngredientCost(
      ing({ qty: 300, unit: "g" }),
      price({ priceCOP: 2000, unit: "unidad", avgUnitWeightG: 200 })
    );
    expect(cost).toBe(3000); // 300g / 200g-per-avocado * 2000
  });

  it("prices a can by count when the recipe gives a can count", () => {
    const cost = convertIngredientCost(ing({ qty: 2, unit: "lata" }), price({ priceCOP: 5000, unit: "lata" }));
    expect(cost).toBe(10000);
  });

  // Regression: "400 g palmitos" was read as "400 cans" because the lata
  // branch multiplied qty by the per-can price with no gram conversion.
  it("does not read grams as a can count when priced per lata", () => {
    const cost = convertIngredientCost(
      ing({ qty: 400, unit: "g" }),
      price({ priceCOP: 12550, unit: "lata", packageSizeG: 220 })
    );
    expect(cost).toBeCloseTo((400 / 220) * 12550, 5);
  });

  // Regression: "100 ml leche de coco" was read as "100 cans".
  it("does not read ml as a can count when priced per lata with a known volume", () => {
    const cost = convertIngredientCost(
      ing({ qty: 100, unit: "ml" }),
      price({ priceCOP: 10000, unit: "lata", packageSizeMl: 400 })
    );
    expect(cost).toBeCloseTo((100 / 400) * 10000, 5);
  });

  // Regression: "1 cdta esencia de vainilla" was read as "1 whole bottle".
  it("converts a spoon measure against a bottle price via packageSizeMl", () => {
    const cost = convertIngredientCost(
      ing({ qty: 1, unit: "cdta" }),
      price({ priceCOP: 15000, unit: "botella", packageSizeMl: 30 })
    );
    expect(cost).toBeCloseTo((5 / 30) * 15000, 5);
  });

  it("prices a package by unit count (e.g. bread slices)", () => {
    const cost = convertIngredientCost(
      ing({ qty: 8, unit: "unidad" }),
      price({ priceCOP: 7500, unit: "paquete", packageUnitCount: 16 })
    );
    expect(cost).toBe(3750);
  });

  it("prices a package by weight (e.g. crushed cookies)", () => {
    const cost = convertIngredientCost(
      ing({ qty: 100, unit: "g" }),
      price({ priceCOP: 6370, unit: "paquete", packageSizeG: 220 })
    );
    expect(cost).toBeCloseTo((100 / 220) * 6370, 5);
  });

  it("converts a dozen-priced ingredient from a unit count", () => {
    const cost = convertIngredientCost(ing({ qty: 3, unit: "unidad" }), price({ priceCOP: 7500, unit: "docena" }));
    expect(cost).toBe(1875); // 3/12 of a dozen
  });

  it("reads an embedded per-piece weight in the unit string", () => {
    const cost = convertIngredientCost(
      ing({ qty: 2, unit: "filetes (150 g c/u)" }),
      price({ priceCOP: 45000, unit: "kg" })
    );
    expect(cost).toBeCloseTo(2 * 0.15 * 45000, 5);
  });

  it("falls back to the catalog's average weight for a bare count unit", () => {
    const cost = convertIngredientCost(
      ing({ qty: 2, unit: "diente" }),
      price({ priceCOP: 15556, unit: "kg", avgUnitWeightG: 5 })
    );
    expect(cost).toBeCloseTo(2 * 0.005 * 15556, 5);
  });

  it("returns null for a count unit with no average weight to fall back on", () => {
    const cost = convertIngredientCost(ing({ qty: 2, unit: "ramitas" }), price({ priceCOP: 15000, unit: "kg" }));
    expect(cost).toBeNull();
  });
});
