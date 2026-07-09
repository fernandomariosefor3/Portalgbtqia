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
import type { CultureItem } from '@/mocks/culture';

const DEFAULT_IMAGE =
  'https://readdy.ai/api/search-image?query=LGBTQ+queer+culture+art+colorful&width=800&height=500&seq=culture-default&orientation=landscape';

const PLACEHOLDER_AUTHOR_PHOTO =
  'https://ui-avatars.com/api/?name=Portal+LGBTQ&background=E94E77&color=fff&size=64';

/** Converte um documento do Firestore para o formato `CultureItem` da UI. */
function firestoreToCulture(doc: QueryDocumentSnapshot<DocumentData>): CultureItem {
  const d = doc.data();
  const date = d.published_at?.toDate?.()
    ? d.published_at
        .toDate()
        .toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : d.date || '';
  return {
    id: doc.id,
    slug: d.slug || doc.id,
    title: d.title || '',
    subtitle: d.subtitle || '',
    excerpt: d.excerpt || '',
    content: d.content || '',
    type: d.type || 'cinema',
    author: d.author || 'Portal LGBTQ+',
    authorRole: d.authorRole || 'Curadoria',
    authorBio: d.authorBio || '',
    authorPhoto: d.authorPhoto || PLACEHOLDER_AUTHOR_PHOTO,
    date,
    readTime: d.readTime || Math.max(2, Math.ceil((d.excerpt?.length || 200) / 200)),
    image: d.image || d.featured_image || DEFAULT_IMAGE,
    featured: Boolean(d.featured),
    tags: Array.isArray(d.tags) ? d.tags : [],
    views: d.views || 0,
    year: d.year,
    director: d.director,
    cast: d.cast,
    genre: d.genre,
    platform: d.platform,
    albums: d.albums,
    performer: d.performer,
    rating: d.rating,
  };
}

export interface UseCultureResult {
  items: CultureItem[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
}

/**
 * Busca itens de cultura publicados do Firestore.
 */
export function useCulture(): UseCultureResult {
  const [items, setItems] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const q = query(
          collection(db, 'culture'),
          where('status', '==', 'published'),
          orderBy('published_at', 'desc')
        );
        const snapshot = await getDocs(q);
        if (!active) return;

        const fetched = snapshot.docs.map(firestoreToCulture);
        setItems(fetched);
        setUsingFallback(false);
      } catch (err) {
        if (!active) return;
        console.error('Erro ao buscar cultura do Firestore:', err);
        setItems([]);
        setUsingFallback(false);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error, usingFallback };
}
