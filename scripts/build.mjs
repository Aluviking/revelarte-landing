// Build de producción: minifica HTML, CSS y JS, añade cache-busting y copia los assets a dist/.
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';
import { minify } from 'html-minifier-terser';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const out = resolve(root, 'dist');
const read = (f) => readFileSync(resolve(root, f), 'utf8');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 8);
const target = ['chrome100', 'firefox100', 'safari15', 'edge100'];

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'css'), { recursive: true });
mkdirSync(join(out, 'js'), { recursive: true });

const css = (await transform(read('css/styles.css'), { loader: 'css', minify: true, target })).code;
const js = (await transform(read('js/main.js'), { loader: 'js', minify: true, target })).code;
writeFileSync(join(out, 'css/styles.css'), css);
writeFileSync(join(out, 'js/main.js'), js);

const html = await minify(
  read('index.html')
    .replace('href="css/styles.css"', `href="css/styles.css?v=${hash(css)}"`)
    .replace('src="js/main.js"', `src="js/main.js?v=${hash(js)}"`),
  {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    removeRedundantAttributes: true,
    minifyJS: true,
    minifyCSS: true
  }
);
writeFileSync(join(out, 'index.html'), html);
cpSync(resolve(root, 'assets'), join(out, 'assets'), { recursive: true });

// Resumen
const size = (p) => statSync(p).isDirectory()
  ? readdirSync(p).reduce((t, f) => t + size(join(p, f)), 0)
  : statSync(p).size;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log('✔ Build listo en dist/');
console.log(`  index.html  ${kb(size(join(out, 'index.html')))}  (original ${kb(size(resolve(root, 'index.html')))})`);
console.log(`  styles.css  ${kb(size(join(out, 'css/styles.css')))}  (original ${kb(size(resolve(root, 'css/styles.css')))})`);
console.log(`  main.js     ${kb(size(join(out, 'js/main.js')))}  (original ${kb(size(resolve(root, 'js/main.js')))})`);
console.log(`  assets/     ${kb(size(join(out, 'assets')))}`);
