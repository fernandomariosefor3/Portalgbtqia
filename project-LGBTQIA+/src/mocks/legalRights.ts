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
    title: 'Casamento igualitário',
    category: 'Relacionamentos',
    summary:
      'Documentos, passo a passo no cartório, certidão, separação e divórcio para casais LGBTQIA+.',
    content:
      'O casamento civil entre pessoas do mesmo gênero é reconhecido no Brasil. Cartórios não devem recusar habilitação, celebração ou conversão de união estável em casamento por orientação sexual dos noivos.',
    documents: [
      'RG e CPF dos noivos.',
      'Certidão de nascimento atualizada ou certidão de casamento com averbação de divórcio, quando houver.',
      'Comprovante de residência.',
      'Dados de duas testemunhas maiores de idade.',
      'Pacto antenupcial, se o regime escolhido exigir.',
    ],
    actions: [
      'Escolha o cartório de registro civil e peça a habilitação de casamento.',
      'Entregue documentos, escolha regime de bens e informe testemunhas.',
      'Acompanhe o prazo de habilitação e agende a celebração.',
      'Depois da celebração, solicite a certidão de casamento.',
      'Em separação ou divórcio, busque cartório ou Judiciário conforme haja consenso, filhos menores ou bens.',
    ],
    subtopics: ['Documentos necessários', 'Passo a passo no cartório', 'Modelo de certidão', 'Separação e divórcio'],
    contacts: ['Cartório de Registro Civil', 'Defensoria Pública', 'Corregedoria do TJ estadual'],
    tags: ['casamento', 'certidão', 'cartório', 'divórcio'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-uniao-estavel',
    slug: 'uniao-estavel-homoafetiva',
    title: 'União estável homoafetiva',
    category: 'Relacionamentos',
    summary:
      'Como formalizar união estável, converter em casamento e proteger direitos patrimoniais e familiares.',
    content:
      'A união estável homoafetiva possui reconhecimento jurídico e pode ser formalizada por escritura pública ou contrato particular. O documento ajuda em benefícios, planos de saúde, herança, previdência e tomada de decisões familiares.',
    documents: [
      'Documentos pessoais do casal.',
      'Comprovante de residência.',
      'Informações sobre regime de bens desejado.',
      'Documentos de filhos, bens ou dependentes, se houver.',
    ],
    actions: [
      'Procure cartório de notas para escritura pública ou advogado para contrato particular.',
      'Defina regime de bens e data de início da convivência.',
      'Guarde cópias digitais e físicas da escritura ou contrato.',
      'Para converter em casamento, consulte o cartório de registro civil.',
    ],
    subtopics: ['Escritura pública', 'Contrato particular', 'Conversão em casamento', 'Direitos patrimoniais'],
    contacts: ['Cartório de Notas', 'Defensoria Pública', 'Advogado de família'],
    tags: ['união estável', 'família', 'cartório', 'benefícios'],
    priority: 'media',
    status: 'published',
  },
  {
    id: 'legal-adocao-reproducao',
    slug: 'adocao-reproducao-assistida',
    title: 'Adoção e reprodução assistida',
    category: 'Relacionamentos',
    summary:
      'Direitos de famílias homoafetivas em adoção, filiação, reprodução assistida e registro civil.',
    content:
      'Casais LGBTQIA+ podem adotar e buscar reprodução assistida conforme regras aplicáveis. A análise deve considerar o melhor interesse da criança, não a orientação sexual ou identidade de gênero dos responsáveis.',
    documents: [
      'Documentos pessoais e comprovante de residência.',
      'Comprovantes de renda e certidões exigidas pela Vara da Infância.',
      'Laudos, formulários e documentos médicos em reprodução assistida.',
      'Documentos para registro da criança, quando aplicável.',
    ],
    actions: [
      'Procure a Vara da Infância e Juventude para habilitação à adoção.',
      'Participe das etapas psicossociais e cursos preparatórios exigidos.',
      'Em reprodução assistida, consulte clínica habilitada e regras do CFM.',
      'Para registro civil, verifique documentos exigidos pelo cartório.',
    ],
    subtopics: ['Habilitação para adoção', 'Filiação multiparental', 'Reprodução assistida', 'Registro civil'],
    contacts: ['Vara da Infância e Juventude', 'Defensoria Pública', 'Cartório de Registro Civil'],
    tags: ['adoção', 'reprodução assistida', 'família homoafetiva', 'filiação'],
    priority: 'media',
    status: 'published',
  },
  {
    id: 'legal-nome-social',
    slug: 'nome-social',
    title: 'Nome social em serviços públicos e privados',
    category: 'Identidade',
    summary:
      'Entenda onde solicitar o uso do nome social e como agir quando uma instituição se recusa a respeitar sua identidade.',
    content:
      'Pessoas trans, travestis e não-binárias podem solicitar o uso do nome social em serviços públicos, instituições de ensino, unidades de saúde e muitos ambientes privados. O atendimento deve respeitar o nome informado pela pessoa, sem exposição desnecessária do nome civil.',
    documents: [
      'Documento oficial com foto.',
      'CPF ou Cartão Nacional de Saúde, quando for no SUS.',
      'Requerimento simples da instituição, quando existir.',
      'Comprovantes de protocolo em caso de recusa.',
    ],
    actions: [
      'Solicite formalmente o uso do nome social no cadastro da instituição.',
      'Guarde protocolos, e-mails ou prints caso haja recusa.',
      'Em serviço público, registre reclamação na ouvidoria do órgão.',
      'Em caso de constrangimento, procure Defensoria Pública, Ministério Público ou canal de direitos humanos.',
    ],
    subtopics: ['No trabalho (CLT)', 'Na escola/universidade', 'No SUS', 'Na CNH'],
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
    documents: [
      'Certidão de nascimento ou casamento atualizada.',
      'RG, CPF, título de eleitor e comprovante de residência.',
      'Certidões cíveis, criminais, eleitorais, trabalhistas e militares quando exigidas.',
      'Requerimento assinado ao cartório.',
    ],
    actions: [
      'Procure um cartório de registro civil e peça a lista atualizada de documentos.',
      'Separe RG, CPF, certidão de nascimento/casamento e certidões exigidas.',
      'Pergunte sobre gratuidade se não puder arcar com custos.',
      'Em caso de negativa indevida, procure Defensoria Pública.',
    ],
    subtopics: ['Cartório sem cirurgia ou laudo médico', 'Documentos necessários', 'Custos e tempo médio', 'Como agir diante de negativa'],
    downloads: [
      {
        label: 'Modelo de requerimento',
        filename: 'modelo-retificacao-registro-civil.txt',
        body:
          'AO CARTÓRIO DE REGISTRO CIVIL\n\nEu, [nome civil], CPF [número], venho requerer a retificação de prenome e marcador de gênero para [nome escolhido] e [gênero], com fundamento no direito à identidade de gênero e nas normas aplicáveis.\n\nDeclaro ciência dos efeitos do pedido e solicito a atualização dos registros pertinentes.\n\n[ cidade ], [ data ]\n\nAssinatura: __________________________',
      },
    ],
    averageTime: 'Em geral, varia conforme cartório e documentação; consulte o prazo local.',
    costs: 'Pode haver custas cartorárias. Pessoas sem condições financeiras podem perguntar sobre gratuidade.',
    contacts: ['Cartório de Registro Civil', 'Defensoria Pública', 'CNJ - Justiça Aberta'],
    tags: ['retificação', 'cartório', 'nome', 'gênero'],
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
    documents: ['Cartão SUS', 'Documento oficial', 'Exames e relatórios anteriores, se houver', 'Encaminhamento da UBS, quando solicitado'],
    actions: [
      'Atualize seu cadastro do SUS com nome social, quando desejar.',
      'Peça encaminhamento na UBS ou procure serviço especializado do seu estado.',
      'Registre reclamação na Ouvidoria do SUS se houver discriminação.',
      'Em urgência de saúde mental, procure CAPS, UPA ou CVV 188.',
    ],
    subtopics: ['Hormonização', 'Cirurgias pelo SUS', 'Ambulatório trans', 'Nome social no atendimento'],
    contacts: ['Disque Saúde 136', 'Ouvidoria do SUS', 'CVV 188'],
    tags: ['SUS', 'saúde trans', 'hormonização', 'nome social'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-prep-pep',
    slug: 'prep-pep-ist',
    title: 'PrEP, PEP, testagem e tratamento de ISTs',
    category: 'Saúde',
    summary:
      'Como acessar prevenção combinada, PEP em até 72h, testagem rápida e tratamento pelo SUS.',
    content:
      'PrEP, PEP, preservativos, testagem e tratamento de ISTs fazem parte da prevenção combinada. A PEP é urgência e deve ser iniciada o quanto antes após exposição de risco.',
    documents: ['Cartão SUS', 'Documento oficial', 'Informações sobre exposição de risco para avaliação de PEP'],
    actions: [
      'Para PEP, procure serviço de urgência imediatamente, preferencialmente nas primeiras horas.',
      'Para PrEP, busque SAE/CTA ou serviço indicado pela rede municipal.',
      'Faça testagem periódica de HIV, sífilis, hepatites e outras ISTs.',
      'Siga acompanhamento e tratamento indicados por profissional de saúde.',
    ],
    subtopics: ['PrEP', 'PEP', 'Testagem rápida', 'Tratamento de ISTs'],
    contacts: ['Disque Saúde 136', 'UBS', 'CTA/SAE municipal', 'UPA em urgência'],
    tags: ['PrEP', 'PEP', 'IST', 'testagem', 'SUS'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-saude-mental',
    slug: 'saude-mental-lgbtqia',
    title: 'Saúde mental LGBTQIA+',
    category: 'Saúde',
    summary:
      'CAPS, terapia afirmativa, acolhimento em crise e canais de apoio para sofrimento psíquico.',
    content:
      'Sofrimento mental pode ser agravado por rejeição, violência, discriminação e isolamento. O cuidado deve ser afirmativo, sem patologizar identidade de gênero ou orientação sexual.',
    actions: [
      'Procure UBS, CAPS, serviço universitário ou psicólogo afirmativo.',
      'Em crise, busque UPA, emergência ou CAPS de referência.',
      'Para escuta emocional, acione CVV 188.',
      'Registre discriminação em serviço de saúde na ouvidoria.',
    ],
    subtopics: ['CAPS', 'Terapia afirmativa', 'Crise emocional', 'Rede de apoio'],
    contacts: ['CVV 188', 'CAPS municipal', 'Ouvidoria do SUS'],
    tags: ['saúde mental', 'CAPS', 'terapia', 'acolhimento'],
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
    subtopics: ['Disque 100, 180 e 190', 'Crimes de ódio', 'Provas digitais', 'Medidas de proteção'],
    contacts: ['190 - Polícia Militar', 'Disque 100', 'Defensoria Pública', 'Ministério Público'],
    tags: ['denúncia', 'violência', 'LGBTfobia', 'boletim de ocorrência'],
    priority: 'alta',
    status: 'published',
  },
  {
    id: 'legal-maria-penha',
    slug: 'violencia-domestica-maria-da-penha',
    title: 'Violência doméstica e Lei Maria da Penha',
    category: 'Violência',
    summary:
      'Orientações iniciais para situações de violência doméstica, medidas protetivas e canais de denúncia.',
    content:
      'A proteção contra violência doméstica pode alcançar relações familiares, afetivas e domésticas. Mulheres cis e trans podem buscar medidas protetivas quando houver ameaça, agressão, perseguição ou controle.',
    actions: [
      'Em risco imediato, ligue 190.',
      'Procure Delegacia da Mulher ou delegacia comum para registrar ocorrência.',
      'Peça avaliação de medidas protetivas de urgência.',
      'Busque Defensoria Pública, rede de acolhimento ou serviço social.',
    ],
    subtopics: ['Medidas protetivas', 'Delegacia da Mulher', 'Violência psicológica', 'Rede de acolhimento'],
    contacts: ['190 - Polícia Militar', '180 - Central de Atendimento à Mulher', 'Defensoria Pública'],
    tags: ['Maria da Penha', 'violência doméstica', 'medida protetiva'],
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
    documents: ['Contrato, holerites ou registros de vínculo', 'Mensagens, e-mails e prints', 'Nomes de testemunhas', 'Comunicados de RH ou advertências'],
    actions: [
      'Registre datas, mensagens, testemunhas e episódios de assédio.',
      'Comunique RH, chefia ou canal de integridade quando houver segurança.',
      'Procure sindicato, advogado trabalhista ou Defensoria Pública.',
      'Em empresas maiores, use canais formais de denúncia.',
    ],
    subtopics: ['CLT', 'Dispensa discriminatória', 'Nome social no trabalho', 'Como processar'],
    contacts: ['Ministério Público do Trabalho', 'Defensoria Pública', 'Sindicato da categoria'],
    tags: ['trabalho', 'assédio', 'nome social', 'demissão'],
    priority: 'media',
    status: 'published',
  },
  {
    id: 'legal-educacao',
    slug: 'nome-social-bullying-educacao',
    title: 'Nome social, bullying e denúncia na educação',
    category: 'Educação',
    summary:
      'Direitos na escola, universidade, CAADE/CAAE, combate ao bullying e canais de denúncia.',
    content:
      'Instituições de ensino devem respeitar identidade de gênero, nome social e segurança de estudantes LGBTQIA+. Situações de bullying, humilhação pública ou exclusão devem ser registradas e comunicadas formalmente.',
    documents: ['Documento do estudante', 'Requerimento de nome social', 'Prints, mensagens ou relatos de bullying', 'Protocolos enviados à instituição'],
    actions: [
      'Solicite nome social na secretaria ou sistema acadêmico.',
      'Registre bullying por escrito com datas, locais e testemunhas.',
      'Acione coordenação, ouvidoria, conselho tutelar ou Ministério Público conforme o caso.',
      'Em universidade, procure comissão de diversidade, assistência estudantil ou CAADE/órgão equivalente.',
    ],
    subtopics: ['Nome social na escola', 'Bullying', 'Como denunciar', 'CAADE nas universidades'],
    contacts: ['Ouvidoria da instituição', 'Conselho Tutelar', 'Ministério Público', 'Defensoria Pública'],
    tags: ['educação', 'nome social', 'bullying', 'universidade'],
    priority: 'media',
    status: 'published',
  },
];
