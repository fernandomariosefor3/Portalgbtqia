# Plano de Migração Legado para a Rede Farol

Este documento descreve a estratégia de adaptação e isolamento (quarentena) dos dados legados (Fase 2) em preparação para a Rede Farol.

> [!WARNING]
> **Adaptação não significa validação.**  
> O status `success: true` significa apenas adaptação estrutural bem-sucedida. Não confere aprovação editorial, verificação de confiança ou uso imediato pelo Farol e MCP. Nível legado de verificação (`verificationLevel`) não é herdado automaticamente. Nenhuma URL antiga se torna automaticamente uma fonte confiável (`TrustSource`).

## 1. Inventário Real de Dados Legados (Locais)

A contagem de objetos definidos nos arquivos da pasta `src/mocks/` revela os seguintes totais exatos:

| Tipo Legado | Arquivo | Qtde | Formato | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Article** | `articles.ts` / `articles-full.ts` | 10 | Estático local, array de objetos | Em uso via `useArticles.ts` fallback |
| **EventItem** | `events.ts` | 3 | Estático local, array de objetos | Em uso via `useEvents.ts` fallback |
| **SafeSpace** | `safeSpaces.ts` | 10 | Estático local, array de objetos | Em uso via `useSafeSpaces.ts` fallback |
| **HealthGuide** | `health.ts` | 4 | Estático local, array de objetos | Em uso via `useHealth.ts` fallback |
| **LegalGuide** | `legalRights.ts` | 12 | Estático local, array de objetos | Em uso via `useLegalGuides.ts` fallback |

*Nota sobre Oportunidades: O arquivo `useOpportunities.ts` lê diretamente do Firestore, não possuindo mocks mapeados localmente com arrays predefinidos, mas um adapter `adaptLegacyOpportunity` está disponível para uso puramente estrutural em memória.*

## 2. Princípios de Quarentena

Todo registro adaptado recebe um status que o isola das funções operacionais do Farol:

1. **Artigos Gerais**: `draft` ou `blocked` caso falte fonte e contenha conteúdo sensível.
2. **Saúde e Direitos**: Sempre bloqueado (`blocked`) se faltar fonte oficial confirmada no Registro de Confiança. Alerta crítico: `SENSITIVE_CLAIM_WITHOUT_SOURCE`.
3. **Eventos**: Nunca confirmados automaticamente. Ficam `needs_review` se não houver fonte válida. Datas passadas são marcadas com `EXPIRED_EVENT`.
4. **Oportunidades**: Ficam `needs_review` se não possuírem dados críveis. Prazos estourados marcados com `EXPIRED_OPPORTUNITY`.
5. **SafeSpace**: Verificação legada ignorada (alerta `LEGACY_VERIFICATION_NOT_TRANSFERABLE`). Limite máximo: `submitted`.

Toda promoção futura exigirá revisão humana.

## 3. Resolução de Fontes

A resolução de referências textuais e URLs legadas (via `resolveLegacySourceReferences`) pode resultar em:
- `exact_match`: URL idêntica a um `TrustSource` não rejeitado.
- `possible_match` / `ambiguous`: Apenas o domínio coincide.
- `missing`: Nenhuma correspondência.
- `blocked`: Fonte existente, mas suspensa ou rejeitada.

URLs antigas não criam automaticamente novas fontes confiáveis. Uma correspondência ambígua não gera `sourceId`.

## 4. Próximos Passos (Fase 3+)

Nenhum dado será migrado nesta fase. Os mocks continuarão separados e o Firestore intocado.
A migração real precisará de:
1. Backup dos dados de produção e simulação.
2. Lote piloto com revisão humana.
3. Plano de rollback documentado.
