# Protocolo de Revisão Humana (Fase 4B)

Este documento define o protocolo obrigatório de revisão humana para a promoção de registros dentro da Rede Farol, visando proteger a segurança, garantir a precisão e evitar a manipulação algorítmica de dados confidenciais.

## Finalidade
A Mesa de Revisão Humana assegura que nenhuma entidade (serviço, organização, fonte) alcance um status verificável sem que uma pessoa autorizada e rastreável ateste sua segurança e veracidade por meio de evidências concretas. O protocolo previne a promoção indevida de dados importados (legacy) e garante a aplicação criteriosa de restrições de privacidade.

## Papéis
### O Agente (Sistema)
O papel do agente se restringe a:
* Cruzar informações, validar schemas e formatos estruturais.
* Levantar dependências e evidências faltantes.
* Gerar pacotes de revisão individuais (`review-packets/`) com identificação determinística (fingerprint).
* Avaliar a **elegibilidade técnica** para promoção, alertando para potenciais inconsistências, campos sensíveis expostos, etc.
* **Nunca** o agente pode promover um registro automaticamente, aprovar isoladamente um checklist ou criar validações fictícias.

### A Pessoa Revisora
O papel da pessoa revisora consiste em:
* Analisar pacotes de revisão de forma holística.
* Executar checklists de segurança e veracidade.
* Fornecer a decisão final na forma de registros auditáveis inseridos em `validations.json`.
* Adicionar notas e referências documentais necessárias para sustentar as aprovações.

## Tipos de Decisões e Confiança
Toda revisão deve resultar em uma decisão estruturada:
- `approved_basic`: Aprova o cadastro básico. **Não significa** que a entidade é "totalmente segura" ou confiável; significa apenas que os dados base são reais.
- `needs_more_evidence`: Não é possível formar uma decisão com as evidências apresentadas (status `under_review`).
- `correction_required`: Retorna para ajustes, identificando anomalias.
- `blocked`: Recusada, congelada de forma definitiva devido a risco, dados espúrios ou fraude.
- `rejected`: Informação não confere com os padrões estabelecidos pela Rede Farol.

O limite da aprovação nesta fase permite apenas avançar a entidade ao nível de confiança (Trust Level) "basic" (`verified_basic`). Status como `partner` ou aprovações automáticas comunitárias estão estritamente banidos deste processo.

## Expiração e Imutabilidade
- Toda validação requer as datas corretas (ISO 8601), incluindo limites de validade (`validUntil`), após os quais a informação exigirá *Follow-up*. 
- Nenhuma modificação pós-revisão passará despercebida. O registro utiliza o sistema de fingerprint (hash); qualquer alteração no registro de origem invalidará os pacotes e exigirá uma nova entrada de revisão (*stale packet*).
- As entradas (`validations.json`) são imutáveis e formam uma cadeia rastreável baseada em IDs pseudonimizados. O nome civil e os contatos do revisor nunca devem ser escritos nos registros públicos ou JSONs abertos de desenvolvimento, a fim de proteger sua identidade. Conflitos de interesse ou revisões múltiplas no mesmo serviço exigirão múltiplas submissões encadeadas.

## Revisão Dupla e Exceções Sensíveis
Para casos envolvendo:
- Endereços protegidos/acolhimentos,
- Menores em risco,
- Atendimento direto de emergência de saúde ou jurídico (PrEP, Sertrans),

A elegibilidade acusa a tag `requiresSecondReview = true`. Isso orienta a Mesa a garantir que revisores com os papéis especializados (`health_reviewer`, `legal_reviewer` ou `privacy_reviewer`) realizem uma segunda checagem paralela, sem a qual a entidade estará impossibilitada de seguir para o ambiente de produção.
A exposição (`publicAddressAllowed = true`) desses dados continuará terminantemente proibida sem aprovação de uma revisão de nível Sênior ou colegiada.
