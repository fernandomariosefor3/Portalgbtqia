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

export const eventCategories = [
  { value: 'todos', label: 'Todos', color: 'bg-dark-700' },
  { value: 'parada', label: 'Paradas', color: 'bg-rose-500' },
  { value: 'festa', label: 'Festas', color: 'bg-orange-400' },
  { value: 'cultura', label: 'Cultura', color: 'bg-amber-500' },
  { value: 'saude', label: 'Saúde', color: 'bg-emerald-500' },
  { value: 'educacao', label: 'Educação', color: 'bg-teal-500' },
  { value: 'visibilidade', label: 'Visibilidade', color: 'bg-pink-400' },
  { value: 'encontro', label: 'Encontros', color: 'bg-indigo-400' },
];

export const featuredEvents: EventItem[] = [];