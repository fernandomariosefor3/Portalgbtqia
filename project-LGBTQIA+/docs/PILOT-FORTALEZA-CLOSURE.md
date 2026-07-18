# Encerramento do Piloto Fortaleza (Fase 4B)

## Objetivo
Finalizar formalmente a fase de revisão manual e humana da camada inicial de confiança ("Trust Registry") focada na região de Fortaleza, Ceará. O objetivo desta fase foi auditar uma base de dados semeada inicialmente por agentes autônomos, assegurando consistência, precisão, veracidade institucional e, acima de tudo, segurança para os usuários finais e coletivos sensíveis.

## Escopo
A revisão compreendeu todas as entidades mapeadas durante a varredura do Ceará: fontes governamentais, prefeituras, organizações da sociedade civil e equipamentos voltados direta ou indiretamente ao atendimento da população LGBTQIAPN+.

## Metodologia
A metodologia empregada foi a auditoria cadastral estrita (decision: `approved_basic`). Analisou-se a presença de fontes institucionais válidas, a consistência de metadados, o isolamento de dados sensíveis e a correção de informações divergentes. 

## Resultados Finais (Totais Físicos e Canônicos)
- **Registros físicos totais**: 26 (9 fontes, 9 organizações, 8 serviços)
- **Entidades canônicas**: 25 (1 registro da camada de serviço foi consolidado como alias)
- **Alias consolidado**: `srv_acesso_saude_prep_pep` foi arquivado e migrado como canal histórico para `srv_teleprep_telepep` (sem validação humana independente).

## Decisões Humanas
- **`approved_basic`**: 24 entidades canônicas obtiveram aprovação cadastral básica.
- **`needs_more_evidence`**: 1 serviço (Acolhimento Institucional Casa Transformar) permanece retido nesta decisão até a confirmação operacional segura.
- **Nenhuma promoção de status ocorreu**. Todas as entidades permanecem, como projetado, em `under_review`.
- **Nenhuma integração ou publicação ocorreu**. Nenhum dado foi empurrado para o mapa, Firestore ou frontend público.

## Pendências e Segunda Revisão
8 serviços foram marcados obrigatoriamente com `requiresSecondReview: true`, indicando que suas naturezas (saúde, jurídico, acolhimento protegido) demandam validação especializada de um segundo profissional (área clínica, legal ou serviço social) antes de qualquer exposição ou recomendação. 

## A Casa Transformar
O registro `srv_casa_transformar_acolhimento` recebeu bloqueios de segurança (`publicAddressAllowed: false`) e exige evidência robusta de operação ativa e canais seguros antes de sequer alcançar o grau `approved_basic`.

## Limitações do Piloto
Este piloto certificou a **existência institucional** (o catálogo), mas não assegura **capacidade instalada**, tempo de resposta, garantia de porta-aberta, acolhimento imediato, ou imunidade a preconceitos no atendimento direto. O piloto não realizou visitas in loco nem telefonemas de "cliente oculto".

## Diferenciação de Níveis de Confiança
É fundamental compreender a taxonomia estrita adotada pelo sistema:
- **`under_review`**: O status padrão de qualquer entidade recém-criada ou revisada; significa que a entidade existe nos bancos mas não possui confiança selada para publicação ampla.
- **`approved_basic`**: Uma decisão de revisão humana (não um status público). Significa "o revisor atesta que a instituição/serviço existe institucionalmente conforme cadastrado".
- **Elegível para promoção**: Um estado transitório (a ser calculado pelo Motor de Elegibilidade) indicando que uma entidade `approved_basic` cumpre todos os requisitos técnicos para mudar de status.
- **`verified_basic`**: O status público que atesta confiabilidade para os usuários da aplicação.
- **Publicável**: Uma entidade que alcançou `verified_basic` ou superior e está livre para ser apresentada em mapas, buscas e assistentes virtuais.

## Próximos Passos (Fase 5A)
Os dados do Piloto Fortaleza entrarão na simulação do Motor de Elegibilidade (Fase 5A). Este motor determinará quais dos 24 registros com `approved_basic` poderiam, futuramente e administrativamente, ser promovidos a `verified_basic`, aplicando restrições rigorosas baseadas na árvore de dependência (fonte -> organização -> serviço) e exigências de segunda revisão.
