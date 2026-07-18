import { TrustContent, TrustService, TrustSource, PublicTrustContent, PublicTrustService, PublicTrustSource } from '../../../src/types/trust.js';
import { toPublicContent, toPublicService, toPublicSource } from '../../../src/lib/trust.js';
import { 
  TrustContentRepository, 
  TrustServiceRepository, 
  TrustSourceRepository,
  TrustContentSearchQuery,
  TrustServiceSearchQuery,
  TrustSourceSearchQuery
} from '../contracts/repositories.js';
import { canUseContentInFarol, canRecommendService, canReturnSource } from '../policies/trustPolicies.js';
import { MCP_LIMITS } from '../config/limits.js';
import { createInternalError } from '../errors/index.js';

function safeClone<T>(obj: T): T {
  try {
    return structuredClone(obj);
  } catch (e) {
    throw createInternalError();
  }
}

function normalizeStr(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function scoreContentMatch(c: TrustContent, queryText: string | undefined, queryTags: string[] | undefined): number {
  let score = 0;
  if (queryText) {
    const textNorm = normalizeStr(queryText);
    const titleNorm = normalizeStr(c.title);
    const summaryNorm = c.summary ? normalizeStr(c.summary) : '';

    if (titleNorm === textNorm) score += 1000;
    else if (titleNorm.includes(textNorm)) score += 100;
    else if (summaryNorm.includes(textNorm)) score += 10;
  }
  if (queryTags && queryTags.length > 0 && c.tags) {
    const normCTags = c.tags.map(normalizeStr);
    let matchedTags = 0;
    for (const t of queryTags) {
      if (normCTags.includes(normalizeStr(t))) matchedTags++;
    }
    score += matchedTags;
  }
  return score;
}

export class MemoryTrustSourceRepository implements TrustSourceRepository {
  constructor(private sources: TrustSource[]) {}

  async searchVerifiedSources(query: TrustSourceSearchQuery, now: string): Promise<PublicTrustSource[]> {
    const results = this.sources.filter(s => {
      if (!canReturnSource(s)) return false;
      if (query.domain && (!s.domain || !s.domain.includes(query.domain))) return false;
      return true;
    });

    results.sort((a, b) => {
      if (a.name !== b.name) return a.name.localeCompare(b.name);
      return a.id.localeCompare(b.id);
    });

    return results
      .slice(0, Math.min(query.limit ?? MCP_LIMITS.MAX_RESULTS_PER_PAGE, MCP_LIMITS.MAX_RESULTS_PER_PAGE))
      .map(s => safeClone(toPublicSource(s)));
  }

  async getVerifiedSource(id: string, now: string): Promise<PublicTrustSource | null> {
    const source = this.sources.find(s => s.id === id);
    if (!source || !canReturnSource(source)) return null;
    return safeClone(toPublicSource(source));
  }

  async getRawSource(id: string): Promise<TrustSource | null> {
    const source = this.sources.find(s => s.id === id);
    return source ? safeClone(source) : null;
  }

  async getAllRawSources(): Promise<TrustSource[]> {
    return safeClone(this.sources);
  }
}

export class MemoryTrustContentRepository implements TrustContentRepository {
  constructor(private contents: TrustContent[], private sourceRepo: TrustSourceRepository) {}

  async searchValidatedContent(query: TrustContentSearchQuery, now: string): Promise<PublicTrustContent[]> {
    const sources = await this.sourceRepo.getAllRawSources();
    
    const results = this.contents.filter(c => {
      if (!canUseContentInFarol(c, sources, now)) return false;
      
      if (query.thematicArea && (!c.thematicArea || !c.thematicArea.includes(query.thematicArea))) return false;
      
      if (query.tags && query.tags.length > 0) {
        if (!c.tags) return false;
        const normalizedTags = c.tags.map(normalizeStr);
        const hasTag = query.tags.some(t => normalizedTags.includes(normalizeStr(t)));
        if (!hasTag) return false;
      }
      
      if (query.text) {
        const text = normalizeStr(query.text);
        const titleMatch = normalizeStr(c.title).includes(text);
        const summaryMatch = c.summary ? normalizeStr(c.summary).includes(text) : false;
        if (!titleMatch && !summaryMatch) return false;
      }
      
      return true;
    });

    results.sort((a, b) => {
      const scoreA = scoreContentMatch(a, query.text, query.tags);
      const scoreB = scoreContentMatch(b, query.text, query.tags);
      if (scoreA !== scoreB) return scoreB - scoreA;
      
      const dateA = a.lastVerifiedAt ?? a.publishedAt ?? '';
      const dateB = b.lastVerifiedAt ?? b.publishedAt ?? '';
      if (dateA !== dateB) return dateB.localeCompare(dateA);

      if (a.title !== b.title) return a.title.localeCompare(b.title);
      return a.id.localeCompare(b.id);
    });

    return results
      .slice(0, Math.min(query.limit ?? MCP_LIMITS.MAX_RESULTS_PER_PAGE, MCP_LIMITS.MAX_RESULTS_PER_PAGE))
      .map(c => safeClone(toPublicContent(c)));
  }

  async getValidatedContent(id: string, now: string): Promise<PublicTrustContent | null> {
    const c = this.contents.find(x => x.id === id);
    if (!c) return null;
    const sources = await this.sourceRepo.getAllRawSources();
    if (!canUseContentInFarol(c, sources, now)) return null;
    
    return safeClone(toPublicContent(c));
  }

  async getRawContent(id: string): Promise<TrustContent | null> {
    const c = this.contents.find(x => x.id === id);
    return c ? safeClone(c) : null;
  }
}

export class MemoryTrustServiceRepository implements TrustServiceRepository {
  constructor(private services: TrustService[]) {}

  async searchVerifiedServices(query: TrustServiceSearchQuery, now: string): Promise<PublicTrustService[]> {
    const results = this.services.filter(s => {
      if (!canRecommendService(s, now)) return false;
      
      if (query.category && (!s.category || !s.category.includes(query.category))) return false;
      
      if (query.isFree !== undefined && s.isFree !== query.isFree) return false;
      
      if (query.state) {
        if (!s.state || normalizeStr(s.state) !== normalizeStr(query.state)) return false;
      }

      if (query.city) {
        if (!s.city || normalizeStr(s.city) !== normalizeStr(query.city)) return false;
      }
      
      if (query.text) {
        const text = normalizeStr(query.text);
        const nameMatch = normalizeStr(s.name).includes(text);
        const descMatch = s.description ? normalizeStr(s.description).includes(text) : false;
        if (!nameMatch && !descMatch) return false;
      }

      return true;
    });

    results.sort((a, b) => {
      if (query.text) {
        const text = normalizeStr(query.text);
        const nameMatchA = normalizeStr(a.name) === text ? 1000 : (normalizeStr(a.name).includes(text) ? 100 : 0);
        const nameMatchB = normalizeStr(b.name) === text ? 1000 : (normalizeStr(b.name).includes(text) ? 100 : 0);
        if (nameMatchA !== nameMatchB) return nameMatchB - nameMatchA;
      }

      const dateA = a.lastVerifiedAt ?? '';
      const dateB = b.lastVerifiedAt ?? '';
      if (dateA !== dateB) return dateB.localeCompare(dateA);

      if (a.name !== b.name) return a.name.localeCompare(b.name);
      return a.id.localeCompare(b.id);
    });

    return results
      .slice(0, Math.min(query.limit ?? MCP_LIMITS.MAX_RESULTS_PER_PAGE, MCP_LIMITS.MAX_RESULTS_PER_PAGE))
      .map(s => safeClone(toPublicService(s)));
  }

  async getVerifiedService(id: string, now: string): Promise<PublicTrustService | null> {
    const s = this.services.find(x => x.id === id);
    if (!s) return null;
    if (!canRecommendService(s, now)) return null;
    
    return safeClone(toPublicService(s));
  }

  async getRawService(id: string): Promise<TrustService | null> {
    const s = this.services.find(x => x.id === id);
    return s ? safeClone(s) : null;
  }
}
