import { HumanReviewDecision } from './humanReview.js';

export type PromotionBlockReason =
  | 'NO_APPROVED_BASIC_REVIEW'
  | 'NEEDS_MORE_EVIDENCE'
  | 'SECOND_REVIEW_REQUIRED'
  | 'SECOND_REVIEW_MISSING'
  | 'VALIDATION_EXPIRED'
  | 'EVIDENCE_EXPIRED'
  | 'STALE_REVIEW_PACKET'
  | 'SOURCE_NOT_ELIGIBLE'
  | 'ORGANIZATION_NOT_ELIGIBLE'
  | 'CANONICAL_ENTITY_MISSING'
  | 'LEGACY_ALIAS_NOT_PUBLIC'
  | 'PROTECTED_DATA_RISK'
  | 'CRITICAL_FIELD_MISSING'
  | 'CONFLICTING_VALIDATIONS'
  | 'BLOCKED_BY_POLICY';

export interface PromotionWarning {
  code: string;
  message: string;
}

export interface InheritedPromotionBlock {
  reason: 'SOURCE_NOT_ELIGIBLE' | 'ORGANIZATION_NOT_ELIGIBLE';
  dependencyEntityId: string;
  dependencyType: 'source' | 'organization';
  rootBlockingReasons: PromotionBlockReason[];
}

export interface RegistryAlias {
  legacyId: string;
  canonicalEntityId: string;
  relationship:
    | 'alias'
    | 'access_channel'
    | 'merged_record'
    | 'historical_reference';
  publicListingAllowed: false;
  createdAt: string;
  reason: string;
}

export interface PromotionEligibilityResult {
  entityId: string;
  entityType: 'source' | 'organization' | 'service';
  currentStatus: string;
  decision?: HumanReviewDecision;
  eligible: boolean;
  proposedStatus?: 'verified_basic';
  blockingReasons: PromotionBlockReason[];
  inheritedBlockingReasons: InheritedPromotionBlock[];
  warnings: PromotionWarning[];
  validationIds: string[];
  evidenceIds: string[];
  dependencyEntityIds: string[];
  requiresSecondReview: boolean;
  secondReviewSatisfied: boolean;
  canonicalEntityId?: string;
  validUntil?: string;
  evaluatedAt: string;
  policyVersion: string;
}

export const CURRENT_POLICY_VERSION = '1.0.0';

export function isAliasDescription(description: string | undefined): boolean {
  return !!description && description.includes('canonicalServiceId:');
}

export function parseAliasFromDescription(description: string, legacyId: string, createdAt: string): RegistryAlias | null {
  if (!isAliasDescription(description)) return null;

  const canonicalMatch = description.match(/canonicalServiceId:\s*([^\s.]+)/);
  if (!canonicalMatch) return null;

  const relationshipMatch = description.match(/relationship:\s*([^\s.]+)/);

  return {
    legacyId,
    canonicalEntityId: canonicalMatch[1],
    relationship: (relationshipMatch?.[1] as any) || 'alias',
    publicListingAllowed: false,
    createdAt,
    reason: description
  };
}
