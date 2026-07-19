# Architecture

## Arquitetura Atual
React + Vite, Firebase (Auth/Firestore), Tailwind CSS. (Adicione mais conforme descoberta).

## Arquitetura Futura (Rede Farol)
A Rede Farol adota uma arquitetura em duas camadas:
1. **Portal Frontend (React/Vite)**: Camada de visualização para o usuário final, utilizando contratos legados (`LegacyArticle`) e conectando ao Firebase.
2. **Servidor MCP de Conhecimento (Node.js)**: Um processo Node isolado na pasta `mcp/`, operando através do protocolo `stdio`, que expõe ferramentas de acesso a dados puros verificados (`TrustContent`, `TrustService`) para Agentes de IA. O MCP é estritamente separado do build do Vite.
