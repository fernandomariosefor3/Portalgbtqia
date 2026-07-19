import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import { validateAdministrativeMutation, AdministrativeMutationContext } from '../trust-registry/lib/administrativeMutation.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORTS_DIR = path.resolve('trust-registry', 'reports');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function auditAdministrativeMutations() {
  const { values } = parseArgs({
    options: {
      'as-of': { type: 'string' }
    }
  });

  const asOf = values['as-of'] ? new Date(values['as-of']) : new Date();

  console.log(`Auditing administrative mutations as of ${asOf.toISOString()}...`);

  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const promotionEvents = loadJson('promotion-events.json');
  const integrityManifest = loadJson('fingerprint-integrity-manifest.json');
  const validations = loadJson('validations.json');

  const allEntities = [...sources, ...orgs, ...services];

  const results: any[] = [];

  for (const event of promotionEvents) {
    const entity = allEntities.find((e: any) => e.id === event.entityId);
    if (!entity) continue;

    const validation = validations.find((v: any) => v.id === event.effectiveValidationId);
    if (!validation) continue;

    const entityEvidence = evidence.filter((e: any) => e.entity_id === entity.id);

    let snapshot;
    const snapshotPath = path.join(PILOT_DIR, 'review-packets', 'generated', 'internal', `${entity.type === 'government' || entity.type === 'ngo' ? (entity.id.startsWith('org') ? 'organization' : 'source') : 'service'}-${entity.id}.json`); // simple heuristic, better to check entity.id prefix
    let entityType = 'source';
    if (entity.id.startsWith('org_')) entityType = 'organization';
    if (entity.id.startsWith('srv_')) entityType = 'service';
    
    const actualSnapshotPath = path.join(PILOT_DIR, 'review-packets', 'generated', 'internal', `${entityType}-${entity.id}.json`);
    
    if (fs.existsSync(actualSnapshotPath)) {
      try {
        const packet = JSON.parse(fs.readFileSync(actualSnapshotPath, 'utf8'));
        snapshot = packet.entity;
      } catch (e) {
        // ignore
      }
    }

    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: validation,
      validatedEntitySnapshot: snapshot,
      currentEntity: entity,
      currentEvidence: entityEvidence,
      promotionEvents,
      integrityManifest
    };

    const mutationResult = validateAdministrativeMutation(context);

    results.push({
      entityId: entity.id,
      entityName: entity.name,
      validationId: validation.id,
      eventId: event.id,
      previousStatus: event.previousStatus,
      currentStatus: entity.status,
      snapshotAvailable: !!snapshot,
      changedAdministrativePaths: mutationResult.changedAdministrativePaths,
      unauthorizedChanges: mutationResult.unauthorizedChanges,
      publicationStatus: mutationResult.unchangedRequiredPaths.includes('publicationStatus') ? 'unchanged' : 'changed',
      publicListingAllowed: mutationResult.unchangedRequiredPaths.includes('publicListingAllowed') ? 'unchanged' : 'changed',
      digestCadastral: event.integrityDigest, // since it matches if valid
      administrative_transition_verified: mutationResult.valid,
      errors: mutationResult.errors,
      policyApplied: mutationResult.policyVersion
    });
  }

  // Write JSON
  fs.writeFileSync(
    path.join(REPORTS_DIR, 'administrative-mutation-audit.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );

  // Write Markdown
  let md = `# Administrative Mutation Audit Report\n\n`;
  md += `**As Of**: ${asOf.toISOString()}\n\n`;

  results.forEach(r => {
    md += `## ${r.entityName} (${r.entityId})\n`;
    md += `- **Event ID**: ${r.eventId}\n`;
    md += `- **Validation ID**: ${r.validationId}\n`;
    md += `- **Status Change**: \`${r.previousStatus}\` → \`${r.currentStatus}\`\n`;
    md += `- **Verified Transition**: ${r.administrative_transition_verified ? '✅ YES' : '❌ NO'}\n`;
    md += `- **Policy Version**: ${r.policyApplied}\n`;
    md += `- **Digest**: \`${r.digestCadastral}\`\n\n`;
    
    md += `### Changes Analysis\n`;
    md += `- **Administrative Fields Changed**: \n`;
    if (r.changedAdministrativePaths.length === 0) md += `  - *None*\n`;
    r.changedAdministrativePaths.forEach((p: string) => md += `  - \`${p}\`\n`);
    
    md += `- **Publication Status**: ${r.publicationStatus}\n`;
    md += `- **Public Listing Allowed**: ${r.publicListingAllowed}\n`;
    
    if (r.unauthorizedChanges.length > 0) {
      md += `\n### 🚨 Unauthorized Changes\n`;
      r.unauthorizedChanges.forEach((uc: any) => {
        md += `- Path \`${uc.path}\`: \`${JSON.stringify(uc.previousValue)}\` → \`${JSON.stringify(uc.currentValue)}\`\n`;
      });
    }

    if (r.errors.length > 0) {
      md += `\n### 🚨 Errors\n`;
      r.errors.forEach((e: any) => {
        md += `- **${e.code}**: ${e.message}\n`;
      });
    }
    
    md += `\n---\n\n`;
  });

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'administrative-mutation-audit.md'),
    md,
    'utf8'
  );

  console.log('Audit reports successfully generated in trust-registry/reports/');
}

auditAdministrativeMutations().catch(err => {
  console.error(err);
  process.exit(1);
});
