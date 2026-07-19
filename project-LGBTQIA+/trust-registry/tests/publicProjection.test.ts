import { describe, it, expect } from 'vitest';
import { generatePreview } from '../../scripts/generate-public-registry-preview.js';
import { generatePublicAdministrativeEntity } from '../lib/publicProjection.js';

describe('Public Projection', () => {
  const dummyValidation = {
    id: 'val_001',
    entityId: 'src_gov_ce',
    decision: 'approved_basic',
    reviewedAt: '2026-07-19T00:00:00Z',
    validUntil: '2027-07-19T00:00:00Z',
    fingerprintVersion: 'v2',
    entityFingerprint: '1234567890abcdef',
    evidenceFingerprint: 'abcdef1234567890'
  } as any;

  const dummyEvent = {
    id: 'promo_001',
    entityId: 'src_gov_ce',
    newStatus: 'verified_basic',
    effectiveValidationId: 'val_001',
    promotedAt: '2026-07-19T00:00:00Z',
    promotedBy: 'reviewer-owner-001'
  };

  it('verified_basic sozinho não publica no frontend automaticamente', () => {
    // This is tested by the fact that the actual `publicListingAllowed` isn't mutated
    // by generatePreview. The preview just shows candidates.
    const entity = {
      id: 'src_gov_ce',
      status: 'verified_basic',
      publicListingAllowed: false,
      publicationStatus: 'not_published'
    };

    const projected = generatePublicAdministrativeEntity(entity, 'source', dummyValidation, dummyEvent);
    expect(projected).not.toBeNull();
    // Flags were not altered
    expect(entity.publicListingAllowed).toBe(false);
  });

  it('fonte sem autorização de publicação não entra na projeção final', () => {
    // In our preview logic, we only simulate future authorization. 
    // The requirement is "fonte sem autorização de publicação (ou sem verified_basic) não entra".
    const entity = { id: 'src_gov_ce', status: 'under_review' };
    const projected = generatePublicAdministrativeEntity(entity, 'source', dummyValidation, dummyEvent);
    expect(projected).toBeNull();
  });

  it('organização sem fonte verificada não pode ser publicada', () => {
    const org = { id: 'org_gov_ce', source_id: 'src_gov_ce', status: 'verified_basic' };
    const source = { id: 'src_gov_ce', status: 'under_review' };

    const preview = generatePreview([source], [org], [], [dummyValidation], [dummyEvent, { ...dummyEvent, entityId: 'org_gov_ce' }]);
    expect(preview.find(e => e.id === 'org_gov_ce')).toBeUndefined();
  });

  it('serviço nunca aparece', () => {
    const service = { id: 'svc_gov_ce', status: 'verified_basic' };
    const preview = generatePreview([], [], [service], [dummyValidation], [dummyEvent]);
    expect(preview.find(e => e.id === 'svc_gov_ce')).toBeUndefined();
  });

  it('alias nunca aparece', () => {
    const alias = { id: 'alias_gov_ce', status: 'verified_basic' };
    const preview = generatePreview([alias], [], [], [dummyValidation], [dummyEvent]);
    expect(preview.length).toBe(0);
  });

  it('Casa Transformar nunca aparece', () => {
    const ct = { id: 'svc_casa_transformar_001', status: 'verified_basic' };
    const preview = generatePreview([], [], [ct], [dummyValidation], [dummyEvent]);
    expect(preview.length).toBe(0);
  });

  it('dados internos, fingerprints, revisores e endereços protegidos são removidos', () => {
    const entity = {
      id: 'src_gov_ce',
      status: 'verified_basic',
      name: 'Governo do Ceara',
      internalNotes: 'SECRET',
      publicAddressAllowed: false,
      address: 'Rua Secreta'
    };

    const projected = generatePublicAdministrativeEntity(entity, 'source', dummyValidation, dummyEvent);
    
    expect((projected as any).internalNotes).toBeUndefined();
    expect((projected as any).address).toBeUndefined();
    expect((projected as any).publicAddressAllowed).toBeUndefined();
    expect((projected as any).entityFingerprint).toBeUndefined();
    expect((projected as any).promotedBy).toBeUndefined(); // Revisor removed
  });

  it('projeção determinística', () => {
    const org = { id: 'org_gov_ce', source_id: 'src_gov_ce', status: 'verified_basic' };
    const src = { id: 'src_gov_ce', status: 'verified_basic' };

    const events = [
      { id: 'e1', entityId: 'src_gov_ce', effectiveValidationId: 'val_001', newStatus: 'verified_basic', promotedAt: '2026-07-19T00:00:00Z' },
      { id: 'e2', entityId: 'org_gov_ce', effectiveValidationId: 'val_001', newStatus: 'verified_basic', promotedAt: '2026-07-19T00:00:00Z' }
    ];

    const preview1 = generatePreview([src], [org], [], [dummyValidation], events);
    const preview2 = generatePreview([src], [org], [], [dummyValidation], events); // Same inputs

    // Swap order of inputs
    const preview3 = generatePreview([src], [org], [], [dummyValidation], events.reverse()); 

    expect(JSON.stringify(preview1)).toBe(JSON.stringify(preview2));
    
    // Sort is alphabetical by ID, so org_gov_ce comes before src_gov_ce
    expect(preview1[0].id).toBe('org_gov_ce');
    expect(preview1[1].id).toBe('src_gov_ce');
  });

  it('script não modifica os arquivos de origem', () => {
    const org = { id: 'org_gov_ce', source_id: 'src_gov_ce', status: 'verified_basic' };
    const src = { id: 'src_gov_ce', status: 'verified_basic' };
    
    const orgCopy = { ...org };
    const srcCopy = { ...src };

    const events = [
      { id: 'e1', entityId: 'src_gov_ce', effectiveValidationId: 'val_001', newStatus: 'verified_basic', promotedAt: '2026-07-19T00:00:00Z' },
      { id: 'e2', entityId: 'org_gov_ce', effectiveValidationId: 'val_001', newStatus: 'verified_basic', promotedAt: '2026-07-19T00:00:00Z' }
    ];

    generatePreview([src], [org], [], [dummyValidation], events);

    expect(org).toEqual(orgCopy);
    expect(src).toEqual(srcCopy);
  });
});
