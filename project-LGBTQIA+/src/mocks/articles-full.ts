export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory: string;
  author: string;
  authorRole: string;
  authorBio: string;
  authorPhoto: string;
  date: string;
  updatedAt: string;
  reviewedAt: string;
  readTime: number;
  image: string;
  featured: boolean;
  tags: string[];
  views: number;
  sourceUrl?: string;
  sources: ArticleSource[];
  reviewerName: string;
  reviewerRole: string;
  humanReviewed: boolean;
  aiAssisted: boolean;
  healthDisclaimer: boolean;
  regionalContext: string;
}

export interface ArticleSource {
  title: string;
  url: string;
  publisher?: string;
}

export const allArticles: Article[] = [];

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return allArticles.filter((a) => a.category === category);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, limit);
}

export function getMostViewed(limit = 5): Article[] {
  return [...allArticles].sort((a, b) => b.views - a.views).slice(0, limit);
}

export const categoryLabels: Record<string, string> = {
  artigos: 'Artigos',
  opiniao: 'Opinião',
  cultura: 'Cultura',
  saude: 'Saúde',
  familia: 'Família',
  paradas: 'Paradas',
  educacao: 'Educação',
  guia: 'Guia',
  comunidade: 'Comunidade',
  politica: 'Política',
};

export const categoryColors: Record<string, string> = {
  artigos: 'bg-primary-100 text-primary-700',
  opiniao: 'bg-primary-100 text-primary-700',
  cultura: 'bg-secondary-100 text-secondary-700',
  saude: 'bg-accent-100 text-accent-700',
  familia: 'bg-primary-50 text-primary-600',
  paradas: 'bg-secondary-50 text-secondary-600',
  educacao: 'bg-accent-50 text-accent-600',
  guia: 'bg-dark-100 text-dark-600',
  comunidade: 'bg-primary-50 text-primary-600',
  politica: 'bg-dark-100 text-dark-600',
};
