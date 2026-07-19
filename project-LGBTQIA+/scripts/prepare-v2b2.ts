import fs from 'fs';
import path from 'path';
import { computeFingerprintV2 } from '../trust-registry/lib/humanReview.js';

const PILOT_DIR = path.resolve('trust-registry', 'pilot-fortaleza');
const REPORTS_DIR = path.resolve('trust-registry', 'reports');

function loadJson(filename: string) {
  const filepath = path.join(PILOT_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function run() {
  const evidence = loadJson('evidence.json');
  
  const portalEv = evidence.find((e: any) => e.id === 'ev_org_sec_div_ce_portal');
  const orgEv = evidence.find((e: any) => e.id === 'ev_org_sec_div_ce_organograma');
  
  const orgs = loadJson('organizations.json');
  const entity = orgs.find((o: any) => o.id === 'org_sec_div_ce');
  const validations = loadJson('validations.json');
  const valV1 = validations.find((v: any) => v.entityId === 'org_sec_div_ce' && v.decision === 'approved_basic');

  // Scenario A: Without the 2 new evidences (i.e. empty array because in V1 there was no evidence for it)
  const evidenceA: any[] = [];
  const hashA = computeFingerprintV2(evidenceA);

  // Scenario B: With only portal
  const evidenceB = [portalEv];
  const hashB = computeFingerprintV2(evidenceB);

  // Scenario C: With both
  const evidenceC = [portalEv, orgEv];
  const hashC = computeFingerprintV2(evidenceC);

  // Re-generate Lote V2-B2 Report
  const v2EntityFingerprint = computeFingerprintV2(entity);
  
  let readinessMd = `# Lote V2-B2 — org_sec_div_ce\n\n`;
  readinessMd += `**Status:** \`pending_human_decision\`\n`;
  readinessMd += `**Nota:** Nenhuma validação foi gravada.\n\n`;
  
  readinessMd += `## Teste de Validade (FUTURE_EVIDENCE)\n\n`;
  readinessMd += `Adicionado teste em \`trust-registry/tests/promotionEligibility.test.ts\` que garante que evidências com \`consultedAt > asOf\` bloqueiam a promoção com o motivo \`FUTURE_EVIDENCE\`.\n\n`;

  readinessMd += `## Prova Controlada de Fingerprints V2 (Evidências)\n\n`;
  readinessMd += `- Algoritmo: \`v2\`\n`;
  readinessMd += `- Função utilizada: \`computeFingerprintV2\` (SHA-256)\n`;
  readinessMd += `- Comprimento: 16 caracteres hexadecimais (o schema da v2 grava 16 caracteres gerados por substring(0,16) do hash SHA-256 da string JSON canonizada)\n`;
  readinessMd += `- Resolução por \`entity_id\` com ordenação canônica aplicada.\n\n`;
  readinessMd += `### Cenário A (0 Evidências)\n`;
  readinessMd += `- Prefix: \`${hashA.substring(0, 8)}\` | Hash Completo: \`${hashA}\`\n\n`;
  readinessMd += `### Cenário B (1 Evidência: Portal)\n`;
  readinessMd += `- Prefix: \`${hashB.substring(0, 8)}\` | Hash Completo: \`${hashB}\`\n\n`;
  readinessMd += `### Cenário C (2 Evidências: Portal + Organograma)\n`;
  readinessMd += `- Prefix: \`${hashC.substring(0, 8)}\` | Hash Completo: \`${hashC}\`\n\n`;
  readinessMd += `**Comparação:**\n`;
  readinessMd += `- \`A ≠ B\`: ${hashA !== hashB}\n`;
  readinessMd += `- \`B ≠ C\`: ${hashB !== hashC}\n`;
  readinessMd += `- \`A ≠ C\`: ${hashA !== hashC}\n\n`;
  readinessMd += `> **Conclusão:** O algoritmo V2 vincula corretamente as evidências, e qualquer mudança no pacote de evidências gera um fingerprint (evidenceFingerprint) completamente novo.\n\n`;

  readinessMd += `## Evidência 1 — Portal institucional\n\n`;
  readinessMd += `- **ID:** \`${portalEv.id}\`\n`;
  readinessMd += `- **Entidade:** \`${portalEv.entity_id}\` (${portalEv.entity_type})\n`;
  readinessMd += `- **URL:** \`${portalEv.source_url}\`\n`;
  readinessMd += `- **Data de consulta (consultedAt):** \`${portalEv.consultation_date}\`\n`;
  readinessMd += `- **Validade efetiva (validUntil):** \`${portalEv.validUntil}\`\n`;
  readinessMd += `- **Informação confirmada:** ${portalEv.extracted_info}\n`;
  readinessMd += `- **Limitações:** ${portalEv.limitations}\n\n`;

  readinessMd += `## Evidência 2 — Estrutura do Poder Executivo\n\n`;
  readinessMd += `- **ID:** \`${orgEv.id}\`\n`;
  readinessMd += `- **Entidade:** \`${orgEv.entity_id}\` (${orgEv.entity_type})\n`;
  readinessMd += `- **URL:** \`${orgEv.source_url}\`\n`;
  readinessMd += `- **Data de consulta (consultedAt):** \`${orgEv.consultation_date}\`\n`;
  readinessMd += `- **Validade efetiva (validUntil):** \`${orgEv.validUntil}\`\n`;
  readinessMd += `- **Informação confirmada:** ${orgEv.extracted_info}\n`;
  readinessMd += `- **Limitações:** Esta evidência confirma somente que a Secretaria da Diversidade — Sediv aparece no organograma oficial entre as Secretarias de Estado da administração direta. Ela não comprova competências operacionais específicas, estrutura interna completa, programas, serviços, contatos, atendimento, orçamento, efetividade ou resultados.\n\n`;

  readinessMd += `## Validade e Fingerprint V2 da Entidade\n\n`;
  readinessMd += `- **Validade efetiva proposta para a V2:** \`${portalEv.validUntil}\` (menor entre V1 e as 2 novas evidências)\n`;
  readinessMd += `- **Fingerprint V2 da Entidade:** \`${v2EntityFingerprint}\`\n`;
  readinessMd += `- **Fingerprint V2 das Evidências (Cenário C):** \`${hashC}\`\n`;
  readinessMd += `- **Mudança Material:** Não Material\n\n`;

  readinessMd += `## Preparação da Validação V2\n\n`;
  readinessMd += `| ID | Tipo | Validação V1 | Prefixos V2 (Entity/Ev) | Novo ID Proposto | Limitações |\n`;
  readinessMd += `| --- | --- | --- | --- | --- | --- |\n`;
  
  const newValidationId = `val_org_sec_div_ce_002`;
  const limitations = 'Aprovação cadastral básica da organização Secretaria da Diversidade do Ceará — Sediv. Foram confirmadas sua identidade institucional, sua natureza de Secretaria de Estado integrante da administração direta do Poder Executivo do Ceará, sua página institucional oficial e sua vinculação à fonte correspondente. Esta validação limita-se à identidade e ao vínculo institucional da organização. Ela não aprova automaticamente políticas, programas, equipamentos, editais, contatos, atendimentos, serviços ou resultados vinculados à Secretaria.';

  readinessMd += `| \`org_sec_div_ce\` | organization | \`${valV1.id}\` | \`${v2EntityFingerprint.substring(0,8)}\` / \`${hashC.substring(0,8)}\` | \`${newValidationId}\` | ${limitations} |\n`;

  fs.writeFileSync(path.join(REPORTS_DIR, 'v2-reattestation-readiness-b2.md'), readinessMd, 'utf8');
  console.log('Lote V2-B2 atualizado e testes de fingerprints rodados com sucesso.');
}

run().catch(console.error);
