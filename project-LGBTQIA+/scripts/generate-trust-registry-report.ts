import fs from 'fs';
import path from 'path';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORT_FILE = path.resolve('trust-registry', 'reports', 'pilot-fortaleza-report.md');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function generateReport() {
  console.log('Generating Pilot Report...');
  
  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const validations = loadJson('validations.json');
  const reviewQueue = loadJson('review-queue.json');

  let report = `# Relatório do Piloto de Confiança - Fortaleza CE\n\n`;
  report += `Gerado em: ${new Date().toISOString()}\n\n`;

  report += `## Resumo\n`;
  report += `- Fontes pesquisadas: ${sources.length}\n`;
  report += `- Organizações encontradas: ${orgs.length}\n`;
  report += `- Serviços cadastrados: ${services.length}\n`;
  report += `- Evidências: ${evidence.length}\n`;
  report += `- Validações completas: ${validations.length}\n`;
  report += `- Itens na Fila de Revisão: ${reviewQueue.length}\n\n`;

  report += `## Fontes Pesquisadas\n`;
  sources.forEach((s: any) => {
    report += `- **${s.name}** (${s.url}) - Status: ${s.status}\n`;
  });
  report += `\n`;

  report += `## Organizações Encontradas\n`;
  orgs.forEach((o: any) => {
    report += `- **${o.name}** [${o.type}] - Status: ${o.status}\n`;
  });
  report += `\n`;

  report += `## Serviços Cadastrados\n`;
  services.forEach((s: any) => {
    report += `- **${s.name}** - Categoria: ${s.category.join(', ')} - Status: ${s.status}\n`;
  });
  report += `\n`;

  report += `## Fila de Revisão e Limitações\n`;
  reviewQueue.forEach((rq: any) => {
    report += `### ${rq.entity_name} (${rq.entity_type})\n`;
    report += `- **Recomendação do Agente**: ${rq.agent_recommendation}\n`;
    report += `- **Campos Ausentes**: ${rq.missing_fields.join(', ')}\n`;
    report += `- **Riscos Identificados**: ${rq.risks.join(' | ')}\n`;
    report += `- **Perguntas Pendentes para Humanos**:\n`;
    rq.pending_questions.forEach((q: string) => {
      report += `  - ${q}\n`;
    });
    report += `\n`;
  });

  report += `## Próximos Passos\n`;
  report += `- Realizar a verificação humana (human_decision_pending) para as entidades na fila.\n`;
  report += `- Levantar e preencher os dados ausentes diretamente com as instituições, conforme recomendado.\n`;
  report += `- Promover itens para \`verified_basic\` apenas com a assinatura em \`validations.json\`.\n`;

  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, report, 'utf8');

  console.log(`Report successfully written to ${REPORT_FILE}`);
}

generateReport().catch(err => {
  console.error(err);
  process.exit(1);
});
