import { useEffect, useState } from 'react';
import { collection, getDocs, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import {
  staticSafeSpaces,
  type SafeSpace,
  type SafeSpaceCategory,
} from '@/mocks/safeSpaces';

export interface SafeSpaceOverride {
  slug: string;
  name: string;
  category: SafeSpaceCategory;
  address: string;
  city: string;
  state: string;
  description: string;
  image: string;
  tags: string[];
  badges: string[];
  rating: number;
  reviews: number;
  price?: SafeSpace['price'];
  phone?: string;
  website?: string;
  mapUrl?: string;
  status: SafeSpace['status'];
}

function splitList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function firestorePlaceToSafeSpace(doc: QueryDocumentSnapshot<DocumentData>): SafeSpace {
  const data = doc.data();
  const name = data.title || data.name || '';
  return {
    id: doc.id,
    slug: data.slug || slugify(name || doc.id),
    name,
    category: data.category || 'ONG & Acolhimento',
    address: data.address || '',
    city: data.city || 'Fortaleza',
    state: data.state || 'CE',
    description: data.description || data.short_description || '',
    image: data.image_url || data.image || '',
    tags: splitList(data.tags),
    badges: splitList(data.badges),
    rating: Number(data.rating ?? 0),
    reviews: Number(data.reviews ?? 0),
    price: data.price,
    phone: data.phone,
    website: data.website,
    mapUrl: data.source_url || data.link || data.mapUrl,
    status: data.status === 'draft' || data.status === 'hidden' ? 'hidden' : 'published',
    source: 'admin',
  };
}

export function applySafeSpaceOverride(space: SafeSpace, override?: Partial<SafeSpaceOverride>): SafeSpace {
  if (!override) return space;
  return {
    ...space,
    name: override.name || space.name,
    category: override.category || space.category,
    address: override.address || space.address,
    city: override.city || space.city,
    state: override.state || space.state,
    description: override.description || space.description,
    image: override.image || space.image,
    tags: override.tags?.length ? override.tags : space.tags,
    badges: override.badges?.length ? override.badges : space.badges,
    rating: typeof override.rating === 'number' ? override.rating : space.rating,
    reviews: typeof override.reviews === 'number' ? override.reviews : space.reviews,
    price: override.price || space.price,
    phone: override.phone || space.phone,
    website: override.website || space.website,
    mapUrl: override.mapUrl || space.mapUrl,
    status: override.status || space.status,
  };
}

export function safeSpaceToOverride(space: SafeSpace): SafeSpaceOverride {
  return {
    slug: space.slug,
    name: space.name,
    category: space.category,
    address: space.address,
    city: space.city,
    state: space.state,
    description: space.description,
    image: space.image,
    tags: space.tags,
    badges: space.badges,
    rating: space.rating,
    reviews: space.reviews,
    price: space.price,
    phone: space.phone,
    website: space.website,
    mapUrl: space.mapUrl,
    status: space.status,
  };
}

export interface UseSafeSpacesResult {
  spaces: SafeSpace[];
  loading: boolean;
  error: string | null;
}

export function useSafeSpaces(): UseSafeSpacesResult {
  const [spaces, setSpaces] = useState<SafeSpace[]>(staticSafeSpaces);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [placesSnapshot, overridesSnapshot] = await Promise.all([
          getDocs(collection(db, 'places')),
          getDocs(collection(db, 'safe_space_overrides')),
        ]);
        if (!active) return;

        const adminSpaces = placesSnapshot.docs
          .map(firestorePlaceToSafeSpace)
          .filter((space) => space.status === 'published');
        const adminSlugs = new Set(adminSpaces.map((space) => space.slug));
        const overrides = new Map(
          overridesSnapshot.docs.map((doc) => [doc.id, doc.data() as Partial<SafeSpaceOverride>]),
        );

        const controlledStaticSpaces = staticSafeSpaces
          .filter((space) => !adminSlugs.has(space.slug))
          .map((space) => applySafeSpaceOverride(space, overrides.get(space.slug)))
          .filter((space) => space.status === 'published');

        setSpaces([...adminSpaces, ...controlledStaticSpaces]);
      } catch (err) {
        if (!active) return;
        console.error('Erro ao buscar espaços seguros:', err);
        setSpaces(staticSafeSpaces);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { spaces, loading, error };
}
