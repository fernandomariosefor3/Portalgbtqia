/**
 * Google Search Scraper - Busca eventos via Google
 * Usa scraping de páginas de resultados do Google
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

export class GoogleSearchScraper extends BaseScraper {
  private searchQueries: string[];

  constructor(cityFocus: string, stateFocus: string) {
    super('google_search', cityFocus, stateFocus);

    // Queries otimizadas para buscar eventos LGBTQIA+ em Fortaleza
    this.searchQueries = [
      `eventos LGBTQIA+ Fortaleza 2026`,
      `eventos LGBT Fortaleza ${new Date().getFullYear()}`,
      `parada orgulho gay Fortaleza`,
      `eventos drag show Fortaleza`,
      `festa LGBTQIA+ Ceará`,
      `encontro LGBT Ceará`,
      `eventos orgulho transgender Fortaleza`,
      `cinema queer Fortaleza eventos`,
      `saúde LGBTQIA+ eventos Ceará`,
      `cultura drag Ceará eventos`,
      `marcha orgulho Fortaleza`,
      `festa pride Nordeste`,
      `eventos comunidade LGBTQIA+ Ceará`,
      `balada LGBT Fortaleza`,
      `workshop LGBTQIA+ Ceará`,
    ];
  }

  async scrape(): Promise<RawEvent[]> {
    const events: RawEvent[] = [];
    const seenUrls = new Set<string>();

    for (const query of this.searchQueries) {
      try {
        console.log(`🔍 Buscando: "${query}"`);

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=br&num=10`;

        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          },
          timeout: 15000,
        });

        const $ = cheerio.load(response.data);

        // Encontra cards de eventos na busca
        $('div.g').each((_, element) => {
          const link = $(element).find('a').attr('href');
          const title = $(element).find('h3').text();
          const snippet = $(element).find('div[data-sncf]').text() || $(element).find('span').text();

          if (link && title && this.isLgbtqiaEvent(title + ' ' + snippet)) {
            // Filtra URLs válidas
            if (
              link.startsWith('http') &&
              !link.includes('google.com') &&
              !seenUrls.has(link)
            ) {
              seenUrls.add(link);

              const { startDate, endDate } = this.extractDates(title + ' ' + snippet);
              const { startTime, endTime } = this.extractTimes(title + ' ' + snippet);

              // Verifica se é relevante para Fortaleza/CE
              const isRelevant =
                this.isRelevantCity(title + ' ' + snippet + ' ' + link) ||
                this.isLgbtqiaEvent(title);

              if (isRelevant) {
                events.push({
                  source: this.source,
                  sourceUrl: link,
                  title: this.cleanTitle(title),
                  description: this.cleanDescription(snippet),
                  imageUrl: this.extractImageUrl($, element),
                  startDate,
                  endDate,
                  startTime,
                  endTime,
                  location: this.extractLocation(snippet),
                  city: this.cityFocus,
                  state: this.stateFocus,
                  rawData: {
                    query,
                    snippet,
                  },
                });
              }
            }
          }
        });

        // Respeita rate limit
        await this.delay(2000);
      } catch (error) {
        console.error(`❌ Erro ao buscar "${query}":`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return events.map((e) => this.normalizeEvent(e));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private cleanTitle(title: string): string {
    return title
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\|.*$/, '')
      .replace(/—.*$/, '')
      .trim();
  }

  private cleanDescription(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, 500);
  }

  private extractLocation(text: string): string | undefined {
    const locationPatterns = [
      /em\s+([^,]+)/i,
      /local[:\s]+([^,]+)/i,
      /endereço[:\s]+([^,]+)/i,
      /(?:Av|Rua|Alameda|Praça)\s+[^,]+/i,
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return undefined;
  }

  private extractImageUrl($: cheerio.CheerioAPI, element: cheerio.Element): string | undefined {
    const imgElement = $(element).find('img');
    const src = imgElement.attr('src');
    const dataSrc = imgElement.attr('data-src');

    if (src && src.startsWith('http')) {
      return src;
    }
    if (dataSrc && dataSrc.startsWith('http')) {
      return dataSrc;
    }

    return undefined;
  }
}
