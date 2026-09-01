import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsPath = path.join(root, 'content', 'posts.json');
const draftsPath = path.join(root, 'content', 'drafts.json');
const futurePath = path.join(root, 'content', 'future-drafts-200.json');
const suspicious = /[A-Za-zÀ-ÿ]+\?+[A-Za-zÀ-ÿ?]+/g;

function runNode(script, args = [], env = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
}

test('published content contains no mojibake replacement tokens', async () => {
  const source = await readFile(postsPath, 'utf8');
  const matches = source.match(suspicious) || [];
  assert.deepEqual(matches, []);
});
test('validator rejects corrupted published text', async () => {
  const original = await readFile(postsPath, 'utf8');
  const posts = JSON.parse(original);
  posts[0].intro += ' Texto n?o permitido.';

  try {
    await writeFile(postsPath, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
    const result = runNode('scripts/validate.mjs');
    assert.notEqual(result.status, 0, result.stdout || result.stderr);
    assert.match(`${result.stdout}\n${result.stderr}`, /texto|conteúdo|mojibake|corromp/i);
  } finally {
    await writeFile(postsPath, original, 'utf8');
  }
});

test('legacy queue item remains publishable in dry-run', async () => {
  const originalDrafts = await readFile(draftsPath, 'utf8');
  const drafts = JSON.parse(originalDrafts);
  assert.ok(drafts[0], 'fixture base draft is required');
  const fixture = {
    ...drafts[0],
    slug: 'fixture-legacy-publishable',
    title: `${drafts[0].title} [fixture]`,
  };

  try {
    await writeFile(draftsPath, `${JSON.stringify([fixture], null, 2)}\n`, 'utf8');
    const result = runNode('scripts/publish-scheduled.mjs', ['--dry-run', '--once-per-day', '--force'], {
      PUBLISH_DATE: '2099-01-05',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /fixture-legacy-publishable/);
  } finally {
    await writeFile(draftsPath, originalDrafts, 'utf8');
  }
});
test('future draft is blocked unless explicitly approved', async () => {
  const originalDrafts = await readFile(draftsPath, 'utf8');
  const future = JSON.parse(await readFile(futurePath, 'utf8'));
  const candidate = future.find((post) => post.slug === 'tv-led-aceso-nao-acende-tela');
  assert.ok(candidate);

  try {
    await writeFile(draftsPath, `${JSON.stringify([candidate], null, 2)}\n`, 'utf8');
    const result = runNode('scripts/publish-scheduled.mjs', ['--dry-run', '--once-per-day', '--force'], {
      PUBLISH_DATE: '2099-01-06',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /bloquead|aprova/i);
    assert.doesNotMatch(result.stdout, /Publicaria 1 artigo/i);
  } finally {
    await writeFile(draftsPath, originalDrafts, 'utf8');
  }
});
test('publisher refuses batch publication larger than one article', () => {
  const result = runNode('scripts/publish-scheduled.mjs', ['--dry-run', '--count=2'], {
    PUBLISH_DATE: '2026-09-02',
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /count|1 artigo|uma publica/i);
});
test('validator rejects mojibake in generated HTML', async () => {
  const build = runNode('scripts/build.mjs');
  assert.equal(build.status, 0, build.stderr);
  const htmlPath = path.join(root, 'dist', 'index.html');
  const original = await readFile(htmlPath, 'utf8');
  try {
    await writeFile(htmlPath, `${original}\n<p>conte?do corrompido</p>`, 'utf8');
    const result = runNode('scripts/validate.mjs');
    assert.notEqual(result.status, 0, result.stdout || result.stderr);
    assert.match(`${result.stdout}\n${result.stderr}`, /texto|conteúdo|mojibake|corromp/i);
  } finally {
    await writeFile(htmlPath, original, 'utf8');
  }
});

test('generic future draft cannot be approved without structural rewrite', async () => {
  const approvalsPath = path.join(root, 'content', 'publishing-approvals.json');
  const original = await readFile(approvalsPath, 'utf8');
  try {
    await writeFile(approvalsPath, JSON.stringify({ approvedFutureSlugs: ['tv-led-aceso-nao-acende-tela'] }, null, 2));
    const result = runNode('scripts/validate.mjs');
    assert.notEqual(result.status, 0, result.stdout || result.stderr);
    assert.match(`${result.stdout}\n${result.stderr}`, /repet|estrutura|genéric/i);
  } finally {
    await writeFile(approvalsPath, original, 'utf8');
  }
});
test('validator checks service-page source quality', async () => {
  const servicePath = path.join(root, 'content', 'service-pages.json');
  const original = await readFile(servicePath, 'utf8');
  const pages = JSON.parse(original);
  delete pages[0].description;
  try {
    await writeFile(servicePath, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
    const result = runNode('scripts/validate.mjs');
    assert.notEqual(result.status, 0, result.stdout || result.stderr);
    assert.match(`${result.stdout}\n${result.stderr}`, /service|serviço|description|descrição/i);
  } finally {
    await writeFile(servicePath, original, 'utf8');
  }
});

test('published text has no leading or isolated replacement question marks', async () => {
  const source = await readFile(postsPath, 'utf8');
  assert.doesNotMatch(source, /\?[A-Za-zÀ-ÿ]|\s\?\s/);
});

test('encoding repair preserves contextual Portuguese words', async () => {
  const source = await readFile(postsPath, 'utf8');
  assert.doesNotMatch(source, /por três do painel/i);
  assert.match(source, /por trás do painel/i);
  assert.match(source, /áudio/i);
});

test('published FAQs do not contain duplicated device prefixes', async () => {
  const posts = JSON.parse(await readFile(postsPath, 'utf8'));
  const broken = posts
    .flatMap((post) => (post.faq || []).map((item) => item.question || ''))
    .filter((question) => /^(TV com tv|Micro-ondas com micro-ondas|conserto de (?:smart )?tv\b)/i.test(question));
  assert.deepEqual(broken, []);
});

test('published image captions do not append a period after question punctuation', async () => {
  const posts = JSON.parse(await readFile(postsPath, 'utf8'));
  const broken = posts
    .map((post) => post.image?.caption || post.imageCaption || '')
    .filter((caption) => /[?!]\.$/.test(caption));
  assert.deepEqual(broken, []);
});

test('editorial queues do not contain duplicated device prefixes', async () => {
  for (const file of ['drafts.json', 'future-drafts-200.json', 'future-drafts-blocked.json']) {
    const items = JSON.parse(await readFile(path.join(root, 'content', file), 'utf8'));
    const broken = items
      .flatMap((post) => (post.faq || []).map((item) => item.question || ''))
      .filter((question) => /^(TV com tv|Micro-ondas com micro-ondas|conserto de (?:smart )?tv\b)/i.test(question));
    assert.deepEqual(broken, [], file);
  }
});

test('editorial queues do not contain malformed image caption punctuation', async () => {
  for (const file of ['drafts.json', 'future-drafts-200.json', 'future-drafts-blocked.json']) {
    const items = JSON.parse(await readFile(path.join(root, 'content', file), 'utf8'));
    const broken = items
      .map((post) => post.image?.caption || post.imageCaption || '')
      .filter((caption) => /[?!]\.$/.test(caption));
    assert.deepEqual(broken, [], file);
  }
});

test('shared repair-question helper produces natural questions', async () => {
  const quality = await import('../scripts/content-quality.mjs');
  assert.equal(typeof quality.repairQuestionForPost, 'function');
  assert.equal(
    quality.repairQuestionForPost({ title: 'TV LED pisca e não liga: o que pode ser?', category: 'Conserto de TV' }),
    'TV LED pisca e não liga costuma ter conserto?',
  );
  assert.equal(
    quality.repairQuestionForPost({ title: 'Conserto de TV Philco em Santos: defeitos', category: 'Marcas de TV' }),
    'TV Philco com esse tipo de defeito costuma ter conserto?',
  );
  assert.equal(
    quality.repairQuestionForPost({ title: 'Conserto de TV no Campo Grande, Santos: como se organizar', category: 'SEO local' }),
    'Esse tipo de defeito na TV costuma ter conserto?',
  );
});

test('validator accepts legitimate query parameters in generated HTML', () => {
  const build = runNode('scripts/build.mjs');
  assert.equal(build.status, 0, build.stderr);
  const result = runNode('scripts/validate.mjs');
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('approval validates the queued revised draft instead of the future backup', async () => {
  const approvalsPath = path.join(root, 'content', 'publishing-approvals.json');
  const originalDrafts = await readFile(draftsPath, 'utf8');
  const originalApprovals = await readFile(approvalsPath, 'utf8');
  const drafts = JSON.parse(originalDrafts);
  const slug = 'tv-led-aceso-nao-acende-tela';
  const queued = drafts.find((post) => post.slug === slug);
  assert.ok(queued);
  queued.sections = queued.sections.map((section, index) => ({
    ...section,
    heading: `${section.heading} — revisão editorial ${index + 1}`,
  }));

  try {
    await writeFile(draftsPath, `${JSON.stringify(drafts, null, 2)}\n`, 'utf8');
    await writeFile(
      approvalsPath,
      `${JSON.stringify({ approvedFutureSlugs: [slug] }, null, 2)}\n`,
      'utf8',
    );
    const result = runNode('scripts/validate.mjs');
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  } finally {
    await writeFile(draftsPath, originalDrafts, 'utf8');
    await writeFile(approvalsPath, originalApprovals, 'utf8');
  }
});

test('publisher rejects an approved future draft while its queued structure is still generic', async () => {
  const approvalsPath = path.join(root, 'content', 'publishing-approvals.json');
  const originalDrafts = await readFile(draftsPath, 'utf8');
  const originalApprovals = await readFile(approvalsPath, 'utf8');
  const drafts = JSON.parse(originalDrafts);
  const slug = 'tv-led-aceso-nao-acende-tela';
  const candidate = drafts.find((post) => post.slug === slug);
  assert.ok(candidate);
  const reordered = [candidate, ...drafts.filter((post) => post.slug !== slug)];

  try {
    await writeFile(draftsPath, `${JSON.stringify(reordered, null, 2)}\n`, 'utf8');
    await writeFile(approvalsPath, `${JSON.stringify({ approvedFutureSlugs: [slug] }, null, 2)}\n`, 'utf8');
    const result = runNode('scripts/publish-scheduled.mjs', ['--dry-run', '--once-per-day', '--force'], {
      PUBLISH_DATE: '2099-01-07',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /estrutura|revis|genéric|bloquead/i);
    assert.doesNotMatch(result.stdout, /Publicaria 1 artigo/i);
  } finally {
    await writeFile(draftsPath, originalDrafts, 'utf8');
    await writeFile(approvalsPath, originalApprovals, 'utf8');
  }
});

test('publisher releases an approved future draft after queued structural revision', async () => {
  const approvalsPath = path.join(root, 'content', 'publishing-approvals.json');
  const originalDrafts = await readFile(draftsPath, 'utf8');
  const originalApprovals = await readFile(approvalsPath, 'utf8');
  const drafts = JSON.parse(originalDrafts);
  const slug = 'tv-led-aceso-nao-acende-tela';
  const candidate = drafts.find((post) => post.slug === slug);
  assert.ok(candidate);
  const revised = {
    ...candidate,
    sections: candidate.sections.map((section, index) => ({
      ...section,
      heading: `${section.heading} — revisão de publicação ${index + 1}`,
    })),
  };
  const reordered = [revised, ...drafts.filter((post) => post.slug !== slug)];

  try {
    await writeFile(draftsPath, `${JSON.stringify(reordered, null, 2)}\n`, 'utf8');
    await writeFile(approvalsPath, `${JSON.stringify({ approvedFutureSlugs: [slug] }, null, 2)}\n`, 'utf8');
    const result = runNode('scripts/publish-scheduled.mjs', ['--dry-run', '--once-per-day', '--force'], {
      PUBLISH_DATE: '2099-01-08',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Publicaria 1 artigo/i);
    assert.match(result.stdout, new RegExp(slug));
  } finally {
    await writeFile(draftsPath, originalDrafts, 'utf8');
    await writeFile(approvalsPath, originalApprovals, 'utf8');
  }
});
