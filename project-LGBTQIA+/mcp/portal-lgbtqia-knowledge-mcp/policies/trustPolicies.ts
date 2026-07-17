import { TrustContent, TrustService, TrustSource } from '../../../src/types/trust.js';
import { toPublicContent, toPublicService, toPublicSource } from '../../../src/lib/trust.js';

export function canUseContentInFarol(content: TrustContent, sources: TrustSource[], now: string): boolean {
  if (content.status !== 'validated') return false;
  
  if (content.nextReviewAt && new Date(content.nextReviewAt).getTime() < new Date(now).getTime()) {
    return false;
  }
  
  if (!content.sourceIds || content.sourceIds.length === 0) return false;
  
  const resolvedSources = content.sourceIds
    .map(id => sources.find(s => s.id === id))
    .filter((s): s is TrustSource => s !== undefined);
    
  if (resolvedSources.length === 0) return false;
  
  if (resolvedSources.some(s => s.status === 'suspended' || s.status === 'rejected')) return false;
  
  return true;
}

export function canRecommendService(service: TrustService, now: string): boolean {
  if (service.status !== 'verified_basic' && service.status !== 'partner') return false;
  
  if (service.nextReviewAt && new Date(service.nextReviewAt).getTime() < new Date(now).getTime()) {
    return false;
  }
  
  return true;
}

export function canReturnSource(source: TrustSource): boolean {
  if (source.status === 'suspended' || source.status === 'rejected') return false;
  return true;
}
