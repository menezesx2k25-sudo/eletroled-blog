# Cloudflare Worker Cron para publicar o blog

Este Worker chama o `workflow_dispatch` do GitHub Actions para o workflow
`.github/workflows/publish-scheduled.yml`.

Ele nao publica artigo diretamente. O Worker apenas dispara o workflow. O GitHub
continua sendo responsavel por:

- mover 1 item de `content/drafts.json` para `content/posts.json`
- rodar `npm run build`
- rodar `npm run validate`
- commitar e fazer push da publicacao
- acionar o deploy do Cloudflare Pages pelo push

## Horario

O cron configurado em `wrangler.toml` roda em UTC:

```text
25 11 * * mon-fri
```

Isso equivale a 08:25 em Santos, de segunda a sexta.

O workflow recebe `once_per_day=true`, entao se o GitHub schedule nativo tambem
rodar no mesmo dia, a segunda tentativa nao publica outro artigo.

## Segredo obrigatorio

Crie um token no GitHub com permissao minima para o repositorio
`menezesx2k25-sudo/eletroled-blog`:

- Fine-grained personal access token
- Repository access: somente `menezesx2k25-sudo/eletroled-blog`
- Repository permissions: `Actions: Read and write`

Depois configure o segredo no Worker:

```powershell
cd C:\Users\Pichau\Documents\Codex\2026-06-15\eletroled-scheduler-fix\cloudflare\github-workflow-cron
npx wrangler secret put GITHUB_TOKEN
```

Cole o token quando o Wrangler pedir. Nao commite o token.

## Deploy

```powershell
cd C:\Users\Pichau\Documents\Codex\2026-06-15\eletroled-scheduler-fix\cloudflare\github-workflow-cron
npx wrangler deploy
```

## Teste local

```powershell
npx wrangler dev --test-scheduled
```

Depois, em outro terminal:

```powershell
Invoke-WebRequest "http://localhost:8787/__scheduled?cron=25%2011%20*%20*%20mon-fri" -UseBasicParsing
```

O teste local tambem dispara o workflow se `GITHUB_TOKEN` estiver configurado no
ambiente do Wrangler.
