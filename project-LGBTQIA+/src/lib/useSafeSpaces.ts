import { useEffect, useState } from 'react';
import { collection, getDocs, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import {
  safeSpaceCategoryImages,
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
  verificationLevel?: SafeSpace['verificationLevel'];
  distanceKm?: number;
  accessibility?: string[];
  wifi?: boolean;
  openNow?: boolean;
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

function isSafeSpaceCategory(value: unknown): value is SafeSpaceCategory {
  return typeof value === 'string' && value in safeSpaceCategoryImages;
}

function imageForCategory(category: SafeSpaceCategory) {
  return safeSpaceCategoryImages[category] || safeSpaceCategoryImages['ONG & Acolhimento'];
}

function normalizeSafeSpaceImage(image: unknown, category: SafeSpaceCategory) {
  if (typeof image !== 'string' || !image.trim() || image.includes('readdy.ai')) {
    return imageForCategory(category);
  }
  return image;
}

function firestorePlaceToSafeSpace(doc: QueryDocumentSnapshot<DocumentData>): SafeSpace {
  const data = doc.data();
  const name = data.title || data.name || '';
  const category = isSafeSpaceCategory(data.category) ? data.category : 'ONG & Acolhimento';
  return {
    id: doc.id,
    slug: data.slug || slugify(name || doc.id),
    name,
    category,
    address: data.address || '',
    city: data.city || 'Fortaleza',
    state: data.state || 'CE',
    description: data.description || data.short_description || '',
    image: normalizeSafeSpaceImage(data.image_url || data.image, category),
    tags: splitList(data.tags),
    badges: splitList(data.badges),
    rating: Number(data.rating ?? 0),
    reviews: Number(data.reviews ?? 0),
    price: data.price,
    verificationLevel: Number(data.verificationLevel || 1) as SafeSpace['verificationLevel'],
    distanceKm: Number(data.distanceKm || 0),
    accessibility: splitList(data.accessibility),
    wifi: Boolean(data.wifi),
    openNow: Boolean(data.openNow),
    phone: data.phone,
    website: data.website,
    mapUrl: data.source_url || data.link || data.mapUrl,
    status: data.status === 'draft' || data.status === 'hidden' ? 'hidden' : 'published',
    source: 'admin',
  };
}

export function applySafeSpaceOverride(space: SafeSpace, override?: Partial<SafeSpaceOverride>): SafeSpace {
  if (!override) return space;
  const category = override.category || space.category;
  return {
    ...space,
    name: override.name || space.name,
    category,
    address: override.address || space.address,
    city: override.city || space.city,
    state: override.state || space.state,
    description: override.description || space.description,
    image: normalizeSafeSpaceImage(override.image || space.image, category),
    tags: override.tags?.length ? override.tags : space.tags,
    badges: override.badges?.length ? override.badges : space.badges,
    rating: typeof override.rating === 'number' ? override.rating : space.rating,
    reviews: typeof override.reviews === 'number' ? override.reviews : space.reviews,
    price: override.price || space.price,
    verificationLevel: override.verificationLevel || space.verificationLevel,
    distanceKm: typeof override.distanceKm === 'number' ? override.distanceKm : space.distanceKm,
    accessibility: override.accessibility?.length ? override.accessibility : space.accessibility,
    wifi: typeof override.wifi === 'boolean' ? override.wifi : space.wifi,
    openNow: typeof override.openNow === 'boolean' ? override.openNow : space.openNow,
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
    verificationLevel: space.verificationLevel,
    distanceKm: space.distanceKm,
    accessibility: space.accessibility,
    wifi: space.wifi,
    openNow: space.openNow,
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
