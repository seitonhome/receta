import { recipes } from "../src/lib/recipes/data";
import { matchIngredient } from "../src/lib/pricing/match-ingredient";

const unmatched = new Map<string, number>();
let totalLines = 0;
let matchedLines = 0;

for (const r of recipes) {
  const content = r.content.es;
  if (!content) continue;
  for (const ing of content.ingredients) {
    totalLines++;
    const match = matchIngredient(ing.name);
    if (match) {
      matchedLines++;
    } else {
      const key = ing.name.trim().toLowerCase();
      unmatched.set(key, (unmatched.get(key) ?? 0) + 1);
    }
  }
}

console.log(`Matched ${matchedLines}/${totalLines} ingredient lines (${((matchedLines / totalLines) * 100).toFixed(1)}%)`);
console.log(`${unmatched.size} unique unmatched names:\n`);

const sorted = [...unmatched.entries()].sort((a, b) => b[1] - a[1]);
for (const [name, count] of sorted) {
  console.log(`${count}\t${name}`);
}
