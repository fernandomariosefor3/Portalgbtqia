import { useEffect, useState } from 'react';
import { getEvents, type Event as FirestoreEvent } from './firestore';
import { featuredEvents as mockEvents, type EventItem } from '@/mocks/events';

/**
 * Converte um documento de evento do Firestore para o formato `EventItem`
 * consumido pela UI (mocks). Campos ausentes recebem padrões seguros.
 */
function toEventItem(doc: FirestoreEvent, index: number): EventItem {
  return {
    id: typeof doc.id === 'string' ? hashId(doc.id) : index,
    title: doc.title ?? '',
    slug: doc.slug ?? '',
    description: doc.description ?? '',
    short_description: doc.short_description ?? doc.description ?? '',
    category: doc.category ?? 'encontro',
    location: doc.location ?? '',
    address: doc.address ?? '',
    city: doc.city ?? '',
    state: doc.state ?? '',
    start_date: doc.start_date ?? '',
    end_date: doc.end_date ?? null,
    start_time: doc.start_time ?? null,
    end_time: doc.end_time ?? null,
    image_url: doc.image_url ?? '',
    source_url: doc.source_url ?? '',
    status: doc.status ?? 'approved',
    organizer: doc.organizer ?? '',
    contact_email: doc.contact_email ?? '',
    contact_phone: doc.contact_phone ?? '',
    price_info: doc.price_info ?? '',
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    is_featured: Boolean((doc as { is_featured?: boolean }).is_featured),
    views: Number((doc as { views?: number }).views ?? 0),
    created_at: doc.createdAt ?? new Date().toISOString(),
  };
}

// Gera um id numérico estável a partir do id string do Firestore (apenas para a key da UI).
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export interface UseEventsResult {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  /** true quando os dados vieram dos mocks (Firestore vazio/indisponível). */
  usingFallback: boolean;
}

/**
 * Busca eventos aprovados do Firestore com fallback automático para os mocks.
 * Mantém o site funcional mesmo sem Firebase configurado ou sem eventos ainda.
 */
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const docs = await getEvents();
        if (!active) return;

        if (docs.length > 0) {
          setEvents(docs.map(toEventItem));
          setUsingFallback(false);
        } else {
          // Sem eventos publicados ainda → usa mocks como conteúdo de exemplo.
          setEvents(mockEvents);
          setUsingFallback(true);
        }
      } catch (err) {
        if (!active) return;
        console.error('Falha ao buscar eventos do Firestore:', err);
        setEvents(mockEvents);
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

  return { events, loading, error, usingFallback };
}
