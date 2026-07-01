/**
 * Eventbrite Scraper - Busca eventos no Eventbrite
 *
 * A busca do Eventbrite é uma SPA React: o HTML inicial baixado por `axios`
 * vem vazio, os cards só existem depois do JavaScript rodar. Por isso usamos
 * um navegador real (Puppeteer) e filtramos por palavras-chave LGBTQIA+
 * depois de carregar a listagem geral da cidade (a busca por categoria
 * "lgbt" da própria plataforma mistura resultados irrelevantes).
 */

import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

interface EventbriteCardData {
  href: string;
  title: string;
  location: string;
  category: string;
  dateText: string;
  imageUrl?: string;
}

export class EventbriteScraper extends BaseScraper {
  private apiKey?: string;

  constructor(cityFocus: string, stateFocus: string, apiKey?: string) {
    super('eventbrite', cityFocus, stateFocus);
    this.apiKey = apiKey;
  }

  async scrape(): Promise<RawEvent[]> {
    const citySlug = this.buildCitySlug();
    const url = `https://www.eventbrite.com.br/d/brazil--${citySlug}/all-events/`;

    console.log(`🔍 Eventbrite: Buscando eventos em "${citySlug}"`);

    try {
      const cards = await this.withRenderedPage(url, async (page) => {
        return page.evaluate(() => {
          const containers = Array.from(document.querySelectorAll('.event-card'));
          return containers.map((container) => {
            const link = container.querySelector('a.event-card-link') as HTMLAnchorElement | null;
            const img = container.querySelector('img');
            return {
              href: link?.href || '',
              title: container.querySelector('h3')?.textContent?.trim() || '',
              location: link?.getAttribute('data-event-location') || '',
              category: link?.getAttribute('data-event-category') || '',
              dateText: container.querySelector('p')?.textContent?.trim() || '',
              imageUrl: img?.getAttribute('src') || undefined,
            };
          });
        });
      });

      const seenUrls = new Set<string>();
      const events = cards
        .filter((card) => {
          if (!card.href || !card.title || seenUrls.has(card.href)) return false;
          seenUrls.add(card.href);
          return this.isLgbtqiaEvent(card.title + ' ' + card.category);
        })
        .map((card) => this.toRawEvent(card));

      console.log(`✅ Eventbrite: ${cards.length} eventos na listagem, ${events.length} relevantes LGBTQIA+`);
      return events.map((e) => this.normalizeEvent(e));
    } catch (error) {
      console.error('❌ Erro ao buscar Eventbrite:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private buildCitySlug(): string {
    return this.cityFocus
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
  }

  private toRawEvent(card: EventbriteCardData): RawEvent {
    const { startDate, endDate } = this.extractDates(card.dateText);
    const { startTime, endTime } = this.extractTimes(card.dateText);

    return {
      source: this.source,
      sourceUrl: card.href,
      title: this.cleanTitle(card.title),
      description: card.dateText,
      imageUrl: card.imageUrl,
      startDate,
      endDate,
      startTime,
      endTime,
      location: card.location || undefined,
      city: this.cityFocus,
      state: this.stateFocus,
      rawData: { dateText: card.dateText, category: card.category, source: 'eventbrite' },
    };
  }

  private cleanTitle(title: string): string {
    return title.trim().replace(/\s+/g, ' ').substring(0, 200);
  }
}
