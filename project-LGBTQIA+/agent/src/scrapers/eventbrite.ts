/**
 * Eventbrite Scraper - Busca eventos no Eventbrite
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

export class EventbriteScraper extends BaseScraper {
  private apiKey?: string;

  constructor(cityFocus: string, stateFocus: string, apiKey?: string) {
    super('eventbrite', cityFocus, stateFocus);
    this.apiKey = apiKey;
  }

  async scrape(): Promise<RawEvent[]> {
    const events: RawEvent[] = [];

    try {
      // Busca eventos LGBTQIA+ no Brasil
      const searchQueries = [
        'lgbt events',
        'pride events',
        'drag events',
        'queer events',
      ];

      for (const query of searchQueries) {
        console.log(`🔍 Eventbrite: Buscando "${query}"`);

        const url = `https://www.eventbrite.com/d/brazil--fortaleza/events--${query}/?page=1`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          },
          timeout: 15000,
        });

        const $ = cheerio.load(response.data);

        // Procura cards de eventos
        $('[data-testid="search-results"] .eds-event-card').each((_, element) => {
          const $el = $(element);

          const title = $el.find('[data-testid="ed-tile-title"]').text().trim() ||
                       $el.find('h2').first().text().trim();
          const link = $el.find('a').first().attr('href') || '';
          const description = $el.find('.event-card-description').text().trim() ||
                            $el.find('p').first().text().trim();
          const dateText = $el.find('[data-testid="ed-tile-date"]').text().trim() ||
                          $el.find('.event-date').text().trim();
          const location = $el.find('.event-location').text().trim() ||
                          $el.find('[data-testid="ed-tile-location"]').text().trim();
          const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');

          if (title && link) {
            const { startDate, endDate } = this.extractDates(dateText + ' ' + description);
            const { startTime, endTime } = this.extractTimes(dateText);

            events.push({
              source: this.source,
              sourceUrl: link.startsWith('http') ? link : `https://www.eventbrite.com${link}`,
              title: this.cleanTitle(title),
              description: this.cleanDescription(description),
              imageUrl: image,
              startDate,
              endDate,
              startTime,
              endTime,
              location: location ? this.cleanLocation(location) : undefined,
              city: this.cityFocus,
              state: this.stateFocus,
              rawData: { dateText, source: 'eventbrite' },
            });
          }
        });

        await this.delay(1500);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar Eventbrite:', error instanceof Error ? error.message : 'Unknown error');
    }

    return events.map((e) => this.normalizeEvent(e));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private cleanTitle(title: string): string {
    return title.trim().replace(/\s+/g, ' ').substring(0, 200);
  }

  private cleanDescription(text: string): string {
    return text.trim().replace(/\s+/g, ' ').substring(0, 500);
  }

  private cleanLocation(location: string): string {
    return location.trim().replace(/\s+/g, ' ');
  }
}
