import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { evaluatePromotionEligibility, PromotionContext } from '../trust-registry/lib/promotionEligibility.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORTS_DIR = path.resolve('trust-registry', 'reports');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

export function generatePromotionPlan(asOf: Date, isDryRun: boolean = true) {
  const sources = loadJson('sources.json');
  const organizations = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const validations = loadJson('validations.json');
  const manifest = loadJson('fingerprint-integrity-manifest.json');

  const context: PromotionContext = {
    registry: { sources, organizations, services, evidence, validations },
    asOf,
    computedEligibility: new Map()
  };

  const planCandidates: any[] = [];
  const planExcluded: any[] = [];

  // Somente fontes e organizações
  const candidateEntities = [
    ...sources.map((s: any) => ({ entity: s, type: 'source' })),
    ...organizations.map((o: any) => ({ entity: o, type: 'organization' }))
  ];

  for (const candidate of candidateEntities) {
    const { entity, type } = candidate;

    // Basic rules to skip non-candidates up front
    if (entity.status !== 'under_review') {
      planExcluded.push({ id: entity.id, blockingReason: 'ALREADY_PROMOTED_OR_ARCHIVED' });
      continue;
    }

    if (entity.description?.includes('canonicalServiceId:')) {
      planExcluded.push({ id: entity.id, blockingReason: 'IS_ALIAS' });
      continue;
    }
    
    if (entity.id === 'srv_casa_transformar_acolhimento') {
      planExcluded.push({ id: entity.id, blockingReason: 'MANUAL_EXCLUSION_CASA_TRANSFORMAR' });
      continue;
    }

    // Evaluate standard promotion logic
    const eligibility = evaluatePromotionEligibility(entity, type as any, context);

    if (!eligibility.eligible) {
      planExcluded.push({ 
        id: entity.id, 
        blockingReason: 'ELIGIBILITY_FAILED', 
        reasons: [...eligibility.blockingReasons, ...eligibility.inheritedBlockingReasons.map(r => r.reason)]
      });
      continue;
    }

    // Check V2 validation and Integrity Manifest rules
    const effectiveValidation = validations.find((v: any) => v.id === eligibility.validationIds[0]);
    if (effectiveValidation.fingerprintVersion !== 'v2') {
      planExcluded.push({ id: entity.id, blockingReason: 'MISSING_V2_VALIDATION' });
      continue;
    }

    const manifestEntry = manifest.find((m: any) => m.validationId === effectiveValidation.id);
    if (!manifestEntry) {
      planExcluded.push({ id: entity.id, blockingReason: 'INTEGRITY_MANIFEST_MISSING' });
      continue;
    }

    if (
      !manifestEntry.entityIntegrityDigest || 
      !manifestEntry.entityIntegrityDigest.startsWith(manifestEntry.compactEntityFingerprint) ||
      !manifestEntry.evidenceIntegrityDigest ||
      !manifestEntry.evidenceIntegrityDigest.startsWith(manifestEntry.compactEvidenceFingerprint)
    ) {
      planExcluded.push({ id: entity.id, blockingReason: 'INTEGRITY_DIGEST_INCOMPATIBLE' });
      continue;
    }

    planCandidates.push({
      id: entity.id,
      name: entity.name,
      type: type,
      currentStatus: entity.status,
      proposedStatus: 'verified_basic',
      publicationAllowed: false,
      publicationStatus: 'not_published',
      effectiveValidationId: effectiveValidation.id,
      entityIntegrityDigest: manifestEntry.entityIntegrityDigest,
      evidenceIds: effectiveValidation.evidenceIds || [],
      dependencyEntityIds: eligibility.dependencyEntityIds,
      effectiveValidUntil: eligibility.validUntil,
      warnings: eligibility.warnings.map(w => w.code),
      changedFields: ['status'],
      unchangedFields: ['id', 'name', 'created_at', 'updated_at', 'description'],
      rollbackProposed: {
        restoreStatus: entity.status,
        restoreValidationId: effectiveValidation.id,
        responsible: 'system_rollback',
        reason: 'dry_run_specification_only',
        auditTrail: 'rollback_of_promotion'
      }
    });
  }

  // Respect Order: sources first, then orgs.
  // We can just filter into two lots.
  const sourceCandidates = planCandidates.filter(c => c.type === 'source');
  const orgCandidates = planCandidates.filter(c => c.type === 'organization');

  const planData = {
    metadata: {
      generatedAt: now.toISOString(),
      asOf: asOf.toISOString(),
      isDryRun,
      totalCandidates: planCandidates.length,
      totalExcluded: planExcluded.length
    },
    lots: {
      lotePA_sources: sourceCandidates,
      lotePB_organizations: orgCandidates
    },
    excluded: planExcluded
  };

  if (!isDryRun) {
    throw new Error('This script is exclusively for dry-run simulation. Action cannot be executed.');
  }

  return planData;
}

const now = new Date();

async function run() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      'as-of': { type: 'string' }
    }
  });

  const asOfDate = values['as-of'] ? new Date(values['as-of']) : now;

  console.log(`Planning promotion administrative as of ${asOfDate.toISOString()} (Dry Run)`);

  const planData = generatePromotionPlan(asOfDate, true);

  fs.writeFileSync(path.join(REPORTS_DIR, 'administrative-promotion-plan.json'), JSON.stringify(planData, null, 2), 'utf8');

  let md = `# Plano de Promoção Administrativa (Dry Run)\n\n`;
  md += `**Data Referência (asOf):** ${planData.metadata.asOf}\n`;
  md += `**Gerado em:** ${planData.metadata.generatedAt}\n`;
  md += `**Candidatas Aprovadas:** ${planData.metadata.totalCandidates}\n`;
  md += `**Bloqueadas:** ${planData.metadata.totalExcluded}\n\n`;

  md += `> **AVISO:** Este é um DRY RUN exclusivo. Nenhum status foi alterado, nenhum dado foi publicado ou enviado ao MCP/Firestore.\n\n`;

  md += `## Lote P-A — Fontes\n\n`;
  planData.lots.lotePA_sources.forEach((c: any) => {
    md += `### \`${c.id}\`\n`;
    md += `- **Nome:** ${c.name}\n`;
    md += `- **Status:** \`${c.currentStatus}\` → \`${c.proposedStatus}\`\n`;
    md += `- **Validação Efetiva (V2):** \`${c.effectiveValidationId}\`\n`;
    md += `- **Validade Efetiva:** \`${c.effectiveValidUntil}\`\n`;
    md += `- **Digest Verificado:** \`${c.entityIntegrityDigest}\`\n`;
    md += `- **Dependências:** ${c.dependencyEntityIds.length > 0 ? c.dependencyEntityIds.join(', ') : 'Nenhuma'}\n`;
    md += `- **Publicação Permitida:** \`${c.publicationAllowed}\`\n`;
    md += `- **Status de Publicação:** \`${c.publicationStatus}\`\n`;
    md += `- **Avisos:** ${c.warnings.length > 0 ? c.warnings.join(', ') : 'Nenhum'}\n\n`;
  });

  md += `## Lote P-B — Organizações\n\n`;
  md += `> **Nota de Dependência:** Organizações só poderão ser promovidas caso suas respectivas fontes (Lote P-A) sejam promovidas primeiro.\n\n`;
  planData.lots.lotePB_organizations.forEach((c: any) => {
    md += `### \`${c.id}\`\n`;
    md += `- **Nome:** ${c.name}\n`;
    md += `- **Status:** \`${c.currentStatus}\` → \`${c.proposedStatus}\`\n`;
    md += `- **Validação Efetiva (V2):** \`${c.effectiveValidationId}\`\n`;
    md += `- **Validade Efetiva:** \`${c.effectiveValidUntil}\`\n`;
    md += `- **Digest Verificado:** \`${c.entityIntegrityDigest}\`\n`;
    md += `- **Dependências:** ${c.dependencyEntityIds.length > 0 ? c.dependencyEntityIds.join(', ') : 'Nenhuma'}\n`;
    md += `- **Publicação Permitida:** \`${c.publicationAllowed}\`\n`;
    md += `- **Status de Publicação:** \`${c.publicationStatus}\`\n`;
    md += `- **Avisos:** ${c.warnings.length > 0 ? c.warnings.join(', ') : 'Nenhum'}\n\n`;
  });

  md += `## Excluídos e Bloqueios\n\n`;
  planData.excluded.forEach((e: any) => {
    md += `- \`${e.id}\`: Bloqueado por \`${e.blockingReason}\` ${e.reasons ? `(${e.reasons.join(', ')})` : ''}\n`;
  });

  fs.writeFileSync(path.join(REPORTS_DIR, 'administrative-promotion-plan.md'), md, 'utf8');

  console.log(`Plan written to trust-registry/reports/administrative-promotion-plan.md and .json`);
}

// only run if called directly
if (process.argv[1] && process.argv[1].endsWith('plan-registry-promotion.ts')) {
  run().catch(console.error);
}
