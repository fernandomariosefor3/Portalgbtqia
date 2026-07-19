# Relatório de Sessão de Revisão Humana Guiada

* **Data da Sessão**: 2026-07-18
* **Revisor**: `reviewer-owner-001`
* **Entidades Analisadas**: 6

## Resumo das Decisões

1. **`src_gov_ce`** (Fonte)
   - Decisão: `approved_basic`
   - Campos confirmados: Identidade institucional, domínio oficial.
   - Campos não aprovados: Nenhum aplicável à aprovação básica.
   - Sem promoção de status original.

2. **`src_sec_div_ce`** (Fonte)
   - Decisão: `approved_basic`
   - Campos confirmados: Identidade institucional, domínio oficial, presença governamental.
   - Campos não aprovados: Nenhum.
   - Sem promoção de status original.

3. **`src_pref_fortaleza`** (Fonte)
   - Decisão: `approved_basic`
   - Campos confirmados: Identidade institucional, domínio oficial municipal.
   - Campos não aprovados: Nenhum.
   - Sem promoção de status original.

4. **`org_gov_ce`** (Organização)
   - Decisão: `approved_basic`
   - Campos confirmados: Existência cadastral, vínculo estatal.
   - Campos não aprovados: Serviços e programas subordinados.
   - Sem promoção de status original.

5. **`org_sec_div_ce`** (Organização)
   - Decisão: `approved_basic`
   - Campos confirmados: Identidade institucional, natureza pública estadual, website oficial e vínculo com a fonte aprovada.
   - Campos não aprovados: Atuação em saúde/clínica (inexistente nesta camada).
   - Sem promoção de status original.

6. **`srv_thina_rodrigues`** (Serviço)
   - Correções Solicitadas: Sim (`correction_required` inicial para atualização de contatos, horários, fluxos e agendamentos com base na fonte).
   - Decisão Final: `approved_basic`
   - Campos confirmados: Existência cadastral, nome, vínculo, telefone, e-mail, horário e endereço.
   - Campos não aprovados: Orientações clínicas/jurídicas e efetividade técnica ou de atendimento.
   - Necessidade de segunda revisão: **SIM** (`requiresSecondReview: true`), por ser categorizado como acolhimento social e direitos.
   - Sem promoção de status original (permanece `under_review` e restrito).

## Notas Técnicas

- O status de nenhuma entidade foi promovido além de `under_review` no cadastro geral.
- Não foram concedidos status de parceiro (`partner`) nem verificado (`verified_basic`).
- Nenhuma ativação em frontend, mapa, ou MCP.
- Resultado dos scripts de validação: `All human reviews checked successfully.` Nenhum pacote órfão ou endereço não autorizado.
