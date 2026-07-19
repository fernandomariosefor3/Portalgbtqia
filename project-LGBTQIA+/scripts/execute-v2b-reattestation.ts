import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Validation, 
  computeFingerprintV2, 
  FingerprintMigrationRecord 
} from '../trust-registry/lib/humanReview.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');

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
  const orgs = loadJson('organizations.json');
  const evidence = loadJson('evidence.json');
  const validations: Validation[] = loadJson('validations.json');
  const migrations: FingerprintMigrationRecord[] = loadJson('fingerprint-migrations.json');

  const loteV2B_IDs = [
    'org_gov_ce',
    'org_pref_fortaleza',
    'org_smdhds_fortaleza',
    'org_sesa_ce',
    'org_hsj_ce',
    'org_dpe_ce',
    'org_huwc_ce'
  ];

  const now = new Date().toISOString();

  for (const entityId of loteV2B_IDs) {
    const entity = orgs.find((e: any) => e.id === entityId);
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
    
    if (entityId === 'org_hsj_ce') {
      publicNotes = 'Aprovação cadastral básica da organização Hospital São José de Doenças Infecciosas. Foram confirmadas sua existência institucional na rede pública estadual de saúde, sua vinculação à Sesa e sua referência institucional oficial. Esta validação limita-se à identidade e ao vínculo da organização. Ela não aprova protocolos clínicos, PrEP, PEP, acesso porta-aberta, disponibilidade de leitos, exames, consultas, horários ou qualquer serviço hospitalar específico. Cada serviço exige revisão independente.';
    } else if (entityId === 'org_dpe_ce') {
      publicNotes = 'Aprovação cadastral básica da organização Defensoria Pública do Estado do Ceará. Foram confirmadas sua identidade institucional, sua natureza de instituição pública autônoma e sua vinculação à fonte oficial correspondente. Esta validação não aprova automaticamente serviços, núcleos, orientações jurídicas, critérios de atendimento, elegibilidade, representação ou resultados.';
    } else if (entityId === 'org_gov_ce') {
      publicNotes = 'Aprovação cadastral básica da organização Governo do Estado do Ceará. Foram confirmadas sua identidade institucional e sua natureza de ente público estadual. Esta validação não aprova automaticamente secretarias, órgãos, políticas, programas, conteúdos ou serviços vinculados.';
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
      previousFingerprint: valV1.entityFingerprint,
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

  console.log('Gravado com sucesso validations.json e fingerprint-migrations.json (Lote V2-B, 7 organizações).');
}

run().catch(console.error);
