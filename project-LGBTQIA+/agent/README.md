# 🤖 Agente de Eventos LGBTQIA+ - Portal Fortaleza

Agente autônomo que busca, processa e publica eventos LGBTQIA+ automaticamente no portal, focado em **Fortaleza/CE**.

## 🎯 Funcionalidades

- **Web Scraping Multi-Fonte**: Busca eventos de Google, Eventbrite, Sympla, Instagram e Facebook
- **Enriquecimento com IA**: Usa OpenAI GPT para melhorar títulos, descrições e categorização
- **Publicação Automática**: Publica até 10 eventos por semana no Firebase Firestore
- **Execução Agendada**: Roda automaticamente toda segunda-feira via GitHub Actions

## 📁 Estrutura

```
agent/
├── src/
│   ├── scrapers/       # Módulos de scraping
│   │   ├── base.ts     # Classe base
│   │   ├── google.ts   # Google Search
│   │   ├── eventbrite.ts
│   │   ├── sympla.ts
│   │   ├── instagram.ts
│   │   ├── facebook.ts
│   │   └── manager.ts # Orquestrador
│   ├── processors/
│   │   └── ai.ts      # Processamento com IA
│   ├── publishers/
│   │   └── firebase.ts # Publicação no Firebase
│   ├── cli/
│   │   └── index.ts   # Interface CLI
│   ├── types.ts       # Tipos TypeScript
│   └── index.ts       # Orquestrador principal
├── .env.example
├── package.json
└── tsconfig.json
```

## 🚀 Como Usar

### 1. Configuração

```bash
# Entre na pasta do agente
cd agent

# Instale as dependências
npm install

# Copie o arquivo de exemplo
cp .env.example .env
```

### 2. Configure as variáveis de ambiente

Edite o arquivo `.env`:

```env
# Firebase (necessário para publicação)
FIREBASE_PROJECT_ID=seu_projeto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@xxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# OpenAI (opcional, mas recomendado)
OPENAI_API_KEY=sk-...
```

### 3. Teste local

```bash
# Executar agente completo
npm run start

# Apenas buscar eventos (sem publicar)
npm run scrape

# Buscar e processar (sem publicar)
npm run process

# Com opções customizadas
node dist/cli/index.js run --city "Fortaleza" --limit 5
```

## ⚙️ Configuração do Firebase

### 1. Crie um projeto Firebase

```bash
# Instale Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Selecione o projeto
firebase use seu-projeto
```

### 2. Configure o Admin SDK

```bash
# Gere uma chave de serviço
# Firebase Console > Configurações do projeto > Contas de serviço > Gerar nova chave privada

# Salve como firebase-key.json no projeto
```

### 3. Configure as secrets no GitHub

Vá em **Settings > Secrets and variables > Actions** e adicione:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `OPENAI_API_KEY` (opcional)

## 📊 Fontes de Dados

O agente busca eventos das seguintes fontes:

| Fonte | Prioridade | Descrição |
|-------|------------|-----------|
| Google Search | Alta | Busca por termos LGBTQIA+ |
| Eventbrite | Alta | Eventos cadastrados na plataforma |
| Sympla | Alta | Eventos brasileiros |
| Instagram | Média | Perfis públicos de coletivos |
| Facebook | Média | Eventos públicos |

## 🎛️ Configuração

No arquivo `src/index.ts`:

```typescript
const config = {
  cityFocus: 'Fortaleza',    // Cidade foco
  stateFocus: 'CE',          // Estado
  eventsLimitPerWeek: 10,    // Limite semanal
  scrapeFrequencyDays: 3,     // Frequência de scraping
  sources: [],                // Fontes específicas (vazio = todas)
};
```

## 📅 Execução Automática

O agente está configurado para rodar via GitHub Actions E cron job local:

- **Segunda-feira 8h (BRT)**: Execução completa (scrape + process + publish)
- **A cada 3 dias**: Apenas scraping (para coleta de dados)

### Cron Job (Execução Automática Semanal)

O agente está configurado para executar automaticamente toda semana:

1. **Acesse o Dashboard de Tarefas Agendadas**
2. **Configure a tarefa** com:
   - **Frequência**: `0 8 * * 1` (Toda segunda-feira às 8h)
   - **Script**: `cd /caminho/para/projeto/agent && npm run start`

### Executar manualmente

- **GitHub Actions**: Vá em **Actions > Event Scraper Agent > Run workflow**
- **Local**: `npm run start`

## 🔒 Segurança

- O agente usa **Firebase Admin SDK** com credenciais de serviço
- As variáveis de ambiente estão protegidas via GitHub Secrets
- Não publica dados sensíveis
- Logs de todas as operações são mantidos

## 📝 Coleções do Firestore

O agente cria/gerencia as seguintes collections:

```
/events          - Eventos publicados
  └── {id}
      ├── title
      ├── slug
      ├── category
      ├── tags
      ├── source
      └── ...

/agentLogs       - Log de publicações
  └── {id}
      ├── eventId
      ├── slug
      ├── action
      └── publishedAt

/agentReports    - Relatórios de execução
  └── {id}
      ├── runDate
      ├── eventsFound
      ├── eventsPublished
      └── errors
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Firebase not initialized"
Verifique se as variáveis `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY` estão configuradas.

### Erro: "Permission denied"
Verifique se a conta de serviço do Firebase tem permissão de escrita nas collections.

### Nenhum evento encontrado
- Verifique a conexão com a internet
- As fontes podem estar temporariamente indisponíveis
- Tente aumentar o log com `DEBUG=* npm run scrape`

## 📜 Licença

MIT - Portal LGBTQIA+ Nordeste
