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

export const featuredEvents: EventItem[] = [];