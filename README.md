# novilloencaos

Archivo personal de ensayos, relatos, apuntes y comentarios sobre filosofía, tecnología, cultura, inteligencia, lenguaje, sistemas y relaciones humano–máquina.

El sitio funciona como un archivo público de textos en desarrollo y piezas revisadas, publicado como sitio estático mediante GitHub Pages.

## Publicado

**REC://3F-33 — De lo que huyen las polillas**  
Relato de terror iniciado en 2014 y reconstruido en 2026. Cinco registros de diario sobre vigilia, parálisis del sueño, folclore doméstico y una polilla que no intenta entrar, sino salir.

```text
/relatos/de-lo-que-huyen-las-polillas/
```

**REC://7E-A1 — Después del Vacío**  
Ensayo sobre autotranscendencia humano–máquina, transferencia de método, obsolescencia funcional de la IA, dependencia cognitiva, vacío, metasignificación y resonancia humano–máquina.

```text
/ensayos/despues-del-vacio/
```

**REC://3C-F2 — Intimidad digital**  
*La sexualización del no consentimiento en las búsquedas de Internet.*

Ensayo sobre la distancia entre norma pública, fantasía, deseo y violencia a partir de una observación incidental de consultas agregadas en Search Console.

```text
/ensayos/intimidad-digital/
```

**REC://9A-18 — Acarrearse a uno mismo**  
Texto original del 26 de diciembre de 2018, revisado en 2026. Comentario filosófico sobre memoria, responsabilidad, vulnerabilidad, conflicto y transformación.

```text
/ensayos/acarrearse-a-si-mismo/
```

**REC://4D-6C — No convertirse en el mensaje**  
Texto cerrado originalmente en 2018 y revisado en 2026. Comentario crítico sobre solidaridad, apropiación, representación, camuflaje ideológico y responsabilidad.

```text
/ensayos/no-convertirse-en-el-mensaje/
```

**REC://B7-23 — El mito**  
Apunte original de 2023, revisado en 2026. Fantasía epistemológica sobre conocimiento, equilibrio, perturbación y transformación.

```text
/apuntes/el-mito/
```

La ruta histórica `/ensayos/pero-aun-asi/` se conserva como redirección hacia *Intimidad digital*.

## Estructura

```text
novilloencaos/
├── index.html
├── README.md
├── .nojekyll
│
├── apoyar/
│   └── index.html
│
├── assets/
│   ├── css/
│   │   ├── site.css
│   │   └── support.css
│   ├── js/
│   │   └── site.js
│   └── images/
│       ├── el-mito.png
│       └── intimidad-digital/
│
├── relatos/\n│   └── de-lo-que-huyen-las-polillas/\n│       └── index.html\n│\n├── ensayos/
│   ├── despues-del-vacio/
│   │   └── index.html
│   ├── intimidad-digital/
│   │   └── index.html
│   ├── acarrearse-a-si-mismo/
│   │   └── index.html
│   ├── no-convertirse-en-el-mensaje/
│   │   └── index.html
│   └── pero-aun-asi/
│       └── index.html
│
└── apuntes/
    └── el-mito/
        └── index.html
```

## Dirección visual

El sitio usa una estética predominantemente blanca, técnica y editorial: retícula visible, reglas, cotas, numeración, notas marginales y tipografía orientada a lectura extensa.

Tipografías actuales:

- IBM Plex Sans
- IBM Plex Mono
- Source Serif 4

La portada incorpora la obra **El mito** en escala de grises, con su título como anotación lateral mínima.

## Interfaz de los ensayos

Las piezas comparten cabecera, progreso de lectura, ficha técnica, índice lateral, cuerpo de lectura, notas marginales, citas destacadas, retorno al archivo y un componente final de apoyo voluntario.

Los comportamientos comunes se concentran en:

```text
/assets/js/site.js
```

## Apoyo voluntario

El sitio incluye una página propia de apoyo:

```text
/apoyar/
```

La interfaz utiliza el texto **“invita un tecito”**. El aporte es voluntario y no modifica el acceso al contenido.

Niveles actuales:

```text
luca               $1.000
dos luquini        $2.000
gabriela mistral   $5.000
```

Los pagos se procesan externamente mediante SumUp.

## Publicación

Sitio estático publicado con GitHub Pages:

```text
repository: NGRR/novilloencaos
branch: main
source: /
```


## Resonancias, notas y tecitos

La interfaz común incorpora una franja editorial por publicación:

```text
♡ resonancias    ◌ notas    ☕ 0
```

- **resonancias** y **notas** se resuelven mediante Supabase;
- el lector puede participar sin crear una cuenta visible;
- Supabase crea una identidad anónima sólo cuando alguien reacciona o publica;
- cada publicación usa su código estable `REC://…`;
- el contador `☕` no representa clics: se mantiene manualmente con aportes confirmados en `/assets/data/tea-counts.json`.

### Activación de Supabase

La implementación está incluida en:

```text
/assets/data/community-config.json
/supabase/community.sql
/supabase/README.md
```

Secuencia:

1. crear un proyecto Supabase;
2. habilitar **Anonymous Sign-Ins**;
3. ejecutar `supabase/community.sql` en SQL Editor;
4. copiar Project URL y Publishable/anon key;
5. completar `assets/data/community-config.json`.

Nunca debe incorporarse una clave `service_role` al sitio público.

### Moderación

Las notas se almacenan en `public.nvc_notes`:

```text
published  visible
hidden     moderada / conservada
deleted    retirada / conservada como registro
```

Una identidad reincidente puede bloquearse incorporando su `user_id` a `public.nvc_blocked_users`.

El sistema incluye inicialmente:

- una resonancia por identidad y publicación;
- 10 segundos mínimos entre notas;
- máximo 3 notas por hora;
- máximo 10 por 24 horas;
- rechazo de duplicados durante 7 días;
- honeypot;
- lista de bloqueo.

Estos límites operan por identidad anónima. Para protección resistente a reinicios de identidad o ataques distribuidos debe añadirse posteriormente Turnstile validado desde una Edge Function.
