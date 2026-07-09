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

export const categoryDescriptions: Record<HealthGuide['category'], string> = {
  'prep-pep': 'Profilaxia Pré-Exposição e Pós-Exposição: como acessar pelo SUS, eficácia, efeitos colaterais e tudo que você precisa saber.',
  'saude-mental': 'Acolhimento psicológico, terapia afirmativa, enfrentamento do estigma e cuidado emocional para pessoas LGBTQ+.',
  'saude-trans': 'Hormonioterapia, cirurgias de redesignação, cuidados multiprofissionais e direitos no sistema de saúde.',
  'educacao-sexual': 'Prevenção de ISTs, consentimento, saúde sexual e informação baseada em evidências para a comunidade.',
};

export const allHealthGuides: HealthGuide[] = [];
