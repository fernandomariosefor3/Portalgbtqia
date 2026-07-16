import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useTranslation } from 'react-i18next';

export interface SiteSectionContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  title_en?: string;
  subtitle_en?: string;
  description_en?: string;
  ctaLabel_en?: string;
  title_es?: string;
  subtitle_es?: string;
  description_es?: string;
  ctaLabel_es?: string;
}

export function useSiteSection(key: string, fallback: SiteSectionContent) {
  const [rawData, setRawData] = useState<SiteSectionContent>(fallback);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  
  const lang = i18n.resolvedLanguage || 'pt-BR';
  const isEn = lang.startsWith('en');
  const isEs = lang.startsWith('es');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const snapshot = await getDoc(doc(db, 'site_sections', key));
        if (!active) return;

        if (snapshot.exists()) {
          setRawData({ ...fallback, ...snapshot.data() } as SiteSectionContent);
        } else {
          setRawData(fallback);
        }
      } catch (error) {
        console.error(`Falha ao carregar secao ${key}:`, error);
        if (active) setRawData(fallback);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [fallback, key]);

  const content = {
    ...rawData,
    title: isEn && rawData.title_en ? rawData.title_en : isEs && rawData.title_es ? rawData.title_es : rawData.title,
    subtitle: isEn && rawData.subtitle_en ? rawData.subtitle_en : isEs && rawData.subtitle_es ? rawData.subtitle_es : rawData.subtitle,
    description: isEn && rawData.description_en ? rawData.description_en : isEs && rawData.description_es ? rawData.description_es : rawData.description,
    ctaLabel: isEn && rawData.ctaLabel_en ? rawData.ctaLabel_en : isEs && rawData.ctaLabel_es ? rawData.ctaLabel_es : rawData.ctaLabel,
  };

  return { content, loading };
}
