import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function build() {
  const result = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}

function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
}

test('build generates a dedicated barramento LED service page', async () => {
  build();
  const target = path.join(root, 'dist', 'troca-barramento-led-tv-santos', 'index.html');
  assert.equal(existsSync(target), true, 'service landing was not generated');
  if (!existsSync(target)) return;
  const html = await readFile(target, 'utf8');
  assert.match(html, /<link rel="canonical" href="https:\/\/blog\.consertoeletroled\.com\/troca-barramento-led-tv-santos\/">/);
  assert.ok(schemas(html).some((item) => item['@type'] === 'Service'));
});
test('home exposes WebSite and richer LocalBusiness structured data', async () => {
  build();
  const html = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
  const data = schemas(html);
  assert.ok(data.some((item) => item['@type'] === 'WebSite'));
  const business = data.find((item) => Array.isArray(item['@type']) && item['@type'].includes('LocalBusiness'));
  assert.ok(business);
  assert.ok(Array.isArray(business.openingHoursSpecification));
  assert.ok(business.contactPoint);
});

test('article exposes BreadcrumbList structured data', async () => {
  build();
  const html = await readFile(path.join(root, 'dist', 'tv-com-som-sem-imagem', 'index.html'), 'utf8');
  assert.ok(schemas(html).some((item) => item['@type'] === 'BreadcrumbList'));
});
test('Open Graph type distinguishes website from articles', async () => {
  build();
  const home = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
  const article = await readFile(path.join(root, 'dist', 'tv-com-som-sem-imagem', 'index.html'), 'utf8');
  assert.match(home, /<meta property="og:type" content="website">/);
  assert.match(article, /<meta property="og:type" content="article">/);
});
test('service page is discoverable in sitemap and contextually linked from TV content', async () => {
  build();
  const serviceUrl = 'https://blog.consertoeletroled.com/troca-barramento-led-tv-santos/';
  const sitemap = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
  assert.match(sitemap, new RegExp(serviceUrl.replaceAll('.', '\\.')));

  const article = await readFile(path.join(root, 'dist', 'tv-com-som-sem-imagem', 'index.html'), 'utf8');
  const pathMatches = article.match(/\/troca-barramento-led-tv-santos\//g) || [];
  assert.ok(pathMatches.length >= 2, 'expected navigation plus contextual service link');
  assert.match(article, /barramento LED|backlight/i);
});
test('sitemap is deterministic across identical rebuilds', async () => {
  build();
  const first = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
  await new Promise((resolve) => setTimeout(resolve, 20));
  build();
  const second = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
  assert.equal(second, first);
});
