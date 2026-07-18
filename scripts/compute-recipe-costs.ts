/**
 * Recomputes each recipe's costPerServing from the real, sourced ingredient
 * catalog (src/lib/pricing/ingredient-catalog.ts) instead of the original
 * per-recipe guesses.
 *
 * Dry-run by default: prints a diff report. Pass --write to actually patch
 * costPerServing/costDate in the category data files.
 */
import { readFileSync, writeFileSync } from "fs";
import { recipes } from "../src/lib/recipes/data";
import { matchIngredient } from "../src/lib/pricing/match-ingredient";
import { convertIngredientCost } from "../src/lib/pricing/convert-cost";

const TODAY = "2026-07-17";
const WRITE = process.argv.includes("--write");

const FILE_BY_CATEGORY: Record<string, string> = {
  entrada: "src/lib/recipes/data/entradas.ts",
  almuerzo: "src/lib/recipes/data/almuerzos.ts",
  cena: "src/lib/recipes/data/cenas.ts",
  postre: "src/lib/recipes/data/postres.ts",
};

function roundCop(n: number): number {
  return Math.round(n / 100) * 100;
}

type Row = {
  slug: string;
  category: string;
  oldCost: number;
  newCost: number | null;
  coveragePct: number;
  unpriced: string[];
};

const rows: Row[] = [];

for (const recipe of recipes) {
  const content = recipe.content.es;
  if (!content) continue;

  let total = 0;
  let pricedLines = 0;
  const unpriced: string[] = [];

  for (const ing of content.ingredients) {
    const match = matchIngredient(ing.name);
    if (!match) {
      unpriced.push(`${ing.name} (sin coincidencia en catálogo)`);
      continue;
    }
    const cost = convertIngredientCost(ing, match);
    if (cost === null) {
      unpriced.push(`${ing.name} (${match.name}: precio aún no investigado)`);
      continue;
    }
    total += cost;
    pricedLines++;
  }

  const coveragePct = content.ingredients.length === 0 ? 0 : (pricedLines / content.ingredients.length) * 100;
  const newCost = coveragePct > 0 ? roundCop(total / recipe.baseServings) : null;

  rows.push({
    slug: recipe.slug,
    category: recipe.category,
    oldCost: recipe.costPerServing,
    newCost,
    coveragePct,
    unpriced,
  });
}

const lowCoverage = rows.filter((r) => r.coveragePct < 80);
const fullyUnpriced = rows.filter((r) => r.newCost === null);

console.log(`${rows.length} recetas procesadas.`);
console.log(`${rows.length - lowCoverage.length} con cobertura >= 80% de sus ingredientes.`);
console.log(`${lowCoverage.length} con cobertura < 80% (revisar antes de confiar en el número).`);
console.log(`${fullyUnpriced.length} sin ningún ingrediente con precio investigado todavía.\n`);

if (lowCoverage.length > 0) {
  console.log("-- Cobertura baja --");
  for (const r of lowCoverage) {
    console.log(`${r.slug}: ${r.coveragePct.toFixed(0)}% -- ${r.unpriced.join("; ")}`);
  }
  console.log("");
}

console.log("-- Comparación de costos (muestra de 15) --");
for (const r of rows.slice(0, 15)) {
  console.log(
    `${r.slug}: $${r.oldCost.toLocaleString("es-CO")} -> ${r.newCost !== null ? "$" + r.newCost.toLocaleString("es-CO") : "N/D"} (cobertura ${r.coveragePct.toFixed(0)}%)`
  );
}

if (!WRITE) {
  console.log("\nDry run -- nada se escribió. Corre con --write para aplicar los cambios a los archivos de datos.");
  process.exit(0);
}

console.log("\nEscribiendo cambios...");

for (const category of Object.keys(FILE_BY_CATEGORY)) {
  const filePath = FILE_BY_CATEGORY[category];
  let text = readFileSync(filePath, "utf-8");
  const categoryRows = rows.filter((r) => r.category === category && r.newCost !== null);

  for (const row of categoryRows) {
    const pattern = new RegExp(
      `("slug":\\s*"${row.slug}"[\\s\\S]{0,200}?"costPerServing":\\s*)\\d+([\\s\\S]{0,100}?"costDate":\\s*")[^"]*(")`
    );
    const next = text.replace(pattern, `$1${row.newCost}$2${TODAY}$3`);
    if (next === text) {
      console.warn(`No se pudo actualizar ${row.slug} en ${filePath} (patrón no encontrado)`);
    }
    text = next;
  }

  writeFileSync(filePath, text, "utf-8");
}

console.log("Listo.");
