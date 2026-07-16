# Comidas que te Cuidan / Meals that Care / Des Repas qui Prennent Soin

Ebook web interactivo, multilingüe (ES/EN/FR) y premium con 100 recetas originales, vendido por Hotmart. Este repositorio se construye por fases; **no** se genera todo de una vez (ver `docs/06-plan-fases.md`).

## Estado actual

Fase 1 (estrategia) entregada. Fase 3 (arquitectura) y Fase 4 (prototipo) construidas: app Next.js real corriendo (`npm run dev`), con idiomas, recalculador de porciones y autenticación funcionando. **Fase 5 (contenido) completa: las 100 recetas están escritas y traducidas a español, inglés y francés** en `src/lib/recipes/data/` — ver `docs/09-manifiesto-100-recetas.md`. Corre `npm run validate:recipes` para el chequeo de calidad automatizado (sección 33 del brief). También hay un PDF de presentación comercial en `marketing/`.

Lo que falta de Fase 5/6, en orden:

- [ ] Auditoría editorial humana de las 100 recetas y sus traducciones (el chequeo automatizado + revisión por muestreo no reemplaza una lectura completa real)
- [ ] Generar las imágenes reales de las 100 recetas a partir de los prompts en `docs/10-prompts-imagenes-100-recetas.md` (no hay generador de imágenes conectado a este proyecto)
- [ ] Precios reales por país (hoy todo está en COP, referencia Bogotá — falta MXN/USD/CAD/EUR/GBP, requiere la tabla `price_sources` con datos reales, no inventados)

Pendiente de tu confirmación:

- [ ] Confirmar clasificación MVP / V1.1 / V2 (`docs/03-mapa-funcionalidades.md`)
- [ ] Confirmar nombre final entre los 15 candidatos (`docs/01-fase1-estrategia.md` §4) y verificar disponibilidad real de dominio/marca
- [ ] Decidir si se activa una fuente secundaria de datos nutricionales (Edamam/Nutritionix) o solo USDA FoodData Central

Pendiente técnico (no depende de ti, pero bloquea que la autenticación y el acceso vía Hotmart funcionen de verdad):

- [ ] Crear un proyecto real de Supabase y llenar `.env.local` a partir de `.env.example`
- [ ] Ejecutar `supabase/migrations/0001_auth_and_purchases.sql` contra ese proyecto
- [ ] Ajustar la plantilla de correo de "enlace mágico" en el panel de Supabase (pasos exactos en `docs/08-autenticacion-y-acceso.md`)
- [ ] Calibrar `src/app/api/webhooks/hotmart/route.ts` contra un payload real de Hotmart (su documentación no fue accesible desde este entorno — ver el mismo doc)

## Índice de documentación

| Doc | Contenido |
|---|---|
| [docs/01-fase1-estrategia.md](docs/01-fase1-estrategia.md) | Resumen ejecutivo, propuesta de valor, perfiles de comprador, nombres candidatos, distribución de las 100 recetas |
| [docs/02-sitemap.md](docs/02-sitemap.md) | Mapa de páginas y secciones, etiquetado MVP/V1.1/V2 |
| [docs/03-mapa-funcionalidades.md](docs/03-mapa-funcionalidades.md) | Todas las funciones del brief, clasificadas por fase |
| [docs/04-arquitectura-tecnica.md](docs/04-arquitectura-tecnica.md) | Stack, decisión de distribución con Hotmart, modelo de datos inicial |
| [docs/05-apis-costos-riesgos.md](docs/05-apis-costos-riesgos.md) | APIs necesarias, costo mensual estimado del MVP, riesgos técnicos y legales |
| [docs/06-estrategias.md](docs/06-estrategias.md) | Estrategia de precios por ubicación, tiendas cercanas (V2), traducción, integración con Hotmart |
| [docs/07-plan-fases.md](docs/07-plan-fases.md) | Plan de desarrollo por fases con criterios de aceptación |
| [docs/08-autenticacion-y-acceso.md](docs/08-autenticacion-y-acceso.md) | Cómo entra la gente al sitio: enlace mágico + acceso vinculado a la compra en Hotmart, y qué falta configurar en Supabase |
| [docs/09-manifiesto-100-recetas.md](docs/09-manifiesto-100-recetas.md) | Lista completa de las 100 recetas (nombre, categoría, proteína, cocina) y estado de generación |

## Recetas (Fase 4 + 5)

`src/lib/recipes/data/` (`entradas.ts`, `almuerzos.ts`, `cenas.ts`, `postres.ts`) contiene las **100 recetas completas, en español, inglés y francés** — 15 entradas, 35 almuerzos, 35 cenas, 15 postres — con la estructura de campos de la sección 8 del brief y traducción profesional (no automática) en los tres idiomas. Es la fuente de verdad que usa la app; ya no se mantienen en paralelo los archivos Markdown de `content/recipes/pilot/` de la primera entrega (siguen ahí como referencia histórica de la Fase 4, pero el contenido vivo está en `data/`).

`npm run validate:recipes` corre el chequeo automatizado: slugs/títulos/notas únicos, sin frases médicas o de culpa prohibidas por la sección 34 del brief, todo campo de texto presente, y una revisión heurística de que ninguna cena use fritura profunda o salsas pesadas.

## Presentación comercial

`marketing/comidas-que-te-cuidan-presentacion-comercial.pdf` — documento de 8 páginas para mostrar a clientes/distribuidores: propuesta de valor, qué incluye, diferenciadores, muestra de una receta real, perfiles de comprador, cómo funciona y FAQ. El precio de lanzamiento y el enlace de Hotmart se dejaron explícitamente en blanco — son decisiones de negocio pendientes, no datos para inventar. Fuente editable en `marketing/presentacion-comercial.html`.
