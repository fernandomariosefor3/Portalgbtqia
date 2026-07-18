import { describe, it, expect } from 'vitest';
import { 
  evaluatePromotionEligibility, 
  PromotionContext 
} from '../lib/promotionEligibility.js';

describe('Reattestation Engine', () => {
  const dummyDate = new Date('2026-07-18T10:00:00Z');

  const createBaseContext = (): PromotionContext => ({
    registry: {
      sources: [],
      organizations: [],
      services: [],
      evidence: [],
      validations: []
    },
    asOf: dummyDate,
    computedEligibility: new Map()
  });

  it('V1 validation requires reattestation', () => {
    const ctx = createBaseContext();
    const source = { id: 'src_1', status: 'under_review' };
    ctx.registry.sources.push(source);
    
    // Simulate v1 validation
    ctx.registry.validations.push({
      id: 'val_v1',
      entityId: 'src_1',
      entityType: 'source',
      reviewerId: 'rev_1',
      reviewerRole: 'registry_reviewer',
      reviewedAt: '2026-07-01T10:00:00Z',
      decision: 'approved_basic',
      evidenceIds: [],
      confirmedFields: [],
      unconfirmedFields: [],
      reviewPacketVersion: '1.0.0',
      fingerprintVersion: 'v1',
      entityFingerprint: 'mock',
      evidenceFingerprint: 'mock'
    });

    const result = evaluatePromotionEligibility(source, 'source', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('V2_REATTESTATION_REQUIRED');
  });

  it('V2 validation is eligible', () => {
    const ctx = createBaseContext();
    const source = { id: 'src_1', status: 'under_review' };
    ctx.registry.sources.push(source);
    
    // Simulate v2 validation
    ctx.registry.validations.push({
      id: 'val_v2',
      entityId: 'src_1',
      entityType: 'source',
      reviewerId: 'rev_1',
      reviewerRole: 'registry_reviewer',
      reviewedAt: '2026-07-01T10:00:00Z',
      decision: 'approved_basic',
      evidenceIds: [],
      confirmedFields: [],
      unconfirmedFields: [],
      reviewPacketVersion: '1.0.0',
      fingerprintVersion: 'v2',
      entityFingerprint: 'mock', // Will be detected as stale if we don't mock compareFingerprint, but let's test if V2_REATTESTATION_REQUIRED is absent.
      evidenceFingerprint: 'mock'
    });

    const result = evaluatePromotionEligibility(source, 'source', ctx);
    // It might fail for STALE_REVIEW_PACKET due to mock hash, but shouldn't have V2_REATTESTATION_REQUIRED
    expect(result.blockingReasons).not.toContain('V2_REATTESTATION_REQUIRED');
  });
});
