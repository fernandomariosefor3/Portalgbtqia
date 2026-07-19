import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TrustContentRepository, TrustServiceRepository, TrustSourceRepository } from './contracts/repositories.js';
import { 
  searchValidatedContentSchema, searchValidatedContent,
  getValidatedContentSchema, getValidatedContent 
} from './tools/contentTools.js';
import { 
  searchVerifiedServicesSchema, searchVerifiedServices,
  getVerifiedServiceSchema, getVerifiedService 
} from './tools/serviceTools.js';
import { 
  searchVerifiedSourcesSchema, searchVerifiedSources 
} from './tools/sourceTools.js';
import { 
  checkInformationFreshnessSchema, checkInformationFreshness 
} from './tools/freshnessTools.js';
import { DomainMcpError, createLimitExceededError, createTemporarilyUnavailableError } from './errors/index.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { MCP_LIMITS } from './config/limits.js';
import { mcpLogger } from './utils/logger.js';

export interface McpServerDependencies {
  contentRepo: TrustContentRepository;
  serviceRepo: TrustServiceRepository;
  sourceRepo: TrustSourceRepository;
  getNow?: () => string;
}

function enforcePublicResponseSize(response: any, isSearch: boolean): string {
  let serialized = JSON.stringify(response, null, 2);
  let bytes = Buffer.byteLength(serialized, 'utf8');

  if (bytes <= MCP_LIMITS.MAX_RESPONSE_PAYLOAD_SIZE_BYTES) {
    return serialized;
  }

  if (isSearch && Array.isArray(response.results)) {
    // Tentativa de redução progressiva
    let reducedResults = [...response.results];
    while (reducedResults.length > 0 && bytes > MCP_LIMITS.MAX_RESPONSE_PAYLOAD_SIZE_BYTES) {
      reducedResults.pop();
      const newResponse = { ...response, results: reducedResults, _limited_by_size: true };
      serialized = JSON.stringify(newResponse, null, 2);
      bytes = Buffer.byteLength(serialized, 'utf8');
    }

    if (reducedResults.length > 0 && bytes <= MCP_LIMITS.MAX_RESPONSE_PAYLOAD_SIZE_BYTES) {
      return serialized;
    }
  }

  // Se não coube nem um item ou é detalhe individual, limite estourou
  throw createLimitExceededError();
}

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(createTemporarilyUnavailableError());
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export function createPortalKnowledgeMcpServer(deps: McpServerDependencies): McpServer {
  const server = new McpServer({
    name: 'portal-lgbtqia-knowledge-mcp',
    version: '1.0.0',
  });

  const getNow = deps.getNow ?? (() => new Date().toISOString());

  const handleTool = async (handler: () => Promise<any>, isSearch: boolean) => {
    try {
      const result = await withTimeout(handler(), MCP_LIMITS.REPOSITORY_TIMEOUT_MS);
      const safePayload = enforcePublicResponseSize(result, isSearch);
      
      return {
        content: [{ type: 'text' as const, text: safePayload }]
      };
    } catch (error: any) {
      if (error instanceof DomainMcpError || (error instanceof McpError && error.code !== ErrorCode.InternalError)) {
        throw error;
      }
      
      mcpLogger.error('Unexpected internal error during tool execution', error);
      
      throw new McpError(ErrorCode.InternalError, 'Um erro interno genérico ocorreu.');
    }
  };

  server.tool(
    'search_validated_content',
    'Busca artigos e guias validados na base de conhecimento.',
    searchValidatedContentSchema.shape,
    async (args) => handleTool(() => searchValidatedContent(args, deps.contentRepo, getNow()), true)
  );

  server.tool(
    'get_validated_content',
    'Obtém os detalhes de um conteúdo validado pelo ID.',
    getValidatedContentSchema.shape,
    async (args) => handleTool(() => getValidatedContent(args, deps.contentRepo, getNow()), false)
  );

  server.tool(
    'search_verified_services',
    'Busca exclusivamente registros TrustService que passam pelas políticas de recomendação.',
    searchVerifiedServicesSchema.shape,
    async (args) => handleTool(() => searchVerifiedServices(args, deps.serviceRepo, getNow()), true)
  );

  server.tool(
    'get_verified_service',
    'Obtém os detalhes de um serviço verificado pelo ID.',
    getVerifiedServiceSchema.shape,
    async (args) => handleTool(() => getVerifiedService(args, deps.serviceRepo, getNow()), false)
  );

  server.tool(
    'search_verified_sources',
    'Busca fontes verificadas da base.',
    searchVerifiedSourcesSchema.shape,
    async (args) => handleTool(() => searchVerifiedSources(args, deps.sourceRepo, getNow()), true)
  );

  server.tool(
    'check_information_freshness',
    'Verifica a atualidade (freshness) de um registro, retornando apenas status público.',
    checkInformationFreshnessSchema.shape,
    async (args) => handleTool(() => checkInformationFreshness(args, deps.contentRepo, deps.serviceRepo, deps.sourceRepo, getNow()), false)
  );

  return server;
}
