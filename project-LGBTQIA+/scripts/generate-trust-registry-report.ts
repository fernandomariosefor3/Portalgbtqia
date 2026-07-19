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

  const allEntities = [...sources, ...orgs, ...services];
  const physicalRecordsCount = allEntities.length;

  const aliases = allEntities.filter(e => e.status === 'archived' || (e.description && e.description.includes('canonicalServiceId')));
  const canonicalEntities = allEntities.filter(e => e.status !== 'archived' && !(e.description && e.description.includes('canonicalServiceId')));

  const sourcesCount = sources.length;
  const orgsCount = orgs.length;
  const physicalServicesCount = services.length;
  const canonicalServices = services.filter((e: any) => e.status !== 'archived' && !(e.description && e.description.includes('canonicalServiceId')));
  const canonicalServicesCount = canonicalServices.length;

  const approvedBasic = validations.filter((v: any) => v.decision === 'approved_basic');
  const needsMoreEvidence = validations.filter((v: any) => v.decision === 'needs_more_evidence');
  const correctionRequired = validations.filter((v: any) => v.decision === 'correction_required');
  const blocked = validations.filter((v: any) => v.decision === 'blocked');
  const rejected = validations.filter((v: any) => v.decision === 'rejected');

  const entitiesWithValidation = new Set(validations.map((v: any) => v.entityId));
  const noDecision = canonicalEntities.filter(e => !entitiesWithValidation.has(e.id));

  const now = new Date();
  const expiredValidations = validations.filter((v: any) => v.validUntil && new Date(v.validUntil) < now);
  const pendingSecondReview = validations.filter((v: any) => v.internalNotes && v.internalNotes.includes('requiresSecondReview: true'));

  const promotedEntities = allEntities.filter(e => e.status === 'verified_basic' || e.status === 'validated' || e.status === 'partner');
  const unpublishableEntities = aliases.length; // E outras se houver regras fixas
  
  const underReviewCount = allEntities.filter(e => e.status === 'under_review').length;

  let report = `# Relatório do Piloto de Confiança - Fortaleza CE\n\n`;
  report += `Gerado em: ${new Date().toISOString()}\n\n`;

  report += `## Resumo Estrutural\n`;
  report += `- Registros físicos totais: ${physicalRecordsCount}\n`;
  report += `- Entidades canônicas: ${canonicalEntities.length}\n`;
  report += `- Aliases e históricos: ${aliases.length}\n`;
  report += `- Fontes físicas: ${sourcesCount}\n`;
  report += `- Organizações físicas: ${orgsCount}\n`;
  report += `- Serviços físicos: ${physicalServicesCount}\n`;
  report += `- Serviços canônicos: ${canonicalServicesCount}\n`;
  report += `- Evidências cadastradas: ${evidence.length}\n\n`;

  report += `## Decisões Humanas (Validações)\n`;
  report += `- \`approved_basic\`: ${approvedBasic.length}\n`;
  report += `- \`needs_more_evidence\`: ${needsMoreEvidence.length}\n`;
  report += `- \`correction_required\`: ${correctionRequired.length}\n`;
  report += `- \`blocked\`: ${blocked.length}\n`;
  report += `- \`rejected\`: ${rejected.length}\n`;
  report += `- Entidades sem decisão independente: ${noDecision.length + aliases.length} (incluindo aliases)\n\n`;

  report += `## Status e Elegibilidade\n`;
  report += `- Registros preservados em \`under_review\`: ${underReviewCount}\n`;
  report += `- Registros arquivados (\`archived\`): ${aliases.length}\n`;
  report += `- Validações vencidas: ${expiredValidations.length}\n`;
  report += `- Registros exigindo segunda revisão (pendente): ${pendingSecondReview.length}\n`;
  report += `- Entidades promovidas automaticamente (verified/partner): ${promotedEntities.length}\n`;
  report += `- Entidades publicáveis no momento: 0 (A Fase 5A definirá elegibilidade)\n`;
  report += `- Entidades não publicáveis (aliases/históricos protegidos): ${unpublishableEntities}\n\n`;
  report += `> **Nota de Elegibilidade:** A elegibilidade para promoção de \`under_review\` para \`verified_basic\` ainda não foi calculada nesta parte. Não deve-se antecipar os resultados antes do Motor de Elegibilidade (Fase 5A).\n\n`;

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

  report += `## Serviços\n`;
  services.forEach((s: any) => {
    const isAlias = s.status === 'archived' ? ' (Alias/Legado)' : '';
    report += `- **${s.name}**${isAlias} - Categoria: ${s.category.join(', ')} - Status: ${s.status}\n`;
  });
  report += `\n`;

  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, report, 'utf8');

  console.log(`Report successfully written to ${REPORT_FILE}`);
}

generateReport().catch(err => {
  console.error(err);
  process.exit(1);
});
