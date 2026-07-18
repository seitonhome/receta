import type { Ingredient } from "@/lib/recipes/types";
import type { IngredientPrice } from "./ingredient-catalog";

/** Standard culinary volume conversions -- not market data, doesn't need a source. */
const VOLUME_ML: Record<string, number> = {
  cda: 15,
  cdas: 15,
  cucharada: 15,
  cucharadas: 15,
  cdta: 5,
  cdtas: 5,
  cucharadita: 5,
  cucharaditas: 5,
  taza: 240,
  tazas: 240,
  ml: 1,
};

/**
 * Rough average density (g/ml) used only to convert a volume measure (cda,
 * taza...) into grams when the ingredient is priced by weight -- e.g. 2
 * cdas of maicena. Powders/spices cluster fairly tightly around this value,
 * and the quantities involved are small enough that density error barely
 * moves the final cost. Not used when the recipe already gives grams.
 */
const POWDER_DENSITY_G_PER_ML = 0.55;

const HANDFUL_G = 30;
const PINCH_G = 0.3;
const BUNCH_G = 35;
/** Chopped fresh herb is light and loosely packed -- much less dense than a powder/spice. */
const HERB_DENSITY_G_PER_ML = 0.2;
const STALK_G = 10;
const SPRIG_G = 2;

function embeddedGramsPerUnit(unit: string): number | null {
  const match = unit.match(/\((\d+(?:\.\d+)?)\s*g/i);
  return match ? Number(match[1]) : null;
}

/** Returns the cost in COP of one ingredient line, or null if it can't be priced yet. */
export function convertIngredientCost(ingredient: Ingredient, price: IngredientPrice): number | null {
  if (price.priceCOP <= 0) return null;

  const unit = ingredient.unit.toLowerCase();
  const qty = ingredient.qty;

  // Per-count price (e.g. aguacate por unidad, atún por lata) -- no conversion needed.
  if (price.unit === "unidad" || price.unit === "lata" || price.unit === "botella" || price.unit === "caja") {
    return qty * price.priceCOP;
  }

  if (price.unit === "docena") {
    return (qty / 12) * price.priceCOP;
  }

  if (price.unit === "atado") {
    let grams: number;
    if (unit === "g") {
      grams = qty;
    } else if (unit in VOLUME_ML) {
      grams = qty * VOLUME_ML[unit] * HERB_DENSITY_G_PER_ML;
    } else if (unit === "tallo" || unit === "tallos") {
      grams = qty * STALK_G;
    } else if (unit === "ramita" || unit === "ramitas") {
      grams = qty * SPRIG_G;
    } else {
      grams = BUNCH_G;
    }
    return (grams / BUNCH_G) * price.priceCOP;
  }

  if (price.unit === "paquete") {
    if (unit === "g" && price.packageSizeG) {
      return (qty / price.packageSizeG) * price.priceCOP;
    }
    if (price.packageUnitCount) {
      return (qty / price.packageUnitCount) * price.priceCOP;
    }
    // No package-size data yet -- treat the count as "one package" worth,
    // the honest fallback until packageUnitCount/packageSizeG is set.
    return price.priceCOP * Math.max(1, qty / 10);
  }

  // From here, price.unit is "kg" or "l" -- both priced per 1000 of their base.
  const embeddedGrams = embeddedGramsPerUnit(unit);
  if (embeddedGrams) {
    return ((qty * embeddedGrams) / 1000) * price.priceCOP;
  }

  if (unit === "g") {
    return (qty / 1000) * price.priceCOP;
  }
  if (unit === "kg") {
    return qty * price.priceCOP;
  }
  if (unit === "l") {
    return qty * price.priceCOP;
  }
  if (unit in VOLUME_ML) {
    const ml = qty * VOLUME_ML[unit];
    if (price.unit === "l") {
      return (ml / 1000) * price.priceCOP;
    }
    const grams = ml * POWDER_DENSITY_G_PER_ML;
    return (grams / 1000) * price.priceCOP;
  }
  if (unit === "pizca") {
    return (PINCH_G / 1000) * price.priceCOP;
  }
  if (unit === "puñado" || unit === "punado") {
    return (HANDFUL_G / 1000) * price.priceCOP;
  }

  // Count-style units (diente, tallo, hoja, ramita, clara, rebanada...) with
  // no embedded weight: fall back to the catalog's average unit weight.
  if (price.avgUnitWeightG) {
    return ((qty * price.avgUnitWeightG) / 1000) * price.priceCOP;
  }

  return null;
}
