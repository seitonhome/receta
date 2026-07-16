# Fase 1 — Estrategia

## 1. Resumen ejecutivo

"Comidas que te Cuidan" es un ebook web interactivo y multilingüe (ES/EN/FR) con 100 recetas originales, fáciles y saludables, organizadas en entradas/tapas, almuerzos, cenas y postres. No es un PDF: es una aplicación web premium con recalculador de porciones, lista de compras, favoritos, precios estimados por país y (a partir de V1.1) planificador semanal y despensa virtual. Se vende como producto digital a través de Hotmart, con acceso gestionado por webhook en un sitio propio (no en el Club de Hotmart), lo que permite ofrecer una experiencia multilingüe y funcional que el Club no soporta de forma nativa.

El criterio diferencial frente a otros ebooks de recetas "saludables" es doble: (1) coherencia nutricional según el momento del día — un almuerzo puede ser contundente, una cena debe ser ligera y de fácil digestión — y (2) tono editorial de acompañamiento, no de dieta restrictiva: sin culpa, sin alimentos "prohibidos", sin promesas médicas.

## 2. Propuesta de valor

Para alguien que quiere comer mejor sin volverse experto en nutrición ni sacrificar el placer de comer, "Comidas que te Cuidan" ofrece 100 recetas reales (no genéricas de blog) con información nutricional honesta, costo estimado transparente, y herramientas prácticas (recalculador de porciones, lista de compras, planificador) que resuelven la fricción real de cocinar saludable: no saber cuánto cuesta, no saber si una receta es apropiada para la cena o el almuerzo, y no tener tiempo para planear.

Diferenciadores frente a la competencia (ebooks de recetas en Hotmart, blogs de nutrición, apps de meal-planning):
- Multilingüe real (traducción profesional, no automática) con localización de ingredientes y monedas, no solo texto traducido.
- Coherencia horaria explícita: ninguna receta de cena es pesada o frita.
- Transparencia de costos por porción, con fuente y fecha de actualización declaradas — no cifras inventadas.
- Tono cálido y no clínico, validado editorialmente para evitar lenguaje de culpa o promesas médicas.
- Producto vivo: los compradores reciben actualizaciones de contenido sin costo adicional (sección 26 del brief).

## 3. Cinco perfiles de comprador

1. **Adulto con prediabetes o glucosa alterada, sin ser un caso clínico severo.** Busca recetas ricas en fibra y proteína que no se sientan "de hospital". Le importa mucho que ninguna receta sea presentada como que "cura" o "controla" su condición — quiere información responsable, no promesas.
2. **Padre/madre que cocina para la familia entre semana.** Prioriza recetas rápidas, de una sola olla/bandeja, económicas y que gusten a niños sin ser ultraprocesadas. Usa mucho la lista de compras y el planificador semanal (V1.1).
3. **Profesional ocupado que come fuera casi todos los días entre semana.** Quiere cenas ligeras rápidas (<30 min) que no le pesen para dormir, y almuerzos de fin de semana para preparar con anticipación (meal prep).
4. **Persona vegetariana/vegana que busca variedad real, no solo ensaladas.** Le interesa que las opciones vegetales tengan protagonismo en almuerzo y cena, no solo como "opción alternativa" al final.
5. **Persona con presupuesto ajustado que quiere comer saludable sin gastar de más.** Usa activamente el costo estimado por receta y por porción, y las versiones económicas de cada receta (campo 23 de la estructura de receta).

## 4. Quince nombres candidatos

Nombre elegido para la familia trilingüe del producto: **"Comidas que te Cuidan"** (ES) / **"Meals that Care"** (EN) / **"Des Repas qui Prennent Soin"** (FR). Se descarta "Cenas que te cuidan" porque el producto ya cubre entradas, almuerzos, cenas y postres, no solo cenas.

| # | Nombre | Idioma | Nota |
|---|--------|--------|------|
| 1 | Comidas que te Cuidan | ES | Evolución directa del nombre original; cálido, claro, fácil de recordar. **Recomendado / elegido.** |
| 2 | Nutre con Cariño | ES | Corto y cálido; "nutre" puede sonar algo clínico aislado. |
| 3 | La Mesa que te Cuida | ES | Evoca hogar y familia; buen potencial de marca. |
| 4 | Recetas con Intención | ES | Tono moderno/wellness; menos cálido que los anteriores. |
| 5 | Saborea con Cuidado | ES | Juego de palabras agradable; traducción menos natural. |
| 6 | Meals that Care | EN | Limpio, corto, fácil recordación en mercado inglés. **Recomendado / elegido.** |
| 7 | Nourish with Love | EN | Frase muy usada en wellness; riesgo de sonar genérica. |
| 8 | The Kind Kitchen | EN | Nombre de marca fuerte, extensible a otros productos. |
| 9 | Wholesome & Whole | EN | Pegajoso, pero puede sonar a "clean eating" (evitar esa connotación, sección 34). |
| 10 | Every Meal, With Care | EN | Comunica bien el alcance completo (no solo cena); algo largo. |
| 11 | Des Repas qui Prennent Soin | FR | Traducción natural de "meals that care". **Recomendado / elegido.** |
| 12 | Cuisine Bienveillante | FR | Sofisticado, encaja con tono premium francés. |
| 13 | Savourer en Conscience | FR | Ángulo de alimentación consciente; más "foodie". |
| 14 | La Table Attentionnée | FR | Cálido, hogareño; "attentionnée" es palabra menos común. |
| 15 | Nourrir avec Soin | FR | Simple y traducible 1:1 con las versiones ES/EN. |

**Pendiente antes de fijar el nombre como definitivo (bloqueante para Fase 6 — comercialización, no para Fase 2-4):** verificar disponibilidad de dominio (`.com` para las tres variantes o un dominio neutro con subrutas de idioma) y ausencia de conflicto de marca obvio en Colombia, México, EE. UU., Canadá, España, Francia y Reino Unido. Esto no lo puedo verificar yo sin herramientas de búsqueda de marcas en vivo; te lo señalo como tarea tuya o de un especialista legal antes del lanzamiento comercial. El nombre se guarda en un archivo central de configuración (`config/brand.ts` o `.json`) para poder cambiarlo sin tocar código, como pide la sección 3 del brief.

## 5. Distribución detallada de las 100 recetas

**15 entradas y tapas** (incluye sopas y ensaladas completas ligeras):
- Tapas frías: 3
- Tapas calientes: 3
- Sopas: 4
- Ensaladas completas ligeras: 5

**35 almuerzos** (pueden ser más contundentes — sección 6):

| Proteína / tipo | Cantidad |
|---|---|
| Pollo | 6 |
| Pavo | 3 |
| Pescado | 5 |
| Mariscos | 3 |
| Carne magra (res/cerdo) | 5 |
| Huevos | 3 |
| Legumbres | 4 |
| Tofu / proteína vegetal | 3 |
| Bowls y pastas integrales mixtas | 3 |
| **Total** | **35** |

**35 cenas** (obligatoriamente ligeras y de fácil digestión — sección 6):

| Proteína / tipo | Cantidad |
|---|---|
| Pescado | 7 |
| Pollo (preparación ligera) | 6 |
| Legumbres (sopas/guisos ligeros) | 5 |
| Huevos (tortillas ligeras, al horno) | 4 |
| Tofu / proteína vegetal | 4 |
| Mariscos | 3 |
| Pavo | 2 |
| Carne magra (porciones pequeñas) | 2 |
| Cremas de vegetales / bowls ligeros | 2 |
| **Total** | **35** |

Dentro de las 70 recetas de almuerzo+cena, cada proteína incluye variantes rápidas, familiares, económicas, para anticipar y de una sola olla/bandeja/sartén, distribuidas de forma pareja — esto se controla receta por receta en el checklist de la sección 33, no como cuota rígida por fila.

**15 postres saludables:** brownie de cacao y frijol negro; cheesecake sin horno de yogur y limón; mousse de chocolate y aguacate; galletas de avena y plátano; paletas de mango y coco; helado "nice cream" de banano; tarta de manzana con base de avena; pudín de chía con frutos rojos; muffins de zanahoria y nuez; trufas de dátil y cacao; panna cotta ligera de vainilla; crumble de pera sin azúcar añadida; brownie individual de taza (mug cake); barras de granola horneadas; tiramisú aligerado para compartir.

**Distribución de inspiración culinaria** (guía, no cuota rígida, aplicada sobre todo a las 70 recetas de almuerzo/cena): mediterránea, latinoamericana general, francesa, norteamericana, asiática, caribeña, mexicana, colombiana, medio-oriental y vegetariana contemporánea, evitando afirmaciones de autenticidad y concentrar más de ~15% de las recetas en un solo origen.

No más del 20% de las 70 recetas de almuerzo/cena pueden ser ensaladas o preparaciones frías, para cumplir el requisito de variedad real de texturas, temperaturas y métodos de cocción.
