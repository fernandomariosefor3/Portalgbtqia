/**
 * Tipos e interfaces para o Agente de Eventos LGBTQIA+
 */

export interface RawEvent {
  source: EventSource;
  sourceUrl: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  priceInfo?: string;
  rawData: Record<string, unknown>;
}

export interface ProcessedEvent {
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category: EventCategory;
  location?: string;
  address?: string;
  city: string;
  state: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  imageUrl?: string;
  sourceUrl?: string;
  status: EventStatus;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  priceInfo?: string;
  tags: string[];
  source: EventSource;
  publishedAt?: string;
}

export type EventSource =
  | 'instagram'
  | 'facebook'
  | 'eventbrite'
  | 'sympla'
  | 'google_search'
  | 'manual';

export type EventCategory =
  | 'parada'
  | 'festa'
  | 'cultura'
  | 'saude'
  | 'educacao'
  | 'visibilidade'
  | 'encontro';

export type EventStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'published';

export interface ScrapingResult {
  source: EventSource;
  events: RawEvent[];
  errors: string[];
  timestamp: string;
}

export interface AgentConfig {
  cityFocus: string;
  stateFocus: string;
  eventsLimitPerWeek: number;
  scrapeFrequencyDays: number;
  sources: EventSource[];
}

export interface PublishResult {
  success: boolean;
  eventId?: string;
  slug: string;
  error?: string;
}

export interface AgentReport {
  runDate: string;
  eventsFound: number;
  eventsProcessed: number;
  eventsPublished: number;
  errors: string[];
  sources: {
    source: EventSource;
    found: number;
    processed: number;
    published: number;
  }[];
}
