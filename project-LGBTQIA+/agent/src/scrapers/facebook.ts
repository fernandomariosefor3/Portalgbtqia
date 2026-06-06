/**
 * Facebook Events Scraper - Busca eventos públicos no Facebook
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

export class FacebookScraper extends BaseScraper {
  constructor(cityFocus: string, stateFocus: string) {
    super('facebook', cityFocus, stateFocus);
  }

  async scrape(): Promise<RawEvent[]> {
    const events: RawEvent[] = [];

    try {
      // Busca eventos públicos no Facebook
      const searchQueries = [
        'LGBT events Fortaleza',
        'Pride events Fortaleza Ceará',
        'Drag show Fortaleza',
        'Queer events Ceará',
        'LGBTQIA+ events Brazil',
      ];

      for (const query of searchQueries) {
        console.log(`🔍 Facebook: Buscando "${query}"`);

        const url = `https://www.facebook.com/search/events/?q=${encodeURIComponent(query)}`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          },
          timeout: 15000,
        });

        const $ = cheerio.load(response.data);

        // Procura cards de eventos
        $('[role="article"], .x1lliihq').each((_, element) => {
          const $el = $(element);

          const title = $el.find('h2, h3, [role="heading"]').first().text().trim();
          const link = $el.find('a').first().attr('href') || '';
          const description = $el.find('p, [role="presentation"]').first().text().trim();
          const dateText = $el.find('[aria-label*="data"], [aria-label*="Data"]').text().trim() ||
                          $el.find('span').filter((_, el) => $(el).text().match(/\d{1,2}[\/\-]\d{1,2}/)).first().text().trim();
          const location = $el.find('[aria-label*="local"], [aria-label*="Local"]').text().trim();
          const image = $el.find('img').attr('src');

          if (title && (this.isLgbtqiaEvent(title) || this.isLgbtqiaEvent(description))) {
            const { startDate, endDate } = this.extractDates(dateText + ' ' + description);
            const { startTime, endTime } = this.extractTimes(dateText);

            if (link) {
              const cleanLink = link.split('?')[0]; // Remove query params

              events.push({
                source: this.source,
                sourceUrl: cleanLink.startsWith('http') ? cleanLink : `https://www.facebook.com${cleanLink}`,
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
                rawData: { dateText, source: 'facebook' },
              });
            }
          }
        });

        await this.delay(2000);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar Facebook:', error instanceof Error ? error.message : 'Unknown error');
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
}
