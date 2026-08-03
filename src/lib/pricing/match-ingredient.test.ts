import { describe, it, expect } from "vitest";
import { matchIngredient } from "./match-ingredient";
import { INGREDIENT_CATALOG } from "./ingredient-catalog";

describe("matchIngredient", () => {
  it("matches a plain ingredient name", () => {
    const match = matchIngredient("Zanahoria");
    expect(match?.id).toBe("zanahoria");
  });

  it("prefers the more specific entry over a generic one that also matches", () => {
    // "cebolla morada" must resolve to the purple-onion entry, not the
    // generic white-onion entry, even though "cebolla" alone matches both.
    const match = matchIngredient("Cebolla morada, en pluma fina");
    expect(match?.id).toBe("cebolla-morada");
  });

  it("still matches the generic entry when no specific keyword applies", () => {
    const match = matchIngredient("Cebolla, picada");
    expect(match?.id).toBe("cebolla-blanca");
  });

  it("is case-insensitive", () => {
    expect(matchIngredient("AJO PICADO")?.id).toBe("ajo");
  });

  it("returns null for a name with no catalog match", () => {
    expect(matchIngredient("Ingrediente totalmente inventado xyz")).toBeNull();
  });

  it("every catalog entry has at least one keyword", () => {
    for (const entry of INGREDIENT_CATALOG) {
      expect(entry.matchKeywords.length).toBeGreaterThan(0);
    }
  });

  it("every catalog entry has a positive researched or estimated price", () => {
    for (const entry of INGREDIENT_CATALOG) {
      expect(entry.priceCOP).toBeGreaterThan(0);
    }
  });
});
