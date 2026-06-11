# 🔍 Análise do Projeto — Portal LGBTQIA+ Nordeste

Análise técnica do repositório `fernandomariosefor3/Portalgbtqia` feita em **2026-06-11**.
Stack: **Vite + React 19 + TypeScript + Tailwind + Firebase + Vercel**, com um **agente autônomo** (Node + OpenAI + Puppeteer) que publica eventos via GitHub Actions.

> Já apliquei neste workspace algumas correções de baixo risco (ver seção "Correções já aplicadas"). O resto é roadmap recomendado.

---

## ✅ Pontos fortes

- **Arquitetura limpa de pastas**: `pages/` por rota, `components/feature`, `lib/`, `mocks/` — fácil de navegar.
- **SEO e PWA bem feitos**: `index.html` tem Open Graph, Twitter Card, Schema.org (JSON-LD), `manifest.json`, theme-color, geo tags. Acima da média.
- **Segurança de segredos correta**: `.gitignore` cobre `.env*`; nenhum `.env` real commitado. Firebase usa variáveis `VITE_*`.
- **Regras de Firestore/Storage existem** e seguem o padrão `isAdmin()/isOwner()/isSignedIn()` — bom ponto de partida.
- **i18n já estruturado** (i18next + detecção de idioma), pronto para tradução.
- **Acessibilidade parcial**: 43 `<img>` e o uso de `alt=` é frequente (bom hábito).
- **Documentação**: README, CODE_OF_CONDUCT, project_plan e guias de setup do agente.
- **TypeScript em 98,8%** do código e build de produção funcionando.

---

## 🐞 Problemas concretos encontrados (com evidência)

### 1. Erros de tipo reais escondidos pelo build  ✅ corrigido
`npm run build` passa, mas **só porque o Vite não faz type-check**. Rodando `npm run type-check`:

```
src/lib/firestore.ts(142,5): Spread types may only be created from object types.
src/lib/firestore.ts(214,20): QueryOrderByConstraint não atribuível a QueryFieldFilterConstraint
src/lib/firestore.ts(217,22): QueryLimitConstraint não atribuível a QueryFieldFilterConstraint
```
Causa: `const constraints = []` era inferido como tipo estreito do primeiro `push`. Corrigido tipando como `QueryConstraint[]`.

### 2. Erros de ESLint quebram o lint  ✅ corrigido
`npm run lint` falhava com 2 erros `no-empty` em `MusicPlayer.tsx` (blocos `catch {}` vazios). Corrigido com comentário `/* ignore */`.

### 3. `strict: false` no TypeScript  ⚠️
`tsconfig.app.json` desliga **tudo**: `strict`, `strictNullChecks`, `noImplicitAny`, `noUnusedLocals`... Isso anula a maior vantagem do TS. Há **7 usos de `: any`**. Resultado: bugs como o #1 só aparecem se alguém lembrar de rodar `type-check` manualmente.

### 4. O site está majoritariamente em MOCKS, não no Firebase  ⚠️ (o mais importante)
O README diz "Fase 10: Integração Firebase total" mas, na prática:
- **~24 arquivos** de páginas/componentes importam de `src/mocks/*`.
- Apenas **3 páginas** (`admin`, `articles`, `event-submit`) usam Firestore de verdade.
- O agente publica eventos no Firestore, mas a página `/eventos` lê de `mocks/events.ts` → **eventos publicados pelo agente não aparecem no site**.

Esse é o gap funcional número 1.

### 5. Bundle único de 1,06 MB (308 KB gzip)  ⚠️
Tudo num só chunk; o Vite avisa. `firebase` + `recharts` + `stripe` são pesados e carregam mesmo em páginas que não os usam. Falta `React.lazy`/code-splitting por rota.

### 6. Rota de admin protege login, mas não papel de admin  ⚠️ segurança/UX
`AdminRoute` só checa `if (!user)`. Qualquer usuário logado passa pela rota; a checagem real de `ADMIN_EMAIL` está dentro da página. Funciona, mas a lógica de autorização está duplicada e o e-mail do fundador está **hardcoded em 2 lugares** (`admin/page.tsx` e `firestore.rules`). Centralize via `role: 'admin'` no perfil.

### 7. Configurações duplicadas / inconsistentes  ⚠️
- **Dois workflows**: `.github/workflows/weekly-agent.yml` (raiz) e `project-LGBTQIA+/agent/.github/workflows/weekly-scrape.yml`. GitHub só executa os da raiz → o segundo é morto/confuso.
- **Dois `vercel.json`** (raiz e projeto) com configs diferentes.
- `package.json` do frontend tem `"name": "react"` (genérico).
- `@stripe/react-stripe-js` e `recharts` estão nas dependências mas não há indício claro de uso → peso morto.

### 8. Recursos externos no `<head>` quebram em ambientes offline/CSP  ℹ️
Fonts do Google e `remixicon` via CDN. Em produção funciona, mas considere self-host para performance/privacidade (LGPD) e resiliência.

### 9. Avisos de hooks  ℹ️
`MusicPlayer.tsx`: `useEffect` com dependências faltando (`nextTrack`, `track.id`) — risco de bug sutil de stale closure.

---

## 🚀 Plano de melhorias priorizado

### P0 — Fazer agora (correção e confiabilidade)
1. **Ligar o type-check no CI/build.** Adicionar `"build": "tsc -b && vite build"` ou um workflow que rode `type-check` + `lint` em cada PR. (Erros do #1/#2 já corrigidos.)
2. **Conectar as páginas ao Firestore** (substituir mocks por `lib/firestore.ts`), começando por `/eventos` para fechar o ciclo do agente. Manter mocks só como *seed*/fallback.
3. **Habilitar `strict: true`** no tsconfig e corrigir incrementalmente (pode usar `strict` + `// @ts-expect-error` pontuais).

### P1 — Curto prazo (segurança e performance)
4. **Code-splitting por rota** com `React.lazy` + `Suspense`; mover Firebase para imports dinâmicos onde possível. Meta: chunk inicial < 200 KB gzip.
5. **Centralizar autorização**: criar `useIsAdmin()` baseado em `role`, remover e-mail hardcoded, e fazer `AdminRoute` checar o papel (não só login).
6. **Limpar config duplicada**: apagar `agent/.github/...`, manter um único `vercel.json`, renomear `name` no `package.json`, remover deps não usadas (Stripe/recharts se não forem usar).
7. **Página de login/cadastro dedicada** (hoje só há "Entrar com Google" na Navbar) + estados de erro e loading.

### P2 — Qualidade e crescimento
8. **Testes**: o agente já tem `vitest` configurado mas sem testes. Adicionar testes para `generateSlug`, `autoCategorize`, `autoTags` (funções puras, fáceis e valiosas) e testes de componente com React Testing Library.
9. **Acessibilidade formal**: auditar contraste, foco visível, `aria-*`, navegação por teclado, e rodar Lighthouse/axe. Importante para um portal inclusivo.
10. **Tratamento de erros e estados vazios** (loading/skeleton/erro) nas páginas que buscam dados.
11. **Observabilidade do agente**: gravar `agentLogs`/`agentReports` (já previstos nas rules) e notificar falhas (as actions estão "failure" no último commit).
12. **Self-host de fontes/ícones** e geração da `og-image.png` (referenciada mas pode não existir).
13. **CONTRIBUTING.md + templates de issue/PR**, já que o projeto pede contribuições.

---

## 🛠️ Correções já aplicadas neste workspace

| Arquivo | Mudança | Efeito |
|---|---|---|
| `src/lib/firestore.ts` | Tipar `constraints` como `QueryConstraint[]`, importar o tipo, remover `let q` redundante | `npm run type-check` agora passa **sem erros** |
| `src/components/feature/MusicPlayer.tsx` | Comentar blocos `catch {}` vazios | `npm run lint` sem **erros** (só 2 warnings restantes) |

Validação após as correções:
- `npm run type-check` → **0 erros** (antes: 3)
- `npm run lint` → **0 erros**, 2 warnings (antes: 2 erros)
- `npm run build` → **OK**

---

## ✅ STATUS: implementado

Todos os ajustes prioritários (P0/P1) foram aplicados. Detalhes em **`CHANGELOG_MELHORIAS.md`**.
Estado final do projeto: `npm run build` (com type-check), `npm run lint` e `npm run type-check` **passam sem erros nem warnings**, em modo `strict`.

## ⏭️ Próximos passos sugeridos

Posso, se você quiser, já implementar no workspace:
- **(A)** Migrar `/eventos` (e/ou home) de mocks para Firestore, fechando o ciclo do agente.
- **(B)** Code-splitting por rota para derrubar o bundle.
- **(C)** Ligar `strict` e um workflow de CI (type-check + lint) para PRs.
- **(D)** Limpeza de config duplicada + remoção de dependências não usadas.

Diga qual(is) priorizar que eu faço.
