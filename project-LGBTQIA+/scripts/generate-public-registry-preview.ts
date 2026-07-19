import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PublicAdministrativeEntity, generatePublicAdministrativeEntity } from '../trust-registry/lib/publicProjection.js';
import { Validation } from '../trust-registry/lib/humanReview.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PILOT_DIR = path.join(__dirname, '../trust-registry/pilot-fortaleza');
const REPORTS_DIR = path.join(__dirname, '../trust-registry/reports');

export function generatePreview(
  sources: any[],
  organizations: any[],
  services: any[], // Passed for verification only
  validations: Validation[],
  promotionEvents: any[]
): PublicAdministrativeEntity[] {
  const publicEntities: PublicAdministrativeEntity[] = [];
  const ALLOWED_ENTITIES = new Set([
    'src_gov_ce',
    'src_sec_div_ce',
    'src_pref_fortaleza',
    'src_smdhds_fortaleza',
    'src_sesa_ce',
    'src_hsj_ce',
    'src_dpe_ce',
    'src_huwc_ce',
    'org_gov_ce',
    'org_sec_div_ce',
    'org_pref_fortaleza',
    'org_smdhds_fortaleza',
    'org_sesa_ce',
    'org_hsj_ce',
    'org_dpe_ce',
    'org_huwc_ce'
  ]);

  const processEntity = (entity: any, type: 'source' | 'organization') => {
    if (!ALLOWED_ENTITIES.has(entity.id)) return;

    // Safety checks
    if (entity.id === 'svc_casa_transformar_001') return; // Casa Transformar is a service, but just in case
    if (entity.id.includes('alias')) return;

    // In a real publication flow, we would require:
    // entity.status === 'verified_basic'
    // entity.publicListingAllowed === true
    // entity.publicationStatus === 'published'
    // But since this is a dry run for entities that COULD be published:
    if (entity.status !== 'verified_basic') return;

    const event = promotionEvents.find(e => e.entityId === entity.id && e.newStatus === 'verified_basic');
    if (!event) return;

    const validation = validations.find(v => v.id === event.effectiveValidationId);
    if (!validation) return;
    
    // Organization needs verified source
    if (type === 'organization') {
      const source = sources.find(s => s.id === entity.source_id);
      if (!source || source.status !== 'verified_basic') {
        return;
      }
    }

    const projected = generatePublicAdministrativeEntity(entity, type, validation, event);
    if (projected) {
      publicEntities.push(projected);
    }
  };

  sources.forEach(s => processEntity(s, 'source'));
  organizations.forEach(o => processEntity(o, 'organization'));

  // Ensure determinism
  publicEntities.sort((a, b) => a.id.localeCompare(b.id));
  return publicEntities;
}

async function run() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const sources = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'sources.json'), 'utf8'));
  const organizations = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'organizations.json'), 'utf8'));
  const services = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'services.json'), 'utf8'));
  const validations = JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'validations.json'), 'utf8'));
  const promotionEvents = fs.existsSync(path.join(PILOT_DIR, 'promotion-events.json')) 
    ? JSON.parse(fs.readFileSync(path.join(PILOT_DIR, 'promotion-events.json'), 'utf8'))
    : [];

  const preview = generatePreview(sources, organizations, services, validations, promotionEvents);

  // Write JSON
  const jsonPath = path.join(REPORTS_DIR, 'public-registry-preview.json');
  fs.writeFileSync(jsonPath, JSON.stringify(preview, null, 2));

  // Write MD
  let md = '# Public Registry Preview\n\n';
  md += `Data do Relatório: ${new Date().toISOString()}\n\n`;
  md += 'Entidades Administrativas em Condições de Publicação Controlada:\n\n';

  for (const entity of preview) {
    md += `## ${entity.name}\n\n`;
    md += `- **ID:** ${entity.id}\n`;
    md += `- **Tipo:** ${entity.entityType}\n`;
    if (entity.institutionalUrl) md += `- **URL:** [${entity.institutionalUrl}](${entity.institutionalUrl})\n`;
    md += `- **Descrição:** ${entity.shortDescription}\n`;
    md += `- **Validade:** ${entity.validUntil || 'Indeterminada'}\n`;
    md += `- **Aviso Público:** ${entity.disclosure}\n\n`;
  }

  const mdPath = path.join(REPORTS_DIR, 'public-registry-preview.md');
  fs.writeFileSync(mdPath, md);

  console.log(`Generated public-registry-preview.json with ${preview.length} entities.`);
  console.log(`Sources: ${preview.filter(e => e.entityType === 'source').length}`);
  console.log(`Organizations: ${preview.filter(e => e.entityType === 'organization').length}`);
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || import.meta.url.includes(path.basename(process.argv[1] || ''));
if (isMain) {
  run().catch(console.error);
}
