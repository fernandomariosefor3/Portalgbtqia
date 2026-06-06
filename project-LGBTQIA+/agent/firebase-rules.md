# Firebase Security Rules - Regras de Segurança do Firestore

## Para configurar no Firebase Console:

### 1. events Collection

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Eventos - leitura pública, escrita apenas pelo agente/admin
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.publishedBy == 'agent';
      allow update, delete: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Agent logs - apenas leitura para admins
    match /agentLogs/{logId} {
      allow read: if request.auth != null;
      allow write: if false; // Apenas via Admin SDK
    }

    // Agent reports - leitura para admins
    match /agentReports/{reportId} {
      allow read: if request.auth != null;
      allow write: if false; // Apenas via Admin SDK
    }

    // Usuários
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId
        || (request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Configuração para Desenvolvimento

No Firebase Console > Firestore > Rules:

1. Acesse Firestore Database > Rules
2. Cole as regras acima
3. Publique

## Permissões Necessárias para o Agente

A conta de serviço do Firebase precisa de:

- Leitura/Escrita na collection `events`
- Leitura/Escrita na collection `agentLogs`
- Leitura/Escrita na collection `agentReports`

Para adicionar no Firebase Console:

1. Firebase Console > Project Settings > Users and permissions
2. Adicione a conta de serviço com papel "Firebase Admin SDK Administrator Service Agent"
