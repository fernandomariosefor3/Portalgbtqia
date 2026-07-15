# Publicação e indexação no Google

O build gera automaticamente:

- `/robots.txt`;
- `/sitemap.xml`, incluindo artigos com status `published` no Firestore;
- HTML próprio para rotas estáticas, categorias e artigos;
- URL canônica e metadados sociais por página;
- JSON-LD de `Article`, `Organization`, `Person`, `BreadcrumbList`, `WebSite` e `SearchAction`.

## Configuração na Vercel

Defina estas variáveis em **Settings > Environment Variables** para Production:

1. `VITE_SITE_URL`: endereço público principal, sem barra no final.
2. `VITE_GOOGLE_SITE_VERIFICATION`: somente o token do atributo `content` fornecido pelo método **Tag HTML** do Search Console.
3. As variáveis `VITE_FIREBASE_*` já usadas pela aplicação, para que o build consulte os artigos publicados.

Depois, faça um novo deploy. A tag de verificação só é incluída quando o token está configurado.

## Ativação no Google Search Console

1. Crie preferencialmente uma propriedade do tipo **Domínio** e valide pelo registro DNS TXT. Alternativamente, use **Prefixo do URL** com a tag HTML.
2. Informe o sitemap `https://SEU-DOMINIO/sitemap.xml`.
3. Em **Inspeção de URL**, teste a página inicial, `/artigos`, uma categoria e dois artigos.
4. Confirme que o teste ao vivo mostra “Indexação permitida” e solicite a indexação das páginas prioritárias.
5. Acompanhe **Indexação > Páginas** e **Melhorias** após os próximos rastreamentos.

Na Vercel, marque o domínio escolhido em `VITE_SITE_URL` como domínio primário. A plataforma redirecionará os demais domínios associados para ele; o projeto também normaliza `/index.html` e URLs com barra final.

Sempre que um artigo for publicado, execute um novo deploy para atualizar o sitemap e gerar seu HTML indexável.
