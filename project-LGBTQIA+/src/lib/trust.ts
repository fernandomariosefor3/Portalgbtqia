import {
  TrustVerificationStatus,
  TrustEditorialStatus,
  TrustService,
  TrustContent,
  TrustEvent,
  TrustOpportunity,
  TrustSource,
  PublicTrustService,
  PublicTrustContent,
  PublicTrustEvent,
  PublicTrustOpportunity,
  PublicTrustSource
} from '../types/trust';

export const DEFAULT_REVIEW_POLICY = {
  service: 90, // Days
  serviceContact: 60,
  healthContent: 180,
  legalContent: 180,
  event: 0,
  opportunity: 0
};

// ---------------------------------------------------------------------------
// TRANSITION RULES
// ---------------------------------------------------------------------------

export function canTransitionVerificationStatus(
  current: TrustVerificationStatus,
  next: TrustVerificationStatus
): boolean {
  if (current === next) return true;

  // You cannot transition directly to partner, it must be a manual external process or specific workflow
  if (next === 'partner') return false;

  switch (current) {
    case 'submitted':
      return ['under_review', 'rejected'].includes(next);
    case 'under_review':
      return ['verified_basic', 'rejected'].includes(next);
    case 'verified_basic':
      return ['community_reviewed', 'outdated', 'suspended'].includes(next);
    case 'community_reviewed':
      return ['verified_basic', 'outdated', 'suspended'].includes(next);
    case 'partner':
      return ['suspended', 'outdated'].includes(next); // Partner can be suspended or outdated
    case 'outdated':
      return ['under_review', 'suspended'].includes(next);
    case 'suspended':
      return ['under_review', 'rejected'].includes(next);
    case 'rejected':
      // Must go through submitted again to be reconsidered
      return ['submitted'].includes(next);
    default:
      return false;
  }
}

export function canTransitionEditorialStatus(
  current: TrustEditorialStatus,
  next: TrustEditorialStatus
): boolean {
  if (current === next) return true;

  switch (current) {
    case 'draft':
      // Cannot go directly to validated
      return ['under_review', 'archived'].includes(next);
    case 'under_review':
      return ['draft', 'validated', 'blocked'].includes(next);
    case 'validated':
      return ['outdated', 'blocked', 'archived'].includes(next);
    case 'outdated':
      return ['under_review', 'archived', 'blocked'].includes(next);
    case 'blocked':
      // Blocked content must go through review again to be public
      return ['under_review', 'archived'].includes(next);
    case 'archived':
      return ['draft'].includes(next); // Restore as draft
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// PURE BUSINESS LOGIC
// ---------------------------------------------------------------------------

export function isServiceFresh(service: TrustService, currentDate: Date = new Date()): boolean {
  if (service.isOutdatedFlag) return false;
  if (!service.lastVerifiedAt) return false;

  if (service.nextReviewAt) {
    const nextReview = new Date(service.nextReviewAt);
    return currentDate <= nextReview;
  }

  // Fallback to default policy
  const lastVerified = new Date(service.lastVerifiedAt);
  const expiryDate = new Date(lastVerified.getTime() + DEFAULT_REVIEW_POLICY.service * 24 * 60 * 60 * 1000);
  return currentDate <= expiryDate;
}

export function canDisplayServicePublicly(service: TrustService): boolean {
  const allowedStatuses: TrustVerificationStatus[] = ['verified_basic', 'community_reviewed', 'partner', 'outdated'];
  return allowedStatuses.includes(service.status);
}

export function canRecommendService(service: TrustService, currentDate: Date = new Date()): boolean {
  // A service can only be recommended if it's verified, fresh, and has sources
  const allowedStatuses: TrustVerificationStatus[] = ['verified_basic', 'community_reviewed', 'partner'];
  
  if (!allowedStatuses.includes(service.status)) return false;
  if (!service.lastVerifiedAt) return false;
  if (service.status === 'suspended') return false; // Redundant but explicit
  if (!isServiceFresh(service, currentDate)) return false;
  if (!service.sourceIds || service.sourceIds.length === 0) return false;

  return true;
}

export function isContentFresh(content: TrustContent, currentDate: Date = new Date()): boolean {
  if (content.status === 'outdated') return false;
  if (content.nextReviewAt) {
    const nextReview = new Date(content.nextReviewAt);
    return currentDate <= nextReview;
  }
  return true; // No expiration defined means it stays fresh until manually flagged
}

export function canPublishContent(content: TrustContent): boolean {
  return ['validated', 'outdated'].includes(content.status);
}

export function canUseContentInFarol(content: TrustContent, currentDate: Date = new Date()): boolean {
  // Farol Agent can only use validated, fresh content
  if (content.status !== 'validated') return false;
  if (content.validationStatus !== 'verified_basic' && content.validationStatus !== 'partner' && content.validationStatus !== 'community_reviewed') return false;
  if (!isContentFresh(content, currentDate)) return false;
  if (!hasValidSources(content)) return false;
  
  return true;
}

export function hasValidSources(entity: { sourceIds: string[] }): boolean {
  return Array.isArray(entity.sourceIds) && entity.sourceIds.length > 0;
}

export function isSourceValid(source: TrustSource): boolean {
  const allowedStatuses: TrustVerificationStatus[] = ['verified_basic', 'community_reviewed', 'partner'];
  if (!allowedStatuses.includes(source.status)) return false;
  if (!source.url && !source.organizationId) return false; // Needs some valid identifier
  return true;
}

export function isEventExpired(event: TrustEvent, currentDate: Date = new Date()): boolean {
  return currentDate > new Date(event.endsAt);
}

export function isOpportunityExpired(opportunity: TrustOpportunity, currentDate: Date = new Date()): boolean {
  if (!opportunity.applicationDeadline) return false; // No deadline = open until closed
  return currentDate > new Date(opportunity.applicationDeadline);
}

export function calculateNextReviewDate(lastVerifiedAt: string, daysToAdd: number): string {
  const date = new Date(lastVerifiedAt);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString();
}

// ---------------------------------------------------------------------------
// PROJECTIONS
// ---------------------------------------------------------------------------

export function toPublicService(service: TrustService): PublicTrustService {
  const {
    securityObservations,
    internalNotes,
    reporterId,
    verifiedById,
    ...publicFields
  } = service;
  return publicFields;
}

export function toPublicContent(content: TrustContent): PublicTrustContent {
  const {
    internalNotes,
    reviewerId,
    authorId,
    ...publicFields
  } = content;
  return publicFields;
}

export function toPublicEvent(event: TrustEvent): PublicTrustEvent {
  const {
    internalNotes,
    verifiedById,
    ...publicFields
  } = event;
  return publicFields;
}

export function toPublicOpportunity(opportunity: TrustOpportunity): PublicTrustOpportunity {
  const {
    internalNotes,
    verifiedById,
    ...publicFields
  } = opportunity;
  return publicFields;
}

export function toPublicSource(source: TrustSource): PublicTrustSource {
  const {
    observations,
    verifiedById,
    ...publicFields
  } = source;
  return publicFields;
}
