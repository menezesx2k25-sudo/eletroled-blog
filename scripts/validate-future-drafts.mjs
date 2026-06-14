import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogBaseUrl = 'https://blog.consertoeletroled.com';
const allowedExternal = new Set([
  'https://consertoeletroled.com',
  'https://consertoeletroled.com/contato'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function readJsonIfExists(relativePath, fallback) {
  try {
    return await readJson(relativePath);
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

function wordCount(post) {
  return [
    post.intro,
    ...(post.sections || []).flatMap((section) => [section.heading, section.body]),
    ...(post.faq || []).flatMap((item) => [item.question, item.answer])
  ].join(' ').split(/\s+/).filter(Boolean).length;
}

function imageUrlOf(post) {
  return typeof post.image === 'string' ? post.image : post.image?.url || '';
}

function imageAltOf(post) {
  return post.imageAlt || (typeof post.image === 'object' ? post.image?.alt : '');
}

function internalPathname(url) {
  try {
    const parsed = new URL(url, blogBaseUrl);
    if (parsed.origin !== new URL(blogBaseUrl).origin) return '';
    return parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    return '';
  }
}

function titleScore(a, b) {
  const stop = new Set(['de', 'da', 'do', 'em', 'para', 'com', 'uma', 'um', 'que', 'como', 'quando', 'vale', 'santos']);
  const tokenize = (text) => new Set(String(text).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stop.has(word)));
  const first = tokenize(a);
  const second = tokenize(b);
  const intersection = [...first].filter((word) => second.has(word)).length;
  const union = new Set([...first, ...second]).size || 1;
  return intersection / union;
}

function countTerm(text, term) {
  return (String(text).toLowerCase().match(new RegExp(term.toLowerCase(), 'g')) || []).length;
}

function hasCorruptedEncoding(value) {
  return /[\u00c3\u00c2\ufffd]|&(?:[a-zA-Z]+|#\d+);|\?\?|[A-Za-z]\?[A-Za-z]/.test(String(value));
}

function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

async function localImageExists(url) {
  if (!url.startsWith('/')) return true;
  const localPath = path.join(root, url.replace(/^\//, ''));
  try {
    await access(localPath);
    return true;
  } catch {
    return false;
  }
}

const posts = await readJson('content/posts.json');
const drafts = await readJson('content/drafts.json');
const future = await readJson('content/future-drafts-200.json');
const blocked = await readJsonIfExists('content/future-drafts-blocked.json', []);
const scheduledSlugs = new Set([...posts, ...drafts].map((post) => post.slug));
const futureSlugSet = new Set(future.map((post) => post.slug));
const futureOnly = future.filter((post) => !scheduledSlugs.has(post.slug));
const blockedSlugs = new Set(blocked.map((post) => post.slug));
const all = [...posts, ...drafts, ...futureOnly];
const current = [...posts, ...drafts].filter((post) => !futureSlugSet.has(post.slug));
const allSlugs = new Set(all.map((post) => post.slug));
const errors = [];
const warnings = [];

function reportError(message) {
  errors.push(message);
}

function reportWarning(message) {
  warnings.push(message);
}

for (const post of blocked) {
  if (!futureSlugSet.has(post.slug)) reportError(`Bloqueado ausente do backup futuro: ${post.slug}`);
  if (scheduledSlugs.has(post.slug)) reportError(`Bloqueado entrou no schedule: ${post.slug}`);
}

for (const post of futureOnly) {
  if (!blockedSlugs.has(post.slug)) reportWarning(`${post.slug}: future draft fora do schedule sem registro em future-drafts-blocked.json`);
}

const slugGroups = groupBy(all, (post) => post.slug);
for (const [slug, items] of Object.entries(slugGroups)) {
  if (items.length > 1) reportError(`Slug duplicado: ${slug}`);
}

const titleGroups = groupBy(all, (post) => post.title.trim().toLowerCase());
for (const [title, items] of Object.entries(titleGroups)) {
  if (items.length > 1) reportError(`Title duplicado: ${title}`);
}

const imageGroups = groupBy(all, imageUrlOf);
for (const [image, items] of Object.entries(imageGroups)) {
  if (items.length > 3) reportError(`Imagem usada mais de 3 vezes: ${image} (${items.length})`);
}

for (let index = 0; index < future.length; index += 1) {
  const post = future[index];
  const text = [
    post.title,
    post.description,
    post.intro,
    ...(post.sections || []).flatMap((section) => [section.heading, section.body]),
    ...(post.faq || []).flatMap((item) => [item.question, item.answer])
  ].join(' ');
  const lower = text.toLowerCase();
  const serializedPost = JSON.stringify(post);

  if (!post.title || !post.slug || !post.category) reportError(`${post.slug || index}: title, slug ou category ausente`);
  if (hasCorruptedEncoding(serializedPost)) reportError(`${post.slug}: texto com possível encoding corrompido ou entidade HTML indevida`);
  if (!post.description || post.description.length < 120) reportError(`${post.slug}: description ausente ou curta`);
  if (!post.intro || post.intro.length < 160) reportError(`${post.slug}: intro ausente ou curta`);
  if (!Array.isArray(post.keywords) || post.keywords.length < 4) reportError(`${post.slug}: keywords insuficientes`);
  if (!Array.isArray(post.sections) || post.sections.length < 8) reportError(`${post.slug}: sections insuficientes`);
  if (!Array.isArray(post.faq) || post.faq.length < 4) reportError(`${post.slug}: FAQ insuficiente`);
  if (!post.cta?.text || !post.cta?.button || !post.cta?.whatsappText) reportError(`${post.slug}: CTA incompleto`);
  if (!Array.isArray(post.links) || post.links.length < 3) reportError(`${post.slug}: links insuficientes`);

  const words = wordCount(post);
  if (words < 700 || words > 950) reportError(`${post.slug}: ${words} palavras, fora de 700-950`);

  const image = imageUrlOf(post);
  const alt = imageAltOf(post);
  if (!image) reportError(`${post.slug}: image.url ausente`);
  if (!alt) reportError(`${post.slug}: imageAlt/alt ausente`);
  if (alt && countTerm(alt, 'santos') > 1) reportError(`${post.slug}: alt com possível keyword stuffing`);
  if (image && !await localImageExists(image)) reportError(`${post.slug}: imagem inexistente ${image}`);

  if (/autorizada|autorizado|oficial|representante oficial/i.test(text)) {
    if (!/sem comprovação|não se apresenta como autorizada oficial|serviço técnico independente|serviço independente/i.test(text)) {
      reportError(`${post.slug}: linguagem arriscada de autorizada/oficial`);
    }
  }

  if (countTerm(text, 'santos') > 18) reportError(`${post.slug}: repetição excessiva de Santos`);
  if (countTerm(text, 'eletroled') > 12) reportError(`${post.slug}: repetição excessiva de EletroLED`);

  for (const keyword of post.keywords || []) {
    if (String(keyword).length < 3 || /^[a-z]$/i.test(keyword)) reportError(`${post.slug}: keyword artificial ${keyword}`);
  }

  const self = `/${post.slug}/`;
  for (const link of post.links || []) {
    const url = link.url || '';
    const pathname = internalPathname(url);
    if (pathname === self) reportError(`${post.slug}: self-link em links editoriais`);
    if (pathname && pathname !== '/') {
      const targetSlug = pathname.replace(/^\/|\/$/g, '');
      if (!allSlugs.has(targetSlug)) reportError(`${post.slug}: link interno sem artigo planejado ${url}`);
    } else if (/^https?:\/\//i.test(url) && !allowedExternal.has(url)) {
      reportError(`${post.slug}: URL externa não permitida ${url}`);
    }
    if ((post.title + post.slug + post.category).toLowerCase().includes('micro') && url === '/quanto-custa-consertar-tv-santos/') {
      reportError(`${post.slug}: micro-ondas apontando para orçamento de TV`);
    }
  }

  const closest = current
    .map((item) => ({ slug: item.slug, score: titleScore(post.title, item.title) }))
    .sort((a, b) => b.score - a.score)[0];
  if (closest?.score >= 0.65) reportWarning(`${post.slug}: título parecido com ${closest.slug} (${closest.score.toFixed(2)})`);

  const windowStart = Math.max(0, index - 8);
  for (let cursor = windowStart; cursor < index; cursor += 1) {
    if (imageUrlOf(future[cursor]) === image) {
      reportWarning(`${post.slug}: imagem repetida próxima de ${future[cursor].slug}`);
    }
  }
}

if (warnings.length) {
  console.log('Avisos:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('Erros:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const avgWords = Math.round(future.reduce((sum, post) => sum + wordCount(post), 0) / future.length);
console.log(`Future drafts OK: ${future.length} novos artigos, ${all.length} planejados, média ${avgWords} palavras, ${Object.keys(imageGroups).length} imagens únicas.`);
