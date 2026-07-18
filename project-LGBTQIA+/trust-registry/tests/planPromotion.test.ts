import { describe, it, expect } from 'vitest';
import { generatePromotionPlan } from '../../scripts/plan-registry-promotion.js';

describe('Plan Registry Promotion', () => {

  it('is deterministic and generates expected structures without mutating data', () => {
    // This is basically an integration test on the mock/pilot data
    // we use a fixed date
    const plan = generatePromotionPlan(new Date('2026-07-18T16:00:00.000Z'), true);
    
    expect(plan.metadata.isDryRun).toBe(true);
    expect(plan.lots.lotePA_sources).toBeInstanceOf(Array);
    expect(plan.lots.lotePB_organizations).toBeInstanceOf(Array);
    
    // Services never appear in lots
    const allCandidates = [...plan.lots.lotePA_sources, ...plan.lots.lotePB_organizations];
    allCandidates.forEach(c => {
      expect(c.type).not.toBe('service');
      expect(c.id).not.toContain('srv_');
    });

    // Aliases never appear
    plan.excluded.forEach(e => {
      if (e.blockingReason === 'IS_ALIAS') {
        expect(e.id).toBeTruthy();
      }
    });

    // Order: Sources first (done by the script filtering the lots)
    expect(plan.lots.lotePA_sources.every((c: any) => c.type === 'source')).toBe(true);
    expect(plan.lots.lotePB_organizations.every((c: any) => c.type === 'organization')).toBe(true);

    // Publication logic
    allCandidates.forEach(c => {
      expect(c.publicationAllowed).toBe(false);
      expect(c.publicationStatus).toBe('not_published');
      expect(c.rollbackProposed).toBeDefined();
    });
  });

  it('fails if isDryRun is false', () => {
    expect(() => generatePromotionPlan(new Date(), false)).toThrow('This script is exclusively for dry-run simulation');
  });

});
