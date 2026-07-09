import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { allHealthGuides, categoryImages, type HealthGuide } from '@/mocks/health';

const DEFAULT_IMAGE = categoryImages['prep-pep'];

const PLACEHOLDER_AUTHOR_PHOTO =
  'https://ui-avatars.com/api/?name=Portal+LGBTQ&background=10B981&color=fff&size=64';

/** Converte um documento do Firestore para o formato `HealthGuide` da UI. */
function firestoreToHealth(doc: QueryDocumentSnapshot<DocumentData>): HealthGuide {
  const d = doc.data();
  const category = d.category || 'prep-pep';
  const rawImage = d.image || d.featured_image || '';
  const image =
    typeof rawImage === 'string' && rawImage && !rawImage.includes('readdy.ai')
      ? rawImage
      : categoryImages[category as HealthGuide['category']] || DEFAULT_IMAGE;
  const publishedAt = d.published_at?.toDate?.()
    ? d.published_at
        .toDate()
        .toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : d.publishedAt || '';
  return {
    id: doc.id,
    slug: d.slug || doc.id,
    title: d.title || '',
    excerpt: d.excerpt || '',
    content: d.content || '',
    category,
    subcategory: d.subcategory,
    image,
    author: d.author || 'Portal LGBTQ+',
    authorPhoto: d.authorPhoto || PLACEHOLDER_AUTHOR_PHOTO,
    authorBio: d.authorBio || '',
    readTime: d.readTime || Math.max(2, Math.ceil((d.excerpt?.length || 200) / 200)),
    views: d.views || 0,
    publishedAt,
    featured: Boolean(d.featured),
    tags: Array.isArray(d.tags) ? d.tags : [],
    sources: d.sources,
    faqs: d.faqs,
  };
}

export interface UseHealthResult {
  guides: HealthGuide[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
}

/**
 * Busca guias de saúde publicados do Firestore com base editorial local.
 */
export function useHealth(): UseHealthResult {
  const [guides, setGuides] = useState<HealthGuide[]>(allHealthGuides);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const q = query(
          collection(db, 'health_guides'),
          where('status', '==', 'published'),
          orderBy('published_at', 'desc')
        );
        const snapshot = await getDocs(q);
        if (!active) return;

        const fetched = snapshot.docs.map(firestoreToHealth);
        setGuides(fetched.length > 0 ? fetched : allHealthGuides);
        setUsingFallback(fetched.length === 0);
      } catch (err) {
        if (!active) return;
        console.error('Erro ao buscar guias de saúde do Firestore:', err);
        setGuides(allHealthGuides);
        setUsingFallback(true);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { guides, loading, error, usingFallback };
}
