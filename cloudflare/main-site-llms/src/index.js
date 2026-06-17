const LLMS_TXT = `# EletroLED Assistência Técnica

> Assistência técnica em Santos para conserto de TVs e micro-ondas, com atendimento local no Macuco.

## Site principal
- Página inicial: https://consertoeletroled.com/
- Serviços: https://consertoeletroled.com/servicos
- Dicas: https://consertoeletroled.com/dicas-sobre-tvs-e-micro-ondas
- Contato: https://consertoeletroled.com/contato

## Blog editorial
- Blog: https://blog.consertoeletroled.com/
- Sitemap do blog: https://blog.consertoeletroled.com/sitemap.xml
- RSS do blog: https://blog.consertoeletroled.com/feed.xml

## Serviços principais
- Conserto de TVs em Santos.
- Conserto de micro-ondas em Santos.
- Diagnóstico técnico para aparelhos que não ligam, não aquecem, ficam sem imagem, apresentam ruídos, travamentos ou falhas de painel.
- Atendimento para clientes em Santos e região, com foco em orientação técnica clara antes do orçamento.

## Dados comerciais
- Nome: EletroLED Assistência Técnica
- Endereço: Av. Siqueira Campos, 148 - Macuco, Santos - SP, 11015-300
- WhatsApp: https://wa.me/5513996816561
- E-mail: contato@consertoeletroled.com
- Horário: segunda a sexta, 09:00 às 17:30; sábado, 09:00 às 14:00.
`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== '/llms.txt') {
      return patchHtmlPage(request, url);
    }

    return new Response(LLMS_TXT, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
};

async function patchHtmlPage(request, url) {
  const response = await fetch(request);
  const contentType = response.headers.get('Content-Type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();

  if (url.pathname === '/') {
    html = ensureHomeImageAlt(html);
  }

  if (url.pathname === '/dicas-sobre-tvs-e-micro-ondas') {
    html = promoteDicasHeading(html);
  }

  if (url.pathname === '/servicos') {
    html = fixServicosTitle(html);
  }

  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.delete('Content-Length');
  headers.set('Content-Type', 'text/html; charset=utf-8');

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function promoteDicasHeading(html) {
  return html
    .replaceAll('.eletroled-dicas h2', '.eletroled-dicas h1')
    .replace(
      '<h2 id="eletroled-dicas-title">Dicas para cuidar da sua TV e do seu micro-ondas</h2>',
      '<h1 id="eletroled-dicas-title">Dicas para cuidar da sua TV e do seu micro-ondas</h1>'
    );
}

function fixServicosTitle(html) {
  return html.replaceAll(
    'Conserto de TV&#39;s e Micro-ondas em Santos. | EletroLED',
    'Conserto de TVs e Micro-ondas em Santos | EletroLED'
  );
}

function ensureHomeImageAlt(html) {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const alt = imageAltFor(tag);
    if (/\salt\s*=\s*(['"])\s*\1/i.test(tag)) {
      return tag.replace(/\salt\s*=\s*(['"])\s*\1/i, ` alt="${alt}"`);
    }
    if (/\salt(?=\s|>)/i.test(tag) && !/\salt\s*=/i.test(tag)) {
      return tag.replace(/\salt(?=\s|>)/i, ` alt="${alt}"`);
    }
    if (/\salt\s*=/i.test(tag)) return tag;
    return tag.replace(/<img\b/i, `<img alt="${alt}"`);
  });
}

function imageAltFor(tag) {
  if (/samsung/i.test(tag)) return 'Logo Samsung em página de assistência técnica da EletroLED';
  if (/lg-logo/i.test(tag)) return 'Logo LG em página de assistência técnica da EletroLED';
  if (/aoc-logo/i.test(tag)) return 'Logo AOC em página de assistência técnica da EletroLED';
  if (/panasonic/i.test(tag)) return 'Logo Panasonic em página de assistência técnica da EletroLED';
  if (/philco/i.test(tag)) return 'Logo Philco em página de assistência técnica da EletroLED';
  if (/tcl/i.test(tag)) return 'Logo TCL em página de assistência técnica da EletroLED';
  if (/micro|microwave/i.test(tag)) return 'Micro-ondas atendido pela assistência técnica EletroLED em Santos';
  return 'Assistência técnica EletroLED para TVs e micro-ondas em Santos';
}
