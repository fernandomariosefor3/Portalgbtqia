/**
 * Meetup Scraper - Busca eventos LGBTQIA+ no Meetup
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

export class MeetupScraper extends BaseScraper {
  private apiKey?: string;

  constructor(cityFocus: string, stateFocus: string, apiKey?: string) {
    super('meetup', cityFocus, stateFocus);
    this.apiKey = apiKey;
  }

  async scrape(): Promise<RawEvent[]> {
    const events: RawEvent[] = [];

    // Busca eventos LGBTQIA+ no Meetup (via web scraping)
    const searchQueries = [
      'LGBT Fort',
      'Pride Brazil',
      'Queer Fort',
      'LGBTQ Fort',
    ];

    for (const query of searchQueries) {
      try {
        console.log(`🔍 Meetup: Buscando "${query}"`);

        const url = `https://www.meetup.com/find/events/?keywords=${encodeURIComponent(query)}&location=fortaleza`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          },
          timeout: 15000,
        });

        const $ = cheerio.load(response.data);

        // Procura cards de eventos
        $('[data-testid="search-event-card"], .event-card, .listing-card').each((_, element) => {
          const $el = $(element);

          const title = $el.find('h3, [data-testid="event-title"], a').first().text().trim();
          const link = $el.find('a').first().attr('href') || '';
          const description = $el.find('p, .description, .excerpt').first().text().trim();
          const dateText = $el.find('[data-testid="event-date"], time, .date').text().trim();
          const location = $el.find('[data-testid="event-venue"], .venue, .location').text().trim();
          const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');

          if (title) {
            const { startDate, endDate } = this.extractDates(dateText + ' ' + description);
            const { startTime, endTime } = this.extractTimes(dateText);

            events.push({
              source: this.source,
              sourceUrl: link.startsWith('http') ? link : `https://www.meetup.com${link}`,
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
              rawData: { dateText, source: 'meetup' },
            });
          }
        });

        await this.delay(2000);
      } catch (error) {
        console.error('❌ Erro ao buscar Meetup:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return events.map((e) => this.normalizeEvent(e));
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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}