# Contratos de Dados da Rede Farol

Este documento descreve os contratos (interfaces) da Fase 1 da Fundação de Confiança. As interfaces definem a estrutura estrita de como as informações serão catalogadas e compartilhadas.

## 1. Contratos Principais

As tipagens estão declaradas em `src/types/trust.ts`.

- **`TrustService`**: Representa um serviço local ou recurso físico/recorrente.
- **`TrustEvent`**: Representa um evento com data de início e fim.
- **`TrustOpportunity`**: Vagas de emprego, bolsas ou editais.
- **`TrustContent`**: Materiais de leitura, guias de saúde, leis e conteúdo editorial.
- **`TrustSource`**: O registro de onde veio a informação (ex: site governamental, artigo, ONG).
- **`TrustOrganization`**: O perfil da organização responsável por prover a fonte ou os serviços.

## 2. Campos Obrigatórios vs Sensíveis

### Campos Sensíveis (Nunca expor na API pública/Frontend público)
Alguns campos existem para governança, mas expô-los representaria quebra de privacidade, risco de segurança ou confusão administrativa.
- **Identidades Internas**: `verifiedById`, `reporterId`, `reviewerId`, `authorId`, `validatorId`.
- **Anotações**: `internalNotes`, `securityObservations`, `observations`.
- **Histórico Completo**: O log de `TrustAuditLog` é exclusivamente para administração interna e não deve ser consultado publicamente.

### Projeções Públicas (Public Projections)
Para enviar dados para o frontend atual ou para um futuro MCP de leitura pública, utilize os tipos "Public":
- `PublicTrustService`
- `PublicTrustEvent`
- `PublicTrustOpportunity`
- `PublicTrustContent`
Esses tipos utilizam o `Omit` do TypeScript para arrancar estruturalmente os campos privados. A conversão de dados deve passar pelas funções em `src/lib/trust.ts` (ex: `toPublicService`).

## 3. Limitação de Tempo de Execução (Runtime Validation)

**Atenção**: Na Fase 1 atual, o projeto define contratos TypeScript puros (`interface` e `type`). O TypeScript não valida dados recebidos no tempo de execução (runtime). 
- Caso o projeto receba payloads externos (por APIs no Next.js ou Vercel Functions) no futuro, **será necessária a adoção de schemas validados (ex: Zod ou Yup)** para garantir que o formato bata com o contrato em tempo de execução.
- Por enquanto, isso atende os requisitos tipados para desenvolvimento da UI, dos Agentes locais e dos fluxos.

## 4. Migração e Quarentena dos Modelos Legados (Fase 2)

### Tipagem de Adaptação
A adaptação inicial (Fase 2) foca na criação de uma camada segura entre os dados antigos e a Rede Farol. O processo envolve os contratos de migração (`TrustDataOrigin`, `TrustMigrationStatus`, `LegacyAdaptationResult<T>`) que separam a adaptação estrutural da verificação editorial.

### Limite de Adaptação (Success != Verificação)
O processo de migração puramente estrutural devolve `success: true` apenas para indicar conversão sem erros técnicos fatais. **Isso não significa verificação**.
- Dados adaptados são marcados como `draft`, `submitted`, `needs_review` ou `blocked`.
- A promoção para status confiáveis (como `validated`, `verified_basic`) exige revisão humana em lote (Fase 3+).

### Dados sem Fontes ou Fictícios
Os adaptadores implementam checagem estrita para a presença de fontes (`source_url` etc). Caso faltem fontes:
- Os registros caem em `blocked` ou `needs_review`.
- Guias de Saúde e Leis sem fontes são retidos (`blocked`) com alerta crítico (`SENSITIVE_CLAIM_WITHOUT_SOURCE`).
- As referências legadas não geram automaticamente novos `TrustSource` (`resolveLegacySourceReferences`).

### Runtime Type Guards
Embora não exista Zod instalado, a Fase 2 inseriu funções manuais puras de verificação (`isLegacyArticle`, etc) usando entrada `unknown` para validação básica mínima de runtime.
