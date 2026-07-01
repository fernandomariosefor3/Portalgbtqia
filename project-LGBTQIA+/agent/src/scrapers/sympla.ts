/**
 * Sympla Scraper - Busca eventos na Sympla (plataforma brasileira)
 *
 * A listagem de eventos da Sympla é renderizada via JavaScript (React/Next.js),
 * então precisa de um navegador real (Puppeteer) — `axios` sozinho só recebe
 * o HTML inicial vazio. Também não há mais busca por palavra-chave (`/procurar`
 * foi descontinuado); a listagem funciona por cidade, filtrada aqui por
 * palavras-chave LGBTQIA+.
 */

import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

interface SymplaCardData {
  href: string;
  title: string;
  location: string;
  dateText: string;
  imageUrl?: string;
}

export class SymplaScraper extends BaseScraper {
  constructor(cityFocus: string, stateFocus: string) {
    super('sympla', cityFocus, stateFocus);
  }

  async scrape(): Promise<RawEvent[]> {
    const citySlug = this.buildCitySlug();
    const url = `https://www.sympla.com.br/eventos/${citySlug}`;

    console.log(`🔍 Sympla: Buscando eventos em "${citySlug}"`);

    try {
      const cards = await this.withRenderedPage(url, async (page) => {
        return page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a.sympla-card'));
          return anchors.map((a) => {
            const img = a.querySelector('img');
            return {
              href: (a as HTMLAnchorElement).href,
              title: a.getAttribute('data-name') || a.querySelector('h3')?.textContent?.trim() || '',
              location: a.querySelector('p')?.textContent?.trim() || '',
              dateText: a.textContent?.trim() || '',
              imageUrl: img?.getAttribute('src') || undefined,
            };
          });
        });
      });

      const events = cards
        .filter((card) => card.title && this.isLgbtqiaEvent(card.title + ' ' + card.dateText))
        .map((card) => this.toRawEvent(card));

      console.log(`✅ Sympla: ${cards.length} eventos na listagem, ${events.length} relevantes LGBTQIA+`);
      return events.map((e) => this.normalizeEvent(e));
    } catch (error) {
      console.error('❌ Erro ao buscar Sympla:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private buildCitySlug(): string {
    const normalized = this.cityFocus
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
    return `${normalized}-${this.stateFocus.toLowerCase()}`;
  }

  private toRawEvent(card: SymplaCardData): RawEvent {
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
      priceInfo: undefined,
      rawData: { dateText: card.dateText, source: 'sympla' },
    };
  }

  private cleanTitle(title: string): string {
    return title.trim().replace(/\s+/g, ' ').substring(0, 200);
  }
}
