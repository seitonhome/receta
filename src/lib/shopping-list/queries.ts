import { createClient } from "@/lib/supabase/server";
import type { ShoppingCategory } from "./categorize";

export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: ShoppingCategory;
  checked: boolean;
  recipe_slug: string | null;
};

export async function getShoppingListItems(): Promise<ShoppingListItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("shopping_list_items")
    .select("id, name, quantity, unit, category, checked, recipe_slug")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (data ?? []) as ShoppingListItem[];
}
