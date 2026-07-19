# Trust Registry (Registro de Confiança)

O Trust Registry é o repositório de verdade da Rede Farol. Ele mantém o cadastro central de fontes institucionais verificáveis, organizações verificadas e serviços de acolhimento de forma curada, auditável e segura.

## Propósito
- Garantir que todos os dados oferecidos ao público tenham **fontes rastreáveis**.
- Evitar que endereços de abrigos e casas de acolhimento sejam expostos indevidamente (via `publicAddressAllowed: false`).
- Desacoplar os dados confiáveis do banco de dados (Firestore) durante as fases iniciais.

## Estrutura Atual (Piloto - Fortaleza)
Os dados do piloto ficam estaticamente armazenados em `trust-registry/pilot-fortaleza/` através de arquivos JSON padronizados:
- `sources.json`: Fontes originais (governo, ONGs certificadas).
- `organizations.json`: Organizações mantenedoras de serviços.
- `services.json`: Serviços prestados.
- `evidence.json`: Rastreabilidade de *onde e quando* a informação foi coletada.
- `validations.json`: Assinatura de revisores humanos para promoção de status.
- `review-queue.json`: Itens aguardando revisão humana.

## Restrições do Piloto
1. **Nenhuma Entidade Validada Automaticamente**: Novos registros entram como `submitted` ou `under_review`.
2. **Endereços Sensíveis Ocultos**: O campo `publicAddressAllowed` define a exposição pública de dados de contato/localização de abrigos, devendo ser estritamente controlado.
3. **Fila de Revisão Obrigatória**: O `review-queue.json` atua como uma barreira onde questionamentos e evidências precisam ser solucionados manualmente antes da aprovação final.

## Validação Cruzada
Qualquer alteração neste registro deve ser acompanhada do script de integridade e checagem de regras:
```bash
npm run registry:validate
```
