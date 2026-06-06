# Guia de Configuração do Agente de Eventos LGBTQIA+

## Configuração Rápida

### 1. Variáveis de Ambiente

O arquivo `.env` do agente já está configurado com:

```env
# Firebase (obrigatório para publicação)
FIREBASE_PROJECT_ID=portal-lgbtqia
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@portal-lgbtqia.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="sua_chave_aqui"

# OpenAI (opcional - para enriquecimento com IA)
OPENAI_API_KEY=sk-... (opcional)

# Configurações do Agente
CITY_FOCUS=Fortaleza
STATE_FOCUS=CE
EVENTS_LIMIT_PER_WEEK=10
```

### 2. Firebase Setup (Obrigatório)

Para publicar eventos, você precisa configurar o Firebase:

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `portal-lgbtqia`
3. Vá em **Configurações do Projeto > Contas de Serviço**
4. Clique em **Gerar nova chave privada**
5. Copie o conteúdo JSON e formate para `.env`:
   - `FIREBASE_PROJECT_ID` = project_id
   - `FIREBASE_CLIENT_EMAIL` = client_email
   - `FIREBASE_PRIVATE_KEY` = private_key (com `\n` entre as linhas)

### 3. Executar o Agente

```bash
# Entrar na pasta
cd /workspace/Portalgbtqia/project-LGBTQIA+/agent

# Apenas buscar eventos (sem publicar)
npm run test-scrape

# Executar completo (buscar + processar + publicar)
npm run start
```

### 4. Cron Job (Execução Automática)

O agente está configurado para executar automaticamente:
- **Quando**: Toda segunda-feira às 11:00
- **O que faz**: Busca até 10 eventos LGBTQIA+ em Fortaleza e publica no Firebase

Para verificar/modificar, vá para o dashboard de tarefas agendadas.

## Fontes de Dados

### Status dos Scrapers:

| Fonte | Status | Notas |
|-------|--------|-------|
| Google Search | ✅ Funcionando | Rate limiting pode ocorrer |
| Eventbrite | ⚠️ Bloqueado | Retorna 405 - requer API oficial |
| Sympla | ⚠️ Bloqueado | Retorna 403 - requer API oficial |
| Facebook | ⚠️ Bloqueado | Retorna 400 - requer API oficial |
| Instagram | ⚠️ Sem token | Necessita Meta API access token |
| Meetup | ⚠️ Testando | Pode funcionar com rate limiting |

### Para Funcionar 100%:

1. **Eventbrite**: Registrar em https://eventbrite.com/developers
2. **Sympla**: Contactar Sympla para acesso à API
3. **Facebook**: Criar app em https://developers.facebook.com
4. **Instagram**: Criar app em https://developers.facebook.com

## Estrutura do Firestore

O agente publica eventos na seguinte estrutura:

```
/events/{eventId}
  - title: string
  - slug: string
  - description: string
  - shortDescription: string
  - category: "parada" | "festa" | "cultura" | "saude" | "educacao" | "visibilidade" | "encontro"
  - location: string
  - address: string
  - city: "Fortaleza"
  - state: "CE"
  - startDate: string (ISO)
  - endDate: string (ISO)
  - startTime: string
  - endTime: string
  - imageUrl: string
  - sourceUrl: string
  - source: string
  - status: "approved" | "pending" | "published"
  - tags: string[]
  - organizer: string
  - priceInfo: string
  - createdAt: timestamp
  - publishedBy: "agent"
```

## Troubleshooting

### "Variáveis de ambiente do Firebase não configuradas"
- Verifique se o arquivo `.env` existe
- Verifique se `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY` estão configurados

### "Nenhum evento encontrado"
- Verifique a conexão com a internet
- As fontes podem estar temporariamente indisponíveis
- Tente aumentar o delay entre requisições

### Erro 403/405/400 nas fontes
- As plataformas bloqueiam scraping direto
- Para produção, use as APIs oficiais

## Comandos Úteis

```bash
# Testar scraping
npm run test-scrape

# Executar completo
npm run start

# Apenas buscar (CLI)
npm run scrape

# Build para produção
npm run build
```