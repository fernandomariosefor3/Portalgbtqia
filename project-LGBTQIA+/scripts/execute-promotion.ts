import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluatePromotionEligibility, PromotionContext } from '../trust-registry/lib/promotionEligibility.js';
import { Validation } from '../trust-registry/lib/humanReview.js';
import { CURRENT_POLICY_VERSION } from '../trust-registry/lib/promotionPolicies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PILOT_DIR = path.join(__dirname, '../trust-registry/pilot-fortaleza');

const SOURCES_FILE = path.join(PILOT_DIR, 'sources.json');
const ORGS_FILE = path.join(PILOT_DIR, 'organizations.json');
const SERVICES_FILE = path.join(PILOT_DIR, 'services.json');
const EVIDENCE_FILE = path.join(PILOT_DIR, 'evidence.json');
const VALIDATIONS_FILE = path.join(PILOT_DIR, 'validations.json');
const PROMOTION_EVENTS_FILE = path.join(PILOT_DIR, 'promotion-events.json');

const APPROVED_SOURCES = [
  'src_gov_ce',
  'src_sec_div_ce',
  'src_pref_fortaleza',
  'src_smdhds_fortaleza',
  'src_sesa_ce',
  'src_hsj_ce',
  'src_dpe_ce',
  'src_huwc_ce'
];

async function run() {
  const asOfArg = process.argv.findIndex(arg => arg === '--as-of');
  const asOf = asOfArg !== -1 ? new Date(process.argv[asOfArg + 1]) : new Date();

  console.log(`Executing Promotion Event for Lote P-A (Sources) as of ${asOf.toISOString()}`);

  const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf8'));
  const organizations = JSON.parse(fs.readFileSync(ORGS_FILE, 'utf8'));
  const services = JSON.parse(fs.readFileSync(SERVICES_FILE, 'utf8'));
  const evidence = JSON.parse(fs.readFileSync(EVIDENCE_FILE, 'utf8'));
  const validations: Validation[] = JSON.parse(fs.readFileSync(VALIDATIONS_FILE, 'utf8'));
  
  let promotionEvents: any[] = [];
  if (fs.existsSync(PROMOTION_EVENTS_FILE)) {
    promotionEvents = JSON.parse(fs.readFileSync(PROMOTION_EVENTS_FILE, 'utf8'));
  }

  const context: PromotionContext = {
    registry: { sources, organizations, services, evidence, validations },
    asOf,
    computedEligibility: new Map()
  };

  const newEvents: any[] = [];
  const updatedSources = sources.map((s: any) => ({ ...s }));

  for (const sourceId of APPROVED_SOURCES) {
    const sourceIndex = updatedSources.findIndex((s: any) => s.id === sourceId);
    if (sourceIndex === -1) {
      console.error(`Source ${sourceId} not found.`);
      process.exit(1);
    }
    const source = updatedSources[sourceIndex];

    if (source.status === 'verified_basic') {
      console.log(`Source ${sourceId} is already verified_basic. Skipping.`);
      continue;
    }

    const eligibility = evaluatePromotionEligibility(source, 'source', context);

    if (!eligibility.eligible) {
      console.error(`Source ${sourceId} failed eligibility check.`);
      console.error(eligibility.blockingReasons);
      process.exit(1);
    }

    const validation = validations.find(v => v.id === eligibility.validationIds[0]);
    if (!validation) {
      console.error(`Validation not found for ${sourceId}`);
      process.exit(1);
    }

    // "validade vencida bloqueia a entidade"
    if (eligibility.validUntil && new Date(eligibility.validUntil).getTime() <= asOf.getTime()) {
      console.error(`Source ${sourceId} has an expired effective validation (${eligibility.validUntil}).`);
      process.exit(1);
    }

    // Digest checks
    if (!validation.entityFingerprint || validation.entityFingerprint.length !== 16) {
      console.error(`Source ${sourceId} does not have a 16-char compact fingerprint.`);
      process.exit(1);
    }
    if (!validation.evidenceFingerprint || validation.evidenceFingerprint.length !== 16) {
      console.error(`Source ${sourceId} has invalid evidence fingerprint.`);
      process.exit(1);
    }

    // Read integrity manifest to get the full digest
    const manifestPath = path.join(PILOT_DIR, 'fingerprint-integrity-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const manifestEntry = manifest.find((m: any) => m.validationId === validation.id);

    if (!manifestEntry) {
      console.error(`Source ${sourceId} validation ${validation.id} not found in integrity manifest.`);
      process.exit(1);
    }

    const fullDigest = manifestEntry.entityIntegrityDigest;
    if (!fullDigest || fullDigest.length !== 64 || !fullDigest.startsWith(validation.entityFingerprint)) {
      console.error(`Source ${sourceId} has invalid or missing 64-char integrity digest.`);
      process.exit(1);
    }

    const eventId = `promo_${sourceId}_001`;
    if (promotionEvents.find(e => e.id === eventId)) {
      console.log(`Event ${eventId} already exists. Skipping.`);
      continue;
    }

    const newEvent = {
      id: eventId,
      entityId: sourceId,
      entityType: 'source',
      previousStatus: source.status,
      newStatus: 'verified_basic',
      effectiveValidationId: validation.id,
      compactFingerprint: validation.entityFingerprint,
      integrityDigest: fullDigest,
      evidenceIds: validation.evidenceIds || [],
      effectiveValidUntil: eligibility.validUntil,
      promotedBy: 'reviewer-owner-001',
      promotedAt: asOf.toISOString(),
      reason: 'Administrative Promotion Lote P-A',
      publicationAllowed: false,
      batchId: 'P-A',
      rollbackSpecification: {
        statusRollbackTo: source.status,
        requiresNewEvent: true
      },
      policyVersion: CURRENT_POLICY_VERSION
    };

    newEvents.push(newEvent);

    // Apply change
    source.status = 'verified_basic';
    source.publicListingAllowed = false;
    source.publicationStatus = 'not_published';
  }

  if (newEvents.length === 0) {
    console.log('No new events to process.');
    return;
  }

  // Atomic Write Simulation (write back)
  fs.writeFileSync(PROMOTION_EVENTS_FILE, JSON.stringify([...promotionEvents, ...newEvents], null, 2));
  fs.writeFileSync(SOURCES_FILE, JSON.stringify(updatedSources, null, 2));

  console.log(`Successfully promoted ${newEvents.length} sources.`);
  console.log('Validations, evidence, and other entities were untouched.');
}

run().catch(console.error);
