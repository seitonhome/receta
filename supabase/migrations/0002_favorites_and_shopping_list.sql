-- Fase 4: favoritos y lista de compras. Ambos son datos puramente
-- personales -- a diferencia de `purchases`, aquí un usuario autenticado
-- SÍ puede escribir directamente sus propias filas (nunca las de nadie
-- más), así que estas políticas cubren select/insert/update/delete.

-- ---------------------------------------------------------------------------
-- favorites: una fila por (usuario, receta). `recipe_slug` no tiene FK
-- porque las recetas viven en código (src/lib/recipes/data), no en la BD.
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_slug)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);

alter table public.favorites enable row level security;

drop policy if exists "favorites are managed by their owner" on public.favorites;
create policy "favorites are managed by their owner"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- shopping_list_items: cada renglón de la lista de compras de un usuario.
-- `recipe_slug` es opcional (null cuando el ítem se agregó a mano). La
-- combinación de duplicados (mismo ingrediente + unidad, no comprado
-- todavía) se resuelve en la aplicación con un upsert manual, no aquí.
-- ---------------------------------------------------------------------------
create table if not exists public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  quantity numeric,
  unit text,
  category text not null default 'otros',
  checked boolean not null default false,
  recipe_slug text,
  created_at timestamptz not null default now()
);

create index if not exists shopping_list_items_user_id_idx on public.shopping_list_items (user_id);

alter table public.shopping_list_items enable row level security;

drop policy if exists "shopping list items are managed by their owner" on public.shopping_list_items;
create policy "shopping list items are managed by their owner"
  on public.shopping_list_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
