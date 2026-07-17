import { TrustContent, TrustService, TrustSource } from '../../../../src/types/trust.js';

export const mockNow = '2026-07-17T12:00:00Z';
export const mockFuture = '2030-01-01T12:00:00Z';
export const mockPast = '2025-01-01T12:00:00Z';

export const mockSources: TrustSource[] = [
  {
    id: 'src_valid',
    title: 'Fonte Válida',
    url: 'https://valida.com',
    domain: 'valida.com',
    status: 'verified_basic',
    createdAt: mockPast,
    updatedAt: mockPast,
  } as unknown as TrustSource,
  {
    id: 'src_blocked',
    title: 'Fonte Bloqueada',
    url: 'https://bloqueada.com',
    domain: 'bloqueada.com',
    status: 'suspended',
    createdAt: mockPast,
    updatedAt: mockPast,
  } as unknown as TrustSource
];

export const mockContents: TrustContent[] = [
  {
    id: 'cnt_valid',
    title: 'Conteúdo Válido',
    slug: 'conteudo-valido',
    content: 'Texto.',
    thematicArea: ['Saúde'],
    status: 'validated',
    sourceIds: ['src_valid'],
    nextReviewAt: mockFuture,
    internalNotes: 'Não deve aparecer na API pública',
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustContent,
  {
    id: 'cnt_blocked',
    title: 'Conteúdo Bloqueado',
    slug: 'conteudo-bloqueado',
    content: 'Texto.',
    thematicArea: ['Direitos'],
    status: 'blocked',
    sourceIds: ['src_valid'],
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustContent,
  {
    id: 'cnt_expired',
    title: 'Conteúdo Expirado',
    slug: 'conteudo-expirado',
    content: 'Texto.',
    thematicArea: ['Saúde'],
    status: 'validated',
    sourceIds: ['src_valid'],
    nextReviewAt: mockPast,
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustContent,
  {
    id: 'cnt_bad_source',
    title: 'Conteúdo com Fonte Bloqueada',
    slug: 'conteudo-bad-source',
    content: 'Texto.',
    thematicArea: ['Geral'],
    status: 'validated',
    sourceIds: ['src_blocked'],
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustContent,
  {
    id: 'cnt_no_source',
    title: 'Conteúdo sem Fonte',
    slug: 'conteudo-sem-fonte',
    content: 'Texto.',
    thematicArea: ['Geral'],
    status: 'validated',
    sourceIds: [],
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustContent
];

export const mockServices: TrustService[] = [
  {
    id: 'srv_valid',
    category: ['Acolhimento'],
    name: 'Serviço Válido',
    status: 'verified_basic',
    nextReviewAt: mockFuture,
    location: {
      address: {
        state: 'SP',
        city: 'São Paulo'
      }
    },
    accessibility: ['Libras'],
    isFree: true,
    internalNotes: 'Não expor',
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustService,
  {
    id: 'srv_suspended',
    category: ['Saúde'],
    name: 'Serviço Suspenso',
    status: 'suspended',
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustService,
  {
    id: 'srv_expired',
    category: ['Saúde'],
    name: 'Serviço Expirado',
    status: 'verified_basic',
    nextReviewAt: mockPast,
    createdAt: mockPast,
    updatedAt: mockPast
  } as unknown as TrustService
];
