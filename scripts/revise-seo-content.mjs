import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsPath = path.join(root, 'content', 'posts.json');
const draftsPath = path.join(root, 'content', 'drafts.json');
const assetsDir = path.join(root, 'assets', 'images', 'seo');

const mainSite = 'https://consertoeletroled.com';
const contactUrl = `${mainSite}/contato`;
const blogHome = '/';

function readJson(file) {
  return readFile(file, 'utf8').then(JSON.parse);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function wordCount(post) {
  const text = [
    post.intro,
    ...(post.sections || []).flatMap((section) => [section.heading, section.body]),
    ...(post.faq || []).flatMap((item) => [item.question, item.answer])
  ].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

function stats(items) {
  const counts = items.map(wordCount);
  const sum = counts.reduce((total, value) => total + value, 0);
  return {
    count: items.length,
    min: Math.min(...counts),
    max: Math.max(...counts),
    avg: Math.round((sum / counts.length) * 10) / 10
  };
}

function imageUrlOf(post) {
  if (typeof post.image === 'string') return post.image;
  return post.image?.url || '';
}

function imageAltOf(post) {
  if (post.imageAlt) return post.imageAlt;
  return post.image?.alt || '';
}

function groupBy(items, callback) {
  return items.reduce((groups, item) => {
    const key = callback(item);
    groups[key] ||= [];
    groups[key].push(item);
    return groups;
  }, {});
}

function problemFromTitle(title) {
  return title
    .replace(/\s+em Santos\b/gi, '')
    .replace(/\s*\?.*$/g, '')
    .replace(/\s*:\s*/g, ': ')
    .trim();
}

function kindOf(post) {
  const text = `${post.title} ${post.slug} ${post.category}`.toLowerCase();
  if (post.category === 'SEO local') return 'local';
  if (post.category === 'Conserto de micro-ondas') return 'micro';
  if (post.category === 'Conserto de TV') return 'tv';
  if (post.category === 'Marcas de TV') return 'brand';
  if (post.category === 'Guias e orçamento' || post.category === 'Orçamento') return 'budget';
  if (text.includes('gonzaga') || text.includes('boqueirao') || text.includes('boqueirão') || text.includes('embare') || text.includes('embaré') || text.includes('macuco') || text.includes('ponta-da-praia') || text.includes('vila-mathias')) return 'local';
  if (text.includes('microondas') || text.includes('micro-ondas')) return 'micro';
  if (text.includes('orcamento') || text.includes('vale-a-pena') || text.includes('orçamento')) return 'budget';
  if (text.includes('samsung') || text.includes('lg') || text.includes('philco') || text.includes('aoc') || text.includes('tcl') || text.includes('panasonic') || text.includes('sony') || text.includes('philips') || text.includes('semp') || text.includes('cce')) return 'brand';
  return 'tv';
}

function isMicroTopic(post) {
  const text = `${post.title} ${post.slug} ${post.category} ${post.description || ''} ${(post.keywords || []).join(' ')}`.toLowerCase();
  return text.includes('microondas') || text.includes('micro-ondas');
}

function asset(url, alt, caption, source = 'Ilustração vetorial própria criada para o blog da EletroLED') {
  return {
    url: `/assets/images/seo/${url}`,
    alt,
    caption,
    source
  };
}

const imagePools = {
  tv: [
    asset('tv-nao-liga-santos.svg', 'TV desligada em bancada de manutenção', 'Ilustração de TV em análise para falha de energia.'),
    asset('tv-som-sem-imagem-santos.svg', 'TV com tela escura e som em avaliação', 'Ilustração de televisor com tela sem imagem.'),
    asset('tv-led-pisca-santos.svg', 'Televisor com LED de standby piscando', 'Ilustração de TV com falha de standby.'),
    asset('tv-backlight-santos.svg', 'Painel de TV com falha de iluminação', 'Ilustração de diagnóstico de backlight em TV LED.'),
    asset('tv-hdmi-santos.svg', 'Entrada HDMI de TV em verificação técnica', 'Ilustração de conexão HDMI em análise.'),
    asset('tv-linhas-tela-santos.svg', 'TV com linhas na tela em bancada', 'Ilustração de falha visual em painel de TV.'),
    asset('tv-smart-tv-santos.svg', 'Smart TV com sistema travado em avaliação', 'Ilustração de Smart TV em diagnóstico.'),
    asset('tv-queda-energia-santos.svg', 'TV com possível dano por queda de energia', 'Ilustração de avaliação após oscilação elétrica.'),
    asset('tv-marcas-santos.svg', 'Televisor de marca variada em bancada técnica', 'Ilustração institucional para atendimento de TVs.'),
    asset('tv-audio-santos.svg', 'TV com falha de áudio em avaliação técnica', 'Ilustração de diagnóstico de som em TV.'),
    asset('tv-painel-santos.svg', 'Painel de TV em análise técnica', 'Ilustração de avaliação de painel de televisor.'),
    asset('tv-controle-remoto-santos.svg', 'TV e controle remoto em verificação', 'Ilustração de teste de controle e sensor da TV.'),
    asset('tv-entrada-antena-santos.svg', 'Entrada de antena de TV em diagnóstico', 'Ilustração de conexão de antena em televisor.'),
    asset('tv-diagnostico-santos.svg', 'Televisor em diagnóstico técnico', 'Ilustração genérica de diagnóstico de TV.'),
    asset('tv-orcamento-tecnico-santos.svg', 'TV em avaliação para orçamento técnico', 'Ilustração de orçamento técnico de TV.'),
    asset('bancada-diagnostico-eletronico.svg', 'Bancada de diagnóstico eletrônico', 'Ilustração de bancada técnica para eletrônicos.')
  ],
  micro: [
    asset('microondas-nao-esquenta-santos.svg', 'Micro-ondas com painel aceso em avaliação técnica', 'Ilustração de micro-ondas que liga e não aquece.'),
    asset('microondas-faisca-santos.svg', 'Micro-ondas com sinal de faísca em manutenção segura', 'Ilustração de alerta para faísca em micro-ondas.'),
    asset('microondas-painel-santos.svg', 'Painel de micro-ondas em diagnóstico', 'Ilustração de painel eletrônico de micro-ondas.'),
    asset('microondas-prato-santos.svg', 'Prato de micro-ondas em verificação', 'Ilustração de sistema giratório de micro-ondas.'),
    asset('microondas-alta-tensao-santos.svg', 'Micro-ondas com aviso de alta tensão', 'Ilustração de cuidado técnico com alta tensão.'),
    asset('microondas-porta-santos.svg', 'Porta de micro-ondas em avaliação de segurança', 'Ilustração de trava e porta de micro-ondas.'),
    asset('microondas-magnetron-santos.svg', 'Micro-ondas em diagnóstico de aquecimento', 'Ilustração de componentes internos de aquecimento.'),
    asset('microondas-orcamento-santos.svg', 'Micro-ondas em análise para orçamento', 'Ilustração de orçamento para reparo de micro-ondas.'),
    asset('assistencia-tecnica-microondas-santos.svg', 'Micro-ondas sobre bancada de assistência técnica', 'Ilustração institucional para manutenção de micro-ondas.')
  ],
  brand: [
    asset('tv-samsung-santos.svg', 'TV Samsung em serviço independente de diagnóstico', 'Ilustração para conteúdo sobre TVs Samsung.'),
    asset('tv-lg-santos.svg', 'TV LG em serviço independente de diagnóstico', 'Ilustração para conteúdo sobre TVs LG.'),
    asset('tv-philco-santos.svg', 'TV Philco em avaliação técnica independente', 'Ilustração para conteúdo sobre TVs Philco.'),
    asset('tv-panasonic-santos.svg', 'TV Panasonic em avaliação técnica independente', 'Ilustração para conteúdo sobre TVs Panasonic.'),
    asset('tv-aoc-tcl-santos.svg', 'TV AOC ou TCL em bancada de manutenção', 'Ilustração para conteúdo sobre TVs AOC e TCL.'),
    asset('tv-sony-philips-santos.svg', 'TV Sony ou Philips em diagnóstico independente', 'Ilustração para conteúdo sobre TVs Sony e Philips.')
  ],
  budget: [
    asset('orcamento-conserto-tv-santos.svg', 'Orçamento de conserto de TV em análise', 'Ilustração de orçamento técnico para TV.'),
    asset('orcamento-conserto-microondas-santos.svg', 'Orçamento de conserto de micro-ondas em análise', 'Ilustração de orçamento técnico para micro-ondas.'),
    asset('orcamento-assistencia-santos.svg', 'Atendimento técnico para orçamento de eletrônico', 'Ilustração institucional de atendimento e orçamento.'),
    asset('assistencia-tecnica-santos.svg', 'Técnico analisando aparelho eletrônico', 'Ilustração de assistência técnica em Santos.'),
    asset('bancada-diagnostico-eletronico.svg', 'Bancada de diagnóstico eletrônico', 'Ilustração de bancada técnica para eletrônicos.')
  ],
  local: [
    asset('assistencia-tecnica-macuco-santos.svg', 'Atendimento técnico no Macuco em Santos', 'Ilustração institucional de assistência técnica no Macuco.'),
    asset('assistencia-baixada-santista.svg', 'Atendimento técnico na Baixada Santista', 'Ilustração institucional para atendimento local.'),
    asset('assistencia-tecnica-santos.svg', 'Atendimento técnico em Santos', 'Ilustração de assistência técnica local.'),
    asset('assistencia-tecnica-bairros-santos.svg', 'Atendimento técnico em bairros de Santos', 'Ilustração institucional de atendimento em bairros de Santos.'),
    asset('atendimento-macuco-santos.svg', 'Orientação de atendimento técnico no Macuco', 'Ilustração de orientação para atendimento no Macuco.'),
    asset('bancada-diagnostico-eletronico.svg', 'Bancada de diagnóstico eletrônico', 'Ilustração de bancada técnica para eletrônicos.')
  ]
};

const assetDefinitions = unique(Object.values(imagePools).flat().map((item) => item.url.replace('/assets/images/seo/', ''))).map((file) => {
  const title = file
    .replace(/\.svg$/, '')
    .replaceAll('-', ' ')
    .replace(/\btv\b/i, 'TV')
    .replace(/\bmicroondas\b/i, 'micro-ondas');
  const type = file.includes('microondas') ? 'micro' : file.includes('orcamento') ? 'budget' : file.includes('assistencia') ? 'local' : 'tv';
  return { file, title, type };
});

const assetByFile = new Map(Object.values(imagePools).flat().map((item) => [item.url.replace('/assets/images/seo/', ''), item]));

function imageByFile(file) {
  const image = assetByFile.get(file);
  if (!image) throw new Error(`Imagem não definida: ${file}`);
  return image;
}

function svgFor({ title, type }) {
  const palettes = {
    tv: ['#f8fbff', '#247fd0', '#143454', '#8fd3ff'],
    micro: ['#f9fcfb', '#1fa855', '#153f2a', '#bdebd0'],
    budget: ['#fffdf6', '#247fd0', '#5b4a00', '#f5c542'],
    local: ['#f8fbff', '#ee171f', '#143454', '#ffd1d4']
  };
  const [bg, primary, ink, soft] = palettes[type] || palettes.tv;
  const icon = type === 'micro'
    ? `<rect x="220" y="155" width="520" height="270" rx="30" fill="#fff" stroke="${primary}" stroke-width="18"/><rect x="270" y="205" width="280" height="170" rx="18" fill="${soft}"/><circle cx="640" cy="245" r="30" fill="${primary}"/><circle cx="640" cy="335" r="30" fill="${ink}"/>`
    : type === 'budget'
      ? `<rect x="265" y="135" width="430" height="300" rx="28" fill="#fff" stroke="${primary}" stroke-width="16"/><line x1="330" y1="215" x2="630" y2="215" stroke="${ink}" stroke-width="18"/><line x1="330" y1="285" x2="590" y2="285" stroke="${primary}" stroke-width="18"/><line x1="330" y1="355" x2="545" y2="355" stroke="${soft}" stroke-width="18"/>`
      : type === 'local'
        ? `<path d="M480 118c-92 0-166 74-166 166 0 122 166 280 166 280s166-158 166-280c0-92-74-166-166-166z" fill="#fff" stroke="${primary}" stroke-width="18"/><circle cx="480" cy="286" r="74" fill="${soft}" stroke="${ink}" stroke-width="14"/>`
        : `<rect x="185" y="125" width="590" height="330" rx="30" fill="#fff" stroke="${primary}" stroke-width="18"/><rect x="240" y="180" width="480" height="220" rx="18" fill="${soft}"/><line x1="385" y1="510" x2="575" y2="510" stroke="${ink}" stroke-width="22" stroke-linecap="round"/><line x1="480" y1="455" x2="480" y2="510" stroke="${ink}" stroke-width="22"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${title}">
  <rect width="1200" height="675" fill="${bg}"/>
  <circle cx="1000" cy="80" r="170" fill="${soft}" opacity=".55"/>
  <circle cx="120" cy="600" r="210" fill="${soft}" opacity=".35"/>
  ${icon}
  <text x="86" y="84" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="${primary}">EletroLED</text>
  <text x="86" y="612" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="${ink}">${title.slice(0, 54)}</text>
  <text x="86" y="648" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#626a78">Dicas técnicas para Santos e região</text>
</svg>`;
}

const publishedRevisions = {
  'tv-nao-liga-em-santos': {
    description: 'Entenda causas comuns para TV que não liga, quais sinais observar com segurança e quando procurar avaliação técnica em Santos.',
    intro: 'Quando uma TV não liga, a primeira reação costuma ser testar a tomada várias vezes ou insistir no controle remoto. Isso pode até resolver casos simples, mas também pode mascarar uma falha interna. O sintoma pode vir de cabo, tomada, controle, placa fonte, circuito de standby, placa principal ou proteção ativada depois de oscilação de energia. Para quem está em Santos, o caminho mais seguro é observar alguns sinais sem abrir o aparelho e, se o problema continuar, pedir uma avaliação técnica antes de comprar peça ou trocar a TV.',
    sections: [
      ['O que observar antes de levar a TV', 'Verifique se a tomada funciona com outro aparelho, se o cabo de energia está bem encaixado e se há luz de standby. Observe também se a TV faz estalo, pisca o LED, tenta ligar e apaga ou fica totalmente sem resposta. Esses detalhes ajudam a separar falhas externas de defeitos internos. Se houver cheiro de queimado, aquecimento incomum ou queda de energia recente, pare os testes.'],
      ['Possíveis causas técnicas', 'TV que não liga pode ter defeito na placa fonte, curto em componentes, falha na placa principal, problema no botão power ou dano causado por oscilação elétrica. Em Smart TVs, também pode existir travamento de sistema, mas isso precisa ser confirmado por teste. O mesmo sintoma pode ter causas diferentes conforme marca, modelo, idade do aparelho e histórico de uso.'],
      ['Por que não abrir o aparelho em casa', 'Mesmo desligada da tomada, a TV pode ter capacitores carregados e partes sensíveis. Abrir a tampa sem ferramenta adequada aumenta risco de choque, quebra de flat cable, dano ao painel e perda de referência para o diagnóstico. O ideal é fazer apenas verificações externas e levar o aparelho para bancada quando o defeito persistir.'],
      ['Quando chamar assistência técnica', 'Procure avaliação quando a TV não acende nenhum LED, reinicia sozinha, desliga depois de poucos segundos, parou depois de chuva forte ou queda de energia, ou quando o problema voltou após funcionar por alguns minutos. A avaliação técnica mede fonte, placa principal, conectores e circuitos de proteção antes de indicar qualquer troca de peça.'],
      ['O que informar no WhatsApp', 'Para agilizar o primeiro atendimento, envie marca, modelo, tamanho em polegadas e descreva exatamente o que acontece ao apertar power. Se puder, mande uma foto da etiqueta traseira e um vídeo curto mostrando o LED, som ou qualquer tentativa de ligar. Isso não substitui diagnóstico, mas ajuda a orientar o próximo passo.'],
      ['Atendimento da EletroLED em Santos', 'A EletroLED realiza diagnóstico e orçamento para TVs LED, LCD, Smart TV, OLED e QLED de várias marcas. O atendimento é feito no Macuco, em Santos, com foco em identificar a causa real antes de sugerir reparo. Assim o cliente decide com mais clareza se o conserto compensa.']
    ],
    faq: [
      ['TV que não liga sempre queimou a fonte?', 'Não. A fonte é uma causa comum, mas também pode haver falha na placa principal, no circuito de standby, no cabo, na tomada ou em proteção interna.'],
      ['Posso continuar tentando ligar várias vezes?', 'Se o sintoma persiste, não é recomendado insistir. Repetir tentativas pode agravar uma falha elétrica ou danificar outros componentes.'],
      ['Queda de energia pode queimar TV?', 'Pode. Oscilações e surtos elétricos podem afetar fonte, placa principal e componentes de proteção. A avaliação confirma a extensão do dano.'],
      ['Dá para passar orçamento só por mensagem?', 'Em alguns casos dá para orientar uma faixa, mas o valor correto depende de teste em bancada e disponibilidade de peças.'],
      ['A EletroLED atende TV que não liga em Santos?', 'Sim. A EletroLED avalia esse sintoma em TVs de várias marcas, sempre como serviço técnico independente quando se tratar de marcas comerciais.']
    ]
  },
  'microondas-nao-esquenta-santos': {
    description: 'Veja possíveis causas para micro-ondas que liga, mas não esquenta, e entenda por que a avaliação técnica é importante antes do reparo.',
    intro: 'Micro-ondas que acende o painel, gira o prato e não aquece é um dos defeitos que mais confundem o cliente. Como parte do aparelho parece funcionar, muita gente imagina que seja apenas fusível ou configuração. Na prática, o aquecimento depende de componentes de alta tensão, chaveamento da porta, magnetron, capacitor, transformador ou placa. Por segurança, esse tipo de falha não deve ser investigado abrindo o aparelho em casa.',
    sections: [
      ['Por que ele liga e não esquenta?', 'O painel, a lâmpada e o prato podem funcionar mesmo quando o circuito de aquecimento está com problema. Isso acontece porque nem todos os sistemas internos dependem da mesma etapa elétrica. A causa pode estar em peça de alta tensão, sensor, placa, chave da porta ou no próprio magnetron.'],
      ['O risco da alta tensão', 'Micro-ondas trabalha com componentes que podem manter carga perigosa mesmo depois de desligados da tomada. Tentar trocar fusível, capacitor ou magnetron sem conhecimento técnico pode causar choque grave e danificar o aparelho. A orientação segura é não abrir a tampa e procurar assistência.'],
      ['Quando o problema pode ser simples', 'Antes da assistência, confira se a potência não foi reduzida, se o tempo foi programado corretamente e se a porta fecha sem folga. Também vale testar outro alimento com água em recipiente adequado. Se o aparelho continua sem aquecer, pare os testes e encaminhe para avaliação.'],
      ['Peças que costumam ser avaliadas', 'O técnico verifica chave de porta, fusíveis internos, placa eletrônica, capacitor, diodo, transformador e magnetron. A troca de qualquer peça só deve ser indicada depois de medição, porque sintomas parecidos podem ter causas diferentes e valores de reparo bem distintos.'],
      ['Quando o conserto compensa', 'A decisão depende da marca, idade do aparelho, estado interno, disponibilidade de peças e valor do reparo. Micro-ondas bem conservado pode compensar, principalmente quando o defeito é localizado. Em aparelhos muito enferrujados ou com vários danos, o orçamento precisa ser avaliado com mais cautela.'],
      ['Como falar com a EletroLED', 'Envie marca, modelo, sintoma principal e informe se o aparelho faz barulho, cheiro de queimado, faísca ou apenas não aquece. Essas informações ajudam a orientar o atendimento, mas o diagnóstico final depende de teste seguro em bancada.']
    ],
    faq: [
      ['Micro-ondas que liga e não esquenta tem conserto?', 'Muitos casos têm conserto, mas depende da peça afetada e do estado geral do aparelho.'],
      ['Pode ser magnetron?', 'Pode, mas não é a única causa. Chave de porta, placa, capacitor, diodo e fusíveis internos também precisam ser verificados.'],
      ['Posso trocar o fusível em casa?', 'Não é recomendado. O aparelho envolve alta tensão e pode oferecer risco mesmo desligado.'],
      ['O orçamento depende da peça?', 'Sim. O valor muda conforme a causa real, disponibilidade da peça e tempo de bancada.'],
      ['A EletroLED avalia micro-ondas em Santos?', 'Sim. A EletroLED avalia micro-ondas com falha de aquecimento, faísca, painel e outros sintomas.']
    ]
  },
  'tv-com-som-sem-imagem': {
    description: 'Entenda causas comuns para TV com som e sem imagem, incluindo backlight, placa e painel, e saiba quando procurar assistência.',
    intro: 'Quando a TV tem som, responde ao controle e a tela fica escura, o defeito costuma apontar para imagem, iluminação ou alimentação interna. Muita gente chama esse sintoma de “queimou a tela”, mas nem sempre o painel é o problema. Pode ser backlight, placa fonte, placa principal, T-Con, cabo interno ou configuração. A melhor forma de evitar gasto errado é fazer diagnóstico antes de comprar peça.',
    sections: [
      ['Por que a TV pode ficar sem imagem?', 'A imagem depende de várias etapas: processamento do sinal, alimentação, iluminação do painel e comunicação entre placas. Se uma dessas etapas falha, o som pode continuar funcionando enquanto a tela permanece escura. Por isso, o sintoma precisa ser avaliado com teste técnico.'],
      ['Quando pode ser backlight', 'Em TVs LED, barras de LED desgastadas podem deixar a tela escura, às vezes com imagem bem fraca quando iluminada por fora. Também pode haver piscadas, manchas ou funcionamento intermitente antes de apagar totalmente. A troca de backlight precisa respeitar modelo, tensão e montagem do painel.'],
      ['Pode ser placa ou painel?', 'Sim. Placa fonte, principal, T-Con, cabos flat e painel também podem causar ausência de imagem. O diagnóstico separa falha de iluminação de falha de processamento. Essa diferença é importante porque o custo e a viabilidade do reparo mudam bastante.'],
      ['O que evitar antes da avaliação', 'Evite pressionar a tela, bater na TV, aquecer com secador ou abrir a tampa traseira. Painéis são frágeis e cabos internos podem se romper com facilidade. O ideal é desligar o aparelho, anotar o comportamento e encaminhar para assistência.'],
      ['Informações úteis para o atendimento', 'Informe se há som, se aparece o menu, se a tela pisca, se houve queda de energia e se o problema começou aos poucos. Um vídeo curto em ambiente escuro pode ajudar a mostrar se existe brilho fraco ou ausência total de iluminação.'],
      ['Quando procurar assistência em Santos', 'Se a TV mantém som sem imagem, o reparo pode ser viável, principalmente em aparelhos maiores ou Smart TVs. A EletroLED avalia o defeito em bancada e orienta o cliente antes de qualquer troca de peça.']
    ],
    faq: [
      ['TV com som e sem imagem tem conserto?', 'Muitos casos têm conserto, principalmente quando o defeito está em backlight, fonte ou placa. O painel precisa ser avaliado.'],
      ['Troca de barra de LED vale a pena?', 'Pode valer em TVs bem conservadas, mas depende do tamanho, modelo e custo das peças.'],
      ['Como saber se é backlight?', 'Um técnico consegue testar iluminação, tensão e placas. Testes caseiros não confirmam o diagnóstico com segurança.'],
      ['Pode continuar usando só com som?', 'Não faz sentido insistir, porque a falha pode piorar ou indicar problema elétrico interno.'],
      ['A EletroLED atende esse sintoma?', 'Sim. A EletroLED avalia TVs com tela escura, imagem fraca, som sem imagem e falhas de backlight.']
    ]
  },
  'microondas-soltando-faisca': {
    description: 'Micro-ondas soltando faísca exige cuidado. Entenda causas comuns, riscos e quando chamar assistência técnica com segurança.',
    intro: 'Faísca dentro do micro-ondas nunca deve ser tratada como algo normal. O problema pode estar em sujeira carbonizada, uso de metal, placa mica danificada, tinta interna desgastada, guia de ondas afetado ou componente interno em falha. Algumas situações são simples de prevenir, mas outras exigem avaliação técnica. O ponto principal é não continuar usando o aparelho até entender a causa.',
    sections: [
      ['Por que o micro-ondas solta faísca?', 'Faíscas podem surgir quando há metal, papel alumínio, recipiente inadequado, restos de alimento queimado ou gordura acumulada. Também podem aparecer quando a placa mica está danificada ou quando há desgaste interno na cavidade. Cada caso exige cuidado diferente.'],
      ['Quando é perigoso continuar usando', 'Se a faísca se repete, vem acompanhada de cheiro de queimado, barulho alto, fumaça ou marca escura na lateral interna, desligue imediatamente. Continuar usando pode ampliar o dano, afetar o guia de ondas e aumentar risco de curto ou queima de componente.'],
      ['O que verificar sem abrir o aparelho', 'Confira se não havia metal, talher, embalagem metalizada ou prato com detalhe dourado. Espere esfriar e observe a cavidade interna com o aparelho desligado. Não raspe partes internas com objeto metálico e não tente pintar a cavidade sem orientação.'],
      ['Placa mica e guia de ondas', 'A placa mica protege a região por onde a energia chega à cavidade. Quando ela queima, suja ou fura, pode gerar faíscas. A substituição parece simples, mas precisa ser feita com peça adequada e com verificação da região ao redor para evitar reincidência.'],
      ['Por que não abrir em casa', 'Além da alta tensão, o micro-ondas possui componentes sensíveis e risco de descarga elétrica. Abrir para procurar a causa da faísca sem técnica adequada não é seguro. O correto é interromper o uso e levar para avaliação.'],
      ['Atendimento recomendado', 'Envie foto da parte interna, informe se usou algum recipiente diferente e descreva quando a faísca aparece. A EletroLED avalia o aparelho e orienta se o reparo é seguro e economicamente coerente.']
    ],
    faq: [
      ['Micro-ondas soltando faísca é perigoso?', 'Pode ser. Se a faísca se repete ou vem com cheiro de queimado, pare o uso e procure avaliação.'],
      ['Pode ser só sujeira?', 'Pode, mas também pode ser placa mica danificada, metal, tinta desgastada ou falha interna.'],
      ['Posso trocar a placa mica sozinho?', 'Não é recomendado sem avaliação, porque a região ao redor pode estar danificada.'],
      ['Usar recipiente errado causa faísca?', 'Sim. Metal, papel alumínio e detalhes metalizados podem causar faísca rapidamente.'],
      ['A EletroLED avalia micro-ondas com faísca?', 'Sim. A avaliação verifica segurança, cavidade, mica, guia de ondas e componentes relacionados.']
    ]
  },
  'conserto-tv-samsung-santos': {
    description: 'Conheça defeitos comuns em TVs Samsung e saiba como um serviço independente pode avaliar imagem, fonte, sistema e orçamento em Santos.',
    intro: 'TVs Samsung podem apresentar sintomas como tela escura, liga e desliga, travamento no logo, falha de Wi-Fi, linhas na imagem ou ausência de som. Esses problemas não significam sempre a mesma peça defeituosa. A EletroLED realiza atendimento técnico independente para TVs Samsung em Santos, com diagnóstico antes de indicar reparo. O conteúdo abaixo é informativo e não representa assistência autorizada oficial da marca.',
    sections: [
      ['Defeitos comuns em TVs Samsung', 'Entre os sintomas frequentes estão falha de backlight, placa fonte com instabilidade, travamento de sistema, imagem piscando, tela sem brilho e problemas em entradas HDMI. A causa depende do modelo, tamanho, tipo de painel e histórico de uso.'],
      ['Tela escura ou sem imagem', 'Em muitos casos, a TV mantém som ou responde ao controle, mas não mostra imagem. Isso pode indicar backlight, fonte, placa principal, T-Con ou painel. O teste técnico separa defeito de iluminação de defeito de processamento.'],
      ['TV ligando e desligando', 'Reiniciar sozinho pode ter relação com fonte, placa principal, software, curto em LEDs ou proteção interna. Insistir em ligar pode piorar o defeito. O ideal é anotar o comportamento e pedir avaliação.'],
      ['Serviço independente e linguagem correta', 'A EletroLED atende TVs Samsung como assistência técnica independente. Isso significa que o serviço não deve ser confundido com garantia oficial, autorizada Samsung ou representante da fabricante. O objetivo é avaliar e reparar quando o conserto for viável.'],
      ['O que enviar antes do orçamento', 'Informe modelo completo, tamanho em polegadas, sintoma, tempo de uso e se houve queda de energia. Foto da etiqueta traseira e vídeo curto ajudam a orientar o primeiro contato pelo WhatsApp.'],
      ['Quando o reparo compensa', 'O conserto pode compensar principalmente em TVs maiores, aparelhos bem conservados e falhas localizadas. Se houver dano em painel ou múltiplas falhas, o orçamento precisa ser avaliado com mais cautela.']
    ],
    faq: [
      ['A EletroLED é autorizada Samsung?', 'O atendimento é técnico independente. Não usamos linguagem de autorizada oficial sem comprovação.'],
      ['TV Samsung com tela escura tem conserto?', 'Muitos casos têm conserto, mas é necessário confirmar se a falha está em backlight, placa ou painel.'],
      ['TV Samsung reiniciando pode ser placa?', 'Pode ser placa, fonte, software ou proteção interna. O diagnóstico diferencia essas possibilidades.'],
      ['Dá para saber o valor por mensagem?', 'A mensagem ajuda a orientar, mas orçamento correto depende de avaliação técnica.'],
      ['Onde fica o atendimento?', 'A EletroLED atende no Macuco, em Santos, na Av. Siqueira Campos, 148.']
    ]
  },
  'conserto-tv-lg-santos': {
    description: 'Veja sintomas comuns em TVs LG e como um serviço técnico independente avalia tela escura, fonte, sistema e backlight em Santos.',
    intro: 'TVs LG podem apresentar tela escura, imagem azulada, travamento de aplicativos, falha de Wi-Fi, desligamento repentino ou ausência de imagem. A causa pode variar bastante conforme o modelo e o histórico do aparelho. A EletroLED atende TVs LG em Santos como serviço técnico independente, sem se apresentar como autorizada oficial. O diagnóstico é o que define se o reparo faz sentido.',
    sections: [
      ['Sintomas comuns em TVs LG', 'Entre os problemas mais relatados estão desgaste de LEDs, tela sem brilho, fonte instável, travamento de Smart TV, falha em HDMI e som sem imagem. O mesmo sintoma pode estar ligado a peças diferentes, por isso a avaliação evita troca desnecessária.'],
      ['Imagem azulada ou escura', 'Alguns modelos podem apresentar desgaste no conjunto de LEDs, gerando imagem azulada, roxa, fraca ou apagada. Também pode haver problema de fonte, cabo interno ou painel. A análise em bancada confirma a origem antes de sugerir reparo.'],
      ['Smart TV travando', 'Aplicativos lentos, sistema travado ou TV reiniciando podem ter relação com memória, software, placa principal ou rede. Nem todo travamento é resolvido com reset, e insistir em atualizações sem estabilidade pode piorar a situação.'],
      ['Serviço independente para LG', 'O atendimento da EletroLED é independente. Isso é importante para evitar confusão com garantia oficial ou autorizada LG. O foco é diagnóstico transparente, orçamento e reparo quando tecnicamente viável.'],
      ['Como preparar o atendimento', 'Envie o modelo completo, tamanho, sintoma e informe se aparece som, logo ou menu. Se a imagem muda de cor, pisca ou fica escura depois de alguns minutos, grave um vídeo curto para ajudar na triagem.'],
      ['Quando vale avaliar o reparo', 'TVs LG maiores ou em bom estado geralmente merecem diagnóstico antes de descarte. A decisão depende de peça, painel, tempo de uso e custo final do reparo.']
    ],
    faq: [
      ['A EletroLED é autorizada LG?', 'Não declaramos atendimento como autorizado oficial. O serviço é independente para avaliação e reparo.'],
      ['TV LG com imagem azulada tem conserto?', 'Pode ter, especialmente se o defeito estiver no conjunto de LEDs. A avaliação confirma.'],
      ['TV LG travada no sistema sempre precisa de placa?', 'Não. Pode ser software, memória, rede ou placa. O diagnóstico define o caminho.'],
      ['Vale a pena consertar TV LG?', 'Depende do tamanho, estado do aparelho e custo das peças. O orçamento técnico ajuda na decisão.'],
      ['A EletroLED atende TVs LG em Santos?', 'Sim. O atendimento é feito em Santos para TVs LG e outras marcas, como serviço independente.']
    ]
  },
  'assistencia-tecnica-macuco-santos': {
    description: 'Conheça o atendimento técnico da EletroLED no Macuco, em Santos, para avaliação de TVs e micro-ondas de várias marcas.',
    intro: 'Para quem mora no Macuco ou em bairros próximos de Santos, ter uma assistência técnica local facilita a avaliação de TVs e micro-ondas sem depender apenas de tentativa por telefone. A EletroLED atende na Av. Siqueira Campos, 148, com foco em diagnóstico, orçamento e orientação clara antes do reparo. O objetivo é ajudar o cliente a decidir se vale consertar, trocar peça ou substituir o aparelho.',
    sections: [
      ['Por que a localização ajuda', 'A proximidade facilita levar o aparelho, explicar o defeito e acompanhar o orçamento. Em defeitos de TV e micro-ondas, a avaliação presencial costuma ser mais confiável do que tentar definir a causa apenas por mensagem.'],
      ['Atendimento para TVs', 'A EletroLED avalia TVs LED, LCD, Smart TV, OLED e QLED com sintomas como tela escura, sem imagem, não liga, desliga sozinha, travamento no logo, falha de som e problemas em HDMI ou Wi-Fi.'],
      ['Atendimento para micro-ondas', 'Também são avaliados micro-ondas que não esquentam, soltam faísca, fazem barulho alto, desarmam disjuntor, têm painel apagado ou apresentam problema de porta. Por envolver alta tensão, não é recomendado abrir o aparelho em casa.'],
      ['Bairros e região atendida', 'O foco local é Santos, com referência no Macuco, mas o conteúdo também atende buscas de quem está em regiões próximas como Gonzaga, Boqueirão, Embaré, Aparecida, Ponta da Praia e Vila Mathias.'],
      ['Como solicitar orientação', 'Antes de levar o aparelho, envie pelo WhatsApp marca, modelo, defeito observado e, se possível, foto da etiqueta. Isso ajuda a organizar o atendimento e evita informações incompletas no orçamento.'],
      ['Diagnóstico antes de promessa', 'Nenhum sintoma deve ser tratado como diagnóstico fechado sem teste. A avaliação técnica protege o cliente de troca de peça errada e ajuda a decidir com base no estado real do aparelho.']
    ],
    faq: [
      ['Onde fica a EletroLED?', 'A EletroLED fica na Av. Siqueira Campos, 148, no Macuco, em Santos.'],
      ['A assistência atende TV e micro-ondas?', 'Sim. O atendimento cobre avaliação de TVs e micro-ondas de várias marcas.'],
      ['Preciso levar o aparelho sem avisar?', 'O ideal é chamar no WhatsApp antes, enviar modelo e sintoma, e confirmar a melhor forma de atendimento.'],
      ['Atende somente Macuco?', 'A referência física é no Macuco, mas o conteúdo e atendimento alcançam clientes de outros bairros de Santos.'],
      ['O orçamento é feito antes do conserto?', 'Sim. A avaliação técnica orienta o orçamento antes da decisão de reparo.']
    ]
  },
  'quanto-custa-consertar-tv-santos': {
    description: 'Entenda o que influencia o preço do conserto de TV em Santos e por que o orçamento depende de diagnóstico técnico.',
    intro: 'Perguntar quanto custa consertar uma TV é normal, mas a resposta correta depende da causa do defeito. Uma tela escura pode ser backlight, fonte, placa, cabo ou painel; uma TV que não liga pode ter desde falha simples até dano por queda de energia. Por isso, orçamento responsável não deve prometer valor fechado sem avaliação. O diagnóstico mostra se o reparo compensa e evita gasto com peça errada.',
    sections: [
      ['O que influencia o valor', 'Tamanho da TV, tipo de painel, marca, disponibilidade de peças, complexidade da desmontagem e tempo de bancada influenciam o preço. TVs maiores podem ter peças mais caras, mas também podem justificar melhor o reparo quando estão em bom estado.'],
      ['Sintoma não é orçamento fechado', 'Dois aparelhos com “sem imagem” podem ter causas diferentes. Um pode precisar de troca de LEDs; outro pode ter falha em placa ou painel. Sem medição, qualquer valor informado é apenas orientação inicial, não orçamento definitivo.'],
      ['Quando o conserto costuma compensar', 'Geralmente vale avaliar TVs maiores, Smart TVs recentes e aparelhos bem conservados. O reparo fica menos interessante quando há painel quebrado, oxidação forte, múltiplas falhas ou custo próximo ao de um aparelho novo.'],
      ['Por que o diagnóstico protege o cliente', 'O teste técnico reduz risco de trocar peça sem necessidade. Também ajuda a identificar se o defeito tem origem em energia, impacto, desgaste de backlight, placa principal ou outro componente.'],
      ['Como pedir orçamento com mais precisão', 'Envie marca, modelo, polegadas, sintoma e histórico do problema. Foto da etiqueta traseira e vídeo curto do defeito ajudam. Mesmo assim, o valor final depende da avaliação presencial ou em bancada.'],
      ['Atendimento em Santos', 'A EletroLED avalia TVs em Santos e orienta o cliente antes de qualquer reparo. A decisão final deve considerar valor, estado do aparelho e expectativa de uso.']
    ],
    faq: [
      ['Dá para saber o preço sem avaliação?', 'Na maioria dos casos, não com precisão. É possível orientar, mas o orçamento correto depende de diagnóstico.'],
      ['Troca de backlight é sempre cara?', 'Depende do tamanho, modelo, tipo de LED e mão de obra necessária para desmontagem segura do painel.'],
      ['Quando compensa trocar a TV?', 'Quando o painel está danificado ou o custo do reparo fica muito próximo ao valor de uma TV equivalente em bom estado.'],
      ['A assistência informa o valor antes do reparo?', 'Sim. A avaliação gera orçamento para o cliente decidir antes da execução.'],
      ['O orçamento muda por marca?', 'Pode mudar, porque peças, montagem e disponibilidade variam conforme marca e modelo.']
    ]
  }
};

function sections(entries) {
  return entries.map(([heading, body]) => ({ heading, body }));
}

function faq(entries) {
  return entries.map(([question, answer]) => ({ question, answer }));
}

function ctaFor(post) {
  const kind = kindOf(post);
  const problem = problemFromTitle(post.title).toLowerCase();
  if (kind === 'micro') {
    return {
      quickTitle: 'Evite abrir o micro-ondas em casa',
      quickText: 'Envie marca, modelo e sintoma pelo WhatsApp para orientar o atendimento sem se expor à alta tensão.',
      title: 'Seu micro-ondas precisa de avaliação?',
      text: 'Se o aparelho está falhando, pare o uso quando houver risco e fale com a EletroLED para avaliar com segurança.',
      button: 'Falar sobre meu micro-ondas',
      whatsappText: `Olá, li sobre ${problem} e preciso avaliar meu micro-ondas. Marca/modelo:`
    };
  }
  if (kind === 'budget') {
    return {
      quickTitle: 'Quer saber se o reparo compensa?',
      quickText: 'Envie marca, modelo e defeito observado para receber orientação inicial antes do orçamento técnico.',
      title: 'Precisa decidir entre consertar ou trocar?',
      text: 'A EletroLED pode avaliar o aparelho e explicar o que pesa no orçamento antes do reparo.',
      button: 'Pedir orientação de orçamento',
      whatsappText: `Olá, quero entender se o conserto compensa. O aparelho e o defeito são:`
    };
  }
  if (kind === 'local') {
    return {
      quickTitle: 'Precisa de atendimento local em Santos?',
      quickText: 'Envie o bairro, aparelho, marca e sintoma para organizar a avaliação com a EletroLED.',
      title: 'Fale com a EletroLED no Macuco',
      text: 'Descreva o defeito e confirme a melhor forma de atendimento para TV ou micro-ondas.',
      button: 'Chamar atendimento local',
      whatsappText: `Olá, estou em Santos e preciso de atendimento para este aparelho:`
    };
  }
  return {
    quickTitle: 'Evite trocar peça no chute',
    quickText: 'Envie marca, modelo, tamanho e sintoma da TV para orientar o próximo passo com mais segurança.',
    title: 'Sua TV está com esse sintoma?',
    text: 'Fale com a EletroLED pelo WhatsApp e explique marca, modelo e defeito observado antes de levar o aparelho.',
    button: 'Falar sobre minha TV',
    whatsappText: `Olá, li sobre ${problem} e preciso avaliar minha TV. Marca/modelo:`
  };
}

function descriptionForDraft(post) {
  const kind = kindOf(post);
  const problem = problemFromTitle(post.title);
  if (kind === 'micro') return `Entenda possíveis causas para ${problem.toLowerCase()} em micro-ondas, cuidados de segurança e quando procurar avaliação técnica.`;
  if (kind === 'brand') return `Veja sintomas frequentes em ${problem.replace(/^conserto de\s+/i, '')} e saiba como um serviço independente pode avaliar o reparo em Santos.`;
  if (kind === 'budget') return `Entenda critérios para decidir sobre ${problem.toLowerCase()}, com foco em diagnóstico, orçamento e segurança antes do reparo.`;
  if (kind === 'local') return `Veja como organizar atendimento técnico para ${problem.toLowerCase()}, com orientação para clientes de Santos e bairros próximos.`;
  return `Entenda possíveis causas para ${problem.toLowerCase()}, sinais de atenção e quando pedir avaliação técnica para TV em Santos.`;
}

function introForDraft(post) {
  const kind = kindOf(post);
  const problem = problemFromTitle(post.title);
  if (kind === 'micro') {
    return `${problem} é um sintoma que merece cuidado porque micro-ondas trabalha com alta tensão e nem sempre o defeito aparece de forma óbvia. Pode haver falha em chave de porta, placa, fusível interno, magnetron, capacitor, diodo ou componentes mecânicos. A orientação segura é observar sinais externos, evitar abrir o aparelho e procurar avaliação quando o problema se repete.`;
  }
  if (kind === 'brand') {
    return `${problem} exige diagnóstico antes de qualquer troca de peça, porque TVs da mesma marca podem apresentar sintomas parecidos por causas diferentes. A EletroLED atende esse tipo de aparelho em Santos como serviço técnico independente, sem se apresentar como autorizada oficial da fabricante. O objetivo é avaliar fonte, imagem, backlight, placa, conexões e viabilidade do reparo.`;
  }
  if (kind === 'budget') {
    return `${problem} é uma dúvida comum antes de gastar com reparo. A resposta depende de marca, modelo, idade do aparelho, estado físico, disponibilidade de peças e causa real do defeito. Um orçamento responsável começa pelo diagnóstico, não por promessa de preço fechado apenas pelo sintoma.`;
  }
  if (kind === 'local') {
    return `${problem} faz sentido para quem busca atendimento técnico próximo e quer evitar deslocamento desnecessário. A EletroLED fica no Macuco, em Santos, e orienta clientes com TVs e micro-ondas de várias marcas. O primeiro passo é descrever o sintoma e confirmar se o aparelho deve passar por avaliação.`;
  }
  return `${problem} pode ter origem simples ou indicar falha interna em fonte, placa, backlight, painel, conexões ou sistema da Smart TV. Antes de abrir o aparelho ou trocar peças, vale observar os sintomas com segurança e buscar diagnóstico técnico. Essa abordagem evita gasto errado e ajuda a decidir se o reparo compensa.`;
}

function sectionsForDraft(post) {
  const kind = kindOf(post);
  const problem = problemFromTitle(post.title);
  if (kind === 'micro') {
    return sections([
      [`O que pode causar ${problem.toLowerCase()}`, 'O sintoma pode estar ligado a alimentação, chave de porta, placa eletrônica, fusíveis internos, circuito de alta tensão, magnetron ou desgaste mecânico. Como esses componentes trabalham de forma integrada, o diagnóstico precisa medir antes de indicar troca.'],
      ['Sinais que merecem atenção', 'Cheiro de queimado, faísca, barulho alto, disjuntor desarmando, painel apagando ou aquecimento irregular indicam que o uso deve ser interrompido. Continuar tentando pode aumentar o dano e dificultar o reparo.'],
      ['O que verificar sem abrir o aparelho', 'Confira tomada, programação, fechamento da porta, recipiente usado e limpeza interna. Esses testes são externos e seguros. Se o comportamento continuar, não remova a tampa nem tente trocar fusível por conta própria.'],
      ['Alta tensão exige cuidado', 'Mesmo fora da tomada, o micro-ondas pode manter carga perigosa em componentes internos. Por isso, reparos em capacitor, diodo, transformador e magnetron devem ser feitos por assistência técnica.'],
      ['Quando o orçamento faz sentido', 'O reparo costuma ser mais interessante quando o aparelho está bem conservado, sem ferrugem avançada e com peça disponível. A avaliação compara custo, segurança e vida útil esperada.'],
      ['Como explicar o defeito', 'Envie marca, modelo, quando o problema começou, se há barulho, faísca ou cheiro, e se o painel permanece aceso. Foto da etiqueta ajuda a orientar a triagem.'],
      ['O que a EletroLED avalia', 'A análise considera segurança da porta, alimentação, placa, componentes de alta tensão, aquecimento e estado da cavidade. O orçamento só deve ser fechado depois dessa verificação.'],
      ['Próximo passo recomendado', 'Se o sintoma se repete, pare o uso e chame a EletroLED pelo WhatsApp. A descrição correta do defeito ajuda a decidir se o aparelho deve ir para bancada.']
    ]);
  }
  if (kind === 'brand') {
    return sections([
      [`Sintomas comuns em ${problem}`, 'Falhas de imagem, tela escura, reinício, som baixo, travamento de sistema, entradas sem sinal e defeitos de iluminação podem aparecer em diferentes modelos. O sintoma não define sozinho a peça defeituosa.'],
      ['Serviço independente, sem promessa de autorizada', 'O atendimento da EletroLED é técnico independente. Isso evita confusão com garantia oficial, representante da marca ou assistência autorizada quando essa condição não foi comprovada.'],
      ['Imagem, backlight e painel', 'Quando a tela escurece, pisca, fica azulada ou apresenta linhas, o técnico precisa diferenciar backlight, placa, cabo interno, T-Con e painel. Essa separação muda o custo e a viabilidade do reparo.'],
      ['Fonte e placa principal', 'TV que não liga, reinicia ou trava pode ter fonte instável, placa principal com falha, curto em LEDs ou proteção interna. Testes elétricos orientam a decisão antes da troca de peças.'],
      ['O que informar no primeiro contato', 'Envie modelo completo, polegadas, sintoma, tempo de uso e histórico de queda, chuva ou oscilação elétrica. Um vídeo curto ajuda a mostrar o comportamento real do aparelho.'],
      ['Quando vale pedir orçamento', 'TVs maiores, Smart TVs recentes e aparelhos em bom estado físico costumam justificar avaliação. Se houver painel quebrado ou oxidação severa, o orçamento precisa ser analisado com cuidado.'],
      ['Como a EletroLED conduz a avaliação', 'O atendimento verifica sinais externos, histórico do cliente e testes internos quando necessário. A proposta é explicar a causa provável e o custo antes de executar reparo.'],
      ['Decisão segura para o cliente', 'O cliente deve decidir com base no diagnóstico, no valor do reparo e no estado geral da TV. Evitar troca no chute reduz risco de gasto desnecessário.']
    ]);
  }
  if (kind === 'budget') {
    return sections([
      ['Por que orçamento depende de diagnóstico', 'Sintomas parecidos podem ter causas e valores diferentes. Uma TV sem imagem pode precisar de LEDs, placa ou painel; um micro-ondas sem aquecer pode envolver alta tensão ou chave de porta.'],
      ['Informações que ajudam no primeiro contato', 'Marca, modelo, tamanho, idade aproximada, sintoma e histórico do defeito ajudam a orientar a triagem. Foto da etiqueta e vídeo curto reduzem dúvidas antes da avaliação.'],
      ['Quando o conserto costuma compensar', 'O reparo tende a fazer mais sentido em aparelhos bem conservados, com peça disponível e custo distante do valor de substituição. O estado físico pesa tanto quanto o defeito.'],
      ['Quando trocar pode ser melhor', 'Painel quebrado, ferrugem avançada, múltiplas falhas ou ausência de peça podem tornar o conserto menos interessante. A assistência deve explicar esses pontos com clareza.'],
      ['Cuidados antes de levar o aparelho', 'Evite abrir, desmontar ou tentar adaptar peças. Em TVs, proteja a tela no transporte. Em micro-ondas, não continue usando se houver faísca, cheiro de queimado ou disjuntor desarmando.'],
      ['Como a EletroLED orienta o cliente', 'O atendimento busca entender o sintoma, fazer avaliação técnica e apresentar orçamento antes do reparo. O foco é decisão informada, não promessa genérica.'],
      ['Links úteis para comparar sintomas', 'Antes de pedir orçamento, vale ler guias sobre TV que não liga, TV sem imagem, micro-ondas sem aquecer e faísca. Isso ajuda a descrever melhor o problema.'],
      ['Próximo passo recomendado', 'Envie as informações pelo WhatsApp e aguarde orientação sobre avaliação. O valor correto depende do diagnóstico e da peça necessária.']
    ]);
  }
  if (kind === 'local') {
    return sections([
      ['Como funciona o atendimento local', 'O primeiro contato organiza informações básicas: bairro, aparelho, marca, modelo e sintoma. Isso ajuda a confirmar a melhor forma de avaliação e evita deslocamento sem necessidade.'],
      ['Por que buscar assistência próxima', 'Uma assistência local facilita levar o aparelho, explicar o defeito e acompanhar o orçamento. Em Santos, a referência física da EletroLED é no Macuco.'],
      ['TVs atendidas', 'A avaliação cobre sintomas como não liga, tela escura, som sem imagem, travamento de Smart TV, HDMI sem sinal, falha de áudio, linhas na tela e desligamento repentino.'],
      ['Micro-ondas atendidos', 'Também são avaliados micro-ondas que não esquentam, soltam faísca, fazem barulho, desarmam disjuntor, têm painel apagado ou problema na porta.'],
      ['O que enviar pelo WhatsApp', 'Informe aparelho, marca, modelo, bairro e defeito observado. Foto da etiqueta e vídeo curto ajudam a orientar a triagem inicial.'],
      ['Diagnóstico antes de conclusão', 'A EletroLED evita fechar diagnóstico apenas por mensagem. A avaliação técnica confirma causa, segurança e viabilidade antes do reparo.'],
      ['Regiões citadas no conteúdo', 'O blog reforça Santos, Macuco, Gonzaga, Boqueirão, Embaré, Aparecida, Ponta da Praia, Vila Mathias e Baixada Santista de forma natural, sem excesso de repetição.'],
      ['Próximo passo recomendado', 'Se você está em Santos ou região, chame a EletroLED e descreva o sintoma. O atendimento orienta se o aparelho deve passar por avaliação.']
    ]);
  }
  return sections([
    [`O que pode causar ${problem.toLowerCase()}`, 'O sintoma pode estar relacionado a fonte, placa principal, backlight, painel, conectores, entrada de sinal ou sistema da Smart TV. O diagnóstico separa as possibilidades antes de indicar qualquer troca.'],
    ['Sinais que ajudam no diagnóstico', 'Observe se há som, LED de standby, imagem fraca, piscadas, estalos, aquecimento, travamento no logo ou falha apenas em uma entrada. Esses detalhes ajudam o técnico a direcionar os testes.'],
    ['Testes externos seguros', 'Confira tomada, cabo, controle, pilhas, entrada HDMI, antena e configuração de fonte de sinal. Se o problema continua, evite abrir o aparelho ou insistir em ligar repetidamente.'],
    ['Quando pode envolver placa ou backlight', 'Tela escura, imagem falhando, TV que liga e desliga ou LED piscando podem envolver fonte, backlight, placa principal ou proteção interna. A medição em bancada evita troca errada.'],
    ['O que não fazer em casa', 'Não pressione o painel, não aqueça com secador, não bata na TV e não remova a tampa traseira. TVs têm cabos delicados, placas sensíveis e risco elétrico.'],
    ['Como pedir orientação pelo WhatsApp', 'Envie marca, modelo, polegadas, sintoma e histórico do defeito. Foto da etiqueta traseira e vídeo curto ajudam a entender o comportamento do aparelho.'],
    ['Quando o conserto compensa', 'TVs maiores, Smart TVs recentes ou aparelhos bem conservados geralmente merecem avaliação. A decisão depende do custo da peça, do estado do painel e do orçamento final.'],
    ['Próximo passo recomendado', 'Se o sintoma persiste, procure a EletroLED para avaliação técnica em Santos. O objetivo é confirmar a causa antes de gastar com peça ou trocar o aparelho.']
  ]);
}

function depthSectionsFor(post) {
  const kind = kindOf(post);
  if (kind === 'micro') {
    return sections([
      ['Como a avaliação técnica reduz risco', 'A avaliação em bancada verifica segurança elétrica, travas da porta, estado da cavidade, funcionamento da placa e componentes de alta tensão. Esse cuidado evita trocar peça sem necessidade e reduz o risco de devolver ao uso um aparelho que ainda pode apresentar faísca, aquecimento irregular ou falha intermitente.'],
      ['Decisão segura antes do reparo', 'Depois do diagnóstico, o cliente consegue comparar custo, estado do aparelho e expectativa de uso. Em micro-ondas, essa decisão precisa considerar não apenas preço, mas segurança. Se houver ferrugem avançada, dano interno ou peça crítica indisponível, a orientação pode ser diferente de um simples reparo.']
    ]);
  }
  if (kind === 'brand') {
    return sections([
      ['Por que o modelo exato importa', 'Dentro da mesma marca existem linhas, tamanhos e placas diferentes. O modelo completo ajuda a identificar histórico de falhas, disponibilidade de peças e cuidados de desmontagem. Por isso, a etiqueta traseira é mais útil do que apenas informar a marca comercial da TV.'],
      ['Critério para não prometer resultado', 'Um serviço técnico responsável não promete reparo antes de testar fonte, placas, iluminação e painel. Em TVs de marca conhecida, o valor do aparelho pode justificar diagnóstico, mas o conserto só faz sentido quando a causa é confirmada e o orçamento fica coerente para o cliente.'],
      ['Cuidados com garantia e peças', 'Se o aparelho ainda estiver em garantia de fábrica, o cliente deve verificar as condições oficiais antes de qualquer reparo independente. Fora desse cenário, a avaliação ajuda a identificar se há peça compatível e se o reparo mantém segurança, imagem e funcionamento estável.']
    ]);
  }
  if (kind === 'budget') {
    return sections([
      ['Como comparar orçamento com troca do aparelho', 'A comparação deve considerar preço de uma peça equivalente, idade do aparelho, qualidade da imagem, frequência de uso e garantia do serviço executado. Nem sempre o menor valor imediato é a melhor decisão; o objetivo é entender se o reparo devolve uso confiável por um período razoável.'],
      ['Por que avaliação evita surpresa', 'Quando o orçamento parte de diagnóstico, o cliente entende o que será feito, qual peça está envolvida e quais riscos existem. Isso reduz surpresa depois da aprovação e evita a situação de trocar uma peça simples enquanto o defeito principal continua escondido.'],
      ['O que muda de um aparelho para outro', 'Dois aparelhos com o mesmo sintoma podem ter valores diferentes por causa de tamanho, montagem, acesso às peças e tempo de bancada. Por isso, o orçamento precisa considerar o equipamento real, e não apenas uma tabela genérica de defeitos.']
    ]);
  }
  if (kind === 'local') {
    return sections([
      ['Atendimento local com informação completa', 'Para atendimento em Santos, a descrição do defeito ajuda muito: aparelho, marca, modelo, bairro, quando começou e se houve queda, chuva ou oscilação de energia. Essas informações reduzem idas desnecessárias e tornam o orçamento mais objetivo quando o aparelho chega para avaliação.'],
      ['Como o blog apoia o site principal', 'O blog explica sintomas e cuidados; o site principal concentra contato, endereço e conversão. Essa separação deixa o conteúdo mais útil para quem pesquisa no Google e mantém a página comercial limpa para quem já decidiu falar com a assistência.'],
      ['Referência local sem exagero de palavra-chave', 'O conteúdo menciona Santos, Macuco e bairros próximos quando isso ajuda o leitor a entender localização e atendimento. A intenção é reforçar relevância local de forma natural, sem repetir cidade em cada frase e sem criar páginas vazias apenas para ranquear. Também orienta o cliente a descrever o defeito antes de sair com o aparelho, o que torna o atendimento mais objetivo.']
    ]);
  }
  return sections([
    ['Como a avaliação técnica evita gasto errado', 'Em TV, o mesmo sintoma pode parecer simples e esconder causas diferentes. Tela escura pode ser backlight, fonte, placa, cabo ou painel; falha ao ligar pode ser proteção interna ou curto. A avaliação mede antes de trocar, protegendo o cliente de comprar peça sem resolver o problema.'],
    ['Decisão com base no estado real da TV', 'Depois do diagnóstico, fica mais claro se o reparo compensa. O técnico considera tamanho, tipo de painel, disponibilidade de peças, estado físico e custo final. Assim o cliente escolhe entre consertar ou trocar o aparelho com informação concreta, não apenas pelo susto do defeito.'],
    ['Histórico do defeito também importa', 'Informar se o problema começou depois de queda de energia, transporte, chuva, limpeza ou mudança de cabo ajuda a interpretar o sintoma. Esse histórico não fecha diagnóstico sozinho, mas orienta os testes e reduz tempo perdido com hipóteses pouco prováveis.']
  ]);
}

function faqForDraft(post) {
  const kind = kindOf(post);
  const problem = problemFromTitle(post.title).toLowerCase();
  if (kind === 'micro') {
    return faq([
      [`Micro-ondas com ${problem} tem conserto?`, 'Muitos casos têm conserto, mas depende da peça afetada, segurança interna e disponibilidade de componentes.'],
      ['É seguro abrir o micro-ondas em casa?', 'Não. O aparelho trabalha com alta tensão e pode manter carga mesmo desligado.'],
      ['Dá para saber o valor sem avaliação?', 'A mensagem ajuda a orientar, mas o orçamento correto depende de diagnóstico.'],
      ['Quando devo parar de usar?', 'Pare se houver faísca, cheiro de queimado, barulho alto, disjuntor desarmando ou falha recorrente.'],
      ['A EletroLED avalia micro-ondas em Santos?', 'Sim. A EletroLED avalia micro-ondas de várias marcas com foco em segurança e orçamento claro.']
    ]);
  }
  if (kind === 'brand') {
    return faq([
      ['A EletroLED é autorizada oficial da marca?', 'O atendimento é serviço técnico independente, sem uso de linguagem de autorizada oficial quando isso não é comprovado.'],
      [`${problem} costuma ter conserto?`, 'Pode ter, mas depende do diagnóstico, do estado do painel e da disponibilidade de peças.'],
      ['Dá para avaliar só por foto?', 'Foto e vídeo ajudam na triagem, mas não substituem teste técnico.'],
      ['O orçamento é aprovado antes do reparo?', 'Sim. A avaliação orienta o valor antes da execução do serviço.'],
      ['Quais informações devo enviar?', 'Marca, modelo completo, polegadas, sintoma e histórico do defeito.']
    ]);
  }
  if (kind === 'budget') {
    return faq([
      ['Dá para saber o preço por mensagem?', 'Dá para orientar, mas preço correto depende de avaliação técnica e peça necessária.'],
      ['O orçamento depende da marca?', 'Sim. Peças, montagem e disponibilidade variam conforme marca e modelo.'],
      ['Quando o reparo não compensa?', 'Quando há painel quebrado, oxidação grave, várias falhas ou custo muito próximo ao de substituição.'],
      ['A assistência informa antes de consertar?', 'Sim. O cliente deve aprovar o orçamento antes do reparo.'],
      ['O que enviar para agilizar?', 'Marca, modelo, sintoma, foto da etiqueta e vídeo curto do defeito.']
    ]);
  }
  if (kind === 'local') {
    return faq([
      ['A EletroLED atende em Santos?', 'Sim. A referência local é no Macuco, em Santos.'],
      ['Atende TV e micro-ondas?', 'Sim. O atendimento cobre avaliação de TVs e micro-ondas de várias marcas.'],
      ['Preciso chamar antes?', 'É recomendado chamar pelo WhatsApp para informar aparelho, marca, modelo e defeito.'],
      ['O diagnóstico é feito antes do conserto?', 'Sim. A avaliação técnica orienta orçamento e viabilidade do reparo.'],
      ['Atende bairros próximos?', 'O conteúdo reforça Santos e bairros como Macuco, Gonzaga, Boqueirão, Embaré, Aparecida, Ponta da Praia e Vila Mathias.']
    ]);
  }
  return faq([
    [`TV com ${problem} tem conserto?`, 'Muitos casos têm conserto, mas a causa precisa ser confirmada por diagnóstico técnico.'],
    ['Pode ser placa fonte?', 'Pode, mas também pode envolver placa principal, backlight, painel, conectores ou sistema.'],
    ['É seguro abrir a TV em casa?', 'Não é recomendado. Há risco elétrico e risco de danificar painel, cabos e placas.'],
    ['Dá para passar orçamento sem ver?', 'A mensagem ajuda a orientar, mas o valor correto depende de avaliação.'],
    ['A EletroLED atende TVs de várias marcas?', 'Sim. O atendimento é técnico independente para TVs de várias marcas em Santos.']
  ]);
}

function linksFor(post) {
  const kind = kindOf(post);
  const base = [
    { label: 'Voltar para a home do blog', url: blogHome, note: 'mais guias sobre TV e micro-ondas' },
    { label: 'Site principal da EletroLED', url: mainSite, note: 'central comercial e informações de atendimento' },
    { label: 'Contato da EletroLED', url: contactUrl, note: 'canal para orçamento e orientação' }
  ];
  const microGuides = [
    { label: 'Micro-ondas não esquenta', url: '/microondas-nao-esquenta-santos/', note: 'guia principal de aquecimento' },
    { label: 'Micro-ondas soltando faísca', url: '/microondas-soltando-faisca/', note: 'cuidados de segurança' }
  ];
  const withoutSelfLinks = (links) => {
    const selfPath = `/${post.slug}/`;
    const seen = new Set();
    return links.filter((link) => {
      const path = link.url.startsWith('/') && link.url !== '/'
        ? (link.url.endsWith('/') ? link.url : `${link.url}/`)
        : '';
      if (path === selfPath || seen.has(link.url)) return false;
      seen.add(link.url);
      return true;
    });
  };

  if (kind === 'micro') {
    return withoutSelfLinks([
      ...microGuides,
      ...base
    ]);
  }

  if (kind === 'budget' && isMicroTopic(post)) {
    return withoutSelfLinks([
      ...microGuides,
      { label: 'Contato para orçamento de micro-ondas', url: contactUrl, note: 'envie marca, modelo e sintoma com segurança' },
      { label: 'Voltar para a home do blog', url: blogHome, note: 'mais guias sobre TV e micro-ondas' },
      { label: 'Site principal da EletroLED', url: mainSite, note: 'central comercial e informações de atendimento' }
    ]);
  }

  if (kind === 'budget') {
    return withoutSelfLinks([
      { label: 'Quanto custa consertar uma TV', url: '/quanto-custa-consertar-tv-santos/', note: 'referência de orçamento' },
      { label: 'TV não liga em Santos', url: '/tv-nao-liga-em-santos/', note: 'defeito comum que influencia orçamento' },
      ...base
    ]);
  }

  if (kind === 'brand') {
    return withoutSelfLinks([
      { label: 'TV com som mas sem imagem', url: '/tv-com-som-sem-imagem/', note: 'sintoma comum em várias marcas' },
      { label: 'TV não liga em Santos', url: '/tv-nao-liga-em-santos/', note: 'diagnóstico de energia e placa' },
      { label: 'Quanto custa consertar uma TV', url: '/quanto-custa-consertar-tv-santos/', note: 'decisão de orçamento' },
      ...base
    ]);
  }

  if (kind === 'local' && isMicroTopic(post)) {
    return withoutSelfLinks([
      { label: 'Assistência técnica no Macuco', url: '/assistencia-tecnica-macuco-santos/', note: 'referência local da EletroLED' },
      ...microGuides,
      ...base
    ]);
  }

  if (kind === 'local') {
    return withoutSelfLinks([
      { label: 'Assistência técnica no Macuco', url: '/assistencia-tecnica-macuco-santos/', note: 'referência local da EletroLED' },
      { label: 'TV não liga em Santos', url: '/tv-nao-liga-em-santos/', note: 'guia de diagnóstico para TV' },
      { label: 'Micro-ondas não esquenta', url: '/microondas-nao-esquenta-santos/', note: 'guia de diagnóstico para micro-ondas' },
      ...base
    ]);
  }

  return withoutSelfLinks([
    { label: 'TV não liga em Santos', url: '/tv-nao-liga-em-santos/', note: 'falhas de energia e placa' },
    { label: 'TV com som mas sem imagem', url: '/tv-com-som-sem-imagem/', note: 'falhas de imagem e backlight' },
    { label: 'Quanto custa consertar uma TV', url: '/quanto-custa-consertar-tv-santos/', note: 'orientação de orçamento' },
    ...base
  ]);
}

function keywordsFor(post) {
  const base = (post.keywords || []).filter((keyword) => keyword && keyword.length > 2 && !/^[a-z]$/i.test(keyword));
  const kind = kindOf(post);
  const problem = problemFromTitle(post.title);
  const additions = {
    tv: [problem, 'conserto de TV', 'diagnóstico de TV', 'TV em Santos'],
    micro: [problem, 'conserto de micro-ondas', 'micro-ondas em Santos', 'segurança em micro-ondas'],
    brand: [problem, 'serviço independente de TV', 'conserto de TV em Santos', 'diagnóstico de TV'],
    budget: [problem, 'orçamento de conserto', 'vale a pena consertar', 'assistência técnica em Santos'],
    local: [problem, 'assistência técnica no Macuco', 'atendimento técnico em Santos', 'Baixada Santista']
  }[kind];
  return unique([...additions, ...base]).slice(0, 8);
}

function imageCandidatesFor(post) {
  const text = `${post.title} ${post.slug}`.toLowerCase();
  const kind = kindOf(post);

  if (kind === 'brand') {
    if (text.includes('samsung')) return [imageByFile('tv-samsung-santos.svg'), imageByFile('tv-marcas-santos.svg'), imageByFile('tv-smart-tv-santos.svg')];
    if (text.includes('lg')) return [imageByFile('tv-lg-santos.svg'), imageByFile('tv-marcas-santos.svg'), imageByFile('tv-smart-tv-santos.svg')];
    if (text.includes('philco')) return [imageByFile('tv-philco-santos.svg'), imageByFile('tv-marcas-santos.svg'), imageByFile('tv-led-pisca-santos.svg')];
    if (text.includes('panasonic')) return [imageByFile('tv-panasonic-santos.svg'), imageByFile('tv-marcas-santos.svg'), imageByFile('tv-backlight-santos.svg')];
    if (text.includes('aoc') || text.includes('tcl')) return [imageByFile('tv-aoc-tcl-santos.svg'), imageByFile('tv-marcas-santos.svg'), imageByFile('tv-hdmi-santos.svg')];
    if (text.includes('sony') || text.includes('philips')) return [imageByFile('tv-sony-philips-santos.svg'), imageByFile('tv-marcas-santos.svg'), imageByFile('tv-som-sem-imagem-santos.svg')];
    return [
      imageByFile('tv-marcas-santos.svg'),
      imageByFile('tv-smart-tv-santos.svg'),
      imageByFile('tv-led-pisca-santos.svg'),
      imageByFile('tv-backlight-santos.svg'),
      imageByFile('tv-linhas-tela-santos.svg'),
      imageByFile('tv-hdmi-santos.svg')
    ];
  }

  if (kind === 'micro') {
    if (text.includes('faisca') || text.includes('faísca') || text.includes('mica')) return [imageByFile('microondas-faisca-santos.svg'), imageByFile('microondas-alta-tensao-santos.svg'), imageByFile('assistencia-tecnica-microondas-santos.svg')];
    if (text.includes('magnetron') || text.includes('nao-esquenta') || text.includes('não esquenta') || text.includes('esquentando')) return [imageByFile('microondas-nao-esquenta-santos.svg'), imageByFile('microondas-magnetron-santos.svg'), imageByFile('microondas-orcamento-santos.svg')];
    if (text.includes('porta')) return [imageByFile('microondas-porta-santos.svg'), imageByFile('assistencia-tecnica-microondas-santos.svg'), imageByFile('microondas-painel-santos.svg')];
    if (text.includes('painel') || text.includes('teclas')) return [imageByFile('microondas-painel-santos.svg'), imageByFile('microondas-prato-santos.svg'), imageByFile('assistencia-tecnica-microondas-santos.svg')];
    if (text.includes('capacitor') || text.includes('transformador') || text.includes('fusivel') || text.includes('fusível') || text.includes('disjuntor')) return [imageByFile('microondas-alta-tensao-santos.svg'), imageByFile('microondas-magnetron-santos.svg'), imageByFile('assistencia-tecnica-microondas-santos.svg')];
    return imagePools.micro;
  }

  if (kind === 'local') {
    if (text.includes('macuco')) return [imageByFile('assistencia-tecnica-macuco-santos.svg'), imageByFile('assistencia-tecnica-santos.svg'), imageByFile('bancada-diagnostico-eletronico.svg')];
    return [
      imageByFile('assistencia-baixada-santista.svg'),
      imageByFile('assistencia-tecnica-santos.svg'),
      imageByFile('assistencia-tecnica-macuco-santos.svg'),
      imageByFile('assistencia-tecnica-bairros-santos.svg'),
      imageByFile('atendimento-macuco-santos.svg'),
      imageByFile('bancada-diagnostico-eletronico.svg')
    ];
  }

  if (kind === 'budget') {
    if (text.includes('micro')) return [imageByFile('orcamento-conserto-microondas-santos.svg'), imageByFile('microondas-orcamento-santos.svg'), imageByFile('assistencia-tecnica-microondas-santos.svg')];
    if (text.includes('tv')) return [imageByFile('orcamento-conserto-tv-santos.svg'), imageByFile('orcamento-assistencia-santos.svg'), imageByFile('bancada-diagnostico-eletronico.svg')];
    return imagePools.budget;
  }

  if (text.includes('sem-imagem') || text.includes('som-sem-imagem') || text.includes('qled')) return [imageByFile('tv-som-sem-imagem-santos.svg'), imageByFile('tv-backlight-santos.svg'), imageByFile('tv-linhas-tela-santos.svg')];
  if (text.includes('backlight') || text.includes('tela-escura') || text.includes('metade')) return [imageByFile('tv-backlight-santos.svg'), imageByFile('tv-som-sem-imagem-santos.svg'), imageByFile('tv-linhas-tela-santos.svg')];
  if (text.includes('hdmi') || text.includes('antena') || text.includes('canais')) return [imageByFile('tv-hdmi-santos.svg'), imageByFile('tv-smart-tv-santos.svg'), imageByFile('tv-marcas-santos.svg')];
  if (text.includes('linhas') || text.includes('manchas') || text.includes('azulada') || text.includes('oled') || text.includes('lcd')) return [imageByFile('tv-linhas-tela-santos.svg'), imageByFile('tv-backlight-santos.svg'), imageByFile('tv-som-sem-imagem-santos.svg')];
  if (text.includes('energia') || text.includes('estalo') || text.includes('molhou') || text.includes('caiu')) return [imageByFile('tv-queda-energia-santos.svg'), imageByFile('tv-nao-liga-santos.svg'), imageByFile('bancada-diagnostico-eletronico.svg')];
  if (text.includes('smart') || text.includes('internet') || text.includes('apps') || text.includes('logo')) return [imageByFile('tv-smart-tv-santos.svg'), imageByFile('tv-marcas-santos.svg'), imageByFile('tv-hdmi-santos.svg')];
  if (text.includes('led') || text.includes('pisca') || text.includes('standby')) return [imageByFile('tv-led-pisca-santos.svg'), imageByFile('tv-nao-liga-santos.svg'), imageByFile('tv-queda-energia-santos.svg')];
  return imagePools.tv;
}

function uniqueImages(images) {
  return [...new Map(images.map((image) => [image.url, image])).values()];
}

function fallbackImageCandidatesFor(post) {
  const kind = kindOf(post);
  const safeTv = [
    imageByFile('tv-nao-liga-santos.svg'),
    imageByFile('tv-som-sem-imagem-santos.svg'),
    imageByFile('tv-led-pisca-santos.svg'),
    imageByFile('tv-backlight-santos.svg'),
    imageByFile('tv-hdmi-santos.svg'),
    imageByFile('tv-linhas-tela-santos.svg'),
    imageByFile('tv-smart-tv-santos.svg'),
    imageByFile('tv-queda-energia-santos.svg'),
    imageByFile('tv-marcas-santos.svg'),
    imageByFile('tv-audio-santos.svg'),
    imageByFile('tv-painel-santos.svg'),
    imageByFile('tv-controle-remoto-santos.svg'),
    imageByFile('tv-entrada-antena-santos.svg'),
    imageByFile('tv-diagnostico-santos.svg'),
    imageByFile('tv-orcamento-tecnico-santos.svg'),
    imageByFile('bancada-diagnostico-eletronico.svg')
  ];

  if (kind === 'micro') return imagePools.micro;
  if (kind === 'local') return [...imagePools.local, imageByFile('orcamento-assistencia-santos.svg'), imageByFile('bancada-diagnostico-eletronico.svg')];
  if (kind === 'budget') return [...imagePools.budget, imageByFile('bancada-diagnostico-eletronico.svg'), imageByFile('assistencia-tecnica-santos.svg')];
  if (kind === 'brand') return safeTv;
  return safeTv;
}

function chooseImage(post, counts) {
  const primaryCandidates = imageCandidatesFor(post);
  const primarySorted = [...primaryCandidates].sort((a, b) => {
    const countDiff = (counts[a.url] || 0) - (counts[b.url] || 0);
    return countDiff || a.url.localeCompare(b.url);
  });
  const fallbackSorted = uniqueImages([...primaryCandidates, ...fallbackImageCandidatesFor(post)]).sort((a, b) => {
    const countDiff = (counts[a.url] || 0) - (counts[b.url] || 0);
    return countDiff || a.url.localeCompare(b.url);
  });
  const chosen = primarySorted.find((image) => (counts[image.url] || 0) < 3)
    || fallbackSorted.find((image) => (counts[image.url] || 0) < 3)
    || fallbackSorted[0];
  counts[chosen.url] = (counts[chosen.url] || 0) + 1;
  return chosen;
}

function assignImages(items, counts = {}) {
  return items.map((post) => {
    const chosen = chooseImage(post, counts);
    return {
      ...post,
      image: chosen,
      imageAlt: chosen.alt
    };
  });
}

function applyPublishedRevisions(posts) {
  return posts.map((post) => {
    const revision = publishedRevisions[post.slug];
    if (!revision) return post;
    return {
      ...post,
      description: revision.description,
      intro: revision.intro,
      sections: [...sections(revision.sections), ...depthSectionsFor(post)],
      faq: faq(revision.faq),
      keywords: keywordsFor(post),
      cta: ctaFor(post),
      links: linksFor(post)
    };
  });
}

function applyDraftRevisions(drafts) {
  return drafts.map((post) => {
    const cleanedTitle = post.title
      .replace(/assistência autorizada/gi, 'assistência técnica independente')
      .replace(/autorizada oficial/gi, 'serviço técnico independente');
    const base = {
      ...post,
      title: cleanedTitle,
      description: descriptionForDraft({ ...post, title: cleanedTitle }),
      intro: introForDraft({ ...post, title: cleanedTitle }),
      sections: [...sectionsForDraft({ ...post, title: cleanedTitle }), ...depthSectionsFor({ ...post, title: cleanedTitle })],
      faq: faqForDraft({ ...post, title: cleanedTitle }),
      keywords: keywordsFor({ ...post, title: cleanedTitle }),
      cta: ctaFor({ ...post, title: cleanedTitle }),
      links: linksFor({ ...post, title: cleanedTitle })
    };
    return base;
  });
}

function reorderDrafts(drafts) {
  const order = ['Conserto de TV', 'Conserto de micro-ondas', 'Marcas de TV', 'Guias e orçamento', 'SEO local'];
  const buckets = groupBy(drafts, (post) => post.category);
  const result = [];
  while (result.length < drafts.length) {
    let moved = false;
    for (const category of order) {
      const next = buckets[category]?.shift();
      if (next) {
        result.push(next);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return result;
}

function imageAudit(items) {
  const byImage = groupBy(items, imageUrlOf);
  const repeated = Object.entries(byImage)
    .filter(([url, posts]) => url && posts.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
  const missing = items.filter((post) => !imageUrlOf(post));
  return {
    total: items.length,
    uniqueImages: Object.keys(byImage).filter(Boolean).length,
    repeated,
    missing,
    mostRepeated: repeated[0] || null
  };
}

function categoryStats(items) {
  return Object.entries(groupBy(items, (post) => post.category))
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    .map(([category, posts]) => ({ category, count: posts.length }));
}

function table(rows, columns) {
  const header = `| ${columns.join(' | ')} |`;
  const separator = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => String(row[column] ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  return [header, separator, ...body].join('\n');
}

function imageNameStatus(url) {
  const name = url.split('/').pop() || '';
  return /^[a-z0-9]+(?:-[a-z0-9]+)+\.(svg|webp|png|jpe?g)$/i.test(name) ? 'ok' : 'revisar';
}

function makeImageReport(before, after, itemsAfter) {
  const repeatedRows = after.repeated.map(([url, posts]) => ({
    imagem: url,
    usos: posts.length,
    slugs: posts.map((post) => post.slug).join(', ')
  }));
  const allRows = itemsAfter.map((post) => ({
    slug: post.slug,
    categoria: post.category,
    imagem: imageUrlOf(post),
    alt: imageAltOf(post),
    nome: imageNameStatus(imageUrlOf(post))
  }));

  return `# SEO_AUDITORIA_IMAGENS

## Resumo

- Total de artigos analisados: ${after.total}
- Total de imagens únicas após revisão: ${after.uniqueImages}
- Total de imagens repetidas após revisão: ${after.repeated.length}
- Imagem mais repetida antes: ${before.mostRepeated ? `${before.mostRepeated[0]} (${before.mostRepeated[1].length} usos)` : 'nenhuma'}
- Imagem mais repetida depois: ${after.mostRepeated ? `${after.mostRepeated[0]} (${after.mostRepeated[1].length} usos)` : 'nenhuma'}
- Artigos sem imagem antes: ${before.missing.length}
- Artigos sem imagem depois: ${after.missing.length}

## Imagens repetidas após revisão

${repeatedRows.length ? table(repeatedRows, ['imagem', 'usos', 'slugs']) : 'Nenhuma repetição encontrada.'}

## Artigos sem imagem

${after.missing.length ? after.missing.map((post) => `- ${post.slug}`).join('\n') : 'Nenhum artigo sem imagem.'}

## Imagens incompatíveis com categoria

Não foram mantidas imagens incompatíveis após a revisão. Artigos de TV usam assets de TV/bancada; artigos de micro-ondas usam assets de micro-ondas; artigos de orçamento usam assets institucionais ou de orçamento; artigos locais usam assets de atendimento local.

## SEO técnico das imagens: nome de arquivo, alt, OG, Twitter e schema

- O build agora copia 'assets/' para 'dist/assets/'.
- Cada artigo possui 'image.url', 'image.alt' e 'imageAlt'.
- O HTML usa 'alt' na imagem principal e nos cards.
- 'og:image' recebe URL absoluta.
- 'twitter:image' foi adicionado.
- 'BlogPosting.image' recebe URL absoluta.
- O validador passa a exigir imagem, alt, CTA e links contextuais.
- Os nomes novos seguem padrão SEO-friendly com hífens e tema claro.

## Lista de imagens por artigo

${table(allRows, ['slug', 'categoria', 'imagem', 'alt', 'nome'])}

## Recomendações de substituição

- Manter o acervo local gerado como base segura, sem dependência de imagem aleatória da internet.
- Se o objetivo for máxima compatibilidade visual em redes sociais, converter os SVGs finais para WebP mantendo os mesmos nomes semânticos.
- Evitar usar logos de fabricantes como imagem principal, salvo em contexto informativo e sem sugerir assistência autorizada.
- Não repetir a mesma imagem em artigos publicados na mesma semana.

## Acervo mínimo ideal

O acervo mínimo recomendado é de 30 imagens para 88 artigos, permitindo no máximo 3 usos por imagem na maior parte do conjunto. Foram criados ${assetDefinitions.length} assets locais em \`assets/images/seo/\`.
`;
}

function makeLinksReport(items) {
  const rows = items.map((post) => ({
    slug: post.slug,
    categoria: post.category,
    links: post.links.map((link) => link.url).join(', ')
  }));
  return `# SEO_MAPA_LINKS_INTERNOS

## Estratégia

O blog continua como central editorial em 'https://blog.consertoeletroled.com'. O site principal continua como central comercial em 'https://consertoeletroled.com'. Os links internos foram organizados para apoiar navegação útil sem transformar os artigos em spam.

## Regras aplicadas

- Artigos de TV linkam para guias de TV, orçamento de TV, home do blog, site principal e contato.
- Artigos de micro-ondas linkam para guias de segurança/aquecimento, home do blog, site principal e contato.
- Artigos de orçamento linkam para contato, site principal e defeitos comuns.
- Artigos locais reforçam Santos, Macuco, atendimento local, site principal e contato.
- Links para páginas comerciais futuras ficam documentados abaixo, mas não foram adicionados como URL inexistente no HTML.

## Mapa aplicado nos artigos

${table(rows, ['slug', 'categoria', 'links'])}

## Páginas comerciais futuras recomendadas no domínio principal

- 'https://consertoeletroled.com/conserto-de-tv-em-santos'
- 'https://consertoeletroled.com/conserto-de-microondas-em-santos'
- 'https://consertoeletroled.com/assistencia-tecnica-tv-santos'
- 'https://consertoeletroled.com/orcamento-conserto-tv-santos'

Essas URLs não foram inseridas como links nos artigos porque ainda não foram confirmadas como páginas reais.
`;
}

function makeOrderReport(oldDrafts, newDrafts) {
  const current = oldDrafts.map((post, index) => ({
    pos: index + 1,
    slug: post.slug,
    categoria: post.category
  }));
  const suggested = newDrafts.map((post, index) => ({
    pos: index + 1,
    slug: post.slug,
    categoria: post.category
  }));
  const weeks = [];
  for (let i = 0; i < suggested.length; i += 5) {
    const slice = suggested.slice(i, i + 5);
    weeks.push({
      semana: Math.floor(i / 5) + 1,
      segunda: slice[0]?.categoria || '',
      terca: slice[1]?.categoria || '',
      quarta: slice[2]?.categoria || '',
      quinta: slice[3]?.categoria || '',
      sexta: slice[4]?.categoria || ''
    });
  }

  return `# SEO_ORDEM_PUBLICACAO

## Lógica

A automação existente publica o primeiro item de 'content/drafts.json'. A ordem foi reorganizada sem alterar o scheduler, alternando categorias para reduzir canibalização e aparência automática.

Ordem preferencial usada:

1. Conserto de TV
2. Conserto de micro-ondas
3. Marcas de TV
4. Guias e orçamento
5. SEO local

## Riscos evitados

- Muitos artigos consecutivos sobre o mesmo tipo de defeito.
- Sequência excessiva de marcas de TV.
- Repetição visual em artigos publicados próximos.
- Canibalização entre posts com intenção parecida.
- Picos artificiais de conteúdo com o mesmo tema.

## Ordem atual antes da revisão

${table(current, ['pos', 'slug', 'categoria'])}

## Ordem sugerida aplicada

${table(suggested, ['pos', 'slug', 'categoria'])}

## Distribuição por semana

${table(weeks, ['semana', 'segunda', 'terca', 'quarta', 'quinta', 'sexta'])}
`;
}

function makeArticlesReport(beforePosts, afterPosts, beforeDrafts, afterDrafts) {
  const beforePostStats = stats(beforePosts);
  const afterPostStats = stats(afterPosts);
  const beforeDraftStats = stats(beforeDrafts);
  const afterDraftStats = stats(afterDrafts);
  const all = [...afterPosts, ...afterDrafts];
  const duplicateSlugs = Object.entries(groupBy(all, (post) => post.slug)).filter(([, posts]) => posts.length > 1);
  const similarTitleRows = Object.entries(groupBy(afterDrafts, (post) => post.title.split(':')[0].replace(/\b(Santos|causas|cuidados|defeitos|comuns)\b/gi, '').trim().toLowerCase()))
    .filter(([key, posts]) => key && posts.length > 1)
    .slice(0, 20)
    .map(([grupo, posts]) => ({ grupo, slugs: posts.map((post) => post.slug).join(', ') }));
  const categoryRows = categoryStats(afterDrafts).map(({ category, count }) => ({ categoria: category, drafts: count }));

  return `# SEO_AUDITORIA_80_ARTIGOS

## Resumo

- Total de drafts: ${afterDrafts.length}
- Total de posts publicados: ${afterPosts.length}
- Posts publicados revisados: ${afterPosts.length}
- Drafts revisados: ${afterDrafts.length}
- Slugs duplicados: ${duplicateSlugs.length}

## Distribuição por categoria dos drafts

${table(categoryRows, ['categoria', 'drafts'])}

## Média de palavras

| Grupo | Antes | Depois |
| --- | ---: | ---: |
| Publicados | ${beforePostStats.avg} | ${afterPostStats.avg} |
| Drafts | ${beforeDraftStats.avg} | ${afterDraftStats.avg} |

## Slugs duplicados ou problemáticos

${duplicateSlugs.length ? duplicateSlugs.map(([slug]) => `- ${slug}`).join('\n') : 'Nenhum slug duplicado encontrado.'}

## Títulos parecidos

${similarTitleRows.length ? table(similarTitleRows, ['grupo', 'slugs']) : 'Nenhum grupo crítico de título repetitivo após a revisão.'}

## Possíveis canibalizações

- Artigos de marcas e tamanhos de TV têm proximidade temática, mas foram mantidos porque atacam intenções diferentes: marca, tecnologia, tamanho e defeito.
- Artigos de micro-ondas sobre aquecimento foram diferenciados por peça, sintoma e risco: magnetron, capacitor, fusível, alta tensão e marcas.
- Artigos locais foram mantidos por intenção geográfica, mas devem ser publicados alternados com outros temas.

## Artigos mais fortes

- 'tv-nao-liga-em-santos'
- 'tv-com-som-sem-imagem'
- 'microondas-nao-esquenta-santos'
- 'microondas-soltando-faisca'
- 'quanto-custa-consertar-tv-santos'

## Artigos que mais precisaram de edição

- Os 8 publicados, porque estavam abaixo do novo padrão de profundidade.
- Drafts de TV, porque tinham descrições e imagens muito repetidas.
- Drafts de micro-ondas, porque exigiam reforço de segurança e variação de FAQ.
- Artigos de marca, porque precisavam linguagem segura de serviço independente.

## Riscos SEO encontrados

- Uso repetido de poucas imagens.
- Posts publicados sem imagem declarada.
- Falta de 'twitter:image'.
- Ausência de exigência de CTA e links no validador.
- Possível canibalização se drafts fossem publicados em sequência por categoria.
- Risco jurídico/editorial ao falar de marcas sem explicitar serviço independente.

## Alterações feitas

- Expansão dos 8 artigos publicados para padrão mais robusto.
- Revisão dos 80 drafts com descrições, introduções, seções, FAQs, CTAs, links e imagens.
- Reorganização da fila dos drafts.
- Redução de keywords artificiais e muito curtas.
- Inclusão de linguagem segura para marcas.
- Inclusão de imagens locais com nomes semânticos.
- Criação de relatórios de imagens, links e ordem.

## Próximos passos recomendados

1. Rodar a automação normalmente em dias úteis.
2. Monitorar o Search Console depois de cada ciclo de publicação.
3. Se algum artigo performar bem, criar página comercial correspondente no domínio principal.
4. Converter os SVGs mais importantes para WebP caso o foco seja preview social máximo.
5. Revisar dados reais de impressões antes de aumentar o ritmo de publicação.
`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function writeAssets() {
  await mkdir(assetsDir, { recursive: true });
  await Promise.all(assetDefinitions.map((definition) => writeFile(
    path.join(assetsDir, definition.file),
    svgFor({ title: escapeXml(definition.title), type: definition.type })
  )));
}

const posts = await readJson(postsPath);
const drafts = await readJson(draftsPath);
const beforePosts = structuredClone(posts);
const beforeDrafts = structuredClone(drafts);
const beforeAudit = imageAudit([...beforePosts, ...beforeDrafts]);

let revisedPosts = applyPublishedRevisions(posts);
let revisedDrafts = applyDraftRevisions(drafts);
revisedDrafts = reorderDrafts(revisedDrafts);

const revisedWithImages = assignImages([...revisedPosts, ...revisedDrafts]);
revisedPosts = revisedWithImages.slice(0, revisedPosts.length);
revisedDrafts = revisedWithImages.slice(revisedPosts.length);

const afterAudit = imageAudit([...revisedPosts, ...revisedDrafts]);

await writeAssets();
await writeFile(postsPath, `${JSON.stringify(revisedPosts, null, 2)}\n`);
await writeFile(draftsPath, `${JSON.stringify(revisedDrafts, null, 2)}\n`);
await writeFile(path.join(root, 'SEO_AUDITORIA_IMAGENS.md'), makeImageReport(beforeAudit, afterAudit, [...revisedPosts, ...revisedDrafts]));
await writeFile(path.join(root, 'SEO_MAPA_LINKS_INTERNOS.md'), makeLinksReport([...revisedPosts, ...revisedDrafts]));
await writeFile(path.join(root, 'SEO_ORDEM_PUBLICACAO.md'), makeOrderReport(beforeDrafts, revisedDrafts));
await writeFile(path.join(root, 'SEO_AUDITORIA_80_ARTIGOS.md'), makeArticlesReport(beforePosts, revisedPosts, beforeDrafts, revisedDrafts));

console.log(JSON.stringify({
  posts: revisedPosts.length,
  drafts: revisedDrafts.length,
  beforePostWordAvg: stats(beforePosts).avg,
  afterPostWordAvg: stats(revisedPosts).avg,
  beforeDraftWordAvg: stats(beforeDrafts).avg,
  afterDraftWordAvg: stats(revisedDrafts).avg,
  beforeMissingImages: beforeAudit.missing.length,
  afterMissingImages: afterAudit.missing.length,
  beforeUniqueImages: beforeAudit.uniqueImages,
  afterUniqueImages: afterAudit.uniqueImages,
  assets: assetDefinitions.length
}, null, 2));
