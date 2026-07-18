import { z } from 'zod';
import { TrustContentRepository, TrustServiceRepository, TrustSourceRepository } from '../contracts/repositories.js';
import { createNotFoundError, createInvalidInputError } from '../errors/index.js';
import { MCP_LIMITS } from '../config/limits.js';
import { canUseContentInFarol, canRecommendService } from '../policies/trustPolicies.js';

export const checkInformationFreshnessSchema = z.object({
  entityType: z.enum(['content', 'service']),
  id: z.string().trim().min(1).max(MCP_LIMITS.MAX_ID_LENGTH),
}).strict();

export async function checkInformationFreshness(
  args: unknown, 
  contentRepo: TrustContentRepository, 
  serviceRepo: TrustServiceRepository,
  sourceRepo: TrustSourceRepository,
  now: string
) {
  const parsed = checkInformationFreshnessSchema.safeParse(args);
  if (!parsed.success) {
    throw createInvalidInputError(parsed.error.message);
  }
  
  const { entityType, id } = parsed.data;
  const sources = await sourceRepo.getAllRawSources();
  
  if (entityType === 'content') {
    const rawContent = await contentRepo.getRawContent(id);
    // Para não revelar existência de bloqueados, usamos a mesma política da busca pública
    if (!rawContent || !canUseContentInFarol(rawContent, sources, now)) {
      return { status: 'not_available' };
    }
    
    // Se passou pela política, ele é elegível. Agora checamos quão perto da expiração ele está.
    // A política já barra itens estritamente expirados (nextReviewAt < now).
    // Então, se passou, ou não expira, ou ainda não expirou.
    // Vamos apenas retornar 'fresh' ou 'review_due' se faltar menos de 30 dias para revisão.
    if (!rawContent.nextReviewAt) {
      return { status: 'fresh' };
    }
    
    const nextReview = new Date(rawContent.nextReviewAt).getTime();
    const nowTime = new Date(now).getTime();
    
    const daysUntilReview = (nextReview - nowTime) / (1000 * 60 * 60 * 24);
    if (daysUntilReview <= 30) {
      return { status: 'review_due' };
    }
    
    return { status: 'fresh' };
    
  } else if (entityType === 'service') {
    const rawService = await serviceRepo.getRawService(id);
    if (!rawService || !canRecommendService(rawService, now)) {
      return { status: 'not_available' };
    }
    
    if (!rawService.nextReviewAt) {
      return { status: 'fresh' };
    }
    
    const nextReview = new Date(rawService.nextReviewAt).getTime();
    const nowTime = new Date(now).getTime();
    
    const daysUntilReview = (nextReview - nowTime) / (1000 * 60 * 60 * 24);
    if (daysUntilReview <= 30) {
      return { status: 'review_due' };
    }
    
    return { status: 'fresh' };
  }
  
  return { status: 'not_available' };
}
