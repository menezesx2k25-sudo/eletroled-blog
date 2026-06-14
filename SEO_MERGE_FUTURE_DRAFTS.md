# SEO_MERGE_FUTURE_DRAFTS

## Resumo

- Novos artigos criados: 112
- Artigos existentes: 88
- Total planejado apos merge: 200
- Slugs duplicados: 0
- Titles duplicados: 0
- Imagens usadas mais de 3 vezes: 0
- Media de palavras dos novos artigos: 791
- Menor artigo novo: 781 palavras
- Maior artigo novo: 802 palavras
- Links quebrados: 0
- Canibalizacao alta: 0

## Compatibilidade

Os novos artigos seguem o mesmo formato usado em content/drafts.json: title, slug, category, description, keywords, image, imageAlt, intro, sections, faq, cta e links.

## Como Fazer Merge Com Seguranca Quando Aprovado

1. Rodar node scripts/validate-future-drafts.mjs.
2. Fazer backup de content/drafts.json.
3. Concatenar os 112 itens de content/future-drafts-200.json ao final de content/drafts.json, mantendo os 80 drafts atuais primeiro.
4. Rodar npm run build.
5. Rodar npm run validate.
6. Revisar git diff --stat.
7. So entao commitar e publicar, se aprovado.

## Comando Recomendado Para Merge Futuro

Nao execute agora sem aprovacao humana. Quando aprovado, criar um script curto de merge que apenas anexe future-drafts-200.json ao final de drafts.json e rode os validadores.
