import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Article } from '@/mocks/articles-full';

const PLACEHOLDER_AUTHOR_PHOTO =
  'https://ui-avatars.com/api/?name=Fernando+Mario&background=E94E77&color=fff&size=64';

const DEFAULT_ARTICLE_IMAGE =
  'https://readdy.ai/api/search-image?query=LGBTQ+pride+community+Brazil+colorful&width=800&height=500&seq=art-default&orientation=landscape';

/**
 * Converte um documento do Firestore para o formato `Article` usado pela UI.
 */
export function firestoreToArticle(doc: QueryDocumentSnapshot<DocumentData>): Article {
  const d = doc.data();
  const date = d.published_at?.toDate?.()
    ? d.published_at.toDate().toISOString()
    : typeof d.published_at === 'string' ? d.published_at : '';
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
    sourceUrl: d.source_url || '',
  };
}

export async function getFirestoreArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(collection(db, 'articles'), where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  const found = snapshot.docs.find((doc) => (doc.data().slug || doc.id) === slug);
  return found ? firestoreToArticle(found) : null;
}

export interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  /** Mantido por compatibilidade; o portal nao publica mocks automaticamente. */
  usingFallback: boolean;
}

/**
 * Busca artigos publicados do Firestore.
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
        const q = query(collection(db, 'articles'), where('status', '==', 'published'));
        const snapshot = await getDocs(q);
        if (!active) return;

        const fetched = snapshot.docs.map(firestoreToArticle);
        fetched.sort((a, b) => b.date.localeCompare(a.date));

        if (fetched.length > 0) {
          fetched[0].featured = true;
        }
        setArticles(fetched);
        setUsingFallback(false);
      } catch (err) {
        if (!active) return;
        console.error('Erro ao buscar artigos do Firestore:', err);
        setArticles([]);
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

  return { articles, loading, error, usingFallback };
}
