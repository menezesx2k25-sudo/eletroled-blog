# Deploy do Blog EletroLED

Este é o caminho recomendado:

```text
GitHub -> Cloudflare Pages -> blog.consertoeletroled.com -> Search Console
```

## 1. Criar o repositório no GitHub

1. Entre em https://github.com/
2. Clique em `+` no canto superior direito.
3. Clique em `New repository`.
4. Nome sugerido:

```text
eletroled-blog
```

5. Deixe como `Private` ou `Public`. Para SEO não importa; o site publicado será público no Cloudflare.
6. Não precisa adicionar README, porque este projeto já tem.
7. Crie o repositório.

## 2. Subir este projeto

Suba todos os arquivos desta pasta para o repositório:

```text
package.json
README.md
DEPLOY.md
content/
scripts/
dist/
```

O Cloudflare vai usar o código fonte e gerar o `dist/` de novo no deploy.

## 3. Criar o projeto no Cloudflare Pages

1. Entre em https://dash.cloudflare.com/
2. Vá em `Workers & Pages`.
3. Clique em `Create`.
4. Escolha `Pages`.
5. Conecte com o GitHub.
6. Selecione o repositório:

```text
eletroled-blog
```

7. Configure:

```text
Framework preset: None
Build command: npm run build
Build output directory: dist
Root directory: /
```

8. Clique em deploy.

Depois do deploy, o Cloudflare dará um domínio temporário parecido com:

```text
eletroled-blog.pages.dev
```

## 4. Criar o CNAME na Hostinger

No DNS da Hostinger, crie:

```text
Tipo: CNAME
Nome/Host: blog
Destino/Target: eletroled-blog.pages.dev
TTL: padrão
```

Troque `eletroled-blog.pages.dev` pelo domínio temporário real que o Cloudflare mostrar.

## 5. Adicionar domínio customizado no Cloudflare Pages

No projeto do Cloudflare Pages:

1. Vá em `Custom domains`.
2. Adicione:

```text
blog.consertoeletroled.com
```

3. Aguarde o SSL ficar ativo.

## 6. Verificar no navegador

Abra:

```text
https://blog.consertoeletroled.com/
https://blog.consertoeletroled.com/sitemap.xml
https://blog.consertoeletroled.com/robots.txt
```

## 7. Search Console

Como o domínio principal já está verificado, o subdomínio deve aparecer dentro da propriedade de domínio.

Também vale adicionar a propriedade URL Prefix:

```text
https://blog.consertoeletroled.com/
```

Depois envie o sitemap:

```text
https://blog.consertoeletroled.com/sitemap.xml
```

## 8. Automação diária

Depois que o GitHub e o Cloudflare estiverem ligados:

1. A automação cria um post novo em `content/posts.json`.
2. Roda `npm run build`.
3. Faz commit no GitHub.
4. O Cloudflare Pages publica automaticamente.
5. O sitemap passa a ter a nova URL.

Comece com aprovação manual por 7 dias. Depois ligue publicação automática.
