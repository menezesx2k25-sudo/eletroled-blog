import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'content', 'site.json'), 'utf8'));
const posts = JSON.parse(await readFile(path.join(root, 'content', 'posts.json'), 'utf8'));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true, force: true }).catch(() => {});

const now = new Date().toISOString();
const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
const siteOrigin = new URL(site.baseUrl).origin;

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

function absoluteAssetUrl(url = '') {
  if (/^https?:\/\//i.test(url)) return url;
  return absoluteUrl(url);
}

function whatsappUrl(text) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function seoTitle(title, suffix = 'EletroLED', maxLength = 65) {
  const shorteners = [
    [/^TV não liga em Santos:.+$/i, 'TV não liga em Santos: causas comuns'],
    [/^Micro-ondas não esquenta:.+$/i, 'Micro-ondas não esquenta: o que pode ser'],
    [/^TV com som mas sem imagem:.+$/i, 'TV com som mas sem imagem: backlight ou placa'],
    [/^Micro-ondas soltando faísca:.+$/i, 'Micro-ondas soltando faísca: é perigoso?'],
    [/^Conserto de TV Samsung em Santos:.+$/i, 'Conserto de TV Samsung em Santos'],
    [/^Conserto de TV LG em Santos:.+$/i, 'Conserto de TV LG em Santos: tela escura e sem imagem'],
    [/^Assistência técnica no Macuco:.+$/i, 'Assistência técnica no Macuco em Santos'],
    [/ em Santos: causas comuns e quando chamar assistência$/i, ' em Santos: causas comuns'],
    [/: o que pode ser e como resolver em Santos$/i, ': o que pode ser'],
    [/: tela escura, sem imagem e travamentos$/i, ': tela escura e sem imagem'],
    [/: conserto de TVs e micro-ondas perto de você$/i, ' em Santos'],
    [/: defeitos mais comuns$/i, ''],
    [/: é perigoso continuar usando\?$/i, ': é perigoso?']
  ];

  let baseTitle = title;
  for (const [pattern, replacement] of shorteners) {
    const nextTitle = baseTitle.replace(pattern, replacement);
    if (nextTitle !== baseTitle) {
      baseTitle = nextTitle;
      break;
    }
  }

  const maxBaseLength = maxLength - suffix.length - 3;
  if (`${baseTitle} | ${suffix}`.length > maxLength) {
    const candidate = baseTitle.slice(0, maxBaseLength - 3).trim();
    const separators = [': ', ' - ', ', ', ' '];
    const cutAt = Math.max(...separators.map((separator) => candidate.lastIndexOf(separator)));
    const truncatedTitle = cutAt >= Math.floor(maxBaseLength * 0.65)
      ? candidate.slice(0, cutAt).trim()
      : candidate;
    baseTitle = `${truncatedTitle}...`;
  }

  return `${baseTitle} | ${suffix}`;
}

function layout({ title, description, canonical, body, schema = [], keywords = [], image = site.defaultImage }) {
  const fullTitle = seoTitle(title);
  const keywordMeta = keywords.length ? `<meta name="keywords" content="${escapeHtml(keywords.join(', '))}">` : '';
  const metaImage = absoluteAssetUrl(image);
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
${keywordMeta ? `  ${keywordMeta}\n` : ''}  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(metaImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${escapeHtml(metaImage)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="${escapeHtml(site.logo)}">
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(site.siteName)}" href="${escapeHtml(absoluteUrl('feed.xml'))}">
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
  ${schema.map(jsonLd).join('\n  ')}
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/">
      <img class="brand-logo" src="${escapeHtml(site.logo)}" alt="Logo da EletroLED Assistência Técnica" width="64" height="64">
      <span>
        <strong>Blog EletroLED</strong>
        <small>TVs e micro-ondas em Santos</small>
      </span>
    </a>
    <nav aria-label="Navegação principal">
      <a href="/">Blog</a>
      <a href="${escapeHtml(site.mainSiteUrl)}">Site</a>
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
    <a class="button button-whatsapp" href="${escapeHtml(whatsappUrl('Olá, vim pelo blog da EletroLED e preciso de assistência técnica.'))}">Chamar no WhatsApp</a>
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
  logo: absoluteAssetUrl(site.logo),
  image: absoluteAssetUrl(site.defaultImage),
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

function textForPost(post) {
  return `${post.title} ${post.category} ${post.description} ${(post.keywords || []).join(' ')}`.toLowerCase();
}

function mediaImage(key) {
  const media = site.media?.[key] || site.media?.workbench || {
    url: site.defaultImage,
    alt: 'Assistência técnica da EletroLED em Santos',
    caption: 'Conteúdo informativo da EletroLED Assistência Técnica.',
    source: 'Mídia própria da EletroLED'
  };
  return media;
}

function pickPostImage(post) {
  if (typeof post.image === 'string' && post.image) {
    return {
      url: post.image,
      alt: post.imageAlt || `Imagem ilustrativa do artigo ${post.title}`,
      caption: post.imageCaption || 'Imagem ilustrativa de apoio ao artigo.',
      source: post.imageSource || 'Acervo visual da EletroLED'
    };
  }

  if (post.image?.url) {
    return {
      ...post.image,
      alt: post.imageAlt || post.image.alt || `Imagem ilustrativa do artigo ${post.title}`
    };
  }

  const text = textForPost(post);
  if (text.includes('samsung')) return mediaImage('samsung');
  if (text.includes('lg')) return mediaImage('lg');
  if (post.category === 'SEO local' || text.includes('bairro') || text.includes('macuco') || text.includes('gonzaga')) return mediaImage('workbench');
  if (text.includes('micro')) return mediaImage('microwave');
  return mediaImage('tv');
}

function ctaMessage(post) {
  return post.cta?.whatsappText || `Olá, li o artigo "${post.title}" e preciso de orientação da EletroLED. Meu aparelho é:`;
}

function internalPathname(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url, site.baseUrl);
    if (parsed.origin !== siteOrigin) return '';
    return parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    return '';
  }
}

function editorialLinksFor(post) {
  const links = Array.isArray(post.links) ? post.links : [];
  const selfPath = `/${post.slug}/`;
  const seen = new Set();

  return links.filter((link) => {
    const key = link.url || '';
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return internalPathname(key) !== selfPath;
  });
}

function keywordOverlap(a, b) {
  const first = new Set((a.keywords || []).map((keyword) => keyword.toLowerCase()));
  return (b.keywords || []).reduce((score, keyword) => score + (first.has(keyword.toLowerCase()) ? 1 : 0), 0);
}

function relatedPostsFor(post) {
  return sortedPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: (candidate.category === post.category ? 4 : 0) + keywordOverlap(post, candidate)
    }))
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, 3)
    .map((item) => item.post);
}

function renderArticleSections(post) {
  return post.sections.map((section, index) => {
    const sectionHtml = `<h2>${escapeHtml(section.heading)}</h2>\n<p>${escapeHtml(section.body)}</p>`;
    if (index !== 1) return sectionHtml;

    return `${sectionHtml}
        <div class="quick-cta">
          <div>
            <strong>${escapeHtml(post.cta?.quickTitle || 'Quer evitar tentativa no escuro?')}</strong>
            <p>${escapeHtml(post.cta?.quickText || 'Envie marca, modelo e sintoma pelo WhatsApp para receber orientação inicial da EletroLED.')}</p>
          </div>
          <a class="button button-whatsapp" href="${escapeHtml(whatsappUrl(ctaMessage(post)))}">${escapeHtml(post.cta?.button || 'Enviar aparelho no WhatsApp')}</a>
        </div>`;
  }).join('\n');
}

function renderEditorialLinks(post) {
  const links = editorialLinksFor(post);
  if (!links.length) return '';

  return `<section class="editorial-links" aria-labelledby="editorial-links-title">
          <h2 id="editorial-links-title">Leitura e atendimento relacionados</h2>
          <ul>
            ${links.slice(0, 5).map((link) => `<li><a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>${link.note ? ` <span>${escapeHtml(link.note)}</span>` : ''}</li>`).join('\n')}
          </ul>
        </section>`;
}

function renderRelatedPosts(post) {
  const related = relatedPostsFor(post);
  if (!related.length) return '';

  return `<section class="related-posts" aria-labelledby="related-title">
        <div>
          <p class="eyebrow">Continue lendo</p>
          <h2 id="related-title">Guias relacionados</h2>
        </div>
        <div class="related-grid">
          ${related.map((item) => `<a href="/${escapeHtml(item.slug)}/">
            <span>${escapeHtml(item.category)}</span>
            <strong>${escapeHtml(item.title)}</strong>
          </a>`).join('\n')}
        </div>
      </section>`;
}

function renderPostCard(post) {
  const image = pickPostImage(post);
  return `<article class="post-card">
    <a class="post-thumb" href="/${escapeHtml(post.slug)}/">
      <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" width="640" height="360" loading="lazy" decoding="async">
    </a>
    <div>
      <p class="eyebrow">${escapeHtml(post.category)}</p>
      <h3><a href="/${escapeHtml(post.slug)}/">${escapeHtml(post.title)}</a></h3>
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
  title: 'Dicas de TV e micro-ondas em Santos',
  description: site.description,
  canonical: absoluteUrl(),
  schema: [organizationSchema, homeSchema],
  keywords: ['conserto de TV em Santos', 'conserto de micro-ondas em Santos', 'assistência técnica em Santos'],
  body: `<main>
    <section class="hero">
      <div>
        <img class="hero-logo" src="${escapeHtml(site.logo)}" alt="EletroLED Assistência Técnica" width="140" height="140">
        <p class="eyebrow">Assistência técnica em Santos</p>
        <h1>Dicas úteis para cuidar da sua TV e do seu micro-ondas</h1>
        <p>Guias simples para identificar defeitos comuns, evitar riscos e saber quando chamar a EletroLED Assistência Técnica no Macuco, em Santos.</p>
        <div class="hero-actions">
          <a class="button button-whatsapp" href="${escapeHtml(whatsappUrl('Olá, vim pelo blog e preciso de ajuda com TV ou micro-ondas.'))}">Chamar no WhatsApp</a>
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
  const image = pickPostImage(post);
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
    image: absoluteAssetUrl(image.url),
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
      <figure class="article-figure">
        <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" width="1200" height="675" loading="eager" decoding="async">
        <figcaption>${escapeHtml(image.caption || image.source || 'Imagem de apoio da EletroLED Assistência Técnica.')}</figcaption>
      </figure>
      <section class="article-body">
        <p class="lead">${escapeHtml(post.intro)}</p>
        <p class="service-link">Para atendimento técnico, orçamento e orientação presencial, acesse o site da <a href="${escapeHtml(site.mainSiteUrl)}">EletroLED Assistência Técnica em Santos</a> ou chame direto no WhatsApp.</p>
        ${renderArticleSections(post)}
        ${renderEditorialLinks(post)}
      </section>
      <aside class="cta-panel">
        <div>
          <h2>${escapeHtml(post.cta?.title || 'Precisa de assistência em Santos?')}</h2>
          <p>${escapeHtml(post.cta?.text || 'Fale com a EletroLED pelo WhatsApp e informe marca, modelo e defeito aparente do aparelho.')}</p>
        </div>
        <a class="button button-whatsapp" href="${escapeHtml(whatsappUrl(ctaMessage(post)))}">${escapeHtml(post.cta?.button || 'Chamar no WhatsApp')}</a>
      </aside>
      ${renderRelatedPosts(post)}
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
    image: image.url,
    body
  });

  const postDir = path.join(dist, post.slug);
  await mkdir(postDir, { recursive: true });
  await writeFile(path.join(postDir, 'index.html'), html);
}

const notFound = layout({
  title: 'Página não encontrada',
  description: 'A página solicitada não foi encontrada no blog da EletroLED. Acesse os guias de TVs e micro-ondas ou fale com a assistência técnica em Santos.',
  canonical: absoluteUrl('404.html'),
  schema: [organizationSchema],
  body: `<main>
    <section class="hero">
      <div>
        <p class="eyebrow">Erro 404</p>
        <h1>Página não encontrada</h1>
        <p>O endereço acessado pode ter mudado ou sido digitado com erro. Use os links abaixo para continuar no blog da EletroLED ou falar com a assistência técnica em Santos.</p>
        <div class="hero-actions">
          <a class="button button-secondary" href="/">Ver artigos do blog</a>
          <a class="button button-whatsapp" href="${escapeHtml(whatsappUrl('Olá, vim pelo blog e preciso de ajuda com TV ou micro-ondas.'))}">Chamar no WhatsApp</a>
        </div>
      </div>
    </section>
  </main>`
});

await writeFile(path.join(dist, '404.html'), notFound);

const heroImage = site.defaultImage.replaceAll('"', '%22');

const styles = `:root {
  color-scheme: light;
  --ink: #111827;
  --muted: #626a78;
  --line: #e4e9f0;
  --paper: #ffffff;
  --soft: #f7f9fc;
  --brand: #247fd0;
  --brand-dark: #143454;
  --accent: #ee171f;
  --accent-soft: #fff1f2;
  --blue-soft: #eaf4ff;
  --whatsapp: #1fa855;
  --whatsapp-soft: #eaf8ef;
  --gold: #f5c542;
  --green: #09865c;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--soft);
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
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, .94);
  border-bottom: 1px solid rgba(20, 52, 84, .10);
  color: var(--ink);
  box-shadow: 0 10px 28px rgba(20, 52, 84, .08);
  backdrop-filter: blur(14px);
}

.site-footer {
  border-top: 1px solid var(--line);
  border-bottom: 0;
  margin-top: 64px;
  align-items: flex-start;
  background: #fff;
  color: var(--ink);
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

.brand-logo {
  width: 78px;
  height: 58px;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(20, 52, 84, .12));
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

nav a {
  color: var(--brand-dark);
  font-weight: 800;
  letter-spacing: 0;
  text-decoration: none;
  text-transform: uppercase;
}

nav a:hover,
nav a:focus {
  color: var(--brand);
}

.text-link,
.back-link {
  color: var(--brand);
  font-weight: 700;
  text-decoration: none;
}

.hero {
  min-height: clamp(440px, 64vh, 640px);
  display: flex;
  align-items: center;
  padding: clamp(48px, 8vw, 96px) clamp(18px, 4vw, 56px);
  background:
    linear-gradient(90deg, rgba(247, 249, 252, .95) 0%, rgba(247, 249, 252, .82) 48%, rgba(247, 249, 252, .28) 100%),
    url("${heroImage}") center / cover no-repeat;
  border-bottom: 1px solid var(--line);
  color: var(--brand-dark);
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

.hero h1 {
  text-shadow: none;
}

.hero p,
.article-header p {
  max-width: 760px;
  font-size: 1.18rem;
}

.hero p {
  color: #334155;
  text-shadow: none;
}

.article-header p {
  color: var(--muted);
}

.hero-logo {
  width: min(250px, 62vw);
  height: auto;
  margin-bottom: 22px;
  filter: drop-shadow(0 8px 16px rgba(20, 52, 84, .14));
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--brand);
  font-size: .82rem;
  font-weight: 800;
  letter-spacing: 0;
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
  box-shadow: 0 12px 26px rgba(36, 127, 208, .26);
}

.button-secondary {
  border: 1px solid rgba(36, 127, 208, .24);
  background: rgba(255, 255, 255, .94);
  color: var(--brand-dark);
  box-shadow: 0 12px 26px rgba(20, 52, 84, .16);
}

.button-whatsapp {
  background: var(--whatsapp);
  color: #fff;
  box-shadow: 0 12px 26px rgba(31, 168, 85, .24);
}

.posts-section {
  padding: 56px clamp(18px, 4vw, 56px);
  background: var(--soft);
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
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(20, 52, 84, .05);
}

.post-card > div,
.post-card > .text-link {
  margin: 0 24px;
}

.post-card > div {
  padding-top: 22px;
}

.post-card > .text-link {
  margin-bottom: 24px;
}

.post-thumb {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--blue-soft);
}

.post-thumb img,
.article-figure img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.post-card h3 {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.2;
}

.post-card h3 a {
  text-decoration: none;
}

.post-card p {
  color: var(--muted);
}

.article {
  padding: 48px clamp(18px, 4vw, 56px) 0;
  background: #fff;
}

.article-header {
  padding: 24px 0 30px;
  border-bottom: 1px solid var(--line);
  border-top: 4px solid var(--brand);
}

.article-figure {
  margin: 28px 0 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

.article-figure img {
  aspect-ratio: 16 / 9;
}

.article-figure figcaption {
  padding: 10px 14px;
  color: var(--muted);
  font-size: .92rem;
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
  background: var(--blue-soft);
  color: var(--brand-dark);
}

.article-body {
  max-width: 780px;
  padding-top: 28px;
}

.service-link {
  padding: 16px 18px;
  border-left: 4px solid var(--brand);
  background: var(--blue-soft);
  color: var(--brand-dark);
  font-weight: 700;
}

.service-link a {
  color: var(--brand);
}

.editorial-links {
  margin: 34px 0;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

.editorial-links h2 {
  margin: 0 0 12px;
  color: var(--brand-dark);
  font-size: 1.25rem;
}

.editorial-links ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding-left: 20px;
}

.editorial-links a {
  color: var(--brand);
  font-weight: 800;
  text-decoration: none;
}

.editorial-links span {
  color: var(--muted);
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
  color: var(--brand-dark);
}

.article-body p {
  color: #333947;
}

.quick-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #cfeedd;
  border-radius: 8px;
  background: var(--whatsapp-soft);
  box-shadow: 0 12px 28px rgba(31, 168, 85, .08);
}

.quick-cta p,
.quick-cta strong {
  margin: 0;
}

.cta-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 42px 0;
  padding: 24px;
  border-left: 5px solid var(--whatsapp);
  background: var(--whatsapp-soft);
}

.cta-panel h2,
.cta-panel p {
  margin: 0;
}

.related-posts {
  max-width: 900px;
  margin: 44px 0;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.related-posts h2 {
  margin: 0 0 18px;
  color: var(--brand-dark);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.related-grid a {
  min-height: 132px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  text-decoration: none;
}

.related-grid span {
  display: block;
  margin-bottom: 8px;
  color: var(--brand);
  font-size: .78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.related-grid strong {
  color: var(--brand-dark);
  line-height: 1.25;
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
  .cta-panel,
  .quick-cta {
    align-items: flex-start;
    flex-direction: column;
  }

  .post-grid,
  .related-grid {
    grid-template-columns: 1fr;
  }

  .hero h1,
  .article h1 {
    font-size: 2.4rem;
  }
}`;

await writeFile(path.join(dist, 'styles.css'), minifyCss(styles));

const llms = `# Blog EletroLED Assistência Técnica

> Conteúdo editorial sobre conserto de TVs e micro-ondas em Santos, mantido pela EletroLED Assistência Técnica.

## Site
- Blog: ${site.baseUrl}
- Site principal: ${site.mainSiteUrl}
- Sitemap: ${absoluteUrl('sitemap.xml')}
- Feed RSS: ${absoluteUrl('feed.xml')}

## Conteúdos publicados
${sortedPosts.map((post) => `- [${post.title}](${absoluteUrl(`${post.slug}/`)}): ${post.description}`).join('\n')}

## Contato comercial
- WhatsApp: https://wa.me/${site.whatsapp}
- E-mail: ${site.email}
- Endereço: ${site.address.streetAddress}, ${site.address.addressLocality} - ${site.address.addressRegion}
`;

await writeFile(path.join(dist, 'llms.txt'), llms);

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
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
`);

console.log(`Built ${sortedPosts.length} posts into ${dist}`);
