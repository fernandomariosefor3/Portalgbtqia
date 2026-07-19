import fs from 'fs';
import path from 'path';
import { evaluatePromotionEligibility, PromotionContext } from '../trust-registry/lib/promotionEligibility.js';
import { PromotionEligibilityResult, CURRENT_POLICY_VERSION, InheritedPromotionBlock } from '../trust-registry/lib/promotionPolicies.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORT_FILE = path.resolve('trust-registry', 'reports', 'promotion-eligibility-report.md');
const DIAGNOSTICS_MD_FILE = path.resolve('trust-registry', 'reports', 'promotion-eligibility-diagnostics.md');
const DIAGNOSTICS_JSON_FILE = path.resolve('trust-registry', 'reports', 'promotion-eligibility-diagnostics.json');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function run() {
  const args = process.argv.slice(2);
  const asOfIndex = args.indexOf('--as-of');
  let asOf = new Date();
  if (asOfIndex !== -1 && args[asOfIndex + 1]) {
    asOf = new Date(args[asOfIndex + 1]);
  } else {
    console.warn("AVISO: Nenhuma data `--as-of` fornecida. Usando o horário atual. Isso pode afetar a estabilidade da simulação.");
  }

  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const validations = loadJson('validations.json');

  const context: PromotionContext = {
    registry: { sources, organizations: orgs, services, evidence, validations },
    asOf,
    computedEligibility: new Map()
  };

  const results: PromotionEligibilityResult[] = [];

  for (const s of sources) results.push(evaluatePromotionEligibility(s, 'source', context));
  for (const o of orgs) results.push(evaluatePromotionEligibility(o, 'organization', context));
  for (const s of services) results.push(evaluatePromotionEligibility(s, 'service', context));

  // Generate Diagnostics JSON
  fs.mkdirSync(path.dirname(DIAGNOSTICS_JSON_FILE), { recursive: true });
  fs.writeFileSync(DIAGNOSTICS_JSON_FILE, JSON.stringify(results, null, 2), 'utf8');

  // Generate Diagnostics MD
  let diagMd = `# Matriz de Diagnósticos - Motor de Elegibilidade\n\n`;
  diagMd += `| ID | Tipo | Canônica/Alias | Decisão | Status | Elegível | Bloqueios primários | Bloqueios herdados | Dependências | Validade Efetiva |\n`;
  diagMd += `| -- | ---- | -------------- | ------- | ------ | -------- | ------------------- | ------------------ | ------------ | ---------------- |\n`;

  results.forEach(r => {
    const isAlias = r.canonicalEntityId ? r.canonicalEntityId : 'Canônica';
    const primary = r.blockingReasons.join(', ') || '-';
    const inherited = r.inheritedBlockingReasons?.map((i: InheritedPromotionBlock) => `${i.reason} (de ${i.dependencyEntityId})`).join(', ') || '-';
    const deps = r.dependencyEntityIds.join(', ') || '-';
    const validUntil = r.validUntil || '-';
    diagMd += `| ${r.entityId} | ${r.entityType} | ${isAlias} | ${r.decision || '-'} | ${r.currentStatus} | ${r.eligible} | ${primary} | ${inherited} | ${deps} | ${validUntil} |\n`;
  });

  fs.writeFileSync(DIAGNOSTICS_MD_FILE, diagMd, 'utf8');

  // Generate Report
  let report = `# Relatório de Elegibilidade para Promoção (Fase 5A.1)\n\n`;
  report += `- **Data de Referência (asOf):** ${asOf.toISOString()}\n`;
  report += `- **Versão da Política:** ${CURRENT_POLICY_VERSION}\n\n`;

  const eligible = results.filter(r => r.eligible);
  const byCode = new Map<string, PromotionEligibilityResult[]>();
  
  results.forEach(r => {
    r.blockingReasons.forEach(code => {
      if (!byCode.has(code)) byCode.set(code, []);
      byCode.get(code)!.push(r);
    });
    r.inheritedBlockingReasons?.forEach((inh: InheritedPromotionBlock) => {
      const code = `HERDADO_${inh.reason}`;
      if (!byCode.has(code)) byCode.set(code, []);
      byCode.get(code)!.push(r);
    });
  });

  report += `## Contagens Isoladas\n\n`;
  report += `- **Registros Físicos Avaliados:** ${results.length}\n`;
  report += `- **Entidades Canônicas Elegíveis:** ${eligible.length}\n`;
  report += `- **Fontes Elegíveis:** ${eligible.filter(r => r.entityType === 'source').length}\n`;
  report += `- **Organizações Elegíveis:** ${eligible.filter(r => r.entityType === 'organization').length}\n`;
  report += `- **Serviços Elegíveis:** ${eligible.filter(r => r.entityType === 'service').length}\n\n`;

  report += `### Bloqueios Mapeados (uma entidade pode ter mais de um bloqueio)\n\n`;
  
  for (const [code, items] of byCode.entries()) {
    report += `- **${code}:** ${items.length} ocorrência(s)\n`;
  }
  
  report += `\n## Detalhamento por Código de Bloqueio\n\n`;
  
  function renderEntityBrief(r: PromotionEligibilityResult) {
    let md = `- \`${r.entityId}\` (${r.entityType}) - Status: ${r.currentStatus}`;
    if (r.warnings && r.warnings.length > 0) {
      md += ` | Avisos: ${r.warnings.map(w => w.code).join(', ')}`;
    }
    return md + '\n';
  }

  for (const [code, items] of byCode.entries()) {
    report += `### ${code}\n`;
    items.forEach(item => {
      report += renderEntityBrief(item);
    });
    report += `\n`;
  }

  if (eligible.length > 0) {
    report += `## Entidades Elegíveis\n\n`;
    eligible.forEach(r => report += renderEntityBrief(r));
  }

  fs.writeFileSync(REPORT_FILE, report, 'utf8');

  console.log(`Reports successfully written to trust-registry/reports/`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
