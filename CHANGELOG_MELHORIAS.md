# 🛠️ Changelog de Melhorias

Conjunto de ajustes aplicados ao Portal LGBTQIA+ Nordeste, organizados por tema.
Todos validados com **`npm run type-check`**, **`npm run lint`** e **`npm run build`** passando sem erros nem warnings.

---

## 1. Correção de bugs e qualidade de tipos

- **`src/lib/firestore.ts`**: corrigidos 3 erros de tipo reais que estavam escondidos
  (o build não fazia type-check). `constraints` agora é tipado como `QueryConstraint[]`
  e o tipo foi importado do SDK. Removida a variável `q` redundante.
- **`src/components/feature/MusicPlayer.tsx`**: removidos blocos `catch {}` vazios
  (erro `no-empty`) e corrigidas as dependências do `useEffect` (`track.id`, `nextTrack`).

## 2. TypeScript em modo estrito ✅

- **`tsconfig.app.json`**: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`,
  `noFallthroughCasesInSwitch: true`, `noUncheckedSideEffectImports: true`.
- Corrigidos todos os 10 erros revelados (imports/variáveis não usados em 8 páginas
  e um valor `unknown` renderizado em JSX no formulário de eventos).

## 3. CI e build à prova de regressões

- **`package.json`**:
  - `build` agora roda `type-check` **antes** do `vite build` (erros de tipo quebram o build).
  - Novo script `validate` (type-check + lint).
  - `name` corrigido (`react` → `portal-lgbtqia-web`), `version` `0.0.0` → `0.1.0`.
  - Removidas dependências não usadas: **`@stripe/react-stripe-js`** e **`recharts`**.
- **`.github/workflows/ci.yml`** (novo): roda type-check, lint e build em todo push/PR para `main`.

## 4. Performance — code-splitting

- **`src/router/config.tsx`**: todas as páginas agora usam `React.lazy` (um chunk por rota).
- **`src/router/index.tsx`**: rotas envoltas em `<Suspense>` com fallback de carregamento.
- **`vite.config.ts`**: `manualChunks` separando `firebase` e `react` em vendor chunks + `chunkSizeWarningLimit`.

**Resultado (gzip):**

| Antes | Depois |
|---|---|
| 1 bundle de **308 KB** | core **~22 KB** + firebase **110 KB** + react **73 KB** (cacheáveis) + páginas sob demanda |

Aviso de "chunk > 500 kB" eliminado.

## 5. Autorização de admin centralizada

- **`src/lib/auth.ts`**: `useAuth()` agora retorna `isAdmin`, baseado em `role: 'admin'`
  do perfil no Firestore (com fallback para o e-mail do fundador, exportado como `FOUNDER_EMAIL`).
- **`src/router/AdminRoute.tsx`** (novo): protege `/admin` exigindo login **E** permissão de admin.
- **`Navbar.tsx`** e **`admin/page.tsx`**: passaram a usar `isAdmin` do hook — e-mail
  hardcoded removido de ambos (antes estava duplicado em 3 lugares).
- **`firestore.rules`**: comentário apontando para o `FOUNDER_EMAIL` centralizado no frontend.

## 6. Integração real com o Firestore (fechando o ciclo do agente)

- **`src/lib/useEvents.ts`** (novo): hook que busca eventos aprovados do Firestore,
  mapeia para o formato da UI e **cai automaticamente para os mocks** se o Firestore
  estiver vazio ou indisponível (`usingFallback`).
- **`src/pages/events/page.tsx`**: passou a consumir `useEvents()` em vez do array
  estático de mocks, com **skeleton de carregamento**. Agora os eventos publicados
  pelo agente aparecem no site.

## 7. Limpeza de configuração duplicada

- Removido workflow duplicado/morto `project-LGBTQIA+/agent/.github/`.
- Removido `vercel.json` duplicado dentro de `project-LGBTQIA+/` (mantido o da raiz).

---

## Próximos passos sugeridos (não aplicados ainda)

- Migrar as demais páginas (home, artigos, cultura, saúde) de mocks → Firestore usando o mesmo padrão de `useEvents`.
- Página dedicada de login/cadastro (hoje só "Entrar com Google" na Navbar).
- Testes com Vitest (o agente já tem Vitest configurado; começar pelas funções puras `generateSlug`, `autoCategorize`, `autoTags`).
- Auditoria de acessibilidade (contraste, foco, `aria-*`, teclado).
- Self-host de fontes/ícones (hoje via CDN).
