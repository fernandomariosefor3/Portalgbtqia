import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockOpportunities = [
  {
    title: 'Desenvolvedor(a) Front-end Pleno',
    organization: 'Tech Para Todes',
    state: 'CE',
    category: 'Vaga',
    verified: false,
    deadline: '2026-08-30',
    description: 'Vaga afirmativa para pessoas trans. Trabalho remoto, mas com base e contratação no Ceará.',
    status: 'aberto',
    created_at: serverTimestamp()
  },
  {
    title: 'Cozinha da Bixa',
    organization: 'Restaurante / Delivery',
    state: 'PE',
    category: 'Empreendedor',
    verified: false,
    deadline: null,
    description: 'Comida regional pernambucana feita com afeto. Empreendimento focado em contratar pessoas LGBTQIA+ em vulnerabilidade.',
    status: 'aberto',
    created_at: serverTimestamp()
  },
  {
    title: 'Fundo Elas+',
    organization: 'Instituto Elas',
    state: 'BA',
    category: 'Edital',
    verified: false,
    deadline: '2026-09-15',
    description: 'Edital para financiamento de coletivos de mulheres lésbicas e bissexuais no Nordeste.',
    status: 'aberto',
    created_at: serverTimestamp()
  }
];

const mockObservatory = [
  { indicator_name: 'denuncias_estado', state: 'CE', value: 1240, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'denuncias_estado', state: 'BA', value: 1105, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'denuncias_estado', state: 'PE', value: 980, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'denuncias_estado', state: 'PB', value: 450, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'denuncias_estado', state: 'RN', value: 380, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'denuncias_estado', state: 'MA', value: 310, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'denuncias_estado', state: 'AL', value: 290, year: 2025, source_name: 'Disque 100' },
  
  { indicator_name: 'violacoes_categoria', state: 'Discriminação em serviço público', value: 35, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'violacoes_categoria', state: 'Violência física/ameaça', value: 28, year: 2025, source_name: 'Disque 100' },
  { indicator_name: 'violacoes_categoria', state: 'Discriminação no trabalho', value: 20, year: 2025, source_name: 'Disque 100' }
];

const mockFarol = [
  {
    intent: 'buscar_prep',
    keywords: ['prep', 'profilaxia', 'comprimido', 'hiv', 'pep', 'prevenção'],
    response_template: '**PrEP** (Profilaxia Pré-Exposição) é um método de prevenção à infecção pelo HIV. Você toma um comprimido antes da exposição.\n\n**Onde encontrar:** Você pode consultar a disponibilidade no posto de saúde mais próximo ou através da nossa página de Mapa do Acolhimento.',
    official_source_name: 'Ministério da Saúde (2025)',
    official_source_url: 'https://www.gov.br/saude'
  },
  {
    intent: 'denunciar_trabalho',
    keywords: ['discriminação', 'trabalho', 'demitido', 'prova', 'chefe', 'empresa'],
    response_template: 'A discriminação por orientação sexual e identidade de gênero no ambiente de trabalho é crime de racismo (decisão do STF). \n\n**O que guardar como prova:** \n- Prints de conversas (WhatsApp, E-mail, Slack)\n- E-mails institucionais\n- Testemunhas (colegas que presenciaram)\n\n*Nota: Não sou advogado. Procure a Defensoria Pública para aconselhamento jurídico individual.*',
    official_source_name: 'Supremo Tribunal Federal',
  }
];

async function seed() {
  console.log('Iniciando o seeding de dados no Firebase...');
  
  try {
    for (const item of mockOpportunities) {
      await addDoc(collection(db, 'opportunities'), item);
      console.log('Adicionada oportunidade:', item.title);
    }
    
    for (const item of mockObservatory) {
      await addDoc(collection(db, 'observatory_metrics'), item);
      console.log('Adicionada metrica do observatorio:', item.state);
    }
    
    for (const item of mockFarol) {
      await addDoc(collection(db, 'farol_knowledge'), item);
      console.log('Adicionada regra do Farol:', item.intent);
    }
    
    console.log('✅ Seeding concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao salvar dados:', error);
    process.exit(1);
  }
}

seed();
