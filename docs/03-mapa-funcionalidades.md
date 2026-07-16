# Mapa de funcionalidades (MVP / V1.1 / V2)

## MVP — Fase 1–4

- Arquitectura del proyecto (Next.js + Supabase) y estructura de carpetas
- Modelo de datos y migraciones iniciales
- Sistema de diseño (paleta, tipografía, componentes base)
- 5 recetas piloto completas y traducidas (ES + 1 traducida a EN/FR)
- Sistema multilingüe funcional (mecanismo, no las 100 recetas traducidas)
- Recalculador automático de porciones (1/2/4/6/8 + personalizado, con redondeo culinario)
- Lista de compras básica (agregar, combinar duplicados, marcar comprado, organizar por categoría)
- Favoritos
- Autenticación (Supabase Auth)
- Conversor de medidas
- Flujo de consentimiento de ubicación (3 opciones), **sin mapa ni proveedor externo activo**
- Integración de acceso vía webhook de Hotmart + código de acceso manual de respaldo
- Panel administrativo mínimo: crear/editar/traducir las recetas piloto, cargar precios manualmente
- Pruebas automatizadas básicas (ver checklist sección 33)
- Avisos legales iniciales (privacidad, términos, aviso nutricional responsable)
- Accesibilidad WCAG 2.2 AA en todo lo construido

## V1.1 — Fase 5–6

- Las 100 recetas completas, traducidas y auditadas
- Precios estimados por país cargados manualmente (tabla `price_sources`) para los 7 países
- Planificador semanal (con lógica de "cocina inteligente" para aprovechar ingredientes)
- Despensa virtual con alertas de vencimiento
- Buscador inteligente en lenguaje natural
- Historial de recetas vistas
- Comparador de costos simple (sin histórico)
- Panel administrativo completo (importación CSV, gestión de usuarios, reportes, FAQ, analítica interna)
- Tabla de sustituciones y glosario internacional de ingredientes completos
- Lista de compras avanzada (compartir, PDF, enlaces WhatsApp/correo)
- Flujo de validación de aportes de usuarios (precios/ingredientes pendientes → aprobados)

## V2 — Roadmap (no bloquea el lanzamiento)

- Geolocalización de tiendas cercanas con mapa interactivo (OSM/Overpass como proveedor por defecto, sustituible)
- Importación de precios en tiempo real
- PWA offline completa (recetas favoritas, lista de compras, plan semanal, glosario, conversor)
- Comparador de costos histórico

## Nota de confirmación pendiente

Esta clasificación sigue literalmente la sección 0 del brief. Los puntos donde tuve que tomar una decisión de encuadre (no explícita en el brief) son: "buscador inteligente en lenguaje natural" → V1.1 (necesita el corpus completo de 100 recetas para ser útil) y "comparador de costos simple" → V1.1 vs. histórico en V2. Avísame si prefieres otra ubicación para estos dos.
