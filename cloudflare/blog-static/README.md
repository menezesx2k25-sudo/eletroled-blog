# Blog static Worker

Worker that serves the generated blog from `dist/`.

SEO-relevant settings:

- `assets.not_found_handling = "404-page"` serves `dist/404.html` for missing routes with HTTP 404.
- `_headers` in `dist/` adds HSTS and basic security headers to static responses.
- The route is only `blog.consertoeletroled.com/*`; the `www.blog` redirect is handled by `cloudflare/blog-www-redirect`.

Deploy:

```powershell
npx wrangler deploy -c cloudflare/blog-static/wrangler.toml
```
