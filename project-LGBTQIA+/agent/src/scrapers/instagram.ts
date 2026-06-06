/**
 * Instagram Scraper - Busca eventos de perfis LGBTQIA+ no Instagram
 */

import axios from 'axios';
import { BaseScraper } from './base.js';
import { RawEvent } from '../types.js';

export class InstagramScraper extends BaseScraper {
  private accessToken?: string;

  constructor(cityFocus: string, stateFocus: string, accessToken?: string) {
    super('instagram', cityFocus, stateFocus);
    this.accessToken = accessToken;
  }

  async scrape(): Promise<RawEvent[]> {
    const events: RawEvent[] = [];

    // Perfis LGBTQIA+ conhecidos em Fortaleza/CE para monitorar
    const profilesToMonitor = [
      'pridefortaleza',
      'dragspicefortaleza',
      'casapopfortaleza',
      'barloucofortaleza',
      'clubefort',
      'ceara_lgbt',
    ];

    if (!this.accessToken) {
      console.log('⚠️ Instagram: Sem access token, usando busca web...');
      return this.scrapeWeb();
    }

    for (const username of profilesToMonitor) {
      try {
        console.log(`🔍 Instagram: Buscando @${username}`);
        const profileEvents = await this.scrapeProfile(username);
        events.push(...profileEvents);
      } catch (error) {
        console.error(`❌ Instagram: Erro ao buscar @${username}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return events.map((e) => this.normalizeEvent(e));
  }

  private async scrapeProfile(username: string): Promise<RawEvent[]> {
    const events: RawEvent[] = [];

    try {
      // Usa a GraphQL API do Instagram
      const response = await axios.get(
        `https://graph.instagram.com/v18.0/${username}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,children',
            access_token: this.accessToken,
          },
          timeout: 10000,
        }
      );

      for (const post of response.data.data || []) {
        // Procura posts que parecem ser eventos
        const caption = post.caption || '';
        if (this.looksLikeEvent(caption)) {
          const { startDate, endDate } = this.extractDates(caption);
          const { startTime, endTime } = this.extractTimes(caption);

          if (startDate) {
            events.push({
              source: this.source,
              sourceUrl: post.permalink,
              title: this.extractTitle(caption),
              description: caption,
              imageUrl: post.media_url || post.thumbnail_url,
              startDate,
              endDate,
              startTime,
              endTime,
              location: this.extractLocation(caption),
              city: this.cityFocus,
              state: this.stateFocus,
              rawData: { username, postId: post.id },
            });
          }
        }
      }
    } catch (error) {
      console.error(`❌ Instagram: Erro ao buscar perfil ${username}:`, error instanceof Error ? error.message : 'Unknown error');
    }

    return events;
  }

  private async scrapeWeb(): Promise<RawEvent[]> {
    // Fallback: busca informações de eventos LGBTQIA+ via web scraping do Instagram
    const events: RawEvent[] = [];

    try {
      // Busca hashtags relevantes no Instagram
      const hashtags = [
        'fortalezapride',
        'lgbtfortaleza',
        'dragfortaleza',
        'prideceara',
        'lgbtqiafortaleza',
      ];

      for (const hashtag of hashtags) {
        console.log(`🔍 Instagram Web: Buscando #${hashtag}`);

        const url = `https://www.instagram.com/explore/tags/${hashtag}/`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9',
          },
          timeout: 15000,
        });

        // O Instagram usa JavaScript rendering, então scraping direto é limitado
        // Este é um fallback - para produção, use a API oficial
        await this.delay(1500);
      }
    } catch (error) {
      console.error('❌ Instagram Web: Erro ao buscar:', error instanceof Error ? error.message : 'Unknown error');
    }

    return events;
  }

  private looksLikeEvent(text: string): boolean {
    const eventKeywords = [
      'evento',
      'festa',
      'show',
      'sábado',
      'sexta',
      'domingo',
      'quinta',
      'quarta',
      'terça',
      'segunda',
      'data',
      'horário',
      'local',
      'ingressos',
      'vai rolar',
      'acontece',
      'convida',
    ];

    const textLower = text.toLowerCase();
    const keywordCount = eventKeywords.filter((kw) => textLower.includes(kw)).length;

    return keywordCount >= 2;
  }

  private extractTitle(caption: string): string {
    // Extrai a primeira linha ou primeira frase como título
    const lines = caption.split('\n').filter((l) => l.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length <= 100) {
        return firstLine;
      }
      return firstLine.substring(0, 97) + '...';
    }
    return caption.substring(0, 100);
  }

  private extractLocation(text: string): string | undefined {
    const patterns = [
      /local[:\s]+([^\n]+)/i,
      /endereço[:\s]+([^\n]+)/i,
      /onde[:\s]+([^\n]+)/i,
      /(?:Av|Rua|Alameda|Praça|Shopping|Centro)[^,\n]+/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return undefined;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}