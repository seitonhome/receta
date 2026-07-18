import { recipes } from "../src/lib/recipes/data";
import { matchIngredient } from "../src/lib/pricing/match-ingredient";
import { convertIngredientCost } from "../src/lib/pricing/convert-cost";

const slug = process.argv[2];
const recipe = recipes.find((r) => r.slug === slug);
if (!recipe) {
  console.log("not found");
  process.exit(1);
}
const content = recipe.content.es!;
for (const ing of content.ingredients) {
  const match = matchIngredient(ing.name);
  const cost = match ? convertIngredientCost(ing, match) : null;
  console.log(
    `${ing.name} | qty=${ing.qty} unit=${ing.unit} | -> ${match?.name ?? "SIN MATCH"} (${match?.priceCOP}/${match?.unit}) | costo=${cost !== null ? Math.round(cost) : "null"}`
  );
}
