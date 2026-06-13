# SEO_ORDEM_PUBLICACAO

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

| pos | slug | categoria |
| --- | --- | --- |
| 1 | tv-led-pisca-e-nao-liga | Conserto de TV |
| 2 | microondas-liga-e-desliga-sozinho | Conserto de micro-ondas |
| 3 | conserto-tv-philco-santos | Marcas de TV |
| 4 | vale-a-pena-consertar-tv | Guias e orçamento |
| 5 | conserto-tv-gonzaga-santos | SEO local |
| 6 | tv-desliga-sozinha | Conserto de TV |
| 7 | microondas-prato-nao-gira | Conserto de micro-ondas |
| 8 | conserto-tv-aoc-santos | Marcas de TV |
| 9 | vale-a-pena-consertar-microondas | Guias e orçamento |
| 10 | conserto-tv-boqueirao-santos | SEO local |
| 11 | smart-tv-travada-no-logo | Conserto de TV |
| 12 | microondas-painel-apagado | Conserto de micro-ondas |
| 13 | conserto-tv-tcl-santos | Marcas de TV |
| 14 | como-levar-tv-assistencia | Guias e orçamento |
| 15 | conserto-tv-embare-santos | SEO local |
| 16 | tv-sem-sinal-hdmi | Conserto de TV |
| 17 | microondas-fazendo-barulho-alto | Conserto de micro-ondas |
| 18 | conserto-tv-panasonic-santos | Marcas de TV |
| 19 | como-transportar-microondas | Guias e orçamento |
| 20 | conserto-tv-aparecida-santos | SEO local |
| 21 | tv-com-linhas-na-tela | Conserto de TV |
| 22 | microondas-cheiro-de-queimado | Conserto de micro-ondas |
| 23 | conserto-tv-sony-santos | Marcas de TV |
| 24 | orcamento-conserto-tv-santos | Guias e orçamento |
| 25 | conserto-tv-ponta-da-praia | SEO local |
| 26 | tv-com-manchas-escuras | Conserto de TV |
| 27 | microondas-porta-nao-fecha | Conserto de micro-ondas |
| 28 | conserto-tv-philips-santos | Marcas de TV |
| 29 | orcamento-conserto-microondas-santos | Guias e orçamento |
| 30 | conserto-tv-vila-mathias | SEO local |
| 31 | tv-imagem-azulada-ou-roxa | Conserto de TV |
| 32 | teclas-microondas-nao-funcionam | Conserto de micro-ondas |
| 33 | conserto-tv-semp-toshiba-santos | Marcas de TV |
| 34 | assistencia-tecnica-perto-de-mim-santos | Guias e orçamento |
| 35 | conserto-microondas-gonzaga-santos | SEO local |
| 36 | tv-queimou-queda-de-energia | Conserto de TV |
| 37 | microondas-desarma-disjuntor | Conserto de micro-ondas |
| 38 | conserto-tv-cce-santos | Marcas de TV |
| 39 | tecnico-tv-santos-como-escolher | Guias e orçamento |
| 40 | conserto-microondas-boqueirao-santos | SEO local |
| 41 | tv-nao-responde-controle-remoto | Conserto de TV |
| 42 | microondas-enferrujado-por-dentro | Conserto de micro-ondas |
| 43 | conserto-smart-tv-santos | Marcas de TV |
| 44 | manutencao-preventiva-tv | Guias e orçamento |
| 45 | conserto-microondas-embare-santos | SEO local |
| 46 | smart-tv-sem-internet | Conserto de TV |
| 47 | microondas-luz-acesa-nao-funciona | Conserto de micro-ondas |
| 48 | conserto-tv-50-polegadas-santos | Marcas de TV |
| 49 | manutencao-preventiva-microondas | Guias e orçamento |
| 50 | conserto-microondas-aparecida-santos | SEO local |
| 51 | smart-tv-lenta-travando-apps | Conserto de TV |
| 52 | microondas-esquentando-pouco | Conserto de micro-ondas |
| 53 | conserto-tv-55-polegadas-santos | Marcas de TV |
| 54 | tv-com-tela-piscando | Conserto de TV |
| 55 | microondas-queimando-fusivel | Conserto de micro-ondas |
| 56 | conserto-tv-65-polegadas-santos | Marcas de TV |
| 57 | tv-faz-estalo-e-apaga | Conserto de TV |
| 58 | transformador-microondas-defeito | Conserto de micro-ondas |
| 59 | conserto-tv-4k-santos | Marcas de TV |
| 60 | tv-com-som-baixo-ou-falhando | Conserto de TV |
| 61 | capacitor-microondas-alta-tensao | Conserto de micro-ondas |
| 62 | conserto-tv-led-santos | Marcas de TV |
| 63 | tv-nao-encontra-canais | Conserto de TV |
| 64 | magnetron-microondas-defeito | Conserto de micro-ondas |
| 65 | conserto-tv-lcd-santos | Marcas de TV |
| 66 | tv-metade-da-tela-escura | Conserto de TV |
| 67 | placa-mica-microondas-queimada | Conserto de micro-ondas |
| 68 | tv-oled-marca-na-tela | Conserto de TV |
| 69 | ventilador-microondas-nao-gira | Conserto de micro-ondas |
| 70 | tv-qled-sem-imagem | Conserto de TV |
| 71 | microondas-consul-nao-esquenta-santos | Conserto de micro-ondas |
| 72 | tv-lcd-imagem-negativa | Conserto de TV |
| 73 | microondas-brastemp-nao-esquenta-santos | Conserto de micro-ondas |
| 74 | backlight-queimado-tv-led-santos | Conserto de TV |
| 75 | microondas-electrolux-nao-esquenta-santos | Conserto de micro-ondas |
| 76 | led-standby-piscando-tv | Conserto de TV |
| 77 | entrada-hdmi-queimada-tv | Conserto de TV |
| 78 | entrada-antena-tv-ruim | Conserto de TV |
| 79 | tv-molhou-o-que-fazer | Conserto de TV |
| 80 | tv-caiu-no-chao-santos | Conserto de TV |

## Ordem sugerida aplicada

| pos | slug | categoria |
| --- | --- | --- |
| 1 | tv-led-pisca-e-nao-liga | Conserto de TV |
| 2 | microondas-liga-e-desliga-sozinho | Conserto de micro-ondas |
| 3 | conserto-tv-philco-santos | Marcas de TV |
| 4 | vale-a-pena-consertar-tv | Guias e orçamento |
| 5 | conserto-tv-gonzaga-santos | SEO local |
| 6 | tv-desliga-sozinha | Conserto de TV |
| 7 | microondas-prato-nao-gira | Conserto de micro-ondas |
| 8 | conserto-tv-aoc-santos | Marcas de TV |
| 9 | vale-a-pena-consertar-microondas | Guias e orçamento |
| 10 | conserto-tv-boqueirao-santos | SEO local |
| 11 | smart-tv-travada-no-logo | Conserto de TV |
| 12 | microondas-painel-apagado | Conserto de micro-ondas |
| 13 | conserto-tv-tcl-santos | Marcas de TV |
| 14 | como-levar-tv-assistencia | Guias e orçamento |
| 15 | conserto-tv-embare-santos | SEO local |
| 16 | tv-sem-sinal-hdmi | Conserto de TV |
| 17 | microondas-fazendo-barulho-alto | Conserto de micro-ondas |
| 18 | conserto-tv-panasonic-santos | Marcas de TV |
| 19 | como-transportar-microondas | Guias e orçamento |
| 20 | conserto-tv-aparecida-santos | SEO local |
| 21 | tv-com-linhas-na-tela | Conserto de TV |
| 22 | microondas-cheiro-de-queimado | Conserto de micro-ondas |
| 23 | conserto-tv-sony-santos | Marcas de TV |
| 24 | orcamento-conserto-tv-santos | Guias e orçamento |
| 25 | conserto-tv-ponta-da-praia | SEO local |
| 26 | tv-com-manchas-escuras | Conserto de TV |
| 27 | microondas-porta-nao-fecha | Conserto de micro-ondas |
| 28 | conserto-tv-philips-santos | Marcas de TV |
| 29 | orcamento-conserto-microondas-santos | Guias e orçamento |
| 30 | conserto-tv-vila-mathias | SEO local |
| 31 | tv-imagem-azulada-ou-roxa | Conserto de TV |
| 32 | teclas-microondas-nao-funcionam | Conserto de micro-ondas |
| 33 | conserto-tv-semp-toshiba-santos | Marcas de TV |
| 34 | assistencia-tecnica-perto-de-mim-santos | Guias e orçamento |
| 35 | conserto-microondas-gonzaga-santos | SEO local |
| 36 | tv-queimou-queda-de-energia | Conserto de TV |
| 37 | microondas-desarma-disjuntor | Conserto de micro-ondas |
| 38 | conserto-tv-cce-santos | Marcas de TV |
| 39 | tecnico-tv-santos-como-escolher | Guias e orçamento |
| 40 | conserto-microondas-boqueirao-santos | SEO local |
| 41 | tv-nao-responde-controle-remoto | Conserto de TV |
| 42 | microondas-enferrujado-por-dentro | Conserto de micro-ondas |
| 43 | conserto-smart-tv-santos | Marcas de TV |
| 44 | manutencao-preventiva-tv | Guias e orçamento |
| 45 | conserto-microondas-embare-santos | SEO local |
| 46 | smart-tv-sem-internet | Conserto de TV |
| 47 | microondas-luz-acesa-nao-funciona | Conserto de micro-ondas |
| 48 | conserto-tv-50-polegadas-santos | Marcas de TV |
| 49 | manutencao-preventiva-microondas | Guias e orçamento |
| 50 | conserto-microondas-aparecida-santos | SEO local |
| 51 | smart-tv-lenta-travando-apps | Conserto de TV |
| 52 | microondas-esquentando-pouco | Conserto de micro-ondas |
| 53 | conserto-tv-55-polegadas-santos | Marcas de TV |
| 54 | tv-com-tela-piscando | Conserto de TV |
| 55 | microondas-queimando-fusivel | Conserto de micro-ondas |
| 56 | conserto-tv-65-polegadas-santos | Marcas de TV |
| 57 | tv-faz-estalo-e-apaga | Conserto de TV |
| 58 | transformador-microondas-defeito | Conserto de micro-ondas |
| 59 | conserto-tv-4k-santos | Marcas de TV |
| 60 | tv-com-som-baixo-ou-falhando | Conserto de TV |
| 61 | capacitor-microondas-alta-tensao | Conserto de micro-ondas |
| 62 | conserto-tv-led-santos | Marcas de TV |
| 63 | tv-nao-encontra-canais | Conserto de TV |
| 64 | magnetron-microondas-defeito | Conserto de micro-ondas |
| 65 | conserto-tv-lcd-santos | Marcas de TV |
| 66 | tv-metade-da-tela-escura | Conserto de TV |
| 67 | placa-mica-microondas-queimada | Conserto de micro-ondas |
| 68 | tv-oled-marca-na-tela | Conserto de TV |
| 69 | ventilador-microondas-nao-gira | Conserto de micro-ondas |
| 70 | tv-qled-sem-imagem | Conserto de TV |
| 71 | microondas-consul-nao-esquenta-santos | Conserto de micro-ondas |
| 72 | tv-lcd-imagem-negativa | Conserto de TV |
| 73 | microondas-brastemp-nao-esquenta-santos | Conserto de micro-ondas |
| 74 | backlight-queimado-tv-led-santos | Conserto de TV |
| 75 | microondas-electrolux-nao-esquenta-santos | Conserto de micro-ondas |
| 76 | led-standby-piscando-tv | Conserto de TV |
| 77 | entrada-hdmi-queimada-tv | Conserto de TV |
| 78 | entrada-antena-tv-ruim | Conserto de TV |
| 79 | tv-molhou-o-que-fazer | Conserto de TV |
| 80 | tv-caiu-no-chao-santos | Conserto de TV |

## Distribuição por semana

| semana | segunda | terca | quarta | quinta | sexta |
| --- | --- | --- | --- | --- | --- |
| 1 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 2 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 3 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 4 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 5 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 6 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 7 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 8 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 9 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 10 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Guias e orçamento | SEO local |
| 11 | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Conserto de TV | Conserto de micro-ondas |
| 12 | Marcas de TV | Conserto de TV | Conserto de micro-ondas | Marcas de TV | Conserto de TV |
| 13 | Conserto de micro-ondas | Marcas de TV | Conserto de TV | Conserto de micro-ondas | Marcas de TV |
| 14 | Conserto de TV | Conserto de micro-ondas | Conserto de TV | Conserto de micro-ondas | Conserto de TV |
| 15 | Conserto de micro-ondas | Conserto de TV | Conserto de micro-ondas | Conserto de TV | Conserto de micro-ondas |
| 16 | Conserto de TV | Conserto de TV | Conserto de TV | Conserto de TV | Conserto de TV |
