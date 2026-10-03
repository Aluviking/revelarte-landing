# RevelArte · Diseño y Publicidad

Landing page estática de **RevelArte**, empresa integral de publicidad digital e impresa.
Sitio 100 % frontend (HTML, CSS y JavaScript sin frameworks), responsive, con modo claro/oscuro,
parallax, carruseles y microinteracciones.

> Las tecnologías y herramientas usadas están detalladas en [TECNOLOGIAS.md](TECNOLOGIAS.md).

---

## Índice

1. [Inicio rápido](#inicio-rápido)
2. [Scripts disponibles](#scripts-disponibles)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Secciones de la página](#secciones-de-la-página)
5. [Identidad visual](#identidad-visual)
6. [Interacciones y efectos](#interacciones-y-efectos)
7. [Cómo editar el contenido](#cómo-editar-el-contenido)
8. [Calidad: lint, CI y build](#calidad-lint-ci-y-build)
9. [Despliegue](#despliegue)
10. [Accesibilidad y rendimiento](#accesibilidad-y-rendimiento)
11. [Pendientes](#pendientes)

---

## Inicio rápido

Requisitos: **Node.js 20 o superior**.

```bash
npm install      # instala las herramientas de desarrollo
npm run dev      # abre el sitio en http://localhost:5500
```

El sitio también funciona sin Node: basta con servir la carpeta con cualquier servidor estático
(por ejemplo `python -m http.server 5500`).

## Scripts disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor local en `http://localhost:5500` (puerto configurable con `PORT`). |
| `npm run lint` | Ejecuta todos los chequeos: `lint:js`, `lint:css`, `lint:html` y `check:assets`. |
| `npm run lint:js` | ESLint sobre `js/` y `scripts/`. |
| `npm run lint:css` | Stylelint sobre `css/`. |
| `npm run lint:html` | html-validate sobre `index.html`. |
| `npm run check:assets` | Verifica que existan todos los archivos, íconos del sprite y anclas referenciados. |
| `npm run build` | Genera la versión de producción minificada en `dist/`. |
| `npm run preview` | Sirve `dist/` para revisar el build. |
| `npm run ci` | Lo mismo que corre GitHub Actions: `lint` + `build`. |

## Estructura del proyecto

```
RevelArte/
├── index.html              # Única página: estructura, contenido y sprite de íconos SVG
├── css/
│   └── styles.css          # Sistema de diseño (tokens), componentes y responsive
├── js/
│   └── main.js             # Interacciones (sin dependencias)
├── assets/
│   ├── brand/              # Logos oficiales, cruz, favicon y logo en cuero
│   ├── textures/           # Fondo de encabezado y metales cepillados (negro, plata, rojo)
│   └── portafolio/         # Fotografías reales del Book Matrimonios (optimizadas)
├── scripts/
│   ├── build.mjs           # Build de producción (esbuild + html-minifier-terser)
│   ├── check-assets.mjs    # Verificador de referencias
│   ├── run.mjs             # Encadena scripts de npm (multiplataforma)
│   └── serve.mjs           # Servidor estático de desarrollo
├── .github/workflows/ci.yml
├── eslint.config.js · .stylelintrc.json · .htmlvalidate.json · .editorconfig
├── README.md
└── TECNOLOGIAS.md
```

> La carpeta `Recursos/` (material fuente: PDF del book y originales en alta resolución, ~44 MB)
> está excluida del repositorio en `.gitignore`. Todo lo que usa la web ya está optimizado en `assets/`.

## Secciones de la página

| # | Sección | Ancla | Contenido |
| --- | --- | --- | --- |
| 1 | Hero | `#inicio` | Logo oficial sobre el fondo de encabezado, cotizador rápido, tarjetas destacadas |
| 2 | Franja animada | — | Nombres de los servicios en movimiento continuo |
| 3 | Nosotros | `#nosotros` | ¿Quiénes somos?, Misión y Visión (textos oficiales) |
| 4 | Servicios | `#servicios` | Los 11 servicios con filtro por categoría y botón **Cotizar** |
| 5 | Productos | `#productos` | Carrusel de productos destacados con filtro |
| 6 | Cifras | — | Datos derivados de los servicios, con contadores animados |
| 7 | Galería | `#galeria` | Fotos reales del Book Matrimonios, con scroll horizontal fijado |
| 8 | Proceso | `#proceso` | Escuchamos → Diseñamos → Producimos → Entregamos |
| 9 | Contacto | `#contacto` | Datos de contacto y formulario de cotización |

## Identidad visual

| Elemento | Valor |
| --- | --- |
| Rojo de marca (cruz del logo) | `#BE1522` (`--brand-red`) |
| Negro de marca | `#0C0C0C` (`--brand-black`) |
| Tipografía | Poppins 300–700 (Google Fonts), la misma de las piezas gráficas |
| Logo | `logo-negativo.png` (fondos oscuros) y `logo-positivo.png` (fondos claros) |
| Texturas | Pinceladas rojo/negro/blanco (hero), metal cepillado negro/plata (fondo), metal rojo (acentos) |
| Tema por defecto | Oscuro; el visitante puede cambiar a claro y se recuerda su elección |

Todos los colores se definen como **tokens** (variables CSS) al inicio de `css/styles.css`,
una vez para el tema claro (`:root`) y otra para el oscuro (`:root[data-theme="dark"]`).
Para ajustar un color en todo el sitio basta con cambiar el token.

## Interacciones y efectos

Todo está en `js/main.js`, organizado por bloques comentados:

- **Parallax**: fondo de metal, imagen del hero (scroll + movimiento del mouse), panel de cifras.
- **Carruseles** (productos y proceso): scroll-snap nativo, arrastre con mouse, flechas, puntos,
  teclado (← →) y autoplay que se pausa al pasar el mouse o al salir de pantalla.
- **Galería horizontal fijada**: avanza de lado mientras se hace scroll vertical.
- **Filtros**: por categoría en Servicios y en Productos, con animación de entrada.
- **Cotizador rápido** (hero) y botones **Cotizar**: rellenan el mensaje del formulario y llevan a Contacto.
- **Microinteracciones**: tarjetas con inclinación 3D y brillo, botones magnéticos, efecto *ripple*,
  reveal al hacer scroll, contadores animados, menú móvil, toasts, barra de progreso de lectura.
- **Tema claro/oscuro** con persistencia en `localStorage` (con manejo de errores si no está disponible).

## Cómo editar el contenido

| Quiero cambiar… | Dónde |
| --- | --- |
| Textos de cualquier sección | `index.html` (cada sección está marcada con un comentario `<!-- ====== NOMBRE ====== -->`) |
| Productos del carrusel | `js/main.js` → constante `PRODUCTS` (nombre, categoría, servicio, características, imagen) |
| Colores, radios, sombras | `css/styles.css` → bloque **Tokens** |
| Fotos de la galería | `assets/portafolio/` y la sección `#galeria` de `index.html` |
| Datos de contacto y redes | Sección `#contacto` y footer de `index.html` (marcado como `PENDIENTE`) |

Al añadir una imagen o un ícono nuevo, `npm run check:assets` confirma que la ruta sea correcta.

## Calidad: lint, CI y build

- **ESLint** (`eslint.config.js`): reglas recomendadas + `no-var`, `prefer-const`, `eqeqeq`.
- **Stylelint** (`.stylelintrc.json`): `stylelint-config-standard` con nombres de clase BEM.
  Se permiten solo los prefijos `-webkit-` necesarios para Safari (`backdrop-filter`, `mask-image`, `text-stroke`).
- **html-validate** (`.htmlvalidate.json`): reglas recomendadas. Los menús del cotizador son
  componentes accesibles propios (teclado + ARIA) y están marcados como excepción documentada.
- **check-assets**: falla si falta un archivo, si un ícono no existe o sobra, o si un ancla no tiene destino.
- **GitHub Actions** (`.github/workflows/ci.yml`): en cada *push* a `main` y en cada *pull request*
  instala dependencias, audita las dependencias de producción, corre todos los lint, genera el build
  y publica `dist/` como artefacto descargable.
- **Build** (`scripts/build.mjs`): minifica HTML, CSS y JS (esbuild + html-minifier-terser),
  añade *cache-busting* (`?v=hash`) y copia `assets/`.

| Archivo | Original | Build |
| --- | --- | --- |
| `index.html` | 45.4 KB | 37.1 KB |
| `styles.css` | 48.9 KB | 38.8 KB |
| `main.js` | 24.8 KB | 15.3 KB |

**Nota de seguridad:** `npm audit` reporta un aviso en `braces` (dependencia interna de Stylelint,
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) sin versión corregida publicada.
Solo afecta a la herramienta de desarrollo, no al sitio publicado (que no tiene dependencias).
Por eso el CI audita con `--omit=dev`.

## Despliegue

El resultado de `npm run build` (carpeta `dist/`) es estático y se puede publicar en cualquier hosting:
GitHub Pages, Netlify, Vercel, Cloudflare Pages o un hosting tradicional por FTP.
También se puede descargar `dist/` desde el artefacto **revelarte-dist** de cada ejecución del CI.

## Accesibilidad y rendimiento

- HTML semántico, navegación por teclado, `aria-*` en componentes interactivos y textos alternativos.
- Respeta `prefers-reduced-motion`: desactiva animaciones y parallax si el usuario lo pide.
- Imágenes con `loading="lazy"`, dimensiones declaradas en los logos y assets optimizados
  (logos de ~130 KB, fotos de 90–280 KB, fondo del hero de 640 KB).
- Sin dependencias en el navegador: solo la fuente Poppins se carga de Google Fonts.

## Pendientes

- [ ] Datos de contacto reales (correo, teléfono/WhatsApp, ciudad) y enlaces a redes sociales.
- [ ] Enlace a la tienda virtual de ropa cristiana (botón “Quiero saber más”).
- [ ] Conectar el formulario a un servicio de envío (Formspree, Netlify Forms, EmailJS o WhatsApp).
- [ ] Fotos reales de impresión, avisos, prendas y souvenirs para reemplazar las de banco del carrusel de productos.

---

© RevelArte · Diseño y Publicidad
