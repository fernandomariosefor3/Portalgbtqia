import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSectionContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
}

export function useSiteSection(key: string, fallback: SiteSectionContent) {
  const [content, setContent] = useState<SiteSectionContent>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const snapshot = await getDoc(doc(db, 'site_sections', key));
        if (!active) return;

        if (snapshot.exists()) {
          setContent({ ...fallback, ...snapshot.data() } as SiteSectionContent);
        } else {
          setContent(fallback);
        }
      } catch (error) {
        console.error(`Falha ao carregar secao ${key}:`, error);
        if (active) setContent(fallback);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [fallback, key]);

  return { content, loading };
}
