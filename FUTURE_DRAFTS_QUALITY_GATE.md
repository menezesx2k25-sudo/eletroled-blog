# FUTURE_DRAFTS_QUALITY_GATE

Gerado em: 2026-06-14T01:37:57.806Z
Commit base auditado: 3cdecf7 feat(seo): adicionar pack editorial 200 da ELETROLED

## Decisao Do Gate

Status: BLOQUEADO PARA PUBLICACAO

Nenhum future draft deve ser mesclado em content/drafts.json ou publicado antes de revisao editorial, SEO local e visual. O gate tecnico passa, mas o gate editorial permanece bloqueado.

## Resumo Executivo

- Posts publicados atuais: 8
- Drafts atuais na fila real: 80
- Future drafts auditados: 112
- Total planejado: 200
- Future drafts com intencao local: 112/112
- Future drafts com CTA: 112/112
- Future drafts sem problemas de links: 112/112
- Future drafts com imagem presente: 112/112
- Future drafts com caption/source corrompido: 0/112
- Future drafts com mesma assinatura estrutural: 112/112

## Classificacao Editorial Dos 112 Future Drafts

| classificacao | total |
| --- | --- |
| aprovado | 0 |
| precisa revisao | 73 |
| risco de canibalizacao | 18 |
| fraco/generico | 21 |
| descartar ou fundir | 0 |

## Classificacao Visual Dos 112 Future Drafts

| visual | total |
| --- | --- |
| aprovado_visual | 0 |
| aprovado_temporario | 61 |
| precisa_foto_real | 16 |
| precisa_card_tipografico | 17 |
| svg_generico_bloqueado | 18 |
| caption_corrompido | 0 |
| inconsistente_com_identidade | 0 |

## Bloqueios Atuais

- Estrutura textual repetida em 112/112 future drafts.
- 18 artigos de marca foram marcados com risco de canibalizacao por proximidade de intencao e estrutura.
- SVG generico nao pode ser aprovado como solucao final para conteudo importante.
- Future drafts locais, institucionais e FAQ precisam de detalhes reais antes do merge.
- Future drafts de marcas precisam diferenciar claramente intencao para evitar canibalizacao.

## Travas Operacionais Confirmadas Neste Patch

- scripts/publish-scheduled.mjs agora falha se count for diferente de 1.
- scripts/publish-scheduled.mjs bloqueia segunda publicacao no mesmo dia se ja existir post com a data local.
- Publicacao em fim de semana permanece bloqueada.
- workflow_dispatch documenta que count deve ser sempre 1.

## Item A Item

| ordem | slug | categoria | classificacao | visual | arquetipo | intencao | local | cta | links | imagem | categoria_ok | decisao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | tv-led-aceso-nao-acende-tela | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 2 | microondas-esquenta-irregular | Conserto de micro-ondas | precisa revisao | aprovado_temporario | guia_de_sintoma | microondas_aquecimento | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 3 | conserto-tv-philips-defeitos-santos | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 4 | quando-nao-vale-consertar-tv | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 5 | conserto-tv-campo-grande-santos | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 6 | tv-imagem-escura-backlight | Diagnostico de sintomas | precisa revisao | aprovado_temporario | explicacao_tecnica_simples | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 7 | microondas-faisca-placa-mica | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 8 | microondas-panasonic-nao-esquenta-santos | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 9 | limpeza-tv-o-que-nao-fazer | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 10 | como-eletroled-avalia-tv-bancada | Institucional ELETROLED | fraco/generico | precisa_foto_real | caso_comum_de_bancada | institucional_processo | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 11 | preco-conserto-so-por-mensagem | Duvidas frequentes de clientes | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 12 | tv-liga-desliga-em-loop | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 13 | diodo-alta-tensao-microondas-defeito | Conserto de micro-ondas | precisa revisao | aprovado_temporario | alerta_de_seguranca | microondas_aquecimento | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 14 | conserto-tv-sony-avaliacao-santos | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 15 | o-que-influencia-preco-conserto-tv | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 16 | conserto-microondas-marape-santos | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 17 | tv-com-tela-branca | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 18 | trava-porta-microondas-defeito | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 19 | microondas-lg-sem-acender-painel | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 20 | transportar-tv-sem-danificar-painel | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 21 | como-funciona-orcamento-tecnico-eletroled | Institucional ELETROLED | precisa revisao | precisa_foto_real | caso_comum_de_bancada | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 22 | levar-controle-cabo-prato-assistencia | Duvidas frequentes de clientes | fraco/generico | precisa_card_tipografico | checklist_pre_atendimento | faq_atendimento | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 23 | tv-fica-so-no-standby | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 24 | aquecimento-fraco-microondas-alta-tensao | Conserto de micro-ondas | precisa revisao | aprovado_temporario | alerta_de_seguranca | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 25 | tv-panasonic-sem-imagem-santos | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 26 | o-que-influencia-preco-conserto-microondas | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 27 | assistencia-tv-jose-menino-santos | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 28 | tv-manchas-na-imagem | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 29 | microondas-ventilador-interno-parado | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 30 | microondas-samsung-fazendo-barulho | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 31 | sinais-curto-tv-desligar-tomada | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 32 | o-que-informar-levar-tv-assistencia | Institucional ELETROLED | fraco/generico | precisa_foto_real | checklist_pre_atendimento | institucional_processo | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 33 | quanto-tempo-demora-diagnostico-tecnico | Duvidas frequentes de clientes | fraco/generico | precisa_card_tipografico | checklist_pre_atendimento | faq_atendimento | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 34 | tv-demora-para-ligar | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 35 | microondas-queima-fusivel-ao-ligar | Conserto de micro-ondas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 36 | tv-tcl-travando-sistema | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 37 | conserto-ou-aparelho-novo-comparar | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 38 | conserto-microondas-sao-vicente | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 39 | tv-linhas-horizontais-na-tela | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 40 | microondas-painel-piscando | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 41 | microondas-midea-parou-aquecer | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 42 | nao-comprar-peca-antes-diagnostico | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 43 | o-que-informar-levar-microondas-assistencia | Institucional ELETROLED | fraco/generico | precisa_foto_real | checklist_pre_atendimento | institucional_processo | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 44 | assistencia-tecnica-garantia-servico | Duvidas frequentes de clientes | fraco/generico | precisa_card_tipografico | checklist_pre_atendimento | faq_atendimento | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 45 | tv-nao-liga-depois-de-chuva | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 46 | microondas-desarma-disjuntor-ao-iniciar | Conserto de micro-ondas | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 47 | tv-aoc-tela-piscando-santos | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 48 | peca-compativel-tv-quando-usar | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 49 | conserto-tv-praia-grande | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 50 | tv-imagem-tremendo | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 51 | microondas-cheiro-plastico-queimado | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 52 | microondas-philco-teclas-falhando | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 53 | tv-desliga-quando-esquenta | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 54 | diagnostico-tecnico-eletroled-evita-chute | Institucional ELETROLED | fraco/generico | precisa_foto_real | caso_comum_de_bancada | institucional_processo | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 55 | levar-aparelho-ou-chamar-antes | Duvidas frequentes de clientes | fraco/generico | precisa_card_tipografico | checklist_pre_atendimento | faq_atendimento | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 56 | fonte-ou-placa-principal-tv | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 57 | microondas-gira-mas-nao-aquece | Conserto de micro-ondas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 58 | tv-semp-toshiba-nao-liga-santos | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 59 | como-mandar-video-defeito-whatsapp | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 60 | assistencia-tv-microondas-cubatao | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 61 | tv-sombra-na-imagem | Diagnostico de sintomas | precisa revisao | aprovado_temporario | explicacao_tecnica_simples | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 62 | quando-nao-abrir-microondas | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 63 | microondas-electrolux-desarma-disjuntor | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 64 | tv-queimou-oscilacao-energia | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 65 | servico-independente-diferentes-marcas | Institucional ELETROLED | fraco/generico | precisa_foto_real | caso_comum_de_bancada | institucional_processo | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 66 | usar-aparelho-defeito-intermitente | Duvidas frequentes de clientes | fraco/generico | precisa_card_tipografico | checklist_pre_atendimento | faq_atendimento | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 67 | tv-estala-ao-ligar-sem-imagem | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 68 | microondas-para-no-meio-do-ciclo | Conserto de micro-ondas | precisa revisao | aprovado_temporario | guia_de_sintoma | microondas_aquecimento | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 69 | tv-cce-som-sem-imagem | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 70 | orcamento-tecnico-nao-e-chute | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 71 | conserto-tv-guaruja | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 72 | barra-led-tv-defeito | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 73 | microondas-ferrugem-perto-da-porta | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 74 | microondas-brastemp-prato-parado | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 75 | tv-mostra-logo-e-reinicia | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 76 | o-que-esperar-assistencia-tecnica-seria | Institucional ELETROLED | fraco/generico | precisa_foto_real | caso_comum_de_bancada | institucional_processo | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 77 | quando-conserto-nao-compensa-o-que-acontece | Duvidas frequentes de clientes | fraco/generico | precisa_card_tipografico | checklist_pre_atendimento | faq_atendimento | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 78 | tv-sem-som-causas-comuns | Conserto de TV | precisa revisao | aprovado_temporario | checklist_pre_atendimento | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 79 | microondas-barulho-e-nao-esquenta | Conserto de micro-ondas | precisa revisao | aprovado_temporario | guia_de_sintoma | microondas_aquecimento | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 80 | tv-lg-reiniciando-santos | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 81 | o-que-perguntar-antes-aprovar-conserto | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 82 | conserto-tv-perto-macuco-santos | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 83 | tela-tv-quebrada-quando-compensa | Diagnostico de sintomas | precisa revisao | aprovado_temporario | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 84 | proteger-tv-microondas-queda-energia | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 85 | microondas-consul-cheiro-queimado | Marcas de micro-ondas | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_microondas | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 86 | tv-chia-corta-audio | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 87 | microondas-aquece-pouco-potencia-alta | Conserto de micro-ondas | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 88 | tv-nao-reconhece-hdmi | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 89 | tv-nao-conecta-wifi | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 90 | microondas-nao-inicia-ao-fechar-porta | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 91 | tv-samsung-listras-na-tela | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 92 | comparar-orcamento-tv-com-tv-nova | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 93 | microondas-defeito-baixada-santista | SEO local / bairros / Baixada Santista | fraco/generico | precisa_foto_real | pagina_local | local_bairros | ok | ok | ok | ok | ok | precisa detalhe real, prova local, visual proprio ou reescrita humana |
| 94 | smart-tv-app-trava | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 95 | pode-usar-extensao-microondas | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 96 | tv-sem-audio-hdmi | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 97 | botao-iniciar-microondas-nao-funciona | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 98 | tv-caiu-imagem-estranha | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_imagem | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 99 | microondas-prato-girando-torto | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 100 | tv-molhou-e-ainda-liga | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 101 | microondas-faz-estalo-ao-ligar | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 102 | tv-philco-controle-nao-responde | Marcas de TV | risco de canibalizacao | svg_generico_bloqueado | marca_modelo | marcas_tv | ok | ok | ok | ok | ok | revisar intencao e diferenciar marca/modelo/defeito antes do merge |
| 103 | comparar-orcamento-microondas-com-novo | Guias e orcamento | precisa revisao | precisa_card_tipografico | vale_consertar | orcamento_decisao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 104 | tv-cheiro-de-queimado | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 105 | microondas-display-fraco-apagando | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 106 | limpeza-microondas-evitar-faisca-cheiro | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 107 | tv-esquenta-demais | Conserto de TV | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 108 | microondas-trava-programacao-painel | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | diagnostico_geral | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 109 | microondas-assistencia-proteger-prato-porta | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 110 | microondas-liga-sozinho | Diagnostico de sintomas | precisa revisao | aprovado_temporario | guia_de_sintoma | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 111 | sinais-risco-microondas-parar-uso | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | seguranca_prevencao | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |
| 112 | queda-energia-casa-tv-microondas | Seguranca e prevencao | precisa revisao | aprovado_temporario | alerta_de_seguranca | tv_energia | ok | ok | ok | ok | ok | estrutura repetida; revisar profundidade antes de publicar |

## Validacoes Registradas

- node scripts/validate-future-drafts.mjs: OK - Future drafts OK: 112 novos artigos, 200 planejados, media 791 palavras, 98 imagens unicas.
- npm run validate: OK - Validacao OK: 8 posts publicados, 80 rascunhos, 26 blocos JSON-LD.
- Teste operacional --count=2 em dry-run: bloqueado corretamente com erro claro.
- Teste operacional em domingo: pausado corretamente, nenhum artigo publicado.

## Conclusao

O pacote futuro continua bloqueado. O JSON tem campos tecnicos suficientes, mas a estrutura textual, a diferenciacao editorial e a qualidade visual ainda nao sao adequadas para publicacao.
