export interface HealthGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'prep-pep' | 'saude-mental' | 'saude-trans' | 'educacao-sexual';
  subcategory?: string;
  image: string;
  author: string;
  authorPhoto: string;
  authorBio: string;
  readTime: number;
  views: number;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  sources?: string[];
  faqs?: { question: string; answer: string }[];
}

export const categoryLabels: Record<HealthGuide['category'], string> = {
  'prep-pep': 'PrEP/PEP',
  'saude-mental': 'Saúde Mental',
  'saude-trans': 'Saúde Trans',
  'educacao-sexual': 'Educação Sexual',
};

export const categoryColors: Record<HealthGuide['category'], string> = {
  'prep-pep': 'bg-accent-100 text-accent-600',
  'saude-mental': 'bg-primary-100 text-primary-600',
  'saude-trans': 'bg-secondary-100 text-secondary-600',
  'educacao-sexual': 'bg-dark-100 text-dark-600',
};

export const categoryIcons: Record<HealthGuide['category'], string> = {
  'prep-pep': 'ri-capsule-line',
  'saude-mental': 'ri-mental-health-line',
  'saude-trans': 'ri-user-heart-line',
  'educacao-sexual': 'ri-heart-pulse-line',
};

export const categoryImages: Record<HealthGuide['category'], string> = {
  'prep-pep':
    'https://readdy.ai/api/search-image?query=welcoming%20public%20health%20clinic%20consultation%20diverse%20lgbtqia%20adults%20soft%20natural%20light%20documentary%20photography%20clean%20modern%20brazil&width=1200&height=720&seq=health-prep-pep-photo&orientation=landscape',
  'saude-mental':
    'https://readdy.ai/api/search-image?query=affirmative%20mental%20health%20therapy%20session%20diverse%20lgbtqia%20people%20warm%20calm%20room%20professional%20documentary%20photography&width=1200&height=720&seq=health-mental-photo&orientation=landscape',
  'saude-trans':
    'https://readdy.ai/api/search-image?query=respectful%20trans%20healthcare%20consultation%20doctor%20and%20trans%20patient%20inclusive%20clinic%20warm%20editorial%20photography%20brazil&width=1200&height=720&seq=health-trans-photo&orientation=landscape',
  'educacao-sexual':
    'https://readdy.ai/api/search-image?query=inclusive%20sexual%20health%20education%20workshop%20diverse%20young%20adults%20community%20center%20warm%20documentary%20photography&width=1200&height=720&seq=health-sexual-photo&orientation=landscape',
};

export const categoryDescriptions: Record<HealthGuide['category'], string> = {
  'prep-pep': 'Prevenção combinada, PrEP, PEP, testagem e caminhos de acesso pelo SUS.',
  'saude-mental': 'Acolhimento psicológico, crise, apoio emocional e redes de cuidado afirmativo.',
  'saude-trans': 'Nome social no atendimento, hormonização, acompanhamento multiprofissional e direitos no SUS.',
  'educacao-sexual': 'Consentimento, prevenção de ISTs, testagem regular e cuidado nas relações.',
};

const authorPhoto = `${import.meta.env.BASE_URL}favicon.svg`;

export const allHealthGuides: HealthGuide[] = [
  {
    id: 'health-prep-pep',
    slug: 'prep-pep-prevencao-combinada',
    title: 'PrEP e PEP: prevenção combinada pelo SUS',
    excerpt:
      'Entenda a diferença entre PrEP e PEP, quando procurar atendimento e quais cuidados manter junto com testagem regular.',
    content: `
      <p>A prevenção combinada reúne várias estratégias para reduzir riscos de HIV e outras ISTs. A <strong>PrEP</strong> é usada antes de exposições de risco, de forma planejada e acompanhada por profissional de saúde. A <strong>PEP</strong> é uma urgência: deve ser iniciada o quanto antes, em até 72 horas após uma possível exposição ao HIV.</p>
      <h3>Quando buscar PrEP?</h3>
      <p>Procure uma unidade de referência quando houver exposição frequente, parceiro com HIV, dificuldade de uso regular de preservativo ou outras situações de vulnerabilidade. O serviço deve orientar sem julgamento.</p>
      <h3>Quando buscar PEP?</h3>
      <p>Busque atendimento imediatamente após relação sem preservativo, rompimento de camisinha, violência sexual ou outro contato de risco. Quanto mais cedo começar, melhor.</p>
      <h3>Cuidados importantes</h3>
      <p>PrEP e PEP não substituem testagem, preservativo e vacinação quando indicada. Acompanhamento médico é essencial.</p>
    `,
    category: 'prep-pep',
    image: categoryImages['prep-pep'],
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 5,
    views: 0,
    publishedAt: '2026-07-09',
    featured: true,
    tags: ['PrEP', 'PEP', 'HIV', 'SUS', 'testagem'],
    sources: ['Disque Saúde 136', 'Serviços locais de CTA/SAE'],
    faqs: [
      {
        question: 'PEP pode ser tomada depois de 72 horas?',
        answer: 'Em regra, a PEP deve ser iniciada em até 72 horas. Mesmo depois desse prazo, procure serviço de saúde para avaliação e testagem.',
      },
    ],
  },
  {
    id: 'health-mental',
    slug: 'saude-mental-e-apoio-emocional',
    title: 'Saúde mental LGBTQIA+: sinais de alerta e apoio',
    excerpt:
      'Como reconhecer sofrimento emocional, onde buscar apoio e por que acolhimento afirmativo faz diferença.',
    content: `
      <p>Saúde mental LGBTQIA+ precisa ser tratada com cuidado, sem patologizar identidade ou orientação sexual. Sofrimento emocional pode ser agravado por rejeição familiar, violência, isolamento e discriminação.</p>
      <h3>Sinais de alerta</h3>
      <p>Tristeza persistente, ansiedade intensa, isolamento, autolesão, abuso de álcool ou drogas e pensamentos suicidas exigem atenção. Em crise, procure ajuda imediatamente.</p>
      <h3>Onde buscar ajuda</h3>
      <p>CAPS, UBS, serviços universitários, psicólogos afirmativos, ONGs e redes de apoio comunitário podem ser pontos de cuidado. O CVV atende 24h pelo 188.</p>
    `,
    category: 'saude-mental',
    image: categoryImages['saude-mental'],
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 4,
    views: 0,
    publishedAt: '2026-07-09',
    featured: true,
    tags: ['saúde mental', 'CVV', 'acolhimento', 'CAPS'],
    sources: ['CVV 188', 'Rede SUS'],
  },
  {
    id: 'health-trans',
    slug: 'saude-trans-atendimento-respeitoso',
    title: 'Saúde trans: atendimento respeitoso e caminhos no SUS',
    excerpt:
      'Nome social, acolhimento, hormonização e direitos básicos no atendimento de saúde para pessoas trans e travestis.',
    content: `
      <p>Pessoas trans e travestis têm direito a atendimento digno, sigiloso e respeitoso. O uso do nome social deve ser observado nos cadastros e na chamada para atendimento.</p>
      <h3>Acompanhamento em saúde</h3>
      <p>O cuidado pode envolver clínica geral, endocrinologia, psicologia, assistência social e outros serviços conforme necessidade. A automedicação hormonal traz riscos e deve ser evitada.</p>
      <h3>Se houver discriminação</h3>
      <p>Anote data, local, nome do serviço e, se possível, protocolo. Procure a Ouvidoria do SUS, Defensoria Pública ou entidades de direitos humanos.</p>
    `,
    category: 'saude-trans',
    image: categoryImages['saude-trans'],
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 5,
    views: 0,
    publishedAt: '2026-07-09',
    featured: false,
    tags: ['saúde trans', 'nome social', 'SUS', 'hormonização'],
    sources: ['Ouvidoria do SUS', 'Defensoria Pública'],
  },
  {
    id: 'health-sexual',
    slug: 'consentimento-testagem-e-prevencao',
    title: 'Consentimento, testagem e prevenção de ISTs',
    excerpt:
      'Saúde sexual envolve autonomia, comunicação, testagem regular, prevenção e respeito aos limites de cada pessoa.',
    content: `
      <p>Consentimento precisa ser livre, informado, específico e contínuo. Em relações afetivas e sexuais, conversar sobre limites, prevenção e testagem é parte do cuidado.</p>
      <h3>Prevenção combinada</h3>
      <p>Preservativos, PrEP, PEP, vacinação, testagem e tratamento adequado formam uma rede de proteção. Nenhuma estratégia sozinha responde a todas as situações.</p>
      <h3>Testagem</h3>
      <p>CTAs, UBS e campanhas de saúde oferecem testagem para HIV, sífilis e hepatites. Pessoas com múltiplos parceiros ou em maior vulnerabilidade devem testar com mais regularidade.</p>
    `,
    category: 'educacao-sexual',
    image: categoryImages['educacao-sexual'],
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 4,
    views: 0,
    publishedAt: '2026-07-09',
    featured: false,
    tags: ['consentimento', 'ISTs', 'testagem', 'prevenção'],
    sources: ['CTA', 'Disque Saúde 136'],
  },
];
