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

export type FingerprintVersion = 'v1' | 'v2';

export interface FingerprintComparisonResult {
  matches: boolean;
  storedVersion: FingerprintVersion;
  matchedVersion?: FingerprintVersion;
  migrationRecommended: boolean;
  reason?:
    | 'MATCH'
    | 'MATCH_LEGACY'
    | 'CONTENT_CHANGED'
    | 'UNSUPPORTED_VERSION'
    | 'FINGERPRINT_MISSING';
}

export function computeFingerprintV1(data: any): string {
  // Algoritmo legado preservado exatamente como estava
  const str = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

const UNORDERED_ARRAY_PATHS = new Set([
  'evidenceIds',
  'sourceIds',
  'confirmedFields',
  'unconfirmedFields',
  'tags',
  'authorizedEntityTypes',
  'authorizedCategories'
]);

function deepCanonicalize(data: any, path: string = ''): any {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    const isUnordered = UNORDERED_ARRAY_PATHS.has(path) || path.endsWith('Ids');
    const mapped = data.map((item, index) => deepCanonicalize(item, `${path}[${index}]`));
    
    if (isUnordered) {
      mapped.sort((a, b) => {
        const strA = typeof a === 'object' ? JSON.stringify(a) : String(a);
        const strB = typeof b === 'object' ? JSON.stringify(b) : String(b);
        return strA.localeCompare(strB);
      });
    }
    return mapped;
  }

  const keys = Object.keys(data).sort();
  const result: Record<string, any> = {};

  const IGNORED_FIELDS = new Set([
    'generatedAt',
    'evaluatedAt',
    'reportGeneratedAt'
  ]);

  for (const key of keys) {
    if (IGNORED_FIELDS.has(key)) continue;
    result[key] = deepCanonicalize(data[key], key);
  }

  return result;
}

export function computeFingerprintV2(data: any): string {
  const canonical = deepCanonicalize(data);
  const str = JSON.stringify(canonical);
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

export function compareFingerprint(
  storedHash: string | undefined,
  storedVersion: FingerprintVersion | undefined,
  currentData: any
): FingerprintComparisonResult {
  if (!storedHash) {
    return {
      matches: false,
      storedVersion: 'v1',
      migrationRecommended: false,
      reason: 'FINGERPRINT_MISSING'
    };
  }

  const effectiveVersion = storedVersion || 'v1';
  
  if (effectiveVersion === 'v2') {
    const v2Hash = computeFingerprintV2(currentData);
    if (storedHash === v2Hash) {
      return { matches: true, storedVersion: 'v2', matchedVersion: 'v2', migrationRecommended: false, reason: 'MATCH' };
    }
    return { matches: false, storedVersion: 'v2', migrationRecommended: false, reason: 'CONTENT_CHANGED' };
  }

  // Version is v1 (legacy)
  const v1Hash = computeFingerprintV1(currentData);
  if (storedHash === v1Hash) {
    return { matches: true, storedVersion: 'v1', matchedVersion: 'v1', migrationRecommended: true, reason: 'MATCH_LEGACY' };
  }

  // Even if it doesn't match v1, maybe it matches v2? 
  // "nunca considerar um registro stale apenas porque o algoritmo atual passou a ser v2" 
  // It only matches if it matched its own version. If v1 doesn't match, it's stale.
  return { matches: false, storedVersion: 'v1', migrationRecommended: false, reason: 'CONTENT_CHANGED' };
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
  const entityFingerprint = computeFingerprintV2(entity);
  const evidenceFingerprint = computeFingerprintV2(evidenceList);

  const packetVersion = '1.0.0';
  
  return {
    metadata: {
      packetVersion,
      fingerprintVersion: 'v2',
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

export function detectStaleReviewPacket(
  validation: Validation & { fingerprintVersion?: FingerprintVersion }, 
  currentEntity: any, 
  currentEvidenceList: any[]
): { isStale: boolean; entityComparison: FingerprintComparisonResult; evidenceComparison: FingerprintComparisonResult } {
  
  const entityComparison = compareFingerprint(validation.entityFingerprint, validation.fingerprintVersion, currentEntity);
  const evidenceComparison = compareFingerprint(validation.evidenceFingerprint, validation.fingerprintVersion, currentEvidenceList);

  return {
    isStale: !entityComparison.matches || !evidenceComparison.matches,
    entityComparison,
    evidenceComparison
  };
}

export interface HumanReviewEvaluationContext {
  asOf: Date;
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

  if (detectStaleReviewPacket(validation, entity, evidenceList).isStale) {
    result.blockingIssues.push({ code: 'STALE_REVIEW_PACKET', message: 'The entity or evidence changed since validation' });
  }

  // Verifica expiração
  // Não usa new Date() aqui mais para ser fixo se necessário, mas asOf deve ser passado.
  // Vamos adaptar `evaluateHumanReviewPromotion` para aceitar `asOf` via context parameter.
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

export function evaluateHumanReviewPromotionWithContext(
  entityType: 'source' | 'organization' | 'service',
  entity: any,
  validation: Validation,
  evidenceList: any[],
  context: { asOf: Date }
): HumanReviewEligibilityResult {
  const result = evaluateHumanReviewPromotion(entityType, entity, validation, evidenceList);
  
  if (validation.validUntil && new Date(validation.validUntil).getTime() < context.asOf.getTime()) {
    result.blockingIssues.push({ code: 'VALIDATION_EXPIRED', message: 'Validation has expired' });
    result.eligible = false;
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
