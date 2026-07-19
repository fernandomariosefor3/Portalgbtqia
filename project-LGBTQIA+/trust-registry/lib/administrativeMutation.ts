import { computeIntegrityDigestV2, Validation } from './humanReview.js';

export const ADMINISTRATIVE_MUTATION_POLICY_VERSION = '1.0.0';

export const PROMOTION_ALLOWED_ENTITY_PATHS = new Set([
  'status'
]);

export const PROMOTION_REQUIRED_UNCHANGED_PATHS = new Set([
  'publicationStatus',
  'publicListingAllowed'
]);

export type AdministrativeMutationErrorCode =
  | 'VALIDATED_SNAPSHOT_UNAVAILABLE'
  | 'PROMOTION_EVENT_MISSING'
  | 'PROMOTION_EVENT_DUPLICATED'
  | 'EVENT_ENTITY_MISMATCH'
  | 'EVENT_VALIDATION_MISMATCH'
  | 'EVENT_DIGEST_MISMATCH'
  | 'PREVIOUS_STATUS_MISMATCH'
  | 'CURRENT_STATUS_MISMATCH'
  | 'EVENT_OUTSIDE_VALIDITY'
  | 'UNAUTHORIZED_ENTITY_CHANGE'
  | 'UNAUTHORIZED_PUBLICATION_MUTATION'
  | 'IDENTITY_DIGEST_MISMATCH'
  | 'EVIDENCE_DIGEST_MISMATCH'
  | 'POLICY_VERSION_MISMATCH';

export interface AdministrativeMutationResult {
  valid: boolean;
  operation: 'promotion';
  eventId?: string;
  changedAdministrativePaths: string[];
  unchangedRequiredPaths: string[];
  unauthorizedChanges: Array<{
    path: string;
    previousValue?: unknown;
    currentValue?: unknown;
  }>;
  errors: Array<{
    code: AdministrativeMutationErrorCode;
    path?: string;
    message: string;
  }>;
  policyVersion: string;
}

export interface AdministrativeMutationContext {
  asOf: Date;
  effectiveValidation: Validation;
  validatedEntitySnapshot: any;
  currentEntity: any;
  currentEvidence: any[];
  promotionEvents: any[];
  integrityManifest: any[];
}

function getObjectDiff(obj1: any, obj2: any, path: string = ''): Array<{ path: string; val1: any; val2: any }> {
  const diffs: Array<{ path: string; val1: any; val2: any }> = [];
  
  if (obj1 === obj2) return diffs;

  if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2)) {
    diffs.push({ path: path || 'root', val1: obj1, val2: obj2 });
    return diffs;
  }

  if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
    diffs.push({ path: path || 'root', val1: obj1, val2: obj2 });
    return diffs;
  }

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      diffs.push({ path: path || 'root', val1: obj1, val2: obj2 });
      return diffs;
    }
    // We assume strict ordering for diffing here.
    for (let i = 0; i < obj1.length; i++) {
      diffs.push(...getObjectDiff(obj1[i], obj2[i], path ? `${path}[${i}]` : `[${i}]`));
    }
    return diffs;
  }

  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  for (const key of keys) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in obj1) || !(key in obj2)) {
      diffs.push({ path: currentPath, val1: obj1[key], val2: obj2[key] });
      continue;
    }
    diffs.push(...getObjectDiff(obj1[key], obj2[key], currentPath));
  }

  return diffs;
}

export function validateAdministrativeMutation(
  context: AdministrativeMutationContext
): AdministrativeMutationResult {
  const result: AdministrativeMutationResult = {
    valid: false,
    operation: 'promotion',
    changedAdministrativePaths: [],
    unchangedRequiredPaths: [],
    unauthorizedChanges: [],
    errors: [],
    policyVersion: ADMINISTRATIVE_MUTATION_POLICY_VERSION
  };

  if (!context.validatedEntitySnapshot) {
    result.errors.push({ code: 'VALIDATED_SNAPSHOT_UNAVAILABLE', message: 'No historical snapshot found to compare against.' });
    return result;
  }

  // 1. Encontrar o evento
  const events = context.promotionEvents.filter(e => 
    e.entityId === context.currentEntity.id && 
    e.effectiveValidationId === context.effectiveValidation.id
  );

  if (events.length === 0) {
    result.errors.push({ code: 'PROMOTION_EVENT_MISSING', message: 'No promotion event found for this entity and validation.' });
    return result;
  }

  if (events.length > 1) {
    result.errors.push({ code: 'PROMOTION_EVENT_DUPLICATED', message: 'Multiple promotion events found.' });
    return result;
  }

  const event = events[0];
  result.eventId = event.id;

  // 2. Validar integridade básica do evento
  if (event.previousStatus !== context.validatedEntitySnapshot.status) {
    result.errors.push({ code: 'PREVIOUS_STATUS_MISMATCH', message: 'Event previous status does not match snapshot status.' });
  }

  if (event.newStatus !== context.currentEntity.status) {
    result.errors.push({ code: 'CURRENT_STATUS_MISMATCH', message: 'Event new status does not match current entity status.' });
  }

  const eventPromotedAt = new Date(event.promotedAt);
  if (eventPromotedAt > context.asOf) {
    result.errors.push({ code: 'EVENT_OUTSIDE_VALIDITY', message: 'Promotion event is in the future relative to asOf.' });
  }
  
  if (context.effectiveValidation.validUntil) {
    const validUntil = new Date(context.effectiveValidation.validUntil);
    if (eventPromotedAt > validUntil) {
      result.errors.push({ code: 'EVENT_OUTSIDE_VALIDITY', message: 'Promotion event occurred after validation expired.' });
    }
  }

  if (event.policyVersion !== ADMINISTRATIVE_MUTATION_POLICY_VERSION) {
    result.errors.push({ code: 'POLICY_VERSION_MISMATCH', message: 'Event policy version mismatch.' });
  }

  // 3. Comparar o snapshot com a entidade atual
  const ignoredForDiff = new Set(['generatedAt', 'evaluatedAt', 'reportGeneratedAt']);
  
  const cleanSnapshot = { ...context.validatedEntitySnapshot };
  const cleanCurrent = { ...context.currentEntity };
  ignoredForDiff.forEach(k => { delete cleanSnapshot[k]; delete cleanCurrent[k]; });

  const diffs = getObjectDiff(cleanSnapshot, cleanCurrent);

  for (const diff of diffs) {
    const path = diff.path;
    
    let isPseudoChange = false;
    if (path === 'publicListingAllowed' && diff.val1 === undefined && diff.val2 === false) {
      isPseudoChange = true;
    }
    if (path === 'publicationStatus' && diff.val1 === undefined && diff.val2 === 'not_published') {
      isPseudoChange = true;
    }

    if (isPseudoChange) {
      continue;
    }

    if (PROMOTION_ALLOWED_ENTITY_PATHS.has(path)) {
      result.changedAdministrativePaths.push(path);
    } else if (PROMOTION_REQUIRED_UNCHANGED_PATHS.has(path)) {
      result.errors.push({ 
        code: 'UNAUTHORIZED_PUBLICATION_MUTATION', 
        path, 
        message: 'Publication fields must remain unchanged during administrative promotion.' 
      });
      result.unauthorizedChanges.push({ path, previousValue: diff.val1, currentValue: diff.val2 });
    } else {
      result.errors.push({ 
        code: 'UNAUTHORIZED_ENTITY_CHANGE', 
        path, 
        message: `Field ${path} cannot be changed in an administrative mutation.` 
      });
      result.unauthorizedChanges.push({ path, previousValue: diff.val1, currentValue: diff.val2 });
    }
  }

  // Check required unchanged explicitly if they weren't in the diff
  for (const path of PROMOTION_REQUIRED_UNCHANGED_PATHS) {
    if (!diffs.some(d => d.path === path)) {
      result.unchangedRequiredPaths.push(path);
      if (path === 'publicationStatus' && context.currentEntity.publicationStatus !== 'not_published' && context.currentEntity.publicationStatus !== undefined) {
         if (context.currentEntity.publicationStatus === 'published') {
           result.errors.push({ code: 'UNAUTHORIZED_PUBLICATION_MUTATION', path, message: 'Must be not_published' });
         }
      }
      if (path === 'publicListingAllowed' && context.currentEntity.publicListingAllowed === true) {
         result.errors.push({ code: 'UNAUTHORIZED_PUBLICATION_MUTATION', path, message: 'Must be false' });
      }
    }
  }

  // 4. Digest validation
  // We compute the digest of the snapshot (the state BEFORE the administrative mutation)
  // and ensure it matches the integrity digest recorded in the event.
  // Since we already proved above that the only differences between the snapshot 
  // and the current entity are authorized administrative fields, this is safe.
  const snapshotDigest = computeIntegrityDigestV2(context.validatedEntitySnapshot);
  if (snapshotDigest !== event.integrityDigest) {
    result.errors.push({ code: 'EVENT_DIGEST_MISMATCH', message: `Historical snapshot digest (${snapshotDigest}) does not match the event digest (${event.integrityDigest}).` });
  }

  if (result.errors.length === 0) {
    result.valid = true;
  }

  return result;
}
