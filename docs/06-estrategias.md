# Estrategias operativas

## Estrategia de precios por ubicación (sección 11 del brief)

No existe una API única, gratuita y confiable con precios reales de supermercado por país y cantidad exacta en los 7 países objetivo. Estrategia para el MVP/V1.1:

1. Tabla `price_sources` cargada y mantenida manualmente por un administrador desde el panel: ingrediente, país, ciudad (opcional), precio, moneda, unidad, fecha de actualización, fuente general, nivel de confiabilidad.
2. Calibración de rangos usando referencias públicas (no integración en vivo): Numbeo, DANE (Colombia), INEGI/PROFECO (México), Eurostat/INSEE (Francia/España), BLS (EE. UU./Canadá).
3. El costo por receta se calcula proporcionalmente a la cantidad usada (normalizando g/kg/ml/l/unidades/cucharadas/tazas/oz/lb), nunca como el precio del empaque completo.
4. El usuario puede sobrescribir el precio de un ingrediente con su propio valor, guardado como preferencia personal (no afecta el precio público de referencia).
5. Cuando no haya dato confiable, se muestra un rango estimado marcado como tal — nunca un número inventado con falsa precisión.
6. Automatizar precios en tiempo real (V2) queda condicionado a encontrar una fuente con licencia adecuada para los 7 países; no se asume que existirá.

## Estrategia de tiendas cercanas (sección 12, V2)

En el MVP solo se implementa el flujo de consentimiento (usar ubicación actual / escribir ciudad o código postal / continuar sin ubicación), sin bloquear nunca el acceso al contenido, y sugerencias de **tipo** de tienda en texto genérico ("podrías encontrar este ingrediente en un mercado de frutas y verduras o supermercado"), sin mapa ni proveedor externo activo.

En V2: OpenStreetMap (Nominatim para geocodificación, Overpass API para puntos de interés) como proveedor por defecto, gratuito pero con límites de uso que se deben respetar y cachear en servidor. La integración se diseña desacoplada (interfaz de "proveedor de tiendas") para poder sustituir por Google Places o Mapbox si el volumen de usuarios lo justifica económicamente — se define un techo mensual de costo aceptado *antes* de activar cualquier proveedor de pago, y las claves viven en variables de entorno. Nunca se afirma que una tienda tiene un ingrediente en inventario sin integración que lo confirme.

## Estrategia de traducción

- Traducción profesional humana, no automática literal — el brief lo exige explícitamente (sección 4 y regla de la sección 39).
- Modelo de datos: receta base (datos no traducibles: categoría, tiempos, imagen, nutrición, costo) + `recipe_translations` por idioma. Mismo patrón para ingredientes (`ingredient_translations`) y variantes locales por país (`ingredient_local_names`, ej. aguacate/avocado/avocat).
- Glosario internacional de ingredientes centralizado, reutilizado en todas las recetas para mantener consistencia terminológica.
- UI con `next-intl`, separada del contenido editorial de las recetas.
- Checklist de calidad (sección 33) incluye "traducción fiel" como criterio de aprobación antes de publicar cualquier receta.
- Cada receta traducida declara su fuente/traductor de referencia internamente, para poder auditar calidad si un usuario reporta un error.

## Estrategia de integración con Hotmart

- Sitio propio en Vercel, desacoplado del Club de Hotmart (decisión justificada en `04-arquitectura-tecnica.md`).
- Antes de implementar: consultar la documentación oficial vigente de Hotmart para los nombres reales de eventos de webhook, payloads y método de verificación de firma — no se inventan endpoints ni eventos (regla de la sección 39).
- Eventos a contemplar: confirmación de compra, reembolso, cancelación, contracargo, cambio de correo del comprador, acceso temporal o permanente según configuración del producto.
- El handler del webhook debe ser idempotente (mismo evento reenviado no debe duplicar accesos), verificar la firma antes de procesar, registrar cada evento recibido, y tener reintentos con backoff en caso de error transitorio propio (no de Hotmart).
- Respaldo manual: código de acceso administrado desde el panel, para casos donde el webhook falle o el comprador tenga un problema de correo.
- Política de actualización de contenido: los compradores existentes reciben acceso automático a recetas nuevas o corregidas sin costo adicional — se documenta en los Términos de Uso.

## Marcos legales de privacidad por mercado (a referenciar explícitamente en la política de privacidad, no solo como principios genéricos)

| Mercado | Marco legal |
|---|---|
| Francia / UE / Reino Unido | RGPD / GDPR |
| Colombia | Ley 1581 de 2012 |
| México | LFPDPPP |
| Canadá | PIPEDA |
| Estados Unidos | Marco de privacidad estatal/federal aplicable según el estado del usuario (no hay ley federal única) |

Implicaciones prácticas: consentimiento explícito y granular para ubicación, posibilidad de borrar datos, no almacenar coordenadas precisas de forma permanente salvo necesidad funcional y consentimiento explícito, comunicaciones cifradas, minimización de datos.
