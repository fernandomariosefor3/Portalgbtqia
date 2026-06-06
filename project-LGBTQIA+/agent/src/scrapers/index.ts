/**
 * Instagram Scraper - Busca eventos em perfis públicos do Instagram
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

export class InstagramScraper extends BaseScraper {
  private accessToken?: string;
  private targetProfiles: string[];

  constructor(cityFocus: string, stateFocus: string, accessToken?: string) {
    super('instagram', cityFocus, stateFocus);
    this.accessToken = accessToken;

    this.targetProfiles = [
      'paradalgbtfortaleza',
      'coletivodiversidade',
      'ifce.diversidade',
      'dragshowceara',
      'orgulhoceara',
      'cearalgbt',
      'transfortaleza',
      'familialgbtceara',
    ];
  }

  async scrape(): Promise<RawEvent[]> {
    if (this.accessToken) {
      return this.scrapeWithAPI();
    }
    return this.scrapeWithWebScraping();
  }

  private async scrapeWithAPI(): Promise<RawEvent[]> {
    const events: RawEvent[] = [];

    for (const profile of this.targetProfiles) {
      try {
        console.log(`🔍 Instagram: Buscando @${profile}`);

        const userUrl = `https://graph.facebook.com/v18.0/${profile}?fields=name,username,media_count&access_token=${this.accessToken}`;
        const userResponse = await axios.get(userUrl, { timeout: 10000 });
        const userId = userResponse.data.id;

        if (userId) {
          const mediaUrl = `https://graph.facebook.com/v18.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&limit=20&access_token=${this.accessToken}`;
          const mediaResponse = await axios.get(mediaUrl, { timeout: 10000 });
          const mediaItems = mediaResponse.data.data || [];

          for (const item of mediaItems) {
            const caption = item.caption || '';

            if (this.isLgbtqiaEvent(caption) && this.isRelevantCity(caption)) {
              const { startDate, endDate } = this.extractDates(caption);
              const { startTime, endTime } = this.extractTimes(caption);

              if (startDate || this.hasEventKeywords(caption)) {
                events.push({
                  source: this.source,
                  sourceUrl: item.permalink || '',
                  title: this.extractTitleFromCaption(caption),
                  description: caption.substring(0, 500),
                  imageUrl: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url,
                  startDate,
                  endDate,
                  startTime,
                  endTime,
                  location: this.extractLocationFromCaption(caption),
                  city: this.cityFocus,
                  state: this.stateFocus,
                  rawData: {
                    instagramId: item.id,
                    mediaType: item.media_type,
                    timestamp: item.timestamp,
                  },
                });
              }
            }
          }
        }

        await this.delay(2000);
      } catch (error) {
        console.error(`❌ Erro @${profile}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return events.map((e) => this.normalizeEvent(e));
  }

  private async scrapeWithWebScraping(): Promise<RawEvent[]> {
    console.log('⚠️ Instagram: Sem access token, buscando via Google');
    const { GoogleSearchScraper } = await import('./google.js');
    const scraper = new GoogleSearchScraper(this.cityFocus, this.stateFocus);
    const googleEvents = await scraper.scrape();

    return googleEvents
      .filter((e) => e.sourceUrl.includes('instagram.com'))
      .map((e) => ({ ...e, source: 'instagram' as const }));
  }

  private hasEventKeywords(text: string): boolean {
    const keywords = ['quando', 'data', 'horário', 'horas', 'local', 'onde', 'evento', 'fest', 'parada', 'encontro', 'marcha'];
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) => lowerText.includes(keyword));
  }

  private extractTitleFromCaption(caption: string): string {
    const lines = caption.split('\n');
    const firstLine = lines[0]?.trim() || 'Evento Instagram';
    return firstLine.replace(/#\w+/g, '').replace(/https?:\/\/\S+/g, '').trim().substring(0, 200);
  }

  private extractLocationFromCaption(caption: string): string | undefined {
    const patterns = [
      /local[:\s]+(.+?)(?:\n|$)/i,
      /📍\s*(.+?)(?:\n|$)/,
      /(?:Av|Rua|Alameda|Praça)[^,\n]+/i,
    ];

    for (const pattern of patterns) {
      const match = caption.match(pattern);
      if (match) return match[1].trim();
    }
    return undefined;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
