import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsPath = path.join(root, 'content', 'posts.json');
const draftsPath = path.join(root, 'content', 'drafts.json');
const timeZone = 'America/Sao_Paulo';

const args = new Set(process.argv.slice(2));
const countArg = process.argv.find((arg) => arg.startsWith('--count='));
const count = countArg ? Number(countArg.split('=')[1]) : 1;
const force = args.has('--force');
const dryRun = args.has('--dry-run');

function localNow() {
  if (process.env.PUBLISH_DATE) {
    return new Date(`${process.env.PUBLISH_DATE}T12:00:00-03:00`);
  }
  return new Date();
}

function localDateParts(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    }).formatToParts(date).map((part) => [part.type, part.value])
  );

  return {
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: parts.weekday
  };
}

function validatePost(post, source) {
  const required = ['title', 'slug', 'category', 'description', 'keywords', 'intro', 'sections', 'faq'];
  for (const field of required) {
    if (!post[field] || (Array.isArray(post[field]) && post[field].length === 0)) {
      throw new Error(`${source}: campo obrigatório ausente em ${post.slug || post.title}: ${field}`);
    }
  }

  if (!Array.isArray(post.sections) || post.sections.length < 4) {
    throw new Error(`${source}: ${post.slug} precisa ter pelo menos 4 seções`);
  }

  if (!Array.isArray(post.faq) || post.faq.length < 3) {
    throw new Error(`${source}: ${post.slug} precisa ter pelo menos 3 perguntas frequentes`);
  }
}

const now = localNow();
const { isoDate, weekday } = localDateParts(now);

if (!force && (weekday === 'Sat' || weekday === 'Sun')) {
  console.log(`Hoje é ${weekday} em ${timeZone}. Pausa de fim de semana: nenhum artigo publicado.`);
  process.exit(0);
}

if (!Number.isInteger(count) || count < 1 || count > 5) {
  throw new Error('Use --count com um número inteiro entre 1 e 5.');
}

const posts = JSON.parse(await readFile(postsPath, 'utf8'));
const drafts = JSON.parse(await readFile(draftsPath, 'utf8'));
const slugs = new Set(posts.map((post) => post.slug));
const published = [];

for (let index = 0; index < count && drafts.length; index += 1) {
  const draft = drafts.shift();
  validatePost(draft, 'drafts.json');

  if (slugs.has(draft.slug)) {
    throw new Error(`Slug duplicado: ${draft.slug}`);
  }

  const post = {
    ...draft,
    date: isoDate
  };

  validatePost(post, 'posts.json');
  posts.push(post);
  slugs.add(post.slug);
  published.push(post);
}

if (!published.length) {
  console.log('Nenhum rascunho disponível para publicar.');
  process.exit(0);
}

if (dryRun) {
  console.log(`[dry-run] Publicaria ${published.length} artigo(s) em ${isoDate}:`);
  for (const post of published) {
    console.log(`- ${post.slug}`);
  }
  process.exit(0);
}

await writeFile(postsPath, `${JSON.stringify(posts, null, 2)}\n`);
await writeFile(draftsPath, `${JSON.stringify(drafts, null, 2)}\n`);

console.log(`Publicados ${published.length} artigo(s) em ${isoDate}:`);
for (const post of published) {
  console.log(`- ${post.slug}`);
}
