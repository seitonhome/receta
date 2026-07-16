/**
 * QC pass for the recipe catalog (brief section 33). Run with:
 *   npm run validate:recipes
 *
 * Catches hard problems (duplicate slugs/titles/notes, banned phrases,
 * missing content) as errors, and flags things worth a human look (an
 * ingredient that doesn't obviously appear in the steps, a "cena" mentioning
 * a heavy-cooking keyword) as warnings -- these have real false positives
 * (e.g. a step listing ingredients collectively as "las verduras", or a step
 * saying "no uses mantequilla" to warn *against* butter), so warnings are
 * for review, not a hard fail.
 */
import { recipes } from "../src/lib/recipes/data";

const BANNED = [
  "comida limpia",
  "alimento prohibido",
  "día trampa",
  "quema grasa",
  "desintoxica",
  "cura la diabetes",
  "no genera insulina",
  "cero culpa",
];

let errors = 0;
let warnings = 0;

function err(msg: string) {
  errors++;
  console.log("ERROR:", msg);
}
function warn(msg: string) {
  warnings++;
  console.log("WARN: ", msg);
}

console.log("Total recipes:", recipes.length);
const byCategory: Record<string, number> = {};
for (const r of recipes) byCategory[r.category] = (byCategory[r.category] ?? 0) + 1;
console.log("By category:", byCategory);

const slugCounts = new Map<string, number>();
for (const r of recipes) slugCounts.set(r.slug, (slugCounts.get(r.slug) ?? 0) + 1);
for (const [slug, count] of slugCounts) if (count > 1) err(`Duplicate slug "${slug}" (${count}x)`);

const titleCounts = new Map<string, number>();
for (const r of recipes) {
  const title = r.content.es?.title ?? "";
  titleCounts.set(title, (titleCounts.get(title) ?? 0) + 1);
}
for (const [title, count] of titleCounts) if (count > 1) err(`Duplicate title "${title}" (${count}x)`);

const noteCounts = new Map<string, number>();
for (const r of recipes) {
  const note = r.content.es?.note ?? "";
  noteCounts.set(note, (noteCounts.get(note) ?? 0) + 1);
}
for (const [note, count] of noteCounts) if (count > 1) err(`Duplicate note (${count}x): "${note}"`);

const HEAVY_KEYWORDS = [
  /\bfritos?\b/,
  /\bfritas?\b/,
  /\bempanizado\b/,
  /\brebozado\b/,
  /\bmantequilla\b/,
  /\bcrema de leche\b/,
  /\bqueso fundido\b/,
];

for (const r of recipes) {
  const c = r.content.es;
  if (!c) {
    err(`${r.slug}: content.es is missing`);
    continue;
  }
  const fullText = JSON.stringify(c).toLowerCase();
  for (const phrase of BANNED) {
    if (fullText.includes(phrase)) err(`${r.slug}: contains banned phrase "${phrase}"`);
  }
  if (c.nutrition.length !== 7) warn(`${r.slug}: nutrition has ${c.nutrition.length} rows, expected 7`);
  if (r.costPerServing <= 0) err(`${r.slug}: costPerServing <= 0`);
  if (c.ingredients.length < 3) warn(`${r.slug}: only ${c.ingredients.length} ingredients`);
  if (c.steps.length < 3) warn(`${r.slug}: only ${c.steps.length} steps`);
  if (c.tags.length < 2) warn(`${r.slug}: only ${c.tags.length} tags`);
  const requiredProse: (keyof typeof c)[] = [
    "tips",
    "mistakes",
    "substitutions",
    "storage",
    "pairing",
    "versions",
    "allergen",
    "blurb",
    "note",
  ];
  for (const field of requiredProse) {
    const value = c[field];
    if (typeof value !== "string" || value.trim().length < 10) {
      err(`${r.slug}: field "${field}" is missing or too short`);
    }
  }

  const stepsText = c.steps.join(" ").toLowerCase();
  for (const ing of c.ingredients) {
    const firstWord = ing.name.split(/[,(]/)[0].trim().split(" ")[0].toLowerCase();
    if (firstWord.length > 3 && !stepsText.includes(firstWord)) {
      warn(`${r.slug}: ingredient "${ing.name}" (keyword "${firstWord}") not found in steps text`);
    }
  }

  if (r.category === "cena") {
    for (const re of HEAVY_KEYWORDS) {
      if (re.test(fullText)) {
        warn(`${r.slug} (cena): matches /${re.source}/ — review manually (may be a "don't use X" negation)`);
      }
    }
  }
}

console.log(`\n${errors} errors, ${warnings} warnings.`);
if (errors > 0) process.exit(1);
