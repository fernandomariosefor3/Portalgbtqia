# Workflow de CI (pendente de instalação)

O arquivo `ci.yml` deste diretório deve ficar em `.github/workflows/ci.yml`.
Ele não foi enviado automaticamente porque o token usado no push não tinha o
escopo `workflow` (obrigatório pelo GitHub para criar/alterar workflows).

## Como instalar
Opção A — pela interface do GitHub: crie o arquivo `.github/workflows/ci.yml`
e cole o conteúdo de `ci-workflow-pendente/ci.yml`.

Opção B — via git, com um token que tenha escopo `workflow`:
```bash
git mv ci-workflow-pendente/ci.yml .github/workflows/ci.yml
rmdir ci-workflow-pendente 2>/dev/null || rm -rf ci-workflow-pendente
git add -A && git commit -m "ci: adiciona workflow de lint/type-check/build" && git push
```

O workflow roda `type-check`, `lint` e `build` em cada push/PR para `main`.
