import { describe, it, expect, vi } from 'vitest';
import { evaluatePromotionEligibility, PromotionContext } from '../lib/promotionEligibility.js';
import { Validation } from '../lib/humanReview.js';

describe('Promotion Eligibility Engine', () => {
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

  const createValidation = (overrides: Partial<Validation>): Validation => ({
    id: 'val_1',
    entityType: 'service',
    entityId: 'srv_1',
    reviewerId: 'rev_1',
    reviewerRole: 'registry_reviewer',
    reviewedAt: '2026-07-01T10:00:00Z',
    decision: 'approved_basic',
    evidenceIds: [],
    confirmedFields: [],
    unconfirmedFields: [],
    reviewPacketVersion: '1.0.0',
    entityFingerprint: 'mock',
    evidenceFingerprint: 'mock',
    ...overrides
  });

  it('approved_basic alone does not promote if evidence or deps fail', () => {
    const ctx = createBaseContext();
    const service = { id: 'srv_1', status: 'under_review', organization_id: 'org_1' };
    ctx.registry.services.push(service);
    ctx.registry.validations.push(createValidation({ entityId: 'srv_1' }));
    // org_1 is missing

    const result = evaluatePromotionEligibility(service, 'service', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('ORGANIZATION_NOT_ELIGIBLE');
  });

  it('entity without approved_basic is ineligible', () => {
    const ctx = createBaseContext();
    const service = { id: 'srv_1', status: 'under_review' };
    ctx.registry.services.push(service);
    ctx.registry.validations.push(createValidation({ entityId: 'srv_1', decision: 'needs_more_evidence' }));

    const result = evaluatePromotionEligibility(service, 'service', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('NEEDS_MORE_EVIDENCE');
  });

  it('sensitive service without second review is ineligible', () => {
    const ctx = createBaseContext();
    const source = { id: 'src_1', status: 'under_review' };
    const org = { id: 'org_1', status: 'under_review', source_id: 'src_1' };
    const service = { id: 'srv_1', status: 'under_review', organization_id: 'org_1', category: ['saude'] };

    ctx.registry.sources.push(source);
    ctx.registry.organizations.push(org);
    ctx.registry.services.push(service);

    ctx.registry.validations.push(createValidation({ entityId: 'src_1', entityType: 'source' }));
    ctx.registry.validations.push(createValidation({ entityId: 'org_1', entityType: 'organization' }));
    ctx.registry.validations.push(createValidation({ entityId: 'srv_1', entityType: 'service' }));

    const result = evaluatePromotionEligibility(service, 'service', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('SECOND_REVIEW_MISSING');
  });

  it('expired validation blocks promotion', () => {
    const ctx = createBaseContext();
    const org = { id: 'org_1', status: 'under_review', source_id: 'src_1' };
    ctx.registry.organizations.push(org);
    // validUntil is in the past compared to dummyDate
    ctx.registry.validations.push(createValidation({ entityId: 'org_1', entityType: 'organization', validUntil: '2026-01-01T10:00:00Z' }));

    const result = evaluatePromotionEligibility(org, 'organization', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('VALIDATION_EXPIRED');
  });

  it('alias is ineligible and points to canonical', () => {
    const ctx = createBaseContext();
    const aliasService = { 
      id: 'srv_alias', 
      status: 'archived', 
      description: 'canonicalServiceId: srv_canonical' 
    };

    const result = evaluatePromotionEligibility(aliasService, 'service', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('LEGACY_ALIAS_NOT_PUBLIC');
    expect(result.canonicalEntityId).toBe('srv_canonical');
  });

  it('Casa Transformar remains ineligible due to NEEDS_MORE_EVIDENCE and protected risk', () => {
    const ctx = createBaseContext();
    const service = { id: 'srv_casa_transformar_acolhimento', status: 'under_review' };
    ctx.registry.validations.push(createValidation({ 
      entityId: 'srv_casa_transformar_acolhimento', 
      decision: 'needs_more_evidence',
      internalNotes: 'requiresSecondReview: true; publicAddressAllowed: false'
    }));

    const result = evaluatePromotionEligibility(service, 'service', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('NEEDS_MORE_EVIDENCE');
    expect(result.blockingReasons).toContain('SECOND_REVIEW_MISSING');
    expect(result.blockingReasons).toContain('PROTECTED_DATA_RISK');
  });

  it('conflicting validations blocks promotion', () => {
    const ctx = createBaseContext();
    const source = { id: 'src_1', status: 'under_review' };
    
    // Multiple active validations with different decisions
    ctx.registry.validations.push(createValidation({ id: 'v1', entityId: 'src_1', decision: 'approved_basic', reviewedAt: '2026-07-01T10:00:00Z', validUntil: '2027-01-01T00:00:00Z' }));
    ctx.registry.validations.push(createValidation({ id: 'v2', entityId: 'src_1', decision: 'needs_more_evidence', reviewedAt: '2026-06-01T10:00:00Z', validUntil: '2027-01-01T00:00:00Z' }));

    const result = evaluatePromotionEligibility(source, 'source', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('CONFLICTING_VALIDATIONS');
  });

  it('eligible source does not make org eligible automatically if org is missing validation', () => {
    const ctx = createBaseContext();
    const source = { id: 'src_1', status: 'under_review' };
    const org = { id: 'org_1', status: 'under_review', source_id: 'src_1' };
    ctx.registry.sources.push(source);
    ctx.registry.organizations.push(org);

    // Only source has validation
    ctx.registry.validations.push(createValidation({ entityId: 'src_1', entityType: 'source' }));

    const result = evaluatePromotionEligibility(org, 'organization', ctx);
    expect(result.eligible).toBe(false);
    expect(result.blockingReasons).toContain('NO_APPROVED_BASIC_REVIEW');
  });

});
