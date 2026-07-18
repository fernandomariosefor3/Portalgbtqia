import { Validation, computeFingerprint, detectStaleReviewPacket } from './humanReview.js';
import { 
  PromotionEligibilityResult, 
  PromotionBlockReason, 
  PromotionWarning, 
  CURRENT_POLICY_VERSION, 
  parseAliasFromDescription 
} from './promotionPolicies.js';

export interface PromotionContext {
  registry: {
    sources: any[];
    organizations: any[];
    services: any[];
    evidence: any[];
    validations: Validation[];
  };
  asOf: Date;
  computedEligibility: Map<string, PromotionEligibilityResult>;
}

function resolveEffectiveValidation(entityId: string, context: PromotionContext): Validation | null {
  const validations = context.registry.validations.filter(v => v.entityId === entityId);
  if (validations.length === 0) return null;
  // Simplification for now: sort by reviewedAt descending and take the first.
  validations.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
  return validations[0];
}

function resolveEvidence(entityId: string, context: PromotionContext): any[] {
  return context.registry.evidence.filter(e => e.entityId === entityId);
}

function checkValidUntil(validUntil: string | null | undefined, asOf: Date): boolean {
  if (!validUntil) return true; // No expiration
  return new Date(validUntil).getTime() > asOf.getTime();
}

function isSensitiveService(service: any): boolean {
  const sensitiveCategories = ['saude', 'direitos', 'acolhimento_social', 'saude_trans', 'prevencao_hiv'];
  const hasSensitiveCategory = service.category?.some((c: string) => sensitiveCategories.includes(c));
  // Sensibilidade orientada por dados de categoria, e flag específica de requiresSecondReview nas internalNotes
  return hasSensitiveCategory;
}

export function evaluatePromotionEligibility(
  entity: any,
  entityType: 'source' | 'organization' | 'service',
  context: PromotionContext
): PromotionEligibilityResult {
  
  if (context.computedEligibility.has(entity.id)) {
    return context.computedEligibility.get(entity.id)!;
  }

  const result: PromotionEligibilityResult = {
    entityId: entity.id,
    entityType,
    currentStatus: entity.status,
    eligible: false,
    blockingReasons: [],
    warnings: [],
    validationIds: [],
    evidenceIds: [],
    dependencyEntityIds: [],
    requiresSecondReview: false,
    secondReviewSatisfied: false,
    evaluatedAt: context.asOf.toISOString(),
    policyVersion: CURRENT_POLICY_VERSION
  };

  // 1. Alias Handling
  const alias = parseAliasFromDescription(entity.description, entity.id, entity.created_at);
  if (alias || entity.status === 'archived') {
    result.blockingReasons.push('LEGACY_ALIAS_NOT_PUBLIC');
    if (alias) result.canonicalEntityId = alias.canonicalEntityId;
    context.computedEligibility.set(entity.id, result);
    return result;
  }

  // 2. Resolve Validation
  const effectiveValidation = resolveEffectiveValidation(entity.id, context);
  if (!effectiveValidation) {
    result.blockingReasons.push('NO_APPROVED_BASIC_REVIEW');
    context.computedEligibility.set(entity.id, result);
    return result;
  }

  result.decision = effectiveValidation.decision;
  result.validationIds.push(effectiveValidation.id);

  if (effectiveValidation.decision === 'needs_more_evidence') {
    result.blockingReasons.push('NEEDS_MORE_EVIDENCE');
  } else if (effectiveValidation.decision !== 'approved_basic') {
    result.blockingReasons.push('NO_APPROVED_BASIC_REVIEW');
  }

  // Check conflicts
  const allValidations = context.registry.validations.filter(v => v.entityId === entity.id);
  if (allValidations.length > 1) {
     const hasConflicts = allValidations.some(v => v.decision !== effectiveValidation.decision && checkValidUntil(v.validUntil, context.asOf));
     if (hasConflicts) {
         result.blockingReasons.push('CONFLICTING_VALIDATIONS');
     }
  }

  // Validation expiration
  if (!checkValidUntil(effectiveValidation.validUntil, context.asOf)) {
    result.blockingReasons.push('VALIDATION_EXPIRED');
  }

  // Protected Address
  if (entityType === 'service' || entityType === 'organization') {
     const hasProtectedAddress = effectiveValidation.internalNotes?.includes('publicAddressAllowed: false');
     if (hasProtectedAddress) {
         result.blockingReasons.push('PROTECTED_DATA_RISK');
     }
  }

  // 3. Resolve Evidence
  const evidences = resolveEvidence(entity.id, context);
  result.evidenceIds = evidences.map(e => e.id);
  
  if (evidences.length === 0) {
     // Optional warning or block
  }

  // Stale check
  if (detectStaleReviewPacket(effectiveValidation, entity, evidences)) {
    result.blockingReasons.push('STALE_REVIEW_PACKET');
  }

  // 4. Dependencies
  let sourceEligible = true;
  let orgEligible = true;

  if (entityType === 'organization') {
    result.dependencyEntityIds.push(entity.source_id);
    const source = context.registry.sources.find(s => s.id === entity.source_id);
    if (!source) {
       result.blockingReasons.push('SOURCE_NOT_ELIGIBLE');
    } else {
       const sourceRes = evaluatePromotionEligibility(source, 'source', context);
       if (!sourceRes.eligible) {
         result.blockingReasons.push('SOURCE_NOT_ELIGIBLE');
       }
       if (sourceRes.validUntil) {
         result.validUntil = sourceRes.validUntil;
       }
    }
  } else if (entityType === 'service') {
    result.dependencyEntityIds.push(entity.organization_id);
    const org = context.registry.organizations.find(o => o.id === entity.organization_id);
    if (!org) {
       result.blockingReasons.push('ORGANIZATION_NOT_ELIGIBLE');
    } else {
       const orgRes = evaluatePromotionEligibility(org, 'organization', context);
       if (!orgRes.eligible) {
         result.blockingReasons.push('ORGANIZATION_NOT_ELIGIBLE');
       }
       // If source logic applies transitively, it's evaluated inside org.
       if (orgRes.validUntil) {
         result.validUntil = orgRes.validUntil; // propagate lowest validUntil, simplistic for now
       }
    }
  }

  // Update validUntil based on this validation
  if (effectiveValidation.validUntil) {
    if (!result.validUntil || new Date(effectiveValidation.validUntil).getTime() < new Date(result.validUntil).getTime()) {
      result.validUntil = effectiveValidation.validUntil;
    }
  }

  // 5. Second Review Needs
  const needsSecondReview = effectiveValidation.internalNotes?.includes('requiresSecondReview: true') || isSensitiveService(entity);
  if (needsSecondReview) {
    result.requiresSecondReview = true;
    result.secondReviewSatisfied = false; // Mock for now, system needs a way to record second review.
    result.blockingReasons.push('SECOND_REVIEW_MISSING');
  }

  // 6. Eligibility Final Computation
  result.eligible = result.blockingReasons.length === 0;

  if (result.eligible) {
    result.proposedStatus = 'verified_basic';
  }

  context.computedEligibility.set(entity.id, result);
  return result;
}
