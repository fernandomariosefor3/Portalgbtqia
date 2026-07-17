# Registro de Confiança (Trust Registry)

Este diretório contém os dados estáticos confiáveis da Rede Farol, mantidos de forma auditável e curada humanamente.
Durante a Fase Piloto, estes dados não estão conectados ao Firestore nem ao MCP.

## Estrutura
- `schemas/`: Validações runtime com Zod.
- `pilot-fortaleza/`: Dados JSON do projeto piloto em Fortaleza.
- `reports/`: Relatórios gerados automaticamente sobre o estado do piloto.
- `tests/`: Bateria de testes para assegurar as regras do registro.

## Regras (Fase Piloto)
- Nenhuma informação sensível (endereços seguros) será promovida automaticamente.
- Nenhum registro possui status superior a `under_review` sem revisão humana.
- Todo serviço ou organização deve estar ancorado em fontes rastreáveis e verificáveis.
