# Blog EletroLED

Blog estático para SEO local da EletroLED Assistência Técnica.

## Build

```bash
npm run build
```

A saída é gerada em `dist/`.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Production domain desejado: `blog.consertoeletroled.com`

## Conteúdo

Os posts ficam em `content/posts.json`. Depois de editar ou adicionar posts, rode `npm run build`.

## Fila do Google Business Profile

O build deriva automaticamente uma fila pública de `content/posts.json` e grava o resultado em `dist/gbp/posts.json`. Depois do deploy, o endpoint fica disponível em:

```txt
https://blog.consertoeletroled.com/gbp/posts.json
```

O Worker de publicação deve usar:

```txt
POST_SOURCE_URL=https://blog.consertoeletroled.com/gbp/posts.json
```

A fila contém somente conteúdo editorial público e não inclui credenciais ou tokens. O blog não registra se um item já foi publicado no Google Business Profile; esse controle de idempotência pertence ao Worker por meio do Cloudflare KV.
