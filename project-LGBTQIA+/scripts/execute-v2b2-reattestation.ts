import fs from 'fs';
import path from 'path';
import { 
  computeFingerprintV2, 
  computeIntegrityDigestV2 
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
  const validations = loadJson('validations.json');
  const orgs = loadJson('organizations.json');
  const sources = loadJson('sources.json');
  const migrations = loadJson('fingerprint-migrations.json');
  const evidenceList = loadJson('evidence.json');

  const now = new Date().toISOString();
  const entityId = 'org_sec_div_ce';

  const entity = orgs.find((e: any) => e.id === entityId);
  const v1ValidationIndex = validations.findIndex((v: any) => v.entityId === entityId && v.decision === 'approved_basic');
  const v1Validation = validations[v1ValidationIndex];

  if (!v1Validation) {
    throw new Error('V1 validation not found for org_sec_div_ce');
  }

  // Find the exact evidences
  const ev1 = evidenceList.find((e: any) => e.id === 'ev_org_sec_div_ce_portal');
  const ev2 = evidenceList.find((e: any) => e.id === 'ev_org_sec_div_ce_organograma');
  const evsForHash = [ev1, ev2]; // the correct scenario C

  const compactEntityFingerprint = computeFingerprintV2(entity);
  const compactEvidenceFingerprint = computeFingerprintV2(evsForHash);
  
  const entityIntegrityDigest = computeIntegrityDigestV2(entity);
  const evidenceIntegrityDigest = computeIntegrityDigestV2(evsForHash);

  const newValidationId = `val_${entityId}_002`;

  const newValidation = {
    ...v1Validation,
    id: newValidationId,
    decision: 'approved_basic',
    reattestationDecision: 'reattest_approved_basic_v2',
    fingerprintVersion: 'v2',
    entityFingerprint: compactEntityFingerprint,
    evidenceFingerprint: compactEvidenceFingerprint,
    previousValidationId: v1Validation.id,
    evidenceIds: ['ev_org_sec_div_ce_portal', 'ev_org_sec_div_ce_organograma'],
    limitations: 'Aprovação cadastral básica da organização Secretaria da Diversidade do Ceará — Sediv. Foram confirmadas sua identidade institucional, sua natureza de Secretaria de Estado integrante da administração direta do Poder Executivo do Ceará, sua página institucional oficial e sua vinculação à fonte correspondente. Esta validação limita-se à identidade e ao vínculo institucional da organização. Ela não aprova automaticamente políticas, programas, equipamentos, editais, contatos, atendimentos, serviços ou resultados vinculados à Secretaria.',
    reviewedBy: 'reviewer-owner-001',
    reviewedAt: now,
    validUntil: '2027-07-18T10:23:33Z'
  };

  validations.push(newValidation);

  const migrationRecord = {
    migrationType: 'human_reattestation',
    entityId: entityId,
    previousValidationId: v1Validation.id,
    newValidationId: newValidation.id,
    compactEntityFingerprint: compactEntityFingerprint,
    compactEvidenceFingerprint: compactEvidenceFingerprint,
    contentChanged: true,
    materialChange: false,
    changedFields: ['evidenceIds'],
    justification: 'Regularização evidenciária administrativa',
    migratedAt: now,
    integrityManifestRef: 'trust-registry/pilot-fortaleza/fingerprint-integrity-manifest.json'
  };

  migrations.push(migrationRecord);

  // Re-save validations and migrations
  saveJson('validations.json', validations);
  saveJson('fingerprint-migrations.json', migrations);

  // Now generate fingerprint-integrity-manifest.json for all 16 V2 administrative entities
  const manifest: any[] = [];
  
  // We need to pick all validation records that have fingerprintVersion === 'v2' and type source or organization
  const v2Validations = validations.filter((v: any) => v.fingerprintVersion === 'v2' && (v.entityType === 'source' || v.entityType === 'organization'));
  
  if (v2Validations.length !== 16) {
    console.warn(`Expected 16 V2 administrative validations, but found ${v2Validations.length}`);
  }

  for (const val of v2Validations) {
    let currentEntity = orgs.find((o: any) => o.id === val.entityId);
    if (!currentEntity) {
      currentEntity = sources.find((s: any) => s.id === val.entityId);
    }
    
    // get evidence for this entity
    const currentEvs = evidenceList.filter((e: any) => val.evidenceIds?.includes(e.id) || e.entity_id === val.entityId);

    const _entityIntegrityDigest = computeIntegrityDigestV2(currentEntity);
    const _evidenceIntegrityDigest = computeIntegrityDigestV2(currentEvs);

    manifest.push({
      validationId: val.id,
      entityId: val.entityId,
      fingerprintVersion: 'v2',
      compactEntityFingerprint: val.entityFingerprint,
      compactEvidenceFingerprint: val.evidenceFingerprint,
      digestAlgorithm: 'sha256',
      entityIntegrityDigest: _entityIntegrityDigest,
      evidenceIntegrityDigest: _evidenceIntegrityDigest,
      generatedAt: now
    });
  }

  saveJson('fingerprint-integrity-manifest.json', manifest);

  console.log(`Gravação de val_org_sec_div_ce_002 concluída.`);
  console.log(`Migração salva com sucesso.`);
  console.log(`Manifesto de integridade gerado com ${manifest.length} entradas.`);
}

run().catch(console.error);
