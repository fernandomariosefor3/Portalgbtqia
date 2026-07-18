import { describe, it, expect } from 'vitest';
import { createPortalKnowledgeMcpServer } from '../server.js';
import { MemoryTrustContentRepository, MemoryTrustServiceRepository, MemoryTrustSourceRepository } from '../repositories/MemoryRepositories.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { TrustContent } from '../../../src/types/trust.js';
import { MCP_LIMITS } from '../config/limits.js';

describe('Payload Limits and Deterministic Reduction', () => {
  it('should reduce results deterministically if payload exceeds limit', async () => {
    // Modify limits for this test dynamically? We can't easily without mocking.
    // Wait, the limit is 2MB, we can create an item that is 1.5MB and another that is 1MB.
    // So together they are 2.5MB, exceeding the limit, and it should return only 1 item.
    
    const sourceRepo = new MemoryTrustSourceRepository([]);
    const serviceRepo = new MemoryTrustServiceRepository([]);
    
    const hugeString1 = 'a'.repeat(1024 * 500); // 500KB
    const hugeString2 = 'b'.repeat(1024 * 1600); // 1.6MB (so combined is 2.1MB > 2MB limit)
    
    const content1: TrustContent = {
      id: 'cnt_1',
      title: 'A Post',
      summary: 'Summary A',
      content: hugeString1,
      sourceId: 'src_1',
      sourceIds: ['src_1'],
      thematicArea: ['Saúde'],
      status: 'validated',
      validationStatus: 'verified_basic',
      publishedAt: '2024-01-01T00:00:00Z',
      targetAudience: [],
      authorId: 'author_1',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: [],
      plainLanguageAvailable: false,
      librasVersionAvailable: false,
      audioVersionAvailable: false,
      createdAt: '2024-01-01T00:00:00Z'
    };
    
    const content2: TrustContent = {
      id: 'cnt_2',
      title: 'B Post', // Sorts after A Post
      summary: 'Summary B',
      content: hugeString2,
      sourceId: 'src_1',
      sourceIds: ['src_1'],
      thematicArea: ['Saúde'],
      status: 'validated',
      validationStatus: 'verified_basic',
      publishedAt: '2024-01-01T00:00:00Z',
      targetAudience: [],
      authorId: 'author_1',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: [],
      plainLanguageAvailable: false,
      librasVersionAvailable: false,
      audioVersionAvailable: false,
      createdAt: '2024-01-01T00:00:00Z'
    };
    
    // Custom repo that just returns both, bypassing the logic since we just want to test server.ts reduction
    const contentRepo = {
      searchValidatedContent: async () => [content1, content2],
      getValidatedContent: async () => null,
      getRawContent: async () => null
    };

    const server = createPortalKnowledgeMcpServer({ 
      contentRepo: contentRepo as any, 
      serviceRepo, 
      sourceRepo 
    });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    
    await server.connect(serverTransport);
    const client = new Client({ name: 'test', version: '1.0.0' }, { capabilities: {} });
    await client.connect(clientTransport);

    const callResult = await client.callTool({
      name: 'search_validated_content',
      arguments: {}
    }) as any;

    if (callResult.isError) {
      console.log('Failed result:', JSON.stringify(callResult));
      throw new Error("Tool returned error: " + callResult.content[0].text);
    }
    const text = callResult.content[0].text;
    const json = JSON.parse(text);
    
    // Together they are 2.4MB, which exceeds 2MB limit.
    // The server reduces from the end (popping). Since results are ordered, it pops cnt_2.
    expect(json.results).toHaveLength(1);
    expect(json.results[0].id).toBe('cnt_1'); // Only cnt_1 should remain
    expect(json._limited_by_size).toBe(true);
    
    // Now let's test a single item that exceeds the limit
    const contentRepoSingle = {
      searchValidatedContent: async () => [{ ...content1, content: 'c'.repeat(1024 * 1024 * 2.5) }],
      getValidatedContent: async () => ({ ...content1, content: 'c'.repeat(1024 * 1024 * 2.5) }),
      getRawContent: async () => null
    };

    const server2 = createPortalKnowledgeMcpServer({ 
      contentRepo: contentRepoSingle as any, 
      serviceRepo, 
      sourceRepo 
    });
    const [clientTransport2, serverTransport2] = InMemoryTransport.createLinkedPair();
    
    await server2.connect(serverTransport2);
    const client2 = new Client({ name: 'test2', version: '1.0.0' }, { capabilities: {} });
    await client2.connect(clientTransport2);

    const searchCallSingle = await client2.callTool({
      name: 'search_validated_content',
      arguments: {}
    }) as any;

    expect(searchCallSingle.isError).toBe(true);
    expect(searchCallSingle.content[0].text).toContain('O limite de resposta foi excedido');

    const getCallSingle = await client2.callTool({
      name: 'get_validated_content',
      arguments: { id: 'cnt_1' }
    }) as any;

    expect(getCallSingle.isError).toBe(true);
    expect(getCallSingle.content[0].text).toContain('O limite de resposta foi excedido');

    await client.close();
    await client2.close();
  });
});
