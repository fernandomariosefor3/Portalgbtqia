export interface EventItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  location: string;
  address: string;
  city: string;
  state: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  image_url: string;
  source_url: string;
  status: string;
  organizer: string;
  contact_email: string;
  contact_phone: string;
  price_info: string;
  tags: string[];
  is_featured: boolean;
  views: number;
  created_at: string;
}

// Cores escolhidas para manter contraste >= 4.5:1 com texto branco (WCAG AA).
// Os tons "-400"/"-500" originais (ex.: orange-400, pink-400) ficavam ilegíveis
// com texto branco (contraste ~2:1); ver AUDITORIA_CONTRASTE.md.
export const eventCategories = [
  { value: 'todos', label: 'Todos', color: 'bg-dark-700' },
  { value: 'parada', label: 'Paradas', color: 'bg-rose-600' },
  { value: 'festa', label: 'Festas', color: 'bg-orange-700' },
  { value: 'cultura', label: 'Cultura', color: 'bg-amber-700' },
  { value: 'saude', label: 'Saúde', color: 'bg-emerald-700' },
  { value: 'educacao', label: 'Educação', color: 'bg-teal-700' },
  { value: 'visibilidade', label: 'Visibilidade', color: 'bg-pink-700' },
  { value: 'encontro', label: 'Encontros', color: 'bg-indigo-600' },
];

export const featuredEvents: EventItem[] = [
  {
    id: 1,
    title: 'Parada da Diversidade de Pernambuco',
    slug: 'parada-pernambuco-2026',
    description: 'A maior celebração do orgulho LGBTQIA+ no Nordeste. O evento conta com trios elétricos, apresentações culturais e discursos políticos.',
    short_description: 'Celebração histórica na Avenida Boa Viagem.',
    category: 'parada',
    location: 'Avenida Boa Viagem',
    address: 'Av. Boa Viagem, s/n',
    city: 'Recife',
    state: 'PE',
    start_date: '2026-09-20T14:00:00Z',
    end_date: '2026-09-20T22:00:00Z',
    start_time: '14:00',
    end_time: '22:00',
    image_url: '',
    source_url: 'https://instagram.com/paradarecife',
    status: 'confirmado',
    organizer: 'Fórum LGBT de Pernambuco',
    contact_email: 'contato@forumpe.org',
    contact_phone: '(81) 99999-9999',
    price_info: 'Gratuito',
    tags: ['orgulho', 'parada', 'visibilidade'],
    is_featured: true,
    views: 1205,
    created_at: '2026-05-10T10:00:00Z',
  },
  {
    id: 2,
    title: 'Festival Bixa Nordestina',
    slug: 'festival-bixa-nordestina',
    description: 'Festival cultural independente que reúne artistas da cena LGBTQIA+ baiana e nordestina, com música, poesia e artes plásticas.',
    short_description: 'Festival cultural independente com artistas da cena LGBTQIA+.',
    category: 'cultura',
    location: 'Largo do Pelourinho',
    address: 'Pelourinho',
    city: 'Salvador',
    state: 'BA',
    start_date: '2026-08-15T18:00:00Z',
    end_date: '2026-08-15T23:59:00Z',
    start_time: '18:00',
    end_time: '00:00',
    image_url: '',
    source_url: '',
    status: 'confirmado',
    organizer: 'Coletivo Bixa Nordestina',
    contact_email: '',
    contact_phone: '',
    price_info: 'Gratuito',
    tags: ['festival', 'música', 'cultura'],
    is_featured: true,
    views: 890,
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 3,
    title: 'Seminário de Saúde Trans',
    slug: 'seminario-saude-trans',
    description: 'Encontro para debater o acesso de pessoas trans ao SUS e a implementação dos ambulatórios no interior do estado.',
    short_description: 'Debate sobre acesso e políticas públicas de saúde para pessoas trans.',
    category: 'saude',
    location: 'UFC - Campus do Pici',
    address: 'Av. Humberto Monte, s/n',
    city: 'Fortaleza',
    state: 'CE',
    start_date: '2026-07-30T09:00:00Z',
    end_date: '2026-07-30T17:00:00Z',
    start_time: '09:00',
    end_time: '17:00',
    image_url: '',
    source_url: '',
    status: 'confirmado',
    organizer: 'Secretaria de Saúde',
    contact_email: '',
    contact_phone: '',
    price_info: 'Gratuito',
    tags: ['saúde', 'debate', 'políticas públicas'],
    is_featured: false,
    views: 450,
    created_at: '2026-06-15T10:00:00Z',
  }
];