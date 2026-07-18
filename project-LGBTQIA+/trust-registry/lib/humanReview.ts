import crypto from 'crypto';
import { z } from 'zod';
import { 
  humanReviewDecisionSchema, 
  humanReviewerRoleSchema,
  validationSchema 
} from '../schemas/index.js';

export type HumanReviewDecision = z.infer<typeof humanReviewDecisionSchema>;
export type HumanReviewerRole = z.infer<typeof humanReviewerRoleSchema>;
export type Validation = z.infer<typeof validationSchema>;

export interface HumanReviewIssue {
  code: string;
  message: string;
}

export interface HumanReviewEligibilityResult {
  eligible: boolean;
  proposedStatus?: 'verified_basic';
  blockingIssues: HumanReviewIssue[];
  warnings: HumanReviewIssue[];
  requiresSecondReview: boolean;
  requiredReviewerRoles: HumanReviewerRole[];
}

export function computeFingerprint(data: any): string {
  // Hash determinístico sem segredos
  const str = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

export function sanitizeReviewPacket(entityType: string, entity: any): any {
  // Remove dados protegidos para o Markdown público e repositório
  const sanitized = JSON.parse(JSON.stringify(entity));
  
  if (sanitized.contact && sanitized.contact.publicAddressAllowed === false) {
    sanitized.contact.protectedAddressRef = 'address_hidden_for_security';
    delete sanitized.contact.address;
    delete sanitized.contact.neighborhood;
    delete sanitized.contact.zipCode;
    delete sanitized.contact.coordinates;
    delete sanitized.contact.referencePoint;
  }

  if (sanitized.internalNotes) delete sanitized.internalNotes;
  
  return sanitized;
}

export function prepareReviewPacket(
  entityType: 'source' | 'organization' | 'service', 
  entity: any, 
  evidenceList: any[], 
  reviewQueueItem?: any
) {
  const entityFingerprint = computeFingerprint(entity);
  const evidenceFingerprint = computeFingerprint(evidenceList);

  const packetVersion = '1.0.0';
  
  return {
    metadata: {
      packetVersion,
      generatedAt: new Date().toISOString(),
      entityUpdatedAt: entity.updated_at || entity.last_verified || new Date().toISOString(),
      entityFingerprint,
      evidenceFingerprint,
      schemaVersion: '1.0.0',
      reviewProcessVersion: '1.0.0'
    },
    entityType,
    entity,
    evidenceList,
    reviewQueueItem
  };
}

export function detectStaleReviewPacket(validation: Validation, currentEntity: any, currentEvidenceList: any[]): boolean {
  const currentEntityFingerprint = computeFingerprint(currentEntity);
  const currentEvidenceFingerprint = computeFingerprint(currentEvidenceList);

  if (validation.entityFingerprint !== currentEntityFingerprint) return true;
  if (validation.evidenceFingerprint !== currentEvidenceFingerprint) return true;

  return false;
}

export function evaluateHumanReviewPromotion(
  entityType: 'source' | 'organization' | 'service',
  entity: any,
  validation: Validation,
  evidenceList: any[]
): HumanReviewEligibilityResult {
  const result: HumanReviewEligibilityResult = {
    eligible: false,
    blockingIssues: [],
    warnings: [],
    requiresSecondReview: false,
    requiredReviewerRoles: []
  };

  if (validation.decision !== 'approved_basic') {
    result.blockingIssues.push({ code: 'NOT_APPROVED', message: 'Validation decision is not approved_basic' });
  }

  if (detectStaleReviewPacket(validation, entity, evidenceList)) {
    result.blockingIssues.push({ code: 'STALE_REVIEW_PACKET', message: 'The entity or evidence changed since validation' });
  }

  // Verifica expiração
  const now = new Date();
  if (validation.validUntil && new Date(validation.validUntil) < now) {
    result.blockingIssues.push({ code: 'VALIDATION_EXPIRED', message: 'Validation has expired' });
  }

  // Sensibilidade
  if (entityType === 'service') {
    const isSensitive = entity.category?.some((c: string) => ['saude', 'direitos', 'acolhimento_social', 'saude_trans', 'prevencao_hiv'].includes(c));
    const isCasaTransformar = entity.id === 'srv_casa_transformar_acolhimento';
    const isSertrans = entity.id === 'srv_sertrans';
    
    if (isSensitive || isCasaTransformar || isSertrans) {
      result.requiresSecondReview = true;
      if (entity.category?.includes('saude')) result.requiredReviewerRoles.push('health_reviewer');
      if (entity.category?.includes('direitos')) result.requiredReviewerRoles.push('legal_reviewer');
      if (entity.category?.includes('acolhimento_social')) result.requiredReviewerRoles.push('privacy_reviewer');
    }

    if (entity.organization_id === 'org_hsj_ce') {
      result.warnings.push({ code: 'HSJ_RESTRICTION', message: 'Ensure service is explicitly confirmed by HSJ, do not inherit generic Sesa services.' });
    }
  }

  if (result.blockingIssues.length === 0) {
    result.eligible = true;
    result.proposedStatus = 'verified_basic';
  }

  return result;
}

export function validateHumanReview(validation: Validation, reviewers: any[], entity: any): HumanReviewIssue[] {
  const issues: HumanReviewIssue[] = [];

  const reviewer = reviewers.find(r => r.id === validation.reviewerId);
  if (!reviewer) {
    issues.push({ code: 'REVIEWER_NOT_FOUND', message: 'Reviewer does not exist' });
    return issues;
  }

  if (!reviewer.active) {
    issues.push({ code: 'REVIEWER_INACTIVE', message: 'Reviewer is inactive' });
  }

  if (reviewer.expiresAt && new Date(reviewer.expiresAt) < new Date(validation.reviewedAt)) {
    issues.push({ code: 'REVIEWER_EXPIRED', message: 'Reviewer authorization expired before review date' });
  }

  if (!reviewer.authorizedEntityTypes.includes(validation.entityType)) {
    issues.push({ code: 'UNAUTHORIZED_ENTITY_TYPE', message: `Reviewer not authorized for ${validation.entityType}` });
  }

  const reviewedAt = new Date(validation.reviewedAt);
  const now = new Date();
  if (reviewedAt > now) {
    issues.push({ code: 'FUTURE_REVIEW_DATE', message: 'reviewedAt cannot be in the future' });
  }

  if (validation.validUntil && new Date(validation.validUntil) <= reviewedAt) {
    issues.push({ code: 'INVALID_VALID_UNTIL', message: 'validUntil must be after reviewedAt' });
  }

  if (validation.requiresFollowUp && !validation.followUpAt) {
    issues.push({ code: 'MISSING_FOLLOW_UP_DATE', message: 'followUpAt is required when requiresFollowUp is true' });
  }

  if (validation.followUpAt && new Date(validation.followUpAt) <= reviewedAt) {
    issues.push({ code: 'INVALID_FOLLOW_UP_AT', message: 'followUpAt must be after reviewedAt' });
  }

  return issues;
}
