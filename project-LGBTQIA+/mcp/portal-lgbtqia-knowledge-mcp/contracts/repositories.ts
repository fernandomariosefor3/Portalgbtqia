import { TrustContent, TrustService, TrustSource, PublicTrustContent, PublicTrustService, PublicTrustSource } from '../../../src/types/trust.js';

export interface TrustContentSearchQuery {
  text?: string;
  thematicArea?: string;
  tags?: string[];
  limit?: number;
}

export interface TrustServiceSearchQuery {
  text?: string;
  category?: string;
  state?: string;
  city?: string;
  isFree?: boolean;
  limit?: number;
}

export interface TrustSourceSearchQuery {
  domain?: string;
  limit?: number;
}

export interface TrustContentRepository {
  searchValidatedContent(query: TrustContentSearchQuery, now: string): Promise<PublicTrustContent[]>;
  getValidatedContent(id: string, now: string): Promise<PublicTrustContent | null>;
  // Para uso interno em verificações
  getRawContent(id: string): Promise<TrustContent | null>;
}

export interface TrustServiceRepository {
  searchVerifiedServices(query: TrustServiceSearchQuery, now: string): Promise<PublicTrustService[]>;
  getVerifiedService(id: string, now: string): Promise<PublicTrustService | null>;
  getRawService(id: string): Promise<TrustService | null>;
}

export interface TrustSourceRepository {
  searchVerifiedSources(query: TrustSourceSearchQuery, now: string): Promise<PublicTrustSource[]>;
  getVerifiedSource(id: string, now: string): Promise<PublicTrustSource | null>;
  getRawSource(id: string): Promise<TrustSource | null>;
  getAllRawSources(): Promise<TrustSource[]>;
}
