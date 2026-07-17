# Security Policy

Inclui:
* proteção de chaves;
* privacidade;
* minimização de dados;
* conteúdo sensível;
* limites de agentes;
* revisão humana;
* proteção de menores;
* plano de resposta a incidentes.

## Acesso de Agentes (MCP)
1. **Quarentena de Dados**: O MCP opera com dados limpos projetados (ex: `PublicTrustContent`). Dados confidenciais, rascunhos, `internalNotes` e status de auditoria não são vazados.
2. **Indistinção de Falhas**: Itens suspensos, expirados, em revisão ou não existentes respondem unicamente com `NOT_FOUND` para ferramentas de consulta específica, prevenindo que um agente infira status internos por variação de resposta de erro.
3. **Erros Mascarados**: Exceções não tratadas retornam `INTERNAL_ERROR` sem stack trace.
4. **Sem Ferramentas de Escrita**: O protocolo não expõe `create_` ou `update_` nesta fase do projeto.
