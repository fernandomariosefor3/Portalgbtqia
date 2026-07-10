import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { staticQueerRoutes, type QueerRoute, type QueerRouteType } from '@/mocks/queerRoutes';

export interface QueerRouteOverride {
  slug: string;
  title: string;
  destination: string;
  state: string;
  type: QueerRouteType;
  duration: string;
  budget: QueerRoute['budget'];
  safetyLevel: QueerRoute['safetyLevel'];
  safetySummary?: string;
  safetyNotes?: string[];
  summary: string;
  highlights: string[];
  itinerary: QueerRoute['itinerary'];
  hotels?: QueerRoute['hotels'];
  foodAndBars?: QueerRoute['foodAndBars'];
  safetyTips: string[];
  resources?: QueerRoute['resources'];
  testimonials?: QueerRoute['testimonials'];
  usefulContacts: string[];
  image: string;
  tags: string[];
  status: QueerRoute['status'];
}

export function queerRouteToOverride(route: QueerRoute): QueerRouteOverride {
  return {
    slug: route.slug,
    title: route.title,
    destination: route.destination,
    state: route.state,
    type: route.type,
    duration: route.duration,
    budget: route.budget,
    safetyLevel: route.safetyLevel,
    safetySummary: route.safetySummary,
    safetyNotes: route.safetyNotes,
    summary: route.summary,
    highlights: route.highlights,
    itinerary: route.itinerary,
    hotels: route.hotels,
    foodAndBars: route.foodAndBars,
    safetyTips: route.safetyTips,
    resources: route.resources,
    testimonials: route.testimonials,
    usefulContacts: route.usefulContacts,
    image: route.image,
    tags: route.tags,
    status: route.status,
  };
}

export function applyQueerRouteOverride(
  route: QueerRoute,
  override?: Partial<QueerRouteOverride>,
): QueerRoute {
  if (!override) return route;
  return {
    ...route,
    title: override.title || route.title,
    destination: override.destination || route.destination,
    state: override.state || route.state,
    type: override.type || route.type,
    duration: override.duration || route.duration,
    budget: override.budget || route.budget,
    safetyLevel: override.safetyLevel || route.safetyLevel,
    safetySummary: override.safetySummary || route.safetySummary,
    safetyNotes: override.safetyNotes?.length ? override.safetyNotes : route.safetyNotes,
    summary: override.summary || route.summary,
    highlights: override.highlights?.length ? override.highlights : route.highlights,
    itinerary: override.itinerary?.length ? override.itinerary : route.itinerary,
    hotels: override.hotels?.length ? override.hotels : route.hotels,
    foodAndBars: override.foodAndBars?.length ? override.foodAndBars : route.foodAndBars,
    safetyTips: override.safetyTips?.length ? override.safetyTips : route.safetyTips,
    resources: override.resources?.length ? override.resources : route.resources,
    testimonials: override.testimonials?.length ? override.testimonials : route.testimonials,
    usefulContacts: override.usefulContacts?.length ? override.usefulContacts : route.usefulContacts,
    image: override.image || route.image,
    tags: override.tags?.length ? override.tags : route.tags,
    status: override.status || route.status,
  };
}

export interface UseQueerRoutesResult {
  routes: QueerRoute[];
  loading: boolean;
  error: string | null;
}

export function useQueerRoutes(): UseQueerRoutesResult {
  const [routes, setRoutes] = useState<QueerRoute[]>(staticQueerRoutes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const snapshot = await getDocs(collection(db, 'queer_route_overrides'));
        if (!active) return;

        const overrides = new Map(
          snapshot.docs.map((item) => [item.id, item.data() as Partial<QueerRouteOverride>]),
        );
        const controlled = staticQueerRoutes
          .map((route) => applyQueerRouteOverride(route, overrides.get(route.slug)))
          .filter((route) => route.status === 'published');

        setRoutes(controlled);
      } catch (err) {
        if (!active) return;
        console.error('Erro ao buscar roteiros queer:', err);
        setRoutes(staticQueerRoutes.filter((route) => route.status === 'published'));
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { routes, loading, error };
}
