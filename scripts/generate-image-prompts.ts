/**
 * Generates one AI-image prompt per recipe from existing structured data
 * (title, top ingredients, category), and writes them to a reference doc.
 * This does NOT generate actual images -- there's no image-generation tool
 * wired into this pipeline yet; these prompts are meant to be fed into
 * whatever image generator gets chosen for Fase 5 content production.
 */
import { writeFileSync } from "fs";
import { recipes } from "../src/lib/recipes/data";

const CATEGORY_LABEL: Record<string, string> = {
  entrada: "appetizer/starter",
  almuerzo: "hearty lunch",
  cena: "light dinner",
  postre: "dessert",
};

function buildPrompt(r: (typeof recipes)[number]): string {
  const c = r.content.es!;
  const topIngredients = c.ingredients
    .slice(0, 4)
    .map((i) => i.name.split(/[,(]/)[0].trim())
    .join(", ");
  const portionNote =
    r.category === "cena"
      ? "a modest, light dinner portion"
      : r.category === "almuerzo"
        ? "a generous, hearty lunch portion"
        : r.category === "postre"
          ? "a single dessert portion"
          : "a small appetizer portion";

  return (
    `Editorial food photography style illustration of ${c.title} (${CATEGORY_LABEL[r.category]}), ` +
    `featuring ${topIngredients}, styled with warm natural light, on ceramic tableware with a linen napkin ` +
    `in soft focus background, shallow depth of field, ${portionNote}, realistic and appetizing, ` +
    `no text, no hands, no logos.`
  );
}

const lines: string[] = [];
lines.push("# Prompts de imagen — 100 recetas");
lines.push("");
lines.push(
  "Generados a partir de los datos estructurados de cada receta (título, ingredientes principales, categoría). **No son imágenes generadas** — este proyecto no tiene un generador de imágenes conectado; estos prompts quedan listos para alimentar el servicio de generación de imágenes que se elija en la Fase 5 (ver docs/05-apis-costos-riesgos.md). El alt text de cada imagen (en los 3 idiomas) ya vive en el campo `imageAlt` de cada receta en el código."
);
lines.push("");

const byCategory: Record<string, typeof recipes> = { entrada: [], almuerzo: [], cena: [], postre: [] };
for (const r of recipes) byCategory[r.category].push(r);

const CATEGORY_TITLE: Record<string, string> = {
  entrada: "Entradas y tapas",
  almuerzo: "Almuerzos",
  cena: "Cenas",
  postre: "Postres",
};

for (const cat of ["entrada", "almuerzo", "cena", "postre"] as const) {
  lines.push(`## ${CATEGORY_TITLE[cat]} (${byCategory[cat].length})`);
  lines.push("");
  for (const r of byCategory[cat]) {
    lines.push(`### ${r.content.es!.title}`);
    lines.push(`- **slug**: \`${r.slug}\``);
    lines.push(`- **prompt**: ${buildPrompt(r)}`);
    lines.push(`- **alt (es)**: ${r.imageAlt.es}`);
    lines.push("");
  }
}

writeFileSync("./docs/10-prompts-imagenes-100-recetas.md", lines.join("\n"));

const jsonPrompts = recipes.map((r) => ({
  slug: r.slug,
  category: r.category,
  prompt: buildPrompt(r),
  alt: r.imageAlt,
}));
writeFileSync("./content/image-prompts.json", JSON.stringify(jsonPrompts, null, 2));

console.log("Wrote docs/10-prompts-imagenes-100-recetas.md and content/image-prompts.json with", recipes.length, "prompts");
