# EletroLED SEO Local Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir integridade editorial, bloquear publicação de future drafts não aprovados e adicionar uma landing comercial de barramento LED com SEO estruturado.

**Architecture:** Centralizar regras em `scripts/content-quality.mjs`, consumidas pelo validador e publicador. Manter conteúdo e páginas como dados JSON, com build estático determinístico e testes via `node:test`.

**Tech Stack:** Node.js ESM, `node:test`, JSON, HTML estático, Cloudflare assets.

**Spec:** `docs/superpowers/specs/2026-09-01-seo-local-hardening-design.md`

## Global Constraints

- Preservar todos os slugs e canonicals publicados.
- Não inventar fatos comerciais, certificações, preços ou vínculos com fabricantes.
- Future drafts precisam de aprovação explícita antes da publicação.
- Build e validação existentes devem permanecer verdes.

---

### Task 1: Content quality guard

**Files:**
- Create: `scripts/content-quality.mjs`
- Create: `tests/content-quality.test.mjs`
- Modify: `scripts/validate.mjs`
- Modify: `package.json`

- [ ] Escrever testes falhando para mojibake e decisão de publicação.
- [ ] Rodar `node --test tests/content-quality.test.mjs` e confirmar RED.
- [ ] Implementar detecção de texto corrompido e política de aprovação.
- [ ] Integrar a validação ao `validate.mjs`.
- [ ] Rodar testes e confirmar GREEN.
### Task 2: Repair published mojibake

**Files:**
- Modify: `content/posts.json`
- Regenerate: `dist/**`

- [ ] Adicionar teste que lê `posts.json` e falha com os 84 tokens atuais.
- [ ] Confirmar RED.
- [ ] Corrigir apenas substituições inequívocas de português na fonte.
- [ ] Regenerar o site e confirmar zero ocorrências também no HTML.
- [ ] Rodar build, validate e testes.

### Task 3: Editorial publication gate

**Files:**
- Create: `content/publishing-approvals.json`
- Modify: `scripts/publish-scheduled.mjs`
- Modify: `scripts/validate.mjs`
- Test: `tests/publishing-gate.test.mjs`

- [ ] Testar que `transformador-microondas-defeito` continua liberado.
- [ ] Testar que `tv-led-aceso-nao-acende-tela` fica bloqueado sem aprovação.
- [ ] Testar que aprovação explícita libera um future draft.
- [ ] Integrar a decisão ao CLI sem alterar a regra de um post por dia útil.
- [ ] Validar consistência entre approval list, future drafts e blocked list.
### Task 4: Service landing + structured data

**Files:**
- Create: `content/service-pages.json`
- Modify: `scripts/build.mjs`
- Modify: `scripts/validate.mjs`
- Test: `tests/generated-seo.test.mjs`

- [ ] Escrever teste que exige `/troca-barramento-led-tv-santos/`, canonical, `Service` e breadcrumb.
- [ ] Confirmar RED após build atual.
- [ ] Criar conteúdo único e renderer usando assets existentes.
- [ ] Adicionar `WebSite`, `BreadcrumbList`, `openingHoursSpecification` e `contactPoint`.
- [ ] Incluir a landing no sitemap e links internos de páginas relevantes.
- [ ] Rodar build, validate e testes.

### Task 5: Duplicate-content guard and external cleanup handoff

**Files:**
- Modify: `scripts/validate.mjs`
- Create: `SEO_ENTITY_CLEANUP_2026-09-01.md`

- [ ] Medir repetição literal de seções e registrar o baseline.
- [ ] Bloquear future drafts com assinatura estrutural repetitiva sem revisão explícita.
- [ ] Não remover automaticamente conteúdo publicado sem substituição específica.
- [ ] Documentar NAP/domínios externos inconsistentes já encontrados.

### Task 6: Final verification and branch handoff

- [ ] Rodar `npm test`.
- [ ] Rodar `npm run build` e `npm run validate` do zero.
- [ ] Buscar novamente mojibake em `content` e `dist`.
- [ ] Revisar `git diff --check`, status e commits.
- [ ] Tentar publicar a branch remota; se a autenticação não permitir, registrar o bloqueio exato sem alterar `main`.
