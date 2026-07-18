/**
 * ISO 8601 Date String representation to ensure safe serialization
 * across frontend, MCP, JSON and Firestore.
 */
export type ISODateString = string;

export type TrustVerificationStatus =
  | 'submitted'
  | 'under_review'
  | 'verified_basic'
  | 'community_reviewed'
  | 'partner'
  | 'outdated'
  | 'suspended'
  | 'rejected';

export type TrustEditorialStatus =
  | 'draft'
  | 'under_review'
  | 'validated'
  | 'blocked'
  | 'outdated'
  | 'archived';

/**
 * TrustEvidence: Reference that justifies a validation decision.
 */
export interface TrustEvidence {
  sourceId?: string;
  excerpt?: string;
  date: ISODateString;
  responsibleId: string;
  observation?: string;
  evidenceType: 'link' | 'document' | 'manual_verification' | 'user_report' | 'official_record';
}

/**
 * TrustValidation: The result of a human or specialized review.
 */
export interface TrustValidation {
  validatorId: string;
  validatorRole: string;
  date: ISODateString;
  decision: 'approved' | 'rejected' | 'needs_changes';
  observations?: string; // Internal private field
  validUntil?: ISODateString;
  foundConflicts?: string[];
}

/**
 * TrustAuditLog: Immutable log for state transitions.
 */
export interface TrustAuditLog {
  id: string;
  entityType: 'source' | 'service' | 'event' | 'opportunity' | 'content' | 'organization';
  entityId: string;
  action: 'create' | 'update' | 'status_change' | 'suspend' | 'verify';
  previousState?: any;
  nextState: any;
  responsibleId: string;
  date: ISODateString;
  justification: string;
  validationReferenceId?: string;
}

/**
 * TrustOrganization: Represents a responsible organization.
 */
export interface TrustOrganization {
  id: string;
  name: string;
  cnpj?: string;
  website?: string;
  contactEmail?: string;
  verificationStatus: TrustVerificationStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * TrustSource: A verified source of information.
 */
export interface TrustSource {
  id: string;
  title: string;
  organizationId?: string;
  url?: string;
  domain?: string;
  sourceType: 'public_agency' | 'legislation' | 'court' | 'scientific_article' | 'international_org' | 'civil_society' | 'local_service' | 'journalistic_vehicle' | 'internal_editorial';
  thematicArea: string[];
  jurisdiction?: string;
  language: string;
  publishedAt?: ISODateString;
  lastConsultedAt: ISODateString;
  lastVerifiedAt?: ISODateString;
  verifiedById?: string;
  status: TrustVerificationStatus;
  observations?: string; // Private
  reliabilityLevel: 'high' | 'medium' | 'low';
  classificationReasons: string[];
  versionHash?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * TrustService: Permanent or recurring services.
 */
export interface TrustService {
  id: string;
  name: string;
  description: string;
  category: string[];
  organizationId?: string;
  state?: string;
  city?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  phone?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  operatingHours?: string;
  isFree: boolean;
  targetAudience: string[];
  accessibility: string[];
  librasSupport: boolean;
  requiredDocuments: string[];
  restrictions: string[];
  sourceIds: string[];
  status: TrustVerificationStatus;
  lastVerifiedAt?: ISODateString;
  nextReviewAt?: ISODateString;
  verifiedById?: string;
  securityObservations?: string; // Private
  isOutdatedFlag: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  internalNotes?: string; // Private
  reporterId?: string; // Private
}

/**
 * TrustEvent: Events with specific start and end dates.
 */
export interface TrustEvent {
  id: string;
  title: string;
  description: string;
  organizerId?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  startsAt: ISODateString;
  endsAt: ISODateString;
  isFree: boolean;
  sourceIds: string[];
  status: TrustVerificationStatus;
  lastVerifiedAt?: ISODateString;
  verifiedById?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  internalNotes?: string; // Private
}

/**
 * TrustOpportunity: Job openings, grants, courses with deadlines.
 */
export interface TrustOpportunity {
  id: string;
  title: string;
  description: string;
  organizationId?: string;
  opportunityType: 'job' | 'grant' | 'course' | 'call';
  applicationDeadline?: ISODateString;
  applicationUrl?: string;
  sourceIds: string[];
  status: TrustVerificationStatus;
  lastVerifiedAt?: ISODateString;
  verifiedById?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  internalNotes?: string; // Private
}

/**
 * TrustContent: Articles, health guides, rights, editorial corpus.
 */
export interface TrustContent {
  id: string;
  title: string;
  summary: string;
  content: string;
  thematicArea: string[];
  targetAudience: string[];
  jurisdiction?: string;
  sourceIds: string[];
  authorId: string;
  reviewerId?: string;
  publishedAt?: ISODateString;
  updatedAt: ISODateString;
  status: TrustEditorialStatus;
  validationStatus: TrustVerificationStatus;
  nextReviewAt?: ISODateString;
  tags: string[];
  medicalOrLegalAlerts?: string;
  plainLanguageAvailable: boolean;
  librasVersionAvailable: boolean;
  audioVersionAvailable: boolean;
  createdAt: ISODateString;
  internalNotes?: string; // Private
}

// ---------------------------------------------------------------------------
// PUBLIC PROJECTIONS (Omit internal/private fields)
// ---------------------------------------------------------------------------

export type PublicTrustService = Omit<
  TrustService,
  'securityObservations' | 'internalNotes' | 'reporterId' | 'verifiedById'
>;

export type PublicTrustEvent = Omit<
  TrustEvent,
  'internalNotes' | 'verifiedById'
>;

export type PublicTrustOpportunity = Omit<
  TrustOpportunity,
  'internalNotes' | 'verifiedById'
>;

export type PublicTrustContent = Omit<
  TrustContent,
  'internalNotes' | 'reviewerId' | 'authorId'
>;

export type PublicTrustSource = Omit<
  TrustSource,
  'observations' | 'verifiedById'
>;
