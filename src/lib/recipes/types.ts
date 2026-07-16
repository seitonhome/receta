export type Locale = "es" | "en" | "fr";

export type Ingredient = {
  name: string;
  qty: number;
  /** Display unit. Whole-count units (e.g. "unidad", "diente") get half-step
   * rounding when scaled; everything else gets fraction/step rounding. */
  unit: string;
  countUnit?: boolean;
};

export type RecipeContent = {
  eyebrow: string;
  title: string;
  blurb: string;
  cuisine: string;
  prep: string;
  cook: string;
  total: string;
  difficulty: string;
  ingredients: Ingredient[];
  ingredientsStatic?: string;
  steps: string[];
  tips: string;
  mistakes: string;
  substitutions: string;
  storage: string;
  pairing: string;
  versions: string;
  allergen: string;
  nutrition: [string, string][];
  nutriSource: string;
  costStores: string;
  costRefLocation: string;
  tags: string[];
  note: string;
};

export type Recipe = {
  slug: string;
  category: "entrada" | "almuerzo" | "cena" | "postre";
  baseServings: number;
  costPerServing: number;
  costCurrency: string;
  costDate: string;
  /** Three colors used to paint the abstract editorial placeholder image. */
  plateColors: [string, string, string];
  imageAlt: Record<Locale, string>;
  content: Record<Locale, RecipeContent | null>;
};
