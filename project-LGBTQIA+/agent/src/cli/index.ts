/**
 * CLI do Agente de Eventos - Interface de linha de comando
 */

import { createAgent, defaultConfig, EventAgent } from '../index.js';

interface CLICommands {
  run: boolean;
  scrape: boolean;
  process: boolean;
  test: boolean;
  config?: Partial<typeof defaultConfig>;
}

function parseArgs(): { command: string; options: Record<string, string | boolean> } {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  const options: Record<string, string | boolean> = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = true;
      }
    }
  }

  return { command, options };
}

async function main() {
  const { command, options } = parseArgs();

  console.log('🎉 Agente de Eventos LGBTQIA+ - CLI');
  console.log('='.repeat(40));

  switch (command) {
    case 'run':
    case 'start':
      console.log('🚀 Executando agente completo...\n');
      await runAgent(options);
      break;

    case 'scrape':
      console.log('🔍 Modo: Apenas scraping...\n');
      await scrapeOnly(options);
      break;

    case 'process':
      console.log('🧠 Modo: Scraping + Processamento...\n');
      await scrapeAndProcess(options);
      break;

    case 'config':
      showConfig(options);
      break;

    case 'help':
      showHelp();
      break;

    default:
      console.log(`❓ Comando desconhecido: ${command}`);
      showHelp();
  }
}

async function runAgent(options: Record<string, string | boolean>) {
  const config = {
    cityFocus: (options.city as string) || defaultConfig.cityFocus,
    stateFocus: (options.state as string) || defaultConfig.stateFocus,
    eventsLimitPerWeek: parseInt(options.limit as string) || defaultConfig.eventsLimitPerWeek,
    scrapeFrequencyDays: defaultConfig.scrapeFrequencyDays,
    sources: defaultConfig.sources,
  };

  const agent = createAgent(config);
  const report = await agent.run();

  if (report.errors.length > 0) {
    process.exit(1);
  }
}

async function scrapeOnly(_options: Record<string, string | boolean>) {
  const agent = createAgent();
  await agent.scrapeOnly();
}

async function scrapeAndProcess(_options: Record<string, string | boolean>) {
  const agent = createAgent();
  const events = await agent.scrapeAndProcess();

  console.log('\n📋 Primeiros 5 eventos processados:');
  for (let i = 0; i < Math.min(5, events.length); i++) {
    const event = events[i];
    console.log(`\n${i + 1}. ${event.title}`);
    console.log(`   Slug: ${event.slug}`);
    console.log(`   Categoria: ${event.category}`);
    console.log(`   Tags: ${event.tags?.join(', ')}`);
    console.log(`   Data: ${event.startDate || 'N/A'}`);
    console.log(`   Fonte: ${event.source}`);
  }
}

function showConfig(options: Record<string, string | boolean>) {
  console.log('\n⚙️ Configuração atual:');
  console.log(JSON.stringify(defaultConfig, null, 2));

  if (options.set && options.value) {
    console.log(`\n💡 Para alterar ${options.set}, edite src/index.ts`);
  }
}

function showHelp() {
  console.log(`
📖 COMANDOS DISPONÍVEIS:

  npm run dev              Executa o agente completo
  npm run scrape           Apenas busca eventos
  npm run process          Busca e processa (sem publicar)

  node dist/cli/index.js run --city "Fortaleza" --limit 10

⚙️ OPÇÕES:

  --city <nome>      Cidade foco (padrão: Fortaleza)
  --state <sigla>    Estado foco (padrão: CE)
  --limit <número>   Limite de eventos por semana (padrão: 10)
  --sources          Fontes específicas (google, eventbrite, etc.)

📋 EXEMPLOS:

  # Executar com configurações padrão
  npm run dev

  # Apenas buscar eventos de Fortaleza
  npm run scrape

  # Executar com limite customizado
  node dist/cli/index.js run --city "Recife" --limit 5

🔧 VARIÁVEIS DE AMBIENTE (.env):

  FIREBASE_PROJECT_ID=seu_projeto
  FIREBASE_CLIENT_EMAIL=seu_email
  FIREBASE_PRIVATE_KEY=sua_chave
  OPENAI_API_KEY=sua_chave_openai
`);
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
