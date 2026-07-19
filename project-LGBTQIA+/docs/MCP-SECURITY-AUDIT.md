# Auditoria de Segurança do MCP da Rede Farol

## 1. Visão Geral
Esta auditoria foi conduzida como parte da **Fase 3B (Hardening)**. O objetivo foi assegurar que o MCP de conhecimento do Portal LGBTQIA+ é resistente a entradas maliciosas, vazamentos de dados, exaustão de recursos e falhas inesperadas, operando exclusivamente como um servidor local "somente leitura".

## 2. Escopo da Auditoria
Foram testados e implementados os seguintes vetores de segurança:
- **Proteção contra ataques de negação de serviço (DoS)**: limites de tamanho de payload configurados (`MAX_RESPONSE_PAYLOAD_SIZE_BYTES = 2MB`), com redução progressiva determinística.
- **Validação de esquema (Zod strict)**: rejeição de propriedades não reconhecidas, e limites estritos em inputs de ferramentas.
- **Prevenção de Data Leaks**: filtros estritos não expõem campos privados. Testes confirmam que marcadores (`INTERNAL_SECRET_MARKER`, `PRIVATE_REVIEWER_MARKER`, `SECURITY_NOTE_MARKER`, `REPORTER_ID_MARKER`) são devidamente omitidos nas projeções públicas.
- **Tratamento de Erros e Stack Traces**: Erros desconhecidos (`SECRET_DATABASE_ERROR`) são interceptados e mascarados sob um `INTERNAL_ERROR` ("Um erro interno genérico ocorreu."), não vazando stack trace ou chaves não categorizadas (nenhum `UNCATEGORIZED_ERROR`).
- **Análise Estática de Imports**: Script `check-mcp-imports.mjs` comprovou com sucesso a ausência de imports proibidos (Firebase, fetch, fs, child_process).

## 3. Cobertura de Testes Adversariais

A bateria adversarial (`npm run mcp:test`) agora cobre:
- `mcpStdio.test.ts`: valida o transporte de subprocesso isolado, provando que apenas as **6 ferramentas permitidas** estão acessíveis (check_information_freshness, get_validated_content, get_verified_service, search_validated_content, search_verified_services, search_verified_sources). Sem órfãos.
- `limitExceeded.test.ts`: garante que o retorno cai progressivamente até se enquadrar no Payload < 2MB ou falha graciosamente com código explícito.
- `adversarial.test.ts`: blinda exceções obscuras do repositório, timeout massivo e inputs desproporcionais.
- `dataLeaks.test.ts`: assegura sanidade de campos PII e anotações sensíveis.
- `fatalErrors.test.ts`: `uncaughtException` e `unhandledRejection` resultam em encerramento com Exit Code `1`, limpando I/O. Não ocorre override global de `console.log`.

## 4. Conformidade de Dependências
As dependências do MCP (SDK, zod, tsx, vitest) passaram na auditoria sem vulnerabilidades (`npm audit` -> 0 vulnerabilities). O ambiente permanece limpo de cloud adapters.

## 5. Próximos Passos
Quando os repositórios reais do Firestore entrarem na Fase 4, estes testes de limites servirão como baseline para impedir picos de faturamento acidentais (Firestore reads exaustivos).

**Status atual**: APROVADO para operação final do MCP. Nenhum dado exposto, zero dependências com vazamentos e comportamento robusto.
