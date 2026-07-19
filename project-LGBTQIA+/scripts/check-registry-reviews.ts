import fs from 'fs';
import path from 'path';
import { validateHumanReview, evaluateHumanReviewPromotion, HumanReviewEligibilityResult } from '../trust-registry/lib/humanReview.js';
import { validationSchema } from '../trust-registry/schemas/index.js';
import { parseArgs } from 'util';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function checkReviews() {
  console.log('Checking Human Reviews...');

  const validations = loadJson('validations.json');
  const reviewers = loadJson('reviewers.json');
  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const promotionEvents = loadJson('promotion-events.json');
  const integrityManifest = loadJson('fingerprint-integrity-manifest.json');

  const { values } = parseArgs({
    options: {
      'as-of': { type: 'string' }
    }
  });
  const asOf = values['as-of'] ? new Date(values['as-of']) : new Date();

  let hasErrors = false;
  const errors: string[] = [];

  const addError = (msg: string) => {
    errors.push(msg);
    hasErrors = true;
  };

  if (!Array.isArray(validations)) {
    console.error('validations.json is not an array.');
    process.exit(1);
  }

  const allEntities = [...sources, ...orgs, ...services];

  // Verifica validações
  const validationIds = new Set<string>();

  validations.forEach((v: any, index: number) => {
    const parseResult = validationSchema.safeParse(v);
    if (!parseResult.success) {
      addError(`Validation at index ${index} is structurally invalid: ${parseResult.error.message}`);
      return;
    }

    if (validationIds.has(v.id)) {
      addError(`Duplicate validation ID found: ${v.id}`);
    }
    validationIds.add(v.id);

    const entity = allEntities.find((e: any) => e.id === v.entityId);
    if (!entity) {
      addError(`Validation ${v.id} points to non-existent entity ${v.entityId}`);
      return;
    }

    const issues = validateHumanReview(v, reviewers, entity);
    issues.forEach(issue => addError(`Validation ${v.id}: ${issue.code} - ${issue.message}`));

    if (v.decision === 'partner' || v.decision === 'validated' || v.decision === 'community_reviewed') {
      addError(`Validation ${v.id} uses forbidden decision: ${v.decision}`);
    }

    // Avalia promoção
    const entityEvidence = evidence.filter((e: any) => e.entity_id === entity.id);
    
    // Load snapshot for mutation context if available
    let snapshot;
    const internalDir = path.join(PILOT_DIR, 'review-packets', 'generated', 'internal');
    const snapshotPath = path.join(internalDir, `${v.entityType}-${v.entityId}.json`);
    if (fs.existsSync(snapshotPath)) {
      try {
        const packet = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
        snapshot = packet.entity;
      } catch (e) {
        // ignore
      }
    }

    const mutationContext = snapshot && promotionEvents.length > 0 ? {
      asOf,
      validatedEntitySnapshot: snapshot,
      promotionEvents,
      integrityManifest
    } : undefined;

    const eligibility: HumanReviewEligibilityResult = evaluateHumanReviewPromotion(v.entityType, entity, v, entityEvidence, mutationContext);

    const actualBlockingIssues = eligibility.blockingIssues.filter(b => b.code !== 'NOT_APPROVED');

    const isSuperseded = validations.some((nv: any) => nv.previousValidationId === v.id);

    if (actualBlockingIssues.length > 0) {
      if (isSuperseded && actualBlockingIssues.every(b => b.code === 'STALE_REVIEW_PACKET' || b.code === 'INVALID_ADMINISTRATIVE_MUTATION')) {
        // It is expected that a superseded validation might be stale if evidence changed later
      } else {
        addError(`Validation ${v.id} fails eligibility checks: ${actualBlockingIssues.map(b => b.code).join(', ')}`);
      }
    }

    if (v.previousValidationId) {
      const prev = validations.find((ov: any) => ov.id === v.previousValidationId);
      if (!prev) {
        addError(`Validation ${v.id} references missing previousValidationId ${v.previousValidationId}`);
      } else if (new Date(prev.reviewedAt) > new Date(v.reviewedAt)) {
        addError(`Validation ${v.id} has reviewedAt earlier than its previous validation ${prev.id}`);
      } else if (prev.entityId !== v.entityId) {
        addError(`Validation ${v.id} references previous validation of another entity`);
      }
    }
  });

  if (hasErrors) {
    console.error('Check failed with errors:');
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log('All human reviews checked successfully.');
}

checkReviews().catch(err => {
  console.error(err);
  process.exit(1);
});
