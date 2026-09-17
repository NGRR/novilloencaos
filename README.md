# novilloencaos

Archivo editorial personal para desarrollar, revisar, relacionar y publicar pensamiento propio sobre filosofía, inteligencia artificial, tecnología, cultura, percepción, lenguaje, sistemas, autonomía cognitiva y relaciones humano–máquina.

No está planteado como blog de actualidad ni como fábrica de contenido. Funciona como un archivo intelectual evolutivo: las ideas pueden aparecer incompletas, mutar, contradecirse, ramificarse o terminar integrándose en piezas mayores.

## Estado actual

Sitio estático publicado con GitHub Pages desde `main`, sin framework ni backend.

La unidad editorial no es necesariamente el artículo terminado, sino la idea en desarrollo. El repositorio materializa públicamente ese archivo mediante HTML semántico, estilos compartidos y rutas estables.

### Publicado

**001 — Después del Vacío**  
Ensayo sobre autotranscendencia humano–máquina, transferencia de método, obsolescencia funcional de la IA, dependencia cognitiva, vacío, metasignificación y resonancia humano–máquina.

Ruta:

```text
/ensayos/despues-del-vacio/
```

**002 — INTIMIDAD DIGITAL**  
*La sexualización del no consentimiento en las búsquedas de Internet.*

Ensayo construido a partir de una observación incidental de consultas agregadas en Search Console y desarrollado como reflexión sobre la distancia entre norma pública, fantasía, deseo y violencia.

Ruta:

```text
/ensayos/intimidad-digital/
```

La ruta histórica `/ensayos/pero-aun-asi/` se conserva únicamente como redirección hacia `INTIMIDAD DIGITAL`.

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
│       ├── el-mito.jpg
│       └── intimidad-digital/
│
└── ensayos/
    ├── despues-del-vacio/
    │   └── index.html
    ├── intimidad-digital/
    │   └── index.html
    └── pero-aun-asi/
        └── index.html
```

La arquitectura prevista puede crecer manteniendo la misma lógica:

```text
/ensayos/
/apuntes/
/comentarios/
/fragmentos/
```

## Sistema editorial

El proyecto distingue entre:

- **ensayo**: pieza extensa con problema o hipótesis central;
- **apunte**: desarrollo intermedio de una idea todavía no estabilizada;
- **comentario**: lectura o reacción razonada frente a una obra, texto, teoría, tecnología o fenómeno;
- **fragmento**: unidad breve susceptible de expansión posterior;
- **glosario**: registro de conceptos propios o resignificados dentro del archivo.

Las revisiones buscan preservar la voz y la ambigüedad productiva, distinguiendo entre error, imprecisión, hipótesis discutible, decisión estilística y abstracción deliberada.

Las versiones sustantivamente distintas no deben sobrescribirse silenciosamente.

## Dirección de arte

El sistema visual trabaja con una lógica predominantemente blanca, técnica y editorial:

- retícula visible;
- reglas, cotas y coordenadas;
- numeración;
- notas marginales;
- tipografía de lectura extensa;
- espacio negativo;
- detalles cercanos a un plano, archivo o cuaderno técnico más que a un blog convencional.

La interfaz utiliza actualmente IBM Plex Sans, IBM Plex Mono y Source Serif 4.

### Portada

La portada funciona como índice cronológico del archivo.

Actualmente incorpora la obra **El mito** sobre el texto introductorio. La imagen se conserva como archivo fotográfico y se presenta en escala de grises mediante CSS. El título de la obra aparece como anotación mínima en el lateral derecho.

## Plantilla de ensayo

Los ensayos comparten:

- cabecera global;
- indicador de progreso de lectura;
- ficha técnica;
- índice lateral;
- cuerpo de lectura;
- notas marginales;
- citas destacadas;
- enlace de retorno al archivo;
- componente final de apoyo voluntario.

`assets/js/site.js` se encarga de comportamientos comunes como progreso de lectura, navegación activa y la inserción de componentes compartidos.

## Apoyo voluntario

El proyecto incorpora una página propia:

```text
/apoyar/
```

La interfaz usa el lenguaje **“invita un tecito”** y mantiene una separación explícita entre acceso editorial y aporte económico.

Principios:

- el aporte es voluntario;
- no compra acceso;
- no otorga prioridad;
- no desbloquea contenido exclusivo;
- el material permanece abierto y gratuito.

Los niveles actuales son:

```text
luca               $1.000
dos luquini        $2.000
gabriela mistral   $5.000
```

Los pagos se procesan externamente mediante SumUp. GitHub Pages no maneja datos de tarjetas ni lógica de pago.

El acceso `invita un tecito` aparece:

- bajo la navegación principal;
- al cierre de cada ensayo;
- en el pie de la portada del archivo.

El ícono de taza y los estilos esenciales del componente están definidos en el sistema común para evitar cambios de tamaño o flashes durante la carga.

## Recursos visuales

### El mito

```text
/assets/images/el-mito.jpg
```

Obra utilizada actualmente en la portada del archivo.

### INTIMIDAD DIGITAL

```text
/assets/images/intimidad-digital/
```

Contiene los recursos visuales asociados al segundo ensayo.

## Convenciones de publicación

Al incorporar una pieza consolidada:

1. preservar íntegramente el contenido aprobado;
2. usar HTML semántico;
3. reutilizar el sistema visual común;
4. evitar CSS específico salvo necesidad editorial real;
5. mantener funcionamiento móvil;
6. actualizar el índice del archivo;
7. conservar rutas estables;
8. realizar un commit descriptivo.

Convención orientativa:

```text
content: publish <slug>
edit: revise <slug>
style: refine editorial system
docs: update project structure
fix: correct <problema>
```

## Principio de continuidad

Antes de desarrollar una nueva pieza relacionada con conceptos existentes:

1. recuperar los desarrollos anteriores relevantes;
2. distinguir qué pertenece al marco ya construido;
3. identificar qué está cambiando;
4. evitar presentar como descubrimiento una idea ya establecida;
5. permitir contradicciones cuando representen una evolución genuina.

El repositorio debe funcionar como una memoria intelectual conectada, no como una secuencia de publicaciones independientes.

## Publicación

GitHub Pages:

```text
branch: main
source: /
```

Repositorio:

```text
NGRR/novilloencaos
```
