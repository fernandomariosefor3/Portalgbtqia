export type QueerRouteType = 'Praia' | 'Urbano' | 'Cultura' | 'Fim de semana' | 'Histórico';

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
  summary: string;
  highlights: string[];
  itinerary: { day: string; title: string; description: string }[];
  safetyTips: string[];
  usefulContacts: string[];
  image: string;
  tags: string[];
  status: 'published' | 'hidden';
}

export const queerRouteTypes: QueerRouteType[] = ['Praia', 'Urbano', 'Cultura', 'Fim de semana', 'Histórico'];

export const staticQueerRoutes: QueerRoute[] = [
  {
    id: 'route-fortaleza',
    slug: 'fortaleza-queer',
    title: 'Fortaleza Queer: cultura, praia e noite segura',
    destination: 'Fortaleza',
    state: 'CE',
    type: 'Urbano',
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
    type: 'Cultura',
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
    type: 'Urbano',
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
