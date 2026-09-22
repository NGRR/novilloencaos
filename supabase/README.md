# Comunidad / Supabase

La interacción pública de **novilloencaos** usa Supabase para evitar exigir una cuenta visible al lector.

## Modelo

- `♡ resonancias`: una por identidad anónima y publicación; vuelve a pulsar para retirarla.
- `◌ notas`: alias opcional + texto de 3–1200 caracteres.
- `☕`: contador editorial independiente de aportes confirmados.
- La identidad Supabase se crea sólo al reaccionar o publicar; leer y abrir notas no exige sesión.
- No se almacenan correo, nombre real ni contraseña.

## Activación

1. Crear un proyecto en Supabase.
2. Habilitar **Anonymous Sign-Ins** en Auth.
3. Abrir **SQL Editor** y ejecutar `supabase/community.sql`.
4. En la configuración/API del proyecto copiar:
   - Project URL;
   - Publishable key o legacy anon key.
5. Completar `assets/data/community-config.json`:

```json
{
  "supabaseUrl": "https://TU-PROYECTO.supabase.co",
  "supabasePublishableKey": "sb_publishable_..."
}
```

La clave pública puede residir en el frontend. **No usar nunca `service_role` en el repositorio.**

## Moderación

Las notas quedan en `public.nvc_notes`.

- conservar: `status = published`
- ocultar: cambiar a `status = hidden`
- retirar conservando registro: `status = deleted`

Para bloquear una identidad reincidente, copiar su `user_id` desde `nvc_notes` e insertarlo en `public.nvc_blocked_users`.

Los límites iniciales están implementados en PostgreSQL:

- una resonancia por identidad y registro;
- 10 segundos mínimos entre notas;
- máximo 3 notas por hora;
- máximo 10 por 24 horas;
- rechazo de duplicados durante 7 días;
- honeypot en el formulario;
- lista de bloqueo.

Estos controles son por identidad anónima, no por IP. Una protección resistente a reinicios de identidad requiere una capa adicional (por ejemplo Turnstile validado por una Edge Function).
