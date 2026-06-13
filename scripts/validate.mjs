import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await htmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateCollection(posts, name) {
  const slugs = new Set();
  for (const post of posts) {
    assert(post.title && post.slug && post.description, `${name}: título, slug ou descrição ausente`);
    assert(!slugs.has(post.slug), `${name}: slug duplicado ${post.slug}`);
    slugs.add(post.slug);
    assert(Array.isArray(post.keywords) && post.keywords.length >= 4, `${name}: ${post.slug} precisa de keywords`);
    assert(Array.isArray(post.sections) && post.sections.length >= 4, `${name}: ${post.slug} precisa de 4 seções`);
    assert(Array.isArray(post.faq) && post.faq.length >= 3, `${name}: ${post.slug} precisa de FAQ`);
    const text = `${post.intro || ''} ${post.sections.map((section) => `${section.heading} ${section.body}`).join(' ')} ${post.faq.map((item) => `${item.question} ${item.answer}`).join(' ')}`;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minimumWords = name === 'drafts.json' ? 500 : 200;
    assert(wordCount >= minimumWords, `${name}: ${post.slug} tem apenas ${wordCount} palavras`);
    if (name === 'drafts.json') {
      assert(post.sections.length >= 8, `${name}: ${post.slug} precisa de pelo menos 8 seções`);
    }
    if (post.image) {
      assert(post.image.url && post.image.alt, `${name}: ${post.slug} tem imagem incompleta`);
    }
  }
}

const posts = await readJson('content/posts.json');
const drafts = await readJson('content/drafts.json');
validateCollection(posts, 'posts.json');
validateCollection(drafts, 'drafts.json');

const allSlugs = new Set();
for (const post of [...posts, ...drafts]) {
  assert(!allSlugs.has(post.slug), `Slug repetido entre publicados e rascunhos: ${post.slug}`);
  allSlugs.add(post.slug);
}

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
assert(sitemap.includes('<urlset'), 'sitemap.xml não parece ser um sitemap XML');
assert(!sitemap.toLowerCase().includes('<html'), 'sitemap.xml contém HTML');

const files = await htmlFiles(dist);
let jsonLdCount = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert(!html.includes('consertoeletroled.com/servicos'), `${file}: link removido para /servicos voltou`);
  assert(html.includes('rel="canonical"'), `${file}: canonical ausente`);
  const matches = html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
  for (const match of matches) {
    JSON.parse(match[1]);
    jsonLdCount += 1;
  }
}

assert(jsonLdCount >= posts.length * 2, 'Poucos blocos JSON-LD gerados');
console.log(`Validação OK: ${posts.length} posts publicados, ${drafts.length} rascunhos, ${jsonLdCount} blocos JSON-LD.`);
