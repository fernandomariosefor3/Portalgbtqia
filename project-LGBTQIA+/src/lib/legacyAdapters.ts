import {
  TrustContent,
  TrustEvent,
  TrustOpportunity,
  TrustService,
  TrustSource,
} from '../types/trust';

import {
  LegacyAdaptationContext,
  LegacyAdaptationIssue,
  LegacyAdaptationResult,
  LegacySourceReference,
  TrustSourceResolution,
  MigrationReportMetrics,
} from '../types/migration';

// ---------------------------------------------------------------------------
// TYPE GUARDS (Minimum structural validation)
// ---------------------------------------------------------------------------

export function isLegacyArticle(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.title === 'string' && typeof v.content === 'string';
}

export function isLegacyEvent(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.title === 'string' && typeof v.start_date === 'string';
}

export function isLegacyOpportunity(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.title === 'string' && typeof v.description === 'string';
}

export function isLegacySafeSpace(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === 'string' && typeof v.address === 'string';
}

export function isLegacyHealthGuide(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.title === 'string' && typeof v.content === 'string';
}

export function isLegacyLegalGuide(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.title === 'string' && typeof v.content === 'string';
}

// ---------------------------------------------------------------------------
// SOURCE RESOLUTION
// ---------------------------------------------------------------------------

export function resolveLegacySourceReferences(
  references: LegacySourceReference[],
  trustSources: TrustSource[]
): TrustSourceResolution {
  if (!references || references.length === 0) {
    return { resolvedIds: [], level: 'missing' };
  }

  const resolvedIds: string[] = [];
  let hasAmbiguous = false;
  const ambiguousMatches: TrustSource[] = [];

  for (const ref of references) {
    if (!ref.url) continue;

    // Strict exact match by URL
    const exactMatch = trustSources.find(
      (ts) => ts.url?.toLowerCase() === ref.url?.toLowerCase() && ts.status !== 'rejected'
    );

    if (exactMatch) {
      if (exactMatch.status === 'suspended') {
        return { resolvedIds: [], level: 'blocked' };
      }
      resolvedIds.push(exactMatch.id);
    } else {
      // Possible match check (same domain)
      const refDomain = ref.url.replace(/^https?:\/\//, '').split('/')[0];
      const possibleMatches = trustSources.filter((ts) => ts.domain === refDomain);
      if (possibleMatches.length > 0) {
        hasAmbiguous = true;
        ambiguousMatches.push(...possibleMatches);
      }
    }
  }

  if (resolvedIds.length > 0) {
    return { resolvedIds, level: 'exact_match' };
  }

  if (hasAmbiguous) {
    return { resolvedIds: [], level: 'ambiguous', ambiguousMatches };
  }

  return { resolvedIds: [], level: 'missing' };
}

// ---------------------------------------------------------------------------
// ADAPTERS
// ---------------------------------------------------------------------------

function createBaseResult<T>(): LegacyAdaptationResult<T> {
  return {
    adapted: false,
    errors: [],
    warnings: [],
    missingFields: [],
    inferredFields: [],
    migrationStatus: 'not_assessed',
    origin: 'legacy_mock',
  };
}

export function adaptLegacyArticle(
  input: unknown,
  context: LegacyAdaptationContext
): LegacyAdaptationResult<TrustContent> {
  const result = createBaseResult<TrustContent>();
  
  if (!isLegacyArticle(input)) {
    result.errors.push({ code: 'UNSUPPORTED_FIELD', severity: 'high', message: 'Not a valid article', canBeAutoCorrected: false, requiresHumanReview: true });
    return result;
  }

  const legacy = { ...input } as any;
  const inferredFields: string[] = [];
  const missingFields: string[] = [];
  const errors: LegacyAdaptationIssue[] = [];
  const warnings: LegacyAdaptationIssue[] = [];

  let id = legacy.id;
  if (!id) {
    id = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    inferredFields.push('id');
    warnings.push({ code: 'TEMPORARY_ID_ASSIGNED', severity: 'medium', message: 'Assigned temporary ID', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  const legacySources = Array.isArray(legacy.sources) ? legacy.sources : (legacy.sourceUrl ? [{ url: legacy.sourceUrl }] : []);
  const sourceRes = resolveLegacySourceReferences(legacySources, context.knownSources || []);
  
  if (sourceRes.level === 'missing' || sourceRes.resolvedIds.length === 0) {
    errors.push({ code: 'MISSING_SOURCE', severity: 'high', message: 'Article lacks verifiable sources', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  if (legacy.image && typeof legacy.image === 'string' && (legacy.image.includes('readdy.ai') || legacy.image.includes('placeholder'))) {
    warnings.push({ code: 'DEMONSTRATION_DATA', severity: 'medium', message: 'Contains mock image', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  const isBlocked = errors.some(e => e.severity === 'high' || e.severity === 'critical');
  const migrationStatus = isBlocked ? 'blocked' : 'needs_review';

  result.adapted = true;
  result.record = {
    id: String(id),
    title: legacy.title,
    summary: legacy.excerpt || '',
    content: legacy.content,
    thematicArea: legacy.tags ? [...legacy.tags] : [],
    targetAudience: [],
    sourceIds: sourceRes.resolvedIds,
    authorId: legacy.author || 'UNKNOWN',
    publishedAt: legacy.date || context.now,
    updatedAt: legacy.updatedAt || context.now,
    status: isBlocked ? 'blocked' : 'draft', // Never validated automatically
    validationStatus: 'submitted',
    tags: legacy.tags ? [...legacy.tags] : [],
    plainLanguageAvailable: false,
    librasVersionAvailable: false,
    audioVersionAvailable: false,
    createdAt: context.now,
  };
  
  result.errors = errors;
  result.warnings = warnings;
  result.inferredFields = inferredFields;
  result.missingFields = missingFields;
  result.migrationStatus = migrationStatus;

  return result;
}

export function adaptLegacyEvent(
  input: unknown,
  context: LegacyAdaptationContext
): LegacyAdaptationResult<TrustEvent> {
  const result = createBaseResult<TrustEvent>();
  
  if (!isLegacyEvent(input)) {
    result.errors.push({ code: 'UNSUPPORTED_FIELD', severity: 'high', message: 'Not a valid event', canBeAutoCorrected: false, requiresHumanReview: true });
    return result;
  }

  const legacy = { ...input } as any;
  const errors: LegacyAdaptationIssue[] = [];
  
  let id = legacy.id;
  if (!id) {
    id = `temp_${Math.random()}`;
    result.inferredFields.push('id');
  }

  if (legacy.end_date) {
    if (context.now > legacy.end_date) {
      errors.push({ code: 'EXPIRED_EVENT', severity: 'medium', message: 'Event is expired', canBeAutoCorrected: true, requiresHumanReview: false });
    }
  } else {
    errors.push({ code: 'MISSING_EVENT_END_DATE', severity: 'medium', message: 'Missing end date', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  const sourceRes = resolveLegacySourceReferences(legacy.source_url ? [{ url: legacy.source_url }] : [], context.knownSources || []);
  if (sourceRes.level === 'missing' || sourceRes.resolvedIds.length === 0) {
    errors.push({ code: 'MISSING_SOURCE', severity: 'high', message: 'Event lacks verifiable source', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  const isBlocked = errors.some(e => e.severity === 'high');

  result.adapted = true;
  result.record = {
    id: String(id),
    title: legacy.title,
    description: legacy.description || '',
    organizerId: legacy.organizer || undefined,
    location: legacy.location || '',
    startsAt: legacy.start_date,
    endsAt: legacy.end_date || legacy.start_date,
    isFree: legacy.price_info ? legacy.price_info.toLowerCase().includes('gratuito') : false,
    sourceIds: sourceRes.resolvedIds,
    status: isBlocked ? 'suspended' : 'submitted', // Never automatically verified
    createdAt: legacy.created_at || context.now,
    updatedAt: context.now,
  };

  result.errors = errors;
  result.migrationStatus = isBlocked ? 'blocked' : 'needs_review';

  return result;
}

export function adaptLegacyOpportunity(
  input: unknown,
  context: LegacyAdaptationContext
): LegacyAdaptationResult<TrustOpportunity> {
  const result = createBaseResult<TrustOpportunity>();
  
  if (!isLegacyOpportunity(input)) {
    result.errors.push({ code: 'UNSUPPORTED_FIELD', severity: 'high', message: 'Not a valid opportunity', canBeAutoCorrected: false, requiresHumanReview: true });
    return result;
  }

  const legacy = { ...input } as any;
  const errors: LegacyAdaptationIssue[] = [];

  let id = legacy.id;
  if (!id) {
    id = `temp_${Math.random()}`;
    result.inferredFields.push('id');
  }

  if (legacy.deadline && context.now > legacy.deadline) {
    errors.push({ code: 'EXPIRED_OPPORTUNITY', severity: 'medium', message: 'Opportunity expired', canBeAutoCorrected: true, requiresHumanReview: false });
  }

  if (!legacy.source_url && !legacy.organization) {
    errors.push({ code: 'MISSING_SOURCE', severity: 'high', message: 'Missing organization and official source', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  const isBlocked = errors.some(e => e.severity === 'high');

  result.adapted = true;
  result.record = {
    id: String(id),
    title: legacy.title,
    description: legacy.description,
    opportunityType: 'job', // inferred by default, needs review
    applicationDeadline: legacy.deadline || undefined,
    applicationUrl: legacy.source_url || undefined,
    sourceIds: [],
    status: isBlocked ? 'suspended' : 'submitted',
    createdAt: context.now,
    updatedAt: context.now,
  };
  result.inferredFields.push('opportunityType');

  result.errors = errors;
  result.migrationStatus = isBlocked ? 'blocked' : 'needs_review';

  return result;
}

export function adaptLegacySafeSpace(
  input: unknown,
  context: LegacyAdaptationContext
): LegacyAdaptationResult<TrustService> {
  const result = createBaseResult<TrustService>();

  if (!isLegacySafeSpace(input)) {
    result.errors.push({ code: 'UNSUPPORTED_FIELD', severity: 'high', message: 'Not a valid safe space', canBeAutoCorrected: false, requiresHumanReview: true });
    return result;
  }

  const legacy = { ...input } as any;
  const errors: LegacyAdaptationIssue[] = [];
  const warnings: LegacyAdaptationIssue[] = [];

  if (legacy.verificationLevel) {
    warnings.push({ code: 'LEGACY_VERIFICATION_NOT_TRANSFERABLE', severity: 'medium', message: 'Legacy verification ignored', canBeAutoCorrected: true, requiresHumanReview: true });
  }

  if (!legacy.phone && !legacy.website) {
    warnings.push({ code: 'MISSING_CONTACT', severity: 'medium', message: 'No contact info', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  result.adapted = true;
  result.record = {
    id: String(legacy.id || `temp_${Math.random()}`),
    name: legacy.name,
    description: legacy.description || '',
    category: legacy.category ? [legacy.category] : [],
    state: legacy.state,
    city: legacy.city,
    address: legacy.address,
    phone: legacy.phone,
    website: legacy.website,
    isFree: legacy.price === '$' ? true : false,
    targetAudience: [],
    accessibility: legacy.accessibility ? [...legacy.accessibility] : [],
    librasSupport: false,
    requiredDocuments: [],
    restrictions: [],
    sourceIds: [],
    status: 'submitted', // ALWAYS submitted, never verified_basic
    isOutdatedFlag: false,
    createdAt: context.now,
    updatedAt: context.now,
  };

  result.errors = errors;
  result.warnings = warnings;
  result.migrationStatus = 'needs_review';

  return result;
}

export function adaptLegacyHealthGuide(
  input: unknown,
  context: LegacyAdaptationContext
): LegacyAdaptationResult<TrustContent> {
  const result = createBaseResult<TrustContent>();

  if (!isLegacyHealthGuide(input)) {
    result.errors.push({ code: 'UNSUPPORTED_FIELD', severity: 'high', message: 'Not a valid health guide', canBeAutoCorrected: false, requiresHumanReview: true });
    return result;
  }

  const legacy = { ...input } as any;
  const errors: LegacyAdaptationIssue[] = [];

  // Health guides WITHOUT verifiable sources are CRITICAL
  if (!legacy.sources || legacy.sources.length === 0) {
    errors.push({ code: 'SENSITIVE_CLAIM_WITHOUT_SOURCE', severity: 'critical', message: 'Health content lacks medical sources', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  result.adapted = true;
  result.record = {
    id: String(legacy.id || `temp_${Math.random()}`),
    title: legacy.title,
    summary: legacy.excerpt || '',
    content: legacy.content,
    thematicArea: legacy.tags ? [...legacy.tags] : [],
    targetAudience: [],
    sourceIds: [],
    authorId: legacy.author || 'UNKNOWN',
    publishedAt: legacy.publishedAt || context.now,
    updatedAt: context.now,
    status: 'blocked', // Safety first: blocked due to being a mock / unverified
    validationStatus: 'submitted',
    tags: legacy.tags ? [...legacy.tags] : [],
    medicalOrLegalAlerts: 'Requires medical review',
    plainLanguageAvailable: false,
    librasVersionAvailable: false,
    audioVersionAvailable: false,
    createdAt: context.now,
  };

  result.errors = errors;
  result.migrationStatus = 'blocked';

  return result;
}

export function adaptLegacyLegalGuide(
  input: unknown,
  context: LegacyAdaptationContext
): LegacyAdaptationResult<TrustContent> {
  const result = createBaseResult<TrustContent>();

  if (!isLegacyLegalGuide(input)) {
    result.errors.push({ code: 'UNSUPPORTED_FIELD', severity: 'high', message: 'Not a valid legal guide', canBeAutoCorrected: false, requiresHumanReview: true });
    return result;
  }

  const legacy = { ...input } as any;
  const errors: LegacyAdaptationIssue[] = [];

  if (!legacy.sources || legacy.sources.length === 0) {
    errors.push({ code: 'SENSITIVE_CLAIM_WITHOUT_SOURCE', severity: 'critical', message: 'Legal content lacks official sources', canBeAutoCorrected: false, requiresHumanReview: true });
  }

  result.adapted = true;
  result.record = {
    id: String(legacy.id || `temp_${Math.random()}`),
    title: legacy.title,
    summary: legacy.summary || '',
    content: legacy.content,
    thematicArea: legacy.tags ? [...legacy.tags] : [],
    targetAudience: [],
    sourceIds: [],
    authorId: 'UNKNOWN',
    updatedAt: context.now,
    status: 'blocked',
    validationStatus: 'submitted',
    tags: legacy.tags ? [...legacy.tags] : [],
    medicalOrLegalAlerts: 'Requires legal review',
    plainLanguageAvailable: false,
    librasVersionAvailable: false,
    audioVersionAvailable: false,
    createdAt: context.now,
  };

  result.errors = errors;
  result.migrationStatus = 'blocked';

  return result;
}

// ---------------------------------------------------------------------------
// REPORTING
// ---------------------------------------------------------------------------

export function generateMigrationReport(
  legacyCollection: unknown[],
  adapterFn: (input: unknown, context: LegacyAdaptationContext) => LegacyAdaptationResult<any>,
  context: LegacyAdaptationContext
): MigrationReportMetrics {
  const metrics: MigrationReportMetrics = {
    totalAnalyzed: 0,
    adapted: 0,
    blocked: 0,
    expired: 0,
    missingSources: 0,
    invalidDates: 0,
    externalImages: 0,
    possibleDemonstrationData: 0,
    sensitiveFields: 0,
    requiresHumanReview: 0,
  };

  const seenSlugs = new Set<string>();

  for (const item of legacyCollection) {
    metrics.totalAnalyzed++;
    const result = adapterFn(item, context);

    if (result.adapted) metrics.adapted++;
    if (result.migrationStatus === 'blocked') metrics.blocked++;
    
    // Check for duplicates
    const anyItem = item as any;
    if (anyItem.slug) {
      if (seenSlugs.has(anyItem.slug)) {
        result.errors.push({ code: 'POSSIBLE_DUPLICATE', severity: 'medium', message: 'Duplicate slug', canBeAutoCorrected: false, requiresHumanReview: true });
      }
      seenSlugs.add(anyItem.slug);
    }

    let humanReview = false;

    for (const err of [...result.errors, ...result.warnings]) {
      if (err.requiresHumanReview) humanReview = true;
      if (err.code === 'EXPIRED_EVENT' || err.code === 'EXPIRED_OPPORTUNITY') metrics.expired++;
      if (err.code === 'MISSING_SOURCE' || err.code === 'SENSITIVE_CLAIM_WITHOUT_SOURCE') metrics.missingSources++;
      if (err.code === 'INVALID_DATE') metrics.invalidDates++;
      if (err.code === 'EXTERNAL_IMAGE') metrics.externalImages++;
      if (err.code === 'DEMONSTRATION_DATA') metrics.possibleDemonstrationData++;
      if (err.code === 'POSSIBLE_SENSITIVE_DATA') metrics.sensitiveFields++;
    }

    if (humanReview) metrics.requiresHumanReview++;
  }

  return metrics;
}
