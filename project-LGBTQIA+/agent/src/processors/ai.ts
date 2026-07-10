/**
 * AI Processor - Enriquecimento de eventos usando OpenAI
 */

import OpenAI from 'openai';
import { RawEvent, ProcessedEvent, EventCategory } from '../types.js';

export class AIProcessor {
  private openai: OpenAI | null = null;
  private useAI: boolean;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.useAI = true;
      console.log('🤖 AI Processor: OpenAI configurado');
    } else {
      this.useAI = false;
      console.log('⚠️ AI Processor: Sem OpenAI, usando regras básicas');
    }
  }

  async processEvents(rawEvents: RawEvent[]): Promise<ProcessedEvent[]> {
    const processedEvents: ProcessedEvent[] = [];

    console.log(`\n🧠 Processando ${rawEvents.length} eventos...`);

    for (const rawEvent of rawEvents) {
      try {
        const processed = await this.processEvent(rawEvent);
        processedEvents.push(processed);
        console.log(`✅ Processado: "${processed.title.substring(0, 50)}..."`);
      } catch (error) {
        console.error(`❌ Erro ao processar: "${rawEvent.title.substring(0, 30)}..."`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    console.log(`\n📊 Total processado: ${processedEvents.length} eventos`);

    return processedEvents;
  }

  private async processEvent(rawEvent: RawEvent): Promise<ProcessedEvent> {
    // Gera slug
    const slug = this.generateSlug(rawEvent.title);

    // Gera descrição curta
    const shortDescription = this.generateShortDescription(rawEvent.description);

    // Detecta categoria
    const category = await this.detectCategory(rawEvent.title, rawEvent.description);

    // Extrai tags
    const tags = this.extractTags(rawEvent.title, rawEvent.description);

    // Se tem OpenAI, melhora os dados
    if (this.useAI && this.openai) {
      try {
        const enhanced = await this.enhanceWithAI(rawEvent);
        return {
          title: enhanced.title || rawEvent.title,
          slug: enhanced.slug || slug,
          description: enhanced.description || rawEvent.description,
          shortDescription: enhanced.shortDescription || shortDescription,
          category: enhanced.category || category,
          location: rawEvent.location,
          address: rawEvent.address,
          city: rawEvent.city || 'Fortaleza',
          state: rawEvent.state || 'CE',
          startDate: rawEvent.startDate,
          endDate: rawEvent.endDate,
          startTime: rawEvent.startTime,
          endTime: rawEvent.endTime,
          imageUrl: rawEvent.imageUrl,
          sourceUrl: rawEvent.sourceUrl,
          status: 'approved' as const,
          organizer: rawEvent.organizer,
          contactEmail: rawEvent.contactEmail,
          contactPhone: rawEvent.contactPhone,
          priceInfo: rawEvent.priceInfo || 'Gratuito',
          tags: enhanced.tags || tags,
          source: rawEvent.source,
          publishedAt: new Date().toISOString(),
        };
      } catch {
        console.warn('⚠️ Enhancement AI falhou, usando dados processados localmente');
      }
    }

    // Fallback: usa processamento local
    return {
      title: rawEvent.title,
      slug,
      description: rawEvent.description,
      shortDescription,
      category,
      location: rawEvent.location,
      address: rawEvent.address,
      city: rawEvent.city || 'Fortaleza',
      state: rawEvent.state || 'CE',
      startDate: rawEvent.startDate,
      endDate: rawEvent.endDate,
      startTime: rawEvent.startTime,
      endTime: rawEvent.endTime,
      imageUrl: rawEvent.imageUrl,
      sourceUrl: rawEvent.sourceUrl,
      status: 'approved',
      organizer: rawEvent.organizer,
      contactEmail: rawEvent.contactEmail,
      contactPhone: rawEvent.contactPhone,
      priceInfo: rawEvent.priceInfo || 'Gratuito',
      tags,
      source: rawEvent.source,
      publishedAt: new Date().toISOString(),
    };
  }

  private async enhanceWithAI(rawEvent: RawEvent): Promise<Partial<ProcessedEvent>> {
    if (!this.openai) return {};

    const prompt = `Analise o seguinte evento LGBTQIA+ e extraia informações enrichment:

Título: ${rawEvent.title}
Descrição: ${rawEvent.description || 'Não disponível'}
Local: ${rawEvent.location || 'Não disponível'}
Fonte: ${rawEvent.sourceUrl}

Responda em JSON com:
- title: título melhorado (máx 100 chars)
- description: descrição expandida (máx 300 chars)
- shortDescription: resumo curto (máx 150 chars)
- tags: array de 3-5 tags relevantes
- category: categoria (parada, festa, cultura, saude, educacao, visibilidade, encontro)

Responda apenas em português brasileiro.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '{}';

    try {
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60);
  }

  private generateShortDescription(description?: string): string {
    if (!description) return '';
    const cleaned = description.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= 160) return cleaned;
    return cleaned.substring(0, 157) + '...';
  }

  private async detectCategory(title: string, description?: string): Promise<EventCategory> {
    const text = (title + ' ' + (description || '')).toLowerCase();

    if (text.includes('parada') || text.includes('marcha') || text.includes('orgulho') || text.includes('pride')) {
      return 'parada';
    }
    if (text.includes('festa') || text.includes('ball') || text.includes('baile') || text.includes('party') || text.includes('balada')) {
      return 'festa';
    }
    if (text.includes('drag') || text.includes('show') || text.includes('teatro') || text.includes('cinema') || text.includes('exposição') || text.includes('música') || text.includes('musica')) {
      return 'cultura';
    }
    if (text.includes('saude') || text.includes('prep') || text.includes('teste') || text.includes('mental') || text.includes('hormônio') || text.includes('sus')) {
      return 'saude';
    }
    if (text.includes('educação') || text.includes('palestra') || text.includes('workshop') || text.includes('capacitação') || text.includes('curso')) {
      return 'educacao';
    }
    if (text.includes('visibilidade') || text.includes('dia da') || text.includes('semana')) {
      return 'visibilidade';
    }

    return 'encontro';
  }

  private extractTags(title: string, description?: string): string[] {
    const text = (title + ' ' + (description || '')).toLowerCase();
    const tags: string[] = [];

    const tagRules: [string, string[]][] = [
      ['lgbtq', ['lgbtq', 'lgbt', 'lgbtqia+', 'lgbtqia']],
      ['trans', ['trans', 'transexual', 'travesti', 'nao-binario', 'nao binario', 'travesti']],
      ['gay', ['gay', 'homossexual', 'homem gay']],
      ['lesbica', ['lesbica', 'lesbian', 'sapatao', 'sapatão', 'mulher lésbica']],
      ['bissexual', ['bissexual', 'bi', 'pansexual']],
      ['drag', ['drag', 'queen', 'king', 'drag queen', 'drag king']],
      ['parada', ['parada', 'marcha', 'pride']],
      ['fortaleza', ['fortaleza']],
      ['ceara', ['ceara', 'ceará', 'cearense']],
      ['nordeste', ['nordeste']],
      ['saude', ['saude', 'saúde', 'prep', 'pep', 'mental', 'hiv']],
      ['cultura', ['cultura', 'arte', 'musica', 'música', 'cinema', 'teatro']],
      ['familia', ['familia', 'família', 'pais', 'filhos', 'homoparental']],
      ['direitos', ['direitos', 'politica', 'política', 'lei', 'civil']],
      ['juventude', ['jovem', 'juventude', 'adolescente', 'jovens']],
    ];

    for (const [tag, keywords] of tagRules) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        tags.push(tag);
      }
    }

    // Garante que tem pelo menos 2 tags
    if (tags.length < 2) {
      tags.push('evento');
      if (tags.length < 2) tags.push('comunidade');
    }

    // Limita a 6 tags
    return [...new Set(tags)].slice(0, 6);
  }
}
