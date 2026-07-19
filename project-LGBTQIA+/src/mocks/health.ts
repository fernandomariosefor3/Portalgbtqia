export interface HealthGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'prep-pep' | 'saude-mental' | 'saude-trans' | 'educacao-sexual' | 'saude-intersexo' | 'saude-lesbica';
  subcategory?: string;
  image: string;
  imageAlt?: string;
  author: string;
  authorPhoto: string;
  authorBio: string;
  readTime: number;
  views: number;
  publishedAt: string;
  reviewedAt?: string;
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
  'saude-intersexo': 'Saúde Intersexo',
  'saude-lesbica': 'Saúde Lésbica',
};

export const categoryColors: Record<HealthGuide['category'], string> = {
  'prep-pep': 'bg-accent-100 text-accent-600',
  'saude-mental': 'bg-primary-100 text-primary-600',
  'saude-trans': 'bg-secondary-100 text-secondary-600',
  'educacao-sexual': 'bg-dark-100 text-dark-600',
  'saude-intersexo': 'bg-primary-50 text-primary-600',
  'saude-lesbica': 'bg-secondary-50 text-secondary-600',
};

export const categoryIcons: Record<HealthGuide['category'], string> = {
  'prep-pep': 'ri-capsule-line',
  'saude-mental': 'ri-mental-health-line',
  'saude-trans': 'ri-user-heart-line',
  'educacao-sexual': 'ri-heart-pulse-line',
  'saude-intersexo': 'ri-body-scan-line',
  'saude-lesbica': 'ri-women-line',
};

export const categoryImages: Record<HealthGuide['category'], string> = {
  'prep-pep': '',
  'saude-mental': '',
  'saude-trans': '',
  'educacao-sexual': '',
  'saude-intersexo': '',
  'saude-lesbica': '',
};

export const categoryDescriptions: Record<HealthGuide['category'], string> = {
  'prep-pep': 'Prevenção combinada, PrEP, PEP, testagem e caminhos de acesso pelo SUS.',
  'saude-mental': 'Acolhimento psicológico, crise, apoio emocional e redes de cuidado afirmativo.',
  'saude-trans': 'Nome social no atendimento, hormonização, acompanhamento multiprofissional e direitos no SUS.',
  'educacao-sexual': 'Consentimento, prevenção de ISTs, testagem regular e cuidado nas relações.',
  'saude-intersexo': 'Cuidado integral, direitos corporais e abordagens não patologizantes para pessoas intersexo.',
  'saude-lesbica': 'Atenção integral e especificidades na prevenção e no acompanhamento ginecológico.',
};

const authorPhoto = `${import.meta.env.BASE_URL}favicon.svg`;

export const allHealthGuides: HealthGuide[] = [
  {
    id: 'health-prep-pep',
    slug: 'prep-pep-prevencao-combinada',
    title: 'PrEP e PEP: prevenção combinada pelo SUS',
    excerpt: 'Compreenda a diferença clínica entre a PrEP e a PEP, saiba quando buscar o serviço de saúde e como manter o acompanhamento seguro com testagem regular.',
    content: `
      <p>A prevenção combinada reúne várias estratégias para reduzir riscos de HIV e outras ISTs. A <strong>PrEP</strong> é usada antes de exposições de risco, de forma planejada e acompanhada por profissional de saúde. A <strong>PEP</strong> é uma urgência: deve ser iniciada o quanto antes, em até 72 horas após uma possível exposição ao HIV.</p>
      <h3>Quando buscar PrEP?</h3>
      <p>Procure uma unidade de referência quando houver exposição frequente ou outras situações de vulnerabilidade. O serviço deve orientar sobre acompanhamento, exames regulares e adaptação sem julgamento.</p>
      <h3>Quando buscar PEP?</h3>
      <p>Busque atendimento imediatamente após relação sem preservativo, rompimento de camisinha ou violência sexual. Quanto mais cedo começar, melhor.</p>
      <h3>Cuidados importantes</h3>
      <p>Esses métodos compõem a prevenção combinada e não eliminam a importância da vacinação (quando indicada) e do rastreio de outras ISTs. O acompanhamento médico é fundamental.</p>
    `,
    category: 'prep-pep',
    image: categoryImages['prep-pep'],
    imageAlt: 'Ilustração de frasco de comprimidos simbolizando prevenção',
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 5,
    views: 0,
    publishedAt: '2025-07-09',
    reviewedAt: '2026-07-19',
    featured: true,
    tags: ['prevenção combinada', 'saúde sexual', 'PrEP', 'PEP'],
    sources: ['Disque Saúde 136', 'Ministério da Saúde - CTA'],
    faqs: [
      {
        question: 'PEP pode ser tomada depois de 72 horas?',
        answer: 'O protocolo clínico estabelece o início da PEP em até 72 horas para eficácia. Mesmo após o prazo, procure serviço de saúde para avaliação e testagem geral.',
      },
    ],
  },
  {
    id: 'health-mental',
    slug: 'saude-mental-e-apoio-emocional',
    title: 'Saúde mental LGBTQIA+: sinais de alerta e apoio',
    excerpt: 'Aprenda a reconhecer sinais de sofrimento emocional prolongado, saiba onde buscar redes de apoio profissional e compreenda o valor do cuidado afirmativo.',
    content: `
      <p>A saúde mental da população LGBTQIA+ deve ser compreendida em seu contexto social. O sofrimento emocional frequentemente decorre de fatores externos como estresse de minoria, discriminação e rejeição, e não da identidade da pessoa.</p>
      <h3>Sinais de alerta</h3>
      <p>Episódios de tristeza profunda e persistente, ansiedade intensa, autolesão, mudanças bruscas de humor ou pensamentos de morte exigem avaliação de um profissional. Nunca ignore esses sinais.</p>
      <h3>Onde buscar ajuda</h3>
      <p>A rede pública (como os CAPS) e os serviços universitários de psicologia oferecem acolhimento gratuito. Para momentos de crise aguda e apoio imediato, o Centro de Valorização da Vida (CVV) atende 24h pelo número 188.</p>
    `,
    category: 'saude-mental',
    image: categoryImages['saude-mental'],
    imageAlt: 'Símbolo gráfico de acolhimento e escuta ativa',
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 4,
    views: 0,
    publishedAt: '2025-07-09',
    reviewedAt: '2026-07-19',
    featured: true,
    tags: ['saúde mental', 'psicologia', 'CVV', 'apoio emocional'],
    sources: ['CVV 188', 'Rede SUS'],
  },
  {
    id: 'health-trans',
    slug: 'saude-trans-atendimento-respeitoso',
    title: 'Saúde trans: terapia de afirmação e direitos no SUS',
    excerpt: 'Diretrizes gerais sobre o direito ao nome social, acolhimento integral, terapia afirmativa de gênero e as etapas para o acesso à rede pública de saúde.',
    content: `
      <p>Pessoas trans e travestis têm o direito garantido ao atendimento humanizado e livre de discriminação. O uso do nome social é obrigatório em todos os serviços do SUS, independentemente de retificação civil.</p>
      <h3>Terapia de Afirmação de Gênero</h3>
      <p>O processo transexualizador no SUS inclui apoio psicológico, fonoterapia, endocrinologia e procedimentos cirúrgicos, quando indicados. A hormonização deve ser sempre orientada e acompanhada por profissionais de saúde, pois doses e respostas corporais variam. Decisões clínicas são individualizadas e dependem exclusivamente da avaliação conjunta entre paciente e equipe.</p>
      <h3>Se houver discriminação</h3>
      <p>Registre data, local, nome dos profissionais envolvidos e número de protocolo. Denúncias podem ser formalizadas na Ouvidoria do SUS e acompanhadas pela Defensoria Pública.</p>
    `,
    category: 'saude-trans',
    image: categoryImages['saude-trans'],
    imageAlt: 'Ilustração com símbolos da diversidade trans e saúde',
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 5,
    views: 0,
    publishedAt: '2025-07-09',
    reviewedAt: '2026-07-19',
    featured: false,
    tags: ['saúde trans', 'afirmação de gênero', 'nome social', 'SUS'],
    sources: ['Ouvidoria do SUS', 'Ministério da Saúde - Saúde Trans'],
  },
  {
    id: 'health-sexual',
    slug: 'consentimento-testagem-e-prevencao',
    title: 'Consentimento, testagem e prevenção de ISTs',
    excerpt: 'Um guia prático sobre autonomia corporal nas relações íntimas, estratégias de prevenção combinada e a rotina recomendada para testagem de infecções.',
    content: `
      <p>A saúde sexual saudável começa com a comunicação aberta. O consentimento precisa ser contínuo e respeitado em todos os momentos, sem pressões ou presunções.</p>
      <h3>Estratégias de prevenção</h3>
      <p>A testagem regular, o uso de preservativos internos ou externos, a vacinação e a profilaxia (PrEP/PEP) são as bases da prevenção combinada. Conhecer seu próprio corpo e dialogar com parcerias reforça a segurança de todos os envolvidos.</p>
      <h3>Rotina de testagem</h3>
      <p>Exames rápidos para HIV, sífilis e hepatites B e C estão disponíveis gratuitamente na rede pública. O intervalo da testagem deve ser alinhado com o profissional de saúde, dependendo do perfil de exposições.</p>
    `,
    category: 'educacao-sexual',
    image: categoryImages['educacao-sexual'],
    imageAlt: 'Ilustração representativa de diálogo e cuidado mútuo',
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 4,
    views: 0,
    publishedAt: '2025-07-09',
    reviewedAt: '2026-07-19',
    featured: false,
    tags: ['saúde sexual', 'testagem regular', 'prevenção', 'consentimento'],
    sources: ['CTA/SAE', 'Disque Saúde 136'],
  },
  {
    id: 'health-intersex',
    slug: 'saude-intersexo-cuidado-integral',
    title: 'Saúde intersexo: cuidado integral e autonomia corporal',
    excerpt: 'Esclarecimentos fundamentais sobre as variações intersexo e a necessidade de preservar a autonomia corporal de bebês, crianças e adultos.',
    content: `
      <p>Variações das características sexuais (intersexo) são desenvolvimentos naturais do corpo humano e não devem ser tratadas automaticamente como doenças ou emergências cirúrgicas. O direito fundamental de uma pessoa intersexo é o de manter a integridade física de seu corpo intacta até que possua idade para compreender e tomar decisões autônomas, caso deseje intervir.</p>
      <h3>Abordagem Médica Afirmativa</h3>
      <p>O foco da atenção à saúde deve ser no bem-estar fisiológico e psicológico, evitando cirurgias cosméticas infantis de "normalização". Apenas intervenções motivadas por necessidades estritamente clínicas e de preservação de vida devem ocorrer na primeira infância.</p>
      <h3>Rede de Apoio</h3>
      <p>O suporte multiprofissional contínuo e a troca de informações transparentes e precisas com familiares evitam traumas médicos e asseguram a construção saudável do desenvolvimento psicossocial do paciente.</p>
    `,
    category: 'saude-intersexo',
    image: categoryImages['saude-intersexo'],
    imageAlt: 'Símbolo intersexo em ilustração vetorial simples',
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 5,
    views: 0,
    publishedAt: '2025-07-09',
    reviewedAt: '2026-07-19',
    featured: false,
    tags: ['pessoas intersexo', 'autonomia corporal', 'direitos na saúde'],
    sources: ['ABRAI - Associação Brasileira Intersexo'],
  },
  {
    id: 'health-lesbica',
    slug: 'saude-lesbica-prevencao-ginecolociga',
    title: 'Saúde da mulher lésbica: prevenção e acompanhamento',
    excerpt: 'Orientações práticas para o acompanhamento ginecológico, incluindo dicas de prevenção de ISTs e desmistificação de cuidados essenciais.',
    content: `
      <p>A atenção integral à saúde de mulheres lésbicas frequentemente sofre com mitos em consultórios médicos. O acompanhamento ginecológico regular, que inclui o rastreamento do câncer de colo de útero (Papanicolau) e prevenção do câncer de mama, é indicado para todas, independentemente de estarem em relacionamentos com pessoas com pênis.</p>
      <h3>Prevenção de ISTs</h3>
      <p>Infecções sexualmente transmissíveis podem ser transmitidas por contato pele a pele ou através do compartilhamento de objetos pessoais durante as relações sexuais. A higienização adequada de brinquedos e o uso de barreiras de proteção são métodos eficazes de prevenção.</p>
      <h3>Atendimento sem preconceito</h3>
      <p>É importante que a paciente encontre um ambiente acolhedor, onde possa relatar com naturalidade suas práticas sexuais ao ginecologista, possibilitando que as abordagens preventivas e de acompanhamento sejam efetivas e ajustadas à sua realidade.</p>
    `,
    category: 'saude-lesbica',
    image: categoryImages['saude-lesbica'],
    imageAlt: 'Ilustração minimalista de saúde e cuidado preventivo feminino',
    author: 'Portal LGBTQ+ Nordeste',
    authorPhoto,
    authorBio: 'Conteúdo informativo de saúde e cidadania do Portal LGBTQ+ Nordeste.',
    readTime: 4,
    views: 0,
    publishedAt: '2025-07-09',
    reviewedAt: '2026-07-19',
    featured: false,
    tags: ['saúde da mulher', 'mulheres lésbicas', 'prevenção ginecológica', 'cuidado'],
    sources: ['Rede SUS', 'Políticas para Saúde da Mulher'],
  }
];
