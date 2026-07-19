import { describe, it, expect } from 'vitest';
import { validateAdministrativeMutation, AdministrativeMutationContext, ADMINISTRATIVE_MUTATION_POLICY_VERSION } from '../lib/administrativeMutation.js';

describe('Administrative Mutation Validation', () => {
  const asOf = new Date('2026-07-18T23:38:00.000Z');
  
  const baseSnapshot = {
    id: 'org_test',
    type: 'ngo',
    name: 'Test Org',
    status: 'under_review',
    publicationStatus: 'not_published',
    publicListingAllowed: false
  };

  const baseEvent = {
    id: 'evt_1',
    entityId: 'org_test',
    entityType: 'organization',
    previousStatus: 'under_review',
    newStatus: 'verified_basic',
    effectiveValidationId: 'val_1',
    integrityDigest: 'fake_digest',
    promotedAt: '2026-07-18T20:00:00.000Z',
    policyVersion: ADMINISTRATIVE_MUTATION_POLICY_VERSION
  };

  const baseValidation = {
    id: 'val_1',
    validUntil: '2027-01-01T00:00:00.000Z'
  };

  // Helper to mock the digest so it matches the event
  // In real life it's computeIntegrityDigestV2, but we mock it or set event digest correctly
  // Actually the function imports computeIntegrityDigestV2 from humanReview.
  // We can just construct real objects and real digests.
  
  it('should accept valid status change with valid event', async () => {
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    
    const currentEntity = {
      ...baseSnapshot,
      status: 'verified_basic'
    };
    const digest = computeIntegrityDigestV2(currentEntity);
    
    const event = { ...baseEvent, integrityDigest: digest };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.changedAdministrativePaths).toContain('status');
  });

  it('should reject status change without event', () => {
    const currentEntity = {
      ...baseSnapshot,
      status: 'verified_basic'
    };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [], // NO EVENT
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'PROMOTION_EVENT_MISSING')).toBe(true);
  });

  it('should reject event for a different entity', async () => {
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    const currentEntity = { ...baseSnapshot, status: 'verified_basic' };
    const event = { ...baseEvent, entityId: 'org_OTHER', integrityDigest: computeIntegrityDigestV2(currentEntity) };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'PROMOTION_EVENT_MISSING')).toBe(true); // Because filter drops it
  });

  it('should reject duplicated events', async () => {
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    const currentEntity = { ...baseSnapshot, status: 'verified_basic' };
    const event = { ...baseEvent, integrityDigest: computeIntegrityDigestV2(currentEntity) };
    const event2 = { ...event, id: 'evt_2' };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event, event2],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'PROMOTION_EVENT_DUPLICATED')).toBe(true);
  });

  it('should reject incorrect previous status', async () => {
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    const currentEntity = { ...baseSnapshot, status: 'verified_basic' };
    const event = { ...baseEvent, previousStatus: 'submitted', integrityDigest: computeIntegrityDigestV2(currentEntity) };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'PREVIOUS_STATUS_MISMATCH')).toBe(true);
  });

  it('should reject missing v2 validation', async () => {
    // A validation mismatch would mean the event points to a different validation
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    const currentEntity = { ...baseSnapshot, status: 'verified_basic' };
    const event = { ...baseEvent, effectiveValidationId: 'val_WRONG', integrityDigest: computeIntegrityDigestV2(currentEntity) };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation, // val_1
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'PROMOTION_EVENT_MISSING')).toBe(true);
  });

  it('should reject mismatched integrity digest', async () => {
    const currentEntity = { ...baseSnapshot, status: 'verified_basic' };
    const event = { ...baseEvent, integrityDigest: 'bad_hash' };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'EVENT_DIGEST_MISMATCH')).toBe(true);
  });

  it('should reject expired promotion event', async () => {
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    const currentEntity = { ...baseSnapshot, status: 'verified_basic' };
    const event = { ...baseEvent, promotedAt: '2026-07-20T00:00:00.000Z', integrityDigest: computeIntegrityDigestV2(currentEntity) }; // After asOf
    
    const context: AdministrativeMutationContext = {
      asOf, // 2026-07-18
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'EVENT_OUTSIDE_VALIDITY')).toBe(true);
  });

  it('should reject unauthorized name change hidden in promotion', async () => {
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    const currentEntity = { ...baseSnapshot, status: 'verified_basic', name: 'Hacked Name' };
    const event = { ...baseEvent, integrityDigest: computeIntegrityDigestV2(currentEntity) }; // Event matches the hacked entity
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot, // Snapshot has 'Test Org'
      currentEntity, // Has 'Hacked Name'
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'UNAUTHORIZED_ENTITY_CHANGE' && e.path === 'name')).toBe(true);
  });

  it('should reject unauthorized publication change (publicListingAllowed)', async () => {
    const { computeIntegrityDigestV2 } = await import('../lib/humanReview.js');
    const currentEntity = { ...baseSnapshot, status: 'verified_basic', publicListingAllowed: true };
    const event = { ...baseEvent, integrityDigest: computeIntegrityDigestV2(currentEntity) };
    
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: baseSnapshot,
      currentEntity,
      currentEvidence: [],
      promotionEvents: [event],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'UNAUTHORIZED_PUBLICATION_MUTATION')).toBe(true);
  });

  it('should reject missing snapshot', () => {
    const context: AdministrativeMutationContext = {
      asOf,
      effectiveValidation: baseValidation,
      validatedEntitySnapshot: null,
      currentEntity: { ...baseSnapshot, status: 'verified_basic' },
      currentEvidence: [],
      promotionEvents: [baseEvent],
      integrityManifest: []
    };

    const result = validateAdministrativeMutation(context);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === 'VALIDATED_SNAPSHOT_UNAVAILABLE')).toBe(true);
  });
});
