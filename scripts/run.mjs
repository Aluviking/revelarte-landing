// Ejecuta varios scripts de npm en orden y se detiene en el primero que falle.
// Funciona igual en Windows (PowerShell/cmd), macOS y Linux.
// Uso: node scripts/run.mjs lint:js lint:css ...
import { spawnSync } from 'node:child_process';

for (const task of process.argv.slice(2)) {
  console.log(`\n▶ npm run ${task}`);
  const { status } = spawnSync('npm', ['run', task, '--silent'], { stdio: 'inherit', shell: true });
  if (status !== 0) {
    console.error(`\n✖ Falló: ${task}`);
    process.exit(status ?? 1);
  }
}
console.log('\n✔ Todo en orden');
