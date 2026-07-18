import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export type PublicMcpErrorCode =
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'NO_RESULTS'
  | 'LIMIT_EXCEEDED'
  | 'INFORMATION_OUTDATED'
  | 'INTERNAL_ERROR'
  | 'TEMPORARILY_UNAVAILABLE';

export const McpErrorCodes: Record<PublicMcpErrorCode, PublicMcpErrorCode> = {
  INVALID_INPUT: 'INVALID_INPUT',
  NOT_FOUND: 'NOT_FOUND',
  NO_RESULTS: 'NO_RESULTS',
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',
  INFORMATION_OUTDATED: 'INFORMATION_OUTDATED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  TEMPORARILY_UNAVAILABLE: 'TEMPORARILY_UNAVAILABLE',
};

export class DomainMcpError extends McpError {
  constructor(domainCode: PublicMcpErrorCode, message: string, data?: unknown) {
    let rpcCode = ErrorCode.InternalError;
    
    switch (domainCode) {
      case 'INVALID_INPUT':
        rpcCode = ErrorCode.InvalidParams;
        break;
      case 'NOT_FOUND':
      case 'NO_RESULTS':
        rpcCode = ErrorCode.InvalidRequest; 
        break;
      case 'LIMIT_EXCEEDED':
        rpcCode = ErrorCode.InvalidParams;
        break;
      case 'TEMPORARILY_UNAVAILABLE':
        rpcCode = ErrorCode.InternalError; // No exact match, Internal is safest
        break;
      case 'INFORMATION_OUTDATED':
        rpcCode = ErrorCode.InvalidRequest;
        break;
      case 'INTERNAL_ERROR':
      default:
        rpcCode = ErrorCode.InternalError;
    }

    super(rpcCode, message, { domainCode, ...(typeof data === 'object' && data !== null ? data : { rawData: data }) });
  }
}

export function createInternalError(): DomainMcpError {
  return new DomainMcpError('INTERNAL_ERROR', 'Um erro interno genérico ocorreu.');
}

export function createNotFoundError(): DomainMcpError {
  return new DomainMcpError('NOT_FOUND', 'Registro não encontrado ou indisponível para consulta pública.');
}

export function createInvalidInputError(message: string): DomainMcpError {
  return new DomainMcpError('INVALID_INPUT', `Entrada inválida: ${message}`);
}

export function createLimitExceededError(): DomainMcpError {
  return new DomainMcpError('LIMIT_EXCEEDED', 'O limite de resposta foi excedido e não pôde ser retornado com segurança.');
}

export function createTemporarilyUnavailableError(): DomainMcpError {
  return new DomainMcpError('TEMPORARILY_UNAVAILABLE', 'O repositório está temporariamente indisponível.');
}
