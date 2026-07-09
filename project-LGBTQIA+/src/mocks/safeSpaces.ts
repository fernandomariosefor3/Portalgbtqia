export type SafeSpaceCategory =
  | 'Bar & Entretenimento'
  | 'Centro Cultural'
  | 'ONG & Acolhimento'
  | 'Saúde'
  | 'Serviços Públicos'
  | 'Hospedagem'
  | 'Educação'
  | 'Comércio'
  | 'Trabalho';

export interface SafeSpace {
  id: string;
  slug: string;
  name: string;
  category: SafeSpaceCategory;
  address: string;
  city: string;
  state: string;
  description: string;
  image: string;
  tags: string[];
  badges: string[];
  rating: number;
  reviews: number;
  price?: '$' | '$$' | '$$$' | '$$$$';
  phone?: string;
  website?: string;
  mapUrl?: string;
  status: 'published' | 'hidden';
  source: 'static' | 'admin';
}

export const safeSpaceCategories: SafeSpaceCategory[] = [
  'Bar & Entretenimento',
  'Centro Cultural',
  'ONG & Acolhimento',
  'Saúde',
  'Serviços Públicos',
  'Hospedagem',
  'Educação',
  'Comércio',
  'Trabalho',
];

export const badgeLabels: Record<string, string> = {
  geral: 'Espaço seguro',
  gay: 'Gay friendly',
  trans: 'Seguro para pessoas trans',
  mental: 'Saúde mental',
  drag: 'Drag friendly',
  familia: 'Seguro para famílias',
  acessivel: 'Acessível',
  precos: 'Preços acessíveis',
  comunidade: 'Comunidade',
  cultura: 'Cultura',
  sus: 'SUS',
};

export const safeSpaceCategoryImages: Record<SafeSpaceCategory, string> = {
  'Bar & Entretenimento': `${import.meta.env.BASE_URL}guide/nightlife.svg`,
  'Centro Cultural': `${import.meta.env.BASE_URL}guide/culture.svg`,
  'ONG & Acolhimento': `${import.meta.env.BASE_URL}guide/community.svg`,
  Saúde: `${import.meta.env.BASE_URL}guide/health.svg`,
  'Serviços Públicos': `${import.meta.env.BASE_URL}guide/rights.svg`,
  Hospedagem: `${import.meta.env.BASE_URL}guide/tourism.svg`,
  Educação: `${import.meta.env.BASE_URL}guide/culture.svg`,
  Comércio: `${import.meta.env.BASE_URL}guide/community.svg`,
  Trabalho: `${import.meta.env.BASE_URL}guide/rights.svg`,
};

export const guideHeroImage = `${import.meta.env.BASE_URL}guide/hero.svg`;

export const staticSafeSpaces: SafeSpace[] = [
  {
    id: 'static-gandaia',
    slug: 'gandaia-bar-club',
    name: 'Gandaia Bar & Club',
    category: 'Bar & Entretenimento',
    address: 'Rua Dragão do Mar — Praia de Iracema',
    city: 'Fortaleza',
    state: 'CE',
    description:
      "Casa de festas LGBTQIA+ em casarões históricos da Praia de Iracema. Três ambientes, duas pistas internas e bar externo. Programação com pop, brasilidades e house.",
    tags: ['Noite', 'Festas', 'DJs'],
    badges: ['geral', 'gay', 'drag'],
    rating: 4.7,
    reviews: 23,
    price: '$$',
    image: safeSpaceCategoryImages['Bar & Entretenimento'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gandaia%20Bar%20Club%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-yall',
    slug: 'yall-club',
    name: "Y'all Club",
    category: 'Bar & Entretenimento',
    address: 'Rua Dragão do Mar — Praia de Iracema',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'Balada pop e eletrônica na Praia de Iracema. DJs residentes, festas temáticas de funk e pop nacional. Público jovem e vibrante que movimenta os finais de semana.',
    tags: ['Noite', 'Pop', 'Funk'],
    badges: ['geral', 'gay', 'precos'],
    rating: 4.5,
    reviews: 18,
    price: '$$',
    image: safeSpaceCategoryImages['Bar & Entretenimento'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yall%20Club%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-morenos',
    slug: 'morenos-bar-divino-domingos',
    name: "Moreno's Bar — Divino Domingos",
    category: 'Bar & Entretenimento',
    address: 'Benfica — Fortaleza, CE',
    city: 'Fortaleza',
    state: 'CE',
    description:
      "Projeto 'Divino Domingos' mantém viva a cultura drag e transformista tradicional de Fortaleza. Atrai público de diversas gerações aos domingos em ambiente acolhedor.",
    tags: ['Domingo', 'Drag', 'Cultura'],
    badges: ['geral', 'gay', 'drag', 'cultura'],
    rating: 4.6,
    reviews: 16,
    price: '$',
    image: safeSpaceCategoryImages['Bar & Entretenimento'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Morenos%20Bar%20Benfica%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-dragao',
    slug: 'centro-dragao-do-mar',
    name: 'Centro Dragão do Mar de Arte e Cultura',
    category: 'Centro Cultural',
    address: 'Rua Dragão do Mar, 81 — Praia de Iracema',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'Maior complexo cultural da cidade. Ponto histórico de encontro e resistência da comunidade queer. Abriga museus, teatros e o Hub Cultural Porto Dragão.',
    tags: ['Cultura', 'Arte', 'Museu'],
    badges: ['geral', 'cultura', 'acessivel'],
    rating: 4.8,
    reviews: 41,
    image: safeSpaceCategoryImages['Centro Cultural'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Centro%20Dragao%20do%20Mar%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-outra-casa',
    slug: 'outra-casa-coletiva',
    name: 'Outra Casa Coletiva',
    category: 'ONG & Acolhimento',
    address: 'Benfica — Fortaleza, CE',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'República de acolhimento e centro cultural focado na comunidade LGBTQIAP+. Promove feiras, eventos artísticos e atividades voltadas para cidadania, inclusão e convivência.',
    tags: ['Acolhimento', 'Cultura', 'Comunidade'],
    badges: ['geral', 'comunidade', 'familia'],
    rating: 4.9,
    reviews: 27,
    image: safeSpaceCategoryImages['ONG & Acolhimento'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Outra%20Casa%20Coletiva%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-sertrans',
    slug: 'sertrans-huc',
    name: 'Sertrans — Hospital Universitário do Ceará',
    category: 'Saúde',
    address: 'Rua Betel, 2021 — Itaperi, Fortaleza',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'Serviço Ambulatorial Transdisciplinar para Pessoas Transgênero. Atendimento multiprofissional, hormonioterapia, exames e apoio social pelo SUS.',
    tags: ['SUS', 'Trans', 'Hormonização'],
    badges: ['trans', 'sus', 'mental'],
    rating: 4.4,
    reviews: 12,
    image: safeSpaceCategoryImages.Saúde,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hospital%20Universitario%20do%20Ceara%20Sertrans',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-janaina-dutra',
    slug: 'centro-referencia-lgbt-janaina-dutra',
    name: 'Centro de Referência LGBT Janaína Dutra',
    category: 'Serviços Públicos',
    address: 'Fortaleza, CE',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'Serviço municipal de referência para proteção, orientação e encaminhamento da população LGBTQIA+ em situações de violência, violações ou omissões de direitos.',
    tags: ['Direitos', 'Acolhimento', 'Denúncia'],
    badges: ['geral', 'trans', 'comunidade'],
    rating: 4.8,
    reviews: 0,
    image: safeSpaceCategoryImages['Serviços Públicos'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Centro%20de%20Refer%C3%AAncia%20LGBT%20Jana%C3%ADna%20Dutra%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-grab',
    slug: 'grupo-de-apoio-asa-branca',
    name: 'Grupo de Apoio Asa Branca (GRAB)',
    category: 'ONG & Acolhimento',
    address: 'Fortaleza, CE',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'Organização histórica do movimento LGBTQIA+ cearense, associada à defesa de direitos, prevenção, cidadania e articulação comunitária.',
    tags: ['ONG', 'Direitos', 'História LGBTQIA+'],
    badges: ['geral', 'comunidade', 'cultura'],
    rating: 4.8,
    reviews: 0,
    image: safeSpaceCategoryImages['ONG & Acolhimento'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Grupo%20de%20Apoio%20Asa%20Branca%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-estoril',
    slug: 'estoril-praia-de-iracema',
    name: 'Estoril — Praia de Iracema',
    category: 'Centro Cultural',
    address: 'Praia de Iracema — Fortaleza, CE',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'Marco histórico da boemia da Praia de Iracema e ponto cultural importante do circuito turístico e afetivo da cidade.',
    tags: ['Praia de Iracema', 'Boemia', 'Cultura'],
    badges: ['cultura', 'acessivel'],
    rating: 4.4,
    reviews: 0,
    image: safeSpaceCategoryImages['Centro Cultural'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Estoril%20Praia%20de%20Iracema%20Fortaleza',
    status: 'published',
    source: 'static',
  },
  {
    id: 'static-ponte-ingleses',
    slug: 'ponte-dos-ingleses-praia-de-iracema',
    name: 'Ponte dos Ingleses / Praia de Iracema',
    category: 'Centro Cultural',
    address: 'Praia de Iracema — Fortaleza, CE',
    city: 'Fortaleza',
    state: 'CE',
    description:
      'Ponto turístico e de convivência da Praia de Iracema, útil como referência para encontros, passeios e circulação no circuito cultural próximo ao Dragão do Mar.',
    tags: ['Ponto de encontro', 'Praia de Iracema', 'Turismo'],
    badges: ['cultura', 'precos'],
    rating: 4.3,
    reviews: 0,
    image: safeSpaceCategoryImages.Hospedagem,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ponte%20dos%20Ingleses%20Fortaleza',
    status: 'published',
    source: 'static',
  },
];
