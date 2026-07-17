import { describe, it, expect } from 'vitest';
import { trustStatusSchema, evidenceSchema } from '../schemas/index.js';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

describe('Trust Registry Piloto', () => {
  it('deve aceitar JSON com status permitido', () => {
    expect(trustStatusSchema.safeParse('under_review').success).toBe(true);
    expect(trustStatusSchema.safeParse('submitted').success).toBe(true);
  });

  it('deve validar datas e URLs estritamente', () => {
    const validEvidence = {
      id: 'ev_1',
      entity_id: 'org_1',
      entity_type: 'organization',
      source_url: 'https://www.example.com',
      consultation_date: '2026-07-17T18:00:00Z',
      extracted_info: 'info',
      needs_additional_confirmation: false
    };
    
    expect(evidenceSchema.safeParse(validEvidence).success).toBe(true);
    
    // URL inválida
    expect(evidenceSchema.safeParse({ ...validEvidence, source_url: 'invalid-url' }).success).toBe(false);
    
    // Data ISO inválida
    expect(evidenceSchema.safeParse({ ...validEvidence, consultation_date: '2026/07/17' }).success).toBe(false);
  });

  it('o script validate-trust-registry deve passar para os dados atuais do piloto', () => {
    const scriptPath = path.resolve(__dirname, '../../scripts/validate-trust-registry.ts');
    try {
      const output = execSync(`npx tsx "${scriptPath}"`, { encoding: 'utf8' });
      expect(output).toContain('Registry validated successfully');
    } catch (e: any) {
      // Falha no script
      console.error(e.stdout);
      console.error(e.stderr);
      throw e;
    }
  });

  it('deve gerar o relatório de forma limpa', () => {
    const scriptPath = path.resolve(__dirname, '../../scripts/generate-trust-registry-report.ts');
    const reportPath = path.resolve(__dirname, '../reports/pilot-fortaleza-report.md');
    
    // Remove o report se existir
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
    
    execSync(`npx tsx "${scriptPath}"`);
    expect(fs.existsSync(reportPath)).toBe(true);
    
    const content = fs.readFileSync(reportPath, 'utf8');
    expect(content).toContain('Resumo');
    expect(content).toContain('Casa Transformar');
    expect(content).toContain('TelePrEP');
  });
});
