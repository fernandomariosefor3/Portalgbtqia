import { z } from 'zod';
import { TrustServiceRepository } from '../contracts/repositories.js';
import { createNotFoundError, createInvalidInputError } from '../errors/index.js';
import { MCP_LIMITS } from '../config/limits.js';

export const searchVerifiedServicesSchema = z.object({
  text: z.string().trim().max(MCP_LIMITS.MAX_QUERY_LENGTH).optional(),
  category: z.string().trim().max(50).optional(),
  state: z.string().trim().max(50).optional(),
  city: z.string().trim().max(100).optional(),
  isFree: z.boolean().optional(),
  limit: z.number().int().min(1).max(MCP_LIMITS.MAX_RESULTS_PER_PAGE).optional(),
}).strict();

export async function searchVerifiedServices(args: unknown, repo: TrustServiceRepository, now: string) {
  const parsed = searchVerifiedServicesSchema.safeParse(args);
  if (!parsed.success) {
    throw createInvalidInputError(parsed.error.message);
  }
  
  const results = await repo.searchVerifiedServices(parsed.data, now);
  
  return {
    results,
    metadata: {
      count: results.length,
      warning: results.length === 0 ? "Nenhum resultado encontrado para os critérios." : undefined,
      disclaimer: "Status 'verificado' denota apenas checagem de existência e premissa, não sendo garantia absoluta de segurança física.",
    }
  };
}

export const getVerifiedServiceSchema = z.object({
  id: z.string().trim().min(1).max(MCP_LIMITS.MAX_ID_LENGTH),
}).strict();

export async function getVerifiedService(args: unknown, repo: TrustServiceRepository, now: string) {
  const parsed = getVerifiedServiceSchema.safeParse(args);
  if (!parsed.success) {
    throw createInvalidInputError(parsed.error.message);
  }
  
  const service = await repo.getVerifiedService(parsed.data.id, now);
  if (!service) {
    throw createNotFoundError();
  }
  
  return {
    service,
    metadata: {
      disclaimer: "Status 'verificado' denota apenas checagem de existência e premissa, não sendo garantia absoluta de segurança física.",
    }
  };
}
