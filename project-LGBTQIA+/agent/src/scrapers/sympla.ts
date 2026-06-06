/**
 * Sympla Scraper - Busca eventos na Sympla (plataforma brasileira)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

export class SymplaScraper extends BaseScraper {
  constructor(cityFocus: string, stateFocus: string) {
    super('sympla', cityFocus, stateFocus);
  }

  async scrape(): Promise<RawEvent[]> {
    const events: RawEvent[] = [];

    try {
      // Busca na Sympla por eventos em Fortaleza/CE
      const searchQueries = [
        'lgbt-fortaleza',
        'diversidade-fortaleza',
        'orgulho-fortaleza',
        'drag-fortaleza',
      ];

      for (const query of searchQueries) {
        console.log(`🔍 Sympla: Buscando "${query}"`);

        const url = `https://www.sympla.com.br/procurar?q=${encodeURIComponent(query)}`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 15000,
        });

        const $ = cheerio.load(response.data);

        // Procura cards de eventos
        $('.card-event').each((_, element) => {
          const $el = $(element);

          const title = $el.find('.event-title').text().trim() ||
                       $el.find('h3').first().text().trim() ||
                       $el.find('[class*="title"]').first().text().trim();
          const link = $el.find('a').first().attr('href') || '';
          const description = $el.find('.event-description').text().trim() ||
                            $el.find('.event-excerpt').text().trim();
          const dateText = $el.find('.event-date').text().trim() ||
                          $el.find('[class*="date"]').first().text().trim();
          const location = $el.find('.event-location').text().trim() ||
                          $el.find('[class*="location"]').first().text().trim();
          const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
          const priceText = $el.find('.event-price').text().trim() ||
                          $el.find('[class*="price"]').first().text().trim();

          if (title) {
            const { startDate, endDate } = this.extractDates(dateText + ' ' + description);
            const { startTime, endTime } = this.extractTimes(dateText);

            events.push({
              source: this.source,
              sourceUrl: link.startsWith('http') ? link : `https://www.sympla.com.br${link}`,
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
              priceInfo: this.cleanPrice(priceText),
              rawData: { dateText, source: 'sympla' },
            });
          }
        });

        await this.delay(1500);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar Sympla:', error instanceof Error ? error.message : 'Unknown error');
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

  private cleanPrice(priceText: string): string {
    if (!priceText) return 'Gratuito';
    const cleaned = priceText.trim().toLowerCase();
    if (cleaned.includes('grátis') || cleaned.includes('free') || cleaned === '') {
      return 'Gratuito';
    }
    return priceText.trim();
  }
}
