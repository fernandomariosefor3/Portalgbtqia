# Fluxo de Verificação (Verification Workflow)

Para que uma informação, serviço ou evento faça parte da camada "Fundação de Confiança", um ciclo de vida rigoroso é aplicado.

## Fases do Fluxo de Verificação

### 1. Submissão (Submission)
- **Ação:** Um formulário público (ou ingestão por IA de raspagem primária) envia os dados brutos.
- **Status:** `submitted` ou `draft`.
- **Lógica:** Nenhuma dessas entradas é publicamente visível.

### 2. Triagem (Triage)
- **Ação:** Sistema ou revisor júnior descarta duplicações óbvias, lixo ou spam (conteúdos que não possuem aderência temática ou faltam dados básicos obrigatórios como localização).
- **Status resultantes:** Transição para `under_review` ou `rejected`.

### 3. Coleta de Evidências e Fila de Revisão (Review Queue)
- **Ação:** As evidências (URLs, documentos, atas) são cadastradas na entidade. Caso haja dados incompletos ou incertos (ex: telefone, confirmação porta-aberta), o registro é encaminhado para a Fila de Revisão (`review-queue.json`).
- **Registro:** O array `sourceIds` e/ou `evidence.json` são preenchidos.
- **Limitação:** Nenhuma entidade com pendência humana ou informações ausentes sensíveis progride além de `under_review`.

### 4. Revisão e Validação Humana (Human Validation)
- **Ação:** Um revisor humano (time editorial, jurídico, ou de saúde) analisa as pendências na fila de revisão. Apenas após a confirmação manual, o registro avança.
- **Registro:** Um registro em `validations.json` documentando quem aprovou, com base em quais evidências, e a data.
- **Status:** Transição para `validated`, `verified_basic` ou `community_reviewed`.
- **Efeito:** A informação agora é tratada como confiável e pode ser lida pela IA (MCP) ou frontend (após integração).

### 5. Publicação (Publication)
- As funções de projeção (`toPublicContent`, `toPublicService`) removem as anotações sensíveis. A entidade tipada é consumida pela plataforma pública e o Farol (MCP).

### 6. Monitoramento e Expiração (Monitoring and Expiration)
- **Ação:** Uma rotina periódica (cron) ou checagem no carregamento (ex: `calculateNextReviewDate()`) afere se a janela de validade expirou.
- Se `isServiceFresh()` ou `isContentFresh()` retornar falso:
  - Serviço: Passa a não ser mais "Recomendado" (`canRecommendService` = false), mantendo o histórico, mas ganhando a tag visual "Desatualizado".
  - Oportunidade/Evento: Fica "Encerrado".
  - Saúde/Direitos: Pode transitar para status editorial `outdated`, engatilhando um alerta de revisão.

### 7. Correção (Correction)
- Qualquer revisão posterior cria uma nova entrada no `TrustAuditLog` para manter histórico. Não deve apagar os logs do passado.

### 8. Suspensão (Suspension)
- **Ação:** Se houver denúncia (comunidade relata fechamento do local, conteúdo perigoso, ataque discriminatório).
- **Status:** O local recebe `suspended` ou o conteúdo vai para `blocked`.
- **Efeito:** Saem do ar imediatamente (o Farol cessa a citação e a interface remove das buscas). Voltam ao fluxo de triagem pesada.
