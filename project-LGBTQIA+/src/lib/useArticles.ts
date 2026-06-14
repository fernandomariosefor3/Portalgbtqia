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
import { allArticles, type Article } from '@/mocks/articles-full';

const PLACEHOLDER_AUTHOR_PHOTO =
  'https://ui-avatars.com/api/?name=Fernando+Mario&background=E94E77&color=fff&size=64';

const DEFAULT_ARTICLE_IMAGE =
  'https://readdy.ai/api/search-image?query=LGBTQ+pride+community+Brazil+colorful&width=800&height=500&seq=art-default&orientation=landscape';

/**
 * Converte um documento do Firestore para o formato `Article` usado pela UI.
 */
function firestoreToArticle(doc: QueryDocumentSnapshot<DocumentData>): Article {
  const d = doc.data();
  const date = d.published_at?.toDate?.()
    ? d.published_at
        .toDate()
        .toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';
  return {
    id: doc.id,
    title: d.title || '',
    slug: d.slug || doc.id,
    excerpt: d.excerpt || '',
    category: d.category || 'artigos',
    subcategory: d.subcategory || '',
    date,
    author: d.author || 'Fernando Mário da Silva Martins',
    authorRole: d.authorRole || 'Fundador',
    authorBio: '',
    authorPhoto: PLACEHOLDER_AUTHOR_PHOTO,
    readTime: Math.max(2, Math.ceil((d.excerpt?.length || 200) / 200)),
    views: d.views || 0,
    image: d.featured_image || DEFAULT_ARTICLE_IMAGE,
    featured: false,
    tags: d.tags || [],
    content: d.content || '',
  };
}

export interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  /** true quando os dados vieram dos mocks (Firestore vazio/indisponível). */
  usingFallback: boolean;
}

/**
 * Busca artigos publicados do Firestore com fallback automático para os mocks.
 * O primeiro artigo da lista resultante é marcado como `featured`.
 */
export function useArticles(): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const q = query(
          collection(db, 'articles'),
          where('status', '==', 'published'),
          orderBy('published_at', 'desc')
        );
        const snapshot = await getDocs(q);
        if (!active) return;

        const fetched = snapshot.docs.map(firestoreToArticle);

        if (fetched.length > 0) {
          fetched[0].featured = true;
          setArticles(fetched);
          setUsingFallback(false);
        } else {
          setArticles(allArticles);
          setUsingFallback(true);
        }
      } catch (err) {
        if (!active) return;
        console.error('Erro ao buscar artigos do Firestore:', err);
        setArticles(allArticles);
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

  return { articles, loading, error, usingFallback };
}
