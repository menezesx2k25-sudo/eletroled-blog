# FUTURE_DRAFTS_CANIBALIZATION_MAP

## Resumo

- Artigos com risco de canibalizacao neste gate: 18
- Regra: risco aqui nao significa descartar automaticamente; significa revisar intencao antes de merge.
- Os riscos principais estao em marcas, porque a estrutura atual pode parecer troca simples de fabricante se nao receber detalhes reais por marca/modelo/defeito.

## Clusters De Risco

| cluster | artigo_principal | secundarios | decisao | observacoes |
| --- | --- | --- | --- | --- |
| marcas_tv | conserto-tv-philips-defeitos-santos | conserto-tv-sony-avaliacao-santos, tv-panasonic-sem-imagem-santos, tv-tcl-travando-sistema, tv-aoc-tela-piscando-santos, tv-semp-toshiba-nao-liga-santos, tv-cce-som-sem-imagem, tv-lg-reiniciando-santos, tv-samsung-listras-na-tela, tv-philco-controle-nao-responde | manter separado somente apos diferenciar marca/modelo/defeito | evitar pagina de marca sem sintomas especificos e linguagem independente |
| marcas_microondas | microondas-panasonic-nao-esquenta-santos | microondas-lg-sem-acender-painel, microondas-samsung-fazendo-barulho, microondas-midea-parou-aquecer, microondas-philco-teclas-falhando, microondas-electrolux-desarma-disjuntor, microondas-brastemp-prato-parado, microondas-consul-cheiro-queimado | manter separado somente apos diferenciar marca/modelo/defeito | evitar repetir nao esquenta/painel/porta sem variacao real de problema |

## Artigos Marcados Com Risco

| cluster | slug | categoria | intencao | decisao |
| --- | --- | --- | --- | --- |
| marcas_tv | conserto-tv-philips-defeitos-santos | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-panasonic-nao-esquenta-santos | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | conserto-tv-sony-avaliacao-santos | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-lg-sem-acender-painel | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | tv-panasonic-sem-imagem-santos | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-samsung-fazendo-barulho | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | tv-tcl-travando-sistema | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-midea-parou-aquecer | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | tv-aoc-tela-piscando-santos | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-philco-teclas-falhando | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | tv-semp-toshiba-nao-liga-santos | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-electrolux-desarma-disjuntor | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | tv-cce-som-sem-imagem | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-brastemp-prato-parado | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | tv-lg-reiniciando-santos | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_microondas | microondas-consul-cheiro-queimado | Marcas de micro-ondas | marcas_microondas | revisar intencao antes de merge |
| marcas_tv | tv-samsung-listras-na-tela | Marcas de TV | marcas_tv | revisar intencao antes de merge |
| marcas_tv | tv-philco-controle-nao-responde | Marcas de TV | marcas_tv | revisar intencao antes de merge |
