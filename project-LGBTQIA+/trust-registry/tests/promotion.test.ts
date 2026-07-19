import { describe, it, expect } from 'vitest';
import { trustSourceSchema, promotionEventSchema } from '../schemas/index.js';

describe('Promotion Events', () => {
  it('should allow promotion event and validate schema', () => {
    const event = {
      id: 'promo_src_gov_ce_001',
      entityId: 'src_gov_ce',
      entityType: 'source',
      previousStatus: 'under_review',
      newStatus: 'verified_basic',
      effectiveValidationId: 'val_src_gov_ce_002',
      compactFingerprint: '2786facb426326f6',
      integrityDigest: '2786facb426326f674aee4a666cfd8de93462bc6f185e4c4cb6921869471c1b6',
      evidenceIds: ['ev_src_gov_ce'],
      effectiveValidUntil: '2027-07-17T22:15:00.000Z',
      promotedBy: 'reviewer-owner-001',
      promotedAt: '2026-07-18T16:00:00.000Z',
      reason: 'Administrative Promotion',
      publicationAllowed: false,
      batchId: 'P-A',
      rollbackSpecification: {
        statusRollbackTo: 'under_review',
        requiresNewEvent: true
      },
      policyVersion: '1.0.0'
    };

    expect(() => promotionEventSchema.parse(event)).not.toThrow();
  });

  it('source should have publication blocked even if verified', () => {
    const source = {
      id: 'src_gov_ce',
      name: 'Governo do CE',
      url: 'https://ce.gov.br',
      type: 'government',
      reliability_score: 90,
      last_verified: '2026-07-18T16:00:00.000Z',
      status: 'verified_basic',
      publicListingAllowed: false,
      publicationStatus: 'not_published'
    };

    const parsed = trustSourceSchema.parse(source);
    expect(parsed.publicListingAllowed).toBe(false);
    expect(parsed.publicationStatus).toBe('not_published');
  });
});
