/**
 * Agente de Eventos LGBTQIA+ - Orquestrador Principal
 */

import { ScraperManager } from './scrapers/manager.js';
import { AIProcessor } from './processors/ai.js';
import { FirebasePublisher } from './publishers/firebase.js';
import { AgentConfig, AgentReport, ProcessedEvent } from './types.js';

export class EventAgent {
  private scraperManager: ScraperManager;
  private aiProcessor: AIProcessor;
  private firebasePublisher: FirebasePublisher;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.scraperManager = new ScraperManager(config);
    this.aiProcessor = new AIProcessor(process.env.OPENAI_API_KEY);
    this.firebasePublisher = new FirebasePublisher(config.eventsLimitPerFortnight);
  }

  async run(): Promise<AgentReport> {
    console.log('='.repeat(60));
    console.log('🎉 AGENTE DE EVENTOS LGBTQIA+ - PORTAL FORTALEZA');
    console.log('='.repeat(60));
    console.log(`📅 Data: ${new Date().toISOString()}`);
    console.log(`🎯 Cidade foco: ${this.config.cityFocus} (${this.config.stateFocus})`);
    console.log(`📊 Limite quinzenal: ${this.config.eventsLimitPerFortnight} eventos`);
    console.log('='.repeat(60));

    const report: AgentReport = {
      runDate: new Date().toISOString(),
      eventsFound: 0,
      eventsProcessed: 0,
      eventsPublished: 0,
      errors: [],
      sources: [],
    };

    try {
      // Etapa 1: Scraping
      console.log('\n[ETAPA 1] 🔍 Buscando eventos...');
      const rawEvents = await this.scraperManager.scrapeAll();
      report.eventsFound = rawEvents.length;
      report.sources = this.scraperManager.getAvailableSources().map((source) => ({
        source,
        found: rawEvents.filter((e) => e.source === source).length,
        processed: 0,
        published: 0,
      }));

      if (rawEvents.length === 0) {
        console.log('\n⚠️ Nenhum evento encontrado. Finalizando.');
        return report;
      }

      // Etapa 2: Processamento com IA
      console.log('\n[ETAPA 2] 🧠 Processando eventos...');
      const processedEvents: ProcessedEvent[] = [];

      for (const rawEvent of rawEvents) {
        const processed = await this.processSingleEvent(rawEvent);
        processedEvents.push(processed);
        report.eventsProcessed++;
      }

      // Etapa 3: Publicação no Firebase
      console.log('\n[ETAPA 3] 📤 Publicando eventos...');

      // Verifica quantos já foram publicados na quinzena
      const alreadyPublished = await this.firebasePublisher.getPublishedCountThisFortnight();
      const remainingSlots = Math.max(0, this.config.eventsLimitPerFortnight - alreadyPublished);

      console.log(`📊 Já publicados na quinzena: ${alreadyPublished}`);
      console.log(`📊 Slots restantes: ${remainingSlots}`);

      if (remainingSlots > 0) {
        // Ordena por relevância (eventos com mais tags primeiro)
        const sortedEvents = processedEvents
          .filter((e) => e.startDate && new Date(e.startDate) >= new Date())
          .sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));

        const eventsToPublish = sortedEvents.slice(0, remainingSlots);
        const results = await this.firebasePublisher.publishEvents(eventsToPublish);

        report.eventsPublished = results.filter((r) => r.success).length;

        // Atualiza sources no relatório
        for (const result of results) {
          const event = eventsToPublish.find((e) => e.slug === result.slug);
          if (event) {
            const sourceReport = report.sources.find((s) => s.source === event.source);
            if (sourceReport) {
              sourceReport.published++;
            }
          }
        }
      } else {
        console.log('\n⚠️ Limite quinzenal atingido. Pulando publicação.');
      }

      // Salva relatório
      await this.firebasePublisher.logRun(report);

      // Exibe resumo
      this.printSummary(report);

      return report;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('\n❌ ERRO NA EXECUÇÃO:', errorMsg);
      report.errors.push(errorMsg);
      return report;
    }
  }

  private async processSingleEvent(rawEvent: Parameters<typeof this.aiProcessor.processEvents>[0][0]): Promise<ProcessedEvent> {
    const processed = await this.aiProcessor.processEvents([rawEvent]);
    return processed[0];
  }

  private printSummary(report: AgentReport): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA EXECUÇÃO');
    console.log('='.repeat(60));
    console.log(`📅 Data: ${report.runDate}`);
    console.log(`🔍 Eventos encontrados: ${report.eventsFound}`);
    console.log(`🧠 Eventos processados: ${report.eventsProcessed}`);
    console.log(`✅ Eventos publicados: ${report.eventsPublished}`);
    console.log(`❌ Erros: ${report.errors.length}`);

    if (report.sources.length > 0) {
      console.log('\n📡 Por fonte:');
      for (const source of report.sources) {
        console.log(`   ${source.source}: ${source.found} encontrados, ${source.published} publicados`);
      }
    }

    if (report.errors.length > 0) {
      console.log('\n⚠️ Erros:');
      for (const error of report.errors.slice(0, 5)) {
        console.log(`   - ${error.substring(0, 100)}`);
      }
    }

    console.log('='.repeat(60));
  }

  // Métodos auxiliares para CLI
  async scrapeOnly(): Promise<void> {
    console.log('🔍 Modo: Apenas scraping (sem publicação)');
    const events = await this.scraperManager.scrapeAll();
    console.log(`\n📊 Total encontrado: ${events.length} eventos`);
  }

  async scrapeAndProcess(): Promise<ProcessedEvent[]> {
    console.log('🔍🧠 Modo: Scraping + Processamento (sem publicação)');
    const rawEvents = await this.scraperManager.scrapeAll();
    const processedEvents = await this.aiProcessor.processEvents(rawEvents);
    console.log(`\n📊 Processados: ${processedEvents.length} eventos`);
    return processedEvents;
  }
}

// Configuração padrão
export const defaultConfig: AgentConfig = {
  cityFocus: 'Fortaleza',
  stateFocus: 'CE',
  eventsLimitPerFortnight: 12,
  scrapeFrequencyDays: 14,
  sources: [],
};

// Factory para criar agente
export function createAgent(config?: Partial<AgentConfig>): EventAgent {
  return new EventAgent({ ...defaultConfig, ...config });
}
