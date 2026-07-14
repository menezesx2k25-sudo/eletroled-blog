import { access, readdir, readFile } from 'node:fs/promises';
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

function internalPathname(url, baseUrl) {
  if (!url) return '';
  try {
    const parsed = new URL(url, baseUrl);
    if (parsed.origin !== new URL(baseUrl).origin) return '';
    return parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    return '';
  }
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

function validateCollection(posts, name, baseUrl) {
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
    const image = typeof post.image === 'string'
      ? { url: post.image, alt: post.imageAlt }
      : post.image;
    assert(image?.url && image?.alt, `${name}: ${post.slug} precisa de imagem com url e alt`);
    assert(!/\/(img\d+|foto-final|image-\d+|tv|banner\d*)\.(jpe?g|png|webp|svg)$/i.test(image.url), `${name}: ${post.slug} usa nome de imagem pouco descritivo`);
    assert(post.cta?.text && post.cta?.button && post.cta?.whatsappText, `${name}: ${post.slug} precisa de CTA contextual`);
    assert(Array.isArray(post.links) && post.links.length >= 2, `${name}: ${post.slug} precisa de links internos/contextuais`);
    const selfLinks = post.links.filter((link) => internalPathname(link.url, baseUrl) === `/${post.slug}/`);
    assert(!selfLinks.length, `${name}: ${post.slug} tem self-link em links internos/contextuais`);
  }
}

async function validateLocalImage(url, file) {
  if (!url.startsWith('/')) return;
  const localPath = path.join(dist, url.replace(/^\//, ''));
  try {
    await access(localPath);
  } catch {
    throw new Error(`${file}: imagem local ausente em ${url}`);
  }
}

const site = await readJson('content/site.json');
const posts = await readJson('content/posts.json');
const drafts = await readJson('content/drafts.json');
validateCollection(posts, 'posts.json', site.baseUrl);
validateCollection(drafts, 'drafts.json', site.baseUrl);

const allSlugs = new Set();
for (const post of [...posts, ...drafts]) {
  assert(!allSlugs.has(post.slug), `Slug repetido entre publicados e rascunhos: ${post.slug}`);
  allSlugs.add(post.slug);
}

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
assert(sitemap.includes('<urlset'), 'sitemap.xml não parece ser um sitemap XML');
assert(!sitemap.toLowerCase().includes('<html'), 'sitemap.xml contém HTML');

const gbpQueue = await readJson('dist/gbp/posts.json');
assert(gbpQueue && !Array.isArray(gbpQueue), 'gbp/posts.json precisa ser um objeto');
assert(Array.isArray(gbpQueue.posts), 'gbp/posts.json precisa usar o formato { "posts": [...] }');
assert(gbpQueue.posts.length === posts.length, 'gbp/posts.json não contém todos os posts publicados');

const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
const gbpIds = new Set();
for (const item of gbpQueue.posts) {
  assert(typeof item.id === 'string' && item.id.startsWith('blog:'), 'GBP: id inválido');
  assert(!gbpIds.has(item.id), `GBP: id duplicado ${item.id}`);
  gbpIds.add(item.id);

  const slug = item.id.slice('blog:'.length);
  const sourcePost = postsBySlug.get(slug);
  assert(sourcePost, `GBP: post de origem ausente para ${item.id}`);
  assert(item.id === `blog:${sourcePost.slug}`, `GBP: id instável em ${item.id}`);
  assert(item.source === 'blog', `GBP: source inválido em ${item.id}`);
  assert(typeof item.active === 'boolean', `GBP: active inválido em ${item.id}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(item.date), `GBP: date inválida em ${item.id}`);
  assert(item.date === sourcePost.date, `GBP: date divergente em ${item.id}`);
  assert(item.languageCode === 'pt-BR', `GBP: languageCode inválido em ${item.id}`);
  assert(
    typeof item.summary === 'string' && item.summary.length >= 40 && item.summary.length <= 1200,
    `GBP: summary inválido em ${item.id}`,
  );
  assert(item.topicType === 'STANDARD', `GBP: topicType inválido em ${item.id}`);
  assert(item.callToAction?.actionType === 'LEARN_MORE', `GBP: CTA inválido em ${item.id}`);
  assert(
    item.callToAction?.url === new URL(`${sourcePost.slug}/`, site.baseUrl).toString(),
    `GBP: URL do artigo inválida em ${item.id}`,
  );
  assert(item.media === undefined || Array.isArray(item.media), `GBP: media inválida em ${item.id}`);
  for (const media of item.media || []) {
    assert(media.mediaFormat === 'PHOTO', `GBP: mediaFormat inválido em ${item.id}`);
    assert(media.sourceUrl?.startsWith('https://'), `GBP: sourceUrl inválida em ${item.id}`);
  }
}

const files = await htmlFiles(dist);
let jsonLdCount = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert(!html.includes('consertoeletroled.com/servicos'), `${file}: link removido para /servicos voltou`);
  assert(html.includes('rel="canonical"'), `${file}: canonical ausente`);
  assert(html.includes('property="og:image"'), `${file}: og:image ausente`);
  assert(html.includes('name="twitter:image"'), `${file}: twitter:image ausente`);
  assert(/<img\b[^>]+\balt="[^"]+"/.test(html), `${file}: imagem sem alt detectada`);
  const matches = html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
  for (const match of matches) {
    const data = JSON.parse(match[1]);
    if (data['@type'] === 'BlogPosting') {
      assert(data.image && /^https?:\/\//.test(data.image), `${file}: BlogPosting.image ausente ou nao absoluto`);
    }
    jsonLdCount += 1;
  }

  for (const match of html.matchAll(/<img\b[^>]+\bsrc="([^"]+)"/g)) {
    await validateLocalImage(match[1], file);
  }
}

assert(jsonLdCount >= posts.length * 2, 'Poucos blocos JSON-LD gerados');
console.log(`Validação OK: ${posts.length} posts publicados, ${drafts.length} rascunhos, ${jsonLdCount} blocos JSON-LD e ${gbpQueue.posts.length} itens GBP.`);
