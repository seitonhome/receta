export const SHOPPING_CATEGORIES = [
  "frutas-y-verduras",
  "proteinas",
  "lacteos",
  "granos-y-cereales",
  "legumbres",
  "especias",
  "despensa",
  "congelados",
  "otros",
] as const;

export type ShoppingCategory = (typeof SHOPPING_CATEGORIES)[number];

// Keyword match against the ingredient name, in order -- first match wins.
// Deliberately simple (no ingredient database yet): good enough to sort a
// list at a glance, not meant to be perfect for every phrasing.
const RULES: [ShoppingCategory, RegExp][] = [
  [
    "proteinas",
    /pollo|pavo|res|cerdo|carne|pescado|salmón|salmon|atún|atun|camar[oó]n|mejill[oó]n|pulpo|huevo|tofu|tempeh|bacalao|trucha|tilapia|merluza|tocino|jam[oó]n|chorizo/i,
  ],
  [
    "lacteos",
    /yogur|queso|leche|crema de leche|mantequilla|mascarpone|parmesano|feta/i,
  ],
  [
    "legumbres",
    /frijol|garbanzo|lenteja|haba|arveja(?! verde fresca)|edamame/i,
  ],
  [
    "granos-y-cereales",
    /arroz|cuscús|cuscus|quinoa|pasta|espagueti|avena|pan\b|tortilla|harina|granola/i,
  ],
  [
    "especias",
    /comino|cúrcuma|curcuma|canela|pimentón|pimenton|jengibre|orégano|oregano|especia|sal\b|pimienta|vainilla|azafrán|azafran|cayena/i,
  ],
  [
    "congelados",
    /congelad/i,
  ],
  [
    "despensa",
    /aceite|vinagre|az[uú]car|panela|miel|cacao|chocolate|caldo|salsa de soya|tahini|mostaza|mayonesa|harina|polvo de hornear|bicarbonato|levadura/i,
  ],
  [
    "frutas-y-verduras",
    /tomate|cebolla|ajo|pimiento|zanahoria|papa|batata|camote|calabac[ií]n|calabaza|espinaca|lechuga|col|repollo|br[oó]coli|coliflor|pepino|lim[oó]n|lima|manzana|pl[aá]tano|banano|mango|pera|fresa|arándano|arandano|aguacate|cilantro|perejil|albahaca|menta|hierbabuena|apio|champiñ[oó]n|champinon|elote|ma[íi]z|jengibre fresco/i,
  ],
];

export function categorizeIngredient(name: string): ShoppingCategory {
  for (const [category, pattern] of RULES) {
    if (pattern.test(name)) return category;
  }
  return "otros";
}
