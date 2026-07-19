import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Validation } from '../trust-registry/lib/humanReview.js';
import { PublicationAuthorizationEvent, generatePublicAdministrativeEntity } from '../trust-registry/lib/publicProjection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PILOT_DIR = path.join(__dirname, '../trust-registry/pilot-fortaleza');

export function executePublicationAuthorization() {
  const sources = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'sources.json'), 'utf8'));
  const validations = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'validations.json'), 'utf8'));
  const promotionEvents = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'promotion-events.json'), 'utf8'));
  
  let pubEvents: PublicationAuthorizationEvent[] = [];
  if (fs.existsSync(path.join(PILOT_DIR, 'publication-events.json'))) {
    pubEvents = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'publication-events.json'), 'utf8'));
  }

  const AUTHORIZED_SOURCES = [
    'src_gov_ce',
    'src_pref_fortaleza',
    'src_sec_div_ce',
    'src_smdhds_fortaleza',
    'src_sesa_ce',
    'src_hsj_ce',
    'src_huwc_ce',
    'src_dpe_ce'
  ];

  const now = new Date().toISOString();
  
  AUTHORIZED_SOURCES.forEach(sourceId => {
    const source = sources.find((s: any) => s.id === sourceId);
    if (!source) throw new Error(`Source ${sourceId} not found`);
    
    if (source.status !== 'verified_basic') {
      throw new Error(`Source ${sourceId} is not verified_basic`);
    }

    const promoEvent = promotionEvents.find((e: any) => e.entityId === sourceId && e.newStatus === 'verified_basic');
    if (!promoEvent) throw new Error(`Promotion event not found for ${sourceId}`);

    const validation = validations.find((v: Validation) => v.id === promoEvent.effectiveValidationId);
    if (!validation) throw new Error(`Validation not found for ${sourceId}`);

    const projected = generatePublicAdministrativeEntity(source, 'source', validation, promoEvent);
    if (!projected) throw new Error(`Failed to project ${sourceId}`);

    const pubEventId = `pub_auth_${sourceId}_001`;

    const existing = pubEvents.find(e => e.id === pubEventId);
    if (existing) {
      console.log(`Event ${pubEventId} already exists, skipping.`);
      return;
    }

    const pubEvent: PublicationAuthorizationEvent = {
      id: pubEventId,
      entityId: sourceId,
      entityType: 'source',
      previousPublicationStatus: 'not_published',
      newPublicationStatus: 'published',
      previousPublicListingAllowed: false,
      newPublicListingAllowed: true,
      authorizedBy: 'reviewer-owner-001',
      authorizedAt: now,
      promotionEventId: promoEvent.id,
      validationId: validation.id,
      validUntil: validation.validUntil || '2027-07-17T22:15:00Z',
      policyVersion: '1.0',
      authorizationStatus: 'approved_not_applied',
      batch: 'PUB-1',
      publicUrl: projected.institutionalUrl || '',
      publicDescription: projected.shortDescription,
      disclosure: projected.disclosure
    };

    pubEvents.push(pubEvent);
    console.log(`Generated authorization event for ${sourceId}`);
  });

  fs.writeFileSync(
    path.join(PILOT_DIR, 'publication-events.json'),
    JSON.stringify(pubEvents, null, 2)
  );

  console.log(`Saved ${pubEvents.length} publication authorization events.`);
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || import.meta.url.includes(path.basename(process.argv[1] || ''))) {
  executePublicationAuthorization();
}
