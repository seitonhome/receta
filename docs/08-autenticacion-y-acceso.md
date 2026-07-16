# Autenticación y acceso (Fase 3, implementado)

Decisión confirmada contigo: inicio de sesión sin contraseña, por enlace mágico al correo (Supabase Auth, `signInWithOtp`). Este documento explica el flujo completo y lo que falta configurar en el panel de Supabase antes de que funcione en producción.

## Flujo end-to-end

1. **Compra en Hotmart.** Hotmart gestiona checkout y pago.
2. **Webhook de Hotmart** (`POST /api/webhooks/hotmart`) escribe una fila en `public.purchases` con el correo del comprador, el id de transacción y el estado (`active`/`refunded`/`cancelled`/`chargeback`). Esto ocurre **antes** de que exista una cuenta en el sitio — la compra y la cuenta se vinculan por correo, no al revés.
3. **La persona pide un enlace de acceso** en `/ingresar` con su correo (`src/app/[locale]/ingresar/`). Si es la primera vez, Supabase crea la cuenta automáticamente (`shouldCreateUser: true`).
4. **Abre el enlace** desde su correo → cae en `/auth/confirm` (`src/app/auth/confirm/route.ts`), que valida el token y crea la sesión.
5. **En cada página**, `getAccessStatus()` (`src/lib/access/purchase-status.ts`) resuelve tres estados: sin sesión, con sesión pero sin compra activa, o con sesión y compra activa. `/favoritos` ya implementa los tres casos como referencia para las demás páginas que se vayan protegiendo (lista de compras, despensa, planificador).
6. **Respaldo manual** (pendiente de construir en el panel administrativo, Fase 5/6): un admin podrá insertar manualmente una fila en `purchases` para resolver casos donde el correo de compra y el de la cuenta no coinciden.

## Por qué el acceso no es un rol fijo en el usuario

`purchases` se consulta por correo en cada request en lugar de guardar un flag "tiene_acceso" en el perfil, para que una compra que llega antes o después de crear la cuenta funcione igual, y para que un reembolso revierta el acceso automáticamente sin tener que sincronizar dos tablas.

## Configuración pendiente en el panel de Supabase (no la puedo hacer yo sin credenciales)

1. **Site URL** y **Redirect URLs** (Authentication → URL Configuration): agregar `https://<tu-dominio>/auth/confirm` (y `http://localhost:3000/auth/confirm` para desarrollo).
2. **Plantilla de correo del enlace mágico** (Authentication → Email Templates → Magic Link): el template por defecto de Supabase no apunta a nuestra ruta `/auth/confirm`. Hay que cambiar el enlace a:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}
   ```
3. **Ejecutar la migración** `supabase/migrations/0001_auth_and_purchases.sql` contra el proyecto real (`supabase db push` o desde el SQL Editor).
4. **Variables de entorno** (`.env.example` → `.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.

Sin estas variables configuradas, el sitio sigue funcionando (recetas, idiomas, recalculador) — `/ingresar` y `/favoritos` simplemente muestran un aviso de que la conexión con Supabase todavía no está activa, en vez de fallar.

## Pendiente de verificar antes de conectar el webhook real de Hotmart

No pude acceder a la documentación oficial de Hotmart (`developers.hotmart.com`) desde este entorno — su CDN bloqueó las solicitudes automatizadas. `src/app/api/webhooks/hotmart/route.ts` está escrito con los nombres de campo que aparecen públicamente indexados (`hottok`, `email`, `transaction`, `status` con valores como `approved`/`refunded`/`cancelled`/`chargeback`), pero **antes de conectar un producto real** hay que:

1. Enviar un webhook de prueba desde el panel de Hotmart (Herramientas → Webhook) y registrar el payload real (`console.log(JSON.stringify(body))`).
2. Confirmar si `hottok` llega en el cuerpo del POST (como está asumido) o en un header, y ajustar `verifyHottok()`.
3. Confirmar que los valores de estado que realmente envía Hotmart coinciden con `STATUS_MAP` en ese archivo.

Esto no bloquea el resto del desarrollo — el webhook ya tiene la estructura, la idempotencia (upsert por `hotmart_transaction_id`) y el manejo de errores; solo falta calibrar los nombres de campo contra un payload real.
