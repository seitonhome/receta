# Plan de desarrollo por fases y criterios de aceptación

Cada fase se entrega y se confirma contigo antes de avanzar a la siguiente (regla de la sección 39: no mezclar fases).

## Fase 1 — Estrategia (esta entrega)
**Contenido:** usuario ideal, propuesta de valor, nombres candidatos, categorías, funciones MVP vs. posteriores, riesgos.
**Criterio de aceptación:** confirmas la clasificación MVP/V1.1/V2, el nombre elegido (o pides ajustar), y la distribución de las 100 recetas.

## Fase 2 — Diseño
**Contenido:** sitemap detallado con flujos de usuario, sistema visual (paleta, tipografía, componentes), experiencia mobile-first.
**Criterio de aceptación:** apruebas el sistema de diseño (colores, tipografía, componentes clave) antes de que se traduzca a código.

## Fase 3 — Arquitectura (ejecución en código)
**Contenido:** proyecto Next.js inicializado, esquema de base de datos y migraciones reales en Supabase, autenticación, internacionalización, roles y políticas RLS.
**Criterio de aceptación:** el proyecto corre localmente, las migraciones aplican sin error, y existe al menos un flujo de auth funcional de extremo a extremo.

## Fase 4 — Prototipo
**Contenido:** las 5 recetas piloto completas y funcionales en la app (no solo como archivos Markdown), precios estimados, cambio de idioma, recalculador de porciones, lista de compras, flujo de consentimiento de ubicación (sin mapa).
**Criterio de aceptación:** las 5 recetas piloto pasan el checklist de calidad de la sección 33, y tú las validas como plantilla antes de generar las 95 restantes. **Este es el punto de bloqueo explícito del brief: no se generan las 95 recetas restantes hasta esta aprobación.**

## Fase 5 — Contenido
**Contenido:** generación, traducción, auditoría e importación de las 95 recetas restantes usando la plantilla validada en Fase 4.
**Criterio de aceptación:** las 100 recetas pasan las pruebas automatizadas de la sección 33 (sin ingredientes huérfanos, sin traducciones faltantes, sin costos nulos/negativos, sin duplicados, coherencia horaria almuerzo/cena verificada).

## Fase 6 — Comercialización
**Contenido:** configuración de acceso e integración real con Hotmart (webhook + respaldo manual), página de bienvenida para compradores, instrucciones de acceso, soporte y FAQ.
**Criterio de aceptación:** una compra de prueba en Hotmart (sandbox o real de bajo valor) activa el acceso correctamente de extremo a extremo, incluyendo el flujo de reembolso.

## Fase 7 — Pruebas y producción
**Contenido:** auditorías finales, corrección de errores, optimización de rendimiento (Core Web Vitals), despliegue a producción, documentación final.
**Criterio de aceptación:** el sitio en producción cumple accesibilidad WCAG 2.2 AA, no tiene botones sin funcionalidad ni contenido a medio terminar, y toda la documentación de `docs/` y `README.md` está actualizada al estado real del código.
