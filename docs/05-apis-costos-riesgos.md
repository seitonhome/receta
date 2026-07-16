# APIs, costos y riesgos

## APIs necesarias y costo aproximado

| Servicio | Uso | Fase | Costo aproximado |
|---|---|---|---|
| Supabase | DB, Auth, Storage, RLS | MVP | $0 en tier gratuito (500 MB DB, 1 GB storage, 50k MAU); Pro desde $25/mes si se excede |
| Vercel | Hosting Next.js | MVP | $0 en tier Hobby; Pro desde $20/mes/usuario si se necesita para uso comercial en equipo |
| USDA FoodData Central | Fuente primaria de datos nutricionales | MVP | Gratuita, requiere API key, límite ~1000 req/hora |
| Edamam o Nutritionix | Fuente secundaria/contraste nutricional | V1.1 (opcional) | Freemium; planes pagos empiezan aprox. desde decenas de USD/mes según volumen — **a confirmar en el sitio del proveedor antes de activar, no lo doy por hecho** |
| OSM Nominatim + Overpass API | Geocodificación y búsqueda de tiendas cercanas | V2 | Gratuita, con política de uso (rate limit ~1 req/seg) que obliga a cachear en servidor |
| Generación de imágenes por IA | Ilustraciones de las recetas | MVP (5 piloto) / V1.1 (100 recetas) | Del orden de $0.01–$0.08 por imagen según proveedor/modelo; para ~120–150 imágenes (piloto + variantes) el costo total es de un solo dígito a bajos dos dígitos de USD, no recurrente mensualmente |
| Registro de dominio | Marca del producto | Fase 6 | Aprox. $12–15 USD/año por TLD `.com`; si se registran variantes por idioma, multiplicar |
| Hotmart | Procesamiento de pago y checkout | Fase 6 | Sin costo fijo mensual; cobra comisión por transacción — **verificar la tarifa vigente en la documentación oficial de Hotmart antes de modelar el pricing final, no asumir un porcentaje fijo aquí** |
| Plausible Analytics | Analítica sin cookies | MVP/V1.1 (opcional) | $0 si se autohospeda; ~$9–19/mes en plan hospedado |
| Resend (o similar) | Correo transaccional de soporte | V1.1 | $0 en tier gratuito (~3,000 emails/mes) |

## Costo mensual estimado del MVP

Con Supabase y Vercel en tier gratuito, sin APIs de pago activas (mapas y precios en vivo diferidos a V2), el costo mensual recurrente del MVP es **prácticamente $0**, salvo el prorrateo del dominio (~$1–2 USD/mes) una vez registrado en Fase 6. El costo de generación de imágenes es un gasto puntual de contenido, no una suscripción.

Si en V1.1 se activa una fuente nutricional secundaria de pago o un plan hospedado de analítica, el costo mensual estimado sube a un rango aproximado de $30–150 USD/mes dependiendo del volumen — esto se decide con datos reales de uso, no de antemano.

## Riesgos técnicos

- **Rate limits de OSM Nominatim/Overpass** pueden bloquear la función de tiendas cercanas si no se cachea agresivamente en servidor — mitigar con caché y, si el volumen crece, migrar a un proveedor de pago (Google Places/Mapbox) con techo de costo definido antes de activarlo.
- **Seguridad del webhook de Hotmart:** si la verificación de firma falla o se omite, se puede otorgar acceso fraudulento al producto. Requiere verificación de firma, idempotencia y logging de eventos.
- **Duplicación de datos entre idiomas:** el modelo receta-base + traducciones evita duplicar lógica, pero exige disciplina en migraciones para no dejar traducciones huérfanas; se mitiga con las pruebas automatizadas de la sección 33 (traducciones faltantes).
- **Consistencia de imágenes generadas por IA a escala** (100 recetas): riesgo de que el estilo visual se desvíe entre lotes; se mitiga con un prompt maestro reutilizable por receta (sección 32) y revisión editorial antes de publicar.
- **Desactualización de precios manuales:** al no haber integración en vivo, los precios pueden quedar obsoletos; se mitiga mostrando fecha de actualización y nivel de confiabilidad de forma visible (campos 28–30 de la estructura de receta).

## Riesgos legales

- **Afirmaciones médicas o nutricionales indebidas:** cualquier lenguaje que sugiera que una receta "cura", "previene" o "controla" una condición expone a responsabilidad regulatoria distinta en cada país (por ejemplo, reglas de alegaciones de salud de la FDA en EE. UU. o de la EFSA en la UE). Se mitiga con el checklist editorial de la sección 33 y evitando ese lenguaje de forma sistemática (sección 34).
- **Privacidad y geolocalización:** operar en 7 jurisdicciones implica cumplir simultáneamente RGPD (Francia/UE/Reino Unido), Ley 1581 de 2012 (Colombia), LFPDPPP (México), PIPEDA (Canadá) y las leyes estatales/federales de EE. UU. — ver detalle en `06-estrategias.md`.
- **Derechos de imagen y de marca del nombre elegido:** falta verificar disponibilidad real de dominio y ausencia de conflicto de marca en las 7 jurisdicciones antes de comprometerse comercialmente con el nombre (tarea pendiente, no verificable por mí sin búsqueda en vivo).
- **Términos de servicio de fuentes de precios:** Numbeo, DANE, INEGI/PROFECO, Eurostat/INSEE y BLS se usan solo como referencia de calibración manual, no como scraping automatizado, para no violar sus términos de uso — confirmar la licencia de cada una antes de citarla públicamente en la app.
- **Cumplimiento con Hotmart:** el manejo de reembolsos/contracargos debe reflejar fielmente las reglas de Hotmart vigentes; cualquier desalineación puede generar disputas con compradores.
