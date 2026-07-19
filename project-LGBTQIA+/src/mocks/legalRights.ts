export type LegalGuideCategory =
  | 'Identidade'
  | 'Relacionamentos'
  | 'Saúde'
  | 'Trabalho'
  | 'Educação'
  | 'Violência'
  | 'Serviços';

export interface LegalGuideDownload {
  label: string;
  filename: string;
  body: string;
}

export interface LegalGuide {
  id: string;
  slug: string;
  title: string;
  category: LegalGuideCategory;
  summary: string;
  content: string;
  actions: string[];
  documents?: string[];
  subtopics?: string[];
  downloads?: LegalGuideDownload[];
  averageTime?: string;
  costs?: string;
  contacts: string[];
  tags: string[];
  priority: 'alta' | 'media' | 'baixa';
  status: 'published' | 'hidden';
  publishedAt?: string;
  reviewedAt?: string;
  readTimeMinutes?: number;
  imageAlt?: string;
}

export const legalCategories: LegalGuideCategory[] = [
  'Identidade',
  'Relacionamentos',
  'Saúde',
  'Trabalho',
  'Educação',
  'Violência',
  'Serviços',
];

export const staticLegalGuides: LegalGuide[] = [
  {
    id: 'legal-casamento',
    slug: 'casamento-igualitario',
    title: 'Casamento igualitário e união estável',
    category: 'Relacionamentos',
    summary: 'Informações gerais sobre o reconhecimento jurídico do casamento civil entre pessoas do mesmo gênero, formalização em cartório e proteção de direitos patrimoniais.',
    content: 'O casamento civil homoafetivo é assegurado por entendimento consolidado do STF e do CNJ, com os mesmos efeitos do casamento heterossexual. Os cartórios devem realizar a habilitação, a celebração e a conversão de união estável. Note que procedimentos administrativos podem ter variações locais em prazos ou custas.',
    documents: [
      'RG e CPF dos interessados.',
      'Certidão de nascimento atualizada (ou de casamento com averbação de divórcio).',
      'Comprovante de residência.',
      'Dados de testemunhas maiores de idade.',
    ],
    actions: [
      'Escolha o cartório de registro civil e solicite a habilitação.',
      'Defina o regime de bens (pode exigir pacto antenupcial).',
      'Aguarde o prazo legal de habilitação e agende a cerimônia.',
      'Se necessário, procure a Defensoria Pública para orientações sobre divórcio ou gratuidade.',
    ],
    subtopics: ['Documentos necessários', 'Conversão de união estável', 'Pacto antenupcial', 'Gratuidade'],
    contacts: ['Cartório de Registro Civil', 'Defensoria Pública', 'Corregedoria do TJ'],
    tags: ['casamento', 'cartório', 'direitos civis', 'união estável'],
    priority: 'alta',
    status: 'published',
    publishedAt: '2025-05-10',
    reviewedAt: '2026-07-19',
    readTimeMinutes: 5,
    imageAlt: 'Documento legal com alianças',
  },
  {
    id: 'legal-uniao-estavel',
    slug: 'uniao-estavel-homoafetiva',
    title: 'União estável homoafetiva',
    category: 'Relacionamentos',
    summary: 'Como formalizar união estável, converter em casamento e proteger direitos patrimoniais e familiares.',
    content: 'A união estável homoafetiva possui reconhecimento jurídico e pode ser formalizada por escritura pública ou contrato particular.',
    documents: ['Documentos pessoais do casal.', 'Comprovante de residência.'],
    actions: ['Procure cartório de notas.', 'Defina regime de bens.'],
    contacts: ['Cartório de Notas', 'Defensoria Pública'],
    tags: ['união estável', 'família', 'cartório'],
    priority: 'media',
    status: 'published',
  },
  {
    id: 'legal-adocao-reproducao',
    slug: 'adocao-reproducao-assistida',
    title: 'Adoção e reprodução assistida',
    category: 'Relacionamentos',
    summary: 'Direitos de famílias homoafetivas em adoção, filiação, reprodução assistida e registro civil.',
    content: 'Casais LGBTQIA+ podem adotar e buscar reprodução assistida conforme regras aplicáveis.',
    documents: ['Documentos pessoais e comprovante de residência.'],
    actions: ['Procure a Vara da Infância e Juventude para habilitação.'],
    contacts: ['Vara da Infância e Juventude', 'Defensoria Pública'],
    tags: ['adoção', 'família homoafetiva', 'filiação'],
    priority: 'media',
    status: 'published',
  },
  {
    id: 'legal-nome-social',
    slug: 'nome-social',
    title: 'Nome social em serviços públicos e privados',
    category: 'Identidade',
    summary: 'Entenda onde solicitar o uso do nome social e como agir quando uma instituição se recusa a respeitar sua identidade.',
    content: 'Pessoas trans, travestis e não-binárias podem solicitar o uso do nome social em serviços.',
    documents: ['Documento oficial com foto.'],
    actions: ['Solicite formalmente o uso do nome social.'],
    contacts: ['Defensoria Pública'],
    tags: ['nome social', 'trans', 'atendimento'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-retificacao',
    slug: 'retificacao-registro-civil',
    title: 'Retificação de nome e gênero no registro civil',
    category: 'Identidade',
    summary: 'Guia com informações gerais sobre como solicitar a alteração de prenome e gênero diretamente em cartório, sem exigência legal de cirurgia.',
    content: 'A alteração de nome e gênero diretamente em cartório é garantida pelo STF (ação judicial) e regulamentada pelo CNJ (procedimento administrativo). A emissão das certidões negativas pode variar por estado, mas a exigência de laudos médicos ou cirúrgicos é vedada. Lembramos que o resultado não é automático e depende da regularidade da documentação.',
    documents: [
      'Certidão de nascimento ou casamento atualizada.',
      'RG, CPF, título de eleitor e comprovante de residência.',
      'Certidões cíveis, criminais, eleitorais e militares (lista varia no cartório).',
      'Requerimento formal assinado no local.',
    ],
    actions: [
      'Consulte o cartório de registro civil mais próximo para obter a lista exata de certidões.',
      'Reúna todas as certidões negativas solicitadas (muitas podem ser emitidas online).',
      'Apresente o requerimento. Caso não tenha condições de pagar, solicite a gratuidade.',
      'Em caso de recusa arbitrária, busque orientação na Defensoria Pública.',
    ],
    subtopics: ['Procedimento administrativo CNJ', 'Gratuidade', 'Certidões negativas'],
    contacts: ['Cartório de Registro Civil', 'Defensoria Pública', 'Corregedoria do CNJ'],
    tags: ['retificação', 'nome', 'gênero', 'documentos', 'cartório'],
    priority: 'alta',
    status: 'published',
    publishedAt: '2025-06-15',
    reviewedAt: '2026-07-19',
    readTimeMinutes: 7,
    imageAlt: 'Documentos e carimbos de cartório',
  },
  {
    id: 'legal-saude-trans',
    slug: 'saude-trans-sus',
    title: 'Saúde trans no SUS: diretrizes de acesso',
    category: 'Saúde',
    summary: 'Informações gerais sobre o direito ao atendimento afirmativo no Sistema Único de Saúde, abrangendo respeito ao nome social e procedimentos.',
    content: 'O SUS garante atendimento baseado na Política Nacional de Saúde Integral LGBT. O processo transexualizador é um conjunto de procedimentos administrativos e médicos. Vale notar que a disponibilidade de ambulatórios especializados e o tempo de espera variam muito de acordo com o município e a gestão estadual.',
    documents: ['Cartão do SUS (que pode ter o nome social incluído).', 'Documento de identificação.'],
    actions: [
      'Solicite a atualização do seu Cartão SUS com seu nome social em uma UBS.',
      'Peça informações na UBS sobre o fluxo para acesso ao ambulatório trans na sua região.',
      'Caso haja recusa ou constrangimento, registre o ocorrido nos canais formais da Ouvidoria.',
    ],
    subtopics: ['Uso do nome social', 'Ambulatórios especializados', 'Ouvidoria'],
    contacts: ['Disque Saúde 136', 'Ouvidoria do SUS', 'Defensoria Pública'],
    tags: ['SUS', 'saúde trans', 'direitos na saúde', 'nome social'],
    priority: 'alta',
    status: 'published',
    publishedAt: '2025-08-20',
    reviewedAt: '2026-07-19',
    readTimeMinutes: 6,
    imageAlt: 'Símbolos da saúde pública com ícone da bandeira trans',
  },
  {
    id: 'legal-prep-pep',
    slug: 'prep-pep-ist',
    title: 'PrEP, PEP, testagem e tratamento de ISTs',
    category: 'Saúde',
    summary: 'Como acessar prevenção combinada, PEP em até 72h, testagem rápida e tratamento pelo SUS.',
    content: 'PrEP, PEP, preservativos, testagem e tratamento de ISTs fazem parte da prevenção combinada.',
    actions: ['Para PEP, procure serviço de urgência.'],
    contacts: ['Disque Saúde 136', 'UBS'],
    tags: ['PrEP', 'PEP', 'SUS'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-saude-mental',
    slug: 'saude-mental-lgbtqia',
    title: 'Saúde mental LGBTQIA+',
    category: 'Saúde',
    summary: 'CAPS, terapia afirmativa, acolhimento em crise e canais de apoio para sofrimento psíquico.',
    content: 'Sofrimento mental pode ser agravado por rejeição, violência, discriminação e isolamento.',
    actions: ['Procure UBS ou CAPS.'],
    contacts: ['CVV 188'],
    tags: ['saúde mental', 'CAPS'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-lgbtfobia',
    slug: 'denuncia-lgbtfobia',
    title: 'Como denunciar crimes de LGBTfobia',
    category: 'Violência',
    summary: 'Caminhos e orientações gerais sobre como registrar episódios de violência física ou discriminação decorrentes de homotransfobia.',
    content: 'O STF equiparou a discriminação por orientação sexual e identidade de gênero ao crime de racismo (entendimento judicial). Em nível administrativo, muitos estados têm leis que punem estabelecimentos. É fundamental coletar evidências e não reagir de forma que comprometa a própria segurança.',
    actions: [
      'Se a agressão estiver acontecendo, chame a Polícia Militar (190).',
      'Reúna testemunhas, anote contatos e preserve áudios, vídeos e mensagens sem apagar o contexto.',
      'Registre um Boletim de Ocorrência (muitos estados permitem fazer pela internet).',
      'Faça também a denúncia no Disque 100 para órgãos de direitos humanos.',
    ],
    subtopics: ['Coleta de evidências', 'Registro de B.O.', 'Disque 100', 'Legislação estadual administrativa'],
    contacts: ['Polícia Militar (190)', 'Disque 100', 'Ministério Público Estadual', 'Defensoria Pública'],
    tags: ['LGBTfobia', 'denúncia', 'violência', 'direitos', 'justiça'],
    priority: 'alta',
    status: 'published',
    publishedAt: '2025-09-01',
    reviewedAt: '2026-07-19',
    readTimeMinutes: 5,
    imageAlt: 'Telefone e caderno de anotações simbolizando denúncia',
  },
  {
    id: 'legal-maria-penha',
    slug: 'violencia-domestica-maria-da-penha',
    title: 'Violência doméstica e Lei Maria da Penha',
    category: 'Violência',
    summary: 'Orientações iniciais para situações de violência doméstica, medidas protetivas e canais de denúncia.',
    content: 'A proteção contra violência doméstica pode alcançar relações familiares, afetivas e domésticas.',
    actions: ['Em risco imediato, ligue 190.'],
    contacts: ['180 - Central de Atendimento à Mulher'],
    tags: ['Maria da Penha', 'violência doméstica'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-trabalho',
    slug: 'discriminacao-no-trabalho',
    title: 'Enfrentamento à discriminação no ambiente de trabalho',
    category: 'Trabalho',
    summary: 'Informações gerais para profissionais que enfrentam assédio, recusa de nome social ou demissões discriminatórias devido a preconceito laboral.',
    content: 'A lei trabalhista e a Constituição protegem os trabalhadores contra práticas discriminatórias. O ambiente corporativo deve ser seguro e respeitar identidades de gênero e orientação sexual. No entanto, comprovar o assédio moral ou dispensa discriminatória exige robustez de evidências.',
    documents: [
      'Contratos, e-mails e registros de produtividade para demonstrar competência técnica.',
      'Prints e mensagens (sempre com registro do contexto completo e atas notariais, se possível).',
      'Identificação de testemunhas oculares.',
    ],
    actions: [
      'Acione primeiro, caso seja seguro, o canal de integridade interna ou ouvidoria da empresa.',
      'Reúna provas silenciosamente e anote datas, falas e comportamentos do assediador.',
      'Busque orientação com advogados especializados ou Sindicato para avaliar o ajuizamento de ação.',
      'Denúncias coletivas podem ser levadas ao Ministério Público do Trabalho.',
    ],
    subtopics: ['Assédio moral', 'Canal de denúncia', 'Ministério Público do Trabalho'],
    contacts: ['Ministério Público do Trabalho (MPT)', 'Sindicatos', 'Defensoria Pública da União'],
    tags: ['trabalho', 'assédio moral', 'direitos trabalhistas', 'discriminação'],
    priority: 'media',
    status: 'published',
    publishedAt: '2025-10-10',
    reviewedAt: '2026-07-19',
    readTimeMinutes: 8,
    imageAlt: 'Mesa de escritório com documentos e computador',
  },
  {
    id: 'legal-educacao',
    slug: 'nome-social-bullying-educacao',
    title: 'Nome social, bullying e denúncia na educação',
    category: 'Educação',
    summary: 'Direitos na escola, universidade, CAADE/CAAE, combate ao bullying e canais de denúncia.',
    content: 'Instituições de ensino devem respeitar identidade de gênero, nome social e segurança de estudantes LGBTQIA+.',
    actions: ['Solicite nome social na secretaria.'],
    contacts: ['Ouvidoria da instituição'],
    tags: ['educação', 'nome social'],
    priority: 'media',
    status: 'published',
  }
];
