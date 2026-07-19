import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('Fingerprint Integrity Manifest', () => {
  const manifestPath = path.resolve('trust-registry', 'pilot-fortaleza', 'fingerprint-integrity-manifest.json');
  
  it('manifest exists and is parsable', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    it('contains exactly 16 entries (8 sources, 8 organizations)', () => {
      expect(manifest.length).toBe(16);
    });

    it('all entries have correct properties and string lengths', () => {
      const ids = new Set();
      
      manifest.forEach((entry: any) => {
        expect(entry).toHaveProperty('validationId');
        expect(entry).toHaveProperty('entityId');
        expect(entry).toHaveProperty('fingerprintVersion', 'v2');
        expect(entry).toHaveProperty('digestAlgorithm', 'sha256');

        expect(entry.compactEntityFingerprint).toHaveLength(16);
        expect(entry.compactEvidenceFingerprint).toHaveLength(16);

        expect(entry.entityIntegrityDigest).toHaveLength(64);
        expect(entry.evidenceIntegrityDigest).toHaveLength(64);

        // prefix matches
        expect(entry.entityIntegrityDigest.startsWith(entry.compactEntityFingerprint)).toBe(true);
        expect(entry.evidenceIntegrityDigest.startsWith(entry.compactEvidenceFingerprint)).toBe(true);

        expect(ids.has(entry.validationId)).toBe(false);
        ids.add(entry.validationId);
      });
    });

    it('no entries are for services', () => {
      manifest.forEach((entry: any) => {
        expect(entry.entityId.startsWith('srv_')).toBe(false);
      });
    });
  }
});
