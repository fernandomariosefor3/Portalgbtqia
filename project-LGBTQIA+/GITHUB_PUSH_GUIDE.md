# Push para GitHub e Configuração de APIs

## 1. Push Manual para GitHub

Execute estes comandos no seu terminal local:

```bash
# Entrar na pasta do projeto
cd Portalgbtqia

# Verificar status
git status

# Adicionar arquivos do agente
git add agent/src/scrapers/google.ts
git add agent/src/scrapers/manager.ts
git add agent/src/types.ts
git add agent/src/scrapers/instagram.ts
git add agent/src/scrapers/meetup.ts
git add agent/src/run-agent.ts
git add agent/src/scrapers-only.ts
git add agent/README.md
git add agent/package.json
git add agent/SETUP_GUIDE.md

# Commit
git commit -m "feat(agent): add autonomous LGBTQIA+ event agent with 6 scrapers"

# Push
git push origin main
```

---

## 2. Guia Completo das APIs Necessárias

### 2.1 Firebase (OBRIGATÓRIO - Já configurado)

**Status:** ✅ Configurado no projeto `portal-lgbtqia`

O Firebase já está configurado com:
- **Projeto:** portal-lgbtqia
- **URL:** https://portal-lgbtqia.firebaseapp.com

**Para publicar eventos, você precisa da chave privada do Admin SDK:**

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `portal-lgbtqia`
3. Vá em **Configurações > Contas de Serviço**
4. Clique em **Gerar nova chave privada**
5. Copie o arquivo JSON

**No `.env` do agente, configure:**
```env
FIREBASE_PROJECT_ID=portal-lgbtqia
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@portal-lgbtqia.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
```

---

### 2.2 OpenAI (OPCIONAL)

**Status:** ⚠️ Opcional - Melhora categorização de eventos

**Passos para obter:**
1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Faça login ou crie conta
3. Clique em **Create new secret key**
4. Copie a chave (começa com `sk-`)

**No `.env` do agente:**
```env
OPENAI_API_KEY=sk-your_openai_api_key
```

**Custo:** ~$0.002 por evento processado (muito barato)

---

### 2.3 Meta (Facebook/Instagram API) - PARA FUTURO

**Status:** ⚠️ Necessário para Instagram/Facebook funcionarem 100%

**Passos para obter:**

#### Opção A: Meta for Developers
1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Clique em **Meus Apps** > **Criar App**
3. Selecione **Consumer** ou **Business**
4. Adicione produto: **Instagram Graph API** ou **Facebook Graph API**

#### Configuração:
```env
META_APP_ID=seu_app_id
META_APP_SECRET=seu_app_secret
META_ACCESS_TOKEN=seu_access_token
INSTAGRAM_ACCESS_TOKEN=seu_instagram_token
```

#### Obter Access Token:
1. Acesse [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecione seu app
3. Conceda permissões: `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`
4. Gere token

**Custo:** Gratuito para desenvolvimento

---

### 2.4 Eventbrite API - PARA FUTURO

**Status:** ⚠️ Necessário para Eventbrite funcionar 100%

**Passos:**
1. Acesse [eventbrite.com/developers](https://www.eventbrite.com/developers/)
2. Crie uma conta de desenvolvedor
3. Crie um app privado
4. Obtenha API Key em **Configurações > API Keys**

```env
EVENTBRITE_API_KEY=sua_api_key
EVENTBRITE_ORGANIZATION_ID=seu_org_id
```

**Documentação:** https://www.eventbrite.com/platform/api

**Custo:** Gratuito para busca básica

---

### 2.5 Sympla API - PARA FUTURO

**Status:** ⚠️ Acesso limitado

**Nota:** Sympla não tem API pública documentada. Para usar, você precisa:
1. Entrar em contato com a equipe Sympla
2. Solicitar acesso à API como parceiro
3. Negociar termos de uso

**Alternativa:** Implementar webhook próprio no Sympla (se disponível)

---

### 2.6 Meetup API - PARA FUTURO

**Status:** ⚠️ Meetup agora é pago

**Passos:**
1. Acesse [Meetup Pro](https://meetup.com/pro/)
2. Crie conta e grupo
3. Acesse **Configurações > API**
4. Obtenha API Key

```env
MEETUP_API_KEY=sua_api_key
MEETUP_GROUP_URL=seu_grupo
```

**Nota:** A API do Meetup agora requer assinatura Pro

---

## 3. Resumo: Prioridade de Configuração

| API | Prioridade | Status | Custo |
|-----|------------|--------|-------|
| Firebase | **ALTA** | ✅ Configurado | Gratuito (Spark Plan) |
| OpenAI | Média | ⚠️ Opcional | ~$0.002/evento |
| Meta | Baixa | ⚠️ Para Instagram/Facebook | Gratuito |
| Eventbrite | Baixa | ⚠️ Para Eventbrite | Gratuito |
| Sympla | Baixa | ⚠️ Requer contato | Desconhecido |
| Meetup | Baixa | ⚠️ Requer Pro | Pago |

---

## 4. Configuração Atual do Agente

### Sem APIs adicionais, o agente funciona com:
- ✅ **Google Search** - Busca na web (pode ter rate limiting)
- ✅ **Eventbrite** - Scraper básico (pode ser bloqueado)
- ✅ **Sympla** - Scraper básico (pode ser bloqueado)
- ✅ **Facebook** - Scraper básico (pode ser bloqueado)
- ✅ **Instagram** - Scraper básico (pode ser bloqueado)
- ✅ **Meetup** - Scraper básico (pode ser bloqueado)

### Para funcionar 100%, adicione:
- Firebase Admin SDK (já tem projeto)
- OpenAI API (opcional, para melhor categorização)

---

## 5. Variáveis de Ambiente Completas (.env)

```env
# Firebase Admin SDK (OBRIGATÓRIO)
FIREBASE_PROJECT_ID=portal-lgbtqia
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@portal-lgbtqia.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"

# OpenAI (OPCIONAL - recomendado)
OPENAI_API_KEY=sk-your_openai_api_key

# Configurações do Agente
CITY_FOCUS=Fortaleza
STATE_FOCUS=CE
EVENTS_LIMIT_PER_WEEK=10
SCRAPE_FREQUENCY_DAYS=7

# Meta API (FUTURO)
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
INSTAGRAM_ACCESS_TOKEN=

# Eventbrite (FUTURO)
EVENTBRITE_API_KEY=
EVENTBRITE_ORGANIZATION_ID=

# Meetup (FUTURO)
MEETUP_API_KEY=
MEETUP_GROUP_URL=
```

---

## 6. Próximos Passos

1. **Push no GitHub:** Execute os comandos na seção 1
2. **Configurar Firebase:** Cole a chave privada no `.env`
3. **Testar agente:** `cd agent && npm run test-scrape`
4. **Executar completo:** `npm run start`
5. **O agente publicará automaticamente toda segunda-feira**

---

## 7. Suporte

Se precisar de ajuda com alguma API, consulte:
- Firebase: https://firebase.google.com/docs/admin
- OpenAI: https://platform.openai.com/docs
- Meta: https://developers.facebook.com/docs
- Eventbrite: https://www.eventbrite.com/platform