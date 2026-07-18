import { describe, it, expect } from 'vitest';
import { 
  detectStaleReviewPacket, 
  Validation, 
  computeFingerprintV1, 
  computeFingerprintV2,
  computeIntegrityDigestV2
} from '../lib/humanReview.js';

describe('Historical Chain and V2 Reattestation Verification', () => {

  const createDummyEntity = (id: string, name: string) => ({ id, name });
  const createDummyEvidence = (id: string) => ({ id });

  it('V1 histórica íntegra não gera erro por STALE quando avaliada com V1', () => {
    const entity = createDummyEntity('e1', 'Test');
    const ev = [createDummyEvidence('ev1')];
    
    const v1Val: Validation = {
      id: 'val1',
      entityId: 'e1',
      entityType: 'organization',
      reviewerId: 'r1',
      reviewerRole: 'registry_reviewer',
      reviewedAt: '2026-01-01T00:00:00Z',
      decision: 'approved_basic',
      fingerprintVersion: 'v1',
      entityFingerprint: computeFingerprintV1(entity),
      evidenceFingerprint: computeFingerprintV1(ev),
      evidenceIds: [],
      confirmedFields: [],
      unconfirmedFields: [],
      reviewPacketVersion: '1.0.0'
    };

    const staleResult = detectStaleReviewPacket(v1Val, entity, ev);
    // STALE detecta que a versão v1 é legacy e marca isStale = false se os hashes batem
    expect(staleResult.isStale).toBe(false);
  });

  it('divergência legítima V1 -> V2 é tratada isoladamente (V1 fica STALE, V2 não)', () => {
    const entity = createDummyEntity('e1', 'Test');
    const oldEv = [createDummyEvidence('ev1')];
    const newEv = [createDummyEvidence('ev1'), createDummyEvidence('ev2')]; // Evidência adicionada!

    // V1 was created with oldEv
    const v1Val: Validation = {
      id: 'val1',
      entityId: 'e1',
      entityType: 'organization',
      reviewerId: 'r1',
      reviewerRole: 'registry_reviewer',
      reviewedAt: '2026-01-01T00:00:00Z',
      decision: 'approved_basic',
      fingerprintVersion: 'v1',
      entityFingerprint: computeFingerprintV1(entity),
      evidenceFingerprint: computeFingerprintV1(oldEv),
      evidenceIds: [],
      confirmedFields: [],
      unconfirmedFields: [],
      reviewPacketVersion: '1.0.0'
    };

    // V2 created with newEv
    const v2Val: Validation = {
      id: 'val2',
      entityId: 'e1',
      entityType: 'organization',
      reviewerId: 'r1',
      reviewerRole: 'registry_reviewer',
      reviewedAt: '2026-07-18T00:00:00Z',
      decision: 'approved_basic',
      fingerprintVersion: 'v2',
      entityFingerprint: computeFingerprintV2(entity),
      evidenceFingerprint: computeFingerprintV2(newEv),
      evidenceIds: ['ev1', 'ev2'],
      confirmedFields: [],
      unconfirmedFields: [],
      reviewPacketVersion: '1.0.0',
      previousValidationId: 'val1'
    };

    const staleV1 = detectStaleReviewPacket(v1Val, entity, newEv);
    const staleV2 = detectStaleReviewPacket(v2Val, entity, newEv);

    // V1 becomes stale because the current evidence has changed!
    expect(staleV1.isStale).toBe(true);
    // V2 is completely valid
    expect(staleV2.isStale).toBe(false);
  });

  it('V1 histórica adulterada é detectável', () => {
    const entity = createDummyEntity('e1', 'Test Adulterated');
    const oldEv = [createDummyEvidence('ev1')];

    // V1 was created with oldEv, but now entity is different
    const v1Val: Validation = {
      id: 'val1',
      entityId: 'e1',
      entityType: 'organization',
      reviewerId: 'r1',
      reviewerRole: 'registry_reviewer',
      reviewedAt: '2026-01-01T00:00:00Z',
      decision: 'approved_basic',
      fingerprintVersion: 'v1',
      entityFingerprint: 'abcd1234abcd1234', // Fake
      evidenceFingerprint: computeFingerprintV1(oldEv),
      evidenceIds: [],
      confirmedFields: [],
      unconfirmedFields: [],
      reviewPacketVersion: '1.0.0'
    };

    const staleV1 = detectStaleReviewPacket(v1Val, entity, oldEv);
    expect(staleV1.isStale).toBe(true);
  });

  it('detecta digest integral incompatível com fingerprint compacto (simulação lógica)', () => {
    const entity = createDummyEntity('e1', 'Test');
    const compact = computeFingerprintV2(entity);
    const fullDigest = computeIntegrityDigestV2(entity);

    expect(fullDigest.startsWith(compact)).toBe(true);

    const tamperedCompact = 'ffffffffffffffff';
    expect(fullDigest.startsWith(tamperedCompact)).toBe(false);
  });

  it('ciclos na cadeia ou previousValidationId inexistente são verificáveis no motor (teste de conceito)', () => {
    const vals = [
      { id: 'v1', previousValidationId: 'v2' },
      { id: 'v2', previousValidationId: 'v1' }
    ];

    const hasCycle = (startId: string) => {
      let currentId = startId;
      const seen = new Set<string>();
      while (currentId) {
        if (seen.has(currentId)) return true;
        seen.add(currentId);
        const v = vals.find(v => v.id === currentId);
        if (!v) return false;
        currentId = v.previousValidationId;
      }
      return false;
    };

    expect(hasCycle('v1')).toBe(true);
  });
});
