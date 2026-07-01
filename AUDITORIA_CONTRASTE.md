# ♿ Auditoria de Contraste (WCAG 2.1 AA)

Análise estática das combinações de cor da paleta Tailwind do projeto.
Critério WCAG AA: **≥ 4.5:1** para texto normal, **≥ 3.0:1** para texto grande (≥ 18.66px bold ou 24px).

## Resultados

| Texto / Fundo | Razão | Texto normal | Texto grande |
|---|---|---|---|
| `white` / `primary-500` (#D43D66) | 4.51 | ✅ PASS | ✅ |
| `white` / `primary-400` (#E94E77) | 3.61 | ❌ FAIL | ✅ |
| `white` / `accent-400` (#2E8B57) | 4.25 | ❌ FAIL (quase) | ✅ |
| `white` / `secondary-400` (#F2A900) | 2.01 | ❌ FAIL | ❌ FAIL |
| `primary-400` / `white` | 3.61 | ❌ FAIL | ✅ |
| `dark-300` (#A8A8A8) / `white` | 2.38 | ❌ FAIL | ❌ FAIL |
| `dark-400` (#6B6B6B) / `white` | 5.33 | ✅ PASS | ✅ |
| `dark-500` / `surface` | 8.48 | ✅ PASS | ✅ |
| `dark-700` / `white` | 17.4 | ✅ PASS | ✅ |

## ✅ Correções aplicadas

- **`text-dark-300` → `text-dark-400`** em 14 trechos de **texto** (metadados: tempo de leitura,
  data, nº de leituras, placeholders). Era 2.38:1 (ilegível) → agora 5.33:1 (passa AA).
  Mantido `dark-300` apenas em **ícones decorativos** e fundos de círculos de estado vazio (não é texto).
- Confirmado que os usos de `text-secondary-400` (amarelo) são apenas **ícones de estrela decorativos**
  (`ri-star-fill`), não texto — portanto não são problema de leitura.

## ✅ Botões/links rosa corrigidos (2026-06-30)

1. **Botões/badges rosa (`bg-primary-400` + `text-white`):** todas as combinações estáticas
   (16 ocorrências) migradas para `bg-primary-500` (4.51:1, passa AA), com o `hover:` correspondente
   subindo para `bg-primary-600` para preservar o feedback visual de interação.
2. **Links rosa (`text-primary-400` em fundo branco):** todas as ocorrências estáticas (7, incluindo
   o skip link de acessibilidade em `App.tsx`) migradas para `text-primary-500`, com `hover:` subindo
   para `text-primary-600` onde aplicável.
   - Estados **apenas** de `hover:`/`group-hover:` (ex.: títulos de card que ficam rosa só ao passar
     o mouse) foram mantidos em `primary-400` — são estados transitórios, não texto de leitura estática.
3. Pontos decorativos (bullets de calendário em `parades/page.tsx`) e ícones com `aria-hidden`
   permanecem em `primary-400`: não são texto, já passam no limiar de 3:1 para componentes de UI.

## ✅ Badges de categoria de eventos corrigidos (2026-07-01)

Os badges de categoria em `mocks/events.ts` (usados em `EventCard.tsx`, `EventFilters.tsx` e
`event-detail/page.tsx` via `getCategoryColor`) usavam tons claros do Tailwind com `text-white`,
praticamente ilegíveis:

| Categoria | Antes | Contraste | Depois | Contraste |
|---|---|---|---|---|
| Paradas | `rose-500` | 3.76 ❌ | `rose-600` | 4.70 ✅ |
| Festas | `orange-400` | ~2:1 ❌ | `orange-700` | 5.18 ✅ |
| Cultura | `amber-500` | 2.40 ❌ | `amber-700` | 5.02 ✅ |
| Saúde | `emerald-500` | 2.86 ❌ | `emerald-700` | 5.48 ✅ |
| Educação | `teal-500` | 2.65 ❌ | `teal-700` | 5.47 ✅ |
| Visibilidade | `pink-400` | ~2.3:1 ❌ | `pink-700` | 6.03 ✅ |
| Encontros | `indigo-400` | ~2.5:1 ❌ | `indigo-600` | 6.28 ✅ |

## ⚠️ Recomendações restantes (não aplicadas — exigem decisão de design)

1. **Verde `accent-400` (4.25:1):** muito perto de passar; considerar `accent-500` (#267A4C) para texto branco.
2. **Amarelo `secondary-400`:** nunca usar como texto sobre branco nem branco sobre ele (2.01:1).
   Só usar como cor de destaque/ícone com texto escuro por cima.

## Outras melhorias de acessibilidade já no projeto

- `aria-hidden="true"` em todos os ícones decorativos (incl. ícones em template literals de cultura).
- Skip link "Pular para o conteúdo" com alvo focável.
- Todas as `<img>` com `alt`; `html lang="pt-BR"`; labels associados nos formulários de login.

## Como rodar o Lighthouse real (recomendado complementar)

No Chrome, abra https://portalgbtqia.vercel.app → DevTools (F12) → aba **Lighthouse** →
marque **Accessibility** → **Analyze page load**. Repita em páginas-chave (`/artigos`, `/saude`, `/login`).
Alternativa via CLI: `npx @lhci/cli autorun` ou `npx lighthouse <url> --only-categories=accessibility`.
