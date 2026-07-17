# MCP Boundaries (Model Context Protocol)

Este documento define os limites e o escopo de uso do Model Context Protocol (MCP) para a Rede Farol. O MCP permitirá que o Agente Farol (e outras IAs) acesse o banco de dados do Portal de maneira padronizada.

## Limitação Primária da Fase 1

Na arquitetura inicial, **o servidor MCP não está implementado**. Apenas definimos as fronteiras lógicas. 
Quando implementado, a premissa absoluta é: **O MCP será SOMENTE LEITURA.** 
Os agentes de IA do portal não terão, na versão inicial de adoção pública, permissões de escrita (mutations) nas coleções.

## Ferramentas (Tools) Planejadas

As seguintes ferramentas de leitura poderão ser futuramente registradas pelo Servidor MCP:

- `search_validated_content`: Pesquisa textual em artigos, direitos e guias que possuem status de publicação validada (`canUseContentInFarol` == true).
- `get_validated_content`: Busca um conteúdo específico pelo seu ID.
- `search_verified_services`: Filtra serviços com base em localização, categoria e nível de acessibilidade (apenas se `canRecommendService` == true).
- `get_verified_service`: Detalha informações operacionais e contatos de um serviço específico.
- `search_verified_sources`: Permite à IA inspecionar os detalhes de uma organização fonte para atestar credibilidade.
- `check_information_freshness`: Retorna o status de `isContentFresh()` ou `isServiceFresh()` para a IA tomar decisões.

## Ferramentas Estritamente Proibidas

As IAs públicas ou integradas via MCP nesta fase do projeto **não terão ferramentas de**:

- **Validar conteúdo**: A IA não pode alterar o status para `validated`.
- **Publicar conteúdo**: A IA não faz push direto de rascunhos para publicação final.
- **Alterar serviço**: A IA não pode editar horário, endereço ou contato de serviços listados (requer interface de submissão e triagem humana).
- **Marcar serviço como parceiro**: O status `partner` é prerrogativa exclusivamente humana corporativa.
- **Enviar denúncia e alterar banco central**: O envio de denúncias ou submissões via Farol (caso feito no futuro) não deve atualizar a coleção pública de imediato, e sim enviar um payload para um pipeline isolado (triage queue).
- **Acessar dados pessoais**: Acesso irrestrito a perfis, e-mails de jornalistas e notas internas (`internalNotes`) não será provisionado pelo endpoint do MCP (o MCP usará as interfaces projetadas "Public" como `PublicTrustService`).
- **Alterar status editorial**: O controle editorial pertence à equipe jornalística/comunidade curadora.
