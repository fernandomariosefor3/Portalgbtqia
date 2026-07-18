import { describe, it, expect } from 'vitest';
import { createPortalKnowledgeMcpServer } from '../server.js';
import { MemoryTrustContentRepository, MemoryTrustServiceRepository, MemoryTrustSourceRepository } from '../repositories/MemoryRepositories.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { TrustContent, TrustSource } from '../../../src/types/trust.js';

describe('Data Leak Prevention Tests', () => {
  it('should not expose blocked content or non-public fields', async () => {
    const secretSource: TrustSource = {
      id: 'src_secret',
      name: 'Secret Source',
      domain: 'secret.com',
      isVerified: false, // Not verified!
      addedAt: '2024-01-01T00:00:00Z',
      internalNotes: 'VERY SECRET INFO'
    };

    const blockedContent: TrustContent = {
      id: 'cnt_blocked',
      title: 'Blocked Post',
      summary: 'This has PII',
      content: 'This has PII',
      sourceId: 'src_secret',
      sourceIds: ['src_secret'],
      thematicArea: ['Saúde'],
      status: 'blocked',
      validationStatus: 'rejected',
      internalNotes: 'INTERNAL_SECRET_MARKER',
      publishedAt: '2024-01-01T00:00:00Z',
      targetAudience: [],
      authorId: 'author_1',
      reviewerId: 'PRIVATE_REVIEWER_MARKER',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: [],
      plainLanguageAvailable: false,
      librasVersionAvailable: false,
      audioVersionAvailable: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const validSource: TrustSource = {
      id: 'src_valid',
      name: 'Valid Source',
      title: 'Valid Source',
      domain: 'valid.com',
      isVerified: true,
      status: 'verified_basic',
      sourceType: 'civil_society',
      thematicArea: ['Saúde'],
      language: 'pt-BR',
      lastConsultedAt: '2024-01-01T00:00:00Z',
      reliabilityLevel: 'high',
      classificationReasons: [],
      addedAt: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      observations: 'SECURITY_NOTE_MARKER',
      verifiedById: 'REPORTER_ID_MARKER'
    } as any; 

    const validContent: TrustContent = {
      id: 'cnt_valid',
      title: 'Valid Post',
      summary: 'Safe info',
      content: 'Safe info',
      sourceId: 'src_valid',
      sourceIds: ['src_valid'],
      thematicArea: ['Saúde'],
      status: 'validated',
      validationStatus: 'verified_basic',
      publishedAt: '2024-01-01T00:00:00Z',
      internalNotes: 'INTERNAL_SECRET_MARKER',
      targetAudience: [],
      authorId: 'author_1',
      reviewerId: 'PRIVATE_REVIEWER_MARKER',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: [],
      plainLanguageAvailable: false,
      librasVersionAvailable: false,
      audioVersionAvailable: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const sourceRepo = new MemoryTrustSourceRepository([secretSource, validSource]);
    const contentRepo = new MemoryTrustContentRepository([blockedContent, validContent], sourceRepo);
    const serviceRepo = new MemoryTrustServiceRepository([]);
    
    const server = createPortalKnowledgeMcpServer({ 
      contentRepo, 
      serviceRepo, 
      sourceRepo,
      getNow: () => '2025-01-01T00:00:00Z' 
    });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    
    await server.connect(serverTransport);
    const client = new Client({ name: 'test', version: '1.0.0' }, { capabilities: {} });
    await client.connect(clientTransport);

    const res = await client.callTool({
      name: 'search_validated_content',
      arguments: {}
    }) as any;

    const text = res.content[0].text;
    const json = JSON.parse(text);

    // Should only contain cnt_valid
    expect(json.results).toHaveLength(1);
    expect(json.results[0].id).toBe('cnt_valid');
    
    // Should NOT contain internal notes
    expect(text).not.toContain('INTERNAL_SECRET_MARKER');
    expect(text).not.toContain('PRIVATE_REVIEWER_MARKER');
    expect(text).not.toContain('SECURITY_NOTE_MARKER');
    expect(text).not.toContain('REPORTER_ID_MARKER');

    await expect(
      client.callTool({
        name: 'get_validated_content',
        arguments: { id: 'cnt_blocked' }
      })
    ).resolves.toMatchObject({
      isError: true,
      content: [
        { type: 'text', text: expect.stringContaining('Registro não encontrado ou indisponível') }
      ]
    });

    await client.close();
  });
});
