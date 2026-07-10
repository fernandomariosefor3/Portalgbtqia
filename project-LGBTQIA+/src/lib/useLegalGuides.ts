import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { staticLegalGuides, type LegalGuide, type LegalGuideCategory } from '@/mocks/legalRights';

export interface LegalGuideOverride {
  slug: string;
  title: string;
  category: LegalGuideCategory;
  summary: string;
  content: string;
  actions: string[];
  documents?: string[];
  subtopics?: string[];
  downloads?: LegalGuide['downloads'];
  averageTime?: string;
  costs?: string;
  contacts: string[];
  tags: string[];
  priority: LegalGuide['priority'];
  status: LegalGuide['status'];
}

export function legalGuideToOverride(guide: LegalGuide): LegalGuideOverride {
  return {
    slug: guide.slug,
    title: guide.title,
    category: guide.category,
    summary: guide.summary,
    content: guide.content,
    actions: guide.actions,
    documents: guide.documents,
    subtopics: guide.subtopics,
    downloads: guide.downloads,
    averageTime: guide.averageTime,
    costs: guide.costs,
    contacts: guide.contacts,
    tags: guide.tags,
    priority: guide.priority,
    status: guide.status,
  };
}

export function applyLegalGuideOverride(
  guide: LegalGuide,
  override?: Partial<LegalGuideOverride>,
): LegalGuide {
  if (!override) return guide;
  return {
    ...guide,
    title: override.title || guide.title,
    category: override.category || guide.category,
    summary: override.summary || guide.summary,
    content: override.content || guide.content,
    actions: override.actions?.length ? override.actions : guide.actions,
    documents: override.documents?.length ? override.documents : guide.documents,
    subtopics: override.subtopics?.length ? override.subtopics : guide.subtopics,
    downloads: override.downloads?.length ? override.downloads : guide.downloads,
    averageTime: override.averageTime || guide.averageTime,
    costs: override.costs || guide.costs,
    contacts: override.contacts?.length ? override.contacts : guide.contacts,
    tags: override.tags?.length ? override.tags : guide.tags,
    priority: override.priority || guide.priority,
    status: override.status || guide.status,
  };
}

export interface UseLegalGuidesResult {
  guides: LegalGuide[];
  loading: boolean;
  error: string | null;
}

export function useLegalGuides(): UseLegalGuidesResult {
  const [guides, setGuides] = useState<LegalGuide[]>(staticLegalGuides);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const snapshot = await getDocs(collection(db, 'legal_guide_overrides'));
        if (!active) return;

        const overrides = new Map(
          snapshot.docs.map((item) => [item.id, item.data() as Partial<LegalGuideOverride>]),
        );
        const controlled = staticLegalGuides
          .map((guide) => applyLegalGuideOverride(guide, overrides.get(guide.slug)))
          .filter((guide) => guide.status === 'published');

        setGuides(controlled);
      } catch (err) {
        if (!active) return;
        console.error('Erro ao buscar guias jurídicos:', err);
        setGuides(staticLegalGuides.filter((guide) => guide.status === 'published'));
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { guides, loading, error };
}
