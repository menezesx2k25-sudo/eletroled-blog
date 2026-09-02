# EletroLED SEO Local Hardening — Design

## Objetivo

Fortalecer o blog da EletroLED sem ampliar conteúdo genérico: corrigir conteúdo publicado corrompido, impedir novas publicações sem aprovação editorial, endurecer validações e criar uma página comercial única para a intenção comprovada de barramento/backlight.

## Estado confirmado

- Baseline: 65 posts publicados, 117 drafts, build e validação verdes.
- `content/posts.json` contém 84 tokens com `?` substituindo acentos; o erro chega ao HTML publicado.
- 94 dos 117 drafts também existem em `future-drafts-200.json`, cujo quality gate está bloqueado.
- O publicador atual ignora esse gate e publica o primeiro draft elegível apenas por estrutura mínima.
- Há repetição literal de dezenas de seções entre muitos posts publicados.
- A campanha de Ads de barramento LED é uma intenção comercial comprovadamente relevante para o negócio.
## Arquitetura

### 1. Integridade editorial

Criar um módulo compartilhado de qualidade para detectar mojibake, identificar conteúdo futuro bloqueado e decidir se um draft pode ser publicado. `validate.mjs` e `publish-scheduled.mjs` usarão a mesma regra, evitando divergência entre CI e automação.

A aprovação de future drafts será explícita em `content/publishing-approvals.json`. Por padrão nenhum dos 112 future drafts será publicável; os 23 drafts legados restantes continuam na fila normal.

### 2. Conteúdo publicado

Corrigir os 84 tokens corrompidos na fonte (`posts.json`) e regenerar `dist`. Adicionar teste e validação que falham se o padrão reaparecer. Medir duplicação literal e impedir que novos conteúdos ampliem o padrão; não remover em massa seções publicadas sem substituição editorial específica.

### 3. SEO comercial

Adicionar uma landing page editorial-comercial específica para `troca-barramento-led-tv-santos`, sem criar páginas amplas que disputem com o domínio principal. A página deve ser única, usar assets existentes da EletroLED, CTA para WhatsApp, links para guias relevantes e schema `Service`.
### 4. Dados estruturados e rastreabilidade

Adicionar `WebSite` na home, `BreadcrumbList` nos artigos e landing page, e enriquecer `LocalBusiness` com `openingHoursSpecification` e `contactPoint` usando apenas dados já confirmados em `site.json`.

Manter canonical, sitemap, RSS, GBP queue e URLs existentes estáveis. Não inventar coordenadas, credenciais, certificações ou vínculo oficial com fabricantes.

## Critérios de aceite

1. `npm run build`, `npm run validate` e `npm test` passam.
2. Zero mojibake detectado nos conteúdos publicados e HTML gerado.
3. Future draft não aprovado não pode ser publicado nem em dry-run.
4. Draft legado aprovado pela fila histórica continua publicável.
5. Landing de barramento é gerada, indexável, canônica e possui `Service` + breadcrumb.
6. Artigos mantêm seus slugs/canonicals e a fila GBP continua consistente.
7. A automação diária continua no máximo uma publicação por dia útil.

## Fora do alcance automático deste repo

Correção de diretórios externos com NAP antigo, alterações no site principal hospedado fora deste repo e ações no Google Business Profile que exijam conta/interface. Esses itens devem ficar documentados como pendências externas, sem serem falsamente marcados como corrigidos.
