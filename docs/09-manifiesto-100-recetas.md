# Manifiesto de las 100 recetas (Fase 5)

**Estado: las 100 recetas están escritas, traducidas e integradas en `src/lib/recipes/data/` — español, inglés y francés completos.** Validado con `npm run validate:recipes`: 0 errores (sin slugs/títulos/notas duplicados, sin frases prohibidas, sin cenas pesadas — las únicas coincidencias de palabras como "mantequilla" o "frito" son negaciones explícitas del propio texto, ej. "sin freír", "no uses mantequilla"). Conteo por categoría verificado: 15 entradas, 35 almuerzos, 35 cenas, 15 postres. Prompts de imagen para las 100 en `docs/10-prompts-imagenes-100-recetas.md`.

Lista definitiva de las 95 recetas nuevas + las 5 piloto ya existentes, respetando la distribución de `docs/01-fase1-estrategia.md` §5. Esto es el contrato que sigue cada lote de generación: nombres fijos, categoría fija, proteína/tipo fijo — así se evita duplicados y se controla la cuota por celda de la tabla.

Slugs en kebab-case, sin tildes. `es` únicamente en esta ronda; inglés/francés quedan para el siguiente paso (ver nota al final).

## Entradas y tapas (15 — 1 hecha, 14 nuevas)

| # | Nombre | Tipo | Cocina |
|---|---|---|---|
| 1 | Tostas de garbanzo especiado y yogur de limón ✅ | Tapa fría | Mediterránea |
| 2 | Ceviche de palmitos y aguacate | Tapa fría | Latinoamericana |
| 3 | Rollitos frescos de papel de arroz con vegetales y maní | Tapa fría | Asiática |
| 4 | Croquetas de atún al horno con salsa de yogur | Tapa caliente | Mediterránea |
| 5 | Champiñones rellenos de queso de cabra y nueces al horno | Tapa caliente | Mediterránea |
| 6 | Alitas de pollo al horno con especias cajún | Tapa caliente | Norteamericana |
| 7 | Crema de calabaza y jengibre | Sopa | Vegetariana contemporánea |
| 8 | Sopa de lentejas al curry | Sopa | Asiática |
| 9 | Caldo de pollo y vegetales estilo casero | Sopa | Latinoamericana |
| 10 | Sopa fría de pepino y yogur | Sopa | Mediterránea |
| 11 | Ensalada de quinoa, garbanzo y vegetales asados | Ensalada completa | Mediterránea |
| 12 | Ensalada César ligera con pollo a la plancha | Ensalada completa | Norteamericana |
| 13 | Ensalada tibia de lentejas, espinaca y queso feta | Ensalada completa | Mediterránea |
| 14 | Ensalada asiática de col, edamame y sésamo | Ensalada completa | Asiática |
| 15 | Ensalada niçoise aligerada de atún, papa y ejotes | Ensalada completa | Francesa |

## Almuerzos (35 — 2 hechas, 33 nuevas)

| # | Nombre | Proteína | Cocina |
|---|---|---|---|
| 1 | Pollo al horno con especias marroquíes, cuscús integral y verduras asadas ✅ | Pollo | Medio-oriental |
| 2 | Pollo al curry con leche de coco y arroz basmati | Pollo | Asiática |
| 3 | Fajitas de pollo con pimientos y tortillas integrales | Pollo | Mexicana |
| 4 | Pollo a la plancha con chimichurri y papas al horno | Pollo | Latinoamericana |
| 5 | Pollo guisado con vegetales estilo casero | Pollo | Colombiana |
| 6 | Pollo teriyaki con arroz integral y brócoli al vapor | Pollo | Asiática |
| 7 | Albóndigas de pavo en salsa de tomate con espagueti integral | Pavo | Norteamericana |
| 8 | Pavo a la plancha con puré de camote y ejotes | Pavo | Norteamericana |
| 9 | Wrap de pavo, hummus y vegetales asados | Pavo | Medio-oriental |
| 10 | Pescado a la veracruzana con arroz integral | Pescado | Mexicana |
| 11 | Filete de tilapia al horno con costra de hierbas y papas | Pescado | Latinoamericana |
| 12 | Curry de pescado con leche de coco y arroz jazmín | Pescado | Asiática |
| 13 | Pescado a la plancha con salsa de mango y aguacate | Pescado | Caribeña |
| 14 | Bacalao al horno con puré de garbanzo y pimentón | Pescado | Mediterránea |
| 15 | Arroz de mariscos estilo paella ligera | Mariscos | Mediterránea |
| 16 | Camarones salteados con vegetales estilo asiático | Mariscos | Asiática |
| 17 | Ceviche mixto de camarón y pescado con camote | Mariscos | Latinoamericana |
| 18 | Bowl caribeño de frijoles rojos, arroz integral y plátano maduro ✅ | Legumbres | Caribeña |
| 19 | Lentejas guisadas con vegetales y arroz | Legumbres | Mediterránea |
| 20 | Falafel al horno con arroz y salsa de tahini | Legumbres | Medio-oriental |
| 21 | Chili de frijoles negros y camote | Legumbres | Norteamericana |
| 22 | Lomo de cerdo al horno con manzana y batata | Carne magra | Norteamericana |
| 23 | Carne asada estilo mexicana con frijoles y arroz | Carne magra | Mexicana |
| 24 | Bistec a la plancha con chimichurri y ensalada de tomate | Carne magra | Latinoamericana |
| 25 | Estofado de res con vegetales de raíz (una sola olla) | Carne magra | Norteamericana |
| 26 | Albóndigas de res con puré de papa y ejotes | Carne magra | Norteamericana |
| 27 | Shakshuka con pan integral | Huevos | Medio-oriental |
| 28 | Tortilla española de papa y espinaca | Huevos | Mediterránea |
| 29 | Huevos rancheros con frijoles y aguacate | Huevos | Mexicana |
| 30 | Tofu salteado con vegetales y salsa de maní | Tofu / vegetal | Asiática |
| 31 | Tacos de tofu al pastor con piña | Tofu / vegetal | Mexicana |
| 32 | Tempeh a la plancha con arroz integral y vegetales asados | Tofu / vegetal | Vegetariana contemporánea |
| 33 | Bowl mediterráneo de garbanzo, quinoa y vegetales asados | Bowl/pasta | Mediterránea |
| 34 | Pasta integral con salsa de tomate, atún y aceitunas | Bowl/pasta | Mediterránea |
| 35 | Bowl mexicano de arroz, frijol negro, elote y pico de gallo | Bowl/pasta | Mexicana |

## Cenas (35 — 1 hecha, 34 nuevas) — todas ligeras, sin frituras profundas ni salsas pesadas

| # | Nombre | Proteína | Cocina |
|---|---|---|---|
| 1 | Salmón al vapor con salsa de eneldo y puré ligero de coliflor ✅ | Pescado | Nórdica/mediterránea |
| 2 | Trucha al horno con espárragos y limón | Pescado | Francesa |
| 3 | Tilapia al vapor con salsa de cítricos y vegetales | Pescado | Caribeña |
| 4 | Pescado blanco en papillote con vegetales julianas | Pescado | Francesa |
| 5 | Atún sellado con ensalada de pepino y sésamo | Pescado | Asiática |
| 6 | Merluza a la plancha con puré ligero de arveja | Pescado | Mediterránea |
| 7 | Pescado al horno con costra de ajonjolí y bok choy salteado | Pescado | Asiática |
| 8 | Pechuga de pollo al horno con espárragos y limón | Pollo | Norteamericana |
| 9 | Pollo salteado con vegetales y arroz de coliflor | Pollo | Asiática |
| 10 | Sopa ligera de pollo y vegetales | Pollo | Latinoamericana |
| 11 | Brochetas de pollo al horno con ensalada tibia de vegetales | Pollo | Medio-oriental |
| 12 | Pollo al limón con vegetales salteados estilo cantonés | Pollo | Asiática |
| 13 | Rollitos de pollo y vegetales al vapor estilo vietnamita | Pollo | Asiática |
| 14 | Sopa ligera de lentejas y espinaca | Legumbres | Mediterránea |
| 15 | Crema ligera de arveja verde y menta | Legumbres | Vegetariana contemporánea |
| 16 | Guiso ligero de garbanzo y espinaca | Legumbres | Medio-oriental |
| 17 | Sopa de frijol blanco y vegetales estilo toscana aligerada | Legumbres | Mediterránea |
| 18 | Dhal de lentejas rojas al curry ligero | Legumbres | Asiática |
| 19 | Tortilla de claras con vegetales salteados | Huevos | Vegetariana contemporánea |
| 20 | Huevos al horno estilo shakshuka ligera con espinaca | Huevos | Medio-oriental |
| 21 | Frittata ligera de vegetales al horno | Huevos | Mediterránea |
| 22 | Huevos pochados sobre puré ligero de espárragos | Huevos | Francesa |
| 23 | Tofu al vapor con salsa de jengibre y bok choy | Tofu / vegetal | Asiática |
| 24 | Sopa miso con tofu y vegetales | Tofu / vegetal | Asiática |
| 25 | Tofu a la plancha con ensalada tibia de quinoa | Tofu / vegetal | Vegetariana contemporánea |
| 26 | Edamame salteado con tofu estilo teriyaki ligero | Tofu / vegetal | Asiática |
| 27 | Camarones al vapor con salsa de jengibre y limón | Mariscos | Asiática |
| 28 | Mejillones al vapor con caldo ligero de tomate y hierbas | Mariscos | Francesa |
| 29 | Ensalada tibia de pulpo y papa | Mariscos | Mediterránea |
| 30 | Pechuga de pavo al horno con puré ligero de coliflor | Pavo | Norteamericana |
| 31 | Rollitos de pavo y vegetales al vapor | Pavo | Asiática |
| 32 | Lomo de res a la plancha (porción pequeña) con espárragos | Carne magra | Norteamericana |
| 33 | Cerdo magro a la plancha con puré ligero de manzana y col morada | Carne magra | Norteamericana |
| 34 | Crema ligera de calabacín y albahaca | Vegetales / bowl | Mediterránea |
| 35 | Bowl ligero de vegetales al vapor con quinoa y tahini | Vegetales / bowl | Vegetariana contemporánea |

## Postres (15 — 1 hecho, 14 nuevos)

| # | Nombre | Formato |
|---|---|---|
| 1 | Brownie de cacao y frijol negro con glaseado de yogur ✅ | Horneado, para compartir |
| 2 | Cheesecake sin horno de yogur y limón | Sin horno |
| 3 | Mousse de chocolate y aguacate | Sin horno |
| 4 | Galletas de avena y plátano | Horneado |
| 5 | Paletas de mango y coco | Congelado |
| 6 | Nice cream de banano y cacao | Congelado |
| 7 | Tarta de manzana con base de avena | Horneado |
| 8 | Pudín de chía con frutos rojos | Sin horno |
| 9 | Muffins de zanahoria y nuez | Horneado |
| 10 | Trufas de dátil y cacao | Sin horno |
| 11 | Panna cotta ligera de vainilla | Sin horno |
| 12 | Crumble de pera sin azúcar añadida | Horneado |
| 13 | Mug cake de chocolate y café (individual, microondas) | Individual |
| 14 | Barras de granola horneadas | Horneado |
| 15 | Tiramisú aligerado para compartir | Sin horno, para compartir |

## Nota sobre traducciones

Esta ronda genera únicamente el contenido en **español** para las 100 recetas (`content.es`), siguiendo el orden del brief: "generar, traducir, auditar". La traducción profesional al inglés y francés de las 95 recetas nuevas es un paso siguiente y separado — mismo patrón que ya existe para la receta piloto de salmón, que sirve de plantilla de calidad para esa traducción.
