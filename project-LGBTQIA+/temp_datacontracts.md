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

## 4. Migração dos Modelos Legados

### Tipos Legados Existentes
Atualmente, o projeto front-end (em suas pastas `src/mocks/` e `src/lib/`) depende de:
- `SafeSpace`
- `EventItem`
- `Opportunity`
- `Article` e `HealthGuide`

### Substituições e Adaptações Futuras
Na próxima fase de integração com Firestore:
- `SafeSpace` será transformado em `TrustService`. Campos como `type` poderão virar `category`.
- `EventItem` passará para `TrustEvent`.
- `Article` e `HealthGuide` unificarão sob `TrustContent`.

### Dados Sem Fontes
Os dados atuais nos mocks geralmente não possuem o array `sourceIds`. Na migração, esses registros precisarão:
1. Ter uma `TrustSource` raiz (ex: "Acervo Histórico do Portal").
2. Ser submetidos à validação humana e associados ao status `community_reviewed` ou permanecer como `draft`.

**A migração real não foi realizada na Fase 1** para preservar a estabilidade da UI em andamento. Adapters assíncronos (conversores Firebase -> Front) serão introduzidos posteriormente para mapear o banco atual ao formato `Trust`.
