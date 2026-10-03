// Verifica que todo lo referenciado exista: archivos locales, íconos del sprite y anclas internas.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const read = (f) => readFileSync(resolve(root, f), 'utf8');

const html = read('index.html');
const css = read('css/styles.css');
const js = read('js/main.js');
const errors = [];

// 1. Archivos locales (src/href en HTML, url() en CSS, rutas en JS)
const files = new Set();
for (const [, f] of html.matchAll(/(?:src|href)="(?!https?:|mailto:|tel:|#|data:)([^"?#]+)/g)) files.add(f);
for (const [, f] of css.matchAll(/url\(["']?(?!data:|https?:)([^"')]+)/g)) files.add(resolve(root, 'css', f).slice(root.length + 1));
for (const [, f] of js.matchAll(/['"`](assets\/[^'"`]+)['"`]/g)) files.add(f);
for (const f of files) {
  if (!existsSync(resolve(root, f))) errors.push(`Archivo no encontrado: ${f}`);
}

// 2. Íconos del sprite usados en HTML y JS
const symbols = new Set([...html.matchAll(/<symbol id="([\w-]+)"/g)].map((m) => m[1]));
for (const [, id] of (html + js).matchAll(/<use href="#([\w-]+)"/g)) {
  if (!symbols.has(id)) errors.push(`Ícono inexistente: #${id}`);
}
const used = new Set([...(html + js).matchAll(/<use href="#([\w-]+)"/g)].map((m) => m[1]));
for (const id of symbols) {
  if (!used.has(id)) errors.push(`Ícono definido pero sin uso: #${id}`);
}

// 3. Anclas internas (#seccion)
const ids = new Set([...html.matchAll(/\bid="([\w-]+)"/g)].map((m) => m[1]));
for (const [, id] of html.matchAll(/<a [^>]*href="#([\w-]+)"/g)) {
  if (!ids.has(id)) errors.push(`Ancla sin destino: #${id}`);
}

if (errors.length) {
  console.error(errors.map((e) => `✖ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✔ ${files.size} archivos, ${symbols.size} íconos y ${ids.size} anclas verificados`);
