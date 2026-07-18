import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createPortalKnowledgeMcpServer } from './server.js';
import { MemoryTrustContentRepository, MemoryTrustServiceRepository, MemoryTrustSourceRepository } from './repositories/MemoryRepositories.js';
import { mcpLogger } from './utils/logger.js';

let isShuttingDown = false;
let globalServer: ReturnType<typeof createPortalKnowledgeMcpServer> | null = null;
let globalTransport: StdioServerTransport | null = null;

export function createProductionServerDependencies() {
  mcpLogger.info('Initializing production dependencies (empty local repositories for now).');
  const sourceRepo = new MemoryTrustSourceRepository([]);
  const contentRepo = new MemoryTrustContentRepository([], sourceRepo);
  const serviceRepo = new MemoryTrustServiceRepository([]);
  return { sourceRepo, contentRepo, serviceRepo };
}

export function createTestServerDependencies() {
  mcpLogger.info('Initializing test dependencies.');
  const sourceRepo = new MemoryTrustSourceRepository([]);
  const contentRepo = new MemoryTrustContentRepository([], sourceRepo);
  const serviceRepo = new MemoryTrustServiceRepository([]);
  return { sourceRepo, contentRepo, serviceRepo };
}

export async function shutdown(reason: string, exitCode: number) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  mcpLogger.info(`Shutting down MCP server. Reason: ${reason}`);
  process.exitCode = exitCode;

  const timeout = setTimeout(() => {
    mcpLogger.error('Shutdown timeout exceeded. Forcing exit.');
    process.exit(exitCode);
  }, 3000);
  timeout.unref();

  try {
    if (globalServer) {
      await globalServer.close();
    }
    if (globalTransport) {
      await globalTransport.close();
    }
  } catch (err) {
    mcpLogger.error('Error during shutdown', err);
  }

  process.exit(exitCode);
}

process.on('uncaughtException', (error) => {
  mcpLogger.error('Fatal error: uncaughtException', error);
  shutdown('uncaughtException', 1);
});

process.on('unhandledRejection', (reason) => {
  mcpLogger.error('Fatal error: unhandledRejection', reason);
  shutdown('unhandledRejection', 1);
});

process.on('SIGINT', () => {
  shutdown('SIGINT', 0);
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM', 0);
});

// Stdin fechado pelo cliente MCP
process.stdin.on('close', () => {
  shutdown('stdin closed', 0);
});

async function main() {
  try {
    const deps = createProductionServerDependencies();
    globalServer = createPortalKnowledgeMcpServer(deps);
    globalTransport = new StdioServerTransport();

    await globalServer.connect(globalTransport);
    mcpLogger.info('Portal LGBTQIA+ Knowledge MCP Server is running over stdio.');
    
  } catch (error) {
    mcpLogger.error('Failed to start MCP Server', error);
    shutdown('startup_error', 1);
  }
}

// Inicia o servidor se rodado diretamente
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop() || '')) {
  main();
}
