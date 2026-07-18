import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const servicesPath = path.resolve(__dirname, '../pilot-fortaleza/services.json');
const evidencePath = path.resolve(__dirname, '../pilot-fortaleza/evidence.json');

describe('TelePrEP/TelePEP Consolidation', () => {
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
  const evidences = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));

  const srvLegacy = services.find((s: any) => s.id === 'srv_acesso_saude_prep_pep');
  const srvCanonical = services.find((s: any) => s.id === 'srv_teleprep_telepep');

  it('o ID antigo não é listado como serviço independente (status archived)', () => {
    expect(srvLegacy).toBeDefined();
    expect(srvLegacy.status).toBe('archived');
  });

  it('o ID antigo resolve para o serviço canônico ou canal', () => {
    expect(srvLegacy.description).toContain('canonicalServiceId: srv_teleprep_telepep');
    expect(srvLegacy.description).toContain('relationship: access_channel');
  });

  it('o serviço principal contém canais separados', () => {
    expect(srvCanonical.description).toContain('Acesso Saúde CE');
    expect(srvCanonical.description).toContain('Saúde Digital');
    expect(srvCanonical.description).toContain('Ceará App');
  });

  it('PrEP e PEP permanecem modalidades distintas', () => {
    expect(srvCanonical.description).toContain('TelePrEP:');
    expect(srvCanonical.description).toContain('TelePEP:');
  });

  it('a advertência de PEP está presente', () => {
    expect(srvCanonical.description).toContain('A PEP é uma medida de urgência e deve ser iniciada o mais rápido possível, no máximo em até 72 horas após uma possível exposição.');
    expect(srvCanonical.description).toContain('Se o canal digital estiver indisponível ou não oferecer atendimento em tempo adequado, procure imediatamente um serviço presencial de saúde apto a avaliar PEP.');
  });

  it('não existem promessas de estoque ou fornecimento', () => {
    const evs = evidences.filter((e: any) => e.entity_id === 'srv_teleprep_telepep');
    expect(evs.length).toBeGreaterThan(0);
    const ev = evs[0];
    expect(ev.limitations).toContain('NÃO comprova: estoque garantido');
    expect(srvCanonical.description).toContain('não garante elegibilidade, prescrição ou disponibilidade');
  });

  it('nenhuma aprovação automática ocorre', () => {
    expect(srvCanonical.status).toBe('under_review');
  });

  it('nenhuma evidência fica órfã', () => {
    // legacy evidence is still there
    const legacyEvs = evidences.filter((e: any) => e.entity_id === 'srv_acesso_saude_prep_pep');
    expect(legacyEvs.length).toBeGreaterThan(0);
  });
});
