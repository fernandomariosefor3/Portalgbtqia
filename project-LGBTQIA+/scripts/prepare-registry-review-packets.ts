import fs from 'fs';
import path from 'path';
import { prepareReviewPacket, sanitizeReviewPacket } from '../trust-registry/lib/humanReview.js';
import { execSync } from 'child_process';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const PACKETS_DIR = path.join(PILOT_DIR, 'review-packets', 'generated');
const INTERNAL_DIR = path.join(PACKETS_DIR, 'internal');
const PUBLIC_DIR = path.join(PACKETS_DIR, 'public');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function checkRepoPublicity() {
  try {
    const url = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    console.log(`Checking repo publicity for: ${url}`);
    // Na dúvida, assumimos que precisamos do gitignore
  } catch (e) {
    console.log('Could not determine remote URL. Assuming private/local.');
  }
}

function ensureDirectories() {
  if (!fs.existsSync(PACKETS_DIR)) fs.mkdirSync(PACKETS_DIR, { recursive: true });
  if (!fs.existsSync(INTERNAL_DIR)) fs.mkdirSync(INTERNAL_DIR, { recursive: true });
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const gitignorePath = path.join(INTERNAL_DIR, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '*\n!.gitignore\n', 'utf8');
  }
}

function generateMarkdown(entityType: string, sanitizedEntity: any, packetInfo: any) {
  let md = `# Review Packet: ${sanitizedEntity.name || sanitizedEntity.id}\n\n`;
  md += `**Tipo**: ${entityType}\n`;
  md += `**Status Atual**: ${sanitizedEntity.status}\n`;
  md += `**Gerado em**: ${packetInfo.metadata.generatedAt}\n`;
  md += `**Versão do Pacote**: ${packetInfo.metadata.packetVersion}\n\n`;
  
  if (sanitizedEntity.contact && sanitizedEntity.contact.protectedAddressRef) {
    md += `> [!WARNING]\n> Endereço protegido. A divulgação pública depende de autorização específica.\n\n`;
  }

  md += `## Evidências\n`;
  packetInfo.evidenceList.forEach((e: any) => {
    md += `- Fonte: ${e.source_url} (Consultado em: ${e.consultation_date})\n`;
    md += `  - Info extraída: ${e.extracted_info}\n`;
    if (e.limitations) md += `  - Limitações: ${e.limitations}\n`;
  });
  md += `\n`;

  if (packetInfo.reviewQueueItem) {
    md += `## Itens na Fila de Revisão\n`;
    md += `- **Campos Ausentes**: ${packetInfo.reviewQueueItem.missing_fields?.join(', ')}\n`;
    md += `- **Riscos**: ${packetInfo.reviewQueueItem.risks?.join(' | ')}\n`;
    md += `- **Recomendação Técnica**: ${packetInfo.reviewQueueItem.agent_recommendation}\n`;
    md += `### Perguntas Pendentes\n`;
    packetInfo.reviewQueueItem.pending_questions?.forEach((q: string) => {
      md += `- ${q}\n`;
    });
    md += `\n`;
  }

  md += `## Decisão Humana\n`;
  md += `O revisor deve inserir sua decisão no arquivo \`validations.json\`. Este markdown é apenas leitura.\n\n`;
  md += `### Checklist de Apoio\n`;
  md += `- [ ] As evidências são válidas e atuais?\n`;
  md += `- [ ] A organização mantenedora foi confirmada?\n`;
  md += `- [ ] Não existem dados pessoais sensíveis expostos?\n`;
  md += `- [ ] Foi avaliada a proteção do endereço?\n`;

  return md;
}

async function preparePackets() {
  console.log('Preparing Review Packets...');
  checkRepoPublicity();
  ensureDirectories();

  const sources = loadJson('sources.json');
  const orgs = loadJson('organizations.json');
  const services = loadJson('services.json');
  const evidence = loadJson('evidence.json');
  const reviewQueue = loadJson('review-queue.json');

  const manifest = {
    generatedAt: new Date().toISOString(),
    schemaVersion: '1.0.0',
    totalPackets: 0,
    packets: [] as any[]
  };

  const processEntity = (entity: any, type: 'source' | 'organization' | 'service') => {
    const entityEvidence = evidence.filter((e: any) => e.entity_id === entity.id);
    const rq = reviewQueue.find((q: any) => q.entity_id === entity.id);

    const packet = prepareReviewPacket(type, entity, entityEvidence, rq);
    const sanitized = sanitizeReviewPacket(type, entity);
    
    // Internal JSON
    const internalPath = path.join(INTERNAL_DIR, `${type}-${entity.id}.json`);
    fs.writeFileSync(internalPath, JSON.stringify(packet, null, 2), 'utf8');

    // Public Markdown
    const publicMdPath = path.join(PUBLIC_DIR, `${type}-${entity.id}.md`);
    const mdContent = generateMarkdown(type, sanitized, packet);
    fs.writeFileSync(publicMdPath, mdContent, 'utf8');

    manifest.packets.push({
      entityId: entity.id,
      entityType: type,
      entityFingerprint: packet.metadata.entityFingerprint,
      evidenceFingerprint: packet.metadata.evidenceFingerprint,
      isProtected: !!(sanitized.contact && sanitized.contact.protectedAddressRef)
    });
    manifest.totalPackets++;
  };

  sources.forEach((s: any) => processEntity(s, 'source'));
  orgs.forEach((o: any) => processEntity(o, 'organization'));
  services.forEach((s: any) => processEntity(s, 'service'));

  const manifestPath = path.join(PACKETS_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Generated ${manifest.totalPackets} review packets.`);
}

preparePackets().catch(err => {
  console.error(err);
  process.exit(1);
});
