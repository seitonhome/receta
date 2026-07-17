import { createClient } from "@/lib/supabase/server";

export async function getFavoriteSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("favorites").select("recipe_slug").eq("user_id", user.id);
  return (data ?? []).map((row) => row.recipe_slug);
}

export async function isFavorited(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_slug", slug)
    .maybeSingle();
  return Boolean(data);
}
