# Implementação do MCP de Conhecimento (Fase 3A)

## Objetivo
Estabelecer um servidor MCP (Model Context Protocol) local e puramente focado em leitura, habilitando agentes de IA a consultar o conteúdo e serviços validados da Rede Farol, sem risco de expor dados não-curados, dados privados ou ferramentas de escrita.

## Arquitetura
O servidor roda nativamente em Node.js usando o pacote oficial `@modelcontextprotocol/sdk`. 
Ele foi isolado na pasta raiz `mcp/portal-lgbtqia-knowledge-mcp` para não poluir o build de frontend (Vite) nem permitir que componentes React dependam acidentalmente de módulos backend Node.js.
Utilizamos um arquivo `tsconfig.mcp.json` dedicado para type-checking desse escopo.

## Transporte
Nesta fase, o único meio de transporte habilitado é `stdio`. O servidor se comunica utilizando stdin/stdout via JSON-RPC, sendo iniciado localmente por processos pai (como Antigravity ou Claude Code). É estritamente proibido o uso de `console.log` para debug (substituído por `console.error`), a fim de não corromper o stream de mensagens.

## Ferramentas Disponibilizadas
1. `search_validated_content`: Busca por conteúdos aprovados (`validated`).
2. `get_validated_content`: Traz informações textuais completas (se autorizado).
3. `search_verified_services`: Busca por `TrustService` (`verified_basic` ou `partner`).
4. `get_verified_service`: Retorna os dados públicos do serviço.
5. `search_verified_sources`: Lista as fontes oficiais (`TrustSource`) sem restrições ativas.
6. `check_information_freshness`: Diz se a informação expirou sem vazar o real motivo de suspensão.

## Limites e Políticas (Quarentena)
Os limites da pesquisa (tamanhos máximos, paginação) encontram-se em `config/limits.ts`.
As políticas de liberação (`canUseContentInFarol`, `canRecommendService`) interceptam **toda saída** para o agente, forçando as regras estabelecidas:
- O conteúdo exige ao menos uma fonte válida e não bloqueada.
- O dado não pode estar com a `nextReviewAt` expirada no referencial temporal atual (`now`).
- Campos sensíveis (anotações de segurança) são obliterados antes do envio, utilizando projeções de dados `PublicTrustService` e `PublicTrustContent`.

## Tratamento de Erros e Privacidade
Os erros retornados via protocolo não incluem stack traces. O `server.ts` intercepta qualquer `Error` disparado internamente, ofusca a falha se ela for imprevista (convertendo para `INTERNAL_ERROR`), e mapeia as intenções de busca para status adequados como `NOT_FOUND` (para registros inexistentes ou retidos em bloqueio) e `INVALID_INPUT` para violações de schema Zod.

## Dependências
- `@modelcontextprotocol/sdk` (runtime): O pacote canônico e estável para a linguagem TypeScript.
- `zod` (runtime): Validador robusto utilizado nativamente pelo SDK para construir as ferramentas do MCP. 
- `tsx` (dev): Executor seguro para rodar o arquivo TypeScript em backend de forma isolada, invocável via `npm run mcp:dev`.

## Testes e Execução
Temos testes executados por Vitest em `mcp/tests/mcpServer.test.ts`. Eles não iniciam subprocessos, mas injetam fixtures (via `MemoryRepositories`) e acionam o objeto instanciado do MCP para validar as rotas. 

```bash
npm run mcp:type-check
npm run mcp:test
npm run mcp:dev
```

## Próximos Passos
O próximo avanço exigirá conectar os `MemoryRepositories` ao banco Firestore oficial de forma somente-leitura. Ferramentas de escrita permanecem expressamente proibidas.
