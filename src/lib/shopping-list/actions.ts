"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorizeIngredient } from "./categorize";

export type AddIngredientInput = {
  name: string;
  quantity: number;
  unit: string;
};

const LIST_PATH = "/[locale]/lista-de-compras";

export async function addIngredientsToList(
  items: AddIngredientInput[],
  recipeSlug?: string
): Promise<{ added: number } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not-authenticated" };
  if (items.length === 0) return { added: 0 };

  // Combine with an existing, not-yet-checked row for the same ingredient
  // + unit instead of creating a duplicate line every time a recipe is
  // added again.
  const { data: existingRows } = await supabase
    .from("shopping_list_items")
    .select("id, name, unit, quantity, checked")
    .eq("user_id", user.id)
    .eq("checked", false);

  const existingByKey = new Map(
    (existingRows ?? []).map((row) => [`${row.name.toLowerCase()}::${(row.unit ?? "").toLowerCase()}`, row])
  );

  const toInsert: {
    user_id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    recipe_slug: string | null;
  }[] = [];

  for (const item of items) {
    const key = `${item.name.toLowerCase()}::${item.unit.toLowerCase()}`;
    const existing = existingByKey.get(key);
    if (existing) {
      const { error } = await supabase
        .from("shopping_list_items")
        .update({ quantity: (existing.quantity ?? 0) + item.quantity })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      toInsert.push({
        user_id: user.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: categorizeIngredient(item.name),
        recipe_slug: recipeSlug ?? null,
      });
    }
  }

  if (toInsert.length > 0) {
    const { error } = await supabase.from("shopping_list_items").insert(toInsert);
    if (error) return { error: error.message };
  }

  revalidatePath(LIST_PATH, "page");
  return { added: items.length };
}

export async function addManualItem(
  name: string,
  quantity: string,
  unit: string
): Promise<{ added: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not-authenticated" };
  if (!name.trim()) return { error: "empty-name" };

  const parsedQuantity = quantity.trim() ? Number(quantity) : null;

  const { error } = await supabase.from("shopping_list_items").insert({
    user_id: user.id,
    name: name.trim(),
    quantity: Number.isFinite(parsedQuantity) ? parsedQuantity : null,
    unit: unit.trim() || null,
    category: categorizeIngredient(name),
  });
  if (error) return { error: error.message };

  revalidatePath(LIST_PATH, "page");
  return { added: true };
}

export async function toggleListItem(id: string, checked: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("shopping_list_items")
    .update({ checked })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath(LIST_PATH, "page");
}

export async function updateListItemQuantity(id: string, quantity: number | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("shopping_list_items")
    .update({ quantity })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath(LIST_PATH, "page");
}

export async function removeListItem(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("shopping_list_items").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath(LIST_PATH, "page");
}

export async function clearCheckedItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("shopping_list_items")
    .delete()
    .eq("user_id", user.id)
    .eq("checked", true);
  revalidatePath(LIST_PATH, "page");
}
