# Comunidad / Supabase

La interacción pública de **novilloencaos** usa Supabase sin exigir registro ni cuenta al lector.

## Modelo

- `♡ resonancias`: una por navegador y publicación; vuelve a pulsar para retirarla.
- `◌ notas`: alias opcional + texto de 3–1200 caracteres.
- `☕`: contador editorial independiente de aportes confirmados.
- El navegador genera un UUID aleatorio cuando participa por primera vez y lo conserva en `localStorage`.
- Ese UUID sirve únicamente para evitar resonancias duplicadas, aplicar límites y permitir bloqueo.
- No se almacenan correo, nombre real ni contraseña.
- Supabase Auth no es necesario para esta función.

## Configuración

El frontend necesita sólo:

```json
{
  "supabaseUrl": "https://TU-PROYECTO.supabase.co",
  "supabasePublishableKey": "sb_publishable_..."
}
```

La clave pública puede residir en el frontend. **No usar nunca `service_role` ni una secret key en GitHub Pages.**

El esquema de instalación inicial está en:

```text
supabase/community.sql
```

## Moderación

Las notas quedan en `public.nvc_notes`.

- conservar: `status = published`
- ocultar: cambiar a `status = hidden`
- retirar conservando registro: `status = deleted`

Para bloquear una identidad reincidente, copiar su `visitor_id` desde `nvc_notes` e insertarlo en `public.nvc_blocked_users`.

Los límites iniciales están implementados en PostgreSQL:

- una resonancia por navegador y registro;
- 10 segundos mínimos entre notas;
- máximo 3 notas por hora;
- máximo 10 por 24 horas;
- rechazo de duplicados durante 7 días;
- honeypot en el formulario;
- lista de bloqueo.

Estos controles son por UUID local, no por IP. Borrar los datos del navegador crea una identidad nueva. Una protección resistente a reinicios de identidad o ataques distribuidos requiere una segunda capa, preferentemente Turnstile validado desde una Edge Function.
