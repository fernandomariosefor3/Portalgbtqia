import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPortalKnowledgeMcpServer } from '../server.js';
import { MemoryTrustContentRepository, MemoryTrustServiceRepository, MemoryTrustSourceRepository } from '../repositories/MemoryRepositories.js';
import { mockSources, mockContents, mockServices, mockNow } from './fixtures/trustFixtures.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { z } from 'zod';

describe('MCP Server Integration', () => {
  let mcpServer: ReturnType<typeof createPortalKnowledgeMcpServer>;
  let client: Client;
  let serverTransport: InMemoryTransport;
  let clientTransport: InMemoryTransport;

  beforeEach(async () => {
    const sourceRepo = new MemoryTrustSourceRepository(mockSources);
    const contentRepo = new MemoryTrustContentRepository(mockContents, sourceRepo);
    const serviceRepo = new MemoryTrustServiceRepository(mockServices);

    mcpServer = createPortalKnowledgeMcpServer({
      contentRepo,
      serviceRepo,
      sourceRepo,
      getNow: () => mockNow,
    });

    [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair();
    await mcpServer.connect(serverTransport);

    client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await mcpServer.close();
  });

  it('deve listar apenas as 6 ferramentas de leitura', async () => {
    const toolsResult = await client.listTools();
    const tools = toolsResult.tools;
    expect(tools).toHaveLength(6);
    const toolNames = tools.map((t: any) => t.name);
    expect(toolNames).toContain('search_validated_content');
    expect(toolNames).toContain('get_validated_content');
    expect(toolNames).toContain('search_verified_services');
    expect(toolNames).toContain('get_verified_service');
    expect(toolNames).toContain('search_verified_sources');
    expect(toolNames).toContain('check_information_freshness');
    
    expect(toolNames.some((t: string) => t.startsWith('create_') || t.startsWith('update_'))).toBe(false);
  });

  describe('search_validated_content', () => {
    it('deve retornar apenas conteúdos válidos com fontes ativas', async () => {
      const response = await client.callTool({
        name: 'search_validated_content',
        arguments: {}
      });

      const content = JSON.parse(((response as any).content[0] as any).text);
      expect(content.results).toHaveLength(1);
      expect(content.results[0].id).toBe('cnt_valid');
      expect(content.results[0].internalNotes).toBeUndefined();
    });
  });

  describe('get_validated_content', () => {
    it('retorna NOT_FOUND (InternalError map) para itens bloqueados para simular que não existem', async () => {
      const response = await client.callTool({
        name: 'get_validated_content',
        arguments: { id: 'cnt_blocked' }
      });
      expect(response.isError).toBe(true);
      expect(((response as any).content[0] as any).text).toContain('Registro não encontrado');
    });
    
    it('retorna os detalhes de um conteúdo válido', async () => {
      const response = await client.callTool({
        name: 'get_validated_content',
        arguments: { id: 'cnt_valid' }
      });
      const data = JSON.parse(((response as any).content[0] as any).text);
      expect(data.content.id).toBe('cnt_valid');
    });
  });

  describe('search_verified_services', () => {
    it('retorna apenas serviços básicos verificados que não expiraram', async () => {
      const response = await client.callTool({
        name: 'search_verified_services',
        arguments: {}
      });
      
      const content = JSON.parse(((response as any).content[0] as any).text);
      expect(content.results).toHaveLength(1);
      expect(content.results[0].id).toBe('srv_valid');
      expect(content.results[0].internalNotes).toBeUndefined();
    });
  });

  describe('check_information_freshness', () => {
    it('retorna not_available para conteúdo bloqueado', async () => {
      const response = await client.callTool({
        name: 'check_information_freshness',
        arguments: { entityType: 'content', id: 'cnt_blocked' }
      });
      const data = JSON.parse(((response as any).content[0] as any).text);
      expect(data.status).toBe('not_available');
    });

    it('retorna fresh para conteúdo válido sem expiração próxima', async () => {
      const response = await client.callTool({
        name: 'check_information_freshness',
        arguments: { entityType: 'content', id: 'cnt_valid' }
      });
      const data = JSON.parse(((response as any).content[0] as any).text);
      expect(data.status).toBe('fresh');
    });
  });
});
