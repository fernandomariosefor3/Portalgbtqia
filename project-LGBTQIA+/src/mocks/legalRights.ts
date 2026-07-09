export type LegalGuideCategory =
  | 'Identidade'
  | 'Família'
  | 'Saúde'
  | 'Trabalho'
  | 'Educação'
  | 'Violência'
  | 'Serviços';

export interface LegalGuide {
  id: string;
  slug: string;
  title: string;
  category: LegalGuideCategory;
  summary: string;
  content: string;
  actions: string[];
  contacts: string[];
  tags: string[];
  priority: 'alta' | 'media' | 'baixa';
  status: 'published' | 'hidden';
}

export const legalCategories: LegalGuideCategory[] = [
  'Identidade',
  'Família',
  'Saúde',
  'Trabalho',
  'Educação',
  'Violência',
  'Serviços',
];

export const staticLegalGuides: LegalGuide[] = [
  {
    id: 'legal-nome-social',
    slug: 'nome-social',
    title: 'Nome social em serviços públicos e privados',
    category: 'Identidade',
    summary:
      'Entenda onde solicitar o uso do nome social e como agir quando uma instituição se recusa a respeitar sua identidade.',
    content:
      'Pessoas trans, travestis e não-binárias podem solicitar o uso do nome social em serviços públicos, instituições de ensino, unidades de saúde e muitos ambientes privados. O atendimento deve respeitar o nome informado pela pessoa, sem exposição desnecessária do nome civil.',
    actions: [
      'Solicite formalmente o uso do nome social no cadastro da instituição.',
      'Guarde protocolos, e-mails ou prints caso haja recusa.',
      'Em serviço público, registre reclamação na ouvidoria do órgão.',
      'Em caso de constrangimento, procure Defensoria Pública, Ministério Público ou canal de direitos humanos.',
    ],
    contacts: ['Disque 100', 'Defensoria Pública do seu estado', 'Ouvidoria do SUS ou da instituição'],
    tags: ['nome social', 'trans', 'documentos', 'atendimento'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-retificacao',
    slug: 'retificacao-registro-civil',
    title: 'Retificação de nome e gênero no registro civil',
    category: 'Identidade',
    summary:
      'Passo inicial para alterar prenome e gênero diretamente no cartório, sem necessidade de cirurgia ou decisão judicial em regra.',
    content:
      'A retificação de nome e marcador de gênero pode ser feita em cartório por pessoas trans maiores de idade, conforme entendimento consolidado pelo STF e normas do CNJ. O cartório pode exigir documentos pessoais e certidões, mas não pode exigir cirurgia, laudo médico ou autorização judicial como regra geral.',
    actions: [
      'Procure um cartório de registro civil e peça a lista atualizada de documentos.',
      'Separe RG, CPF, certidão de nascimento/casamento e certidões exigidas.',
      'Pergunte sobre gratuidade se não puder arcar com custos.',
      'Em caso de negativa indevida, procure Defensoria Pública.',
    ],
    contacts: ['Cartório de Registro Civil', 'Defensoria Pública', 'CNJ - Justiça Aberta'],
    tags: ['retificação', 'cartório', 'nome', 'gênero'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-casamento',
    slug: 'casamento-igualitario-uniao-estavel',
    title: 'Casamento igualitário e união estável',
    category: 'Família',
    summary:
      'Casais homoafetivos podem casar, registrar união estável, converter união em casamento e acessar direitos familiares.',
    content:
      'O casamento civil e a união estável entre pessoas do mesmo gênero são reconhecidos no Brasil. Cartórios não devem recusar habilitação de casamento ou conversão de união estável por orientação sexual dos noivos.',
    actions: [
      'Procure o cartório com documentos pessoais e comprovante de residência.',
      'Se houver recusa, peça a negativa por escrito.',
      'Acione a Corregedoria do Tribunal de Justiça do estado ou a Defensoria Pública.',
      'Guarde comprovantes de atendimento.',
    ],
    contacts: ['Cartório de Registro Civil', 'Defensoria Pública', 'Corregedoria do TJ estadual'],
    tags: ['casamento', 'união estável', 'família', 'cartório'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-saude-trans',
    slug: 'saude-trans-sus',
    title: 'Saúde trans no SUS',
    category: 'Saúde',
    summary:
      'Orientações sobre atendimento respeitoso, nome social, hormonização e acesso à rede de cuidado integral.',
    content:
      'O SUS deve atender pessoas LGBTQIA+ com respeito, sigilo e uso do nome social. Serviços de saúde trans podem incluir acolhimento multiprofissional, acompanhamento hormonal e encaminhamentos conforme a rede disponível em cada estado.',
    actions: [
      'Atualize seu cadastro do SUS com nome social, quando desejar.',
      'Peça encaminhamento na UBS ou procure serviço especializado do seu estado.',
      'Registre reclamação na Ouvidoria do SUS se houver discriminação.',
      'Em urgência de saúde mental, procure CAPS, UPA ou CVV 188.',
    ],
    contacts: ['Disque Saúde 136', 'Ouvidoria do SUS', 'CVV 188'],
    tags: ['SUS', 'saúde trans', 'hormonização', 'nome social'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-lgbtfobia',
    slug: 'denuncia-lgbtfobia',
    title: 'Como denunciar LGBTfobia',
    category: 'Violência',
    summary:
      'O que registrar, onde denunciar e como preservar provas em casos de agressão, ameaça ou discriminação.',
    content:
      'A LGBTfobia pode ser denunciada em canais de direitos humanos e órgãos de segurança. É importante preservar provas, anotar dados de testemunhas e buscar apoio jurídico quando possível.',
    actions: [
      'Em risco imediato, ligue 190.',
      'Registre boletim de ocorrência e peça número de protocolo.',
      'Guarde prints, áudios, vídeos, laudos, fotos e nomes de testemunhas.',
      'Denuncie também pelo Disque 100 quando houver violação de direitos humanos.',
    ],
    contacts: ['190 - Polícia Militar', 'Disque 100', 'Defensoria Pública', 'Ministério Público'],
    tags: ['denúncia', 'violência', 'LGBTfobia', 'boletim de ocorrência'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-trabalho',
    slug: 'discriminacao-no-trabalho',
    title: 'Discriminação no trabalho',
    category: 'Trabalho',
    summary:
      'Caminhos para lidar com assédio, recusa de nome social, demissão discriminatória e ambiente hostil.',
    content:
      'Assédio, piadas, exposição indevida, recusa de nome social e demissão motivada por orientação sexual ou identidade de gênero podem gerar responsabilização trabalhista e civil.',
    actions: [
      'Registre datas, mensagens, testemunhas e episódios de assédio.',
      'Comunique RH, chefia ou canal de integridade quando houver segurança.',
      'Procure sindicato, advogado trabalhista ou Defensoria Pública.',
      'Em empresas maiores, use canais formais de denúncia.',
    ],
    contacts: ['Ministério Público do Trabalho', 'Defensoria Pública', 'Sindicato da categoria'],
    tags: ['trabalho', 'assédio', 'nome social', 'demissão'],
    priority: 'media',
    status: 'published',
  },
];
