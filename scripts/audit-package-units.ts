import { recipes } from "../src/lib/recipes/data";
import { matchIngredient } from "../src/lib/pricing/match-ingredient";

const VOLUME_UNITS = new Set(["cda", "cdas", "cucharada", "cucharadas", "cdta", "cdtas", "cucharadita", "cucharaditas", "taza", "tazas", "ml"]);

const seen = new Set<string>();

for (const r of recipes) {
  const content = r.content.es;
  if (!content) continue;
  for (const ing of content.ingredients) {
    const match = matchIngredient(ing.name);
    if (!match) continue;
    const unit = ing.unit.toLowerCase();
    const isGram = unit === "g";
    const isVolume = VOLUME_UNITS.has(unit);

    if (["lata", "botella", "caja"].includes(match.unit)) {
      const hasFallback = (isGram && match.packageSizeG) || (isVolume && match.packageSizeMl);
      if ((isGram || isVolume) && !hasFallback) {
        const key = `${match.id}|${unit}`;
        if (!seen.has(key)) {
          seen.add(key);
          console.log(`RIESGO: ${match.name} (${match.id}) precio por "${match.unit}" pero receta "${r.slug}" da "${ing.name}" en unidad "${unit}" sin packageSizeG/packageSizeMl`);
        }
      }
    }

    if (match.unit === "unidad") {
      const hasFallback = isGram && match.avgUnitWeightG;
      if (isGram && !hasFallback) {
        const key = `${match.id}|${unit}`;
        if (!seen.has(key)) {
          seen.add(key);
          console.log(`RIESGO: ${match.name} (${match.id}) precio por "unidad" pero receta "${r.slug}" da "${ing.name}" en gramos sin avgUnitWeightG`);
        }
      }
    }

    if (match.unit === "docena") {
      if (isGram || isVolume) {
        const key = `${match.id}|${unit}`;
        if (!seen.has(key)) {
          seen.add(key);
          console.log(`RIESGO: ${match.name} (${match.id}) precio por "docena" pero receta "${r.slug}" da "${ing.name}" en "${unit}" (no manejado)`);
        }
      }
    }
  }
}

if (seen.size === 0) console.log("Sin riesgos detectados.");
