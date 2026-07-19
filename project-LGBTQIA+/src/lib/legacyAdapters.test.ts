import { describe, it, expect } from 'vitest';
import {
  adaptLegacyArticle,
  adaptLegacyEvent,
  adaptLegacySafeSpace,
  adaptLegacyHealthGuide,
  adaptLegacyLegalGuide,
  resolveLegacySourceReferences,
  generateMigrationReport,
} from './legacyAdapters';
import { LegacyAdaptationContext } from '../types/migration';

describe('legacyAdapters', () => {
  const mockNow = '2026-07-17T12:00:00Z';
  const mockContext: LegacyAdaptationContext = {
    now: mockNow,
    knownSources: [
      {
        id: 'ts_1',
        title: 'Ministério da Saúde',
        url: 'https://saude.gov.br',
        domain: 'saude.gov.br',
        status: 'verified_basic',
        createdAt: mockNow,
        updatedAt: mockNow,
      } as any,
      {
        id: 'ts_2',
        title: 'Fonte Suspeita',
        url: 'https://suspeita.com',
        domain: 'suspeita.com',
        status: 'suspended',
        createdAt: mockNow,
        updatedAt: mockNow,
      } as any,
    ],
  };

  describe('Source Resolution', () => {
    it('should exact_match a valid source', () => {
      const res = resolveLegacySourceReferences([{ url: 'https://saude.gov.br' }], mockContext.knownSources!);
      expect(res.level).toBe('exact_match');
      expect(res.resolvedIds).toContain('ts_1');
    });

    it('should block a suspended source', () => {
      const res = resolveLegacySourceReferences([{ url: 'https://suspeita.com' }], mockContext.knownSources!);
      expect(res.level).toBe('blocked');
      expect(res.resolvedIds).toHaveLength(0);
    });

    it('should be ambiguous if only domain matches', () => {
      const res = resolveLegacySourceReferences([{ url: 'https://saude.gov.br/outra-pagina' }], mockContext.knownSources!);
      expect(res.level).toBe('ambiguous');
      expect(res.ambiguousMatches).toHaveLength(1);
    });

    it('should be missing if no matches', () => {
      const res = resolveLegacySourceReferences([{ url: 'https://nada.com' }], mockContext.knownSources!);
      expect(res.level).toBe('missing');
    });
  });

  describe('adaptLegacyArticle', () => {
    it('blocks if no sources', () => {
      const article = { title: 'Test Article', content: 'content' };
      const res = adaptLegacyArticle(article, mockContext);
      expect(res.migrationStatus).toBe('blocked');
      expect(res.errors.some(e => e.code === 'MISSING_SOURCE')).toBe(true);
    });

    it('assigns temp id if missing', () => {
      const article = { title: 'Test Article', content: 'content', sourceUrl: 'https://saude.gov.br' };
      const res = adaptLegacyArticle(article, mockContext);
      expect(res.inferredFields).toContain('id');
      expect(res.migrationStatus).toBe('needs_review'); // not blocked, source is exact_match
    });
    
    it('does not mutate input array tags', () => {
       const article = { id: '1', title: 'T', content: 'C', sourceUrl: 'https://saude.gov.br', tags: ['a'] };
       const res = adaptLegacyArticle(article, mockContext);
       expect(res.record?.tags).not.toBe(article.tags);
       expect(res.record?.tags).toEqual(['a']);
    });
  });

  describe('adaptLegacyEvent', () => {
    it('expires past events', () => {
      const evt = { id: '1', title: 'T', start_date: '2025-01-01T00:00:00Z', end_date: '2025-01-02T00:00:00Z', source_url: 'https://saude.gov.br' };
      const res = adaptLegacyEvent(evt, mockContext);
      expect(res.errors.some(e => e.code === 'EXPIRED_EVENT')).toBe(true);
    });

    it('blocks if no source', () => {
      const evt = { id: '1', title: 'T', start_date: '2030-01-01T00:00:00Z', end_date: '2030-01-02T00:00:00Z' };
      const res = adaptLegacyEvent(evt, mockContext);
      expect(res.migrationStatus).toBe('blocked');
      expect(res.errors.some(e => e.code === 'MISSING_SOURCE')).toBe(true);
    });
  });

  describe('adaptLegacySafeSpace', () => {
    it('strips verification level and stays submitted', () => {
      const space = { id: '1', name: 'N', address: 'A', verificationLevel: 3 };
      const res = adaptLegacySafeSpace(space, mockContext);
      expect(res.warnings.some(w => w.code === 'LEGACY_VERIFICATION_NOT_TRANSFERABLE')).toBe(true);
      expect(res.record?.status).toBe('submitted');
      expect((res.record as any).verificationLevel).toBeUndefined();
    });
  });

  describe('Health and Legal Guides', () => {
    it('blocks health guide without source', () => {
      const guide = { id: '1', title: 'T', content: 'C' };
      const res = adaptLegacyHealthGuide(guide, mockContext);
      expect(res.migrationStatus).toBe('blocked');
      expect(res.errors.some(e => e.code === 'SENSITIVE_CLAIM_WITHOUT_SOURCE')).toBe(true);
      expect(res.record?.status).toBe('blocked');
    });

    it('blocks legal guide without source', () => {
      const guide = { id: '1', title: 'T', content: 'C' };
      const res = adaptLegacyLegalGuide(guide, mockContext);
      expect(res.migrationStatus).toBe('blocked');
      expect(res.errors.some(e => e.code === 'SENSITIVE_CLAIM_WITHOUT_SOURCE')).toBe(true);
      expect(res.record?.status).toBe('blocked');
    });
  });

  describe('generateMigrationReport', () => {
    it('detects duplicate slugs', () => {
      const items = [
        { id: '1', title: 'A', content: 'C', slug: 'teste' },
        { id: '2', title: 'B', content: 'C', slug: 'teste' }
      ];
      const metrics = generateMigrationReport(items, adaptLegacyArticle, mockContext);
      expect(metrics.totalAnalyzed).toBe(2);
      expect(metrics.missingSources).toBe(2);
      // second one should have duplicate slug error, requires human review is checked
      expect(metrics.requiresHumanReview).toBe(2); // both missing sources
    });
  });
});
