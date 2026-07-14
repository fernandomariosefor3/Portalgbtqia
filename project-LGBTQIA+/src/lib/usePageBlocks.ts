import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db } from './firebase';
import { normalizeContentLocale, type ContentLocale } from '@/content/pageRegistry';

export interface PageBlock {
  id: string;
  page: string;
  locale: ContentLocale;
  title: string;
  content: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaUrl: string;
  order: number;
  status: 'published' | 'draft';
}

function mapPageBlock(id: string, data: Record<string, unknown>): PageBlock {
  return {
    id,
    page: typeof data.page === 'string' ? data.page : '',
    locale: normalizeContentLocale(typeof data.locale === 'string' ? data.locale : undefined),
    title: typeof data.title === 'string' ? data.title : '',
    content: typeof data.content === 'string' ? data.content : '',
    image: typeof data.image === 'string' ? data.image : '',
    imageAlt: typeof data.imageAlt === 'string' ? data.imageAlt : '',
    ctaLabel: typeof data.ctaLabel === 'string' ? data.ctaLabel : '',
    ctaUrl: typeof data.ctaUrl === 'string' ? data.ctaUrl : '',
    order: typeof data.order === 'number' ? data.order : 0,
    status: data.status === 'draft' ? 'draft' : 'published',
  };
}

export function usePageBlocks(page: string | null) {
  const { i18n } = useTranslation();
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(Boolean(page));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!page) {
      setBlocks([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getDocs(query(
      collection(db, 'page_blocks'),
      where('status', '==', 'published'),
      where('page', '==', page),
    ))
      .then((snapshot) => {
        if (!active) return;
        setBlocks(
          snapshot.docs
            .map((item) => mapPageBlock(item.id, item.data()))
            .filter((block) => block.page === page)
            .sort((a, b) => a.order - b.order),
        );
      })
      .catch((caught: unknown) => {
        if (!active) return;
        console.error('Falha ao carregar blocos editoriais:', caught);
        setError(caught instanceof Error ? caught.message : 'Não foi possível carregar o conteúdo adicional.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  const locale = normalizeContentLocale(i18n.resolvedLanguage);
  const localizedBlocks = useMemo(() => {
    const exact = blocks.filter((block) => block.locale === locale);
    if (exact.length > 0 || locale === 'pt-BR') return exact;
    return blocks.filter((block) => block.locale === 'pt-BR');
  }, [blocks, locale]);

  return { blocks: localizedBlocks, loading, error, locale };
}
