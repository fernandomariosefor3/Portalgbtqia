import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Portal LGBTQIA+
// Configure as variáveis em: Vercel → Settings → Environment Variables
const hasRealApiKey = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

if (import.meta.env.DEV && !hasRealApiKey) {
  console.warn(
    '[firebase] VITE_FIREBASE_API_KEY não está definida. Copie .env.example para .env ' +
    'e preencha com as credenciais do Firebase (Console > Configurações do projeto > Seus apps) ' +
    'para que login e dados reais funcionem em desenvolvimento. ' +
    'Usando uma chave placeholder por enquanto — auth e Firestore vão falhar de forma controlada.'
  );
}

const firebaseConfig = {
  // getAuth() valida o formato da apiKey de forma síncrona e derruba a aplicação inteira
  // se ela estiver ausente; usamos um placeholder para permitir renderizar a UI (com mocks)
  // mesmo sem credenciais reais configuradas localmente.
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || 'local-dev-placeholder-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

export default app;
