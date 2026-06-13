import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const images = {
  tv: {
    url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=806,fit=crop/GlokoPcKnA0JWUEo/40481a296b034d07ba71afb70133cdd8-CGsAhxTpQsyFkbJk.webp',
    alt: 'TV em bancada de assistência técnica da EletroLED em Santos',
    caption: 'Imagem ilustrativa de atendimento técnico para TVs na EletroLED.',
    source: 'Mídia própria da EletroLED no CDN do site principal'
  },
  microwave: {
    url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=814,fit=crop/GlokoPcKnA0JWUEo/modern-microwave-oven-png-image-background-UGB1Atikr8uQTKYj.png',
    alt: 'Micro-ondas em conteúdo de assistência técnica da EletroLED',
    caption: 'Imagem ilustrativa de micro-ondas para orientar diagnóstico e conserto.',
    source: 'Mídia própria da EletroLED no CDN do site principal'
  },
  workbench: {
    url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/GlokoPcKnA0JWUEo/6facfed3-40d3-48c1-a7bd-be58f1c8797d-uoXy5m861ZtME3x2.png',
    alt: 'Bancada de assistência técnica da EletroLED para TVs e micro-ondas em Santos',
    caption: 'Atendimento técnico para TVs e micro-ondas na EletroLED em Santos.',
    source: 'Mídia própria da EletroLED no CDN do site principal'
  },
  lg: {
    url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=626,fit=crop/GlokoPcKnA0JWUEo/lg-logo-1-1024x451-TkJYl7EVfbEsyjv7.png',
    alt: 'Logo LG em conteúdo sobre conserto de TV LG em Santos',
    caption: 'Conteúdo informativo sobre defeitos comuns em TVs LG.',
    source: 'Logo de marca exibido no site principal da EletroLED'
  },
  samsung: {
    url: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=486,fit=crop/GlokoPcKnA0JWUEo/samsung_old_logo_before_year_2015.svg-XqvFxeuhQy8Sm4R1.png',
    alt: 'Logo Samsung em conteúdo sobre conserto de TV Samsung em Santos',
    caption: 'Conteúdo informativo sobre defeitos comuns em TVs Samsung.',
    source: 'Logo de marca exibido no site principal da EletroLED'
  }
};

const tvSymptoms = [
  ['TV LED pisca e não liga: o que pode ser?', 'tv-led-pisca-e-nao-liga', 'LED de standby piscando', 'fonte, placa principal, curto em LEDs ou proteção interna'],
  ['TV desliga sozinha depois de alguns minutos', 'tv-desliga-sozinha', 'desligamento repentino', 'superaquecimento, fonte instável, backlight ou placa principal'],
  ['Smart TV travada no logo: causas e cuidados', 'smart-tv-travada-no-logo', 'travamento no logo', 'software corrompido, memória interna, placa principal ou atualização interrompida'],
  ['TV sem sinal HDMI: entrada queimada ou configuração?', 'tv-sem-sinal-hdmi', 'HDMI sem sinal', 'entrada danificada, cabo ruim, placa principal ou configuração de fonte'],
  ['TV com linhas na tela: quando é placa e quando é painel', 'tv-com-linhas-na-tela', 'linhas verticais ou horizontais', 'cabo flat, T-Con, placa principal ou painel'],
  ['TV com manchas escuras na imagem: o que observar', 'tv-com-manchas-escuras', 'manchas escuras', 'backlight, difusores, sujeira interna ou dano no painel'],
  ['TV com imagem azulada ou roxa: possível desgaste de LEDs', 'tv-imagem-azulada-ou-roxa', 'imagem azulada', 'LEDs do backlight, configuração de cor ou falha no painel'],
  ['TV queimou depois de queda de energia: primeiros cuidados', 'tv-queimou-queda-de-energia', 'falha após queda de energia', 'fonte, fusíveis, proteção contra surto ou placa principal'],
  ['TV não responde ao controle remoto: defeito no controle ou sensor?', 'tv-nao-responde-controle-remoto', 'controle sem resposta', 'controle remoto, sensor infravermelho, teclado lateral ou placa'],
  ['Smart TV sem internet: rede, sistema ou placa Wi-Fi?', 'smart-tv-sem-internet', 'Wi-Fi ou rede sem funcionar', 'configuração de rede, módulo Wi-Fi, software ou placa principal'],
  ['Smart TV lenta e travando aplicativos: o que fazer', 'smart-tv-lenta-travando-apps', 'aplicativos travando', 'memória cheia, sistema antigo, conexão instável ou placa principal'],
  ['TV com tela piscando: sinais de backlight ou fonte', 'tv-com-tela-piscando', 'tela piscando', 'backlight, fonte instável, cabo flat ou placa T-Con'],
  ['TV faz estalo e apaga: é perigoso insistir?', 'tv-faz-estalo-e-apaga', 'estalo e desligamento', 'fonte, curto, capacitor, placa ou proteção interna'],
  ['TV com som baixo ou falhando: alto-falante ou placa?', 'tv-com-som-baixo-ou-falhando', 'som baixo ou falhando', 'alto-falantes, placa de áudio, configuração ou cabo interno'],
  ['TV não encontra canais: antena, sintonia ou entrada RF?', 'tv-nao-encontra-canais', 'canais não encontrados', 'antena, cabo coaxial, entrada RF ou sintonizador'],
  ['TV com metade da tela escura: causas prováveis', 'tv-metade-da-tela-escura', 'metade da tela escura', 'backlight, cabo flat, T-Con ou painel'],
  ['TV OLED com marca na tela: o que pode ser feito', 'tv-oled-marca-na-tela', 'marca fixa na tela', 'retenção de imagem, burn-in ou configuração de painel'],
  ['TV QLED sem imagem: diagnóstico antes de trocar peça', 'tv-qled-sem-imagem', 'QLED sem imagem', 'fonte, placa principal, backlight específico ou painel'],
  ['TV LCD com imagem negativa ou cores estranhas', 'tv-lcd-imagem-negativa', 'imagem negativa', 'T-Con, cabo flat, painel ou configuração de imagem'],
  ['Backlight queimado em TV LED: sintomas e orçamento', 'backlight-queimado-tv-led-santos', 'backlight queimado', 'LEDs internos, fonte do backlight ou difusores'],
  ['LED de standby piscando na TV: o que significa?', 'led-standby-piscando-tv', 'standby piscando', 'proteção eletrônica, fonte, placa principal ou curto'],
  ['Entrada HDMI queimada na TV: tem conserto?', 'entrada-hdmi-queimada-tv', 'HDMI queimado', 'porta HDMI, proteção ESD, solda ou placa principal'],
  ['Entrada de antena ruim na TV: como identificar', 'entrada-antena-tv-ruim', 'entrada de antena falhando', 'conector RF, sintonizador, cabo ou antena'],
  ['TV molhou: o que fazer antes de ligar de novo', 'tv-molhou-o-que-fazer', 'TV com contato com líquido', 'umidade, oxidação, curto em placas ou painel'],
  ['TV caiu no chão: vale levar para avaliação?', 'tv-caiu-no-chao-santos', 'TV após queda', 'painel quebrado, cabos internos, moldura, fonte ou placa']
];

const microwaveSymptoms = [
  ['Micro-ondas liga e desliga sozinho: causas comuns', 'microondas-liga-e-desliga-sozinho', 'liga e desliga sozinho', 'microchaves, placa eletrônica, fonte interna ou superaquecimento'],
  ['Micro-ondas com prato que não gira: motor ou acoplador?', 'microondas-prato-nao-gira', 'prato não gira', 'motor do prato, acoplador, suporte, engrenagem ou placa'],
  ['Micro-ondas com painel apagado: o que verificar', 'microondas-painel-apagado', 'painel apagado', 'fusível, placa de comando, cabo de energia ou transformador auxiliar'],
  ['Micro-ondas fazendo barulho alto: é normal?', 'microondas-fazendo-barulho-alto', 'barulho alto', 'ventilador, motor do prato, transformador, magnetron ou suporte solto'],
  ['Micro-ondas com cheiro de queimado: quando parar de usar', 'microondas-cheiro-de-queimado', 'cheiro de queimado', 'placa mica, fio aquecido, transformador, magnetron ou sujeira carbonizada'],
  ['Porta do micro-ondas não fecha direito: risco e reparo', 'microondas-porta-nao-fecha', 'porta não fecha', 'trava, dobradiça, microchaves ou alinhamento da porta'],
  ['Teclas do micro-ondas não funcionam: painel ou membrana?', 'teclas-microondas-nao-funcionam', 'teclas sem resposta', 'membrana, painel touch, placa eletrônica ou umidade'],
  ['Micro-ondas desarma o disjuntor: possível curto interno', 'microondas-desarma-disjuntor', 'disjuntor desarmando', 'curto, capacitor, magnetron, transformador ou fiação'],
  ['Micro-ondas enferrujado por dentro: ainda dá para usar?', 'microondas-enferrujado-por-dentro', 'ferrugem interna', 'pintura danificada, umidade, cavidade comprometida ou faísca'],
  ['Micro-ondas acende a luz mas não funciona', 'microondas-luz-acesa-nao-funciona', 'luz acesa sem funcionamento', 'travas de porta, placa, motor ou sistema de alta tensão'],
  ['Micro-ondas esquentando pouco: o que pode ser?', 'microondas-esquentando-pouco', 'aquecimento fraco', 'magnetron cansado, diodo, capacitor ou tensão inadequada'],
  ['Micro-ondas queimando fusível: por que acontece?', 'microondas-queimando-fusivel', 'fusível queimando', 'curto interno, alta tensão, capacitor, magnetron ou microchave'],
  ['Transformador de micro-ondas com defeito: sintomas', 'transformador-microondas-defeito', 'falha no transformador', 'transformador, alta tensão, magnetron ou curto associado'],
  ['Capacitor de micro-ondas: por que exige técnico?', 'capacitor-microondas-alta-tensao', 'capacitor de alta tensão', 'capacitor, diodo, magnetron e risco de choque'],
  ['Magnetron do micro-ondas com defeito: sinais comuns', 'magnetron-microondas-defeito', 'magnetron com defeito', 'magnetron, diodo, capacitor ou guia de onda'],
  ['Placa mica queimada no micro-ondas: o que fazer', 'placa-mica-microondas-queimada', 'placa mica queimada', 'placa mica, sujeira, gordura carbonizada ou guia de onda'],
  ['Ventilador do micro-ondas não gira: atenção ao aquecimento', 'ventilador-microondas-nao-gira', 'ventilador parado', 'motor do ventilador, placa, sujeira ou travamento mecânico'],
  ['Micro-ondas Consul não esquenta: diagnóstico em Santos', 'microondas-consul-nao-esquenta-santos', 'Consul não esquenta', 'magnetron, capacitor, diodo, microchaves ou placa'],
  ['Micro-ondas Brastemp não esquenta: causas prováveis', 'microondas-brastemp-nao-esquenta-santos', 'Brastemp não esquenta', 'sistema de alta tensão, magnetron, placa ou fusível'],
  ['Micro-ondas Electrolux não esquenta: quando chamar assistência', 'microondas-electrolux-nao-esquenta-santos', 'Electrolux não esquenta', 'magnetron, diodo, capacitor, fusível ou chave de porta']
];

const brandTopics = [
  ['Conserto de TV Philco em Santos: defeitos mais comuns', 'conserto-tv-philco-santos', 'Philco', 'travamentos, fonte, tela escura e falhas de HDMI'],
  ['Conserto de TV AOC em Santos: sem imagem, fonte e tela', 'conserto-tv-aoc-santos', 'AOC', 'sem imagem, backlight, linhas na tela e fonte'],
  ['Conserto de TV TCL em Santos: Smart TV travando ou sem imagem', 'conserto-tv-tcl-santos', 'TCL', 'sistema Smart, backlight, Wi-Fi e placa principal'],
  ['Conserto de TV Panasonic em Santos: diagnóstico técnico', 'conserto-tv-panasonic-santos', 'Panasonic', 'fonte, tela escura, áudio e placa principal'],
  ['Conserto de TV Sony em Santos: imagem, áudio e placa', 'conserto-tv-sony-santos', 'Sony', 'imagem, áudio, fonte e conectores'],
  ['Conserto de TV Philips em Santos: sintomas frequentes', 'conserto-tv-philips-santos', 'Philips', 'travamento, fonte, backlight e sistema Smart'],
  ['Conserto de TV Semp Toshiba em Santos: vale avaliar?', 'conserto-tv-semp-toshiba-santos', 'Semp Toshiba', 'fonte, tela, sintonizador e placas'],
  ['Conserto de TV CCE em Santos: cuidados antes do reparo', 'conserto-tv-cce-santos', 'CCE', 'fonte, placa, tela e entrada de antena'],
  ['Conserto de Smart TV em Santos: internet, apps e imagem', 'conserto-smart-tv-santos', 'Smart TV', 'internet, aplicativos, placa principal e imagem'],
  ['Conserto de TV 50 polegadas em Santos: quando compensa', 'conserto-tv-50-polegadas-santos', '50 polegadas', 'backlight, fonte, tela e orçamento'],
  ['Conserto de TV 55 polegadas em Santos: cuidados no transporte', 'conserto-tv-55-polegadas-santos', '55 polegadas', 'transporte, painel, backlight e fonte'],
  ['Conserto de TV 65 polegadas em Santos: avaliação técnica', 'conserto-tv-65-polegadas-santos', '65 polegadas', 'painel, backlight, fonte e custo-benefício'],
  ['Conserto de TV 4K em Santos: imagem, HDMI e Smart TV', 'conserto-tv-4k-santos', 'TV 4K', 'HDMI, imagem, placa principal e sistema Smart'],
  ['Conserto de TV LED em Santos: defeitos comuns', 'conserto-tv-led-santos', 'TV LED', 'backlight, fonte, tela escura e standby'],
  ['Conserto de TV LCD em Santos: ainda vale reparar?', 'conserto-tv-lcd-santos', 'TV LCD', 'fonte, lâmpadas, placa e painel']
];

const localTopics = [
  ['Conserto de TV no Gonzaga, Santos: orientação local', 'conserto-tv-gonzaga-santos', 'Gonzaga', 'TV'],
  ['Conserto de TV no Boqueirão, Santos: quando procurar assistência', 'conserto-tv-boqueirao-santos', 'Boqueirão', 'TV'],
  ['Conserto de TV no Embaré, Santos: sintomas que exigem técnico', 'conserto-tv-embare-santos', 'Embaré', 'TV'],
  ['Conserto de TV na Aparecida, Santos: diagnóstico seguro', 'conserto-tv-aparecida-santos', 'Aparecida', 'TV'],
  ['Conserto de TV na Ponta da Praia: atendimento em Santos', 'conserto-tv-ponta-da-praia', 'Ponta da Praia', 'TV'],
  ['Conserto de TV na Vila Mathias: assistência técnica em Santos', 'conserto-tv-vila-mathias', 'Vila Mathias', 'TV'],
  ['Conserto de micro-ondas no Gonzaga, Santos', 'conserto-microondas-gonzaga-santos', 'Gonzaga', 'micro-ondas'],
  ['Conserto de micro-ondas no Boqueirão, Santos', 'conserto-microondas-boqueirao-santos', 'Boqueirão', 'micro-ondas'],
  ['Conserto de micro-ondas no Embaré, Santos', 'conserto-microondas-embare-santos', 'Embaré', 'micro-ondas'],
  ['Conserto de micro-ondas na Aparecida, Santos', 'conserto-microondas-aparecida-santos', 'Aparecida', 'micro-ondas']
];

const guideTopics = [
  ['Vale a pena consertar TV? Como decidir em Santos', 'vale-a-pena-consertar-tv', 'TV', 'custo-benefício'],
  ['Vale a pena consertar micro-ondas? Veja quando compensa', 'vale-a-pena-consertar-microondas', 'micro-ondas', 'custo-benefício'],
  ['Como levar uma TV para assistência sem danificar a tela', 'como-levar-tv-assistencia', 'TV', 'transporte'],
  ['Como transportar micro-ondas para conserto com segurança', 'como-transportar-microondas', 'micro-ondas', 'transporte'],
  ['Orçamento de conserto de TV em Santos: o que informar', 'orcamento-conserto-tv-santos', 'TV', 'orçamento'],
  ['Orçamento de conserto de micro-ondas em Santos: como agilizar', 'orcamento-conserto-microondas-santos', 'micro-ondas', 'orçamento'],
  ['Assistência técnica perto de mim em Santos: como escolher', 'assistencia-tecnica-perto-de-mim-santos', 'TV e micro-ondas', 'busca local'],
  ['Técnico de TV em Santos: sinais de atendimento confiável', 'tecnico-tv-santos-como-escolher', 'TV', 'confiança'],
  ['Manutenção preventiva de TV: cuidados simples em casa', 'manutencao-preventiva-tv', 'TV', 'prevenção'],
  ['Manutenção preventiva de micro-ondas: limpeza e segurança', 'manutencao-preventiva-microondas', 'micro-ondas', 'prevenção']
];

function words(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').split(/\s+/).filter(Boolean);
}

function postImage(key) {
  return images[key] || images.workbench;
}

function tvDepthSections(symptom, causes) {
  return [
    {
      heading: 'Checklist rápido antes do orçamento',
      body: `Antes de levar a TV, anote marca, modelo, tamanho em polegadas, quando o problema começou e se houve queda de energia, chuva forte, queda física ou mudança de tomada. Também vale testar outra tomada e outro cabo quando o modelo permitir. Essas informações ajudam a assistência técnica em Santos a separar defeitos simples de falhas internas ligadas a ${causes}.`
    },
    {
      heading: 'Sinais de que o defeito é interno',
      body: `Quando a TV apresenta ${symptom} junto com estalos, cheiro de queimado, aquecimento excessivo, LED piscando em sequência, tela escura com som ou desligamento logo após ligar, o mais prudente é parar os testes. Esses sinais normalmente pedem medição em fonte, placa principal, backlight, T-Con ou conectores internos, e não tentativa caseira.`
    },
    {
      heading: 'Como explicar o problema no WhatsApp',
      body: 'Para acelerar o primeiro atendimento, envie uma mensagem dizendo o modelo da TV, o sintoma principal, se existe som, se aparece logo na tela, se o controle responde e se o defeito é constante ou intermitente. Se puder, envie uma foto da etiqueta traseira e um vídeo curto mostrando o comportamento do aparelho.'
    },
    {
      heading: 'Por que o diagnóstico evita gasto errado',
      body: 'Em conserto de TV, sintomas parecidos podem ter causas diferentes. Uma tela escura pode ser backlight, fonte, cabo flat ou painel; uma TV que não liga pode ser fonte, placa principal ou proteção interna. O diagnóstico técnico evita comprar peça errada e ajuda o cliente a decidir se o reparo compensa.'
    },
    {
      heading: 'O que costuma influenciar o valor do reparo',
      body: 'O preço depende do tamanho da TV, tipo de painel, disponibilidade de peças, tempo de bancada e causa real do defeito. Reparos em fonte e conectores costumam ter lógica diferente de falhas em painel ou conjunto de LEDs. Por isso, a melhor resposta vem depois do teste, não apenas pelo sintoma contado por mensagem.'
    },
    {
      heading: 'Próximo passo recomendado',
      body: 'Se a TV é usada com frequência e ainda está em bom estado físico, vale pedir orientação antes de trocar por outra. Chame a EletroLED, envie modelo e sintoma, e combine a avaliação. Esse caminho evita pressa, reduz risco de compra desnecessária e ajuda a decidir com informação real.'
    }
  ];
}

function microwaveDepthSections(symptom, causes) {
  return [
    {
      heading: 'Checklist seguro antes de levar o aparelho',
      body: `Anote marca, modelo, capacidade aproximada em litros e descreva quando o micro-ondas começou com ${symptom}. Informe se o defeito apareceu depois de queda de energia, faísca, limpeza interna, uso de metal ou cheiro de queimado. Não abra a tampa: componentes de alta tensão podem manter carga mesmo com o aparelho fora da tomada.`
    },
    {
      heading: 'Sinais de alerta para parar o uso',
      body: `Pare de usar se houver faísca, fumaça, cheiro forte, barulho anormal, disjuntor desarmando, aquecimento irregular ou falha na porta. Esses sinais podem envolver ${causes}, além de placa, fiação, microchaves e sistema de alta tensão. Continuar usando pode aumentar o dano e tornar o reparo menos vantajoso.`
    },
    {
      heading: 'Como descrever o defeito no WhatsApp',
      body: 'Uma boa mensagem informa se o painel acende, se o prato gira, se a luz interna liga, se o alimento esquenta, se há faísca e se a porta fecha corretamente. Foto da etiqueta do aparelho e vídeo curto do sintoma ajudam a EletroLED a orientar o próximo passo antes da avaliação presencial.'
    },
    {
      heading: 'Por que micro-ondas exige assistência técnica',
      body: 'Diferente de aparelhos simples, o micro-ondas combina comando eletrônico, travas de porta e alta tensão. Mesmo defeitos aparentemente pequenos podem envolver segurança. Por isso, a avaliação técnica é importante para decidir se basta trocar peça, corrigir contato, substituir placa mica ou se o custo não compensa.'
    },
    {
      heading: 'O que pesa no orçamento do micro-ondas',
      body: 'O valor do reparo depende da peça afetada, do acesso ao componente, do estado interno, da oxidação e da segurança da porta. Defeitos em placa de comando, magnetron, capacitor, diodo ou transformador têm custos e riscos diferentes. A avaliação mostra se o aparelho ainda compensa ou se a troca é mais racional.'
    },
    {
      heading: 'Próximo passo recomendado',
      body: 'Se o aparelho ainda está conservado e o defeito apareceu de repente, vale pedir uma orientação inicial. Informe a marca, o modelo e o comportamento exato pelo WhatsApp da EletroLED. Se houver faísca, cheiro forte ou disjuntor desarmando, não tente novos testes antes da avaliação.'
    }
  ];
}

function brandDepthSections(brand, focus) {
  return [
    {
      heading: `Checklist para levar uma TV ${brand}`,
      body: `Antes do orçamento, confirme o modelo exato da TV ${brand}, tamanho da tela e ano aproximado de compra. Informe se o problema aparece ao ligar, ao abrir aplicativos, ao usar HDMI ou depois de algum tempo ligada. Esses detalhes ajudam a comparar o sintoma com falhas comuns de ${focus}.`
    },
    {
      heading: 'Diferença entre sintoma e causa real',
      body: 'O cliente vê o sintoma, mas a causa real só aparece no teste. Uma TV sem imagem pode ter backlight, fonte, T-Con, cabo flat ou painel. Uma TV travada pode ter software, memória, placa principal ou alimentação instável. Essa diferença é o motivo para evitar orçamento definitivo sem diagnóstico.'
    },
    {
      heading: 'Cuidados com transporte até a assistência',
      body: 'Transporte a TV sempre em pé, protegendo a tela contra pressão e torção. Evite apoiar objetos sobre o painel, não segure pelo display e leve controle e cabo de energia quando possível. Em TVs grandes, o cuidado no transporte pode evitar dano adicional antes do reparo.'
    },
    {
      heading: 'Como a EletroLED orienta a decisão',
      body: 'A EletroLED avalia o defeito, explica a hipótese técnica e apresenta orçamento para que o cliente compare reparo, idade do aparelho e valor de substituição. A meta é consertar quando faz sentido e orientar com clareza quando o custo não compensa.'
    },
    {
      heading: `Quando uma TV ${brand} costuma merecer orçamento`,
      body: `Vale avaliar principalmente quando a TV ${brand} tem tela inteira, bom estado físico, tamanho maior e defeito eletrônico provável. Mesmo em modelos antigos, um orçamento pode ser útil para comparar reparo e substituição. O que não vale é comprar peça antes de saber se o problema está em fonte, placa, backlight ou painel.`
    },
    {
      heading: 'Próximo passo recomendado',
      body: 'Envie uma mensagem com foto da etiqueta traseira, tamanho da tela e descrição do defeito. Se aparecer imagem, envie foto da tela; se não aparece, diga se há som, LED aceso ou resposta ao controle. Com isso, a EletroLED consegue orientar melhor antes da avaliação.'
    }
  ];
}

function localDepthSections(neighborhood, device, isMicro) {
  return [
    {
      heading: `Como moradores do ${neighborhood} podem agilizar o atendimento`,
      body: `Quem está no ${neighborhood} pode chamar a EletroLED pelo WhatsApp antes de se deslocar. Envie marca, modelo, sintoma e uma foto da etiqueta do aparelho. Isso ajuda a confirmar se o melhor passo é levar o ${device} para avaliação, separar acessórios ou informar algum detalhe antes do orçamento.`
    },
    {
      heading: 'O que levar junto com o aparelho',
      body: isMicro
        ? 'No caso de micro-ondas, normalmente basta levar o aparelho limpo e sem utensílios internos. Se o defeito envolve prato que não gira, leve também o prato e o acoplador para teste. Não leve alimentos ou recipientes.'
        : 'No caso de TV, leve o cabo de energia e o controle remoto quando possível. Se o defeito aparece apenas com HDMI, antena ou fonte externa, informe qual equipamento foi usado para que o diagnóstico considere essa situação.'
    },
    {
      heading: 'Por que o bairro importa para SEO local e para o cliente',
      body: `Mencionar ${neighborhood} não é enfeite: muita gente procura assistência técnica perto de casa ou do trabalho. Conteúdo local ajuda o cliente a entender que a EletroLED atende Santos de forma prática, sem criar endereço falso ou promessa exagerada para cada bairro.`
    },
    {
      heading: 'Como decidir se vale sair para orçamento',
      body: 'Vale buscar avaliação quando o aparelho tem bom estado físico, é usado com frequência e o defeito parece reparável. Quando há tela quebrada, ferrugem intensa ou dano físico grave, o orçamento ainda ajuda a tomar uma decisão consciente.'
    },
    {
      heading: `Atendimento local sem promessa artificial no ${neighborhood}`,
      body: `A EletroLED não precisa fingir ter um endereço em cada bairro para atender bem. O ponto físico fica no Macuco, mas o conteúdo por bairro ajuda quem está no ${neighborhood} a entender distância, sintomas atendidos e como iniciar o contato. Isso é útil para o cliente e coerente para SEO local.`
    },
    {
      heading: 'Próximo passo recomendado',
      body: `Se você está no ${neighborhood}, envie uma mensagem antes de se deslocar. Diga qual aparelho é, qual defeito aparece e se precisa de orientação para levar até a assistência. Assim o atendimento fica mais rápido e o orçamento começa com informações melhores.`
    }
  ];
}

function guideDepthSections(device, focus, isMicro) {
  return [
    {
      heading: 'Perguntas que ajudam na decisão',
      body: `Antes de decidir sobre ${focus}, responda: o aparelho é usado todos os dias? O defeito apareceu de repente? Houve queda, faísca, umidade ou queda de energia? O equipamento ainda atende sua rotina? Essas respostas ajudam a comparar reparo, troca e urgência.`
    },
    {
      heading: 'Quando a economia vira risco',
      body: isMicro
        ? 'No micro-ondas, tentar economizar abrindo o aparelho pode virar risco de choque, curto ou dano maior. Alta tensão, magnetron, capacitor e microchaves exigem avaliação técnica e ferramentas adequadas.'
        : 'Na TV, tentar economizar abrindo a tampa, apertando tela ou comprando placa sem diagnóstico pode transformar um defeito simples em prejuízo maior. Placas, cabos flat e painel são sensíveis.'
    },
    {
      heading: 'Como pedir orientação sem perder tempo',
      body: 'Ao chamar a EletroLED, envie marca, modelo, foto da etiqueta e um resumo objetivo do defeito. Diga o que já foi testado com segurança, como tomada, cabo, controle ou configuração. Isso evita conversa longa e melhora a primeira orientação.'
    },
    {
      heading: 'Critério prático para orçamento',
      body: `O orçamento tende a fazer sentido quando o ${device} está conservado, a peça existe, o reparo fica proporcional ao valor do aparelho e o uso no dia a dia justifica. Quando esses pontos não fecham, a assistência pode orientar com transparência.`
    },
    {
      heading: 'Como evitar decisão por impulso',
      body: `Quando o ${device} para de funcionar, é comum pensar em comprar outro imediatamente. Antes disso, vale comparar preço de reposição, idade do aparelho, defeito provável e urgência. Um orçamento técnico não obriga o conserto, mas dá uma base melhor para decidir sem chute.`
    },
    {
      heading: 'Próximo passo recomendado',
      body: 'Use o WhatsApp para mandar as informações principais e perguntar se vale levar para avaliação. A resposta inicial não substitui diagnóstico, mas ajuda a filtrar casos simples, situações perigosas e reparos que provavelmente merecem orçamento presencial.'
    },
    {
      heading: 'Como esse guia ajuda na prática',
      body: `A função deste conteúdo é reduzir dúvida antes do contato. Em vez de prometer preço fechado sem ver o ${device}, o guia mostra critérios, riscos e informações necessárias para um orçamento melhor. Isso poupa tempo do cliente, melhora a conversa com o técnico e evita decisões baseadas só em achismo.`
    }
  ];
}

function tvPost([title, slug, symptom, causes]) {
  return {
    title,
    slug,
    category: 'Conserto de TV',
    description: `Entenda o que pode causar ${symptom} em uma TV, quais testes simples são seguros e quando procurar assistência técnica em Santos.`,
    keywords: [
      `${symptom} TV`,
      'conserto de TV em Santos',
      'assistência técnica de TV Santos',
      'EletroLED Assistência Técnica',
      ...words(title).slice(0, 4)
    ],
    image: postImage('tv'),
    intro: `Quando a TV apresenta ${symptom}, o melhor caminho é separar o que pode ser verificado com segurança do que exige diagnóstico técnico. Em Santos, a EletroLED orienta clientes que chegam com esse tipo de defeito e avalia TVs LED, LCD, Smart TV, OLED e QLED.`,
    sections: [
      {
        heading: `O que ${symptom} costuma indicar`,
        body: `Esse sintoma pode estar ligado a ${causes}. O detalhe importante é que televisores diferentes podem apresentar o mesmo comportamento por motivos distintos, então trocar peça sem teste costuma gerar gasto desnecessário.`
      },
      {
        heading: 'O que verificar antes de chamar assistência',
        body: 'Confira tomada, cabo de energia, controle remoto, fonte de sinal e se houve queda de energia recente. Se a TV faz barulho, pisca, esquenta demais ou muda de comportamento a cada tentativa, pare os testes e procure avaliação.'
      },
      {
        heading: 'O que não fazer em casa',
        body: 'Evite abrir a tampa traseira, pressionar o painel, usar secador, bater na tela ou insistir em ligar repetidamente. TVs têm placas sensíveis, partes energizadas e cabos internos delicados.'
      },
      {
        heading: 'Como a EletroLED avalia em Santos',
        body: 'O diagnóstico considera marca, modelo, histórico do defeito e testes internos de fonte, placas, backlight, cabos e painel. Com isso, o orçamento fica mais claro para decidir se o reparo compensa.'
      },
      ...tvDepthSections(symptom, causes)
    ],
    faq: [
      {
        question: `TV com ${symptom} sempre tem conserto?`,
        answer: 'Muitos casos têm conserto, mas depende do modelo, da peça afetada e do estado do painel. O diagnóstico é o que confirma.'
      },
      {
        question: 'Posso continuar tentando ligar a TV?',
        answer: 'Se o sintoma persiste, não é recomendado insistir. Repetir tentativas pode aumentar uma falha elétrica ou danificar outros componentes.'
      },
      {
        question: 'A EletroLED atende esse tipo de defeito em Santos?',
        answer: 'Sim. A EletroLED avalia defeitos de imagem, energia, áudio, placa, backlight e conectores em TVs de várias marcas.'
      }
    ]
  };
}

function microwavePost([title, slug, symptom, causes]) {
  return {
    title,
    slug,
    category: 'Conserto de micro-ondas',
    description: `Veja causas prováveis para micro-ondas com ${symptom}, cuidados de segurança e quando procurar conserto especializado em Santos.`,
    keywords: [
      `micro-ondas ${symptom}`,
      'conserto de micro-ondas em Santos',
      'assistência técnica micro-ondas Santos',
      'EletroLED Assistência Técnica',
      ...words(title).slice(0, 4)
    ],
    image: postImage('microwave'),
    intro: `Micro-ondas com ${symptom} precisa ser tratado com cuidado porque o aparelho trabalha com alta tensão. Mesmo desligado da tomada, alguns componentes podem manter carga, por isso o diagnóstico técnico é mais seguro.`,
    sections: [
      {
        heading: `Por que o micro-ondas fica com ${symptom}`,
        body: `As causas mais prováveis envolvem ${causes}. O painel acender ou o prato girar não significa que o sistema de aquecimento esteja funcionando corretamente.`
      },
      {
        heading: 'Cuidados imediatos',
        body: 'Desligue o aparelho se houver cheiro de queimado, faísca, barulho forte, aquecimento irregular ou queda de disjuntor. Não abra a tampa e não faça testes internos sem ferramenta e conhecimento técnico.'
      },
      {
        heading: 'Quando o conserto costuma compensar',
        body: 'O reparo costuma ser interessante quando a estrutura está conservada, a porta fecha bem e as peças necessárias têm custo compatível. Em aparelhos muito oxidados, o orçamento ajuda a decidir.'
      },
      {
        heading: 'Atendimento da EletroLED em Santos',
        body: 'A EletroLED avalia micro-ondas de marcas como Brastemp, Consul, Electrolux, Panasonic, LG, Samsung, Philco e Midea, com orientação clara antes do reparo.'
      },
      ...microwaveDepthSections(symptom, causes)
    ],
    faq: [
      {
        question: `Micro-ondas com ${symptom} é perigoso?`,
        answer: 'Pode ser, principalmente se houver faísca, cheiro de queimado, barulho alto ou falha de alta tensão. O ideal é interromper o uso e avaliar.'
      },
      {
        question: 'Posso abrir o micro-ondas para olhar?',
        answer: 'Não é recomendado. O micro-ondas tem componentes de alta tensão que podem causar choque mesmo após desligado.'
      },
      {
        question: 'A EletroLED conserta micro-ondas em Santos?',
        answer: 'Sim. A EletroLED realiza diagnóstico e conserto de micro-ondas em Santos.'
      }
    ]
  };
}

function brandPost([title, slug, brand, focus]) {
  const imageKey = brand === 'LG' ? 'lg' : brand === 'Samsung' ? 'samsung' : 'tv';
  return {
    title,
    slug,
    category: 'Marcas de TV',
    description: `Guia sobre defeitos comuns em ${brand}, sintomas que merecem atenção e como buscar assistência técnica em Santos.`,
    keywords: [
      `conserto de TV ${brand} Santos`,
      `assistência técnica TV ${brand}`,
      `${brand} sem imagem`,
      `${brand} não liga`,
      'EletroLED Santos'
    ],
    image: postImage(imageKey),
    intro: `Quem procura conserto de ${brand} em Santos geralmente quer saber se o problema tem reparo e se vale a pena fazer orçamento. A EletroLED avalia sintomas como ${focus} com diagnóstico antes de qualquer troca de peça.`,
    sections: [
      {
        heading: `Defeitos frequentes em ${brand}`,
        body: `Entre as ocorrências comuns estão ${focus}. O mesmo sintoma pode vir de fonte, placa, backlight, cabos ou painel, dependendo do modelo.`
      },
      {
        heading: 'Informações que ajudam no orçamento',
        body: 'Anote o modelo completo, tamanho da tela, tempo de uso e quando o defeito começou. Informe também se houve queda, umidade, oscilação de energia ou tentativa de atualização.'
      },
      {
        heading: 'Por que evitar troca de peça sem teste',
        body: 'Trocar placa ou backlight no chute pode sair caro. O diagnóstico técnico reduz risco de erro e mostra se o reparo é financeiramente razoável.'
      },
      {
        heading: 'Atendimento em Santos',
        body: 'A EletroLED atende TVs de diversas marcas na Av. Siqueira Campos, 148, Macuco, Santos, com orientação pelo WhatsApp antes da avaliação presencial.'
      },
      ...brandDepthSections(brand, focus)
    ],
    faq: [
      {
        question: `${brand} sem imagem tem conserto?`,
        answer: 'Muitas vezes sim. Pode ser backlight, fonte, placa, T-Con, cabo ou painel. O diagnóstico define.'
      },
      {
        question: `Vale a pena consertar uma ${brand}?`,
        answer: 'Depende do tamanho, estado da TV, peça afetada e valor do reparo. TVs maiores costumam merecer avaliação.'
      },
      {
        question: `A EletroLED avalia ${brand} em Santos?`,
        answer: 'Sim. A EletroLED avalia TVs de várias marcas em Santos.'
      }
    ]
  };
}

function localPost([title, slug, neighborhood, device]) {
  const isMicro = device === 'micro-ondas';
  return {
    title,
    slug,
    category: 'SEO local',
    description: `Orientação para quem procura conserto de ${device} no ${neighborhood}, em Santos, com atendimento da EletroLED no Macuco.`,
    keywords: [
      `conserto de ${device} ${neighborhood}`,
      `assistência técnica ${neighborhood} Santos`,
      `conserto de ${device} em Santos`,
      'assistência técnica perto de mim',
      'EletroLED Macuco'
    ],
    image: postImage(isMicro ? 'microwave' : 'workbench'),
    intro: `Moradores do ${neighborhood}, em Santos, costumam procurar uma assistência próxima quando o aparelho apresenta defeito. A EletroLED fica no Macuco, na Av. Siqueira Campos, 148, e orienta clientes de vários bairros da cidade.`,
    sections: [
      {
        heading: `Quando levar ${device} para avaliação`,
        body: isMicro
          ? 'Procure assistência se o micro-ondas não esquenta, solta faísca, faz barulho forte, desarma o disjuntor, fica com painel apagado ou apresenta cheiro de queimado.'
          : 'Procure assistência se a TV não liga, fica sem imagem, tem som sem tela, apresenta linhas, reinicia sozinha, falha HDMI ou travamento de Smart TV.'
      },
      {
        heading: `Por que escolher atendimento local em Santos`,
        body: 'A proximidade facilita orçamento, retirada do aparelho e comunicação. Também ajuda a explicar melhor o sintoma e acompanhar o andamento do reparo.'
      },
      {
        heading: 'Como agilizar o contato',
        body: 'Envie marca, modelo, tamanho ou capacidade, e descreva o que acontece. Se possível, informe se houve queda de energia, umidade, queda física ou faísca.'
      },
      {
        heading: 'EletroLED no Macuco',
        body: `A EletroLED atende clientes do ${neighborhood} e de outros bairros de Santos com foco em TVs e micro-ondas, sempre com diagnóstico antes da decisão de reparo.`
      },
      ...localDepthSections(neighborhood, device, isMicro)
    ],
    faq: [
      {
        question: `A EletroLED atende clientes do ${neighborhood}?`,
        answer: `Sim. A assistência fica no Macuco e atende clientes do ${neighborhood} e de outras regiões de Santos.`
      },
      {
        question: `Preciso levar o ${device} até a assistência?`,
        answer: 'O ideal é chamar no WhatsApp primeiro para receber orientação sobre o melhor próximo passo.'
      },
      {
        question: 'Onde fica a EletroLED?',
        answer: 'A EletroLED fica na Av. Siqueira Campos, 148, Macuco, Santos - SP.'
      }
    ]
  };
}

function guidePost([title, slug, device, focus]) {
  const isMicro = device.includes('micro');
  return {
    title,
    slug,
    category: 'Guias e orçamento',
    description: `Guia prático sobre ${focus} para ${device}, com critérios para decidir quando procurar assistência técnica em Santos.`,
    keywords: [
      `${focus} ${device}`,
      `conserto de ${device} em Santos`,
      `orçamento ${device} Santos`,
      'assistência técnica EletroLED',
      'Macuco Santos'
    ],
    image: postImage(isMicro ? 'microwave' : 'workbench'),
    intro: `Antes de decidir pelo conserto de ${device}, vale entender o sintoma, o estado do aparelho e o risco de tentar resolver em casa. A EletroLED orienta clientes em Santos para transformar dúvida em decisão segura.`,
    sections: [
      {
        heading: `O que considerar em ${focus}`,
        body: `Avalie idade do aparelho, frequência de uso, estado físico, disponibilidade de peças e valor estimado do reparo. Um diagnóstico técnico evita decidir apenas pelo medo de gastar.`
      },
      {
        heading: 'Informações que ajudam o técnico',
        body: 'Marca, modelo, tempo de uso, defeito percebido e histórico recente fazem diferença. Fotos e vídeos curtos também ajudam no primeiro contato por WhatsApp.'
      },
      {
        heading: 'Quando não insistir em testes caseiros',
        body: isMicro
          ? 'No micro-ondas, alta tensão e risco de choque pedem cuidado. Se há faísca, cheiro de queimado ou disjuntor desarmando, pare o uso.'
          : 'Na TV, insistir quando há estalos, tela piscando ou falha após queda de energia pode agravar fonte, placa ou painel.'
      },
      {
        heading: 'Como a EletroLED pode ajudar',
        body: 'A EletroLED faz orientação inicial pelo WhatsApp e avaliação técnica em Santos para TVs e micro-ondas, com foco em orçamento claro e reparo quando compensa.'
      },
      ...guideDepthSections(device, focus, isMicro)
    ],
    faq: [
      {
        question: `Dá para decidir sobre ${device} só pelo WhatsApp?`,
        answer: 'Dá para orientar e levantar hipóteses, mas o valor correto depende de diagnóstico técnico.'
      },
      {
        question: `Quando o conserto de ${device} compensa?`,
        answer: 'Compensa quando o aparelho está conservado, a peça tem custo razoável e o reparo fica abaixo de uma substituição.'
      },
      {
        question: 'A EletroLED faz orçamento em Santos?',
        answer: 'Sim. A EletroLED atende TVs e micro-ondas em Santos, na Av. Siqueira Campos, 148, Macuco.'
      }
    ]
  };
}

const drafts = [
  ...tvSymptoms.map(tvPost),
  ...microwaveSymptoms.map(microwavePost),
  ...brandTopics.map(brandPost),
  ...localTopics.map(localPost),
  ...guideTopics.map(guidePost)
];

if (drafts.length !== 80) {
  throw new Error(`Esperava 80 rascunhos, gerei ${drafts.length}.`);
}

await writeFile(path.join(root, 'content', 'drafts.json'), `${JSON.stringify(drafts, null, 2)}\n`);
console.log(`Gerados ${drafts.length} rascunhos em content/drafts.json`);
