import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'content', 'site.json'), 'utf8'));
const posts = JSON.parse(await readFile(path.join(root, 'content', 'posts.json'), 'utf8'));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const now = new Date().toISOString();
const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function absoluteUrl(pathname = '') {
  const base = site.baseUrl.replace(/\/$/, '');
  const clean = pathname.replace(/^\//, '');
  return clean ? `${base}/${clean}` : base;
}

function whatsappUrl(text) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function layout({ title, description, canonical, body, schema = [], keywords = [] }) {
  const fullTitle = `${title} | ${site.businessName}`;
  const keywordMeta = keywords.length ? `<meta name="keywords" content="${escapeHtml(keywords.join(', '))}">` : '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${keywordMeta}
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(site.defaultImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(site.siteName)}" href="${escapeHtml(absoluteUrl('feed.xml'))}">
  <link rel="stylesheet" href="/styles.css">
  ${schema.map(jsonLd).join('\n  ')}
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/">
      <span class="brand-mark">EL</span>
      <span>
        <strong>Blog EletroLED</strong>
        <small>TVs e micro-ondas em Santos</small>
      </span>
    </a>
    <nav aria-label="Navegação principal">
      <a href="/">Blog</a>
      <a href="${escapeHtml(site.mainSiteUrl)}">Site</a>
      <a href="${escapeHtml(site.mainSiteUrl)}/servicos">Serviços</a>
      <a href="${escapeHtml(site.mainSiteUrl)}/contato">Contato</a>
    </nav>
  </header>
  ${body}
  <footer class="site-footer">
    <div>
      <strong>${escapeHtml(site.businessName)}</strong>
      <p>${escapeHtml(site.address.streetAddress)}, ${escapeHtml(site.address.addressLocality)} - ${escapeHtml(site.address.addressRegion)}, ${escapeHtml(site.address.postalCode)}</p>
      <p>${escapeHtml(site.hours)}</p>
    </div>
    <a class="button button-secondary" href="${escapeHtml(whatsappUrl('Olá, vim pelo blog da EletroLED e preciso de assistência técnica.'))}">Chamar no WhatsApp</a>
  </footer>
</body>
</html>`;
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${site.mainSiteUrl}/#business`,
  name: site.businessName,
  url: site.mainSiteUrl,
  logo: site.logo,
  image: site.defaultImage,
  telephone: site.phone,
  email: site.email,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    ...site.address
  },
  sameAs: site.sameAs,
  areaServed: ['Santos', 'Macuco', 'Gonzaga', 'Boqueirão', 'Embaré', 'Aparecida', 'Ponta da Praia', 'Vila Mathias']
};

function renderPostCard(post) {
  return `<article class="post-card">
    <div>
      <p class="eyebrow">${escapeHtml(post.category)}</p>
      <h2><a href="/${escapeHtml(post.slug)}/">${escapeHtml(post.title)}</a></h2>
      <p>${escapeHtml(post.description)}</p>
    </div>
    <a class="text-link" href="/${escapeHtml(post.slug)}/">Ler artigo</a>
  </article>`;
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${site.baseUrl}/#blog`,
  name: site.siteName,
  url: site.baseUrl,
  description: site.description,
  publisher: { '@id': `${site.mainSiteUrl}/#business` },
  blogPost: sortedPosts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    url: absoluteUrl(`${post.slug}/`),
    datePublished: post.date
  }))
};

const home = layout({
  title: 'Dicas sobre conserto de TVs e micro-ondas em Santos',
  description: site.description,
  canonical: absoluteUrl(),
  schema: [organizationSchema, homeSchema],
  keywords: ['conserto de TV em Santos', 'conserto de micro-ondas em Santos', 'assistência técnica em Santos'],
  body: `<main>
    <section class="hero">
      <div>
        <p class="eyebrow">Assistência técnica em Santos</p>
        <h1>Dicas úteis para cuidar da sua TV e do seu micro-ondas</h1>
        <p>Guias simples para identificar defeitos comuns, evitar riscos e saber quando chamar a EletroLED Assistência Técnica no Macuco, em Santos.</p>
        <div class="hero-actions">
          <a class="button" href="${escapeHtml(whatsappUrl('Olá, vim pelo blog e preciso de ajuda com TV ou micro-ondas.'))}">Chamar no WhatsApp</a>
          <a class="button button-secondary" href="${escapeHtml(site.mainSiteUrl)}">Ver site principal</a>
        </div>
      </div>
    </section>
    <section class="posts-section">
      <div class="section-heading">
        <p class="eyebrow">Artigos recentes</p>
        <h2>Problemas comuns, respostas diretas</h2>
      </div>
      <div class="post-grid">
        ${sortedPosts.map(renderPostCard).join('\n')}
      </div>
    </section>
  </main>`
});

await writeFile(path.join(dist, 'index.html'), home);

for (const post of sortedPosts) {
  const postUrl = absoluteUrl(`${post.slug}/`);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: site.defaultImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: site.businessName,
      url: site.mainSiteUrl
    },
    publisher: {
      '@id': `${site.mainSiteUrl}/#business`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    keywords: post.keywords
  };

  const body = `<main>
    <article class="article">
      <header class="article-header">
        <a class="back-link" href="/">Voltar ao blog</a>
        <p class="eyebrow">${escapeHtml(post.category)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(post.description)}</p>
        <div class="article-meta">
          <span>Atualizado em ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date(`${post.date}T12:00:00-03:00`))}</span>
          <span>${escapeHtml(site.address.addressLocality)}, ${escapeHtml(site.address.addressRegion)}</span>
        </div>
      </header>
      <section class="article-body">
        <p class="lead">${escapeHtml(post.intro)}</p>
        ${post.sections.map((section) => `<h2>${escapeHtml(section.heading)}</h2>\n<p>${escapeHtml(section.body)}</p>`).join('\n')}
      </section>
      <aside class="cta-panel">
        <div>
          <h2>Precisa de assistência em Santos?</h2>
          <p>Fale com a EletroLED pelo WhatsApp e informe marca, modelo e defeito aparente do aparelho.</p>
        </div>
        <a class="button" href="${escapeHtml(whatsappUrl(`Olá, li o artigo "${post.title}" e preciso de assistência técnica.`))}">Chamar no WhatsApp</a>
      </aside>
      <section class="faq">
        <h2>Perguntas frequentes</h2>
        ${post.faq.map((item) => `<details>\n<summary>${escapeHtml(item.question)}</summary>\n<p>${escapeHtml(item.answer)}</p>\n</details>`).join('\n')}
      </section>
    </article>
  </main>`;

  const html = layout({
    title: post.title,
    description: post.description,
    canonical: postUrl,
    schema: [organizationSchema, blogPostingSchema, faqSchema],
    keywords: post.keywords,
    body
  });

  const postDir = path.join(dist, post.slug);
  await mkdir(postDir, { recursive: true });
  await writeFile(path.join(postDir, 'index.html'), html);
}

const styles = `:root {
  color-scheme: light;
  --ink: #17151f;
  --muted: #625f70;
  --line: #dedbe8;
  --paper: #ffffff;
  --soft: #f4f2f8;
  --brand: #5627e8;
  --brand-dark: #321390;
  --accent: #e53131;
  --green: #0a7a55;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
}

.site-header,
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px clamp(18px, 4vw, 56px);
  border-bottom: 1px solid var(--line);
}

.site-footer {
  border-top: 1px solid var(--line);
  border-bottom: 0;
  margin-top: 64px;
  align-items: flex-start;
}

.site-footer p {
  margin: 4px 0;
  color: var(--muted);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  background: var(--ink);
  color: #fff;
  font-weight: 800;
  letter-spacing: 0;
  border-radius: 6px;
}

.brand small {
  display: block;
  color: var(--muted);
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

nav a,
.text-link,
.back-link {
  color: var(--brand-dark);
  font-weight: 700;
  text-decoration: none;
}

.hero {
  padding: clamp(48px, 8vw, 96px) clamp(18px, 4vw, 56px);
  background: linear-gradient(135deg, #ffffff 0%, #f3f6fb 55%, #f9eeee 100%);
  border-bottom: 1px solid var(--line);
}

.hero > div,
.posts-section,
.article {
  max-width: 1040px;
  margin: 0 auto;
}

.hero h1,
.article h1 {
  max-width: 900px;
  margin: 0;
  font-size: clamp(2.2rem, 7vw, 4.8rem);
  line-height: 1;
  letter-spacing: 0;
}

.hero p,
.article-header p {
  max-width: 760px;
  color: var(--muted);
  font-size: 1.18rem;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--accent);
  font-size: .82rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 6px;
  background: var(--brand);
  color: #fff;
  font-weight: 800;
  text-decoration: none;
}

.button-secondary {
  background: var(--soft);
  color: var(--brand-dark);
}

.posts-section {
  padding: 56px clamp(18px, 4vw, 56px);
}

.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(1.7rem, 4vw, 2.6rem);
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.post-card {
  display: flex;
  min-height: 270px;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

.post-card h2 {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.2;
}

.post-card h2 a {
  text-decoration: none;
}

.post-card p {
  color: var(--muted);
}

.article {
  padding: 48px clamp(18px, 4vw, 56px) 0;
}

.article-header {
  padding-bottom: 30px;
  border-bottom: 1px solid var(--line);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  color: var(--muted);
  font-size: .95rem;
}

.article-meta span {
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--soft);
}

.article-body {
  max-width: 780px;
  padding-top: 28px;
}

.lead {
  font-size: 1.2rem;
  color: var(--ink);
}

.article-body h2,
.faq h2,
.cta-panel h2 {
  margin-top: 34px;
  line-height: 1.2;
}

.article-body p {
  color: #33303c;
}

.cta-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 42px 0;
  padding: 24px;
  border-left: 5px solid var(--green);
  background: #eefaf4;
}

.cta-panel h2,
.cta-panel p {
  margin: 0;
}

.faq {
  max-width: 780px;
}

details {
  border-top: 1px solid var(--line);
  padding: 16px 0;
}

details:last-child {
  border-bottom: 1px solid var(--line);
}

summary {
  cursor: pointer;
  font-weight: 800;
}

@media (max-width: 760px) {
  .site-header,
  .site-footer,
  .cta-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .post-grid {
    grid-template-columns: 1fr;
  }

  .hero h1,
  .article h1 {
    font-size: 2.4rem;
  }
}`;

await writeFile(path.join(dist, 'styles.css'), styles);

const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('sitemap.xml')}
`;
await writeFile(path.join(dist, 'robots.txt'), robots);

const urls = [
  { loc: absoluteUrl(), priority: '1.0', lastmod: now },
  ...sortedPosts.map((post) => ({ loc: absoluteUrl(`${post.slug}/`), priority: '0.8', lastmod: `${post.date}T12:00:00-03:00` }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeHtml(url.loc)}</loc>
    <lastmod>${escapeHtml(url.lastmod)}</lastmod>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(site.siteName)}</title>
    <link>${escapeHtml(site.baseUrl)}</link>
    <description>${escapeHtml(site.description)}</description>
    <language>pt-BR</language>
${sortedPosts.map((post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${escapeHtml(absoluteUrl(`${post.slug}/`))}</link>
      <guid>${escapeHtml(absoluteUrl(`${post.slug}/`))}</guid>
      <pubDate>${new Date(`${post.date}T12:00:00-03:00`).toUTCString()}</pubDate>
      <description>${escapeHtml(post.description)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;
await writeFile(path.join(dist, 'feed.xml'), feed);

await writeFile(path.join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`);

console.log(`Built ${sortedPosts.length} posts into ${dist}`);
