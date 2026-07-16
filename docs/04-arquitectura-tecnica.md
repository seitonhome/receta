# Arquitectura técnica

## Stack

- **Frontend/Backend:** Next.js (App Router) + TypeScript, Server Actions/API Routes.
- **Estilos:** Tailwind CSS + componentes accesibles (Radix UI primitives o similar, sin librería de diseño pesada).
- **Datos:** Supabase (Postgres + Auth + Storage + RLS).
- **i18n:** `next-intl` (o equivalente), con contenido de receta separado de las cadenas de UI (ver modelo de datos).
- **Hosting:** Vercel.
- **PWA:** opcional, diferido a V2 para el modo offline completo; el manifest básico puede existir desde el MVP sin implicar soporte offline.
- **Analítica:** Plausible (o autohospedado), sin cookies de terceros ni tracking invasivo.
- **Caché:** caché de Next.js/Vercel para recetas y precios; caché de servidor obligatoria para cualquier llamada a Nominatim/Overpass en V2 (política de uso de OSM lo exige).

## Decisión de distribución con Hotmart

**Decisión:** sitio propio desplegado en Vercel, independiente del Club de Hotmart. Hotmart gestiona checkout y pago; al confirmarse la compra, un webhook de Hotmart (firma verificada) activa el acceso en la base de datos propia (tabla de compras + rol de usuario vinculado por correo).

**Alternativa descartada:** publicar el contenido directamente en el Club de Hotmart (Hotmart Club/Área de Miembros). Se descarta porque el Club no soporta de forma nativa: selector de tres idiomas con contenido relacional, recalculador de porciones interactivo, lista de compras persistente por usuario, planificador semanal, despensa virtual ni panel administrativo propio. Usar el Club habría significado renunciar a la experiencia "no es un PDF estático" que pide el brief (sección 2).

**Consecuencia:** se debe implementar manejo completo del ciclo de vida de la compra (confirmación, reembolso, cancelación, contracargo, cambio de correo) contra los eventos reales documentados por Hotmart — a consultar en su documentación oficial vigente antes de escribir el handler, sin inventar nombres de eventos ni payloads (regla de la sección 39).

## Techo de costo del MVP

Operar con los tiers gratuitos de Supabase y Vercel; ninguna API de pago activa en el MVP (mapas y precios en vivo quedan en V2). Ver desglose de costos en `05-apis-costos-riesgos.md`.

## Modelo de datos inicial

Modelo relacional, con **receta base + tablas de traducción** (no se duplica lógica de negocio por idioma). Entidades principales y relaciones clave:

| Entidad | Propósito | Relaciones clave |
|---|---|---|
| `users` | Usuarios de la app (Supabase Auth) | 1—N con `favorites`, `shopping_lists`, `pantry_items`, `weekly_plans`, `purchases` |
| `countries`, `cities` | Localización geográfica | `cities` → `countries` |
| `currencies` | Monedas soportadas (COP, MXN, USD, CAD, EUR, GBP...) | referenciada por `price_entries`, `recipe_costs` |
| `languages` | ES/EN/FR (extensible) | referenciada por todas las tablas `*_translations` |
| `recipes` | Receta base (datos no traducibles: categoría, tiempos, dificultad, imagen, etiquetas, nutrición, costo) | 1—N `recipe_translations`, `recipe_ingredients`, `recipe_versions` |
| `recipe_translations` | Nombre, descripción, pasos, consejos, notas por idioma | N—1 `recipes`, N—1 `languages` |
| `recipe_versions` | Historial de cambios de una receta (para política de actualización, sección 26) | N—1 `recipes` |
| `categories` | Entrada/tapa, almuerzo, cena, postre + subtipos | referenciada por `recipes` |
| `ingredients` | Ingrediente base (unidad estándar, densidad si aplica) | 1—N `ingredient_translations`, `ingredient_local_names` |
| `ingredient_translations` | Nombre por idioma | N—1 `ingredients`, N—1 `languages` |
| `ingredient_local_names` | Variante por país (aguacate/avocado/avocat) | N—1 `ingredients`, N—1 `countries` |
| `units` | Unidades de medida y factores de conversión | referenciada por `recipe_ingredients`, `price_entries` |
| `recipe_ingredients` | Cantidad de cada ingrediente en una receta (para una porción base) | N—1 `recipes`, N—1 `ingredients`, N—1 `units` |
| `substitutions` | Sustituciones por objetivo (sección 20) | N—1 `ingredients` (original y alternativa) |
| `tags` | Etiquetas/filtros (sección 10) | N—N con `recipes` vía `recipe_tags` |
| `allergens` | Alérgenos frecuentes | N—N con `recipes` vía `recipe_allergens` |
| `nutrition_facts` | Valores nutricionales por receta/porción + fuente (USDA/Edamam/estimado) | N—1 `recipes` |
| `price_sources` | Precio de un ingrediente en un país/ciudad, con fecha, moneda, confiabilidad, estado (aprobado/pendiente/rechazado) y origen (admin/usuario) | N—1 `ingredients`, N—1 `countries`/`cities`, N—1 `currencies`, N—1 `users` (si es aporte de usuario) |
| `stores` | Tiendas sugeridas (texto genérico en MVP; V2 añade ubicación real) | N—1 `cities` |
| `favorites` | Recetas favoritas por usuario | N—1 `users`, N—1 `recipes` |
| `shopping_lists`, `shopping_list_items` | Listas de compra | N—1 `users`; items N—1 `ingredients` |
| `weekly_plans` (V1.1) | Plan semanal por usuario | N—1 `users`, N—N `recipes` |
| `pantry_items` (V1.1) | Despensa virtual | N—1 `users`, N—1 `ingredients` |
| `view_history` (V1.1) | Historial de recetas vistas | N—1 `users`, N—1 `recipes` |
| `hotmart_purchases` | Registro de compras/eventos de Hotmart | N—1 `users` |
| `coupons` | Cupones (si aplica) | N—N `hotmart_purchases` |
| `app_config` | Configuración central (nombre de marca, flags de fase) | tabla única, sin relaciones |
| `legal_content` | Textos legales por idioma | N—1 `languages` |
| `bug_reports`, `support_requests` | Reportes y soporte | N—1 `users` (opcional) |

Las migraciones SQL concretas se entregan en la ejecución de Fase 3 (no en esta respuesta de estrategia), junto con las políticas RLS por rol (usuario, admin, servicio).
