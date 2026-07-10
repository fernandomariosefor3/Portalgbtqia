export type QueerRouteType = 'Praias inclusivas' | 'Rotas urbanas' | 'Festivais e eventos' | 'Histórico e cultura' | 'Ecoturismo' | 'Fins de semana';

export interface RoutePlace {
  name: string;
  kind: string;
  rating: number;
  reviews: number;
  price: string;
  badges: string[];
  note: string;
  negative?: boolean;
}

export interface RouteResource {
  label: string;
  icon: string;
  href: string;
}

export interface RouteTestimonial {
  quote: string;
  author: string;
  location: string;
}

export interface QueerRoute {
  id: string;
  slug: string;
  title: string;
  destination: string;
  state: string;
  type: QueerRouteType;
  duration: string;
  budget: '$' | '$$' | '$$$' | '$$$$';
  safetyLevel: 1 | 2 | 3 | 4 | 5;
  safetySummary?: string;
  safetyNotes?: string[];
  summary: string;
  highlights: string[];
  itinerary: { day: string; title: string; description: string }[];
  hotels?: RoutePlace[];
  foodAndBars?: RoutePlace[];
  safetyTips: string[];
  resources?: RouteResource[];
  testimonials?: RouteTestimonial[];
  usefulContacts: string[];
  image: string;
  tags: string[];
  status: 'published' | 'hidden';
}

export const queerRouteTypes: QueerRouteType[] = [
  'Praias inclusivas',
  'Rotas urbanas',
  'Festivais e eventos',
  'Histórico e cultura',
  'Ecoturismo',
  'Fins de semana',
];

export const staticQueerRoutes: QueerRoute[] = [
  {
    id: 'route-jericoacoara',
    slug: 'jericoacoara-queer-5-dias',
    title: 'Jericoacoara Queer: 5 dias de praia, aventura e acolhimento',
    destination: 'Jericoacoara',
    state: 'CE',
    type: 'Praias inclusivas',
    duration: '5 dias',
    budget: '$$$',
    safetyLevel: 4,
    safetySummary: 'Bom, com ressalvas',
    safetyNotes: [
      'Casais homoafetivos costumam circular bem nas áreas centrais e turísticas.',
      'Pessoas trans devem redobrar atenção em deslocamentos noturnos e locais afastados.',
      'Há banheiros gender neutral em pontos da vila e pousadas inclusivas.',
      'Principais hotéis e restaurantes turísticos demonstram maior preparo para receber diversidade.',
    ],
    summary:
      'Escapada queer por Jeri com pousadas verificadas, beach clubs, pôr do sol na duna, kitesurf, lagoas e recursos de apoio para viajar com mais tranquilidade.',
    highlights: ['Duna do Pôr do Sol', 'Vila de Jeri', 'Kitesurf', 'Lagoas', 'Pride Sunset'],
    hotels: [
      {
        name: 'Pousada Vila Arco-Íris',
        kind: 'Pousada verificada',
        rating: 4.8,
        reviews: 23,
        price: 'R$ 420/noite',
        badges: ['🏳️‍⚧️', '🏳️‍🌈'],
        note: 'Equipe treinada e histórico positivo com casais LGBTQIA+.',
      },
      {
        name: 'Hotel Brisa da Duna',
        kind: 'Hotel boutique',
        rating: 4.5,
        reviews: 15,
        price: 'R$ 310/noite',
        badges: ['🏳️‍⚧️'],
        note: 'Bom acolhimento, quartos próximos ao centro e rota iluminada.',
      },
      {
        name: 'Hospedagem sem curadoria',
        kind: 'Relatos negativos',
        rating: 2.1,
        reviews: 4,
        price: 'evitar',
        badges: ['✗'],
        note: 'Relatos de atendimento constrangedor. Preferir opções verificadas.',
        negative: true,
      },
    ],
    foodAndBars: [
      {
        name: 'Restaurante Mandacaru',
        kind: 'Cozinha regional',
        rating: 4.7,
        reviews: 31,
        price: '$$',
        badges: ['🏳️‍🌈', '💰'],
        note: 'Bom para jantar em casal ou grupo, atendimento acolhedor.',
      },
      {
        name: 'Bar Lua Livre',
        kind: 'Música ao vivo',
        rating: 4.6,
        reviews: 19,
        price: '$$',
        badges: ['🏳️‍⚧️', '🎤'],
        note: 'Noites temáticas e público misto, melhor voltar por rota combinada.',
      },
      {
        name: 'Beach Club Z',
        kind: 'Pride Sunset',
        rating: 4.4,
        reviews: 12,
        price: '$$$',
        badges: ['🏳️‍🌈'],
        note: 'Festa de sexta com pôr do sol, reservar antes na alta temporada.',
      },
    ],
    itinerary: [
      {
        day: 'Dia 1',
        title: 'Chegada e sunset na duna',
        description:
          'Check-in na vila, reconhecimento das ruas principais e pôr do sol na Duna. À noite, jantar em local verificado e retorno em grupo.',
      },
      {
        day: 'Dia 2',
        title: 'Praia e aula de surf com instrutora LGBTQIA+',
        description:
          'Manhã na praia central, aula introdutória de surf ou kite com profissional indicada e tarde livre para cafés da vila.',
      },
      {
        day: 'Dia 3',
        title: 'Aventura de jangada e kitesurf',
        description:
          'Passeio com jangadeiros locais e experiência de kitesurf. Guardar documentos e combinar ponto de encontro antes de sair.',
      },
      {
        day: 'Dia 4',
        title: 'Ecoturismo, lagoas e farol',
        description:
          'Roteiro diurno para lagoas, trilhas leves e Farol. Evite áreas isoladas ao anoitecer e confirme retorno com guia.',
      },
      {
        day: 'Dia 5',
        title: 'Yoga, brunch e despedida',
        description:
          'Manhã leve com yoga ou caminhada curta, brunch na vila e retorno com margem de tempo para transfer.',
      },
    ],
    safetyTips: [
      'Mantenha documentos em dia e uma cópia digital acessível.',
      'Evite exposição excessiva em áreas escuras, isoladas ou muito afastadas da vila.',
      'À noite, prefira andar em grupo ou usar transporte combinado.',
      'Posto de saúde a cerca de 1km do centro; ligue 190 em emergência.',
    ],
    resources: [
      { label: 'Download mapa offline', icon: 'ri-download-2-line', href: '#mapa-offline' },
      { label: 'Contato guias LGBTQ+', icon: 'ri-phone-line', href: 'mailto:contato@portallgbtq.com.br?subject=Guias LGBTQ em Jeri' },
      { label: 'Google Maps integrado', icon: 'ri-map-2-line', href: 'https://www.google.com/maps/search/?api=1&query=Jericoacoara%20CE' },
      { label: 'Reservas com desconto', icon: 'ri-hotel-bed-line', href: '#reservas' },
    ],
    testimonials: [
      {
        quote: 'Fui com minha esposa no Pride de Jeri e foi incrível. Todos muito acolhedores.',
        author: 'Marina',
        location: 'PE',
      },
      {
        quote: 'Precisei de atendimento médico e o SUS local foi bem. Respeitaram minha transição.',
        author: 'Lucas',
        location: 'CE',
      },
    ],
    usefulContacts: ['190 - Polícia Militar', '192 - SAMU', 'Disque 100', 'CVV 188', 'Posto de Saúde de Jijoca/Jeri'],
    image:
      'https://readdy.ai/api/search-image?query=jericoacoara%20ceara%20brazil%20dunes%20beach%20sunset%20warm%20travel%20editorial%20photography%20inclusive%20tourism&width=1200&height=650&seq=route-jeri-queer&orientation=landscape',
    tags: ['JeriQueer', 'NordesteGay', 'JericoacoaraLGBT', 'praia', 'Ceará'],
    status: 'published',
  },
  {
    id: 'route-fortaleza',
    slug: 'fortaleza-queer',
    title: 'Fortaleza Queer: cultura, praia e noite segura',
    destination: 'Fortaleza',
    state: 'CE',
    type: 'Rotas urbanas',
    duration: '3 dias',
    budget: '$$',
    safetyLevel: 4,
    summary:
      'Roteiro curto por Praia de Iracema, Benfica, Dragão do Mar e espaços de acolhimento para viver Fortaleza com mais segurança e pertencimento.',
    highlights: ['Dragão do Mar', 'Praia de Iracema', 'Benfica', 'Noite LGBTQIA+'],
    itinerary: [
      {
        day: 'Dia 1',
        title: 'Chegada e Centro Cultural Dragão do Mar',
        description:
          'Comece pelo entorno do Dragão do Mar, visite exposições, cafés e circule por espaços culturais da Praia de Iracema antes do pôr do sol.',
      },
      {
        day: 'Dia 2',
        title: 'Benfica, comunidade e cultura independente',
        description:
          'Reserve o dia para feiras, espaços coletivos, livrarias e cafés do Benfica. À noite, prefira deslocamentos por aplicativo ou em grupo.',
      },
      {
        day: 'Dia 3',
        title: 'Praia, descanso e noite queer',
        description:
          'Faça uma manhã leve na orla, confirme programação das casas LGBTQIA+ e escolha locais com rota fácil de ida e volta.',
      },
    ],
    safetyTips: [
      'Evite caminhar sozinho em ruas vazias de madrugada.',
      'Use aplicativos de transporte para deslocamentos noturnos.',
      'Confirme a programação dos espaços antes de sair.',
      'Compartilhe sua localização com alguém de confiança.',
    ],
    usefulContacts: ['190 - Polícia Militar', '192 - SAMU', 'Disque 100', 'CVV 188'],
    image:
      'https://readdy.ai/api/search-image?query=fortaleza%20brazil%20coastline%20praia%20de%20iracema%20sunset%20urban%20beach%20warm%20golden%20light%20editorial%20travel%20photography&width=1200&height=650&seq=route-fortaleza&orientation=landscape',
    tags: ['Fortaleza', 'cultura', 'praia', 'noite', 'Ceará'],
    status: 'published',
  },
  {
    id: 'route-salvador',
    slug: 'salvador-lgbtqia-cultural',
    title: 'Salvador LGBTQIA+: memória, afeto e Pelourinho',
    destination: 'Salvador',
    state: 'BA',
    type: 'Histórico e cultura',
    duration: '4 dias',
    budget: '$$$',
    safetyLevel: 4,
    summary:
      'Um roteiro por cultura afro-brasileira, história, música, gastronomia e pontos de convivência LGBTQIA+ em Salvador.',
    highlights: ['Pelourinho', 'Rio Vermelho', 'Barra', 'Museus e música'],
    itinerary: [
      {
        day: 'Dia 1',
        title: 'Centro histórico e Pelourinho',
        description:
          'Visite museus, igrejas, centros culturais e restaurantes do centro histórico. Prefira horários de maior movimento.',
      },
      {
        day: 'Dia 2',
        title: 'Barra e pôr do sol',
        description:
          'Explore o Farol da Barra, caminhe pela orla e escolha bares acolhedores para a noite.',
      },
      {
        day: 'Dia 3',
        title: 'Rio Vermelho e música',
        description:
          'Faça um roteiro gastronômico e musical pelo Rio Vermelho, com retorno planejado.',
      },
      {
        day: 'Dia 4',
        title: 'Memória e despedida',
        description:
          'Reserve a manhã para compras locais e visitas culturais antes do retorno.',
      },
    ],
    safetyTips: [
      'No centro histórico, fique em ruas movimentadas e com iluminação.',
      'Combine pontos de encontro com o grupo.',
      'Use rotas por aplicativo à noite.',
      'Consulte eventos locais antes de viajar.',
    ],
    usefulContacts: ['190 - Polícia Militar', '192 - SAMU', 'Disque 100', 'CVV 188'],
    image:
      'https://readdy.ai/api/search-image?query=salvador%20bahia%20pelourinho%20colorful%20colonial%20street%20warm%20sunlight%20travel%20editorial%20photography%20brazil&width=1200&height=650&seq=route-salvador&orientation=landscape',
    tags: ['Salvador', 'Bahia', 'cultura', 'história', 'música'],
    status: 'published',
  },
  {
    id: 'route-recife',
    slug: 'recife-cultural-queer',
    title: 'Recife Cultural Queer: pontes, cinema e noite alternativa',
    destination: 'Recife',
    state: 'PE',
    type: 'Rotas urbanas',
    duration: '3 dias',
    budget: '$$',
    safetyLevel: 3,
    summary:
      'Roteiro por Recife Antigo, cinema, centros culturais e espaços de convivência para uma viagem urbana e afetiva.',
    highlights: ['Recife Antigo', 'Cinema', 'Marco Zero', 'Boa Viagem'],
    itinerary: [
      {
        day: 'Dia 1',
        title: 'Recife Antigo e Marco Zero',
        description:
          'Circule pelo Recife Antigo, visite centros culturais e programe um jantar próximo a áreas movimentadas.',
      },
      {
        day: 'Dia 2',
        title: 'Cinema, museus e cafés',
        description:
          'Monte uma agenda cultural com cinema, galerias e cafés. À noite, confirme festas e bares LGBTQIA+ ativos.',
      },
      {
        day: 'Dia 3',
        title: 'Boa Viagem e despedida',
        description:
          'Faça uma manhã tranquila na orla, observando orientações locais de segurança e áreas permitidas para banho.',
      },
    ],
    safetyTips: [
      'Evite áreas isoladas do Recife Antigo fora de horários de movimento.',
      'Planeje deslocamentos antes de sair para a noite.',
      'Verifique condições da praia e recomendações locais.',
      'Mantenha documentos e celular protegidos em áreas turísticas.',
    ],
    usefulContacts: ['190 - Polícia Militar', '192 - SAMU', 'Disque 100', 'CVV 188'],
    image:
      'https://readdy.ai/api/search-image?query=recife%20brazil%20bridges%20historic%20center%20marco%20zero%20warm%20sunset%20urban%20travel%20editorial%20photography&width=1200&height=650&seq=route-recife&orientation=landscape',
    tags: ['Recife', 'Pernambuco', 'cinema', 'urbano', 'cultura'],
    status: 'published',
  },
];
