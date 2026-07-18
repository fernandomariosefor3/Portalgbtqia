import fs from 'fs';
import path from 'path';
import { evaluatePromotionEligibility, PromotionContext } from '../trust-registry/lib/promotionEligibility.js';
import { PromotionEligibilityResult, CURRENT_POLICY_VERSION } from '../trust-registry/lib/promotionPolicies.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORT_FILE = path.resolve('trust-registry', 'reports', 'promotion-eligibility-report.md');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function run() {
  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const validations = loadJson('validations.json');

  const asOf = new Date(); // To ensure determinism during a single run

  const context: PromotionContext = {
    registry: { sources, organizations: orgs, services, evidence, validations },
    asOf,
    computedEligibility: new Map()
  };

  const results: PromotionEligibilityResult[] = [];

  for (const s of sources) {
    results.push(evaluatePromotionEligibility(s, 'source', context));
  }
  for (const o of orgs) {
    results.push(evaluatePromotionEligibility(o, 'organization', context));
  }
  for (const s of services) {
    results.push(evaluatePromotionEligibility(s, 'service', context));
  }

  // Generate Report
  let report = `# Relatório de Elegibilidade para Promoção (Fase 5A)\n\n`;
  report += `- **Data de Avaliação:** ${asOf.toISOString()}\n`;
  report += `- **Versão da Política:** ${CURRENT_POLICY_VERSION}\n\n`;

  const eligible = results.filter(r => r.eligible);
  const requireSecondReview = results.filter(r => !r.eligible && r.blockingReasons.includes('SECOND_REVIEW_MISSING'));
  const needsMoreEvidence = results.filter(r => !r.eligible && r.blockingReasons.includes('NEEDS_MORE_EVIDENCE'));
  const notPublishable = results.filter(r => !r.eligible && r.blockingReasons.includes('LEGACY_ALIAS_NOT_PUBLIC'));
  const expiredOrStale = results.filter(r => !r.eligible && (r.blockingReasons.includes('VALIDATION_EXPIRED') || r.blockingReasons.includes('EVIDENCE_EXPIRED') || r.blockingReasons.includes('STALE_REVIEW_PACKET')));

  report += `## Resumo Totais\n`;
  report += `- Entidades Avaliadas: ${results.length}\n`;
  report += `- Fontes Elegíveis: ${eligible.filter(r => r.entityType === 'source').length}\n`;
  report += `- Organizações Elegíveis: ${eligible.filter(r => r.entityType === 'organization').length}\n`;
  report += `- Serviços Elegíveis: ${eligible.filter(r => r.entityType === 'service').length}\n`;
  report += `- Exigindo Segunda Revisão: ${requireSecondReview.length}\n`;
  report += `- Em \`needs_more_evidence\`: ${needsMoreEvidence.length}\n`;
  report += `- Aliases não publicáveis: ${notPublishable.length}\n`;
  report += `- Registros Vencidos ou Desatualizados: ${expiredOrStale.length}\n\n`;

  function renderEntity(r: PromotionEligibilityResult) {
    let md = `### [${r.entityType.toUpperCase()}] ${r.entityId}\n`;
    md += `- **Status Atual:** ${r.currentStatus}\n`;
    md += `- **Decisão:** ${r.decision || 'N/A'}\n`;
    md += `- **Elegibilidade:** ${r.eligible ? '✅ Elegível' : '❌ Não Elegível'}\n`;
    if (r.canonicalEntityId) md += `- **ID Canônico:** ${r.canonicalEntityId}\n`;
    if (r.dependencyEntityIds.length > 0) md += `- **Dependências:** ${r.dependencyEntityIds.join(', ')}\n`;
    if (r.validUntil) md += `- **Validade Efetiva:** ${r.validUntil}\n`;
    
    if (r.blockingReasons.length > 0) {
      md += `- **Bloqueios:**\n`;
      r.blockingReasons.forEach(b => md += `  - \`${b}\`\n`);
    }
    
    if (r.warnings.length > 0) {
      md += `- **Avisos:**\n`;
      r.warnings.forEach(w => md += `  - \`${w.code}\`: ${w.message}\n`);
    }

    let nextAction = 'Nenhuma';
    if (r.eligible) nextAction = `Pode ser promovido a ${r.proposedStatus}`;
    else if (r.blockingReasons.includes('SECOND_REVIEW_MISSING')) nextAction = 'Obter revisão especializada';
    else if (r.blockingReasons.includes('NEEDS_MORE_EVIDENCE')) nextAction = 'Levantar novas evidências';
    else if (r.blockingReasons.includes('LEGACY_ALIAS_NOT_PUBLIC')) nextAction = 'Manter arquivado (Não publicar)';
    else if (r.blockingReasons.includes('NO_APPROVED_BASIC_REVIEW')) nextAction = 'Realizar revisão humana (approved_basic)';

    md += `- **Próxima Ação:** ${nextAction}\n\n`;
    return md;
  }

  // Sort function: by type, then eligibility, then id
  const sortResults = (list: PromotionEligibilityResult[]) => list.sort((a, b) => {
    if (a.entityType !== b.entityType) return a.entityType.localeCompare(b.entityType);
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return a.entityId.localeCompare(b.entityId);
  });

  report += `## Elegíveis Administrativamente\n\n`;
  if (eligible.length === 0) report += `Nenhum registro.\n\n`;
  sortResults(eligible).forEach(r => report += renderEntity(r));

  report += `## Exigem Segunda Revisão\n\n`;
  if (requireSecondReview.length === 0) report += `Nenhum registro.\n\n`;
  sortResults(requireSecondReview).forEach(r => report += renderEntity(r));

  report += `## Necessitam Evidência\n\n`;
  if (needsMoreEvidence.length === 0) report += `Nenhum registro.\n\n`;
  sortResults(needsMoreEvidence).forEach(r => report += renderEntity(r));

  report += `## Não Publicáveis (Aliases / Histórico)\n\n`;
  if (notPublishable.length === 0) report += `Nenhum registro.\n\n`;
  sortResults(notPublishable).forEach(r => report += renderEntity(r));

  report += `## Vencidos ou Desatualizados\n\n`;
  if (expiredOrStale.length === 0) report += `Nenhum registro.\n\n`;
  sortResults(expiredOrStale).forEach(r => report += renderEntity(r));

  // The rest (blocks from dependencies or missing validation)
  const otherBlocked = results.filter(r => !r.eligible && 
    !r.blockingReasons.includes('SECOND_REVIEW_MISSING') && 
    !r.blockingReasons.includes('NEEDS_MORE_EVIDENCE') && 
    !r.blockingReasons.includes('LEGACY_ALIAS_NOT_PUBLIC') && 
    !r.blockingReasons.includes('VALIDATION_EXPIRED') &&
    !r.blockingReasons.includes('EVIDENCE_EXPIRED') &&
    !r.blockingReasons.includes('STALE_REVIEW_PACKET')
  );

  if (otherBlocked.length > 0) {
    report += `## Bloqueados por Outras Restrições\n\n`;
    sortResults(otherBlocked).forEach(r => report += renderEntity(r));
  }

  fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, report, 'utf8');

  console.log(`Report successfully written to ${REPORT_FILE}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
