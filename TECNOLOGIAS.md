# Tecnologías utilizadas

Resumen del stack del sitio de **RevelArte** y de por qué se eligió cada pieza.
La documentación general del proyecto está en el [README](README.md).

## En el navegador (lo que se publica)

| Tecnología | Uso |
| --- | --- |
| **HTML5** | Estructura semántica de una sola página (`header`, `main`, `section`, `article`, `footer`). |
| **CSS3 moderno** | Variables CSS (tokens), Grid, Flexbox, `clamp()`, `color-mix()`, `backdrop-filter` (efecto vidrio), `scroll-snap`, `position: sticky`, propiedades individuales de transformación (`translate`, `scale`), `@keyframes`, media queries y `prefers-reduced-motion`. |
| **JavaScript (ES2022, sin frameworks)** | `IntersectionObserver` (reveal, contadores, autoplay, sección activa), `requestAnimationFrame` (parallax en un solo bucle), Pointer Events (arrastre, tilt 3D, botones magnéticos), `localStorage` (tema), Web Share API / Clipboard API (compartir), `Intl.NumberFormat`. |
| **SVG** | Sprite de íconos propio con `<symbol>` + `<use>` (38 íconos, sin librerías) y texto circular de la insignia con `textPath`. |
| **Google Fonts – Poppins** | Tipografía de la marca (300–700). Es la única dependencia externa del sitio. |

No hay frameworks ni librerías en el navegador: el sitio pesa ~90 KB de código (minificado) más las imágenes.

## Herramientas de desarrollo

| Herramienta | Versión | Uso |
| --- | --- | --- |
| **Node.js** | ≥ 20 | Ejecuta los scripts de lint, build y el servidor local. |
| **npm** | 10 | Gestión de dependencias de desarrollo y scripts. |
| **ESLint** + `@eslint/js` + `globals` | 9 | Lint de JavaScript (configuración *flat*). |
| **Stylelint** + `stylelint-config-standard` | 17 / 40 | Lint de CSS, con nombres de clase BEM. |
| **html-validate** | 9 | Validación de HTML y accesibilidad básica. |
| **esbuild** | 0.28 | Minificación de CSS y JS para producción. |
| **html-minifier-terser** | 7 | Minificación de HTML (incluye el script en línea del tema). |
| **Scripts propios** (`scripts/`) | — | `build.mjs`, `check-assets.mjs`, `serve.mjs`, `run.mjs` (Node puro, sin dependencias extra). |
| **EditorConfig** | — | Formato común (UTF-8, LF, 2 espacios) en cualquier editor. |

## Integración continua

| Tecnología | Uso |
| --- | --- |
| **GitHub Actions** | Workflow `CI` en cada *push* a `main` y *pull request*: `npm ci` → auditoría → ESLint → Stylelint → html-validate → verificación de assets → build → artefacto `dist/`. |
| **Git + GitHub** | Control de versiones y repositorio. |

## Procesamiento de la identidad visual

Herramientas usadas una sola vez para preparar los archivos de `assets/` a partir de la carpeta `Recursos/`:

| Herramienta | Uso |
| --- | --- |
| **Python 3 + Pillow** | Recorte y optimización de logos, extracción de la cruz roja del logo, favicon, texturas y fotos (JPEG progresivo). |
| **PyMuPDF** | Extracción de las fotografías originales del PDF *Book Matrimonios*. |

## Compatibilidad

Navegadores modernos (Chrome, Edge, Firefox, Safari de los últimos ~3 años).
El build apunta a `chrome100`, `firefox100`, `safari15` y `edge100`.
