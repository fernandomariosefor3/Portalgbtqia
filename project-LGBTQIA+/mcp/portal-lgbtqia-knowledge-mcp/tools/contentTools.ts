import { z } from 'zod';
import { TrustContentRepository } from '../contracts/repositories.js';
import { createNotFoundError, createInvalidInputError } from '../errors/index.js';
import { MCP_LIMITS } from '../config/limits.js';

export const searchValidatedContentSchema = z.object({
  text: z.string().trim().max(MCP_LIMITS.MAX_QUERY_LENGTH).optional(),
  thematicArea: z.string().trim().max(50).optional(),
  tags: z.array(z.string().trim().max(MCP_LIMITS.MAX_TAG_LENGTH)).max(MCP_LIMITS.MAX_TAGS_PER_QUERY).optional(),
  limit: z.number().int().min(1).max(MCP_LIMITS.MAX_RESULTS_PER_PAGE).optional(),
}).strict();

export async function searchValidatedContent(args: unknown, repo: TrustContentRepository, now: string) {
  const parsed = searchValidatedContentSchema.safeParse(args);
  if (!parsed.success) {
    throw createInvalidInputError(parsed.error.message);
  }
  
  const results = await repo.searchValidatedContent(parsed.data, now);
  
  return {
    results,
    metadata: {
      count: results.length,
      warning: results.length === 0 ? "Nenhum resultado encontrado para os critérios." : undefined,
    }
  };
}

export const getValidatedContentSchema = z.object({
  id: z.string().trim().min(1).max(MCP_LIMITS.MAX_ID_LENGTH),
}).strict();

export async function getValidatedContent(args: unknown, repo: TrustContentRepository, now: string) {
  const parsed = getValidatedContentSchema.safeParse(args);
  if (!parsed.success) {
    throw createInvalidInputError(parsed.error.message);
  }
  
  const content = await repo.getValidatedContent(parsed.data.id, now);
  if (!content) {
    throw createNotFoundError();
  }
  
  return {
    content
  };
}
