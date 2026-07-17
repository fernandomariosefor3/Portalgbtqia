import { z } from 'zod';
import { TrustSourceRepository } from '../contracts/repositories.js';
import { createInvalidInputError } from '../errors/index.js';
import { MCP_LIMITS } from '../config/limits.js';

export const searchVerifiedSourcesSchema = z.object({
  domain: z.string().trim().max(100).optional(),
  limit: z.number().int().min(1).max(MCP_LIMITS.MAX_RESULTS_PER_PAGE).optional(),
}).strict();

export async function searchVerifiedSources(args: unknown, repo: TrustSourceRepository, now: string) {
  const parsed = searchVerifiedSourcesSchema.safeParse(args);
  if (!parsed.success) {
    throw createInvalidInputError(parsed.error.message);
  }
  
  const results = await repo.searchVerifiedSources(parsed.data, now);
  
  return {
    results,
    metadata: {
      count: results.length,
    }
  };
}
