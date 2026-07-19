import { describe, it, expect } from 'vitest';
import {
  canTransitionVerificationStatus,
  canTransitionEditorialStatus,
  isServiceFresh,
  canRecommendService,
  canPublishContent,
  canUseContentInFarol,
  isEventExpired,
  isOpportunityExpired,
  calculateNextReviewDate,
  toPublicService,
  toPublicContent,
  isSourceValid,
} from './trust';
import {
  TrustService,
  TrustContent,
  TrustEvent,
  TrustOpportunity,
  TrustSource
} from '../types/trust';

describe('Trust Models & Validation', () => {
  describe('Status Transitions', () => {
    it('prevents direct transition from submitted to partner', () => {
      expect(canTransitionVerificationStatus('submitted', 'partner')).toBe(false);
    });

    it('prevents direct transition from draft to validated', () => {
      expect(canTransitionEditorialStatus('draft', 'validated')).toBe(false);
    });

    it('allows valid transitions', () => {
      expect(canTransitionVerificationStatus('submitted', 'under_review')).toBe(true);
      expect(canTransitionEditorialStatus('under_review', 'validated')).toBe(true);
    });
    
    it('prevents rejected from becoming verified_basic directly', () => {
      expect(canTransitionVerificationStatus('rejected', 'verified_basic')).toBe(false);
      expect(canTransitionVerificationStatus('rejected', 'submitted')).toBe(true); // Must re-submit
    });

    it('prevents blocked content from publishing directly', () => {
      expect(canTransitionEditorialStatus('blocked', 'validated')).toBe(false);
    });
    
    it('never assigns partner automatically (always false for transition logic)', () => {
      expect(canTransitionVerificationStatus('verified_basic', 'partner')).toBe(false);
      expect(canTransitionVerificationStatus('community_reviewed', 'partner')).toBe(false);
    });
  });

  describe('Farol Rules (TrustContent)', () => {
    const baseContent: TrustContent = {
      id: '1',
      title: 'Title',
      summary: 'Sum',
      content: 'Content',
      thematicArea: [],
      targetAudience: [],
      sourceIds: ['s1'],
      authorId: 'a1',
      status: 'validated',
      validationStatus: 'verified_basic',
      tags: [],
      plainLanguageAvailable: false,
      librasVersionAvailable: false,
      audioVersionAvailable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('draft cannot be used by Farol', () => {
      expect(canUseContentInFarol({ ...baseContent, status: 'draft' })).toBe(false);
    });

    it('under_review cannot be used by Farol', () => {
      expect(canUseContentInFarol({ ...baseContent, status: 'under_review' })).toBe(false);
    });

    it('blocked cannot be published or used by Farol', () => {
      expect(canPublishContent({ ...baseContent, status: 'blocked' })).toBe(false);
      expect(canUseContentInFarol({ ...baseContent, status: 'blocked' })).toBe(false);
    });

    it('content without source cannot be used by Farol', () => {
      expect(canUseContentInFarol({ ...baseContent, sourceIds: [] })).toBe(false);
    });
  });

  describe('Service Recommendations (TrustService)', () => {
    const baseService: TrustService = {
      id: '1',
      name: 'Service',
      description: 'Desc',
      category: [],
      isFree: true,
      targetAudience: [],
      accessibility: [],
      librasSupport: false,
      requiredDocuments: [],
      restrictions: [],
      sourceIds: ['s1'],
      status: 'verified_basic',
      lastVerifiedAt: new Date().toISOString(),
      isOutdatedFlag: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('submitted service does not appear as recommended', () => {
      expect(canRecommendService({ ...baseService, status: 'submitted' })).toBe(false);
    });

    it('suspended service cannot be recommended', () => {
      expect(canRecommendService({ ...baseService, status: 'suspended' })).toBe(false);
    });

    it('service without lastVerifiedAt cannot appear as verified/recommended', () => {
      expect(canRecommendService({ ...baseService, lastVerifiedAt: undefined })).toBe(false);
    });

    it('service with expired review cannot be recommended', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100); // Exceeds default 90 days policy
      const service = { ...baseService, lastVerifiedAt: oldDate.toISOString() };
      expect(isServiceFresh(service, new Date())).toBe(false);
      expect(canRecommendService(service, new Date())).toBe(false);
    });
  });

  describe('Events & Opportunities', () => {
    it('expired event is identified', () => {
      const event: TrustEvent = {
        id: '1', title: 'E', description: 'D', isFree: true, sourceIds: [], status: 'verified_basic',
        startsAt: '2020-01-01T10:00:00Z', endsAt: '2020-01-01T12:00:00Z', createdAt: '', updatedAt: ''
      };
      expect(isEventExpired(event, new Date('2020-01-02T00:00:00Z'))).toBe(true);
      expect(isEventExpired(event, new Date('2019-12-31T00:00:00Z'))).toBe(false);
    });

    it('opportunity with closed deadline is identified', () => {
      const opp: TrustOpportunity = {
        id: '1', title: 'O', description: 'D', opportunityType: 'job', sourceIds: [], status: 'verified_basic',
        applicationDeadline: '2020-01-01T12:00:00Z', createdAt: '', updatedAt: ''
      };
      expect(isOpportunityExpired(opp, new Date('2020-01-02T00:00:00Z'))).toBe(true);
      expect(isOpportunityExpired(opp, new Date('2019-12-31T00:00:00Z'))).toBe(false);
    });
  });

  describe('Sources Validation', () => {
    it('suspended or rejected source is not considered valid', () => {
      const source: TrustSource = {
        id: '1', title: 'S', sourceType: 'public_agency', thematicArea: [], language: 'pt',
        lastConsultedAt: '', status: 'suspended', reliabilityLevel: 'high', classificationReasons: [],
        createdAt: '', updatedAt: ''
      };
      expect(isSourceValid(source)).toBe(false);
      expect(isSourceValid({ ...source, status: 'rejected' })).toBe(false);
      expect(isSourceValid({ ...source, status: 'verified_basic', url: 'http://a.com' })).toBe(true);
    });
  });

  describe('Public Projections', () => {
    it('removes internal fields from TrustService', () => {
      const service = {
        id: '1', name: 'Name', securityObservations: 'secret', internalNotes: 'notes', reporterId: 'user1', verifiedById: 'admin',
      } as unknown as TrustService;
      const pub = toPublicService(service);
      expect((pub as any).securityObservations).toBeUndefined();
      expect((pub as any).internalNotes).toBeUndefined();
      expect((pub as any).reporterId).toBeUndefined();
      expect((pub as any).verifiedById).toBeUndefined();
      expect(pub.id).toBe('1');
    });

    it('removes internal fields from TrustContent', () => {
      const content = {
        id: '1', title: 'Title', internalNotes: 'notes', reviewerId: 'admin', authorId: 'author1',
      } as unknown as TrustContent;
      const pub = toPublicContent(content);
      expect((pub as any).internalNotes).toBeUndefined();
      expect((pub as any).reviewerId).toBeUndefined();
      expect((pub as any).authorId).toBeUndefined();
      expect(pub.id).toBe('1');
    });
  });

  describe('Dates and Purity', () => {
    it('calculateNextReviewDate does not mutate and returns ISO string', () => {
      const dateStr = '2023-01-01T10:00:00.000Z';
      const result = calculateNextReviewDate(dateStr, 10);
      expect(result).toBe('2023-01-11T10:00:00.000Z');
      expect(dateStr).toBe('2023-01-01T10:00:00.000Z'); // Original unchanged
    });

    it('rejects invalid dates securely', () => {
      expect(() => calculateNextReviewDate('invalid', 10)).toThrow('Invalid date provided');
    });
  });
});
