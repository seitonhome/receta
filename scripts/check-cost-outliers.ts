import { recipes } from "../src/lib/recipes/data";
import { matchIngredient } from "../src/lib/pricing/match-ingredient";
import { convertIngredientCost } from "../src/lib/pricing/convert-cost";

function roundCop(n: number) {
  return Math.round(n / 100) * 100;
}

const results = recipes.map((r) => {
  const content = r.content.es!;
  let total = 0;
  for (const ing of content.ingredients) {
    const match = matchIngredient(ing.name);
    if (!match) continue;
    const cost = convertIngredientCost(ing, match);
    if (cost !== null) total += cost;
  }
  return { slug: r.slug, old: r.costPerServing, new: roundCop(total / r.baseServings) };
});

results.sort((a, b) => b.new - a.new);
console.log("-- 10 más caras --");
for (const r of results.slice(0, 10)) console.log(`${r.slug}: $${r.old} -> $${r.new}`);
console.log("\n-- 10 más baratas --");
for (const r of results.slice(-10)) console.log(`${r.slug}: $${r.old} -> $${r.new}`);

const ratios = results.map((r) => ({ ...r, ratio: r.new / r.old }));
ratios.sort((a, b) => b.ratio - a.ratio);
console.log("\n-- Mayor cambio proporcional vs el número anterior --");
for (const r of ratios.slice(0, 10)) console.log(`${r.slug}: $${r.old} -> $${r.new} (x${r.ratio.toFixed(1)})`);
