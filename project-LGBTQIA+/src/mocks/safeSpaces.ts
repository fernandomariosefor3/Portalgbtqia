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
    badges: ['geral', 'drag'],
    rating: 4.7,
    reviews: 23,
    price: '$$',
    image:
      'https://readdy.ai/api/search-image?query=vibrant%20nightlife%20bar%20club%20interior%20colorful%20neon%20lighting%20diverse%20crowd%20dancing%20festive%20atmosphere%20LGBTQ%20friendly%20space%20editorial%20photography%20dynamic%20warm%20tones&width=400&height=250&seq=guide1&orientation=landscape',
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
    badges: ['geral', 'precos'],
    rating: 4.5,
    reviews: 18,
    price: '$$',
    image:
      'https://readdy.ai/api/search-image?query=modern%20nightclub%20dance%20floor%20colorful%20laser%20lights%20energetic%20crowd%20young%20people%20dancing%20LGBTQ%20party%20atmosphere%20editorial%20photography%20vibrant%20dynamic&width=400&height=250&seq=guide2&orientation=landscape',
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
    badges: ['geral', 'drag', 'cultura'],
    rating: 4.6,
    reviews: 16,
    price: '$',
    image:
      'https://readdy.ai/api/search-image?query=cozy%20bar%20interior%20warm%20lighting%20people%20socializing%20sunday%20afternoon%20casual%20atmosphere%20diverse%20community%20gathering%20editorial%20photography%20natural%20warm%20tones&width=400&height=250&seq=guide3&orientation=landscape',
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
    image:
      'https://readdy.ai/api/search-image?query=modern%20cultural%20center%20building%20exterior%20contemporary%20architecture%20public%20space%20artistic%20urban%20design%20editorial%20photography%20bright%20natural%20light&width=400&height=250&seq=guide4&orientation=landscape',
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
    image:
      'https://readdy.ai/api/search-image?query=community%20cultural%20center%20interior%20warm%20welcoming%20space%20people%20gathering%20plants%20natural%20light%20alternative%20creative%20environment%20editorial%20photography%20cozy%20atmosphere&width=400&height=250&seq=guide5&orientation=landscape',
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
    image:
      'https://readdy.ai/api/search-image?query=modern%20hospital%20outpatient%20clinic%20interior%20clean%20bright%20welcoming%20healthcare%20environment%20natural%20light%20professional%20medical%20setting%20editorial%20photography&width=400&height=250&seq=guide6&orientation=landscape',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hospital%20Universitario%20do%20Ceara%20Sertrans',
    status: 'published',
    source: 'static',
  },
];
