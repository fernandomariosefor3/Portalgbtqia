import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  Timestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// Event types
export interface Event {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  category: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  image_url?: string;
  source_url?: string;
  status: string;
  organizer?: string;
  contact_email?: string;
  contact_phone?: string;
  price_info?: string;
  tags: string[];
  createdAt?: string;
}

// Funções puras de processamento (slug, categoria, tags) ficam em
// ./eventHelpers para permitir testes unitários sem inicializar o Firebase.
// Re-exportadas aqui para manter a API pública existente.
export {
  generateSlug,
  generateShortDescription,
  autoCategorize,
  autoTags,
} from './eventHelpers';

// Events CRUD operations
export async function createEvent(eventData: Omit<Event, 'id' | 'createdAt'>): Promise<string> {
  const eventsRef = collection(db, 'events');
  const docRef = await addDoc(eventsRef, {
    ...eventData,
    createdAt: Timestamp.now().toDate().toISOString(),
  });
  return docRef.id;
}

export async function getEvents(filters?: {
  category?: string;
  city?: string;
  limit?: number;
}): Promise<Event[]> {
  const eventsRef = collection(db, 'events');

  const constraints: QueryConstraint[] = [];

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters?.city) {
    constraints.push(where('city', '==', filters.city));
  }

  constraints.push(where('status', '==', 'approved'));
  constraints.push(orderBy('start_date', 'asc'));

  if (filters?.limit) {
    constraints.push(limit(filters.limit));
  }

  const q = query(eventsRef, ...constraints);

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Event;
}

export async function getEventById(id: string): Promise<Event | null> {
  const eventRef = doc(db, 'events', id);
  const snapshot = await getDoc(eventRef);

  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() } as Event;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
  const eventRef = doc(db, 'events', id);
  await updateDoc(eventRef, data);
}

export async function deleteEvent(id: string): Promise<void> {
  const eventRef = doc(db, 'events', id);
  await deleteDoc(eventRef);
}

// Check if event slug already exists
export async function checkEventSlugExists(slug: string): Promise<boolean> {
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// Articles operations (future expansion)
export interface Article {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category: string;
  subcategory?: string;
  author_id?: string;
  author_name?: string;
  featured_image?: string;
  published_at?: string;
  status: string;
  tags: string[];
  views?: number;
  createdAt?: string;
}

export async function getArticles(filters?: {
  category?: string;
  limit?: number;
}): Promise<Article[]> {
  const articlesRef = collection(db, 'articles');
  const constraints: QueryConstraint[] = [where('status', '==', 'published')];

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }

  constraints.push(orderBy('published_at', 'desc'));

  if (filters?.limit) {
    constraints.push(limit(filters.limit));
  }

  const q = query(articlesRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articlesRef = collection(db, 'articles');
  const q = query(articlesRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Article;
}