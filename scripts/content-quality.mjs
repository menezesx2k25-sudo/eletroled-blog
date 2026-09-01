const suspiciousTokenPatterns = [
  /[A-Za-zÀ-ÿ]+\?+[A-Za-zÀ-ÿ?]+/g,
  /\?[A-Za-zÀ-ÿ]+/g,
  /\s\?\s/g,
];

export function findSuspiciousTokens(value) {
  const text = String(value);
  return suspiciousTokenPatterns.flatMap((pattern) => text.match(pattern) || []);
}

export function visibleHtmlText(html) {
  return String(html)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

export function structuralSignature(post) {
  return (post?.sections || [])
    .map((section) => String(section.heading || '').trim().toLocaleLowerCase('pt-BR'))
    .filter(Boolean)
    .join(' || ');
}

export function repairQuestionForPost(post) {
  if (/SEO local/i.test(post?.category || '')) {
    return /micro-ondas/i.test(post?.title || '')
      ? 'Esse tipo de defeito no micro-ondas costuma ter conserto?'
      : 'Esse tipo de defeito na TV costuma ter conserto?';
  }

  if (post?.category === 'Marcas de TV') {
    if (/Smart TV/i.test(post.title || '')) return 'Smart TV com esse tipo de defeito costuma ter conserto?';
    const match = String(post?.title || '').match(/\bTV\s+(.+?)(?:\s+em Santos|:|$)/i);
    const label = match?.[1]?.trim();
    return label
      ? `TV ${label} com esse tipo de defeito costuma ter conserto?`
      : 'Esse tipo de defeito na TV costuma ter conserto?';
  }

  const topic = String(post?.title || '')
    .replace(/\s+em Santos\b/gi, '')
    .replace(/[?!]+$/g, '')
    .split(':')[0]
    .trim();
  return `${topic} costuma ter conserto?`;
}

export function publicationDecision(
  draft,
  {
    futureSlugs = new Set(),
    approvedFutureSlugs = new Set(),
    blockedSlugs = new Set(),
    structuralSignatureCounts = new Map(),
  } = {},
) {
  if (!draft?.slug) {
    return { allowed: false, reason: 'Draft sem slug.' };
  }

  if (blockedSlugs.has(draft.slug)) {
    return { allowed: false, reason: `Draft ${draft.slug} está no bloqueio editorial por canibalização.` };
  }

  if (futureSlugs.has(draft.slug)) {
    if (!approvedFutureSlugs.has(draft.slug)) {
      return { allowed: false, reason: `Future draft ${draft.slug} aguarda aprovação editorial explícita.` };
    }
    const signature = structuralSignature(draft);
    if (!signature || structuralSignatureCounts.get(signature) !== 1) {
      return { allowed: false, reason: `Future draft ${draft.slug} ainda usa estrutura genérica/repetida e precisa de revisão editorial.` };
    }
  }

  return { allowed: true, reason: 'Draft liberado para publicação.' };
}
