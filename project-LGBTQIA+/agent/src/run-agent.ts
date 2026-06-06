/**
 * Script de inicialização do agente
 * Executa o agente completo de forma autônoma
 */

import { createAgent } from './index.js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carrega variáveis de ambiente
dotenv.config({ path: resolve(__dirname, '.env') });

async function main() {
  console.log('='.repeat(60));
  console.log('🤖 AGENTE DE EVENTOS LGBTQIA+ - EXECUÇÃO AUTÔNOMA');
  console.log('='.repeat(60));
  console.log(`⏰ Iniciado em: ${new Date().toISOString()}`);
  console.log(`📍 Cidade foco: ${process.env.CITY_FOCUS || 'Fortaleza'}`);
  console.log(`📊 Limite semanal: ${process.env.EVENTS_LIMIT_PER_WEEK || 10} eventos`);
  console.log('='.repeat(60));

  try {
    // Cria agente com configuração do ambiente
    const agent = createAgent({
      cityFocus: process.env.CITY_FOCUS || 'Fortaleza',
      stateFocus: process.env.STATE_FOCUS || 'CE',
      eventsLimitPerWeek: parseInt(process.env.EVENTS_LIMIT_PER_WEEK || '10'),
      scrapeFrequencyDays: parseInt(process.env.SCRAPE_FREQUENCY_DAYS || '7'),
      sources: [],
    });

    // Executa o agente completo
    const report = await agent.run();

    // Salva relatório
    console.log('\n📝 Salvando relatório...');
    console.log(`✅ Execução concluída com sucesso!`);
    console.log(`📊 Eventos encontrados: ${report.eventsFound}`);
    console.log(`📊 Eventos publicados: ${report.eventsPublished}`);

    if (report.errors.length > 0) {
      console.log('\n⚠️ Erros encontrados:');
      report.errors.forEach((err) => console.log(`   - ${err.substring(0, 100)}`));
    }

    process.exit(report.errors.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ ERRO FATAL:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();