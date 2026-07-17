import { TrustSource } from './trust';

export type TrustDataOrigin =
  | 'legacy_mock'
  | 'legacy_firestore'
  | 'manual_submission'
  | 'official_import'
  | 'editorial_entry'
  | 'partner_submission';

export type TrustMigrationStatus =
  | 'not_assessed'
  | 'needs_review'
  | 'eligible_for_review'
  | 'blocked'
  | 'rejected'
  | 'migrated';

export type LegacyAdaptationIssueCode =
  | 'MISSING_SOURCE'
  | 'INVALID_DATE'
  | 'EXPIRED_EVENT'
  | 'EXPIRED_OPPORTUNITY'
  | 'UNVERIFIED_LOCATION'
  | 'MISSING_ORGANIZATION'
  | 'EXTERNAL_IMAGE'
  | 'DEMONSTRATION_DATA'
  | 'UNSUPPORTED_FIELD'
  | 'DUPLICATE_SLUG'
  | 'MISSING_CONTACT'
  | 'POSSIBLE_SENSITIVE_DATA'
  | 'MISSING_ID'
  | 'INVALID_URL'
  | 'UNRESOLVED_SOURCE_REFERENCE'
  | 'AMBIGUOUS_SOURCE_MATCH'
  | 'SOURCE_NOT_IN_TRUST_REGISTRY'
  | 'UNSUPPORTED_VERIFICATION_CLAIM'
  | 'LEGACY_VERIFICATION_NOT_TRANSFERABLE'
  | 'MISSING_DEADLINE'
  | 'MISSING_EVENT_END_DATE'
  | 'SENSITIVE_CLAIM_WITHOUT_SOURCE'
  | 'POSSIBLE_DUPLICATE'
  | 'TEMPORARY_ID_ASSIGNED';

export type LegacyAdaptationIssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface LegacyAdaptationIssue {
  code: LegacyAdaptationIssueCode;
  field?: string;
  severity: LegacyAdaptationIssueSeverity;
  message: string;
  canBeAutoCorrected: boolean;
  requiresHumanReview: boolean;
}

export interface LegacyAdaptationResult<T> {
  adapted: boolean;
  record?: T;
  errors: LegacyAdaptationIssue[];
  warnings: LegacyAdaptationIssue[];
  missingFields: string[];
  inferredFields: string[];
  migrationStatus: TrustMigrationStatus;
  origin: TrustDataOrigin;
}

export interface LegacySourceReference {
  url?: string;
  title?: string;
  publisher?: string;
  raw_text?: string;
}

export type SourceResolutionLevel =
  | 'exact_match'
  | 'possible_match'
  | 'missing'
  | 'ambiguous'
  | 'blocked'
  | 'outdated';

export interface TrustSourceResolution {
  resolvedIds: string[];
  level: SourceResolutionLevel;
  ambiguousMatches?: TrustSource[];
}

export interface LegacyAdaptationContext {
  now: string; // ISODateString
  knownSources?: TrustSource[];
}

export interface MigrationReportMetrics {
  totalAnalyzed: number;
  adapted: number;
  blocked: number;
  expired: number;
  missingSources: number;
  invalidDates: number;
  externalImages: number;
  possibleDemonstrationData: number;
  sensitiveFields: number;
  requiresHumanReview: number;
}
