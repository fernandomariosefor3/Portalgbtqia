# 🌱 Seed de Conteúdo (cultura & saúde)

Popula as coleções `culture` e `health_guides` no Firestore a partir do conteúdo
curado dos mocks do site. Use uma vez para "ligar" o conteúdo real; depois disso,
os hooks `useCulture`/`useHealth` passam a servir do Firestore (e não mais do fallback).

## Pré-requisitos

Uma **service account** do Firebase (mesma usada pelo agente de eventos):

1. Firebase Console → ⚙️ **Project Settings** → aba **Service accounts**
2. **Generate new private key** → baixa um JSON
3. No arquivo `.env` do agente (`project-LGBTQIA+/agent/.env`), preencha:

```bash
FIREBASE_PROJECT_ID=portal-lgbtqia
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@portal-lgbtqia.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

> Os valores `client_email` e `private_key` estão dentro do JSON baixado.
> Mantenha as aspas e os `\n` na private key. **Nunca** commite o `.env`.

## Como rodar

```bash
cd project-LGBTQIA+/agent
npm install            # se ainda não instalou

# 1) Confira o que será gravado (NÃO precisa de credenciais):
npm run seed:dry

# 2) Popular tudo (cultura + saúde):
npm run seed

# Opcionais:
npx tsx src/seed/seed-content.ts culture   # só cultura
npx tsx src/seed/seed-content.ts health    # só saúde
```

## Características

- **Idempotente:** o `slug` é usado como ID do documento com `merge: true`.
  Rodar de novo **atualiza** os mesmos documentos (não duplica).
- Cada documento recebe `status: 'published'` e `published_at` (Timestamp),
  exatamente o que os hooks `useCulture`/`useHealth` esperam.
- Atual: **16** itens de cultura e **12** guias de saúde.

## Depois do seed

1. Acesse `/cultura` e `/saude` no site — o conteúdo agora vem do Firestore.
2. Para editar/adicionar conteúdo no futuro, edite os documentos no Firebase Console
   ou rode o seed de novo após atualizar os mocks.
3. As **regras** já permitem leitura pública de itens `published` e escrita só para admin
   (ver `firestore.rules`). Os **índices** necessários estão em `firestore.indexes.json`
   (rode `firebase deploy --only firestore:indexes` se ainda não tiver feito).
