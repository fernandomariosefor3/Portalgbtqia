/**
 * Base Scraper - Classe abstrata para scrapers de eventos
 */

import { RawEvent, EventSource } from '../types.js';

export abstract class BaseScraper {
  protected source: EventSource;
  protected cityFocus: string;
  protected stateFocus: string;

  constructor(source: EventSource, cityFocus: string, stateFocus: string) {
    this.source = source;
    this.cityFocus = cityFocus;
    this.stateFocus = stateFocus;
  }

  abstract scrape(): Promise<RawEvent[]>;

  protected isRelevantCity(text: string): boolean {
    const searchText = text.toLowerCase();
    const cities = [
      this.cityFocus.toLowerCase(),
      'fortaleza',
      'ceará',
      'ceara',
      'nordeste',
    ];

    return cities.some((city) => searchText.includes(city));
  }

  protected isLgbtqiaEvent(text: string): boolean {
    const keywords = [
      'lgbt',
      'lgbtq',
      'lgbtqia',
      'queer',
      'drag',
      'trans',
      'gay',
      'lésbica',
      'lesbica',
      'bissexual',
      'orgulho',
      'parada',
      'diversity',
      'pride',
      'travesti',
      'não-binário',
      'nao binario',
      'bicha',
      'sapatão',
      'sapatão',
    ];

    const searchText = text.toLowerCase();
    return keywords.some((keyword) => searchText.includes(keyword));
  }

  protected extractDates(text: string): { startDate?: string; endDate?: string } {
    const datePatterns = [
      // DD/MM/YYYY ou DD-MM-YYYY
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
      // YYYY-MM-DD
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g,
      // Apenas DD/MM
      /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/g,
    ];

    const now = new Date();

    for (const pattern of datePatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        const match = matches[0];
        let year: number, month: number, day: number;

        if (match[3] && match[3].length === 4) {
          // YYYY-MM-DD
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else if (match[3] && match[1].length === 4) {
          // YYYY-MM-DD (formato invertido)
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else {
          // DD/MM ou DD/MM/YY
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = match[3]
            ? parseInt(match[3].length === 2 ? `20${match[3]}` : match[3])
            : now.getFullYear();
        }

        try {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            const startDate = date.toISOString().split('T')[0];

            if (matches.length > 1) {
              const match2 = matches[1];
              let year2: number, month2: number, day2: number;

              if (match2[3] && match2[3].length === 4) {
                year2 = parseInt(match2[1]);
                month2 = parseInt(match2[2]);
                day2 = parseInt(match2[3]);
              } else {
                day2 = parseInt(match2[1]);
                month2 = parseInt(match2[2]);
                year2 = match2[3]
                  ? parseInt(match2[3].length === 2 ? `20${match2[3]}` : match2[3])
                  : now.getFullYear();
              }

              const endDateObj = new Date(year2, month2 - 1, day2);
              if (!isNaN(endDateObj.getTime())) {
                return { startDate, endDate: endDateObj.toISOString().split('T')[0] };
              }
            }

            return { startDate };
          }
        } catch {
          continue;
        }
      }
    }

    return {};
  }

  protected extractTimes(text: string): { startTime?: string; endTime?: string } {
    const timePattern = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(h|horas|hours|:)?/gi;
    const matches = [...text.matchAll(timePattern)];

    if (matches.length > 0) {
      const startTime = `${matches[0][1].padStart(2, '0')}:${matches[0][2]}`;

      if (matches.length > 1) {
        const endTime = `${matches[1][1].padStart(2, '0')}:${matches[1][2]}`;
        return { startTime, endTime };
      }

      return { startTime };
    }

    return {};
  }

  protected normalizeEvent(rawEvent: RawEvent): RawEvent {
    // Normaliza cidade e estado
    if (!rawEvent.city && rawEvent.location) {
      if (rawEvent.location.toLowerCase().includes('fortaleza')) {
        rawEvent.city = 'Fortaleza';
        rawEvent.state = 'CE';
      }
    }

    if (!rawEvent.state && rawEvent.location) {
      if (
        rawEvent.location.toLowerCase().includes('ceará') ||
        rawEvent.location.toLowerCase().includes('ceara')
      ) {
        rawEvent.state = 'CE';
      }
    }

    // Garante que tem cidade e estado do foco
    if (!rawEvent.city) {
      rawEvent.city = this.cityFocus;
    }
    if (!rawEvent.state) {
      rawEvent.state = this.stateFocus;
    }

    return rawEvent;
  }
}
