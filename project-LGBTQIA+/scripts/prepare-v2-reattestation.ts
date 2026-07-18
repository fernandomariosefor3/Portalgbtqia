import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { evaluatePromotionEligibility, PromotionContext } from '../trust-registry/lib/promotionEligibility.js';
import { 
  Validation, 
  computeFingerprintV2, 
  detectStaleReviewPacket 
} from '../trust-registry/lib/humanReview.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORTS_DIR = path.resolve('trust-registry', 'reports');

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

  const context: PromotionContext = {
    registry: { sources, organizations: orgs, services, evidence, validations },
    asOf: new Date('2026-07-18T12:00:00.000Z'),
    computedEligibility: new Map()
  };

  const results = [];
  for (const s of sources) results.push(evaluatePromotionEligibility(s, 'source', context));
  for (const o of orgs) results.push(evaluatePromotionEligibility(o, 'organization', context));

  // Exclude explicit blocked entities
  const forbiddenEntities = ['src_casa_transformar', 'org_casa_transformar', 'srv_casa_transformar_acolhimento', 'srv_acesso_saude_prep_pep'];

  const candidates = results.filter(r => {
    if (r.entityType === 'service') return false;
    if (forbiddenEntities.includes(r.entityId)) return false;
    
    // Check if it's only blocked by V2_REATTESTATION_REQUIRED
    const onlyV2Blocked = r.blockingReasons.every(b => b === 'V2_REATTESTATION_REQUIRED');
    const inheritedOnlyV2Blocked = r.inheritedBlockingReasons.every(b => 
       b.rootBlockingReasons.every(rb => rb === 'V2_REATTESTATION_REQUIRED')
    );
    return onlyV2Blocked && inheritedOnlyV2Blocked && r.blockingReasons.includes('V2_REATTESTATION_REQUIRED');
  });

  const loteV2B = candidates.slice(0, 8);
  const excluded = candidates.slice(8);

  let readinessMd = `# Lote V2-B: Preparação para Reatestação em Fingerprint V2\n\n`;
  readinessMd += `**Status:** \`pending_human_decision\`\n`;
  readinessMd += `**Nota:** Nenhuma validação foi adicionada, nenhum revisor foi atribuído, nenhum status modificado.\n\n`;

  readinessMd += `| ID da Entidade | Nome | Tipo | Validação V1 | Situação V1 | Fingerprint V2 | Evidências | Validade Efetiva | Mudanças Detectadas | Classificação Material | Dependências | Recomendação | Novo ID Proposto | Limitações |\n`;
  readinessMd += `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n`;

  for (const r of loteV2B) {
    const entity = [...sources, ...orgs].find(e => e.id === r.entityId);
    const val = validations.find((v: any) => v.entityId === r.entityId && v.decision === 'approved_basic');
    const evs = evidence.filter((e: any) => e.entity_id === r.entityId);

    const v1Compat = detectStaleReviewPacket(val, entity, evs);
    const v1Matches = v1Compat.entityComparison.reason === 'MATCH_LEGACY' && v1Compat.evidenceComparison.reason === 'MATCH_LEGACY';
    
    let materialChange = false;
    let materialClassification = 'Não Material';
    let changesDetected = 'Nenhuma';
    
    if (!v1Matches) {
      materialChange = true;
      materialClassification = 'Material';
      changesDetected = 'Incompatibilidade com hash legado';
    }

    const v2Fingerprint = computeFingerprintV2(entity).substring(0, 8);
    
    let effectiveValidUntil = val.validUntil || '';
    for (const ev of evs) {
      if (ev.validUntil && (!effectiveValidUntil || new Date(ev.validUntil) < new Date(effectiveValidUntil))) {
        effectiveValidUntil = ev.validUntil;
      }
    }

    const newValidationId = `val_${r.entityId}_002`;
    let recommendation = 'reattest_approved_basic_v2';
    if (materialChange) recommendation = 'full_review_required';

    const dependencies = r.dependencyEntityIds.length > 0 ? r.dependencyEntityIds.join(', ') : 'Nenhuma';
    const limitations = val.publicNotes || 'Nenhuma limitação impeditiva identificada.';

    readinessMd += `| \`${r.entityId}\` | ${entity.name} | ${r.entityType} | \`${val.id}\` | ${v1Matches ? 'Compatível' : 'Incompatível'} | \`${v2Fingerprint}\` | ${evs.map((e: any) => `\`${e.id}\``).join(', ')} | ${effectiveValidUntil || 'N/A'} | ${changesDetected} | ${materialClassification} | ${dependencies} | \`${recommendation}\` | \`${newValidationId}\` | ${limitations} |\n`;
  }

  readinessMd += `\n### Entidades Removidas do Lote\n\n`;
  if (excluded.length === 0) {
    readinessMd += `Nenhuma entidade foi removida deste lote (todas as ${loteV2B.length} couberam no limite de 8).\n`;
  } else {
    for (const exc of excluded) {
      readinessMd += `- \`${exc.entityId}\`: Excluída devido ao limite de 8 por lote.\n`;
    }
  }

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORTS_DIR, 'v2-reattestation-readiness.md'), readinessMd, 'utf8');

  console.log(`Lote V2-B gerado com sucesso.`);
}

run().catch(console.error);
