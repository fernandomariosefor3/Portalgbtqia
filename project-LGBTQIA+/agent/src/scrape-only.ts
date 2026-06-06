/**
 * Script de Scraping Apenas - Não requer Firebase
 * Para testar os scrapers sem publicar nada
 */

import { ScraperManager } from './scrapers/manager.js';
import { AIProcessor } from './processors/ai.js';
import { AgentConfig } from './types.js';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega variáveis de ambiente
dotenv.config({ path: resolve(__dirname, '.env') });

async function main() {
  console.log('='.repeat(60));
  console.log('🔍 SCRAPING APENAS - TESTE DO AGENTE');
  console.log('='.repeat(60));
  console.log(`📅 Data: ${new Date().toISOString()}`);
  console.log(`📍 Cidade foco: ${process.env.CITY_FOCUS || 'Fortaleza'}`);
  console.log('='.repeat(60));

  const config: AgentConfig = {
    cityFocus: process.env.CITY_FOCUS || 'Fortaleza',
    stateFocus: process.env.STATE_FOCUS || 'CE',
    eventsLimitPerWeek: parseInt(process.env.EVENTS_LIMIT_PER_WEEK || '10'),
    scrapeFrequencyDays: parseInt(process.env.SCRAPE_FREQUENCY_DAYS || '7'),
    sources: [],
  };

  try {
    // Inicializa apenas o scraper manager
    const scraperManager = new ScraperManager(config);
    const aiProcessor = new AIProcessor(process.env.OPENAI_API_KEY);

    console.log('\n[ETAPA 1] 🔍 Buscando eventos...');
    const rawEvents = await scraperManager.scrapeAll();

    console.log(`\n📊 Total encontrado: ${rawEvents.length} eventos`);

    if (rawEvents.length === 0) {
      console.log('\n⚠️ Nenhum evento encontrado.');
      return;
    }

    console.log('\n[ETAPA 2] 🧠 Processando eventos (apenas os primeiros 5)...');
    const sampleEvents = rawEvents.slice(0, 5);
    const processedEvents = await aiProcessor.processEvents(sampleEvents);

    console.log('\n📋 EVENTOS ENCONTRADOS:');
    console.log('='.repeat(60));

    for (let i = 0; i < processedEvents.length; i++) {
      const event = processedEvents[i];
      console.log(`\n${i + 1}. ${event.title}`);
      console.log(`   📍 Local: ${event.location || 'N/A'}`);
      console.log(`   📅 Data: ${event.startDate || 'N/A'}`);
      console.log(`   🏷️ Categoria: ${event.category}`);
      console.log(`   🏷️ Tags: ${event.tags?.join(', ')}`);
      console.log(`   🔗 Fonte: ${event.source}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Scraping concluído!');
    console.log(`📊 Total de eventos encontrados: ${rawEvents.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERRO:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();