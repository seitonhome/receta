import { describe, it, expect } from "vitest";
import { categorizeIngredient } from "./categorize";

describe("categorizeIngredient", () => {
  it.each([
    ["Pechuga de pollo", "proteinas"],
    ["Yogur griego natural", "lacteos"],
    ["Garbanzos cocidos", "legumbres"],
    ["Arroz integral", "granos-y-cereales"],
    ["Comino molido", "especias"],
    ["Aceite de oliva", "despensa"],
    ["Tomate maduro", "frutas-y-verduras"],
  ] as const)("classifies %s as %s", (name, expected) => {
    expect(categorizeIngredient(name)).toBe(expected);
  });

  it("falls back to otros for something unrecognized", () => {
    expect(categorizeIngredient("Ingrediente misterioso")).toBe("otros");
  });

  it("checks protein/dairy/legume rules before the generic produce rule", () => {
    // Arveja could plausibly read as a vegetable, but the legume rule should
    // win so it sorts next to other dried legumes on the list.
    expect(categorizeIngredient("Arveja seca")).toBe("legumbres");
  });
});
