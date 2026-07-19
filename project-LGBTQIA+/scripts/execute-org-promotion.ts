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

const APPROVED_ORGS = [
  'org_gov_ce',
  'org_sec_div_ce',
  'org_pref_fortaleza',
  'org_smdhds_fortaleza',
  'org_sesa_ce',
  'org_hsj_ce',
  'org_dpe_ce',
  'org_huwc_ce'
];

async function run() {
  const asOfArg = process.argv.findIndex(arg => arg === '--as-of');
  const asOf = asOfArg !== -1 ? new Date(process.argv[asOfArg + 1]) : new Date();

  console.log(`Executing Promotion Event for Lote P-B (Organizations) as of ${asOf.toISOString()}`);

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
    computedEligibility: new Map(),
    promotionEvents: promotionEvents,
    integrityManifest: JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'fingerprint-integrity-manifest.json'), 'utf8'))
  };

  const newEvents: any[] = [];
  const updatedOrgs = organizations.map((o: any) => ({ ...o }));

  for (const orgId of APPROVED_ORGS) {
    const orgIndex = updatedOrgs.findIndex((o: any) => o.id === orgId);
    if (orgIndex === -1) {
      console.error(`Organization ${orgId} not found.`);
      continue;
    }
    const org = updatedOrgs[orgIndex];

    if (org.status === 'verified_basic') {
      console.log(`Organization ${orgId} is already verified_basic. Skipping.`);
      continue;
    }

    const eligibility = evaluatePromotionEligibility(org, 'organization', context);

    if (!eligibility.eligible) {
      console.error(`Organization ${orgId} failed eligibility check.`);
      console.error(eligibility.blockingReasons);
      continue;
    }

    const validation = validations.find(v => v.id === eligibility.validationIds[0]);
    if (!validation) {
      console.error(`Validation not found for ${orgId}`);
      continue;
    }

    if (eligibility.validUntil && new Date(eligibility.validUntil).getTime() <= asOf.getTime()) {
      console.error(`Organization ${orgId} has an expired effective validation (${eligibility.validUntil}).`);
      continue;
    }

    // Digest checks
    if (!validation.entityFingerprint || validation.entityFingerprint.length !== 16) {
      console.error(`Organization ${orgId} does not have a 16-char compact fingerprint.`);
      continue;
    }
    if (!validation.evidenceFingerprint || validation.evidenceFingerprint.length !== 16) {
      console.error(`Organization ${orgId} has invalid evidence fingerprint.`);
      continue;
    }

    // Read integrity manifest to get the full digest
    const manifestPath = path.join(PILOT_DIR, 'fingerprint-integrity-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const manifestEntry = manifest.find((m: any) => m.validationId === validation.id);

    if (!manifestEntry) {
      console.error(`Organization ${orgId} validation ${validation.id} not found in integrity manifest.`);
      continue;
    }

    const fullDigest = manifestEntry.entityIntegrityDigest;
    if (!fullDigest || fullDigest.length !== 64 || !fullDigest.startsWith(validation.entityFingerprint)) {
      console.error(`Organization ${orgId} has invalid or missing 64-char integrity digest.`);
      continue;
    }

    const eventId = `promo_${orgId}_001`;
    if (promotionEvents.find(e => e.id === eventId)) {
      console.log(`Event ${eventId} already exists. Skipping.`);
      continue;
    }

    const newEvent = {
      id: eventId,
      entityId: orgId,
      entityType: 'organization',
      previousStatus: org.status,
      newStatus: 'verified_basic',
      effectiveValidationId: validation.id,
      compactFingerprint: validation.entityFingerprint,
      integrityDigest: fullDigest,
      evidenceIds: validation.evidenceIds || [],
      effectiveValidUntil: eligibility.validUntil,
      promotedBy: 'reviewer-owner-001',
      promotedAt: asOf.toISOString(),
      reason: 'Administrative Promotion Lote P-B',
      publicationAllowed: false,
      batchId: 'P-B',
      rollbackSpecification: {
        statusRollbackTo: org.status,
        requiresNewEvent: true
      },
      policyVersion: CURRENT_POLICY_VERSION
    };

    newEvents.push(newEvent);

    // Apply change
    org.status = 'verified_basic';
    org.publicListingAllowed = false;
    org.publicationStatus = 'not_published';
  }

  if (newEvents.length === 0) {
    console.log('No new events to process.');
    return;
  }

  // Atomic Write Simulation (write back)
  fs.writeFileSync(PROMOTION_EVENTS_FILE, JSON.stringify([...promotionEvents, ...newEvents], null, 2));
  fs.writeFileSync(ORGS_FILE, JSON.stringify(updatedOrgs, null, 2));

  console.log(`Successfully promoted ${newEvents.length} organizations.`);
  console.log('Validations, evidence, and other entities were untouched.');
}

run().catch(console.error);
