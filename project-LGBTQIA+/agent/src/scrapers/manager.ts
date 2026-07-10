/**
 * Scraper Manager - Orquestra todos os scrapers
 */

import { GoogleSearchScraper } from './google.js';
import { EventbriteScraper } from './eventbrite.js';
import { SymplaScraper } from './sympla.js';
import { InstagramScraper } from './instagram.js';
import { FacebookScraper } from './facebook.js';
import { MeetupScraper } from './meetup.js';
import { RawEvent, EventSource, AgentConfig } from '../types.js';

export class ScraperManager {
  private scrapers: Map<EventSource, { scrape(): Promise<RawEvent[]> }> = new Map();
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.initializeScrapers();
  }

  private initializeScrapers(): void {
    const { cityFocus, stateFocus, sources } = this.config;

    // Google Search - sempre ativo
    if (sources.includes('google_search') || sources.length === 0) {
      this.scrapers.set('google_search', new GoogleSearchScraper(cityFocus, stateFocus));
    }

    // Eventbrite
    if (sources.includes('eventbrite') || sources.length === 0) {
      this.scrapers.set('eventbrite', new EventbriteScraper(cityFocus, stateFocus));
    }

    // Sympla
    if (sources.includes('sympla') || sources.length === 0) {
      this.scrapers.set('sympla', new SymplaScraper(cityFocus, stateFocus));
    }

    // Instagram
    if (sources.includes('instagram') || sources.length === 0) {
      const instagramToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      this.scrapers.set('instagram', new InstagramScraper(cityFocus, stateFocus, instagramToken));
    }

    // Facebook
    if (sources.includes('facebook') || sources.length === 0) {
      this.scrapers.set('facebook', new FacebookScraper(cityFocus, stateFocus));
    }

    // Meetup
    if (sources.includes('meetup') || sources.length === 0) {
      this.scrapers.set('meetup', new MeetupScraper(cityFocus, stateFocus));
    }

    console.log(`📡 Inicializados ${this.scrapers.size} scrapers`);
  }

  async scrapeAll(): Promise<RawEvent[]> {
    const allEvents: RawEvent[] = [];
    const seenSlugs = new Set<string>();

    console.log('\n🚀 Iniciando scraping de eventos LGBTQIA+...\n');

    for (const [source, scraper] of this.scrapers) {
      try {
        console.log(`\n📡 Processando fonte: ${source}`);
        const events = await scraper.scrape();

        // Remove duplicatas
        const uniqueEvents = events.filter((event) => {
          const slug = this.generateSlug(event.title);
          if (seenSlugs.has(slug)) {
            return false;
          }
          seenSlugs.add(slug);
          return true;
        });

        console.log(`✅ ${source}: ${uniqueEvents.length} eventos encontrados`);
        allEvents.push(...uniqueEvents);
      } catch (error) {
        console.error(`❌ Erro no scraper ${source}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    console.log(`\n📊 Total de eventos encontrados: ${allEvents.length}`);

    return allEvents;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  async scrapeSource(source: EventSource): Promise<RawEvent[]> {
    const scraper = this.scrapers.get(source);
    if (!scraper) {
      console.warn(`⚠️ Scraper não encontrado para: ${source}`);
      return [];
    }

    return scraper.scrape();
  }

  getAvailableSources(): EventSource[] {
    return Array.from(this.scrapers.keys());
  }
}
