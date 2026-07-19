import { Validation } from './humanReview.js';

export interface PublicAdministrativeEntity {
  id: string;
  entityType: 'source' | 'organization';
  name: string;
  shortDescription: string;
  institutionalUrl?: string;
  jurisdiction?: string;
  organizationCategory?: string;
  verifiedStatus: 'verified_basic';
  verifiedAt: string;
  validUntil?: string;
  disclosure: string;
  urlOrigin?: string;
}

export interface PublicationAuthorizationEvent {
  id: string;
  entityId: string;
  entityType: 'source' | 'organization';
  previousPublicationStatus: 'not_published';
  newPublicationStatus: 'published';
  previousPublicListingAllowed: false;
  newPublicListingAllowed: true;
  authorizedBy: string;
  authorizedAt: string;
  promotionEventId: string;
  validationId: string;
  validUntil: string;
  policyVersion: string;
  authorizationStatus: 'approved_not_applied' | 'applied';
  batch: string;
  publicUrl: string;
  publicDescription: string;
  disclosure: string;
}

export function generatePublicAdministrativeEntity(
  entity: any,
  entityType: 'source' | 'organization',
  effectiveValidation: Validation,
  promotionEvent: any
): PublicAdministrativeEntity | null {
  // 1. Verificações de segurança
  if (entity.status !== 'verified_basic') {
    return null;
  }
  
  if (entityType !== 'source' && entityType !== 'organization') {
    return null; // Apenas fontes e organizações podem ser projetadas nesta fase
  }

  // 2. Extração de informações seguras
  const name = entity.name || entity.officialName || '';
  let shortDescription = entity.description || entity.shortDescription || '';
  let institutionalUrl = entity.url || entity.institutionalUrl || entity.website;
  let urlOrigin: string | undefined = undefined;

  if (entityType === 'organization') {
    urlOrigin = 'inherited_from_verified_source';
  }
  
  // URL Overrides e Descrições Curtas (Fase 5C.1)
  if (entity.id === 'src_gov_ce') {
    institutionalUrl = 'https://www.ce.gov.br';
    shortDescription = 'Portal institucional do Governo do Estado do Ceará.';
  } else if (entity.id === 'org_gov_ce') {
    institutionalUrl = 'https://www.ce.gov.br/';
    shortDescription = 'Ente público responsável pela administração do Estado do Ceará.';
  } else if (entity.id === 'src_pref_fortaleza') {
    institutionalUrl = 'https://www.fortaleza.ce.gov.br';
    shortDescription = 'Portal institucional da administração municipal de Fortaleza, Ceará.';
  } else if (entity.id === 'org_pref_fortaleza') {
    institutionalUrl = 'https://www.fortaleza.ce.gov.br/';
    shortDescription = 'Ente público responsável pela administração municipal de Fortaleza.';
  } else if (entity.id === 'src_sec_div_ce') {
    institutionalUrl = 'https://www.ce.gov.br/diversidade/';
    shortDescription = 'Portal institucional da Secretaria da Diversidade do Ceará, órgão integrante da administração pública estadual.';
  } else if (entity.id === 'org_sec_div_ce') {
    institutionalUrl = 'https://www.ce.gov.br/diversidade/';
    shortDescription = 'Secretaria de Estado integrante da administração direta do Governo do Ceará.';
  } else if (entity.id === 'src_sesa_ce') {
    institutionalUrl = 'https://www.ce.gov.br/saude/';
    shortDescription = 'Portal institucional da Secretaria da Saúde do Estado do Ceará.';
  } else if (entity.id === 'org_sesa_ce') {
    institutionalUrl = 'https://www.ce.gov.br/saude/';
    shortDescription = 'Secretaria de Estado responsável pela gestão pública estadual da saúde no Ceará.';
  } else if (entity.id === 'src_smdhds_fortaleza') {
    institutionalUrl = 'https://desenvolvimentosocial.fortaleza.ce.gov.br/institucional/sobre-a-sdhds';
    shortDescription = 'Página institucional da Secretaria Municipal dos Direitos Humanos e Desenvolvimento Social de Fortaleza.';
  } else if (entity.id === 'org_smdhds_fortaleza') {
    institutionalUrl = 'https://www.fortaleza.ce.gov.br/institucional/categoria/secretaria-municipal-do-trabalho-desenvolvimento-social-e-combate-a-fome';
    shortDescription = 'Secretaria municipal vinculada à administração pública de Fortaleza.';
  } else if (entity.id === 'src_hsj_ce') {
    institutionalUrl = 'https://www.ce.gov.br/hsj/';
    shortDescription = 'Página institucional do Hospital São José de Doenças Infecciosas, unidade pública estadual vinculada à Secretaria da Saúde do Ceará.';
  } else if (entity.id === 'org_hsj_ce') {
    institutionalUrl = 'https://www.ce.gov.br/hsj/';
    shortDescription = 'Organização hospitalar pública estadual vinculada à Secretaria da Saúde do Ceará.';
  } else if (entity.id === 'src_huwc_ce') {
    institutionalUrl = 'https://www.gov.br/hubrasil/pt-br/hospitais-universitarios/regiao-nordeste/ch-ufc';
    shortDescription = 'Página institucional do Complexo Hospitalar da Universidade Federal do Ceará — CH-UFC, integrado à Rede HU Brasil e composto pelo Hospital Universitário Walter Cantídio e pela Maternidade-Escola Assis Chateaubriand.';
  } else if (entity.id === 'org_huwc_ce') {
    institutionalUrl = 'https://www.gov.br/hubrasil/pt-br/hospitais-universitarios/regiao-nordeste/ch-ufc';
    shortDescription = 'Complexo hospitalar universitário federal integrado à Rede HU Brasil.';
  } else if (entity.id === 'src_dpe_ce') {
    institutionalUrl = 'https://www.defensoria.ce.def.br';
    shortDescription = 'Portal institucional da Defensoria Pública do Estado do Ceará, instituição pública autônoma e essencial à função jurisdicional do Estado.';
  } else if (entity.id === 'org_dpe_ce') {
    institutionalUrl = 'https://www.defensoria.ce.def.br/';
    shortDescription = 'Instituição pública autônoma e essencial à função jurisdicional do Estado.';
  }
  
  // 3. Montagem do texto público obrigatório
  let disclosure = 'Identidade institucional verificada de forma básica. Esta verificação não representa parceria, recomendação, garantia sobre conteúdos, serviços, disponibilidade ou resultados.';
  
  const category = entity.category || entity.jurisdiction || '';
  const isHealth = category.includes('saude') || category.includes('health') || (name.toLowerCase().includes('saúde') || name.toLowerCase().includes('hospital') || name.toLowerCase().includes('saude'));
  const isDefensoria = name.toLowerCase().includes('defensoria');

  if (isHealth) {
    if (entityType === 'organization') {
      disclosure += ' A verificação da organização não valida automaticamente orientações clínicas, unidades, procedimentos, disponibilidade ou serviços vinculados.';
    } else {
      disclosure += ' A verificação da fonte não valida automaticamente orientações clínicas, unidades, procedimentos, disponibilidade ou serviços publicados.';
    }
  } else if (isDefensoria) {
    disclosure += ' A verificação institucional não garante atendimento, representação, elegibilidade ou resultado jurídico.';
  }

  return {
    id: entity.id,
    entityType,
    name,
    shortDescription,
    institutionalUrl,
    jurisdiction: entity.jurisdiction,
    organizationCategory: entity.category,
    verifiedStatus: 'verified_basic',
    verifiedAt: promotionEvent.promotedAt,
    validUntil: effectiveValidation.validUntil,
    disclosure,
    urlOrigin
  };
}
