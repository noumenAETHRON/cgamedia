import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const skip = new Set(['node_modules', 'dist', '.git', '.astro']);
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}

walk(root);

const textFiles = files.filter((path) => /\.(astro|ts|mjs|js|md|json|css|txt|html)$/.test(path));
const banned = ['PH', 'PM'].join('');
const problems = [];

for (const path of textFiles) {
  const text = readFileSync(path, 'utf8');
  if (text.toLowerCase().includes(banned.toLowerCase())) {
    problems.push(`${path} contiene una marca que no debe aparecer`);
  }
  if (path.endsWith(`${join('src', 'config', 'site.ts')}`)) continue;
  if (/https?:\/\/[^\s)'"`]*TODO/.test(text)) {
    problems.push(`${path} tiene una URL con TODO. Déjala solo en src/config/site.ts`);
  }
}

const site = readFileSync(join(root, 'src/config/site.ts'), 'utf8');
const sobre = readFileSync(join(root, 'src/pages/sobre.astro'), 'utf8');
const footer = readFileSync(join(root, 'src/components/Disclaimer.astro'), 'utf8');
const credential =
  'BBA (Finance) candidate · International Advanced Wealth Manager, Level 4 · UK graduate · Founder, CGA';
const disclaimer =
  'Contenido educativo, no es asesoramiento financiero ni recomendación de inversión';

if (!site.includes(credential)) problems.push('Falta la credencial exacta en site.ts');
if (!sobre.includes('founder.credential')) problems.push('sobre.astro no muestra founder.credential');
if (!site.includes(disclaimer)) problems.push('Falta el disclaimer exacto en site.ts');
if (!footer.includes('{disclaimer}')) problems.push('El aviso no usa la constante disclaimer');
if (!site.includes('TODO')) problems.push('site.ts debería marcar los pendientes con TODO');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(`Revisión de contenido ok (${textFiles.length} archivos).`);
