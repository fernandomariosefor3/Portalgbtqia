# 🏳️‍🌈 Portal LGBTQIA+ — Nordeste

Portal digital dedicado a informação, cultura, saúde, direitos e comunidade para pessoas LGBTQIA+ no Brasil, com foco especial na região Nordeste.

**Live:** https://portalgbtqia.vercel.app (preview)  
**Stack:** Vite + React 19 + TypeScript + Tailwind + Firebase + Vercel

---

## ✨ Visão Geral

Um espaço seguro, acessível e representativo que oferece:
- 📰 Artigos e opinião independente
- 🎭 Cultura queer (cinema, séries, música, drag)
- 🏥 Guias de saúde (PrEP/PEP, saúde mental, saúde trans)
- 👨‍👩‍👧‍👦 Apoio familiar
- 📍 Mapa de espaços seguros em Fortaleza
- 🗓️ Calendário de paradas e eventos
- 💬 Fórum e mentoria comunitária

> Documentação completa do produto em [`project-LGBTQIA+/project_plan.md`](./project-LGBTQIA+/project_plan.md)

## 🏗️ Arquitetura

```
[Usuário] → Vercel (Vite React SPA)
                ↓
         Firebase Auth (Google/Email)
                ↓
         Firestore ←→ [Agent Autônomo]
         (articles,    (Node.js + OpenAI
          events,       + Puppeteer)
          users)        ↑ GitHub Actions
                ↓
          Firebase Storage
```

Ver diagrama completo: [`docs/architecture.png`](./docs/architecture.png)

## 🚀 Começando

### Pré-requisitos
- Node.js 20+
- Conta Firebase (projeto `portal-lgbtqia`)
- Vercel CLI (opcional)

### 1. Clone e instale
```bash
git clone https://github.com/fernandomariosefor3/Portalgbtqia.git
cd Portalgbtqia/project-LGBTQIA+
npm install
```

### 2. Configure variáveis de ambiente
```bash
cp .env.example .env.local
```
Edite `.env.local` com suas chaves do Firebase Console > Project Settings:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=portal-lgbtqia.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=portal-lgbtqia
VITE_FIREBASE_STORAGE_BUCKET=portal-lgbtqia.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GOOGLE_MAPS_API_KEY=... # opcional
```

### 3. Rode localmente
```bash
npm run dev
# http://localhost:5173
```

### 4. Build
```bash
npm run build
npm run preview
```

## 🤖 Agent de Eventos

Agente autônomo que busca e publica eventos LGBTQIA+ quinzenalmente.

```bash
cd project-LGBTQIA+/agent
cp .env.example .env
npm install
npm run dev  # modo teste
```

Ver guia completo: [`agent/SETUP_GUIDE.md`](./project-LGBTQIA+/agent/SETUP_GUIDE.md)

## 🔒 Segurança

**IMPORTANTE:** Antes do primeiro deploy:
1. Configure as regras do Firestore:
```bash
firebase deploy --only firestore:rules
```
2. Arquivo de regras: [`firestore.rules`](./firestore.rules)
3. No Firebase Console > Authentication > Authorized domains, adicione apenas:
   - `localhost`
   - `seu-dominio.vercel.app`
   - `portallgbtqia.org` (quando tiver)

Nunca commitar `.env.local` com chaves reais.

## 📁 Estrutura do Projeto

```
Portalgbtqia/
├── project-LGBTQIA+/          # Frontend Vite React
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/            # Páginas por rota
│   │   ├── lib/firebase.ts   # Cliente Firebase
│   │   └── router/           # Rotas
│   ├── agent/                # Agent autônomo
│   └── public/
├── firestore.rules           # Regras de segurança
├── firebase.json             # Config Firebase
└── docs/                     # Documentação
```

## 🗺️ Roadmap

- [x] Fase 2: Artigos & Opinião
- [x] Fase 3: Cultura
- [x] Fase 4: Eventos com IA
- [x] Fase 5.1: Saúde
- [ ] Fase 5.2: Família
- [ ] Fase 6: Guia Fortaleza (mapa)
- [ ] Fase 8: Fórum e Mentoria
- [ ] Fase 9: Autenticação completa
- [ ] Fase 10: Integração Firebase total

Ver detalhes em `project_plan.md`

## 🤝 Como Contribuir

1. Leia o [Código de Conduta](./CODE_OF_CONDUCT.md)
2. Fork o projeto
3. Crie uma branch: `git checkout -b feat/minha-feature`
4. Commit: `git commit -m 'feat: adiciona...'`
5. Push e abra um PR

Precisamos de ajuda em:
- Conteúdo (artigos, guias de saúde)
- Revisão de acessibilidade
- Tradução
- Design inclusivo

## 📄 Licença

MIT — uso livre para projetos comunitários LGBTQIA+

## 💜 Apoio

Este é um projeto comunitário, sem fins lucrativos. Para apoiar:
- Compartilhe com a comunidade
- Contribua com código ou conteúdo
- Reporte bugs via Issues

---

**Feito com orgulho no Nordeste brasileiro** 🌈
