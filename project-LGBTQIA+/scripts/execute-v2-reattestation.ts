import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Validation, 
  computeFingerprintV2, 
  detectStaleReviewPacket,
  FingerprintMigrationRecord 
} from '../trust-registry/lib/humanReview.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORTS_DIR = path.resolve('trust-registry', 'reports');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function saveJson(filename: string, data: any) {
  const filepath = path.join(PILOT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

async function run() {
  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const evidence = loadJson('evidence.json');
  const validations: Validation[] = loadJson('validations.json');
  const migrations: FingerprintMigrationRecord[] = loadJson('fingerprint-migrations.json');

  const loteV2A_IDs = [
    'src_gov_ce',
    'src_sec_div_ce',
    'src_pref_fortaleza',
    'src_smdhds_fortaleza',
    'src_sesa_ce',
    'src_hsj_ce',
    'src_dpe_ce',
    'src_huwc_ce'
  ];

  const now = new Date().toISOString();

  for (const entityId of loteV2A_IDs) {
    const entity = sources.find((e: any) => e.id === entityId);
    if (!entity) throw new Error(`Entity not found: ${entityId}`);
    
    const evs = evidence.filter((e: any) => e.entity_id === entityId);
    const valV1 = validations.find((v: any) => v.entityId === entityId && v.decision === 'approved_basic');
    
    if (!valV1) throw new Error(`V1 validation not found for ${entityId}`);
    if (valV1.fingerprintVersion === 'v2') {
        console.log(`Entity ${entityId} already has a v2 validation.`);
        continue;
    }

    const v2EntityFingerprint = computeFingerprintV2(entity);
    const v2EvidenceFingerprint = computeFingerprintV2(evs);
    
    let effectiveValidUntil = valV1.validUntil || '';
    for (const ev of evs) {
      if (ev.validUntil && (!effectiveValidUntil || new Date(ev.validUntil) < new Date(effectiveValidUntil))) {
        effectiveValidUntil = ev.validUntil;
      }
    }
    
    let publicNotes = valV1.publicNotes;
    if (entityId === 'src_huwc_ce') {
      publicNotes = 'Aprovação cadastral básica da fonte institucional Complexo Hospitalar da Universidade Federal do Ceará — CH-UFC. Foram confirmados a identidade institucional, a URL oficial, o vínculo com a Universidade Federal do Ceará, a integração à Rede HU Brasil e a composição pelo Hospital Universitário Walter Cantídio — HUWC e pela Maternidade-Escola Assis Chateaubriand — MEAC. Esta validação confirma somente a identidade e o vínculo institucional da fonte. Ela não aprova automaticamente conteúdos clínicos, ambulatórios, cirurgias, protocolos, regulação, disponibilidade, elegibilidade ou resultados de serviços de saúde.';
    }

    const newValidationId = `val_${entityId}_002`;

    const valV2: Validation = {
      ...valV1,
      id: newValidationId,
      decision: 'approved_basic',
      fingerprintVersion: 'v2',
      entityFingerprint: v2EntityFingerprint,
      evidenceFingerprint: v2EvidenceFingerprint,
      previousValidationId: valV1.id,
      reviewedBy: 'reviewer-owner-001',
      reviewedAt: now,
      validUntil: effectiveValidUntil || null,
      publicNotes
    };

    validations.push(valV2);

    const migrationRecord: FingerprintMigrationRecord = {
      id: `mig_${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`,
      entityId,
      previousValidationId: valV1.id,
      previousFingerprint: valV1.entityFingerprint, // Saving entity one as standard
      previousVersion: 'v1',
      newValidationId: valV2.id,
      newFingerprint: v2EntityFingerprint,
      newVersion: 'v2',
      migrationType: 'human_reattestation',
      reviewedBy: 'reviewer-owner-001',
      reviewedAt: now,
      evidenceIds: evs.map((e: any) => e.id),
      contentChanged: false,
      changedFields: []
    };
    
    migrations.push(migrationRecord);
  }

  saveJson('validations.json', validations);
  saveJson('fingerprint-migrations.json', migrations);

  console.log('Gravado com sucesso validations.json e fingerprint-migrations.json.');
}

run().catch(console.error);
