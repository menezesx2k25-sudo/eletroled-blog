import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const siteOrigin = 'https://blog.consertoeletroled.com';
const problems = [];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else if (entry.name.endsWith('.html')) files.push(target);
  }
  return files;
}

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || '';
}

async function exists(target) {
  try { await access(target); return true; } catch { return false; }
}
function localTarget(urlPath) {
  const pathname = urlPath.split(/[?#]/, 1)[0];
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  if (!clean) return path.join(dist, 'index.html');
  const direct = path.join(dist, clean);
  return path.extname(direct) ? direct : path.join(direct, 'index.html');
}

const htmlFiles = await walk(dist);
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const titles = new Map();
const canonicals = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(dist, file).replaceAll('\\', '/');
  const title = firstMatch(html, /<title>(.*?)<\/title>/s);
  const description = firstMatch(html, /<meta name="description" content="([^"]*)"/s);
  const canonical = firstMatch(html, /<link rel="canonical" href="([^"]+)"/);
  const h1Count = (html.match(/<h1\b/g) || []).length;

  if (!title) problems.push(`${relative}: título ausente`);
  if (title.length > 70) problems.push(`${relative}: título com ${title.length} caracteres`);
  if (!description) problems.push(`${relative}: meta description ausente`);
  if (description && (description.length < 70 || description.length > 180)) problems.push(`${relative}: meta description com ${description.length} caracteres`);
  if (h1Count !== 1) problems.push(`${relative}: esperado 1 H1, encontrado ${h1Count}`);
  if (!canonical.startsWith(siteOrigin)) problems.push(`${relative}: canonical inválido ${canonical || '(ausente)'}`);
  titles.set(title, [...(titles.get(title) || []), relative]);
  canonicals.set(canonical, [...(canonicals.get(canonical) || []), relative]);

  if (relative !== '404.html' && canonical && !sitemap.includes(`<loc>${canonical}</loc>`)) {
    problems.push(`${relative}: canonical não está no sitemap`);
  }

  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1];
    if (href.startsWith('/assets/')) continue;
    if (!await exists(localTarget(href))) problems.push(`${relative}: link interno quebrado ${href}`);
  }

  for (const match of html.matchAll(/<img\b[^>]+src="(\/[^"?]*)"/g)) {
    const src = match[1];
    if (!await exists(path.join(dist, src.replace(/^\//, '')))) {
      problems.push(`${relative}: imagem local ausente ${src}`);
    }
  }
}

for (const [title, files] of titles) {
  if (title && files.length > 1) problems.push(`título duplicado: ${title} => ${files.join(', ')}`);
}
for (const [canonical, files] of canonicals) {
  if (canonical && files.length > 1) problems.push(`canonical duplicado: ${canonical} => ${files.join(', ')}`);
}
if (problems.length) {
  console.error(`Auditoria estrutural encontrou ${problems.length} problema(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Auditoria estrutural OK: ${htmlFiles.length} páginas HTML, títulos/canonicals únicos, links internos e imagens locais válidos.`);
