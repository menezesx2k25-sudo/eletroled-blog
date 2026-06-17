# EletroLED main site SEO Worker

This Worker applies narrow SEO fixes for the Hostinger-built main site.

It is intentionally separate from the blog publisher cron Worker and only handles:

- `https://consertoeletroled.com/llms.txt`
- `https://consertoeletroled.com/`
- `https://consertoeletroled.com/dicas-sobre-tvs-e-micro-ondas`
- `https://consertoeletroled.com/servicos`

Deploy:

```powershell
npx wrangler deploy
```
