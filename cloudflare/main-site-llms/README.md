# EletroLED main site SEO Worker

This Worker applies narrow SEO fixes for the Hostinger-built main site.

It is intentionally separate from the blog publisher cron Worker and only handles:

- `https://consertoeletroled.com/*`

Current behavior:

- Serves `llms.txt`.
- Adds security headers.
- Adds focused visible SEO support content to the main service pages.
- Fixes known heading, title, and image-alt issues from the Hostinger output.
- Serves a custom 404 page when the origin returns a default not-found response.

Deploy:

```powershell
npx wrangler deploy
```
