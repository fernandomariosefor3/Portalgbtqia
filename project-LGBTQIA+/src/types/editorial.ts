export interface EditorialMetadata {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  publishedAt: string;
  reviewedAt: string;
  readTimeMinutes: number;
  image?: string;
  imageAlt: string;
  featured?: boolean;
}
