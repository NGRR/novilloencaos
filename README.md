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

- **resonancias** y **notas** se resuelven mediante giscus sobre GitHub Discussions;
- cada publicación usa su código `REC://…` como identificador estable, por lo que la portada y el artículo comparten el mismo hilo;
- giscus se carga sólo cuando se abre la interacción;
- el contador `☕` no representa clics: se mantiene manualmente con aportes confirmados en `/assets/data/tea-counts.json`;
- `/giscus.json` restringe la carga al origen `https://ngrr.github.io`.

### Activación pendiente de giscus

El código está preparado con:

```text
repo:       NGRR/novilloencaos
repoId:     R_kgDOUe7wZA
category:   Announcements
mapping:    specific
strict:     1
reactions:  enabled
metadata:   enabled
```

Falta completar el `categoryId` generado por GitHub al habilitar Discussions. Hasta entonces la franja se muestra, pero el panel de notas informa que está temporalmente fuera de línea.

Secuencia de activación:

1. GitHub → `NGRR/novilloencaos` → **Settings → General → Features → Discussions**.
2. Instalar la aplicación **giscus** únicamente para este repositorio.
3. En giscus.app seleccionar `NGRR/novilloencaos` y la categoría **Announcements**.
4. Copiar el valor `data-category-id` generado.
5. Reemplazar `__PENDING_GISCUS_CATEGORY_ID__` en `/assets/js/site.js` por ese identificador.

### Moderación

Usar la categoría **Announcements** limita la creación de hilos a mantenedores y giscus. Los lectores sólo participan en los hilos asociados a publicaciones.

Criterio editorial recomendado:

```text
conservar  observaciones · desacuerdos · asociaciones · preguntas · correcciones
ocultar    ruido · desvíos menores · duplicados accidentales
eliminar   spam · publicidad · automatización · abuso · datos sensibles
bloquear   reincidencia evidente
```

La moderación se realiza desde la discusión correspondiente en GitHub. Ante una oleada de abuso pueden activarse temporalmente los límites de interacción del repositorio.
