export interface HealthGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'prep-pep' | 'saude-mental' | 'saude-trans' | 'educacao-sexual';
  subcategory?: string;
  image: string;
  author: string;
  authorPhoto: string;
  authorBio: string;
  readTime: number;
  views: number;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  sources?: string[];
  faqs?: { question: string; answer: string }[];
}

export const categoryLabels: Record<HealthGuide['category'], string> = {
  'prep-pep': 'PrEP/PEP',
  'saude-mental': 'Saúde Mental',
  'saude-trans': 'Saúde Trans',
  'educacao-sexual': 'Educação Sexual',
};

export const categoryColors: Record<HealthGuide['category'], string> = {
  'prep-pep': 'bg-accent-100 text-accent-600',
  'saude-mental': 'bg-primary-100 text-primary-600',
  'saude-trans': 'bg-secondary-100 text-secondary-600',
  'educacao-sexual': 'bg-dark-100 text-dark-600',
};

export const categoryIcons: Record<HealthGuide['category'], string> = {
  'prep-pep': 'ri-capsule-line',
  'saude-mental': 'ri-mental-health-line',
  'saude-trans': 'ri-user-heart-line',
  'educacao-sexual': 'ri-heart-pulse-line',
};

export const categoryDescriptions: Record<HealthGuide['category'], string> = {
  'prep-pep': 'Profilaxia Pré-Exposição e Pós-Exposição: como acessar pelo SUS, eficácia, efeitos colaterais e tudo que você precisa saber.',
  'saude-mental': 'Acolhimento psicológico, terapia afirmativa, enfrentamento do estigma e cuidado emocional para pessoas LGBTQ+.',
  'saude-trans': 'Hormonioterapia, cirurgias de redesignação, cuidados multiprofissionais e direitos no sistema de saúde.',
  'educacao-sexual': 'Prevenção de ISTs, consentimento, saúde sexual e informação baseada em evidências para a comunidade.',
};

export const allHealthGuides: HealthGuide[] = [
  {
    id: 'h1',
    slug: 'prep-tudo-que-voce-precisa-saber',
    title: 'PrEP: Tudo Que Você Precisa Saber Antes de Começar',
    excerpt: 'A Profilaxia Pré-Exposição (PrEP) é uma das ferramentas mais eficazes na prevenção do HIV. Saiba como funciona, quem pode usar, como acessar pelo SUS e os cuidados necessários.',
    content: `<p>A <strong>Profilaxia Pré-Exposição (PrEP)</strong> é uma estratégia de prevenção do HIV que consiste no uso de medicamentos antirretrovirais por pessoas que não têm HIV, mas estão em situação de maior vulnerabilidade à infecção. Quando tomada corretamente, a PrEP reduz em até <strong>99% o risco de transmissão sexual do HIV</strong>.</p>

<h3>Como Funciona a PrEP?</h3>
<p>A PrEP utiliza o medicamento <strong>tenofovir + emtricitabina</strong>, que impede que o vírus do HIV se estabeleça no organismo caso haja uma exposição. O medicamento precisa estar presente no sangue de forma constante para garantir a proteção, por isso a adesão diária é fundamental.</p>

<h3>Quem Pode Usar?</h3>
<p>A PrEP é indicada para pessoas que não têm HIV e que se enquadram em alguma das situações de vulnerabilidade definidas pelo Ministério da Saúde:</p>
<ul>
<li>Homens que fazem sexo com homens (HSH) e travestis e mulheres trans em situação de vulnerabilidade</li>
<li>Pessoas que fazem uso de drogas e compartilham seringas</li>
<li>Pessoas que têm parceiro fixo com HIV (discordância sorológica)</li>
<li>Trabalhadores do sexo</li>
<li>Pessoas que buscam atendimento por ISTs de forma repetida</li>
</ul>

<h3>Como Acessar Pelo SUS?</h3>
<p>Desde 2018, a PrEP está disponível gratuitamente pelo SUS. O acesso se dá em unidades de saúde credenciadas, geralmente centros de testagem e aconselhamento (CTAs) e ambulatórios de DST/AIDS. O processo envolve:</p>
<ol>
<li><strong>Avaliação de elegibilidade:</strong> entrevista com profissional de saúde para verificar situação de vulnerabilidade</li>
<li><strong>Testagem:</strong> teste rápido de HIV, sífilis e hepatites B e C</li>
<li><strong>Avaliação renal:</strong> exame de creatinina para verificar função dos rins</li>
<li><strong>Prescrição:</strong> se elegível, receita de 30 dias com renovação a cada 3 meses</li>
</ol>

<h3>Efeitos Colaterais</h3>
<p>Os efeitos colaterais mais comuns são leves e costumam desaparecer nas primeiras semanas:</p>
<ul>
<li>Náuseas e mal-estar gastrointestinal</li>
<li>Dor de cabeça</li>
<li>Fadiga</li>
</ul>
<p>Raramente pode haver redução da densidade óssea ou problemas renais, por isso o acompanhamento médico é obrigatório a cada 3 meses.</p>

<h3>Adesão é Tudo</h3>
<p>Para a PrEP funcionar, é preciso tomar o comprimido todos os dias, sempre no mesmo horário. Esquecer doses reduz a proteção. Se esquecer uma dose, tome assim que lembrar. Se esquecer mais de dois dias seguidos, use camisinha até retomar a adesão por 7 dias consecutivos.</p>

<h3>PrEP Não Previne Outras ISTs</h3>
<p>É fundamental reforçar: <strong>a PrEP protege apenas contra o HIV</strong>. Ela não previne sífilis, gonorreia, clamídia, hepatite e outras infecções. Por isso, o uso de camisinha e a testagem regular continuam essenciais.</p>`,
    category: 'prep-pep',
    image: 'https://readdy.ai/api/search-image?query=close%20up%20of%20daily%20medication%20pills%20on%20clean%20white%20surface%20with%20soft%20natural%20light%20health%20medical%20concept%20minimal%20editorial%20photography%20warm%20tones%20professional%20healthcare%20aesthetic&width=800&height=500&seq=health1&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth1&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por profissionais de saúde.',
    readTime: 12,
    views: 15420,
    publishedAt: '2026-04-15',
    featured: true,
    tags: ['PrEP', 'HIV', 'Prevenção', 'SUS', 'Saúde Sexual'],
    sources: ['Ministério da Saúde - Protocolo Clínico de PrEP', 'WHO Guidelines on PrEP 2024', 'Brasil Sem Homofobia'],
    faqs: [
      { question: 'A PrEP protege contra outras ISTs?', answer: 'Não. A PrEP previne apenas o HIV. Para outras ISTs como sífilis, gonorreia e hepatite, o uso de camisinha e a testagem regular são essenciais.' },
      { question: 'Preciso usar camisinha se estou na PrEP?', answer: 'A PrEP previne HIV, mas não outras ISTs. O uso de camisinha é recomendado para proteção completa, especialmente com parceiros ocasionais.' },
      { question: 'E se eu esquecer de tomar um dia?', answer: 'Tome assim que lembrar. Se esquecer mais de dois dias seguidos, use camisinha por 7 dias após retomar a adesão diária.' },
    ],
  },
  {
    id: 'h2',
    slug: 'pep-emergencia-pos-exposicao',
    title: 'PEP: O Que Fazer em Caso de Exposição ao HIV',
    excerpt: 'A Profilaxia Pós-Exposição (PEP) pode prevenir a infecção pelo HIV se iniciada em até 72 horas após uma exposição de risco. Entenda quando usar, como funciona e onde buscar ajuda.',
    content: `<p>A <strong>Profilaxia Pós-Exposição (PEP)</strong> é um tratamento de emergência para pessoas que podem ter sido expostas ao HIV. Quando iniciada em até <strong>72 horas</strong> após a exposição e tomada corretamente por 28 dias, a PEP reduz drasticamente o risco de infecção.</p>

<h3>Quando Usar a PEP?</h3>
<p>A PEP é indicada em situações de exposição de risco ao HIV, como:</p>
<ul>
<li>Relação sexual desprotegida (sem camisinha) com parceiro de status sorológico desconhecido ou positivo para HIV</li>
<li>Compartilhamento de seringas e agulhas</li>
<li>Exposição ocupacional (acidente com material perfurocortante em profissionais de saúde)</li>
<li>Estupro sexual</li>
</ul>

<h3>Tempo é Fundamental</h3>
<p><strong>Quanto mais cedo, melhor.</strong> A PEP deve ser iniciada o mais rápido possível após a exposição — idealmente nas primeiras 2 horas. Após 72 horas, a PEP não é mais eficaz e não será prescrita. Por isso, busque atendimento imediatamente.</p>

<h3>Onde Buscar Atendimento</h3>
<p>A PEP está disponível em:</p>
<ul>
<li><strong>Pronto-socorros e UPAs 24h</strong> em grandes centros urbanos</li>
<li><strong>Centros de Testagem e Aconselhamento (CTAs)</strong></li>
<li><strong>Ambulatórios de DST/AIDS</strong> de hospitais universitários</li>
<li><strong>Plantões de infectologia</strong> em hospitais de referência</li>
</ul>
<p>Se não souber onde buscar, ligue para o <strong>Disque Saúde 136</strong> ou procure o CTA mais próximo.</p>

<h3>Como Funciona o Tratamento</h3>
<p>A PEP consiste em uma combinação de <strong>três medicamentos antirretrovirais</strong> tomados por 28 dias completos. O esquema mais comum no SUS é:</p>
<ul>
<li>Tenofovir + Lamivudina (TDF/3TC)</li>
<li>Mais Dolutegravir (DTG)</li>
</ul>
<p>Durante o tratamento, é preciso fazer acompanhamento médico com testes de função renal e hepática. Após completar os 28 dias, um teste de HIV é feito para confirmar que não houve infecção.</p>

<h3>Efeitos Colaterais</h3>
<p>A PEP pode causar:</p>
<ul>
<li>Náuseas e vômitos (mais comuns nas primeiras semanas)</li>
<li>Fadiga e tontura</li>
<li>Dor de cabeça</li>
<li>Alteração nos exames de função hepática e renal</li>
</ul>
<p>Esses efeitos costumam ser gerenciáveis e não devem ser motivo para interromper o tratamento sem orientação médica.</p>

<h3>PEP vs. PrEP: Qual a Diferença?</h3>
<table>
<tr><th>PEP</th><th>PrEP</th></tr>
<tr><td>Usada APÓS exposição de risco</td><td>Usada ANTES da exposição</td></tr>
<tr><td>Duração: 28 dias</td><td>Duração: contínua</td></tr>
<tr><td>3 medicamentos</td><td>2 medicamentos</td></tr>
<tr><td>Em situações de emergência</td><td>Para prevenção rotineira</td></tr>
</table>

<h3>Cuidados Durante a PEP</h3>
<p>Durante os 28 dias de PEP e até o resultado final do teste (geralmente 3 meses após a exposição), é essencial:</p>
<ul>
<li>Usar camisinha em todas as relações sexuais</li>
<li>Não doar sangue</li>
<li>Não compartilhar objetos de uso pessoal que possam ter sangue</li>
<li>Comparecer a todas as consultas de acompanhamento</li>
</ul>`,
    category: 'prep-pep',
    image: 'https://readdy.ai/api/search-image?query=emergency%20hospital%20room%20with%20medical%20equipment%20clean%20white%20environment%20professional%20healthcare%20setting%20soft%20natural%20light%20editorial%20photography%20minimal%20aesthetic%20warm%20tones&width=800&height=500&seq=health2&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth2&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por profissionais de saúde.',
    readTime: 10,
    views: 12340,
    publishedAt: '2026-03-20',
    featured: false,
    tags: ['PEP', 'HIV', 'Emergência', 'SUS', 'Saúde Sexual'],
    faqs: [
      { question: 'A PEP funciona se tomar após 72 horas?', answer: 'Não. Após 72 horas, o vírus pode já ter se estabelecido no organismo e a PEP não será eficaz. Nesses casos, o acompanhamento médico será diferente.' },
      { question: 'A PEP é gratuita pelo SUS?', answer: 'Sim. A PEP é fornecida gratuitamente pelo SUS em pronto-socorros, UPAs, CTAs e ambulatórios de referência.' },
      { question: 'Posso parar a PEP antes dos 28 dias?', answer: 'Não recomendado. Interromper antes dos 28 dias reduz a eficácia e pode permitir que o vírus se estabeleça. Sempre converse com seu médico antes de qualquer mudança.' },
    ],
  },
  {
    id: 'h3',
    slug: 'acesso-prep-sus-passo-a-passo',
    title: 'Como Acessar a PrEP pelo SUS: Passo a Passo',
    excerpt: 'Passo a passo prático para conseguir a PrEP gratuitamente no sistema público de saúde, com dicas de documentação, locais de atendimento e o que esperar na consulta.',
    content: `<p>A <strong>PrEP está disponível gratuitamente pelo SUS desde 2018</strong>, mas muitas pessoas ainda têm dificuldade em saber por onde começar. Este guia prático te acompanha do início ao fim do processo.</p>

<h3>Passo 1: Encontre uma Unidade de Referência</h3>
<p>Nem toda UBS oferece PrEP. Você precisa procurar:</p>
<ul>
<li><strong>Centros de Testagem e Aconselhamento (CTAs)</strong> — atendimento especializado em ISTs</li>
<li><strong>Ambulatórios de DST/AIDS</strong> em hospitais de referência</li>
<li><strong>Centros de Referência em Saúde da População LGBTQ+</strong> (onde existem)</li>
</ul>
<p>Dica: Ligue para o <strong>136 (Disque Saúde)</strong> ou busque no site da secretaria de saúde da sua cidade por "CTA" ou "PrEP".</p>

<h3>Passo 2: Leve sua Documentação</h3>
<p>Na primeira consulta, leve:</p>
<ul>
<li>Cartão do SUS (ou CPF para cadastro)</li>
<li>Documento com foto</li>
<li>Comprovante de residência</li>
<li>Exames recentes, se tiver (não é obrigatório, mas agiliza)</li>
</ul>

<h3>Passo 3: A Consulta de Elegibilidade</h3>
<p>O profissional de saúde fará uma entrevista para avaliar se você se enquadra nos critérios de elegibilidade. Não há julgamento — é uma conversa para entender sua situação de vulnerabilidade e oferecer a melhor proteção.</p>
<p>Os critérios incluem:</p>
<ul>
<li>Homens que fazem sexo com homens e travestis/mulheres trans em situação de vulnerabilidade</li>
<li>Pessoas em discordância sorológica com parceiro HIV positivo</li>
<li>Trabalhadores do sexo</li>
<li>Pessoas com histórico de ISTs repetidas</li>
<li>Pessoas que usam drogas e compartilham equipamentos</li>
</ul>

<h3>Passo 4: Testagem</h3>
<p>Se elegível, você fará testes rápidos para:</p>
<ul>
<li>HIV (obrigatório — se positivo, a PrEP não é indicada)</li>
<li>Sífilis</li>
<li>Hepatite B e C</li>
</ul>
<p>Também será solicitado exame de <strong>creatinina</strong> (função renal), que pode ser feito no próprio local ou em laboratório credenciado.</p>

<h3>Passo 5: Receita e Acompanhamento</h3>
<p>Após aprovação, você recebe receita de 30 dias. O acompanhamento acontece a cada 3 meses, com:</p>
<ul>
<li>Renovação da receita</li>
<li>Testagem de HIV e sífilis</li>
<li>Avaliação de efeitos colaterais</li>
<li>Exame de função renal (creatinina)</li>
</ul>

<h3>Dicas Importantes</h3>
<ul>
<li><strong>Não desista na primeira tentativa.</strong> Se uma unidade não oferecer, peça encaminhamento para outra.</li>
<li><strong>Seu direito está na lei.</strong> A PrEP é política pública garantida pelo SUS. Se encontrar resistência, peça para falar com o gestor ou procure a ouvidoria.</li>
<li><strong>Adesão é proteção.</strong> Tome todos os dias, no mesmo horário. Use alarmes no celular.</li>
<li><strong>Continue usando camisinha.</strong> A PrEP não protege contra outras ISTs.</li>
</ul>

<h3>Onde Encontrar Ajuda</h3>
<p>Se tiver dificuldades de acesso:</p>
<ul>
<li><strong>Disque Saúde 136</strong> — informações e encaminhamentos</li>
<li><strong>DepepSUS</strong> — plataforma online com mapa de serviços de PrEP no Brasil</li>
<li><strong>ONGs locais</strong> — muitas organizações acompanham pessoas no processo de acesso</li>
<li><strong>Conselho Regional de Medicina (CRM)</strong> — denúncias de negativa de atendimento</li>
</ul>`,
    category: 'prep-pep',
    image: 'https://readdy.ai/api/search-image?query=brazilian%20public%20health%20center%20interior%20modern%20clean%20waiting%20room%20with%20people%20friendly%20environment%20natural%20light%20warm%20tones%20editorial%20photography%20healthcare%20facility&width=800&height=500&seq=health3&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth1&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por profissionais de saúde.',
    readTime: 8,
    views: 9870,
    publishedAt: '2026-02-10',
    featured: false,
    tags: ['PrEP', 'SUS', 'Acesso', 'Direitos', 'Saúde Pública'],
  },
  {
    id: 'h4',
    slug: 'saude-mental-lgbtq-terapia-afirmativa',
    title: 'Saúde Mental LGBTQ+: A Importância da Terapia Afirmativa',
    excerpt: 'Pessoas LGBTQ+ enfrentam taxas mais altas de ansiedade, depressão e ideação suicida. A terapia afirmativa respeita identidade e orientação, sendo essencial para o bem-estar emocional.',
    content: `<p>Pessoas <strong>LGBTQ+ têm duas a três vezes mais chance de desenvolver transtornos mentais</strong> como ansiedade e depressão. Não porque a identidade de gênero ou orientação sexual causem doença, mas pelo <strong>estigma, discriminação, violência e rejeição familiar</strong> que muitas pessoas enfrentam ao longo da vida.</p>

<h3>O Que é Terapia Afirmativa?</h3>
<p>A <strong>terapia afirmativa LGBTQ+</strong> é uma abordagem psicológica que reconhece, valida e apoia as identidades de gênero e orientações sexuais diversas. Diferente de abordagens patologizantes (que enxergam a homossexualidade ou transgeneridade como problema), a terapia afirmativa:</p>
<ul>
<li>Respeita o nome social e pronomes do paciente</li>
<li>Não tenta "converter" ou mudar orientação sexual ou identidade de gênero</li>
<li>Trabalha o estresse minorizado — o impacto do preconceito na saúde mental</li>
<li>Considera a família escolha e redes de apoio como recursos terapêuticos</li>
<li>Está preparada para questões específicas como transição de gênero, coming out, relacionamentos não monogâmicos</li>
</ul>

<h3>Sinais de Alerta que Precisam de Atenção</h3>
<p>Busque ajuda profissional se você ou alguém próximo estiver vivenciando:</p>
<ul>
<li>Tristeza persistente por mais de duas semanas</li>
<li>Ansiedade que interfere no sono, alimentação ou trabalho</li>
<li>Isolamento social progressivo</li>
<li>Pensamentos de autolesão ou suicídio</li>
<li>Uso de álcool ou drogas como escape emocional</li>
<li>Dificuldade de aceitação da própria identidade</li>
<li>Trauma por violência ou discriminação</li>
</ul>
<p><strong>Se tiver pensamentos suicidas, ligue agora para o CVV 188.</strong> Atendimento gratuito e confidencial, 24 horas.</p>

<h3>Como Encontrar um Terapeuta Afirmativo</h3>
<p>Infelizmente, nem todo profissional de saúde mental está preparado para atender pessoas LGBTQ+. Para encontrar um terapeuta afirmativo:</p>
<ul>
<li><strong>Redes de psicólogos LGBTQ+:</strong> busque diretórios como o da ABEPSS ou associações estaduais de psicologia com grupos de estudo em gênero e sexualidade</li>
<li><strong>ONGs locais:</strong> muitas mantêm listas de profissionais parceiros</li>
<li><strong>Telemedicina:</strong> plataformas como Vittude, Zenklub e Cíngulo têm filtros por terapia afirmativa</li>
<li><strong>Ask na primeira sessão:</strong> pergunte sobre experiência com pacientes LGBTQ+, postura sobre identidade de gênero e se respeita o nome social</li>
</ul>

<h3>O SUS Oferece Atendimento Psicológico?</h3>
<p>Sim, mas com limitações. CAPS (Centros de Atenção Psicossocial) oferecem atendimento psicológico e psiquiátrico gratuito, mas nem todos têm profissionais preparados para demandas LGBTQ+. Centros de referência em saúde da população LGBTQ+ (onde existem) são a melhor opção pública.</p>
<p>A <strong>Lei 13.935/2019</strong> garante que psicólogos possam atender pelo SUS em parceria com municípios, ampliando o acesso.</p>

<h3>Cuidados que Você Pode Ter Consigo</h3>
<p>Além da terapia, pequenas práticas diárias ajudam:</p>
<ul>
<li><strong>Rede de apoio:</strong> mantenha contato com amigos, familiares escolhidos ou grupos de apoio</li>
<li><strong>Limites digitais:</strong> reduza exposição a discursos de ódio nas redes sociais</li>
<li><strong>Corpo em movimento:</strong> atividade física reduz sintomas de ansiedade e depressão</li>
<li><strong>Sono de qualidade:</strong> priorize 7-8 horas de sono</li>
<li><strong>Expressão criativa:</strong> arte, música, escrita — formas de processar emoções</li>
</ul>`,
    category: 'saude-mental',
    image: 'https://readdy.ai/api/search-image?query=peaceful%20therapy%20session%20setting%20warm%20comfortable%20room%20with%20soft%20natural%20light%20plants%20cozy%20chairs%20mental%20health%20wellness%20environment%20editorial%20photography%20warm%20tones&width=800&height=500&seq=health4&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth3&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por profissionais de saúde mental.',
    readTime: 14,
    views: 18950,
    publishedAt: '2026-04-22',
    featured: true,
    tags: ['Saúde Mental', 'Terapia Afirmativa', 'Ansiedade', 'Depressão', 'Bem-Estar'],
    sources: ['ABEPSS - Diretrizes de Atendimento Psicológico', 'OMS - Saúde Mental e Diversidade Sexual', 'CVV - Centro de Valorização da Vida'],
    faqs: [
      { question: 'A terapia afirmativa é diferente da terapia comum?', answer: 'Sim. A terapia afirmativa é uma abordagem específica que respeita e valida identidades LGBTQ+, trabalhando o estresse minorizado e as demandas específicas dessa população, sem patologizar a identidade.' },
      { question: 'O SUS oferece terapia afirmativa?', answer: 'CAPS oferecem atendimento psicológico gratuito, mas nem todos têm profissionais preparados. Centros de referência LGBTQ+ são a melhor opção pública quando disponíveis.' },
      { question: 'Como saber se um terapeuta é afirmativo?', answer: 'Pergunte na primeira sessão sobre experiência com pacientes LGBTQ+, postura sobre identidade de gênero e se respeita nome social. Profissionais afirmativos recebem essas perguntas com naturalidade.' },
    ],
  },
  {
    id: 'h5',
    slug: 'estresse-minorizado-impacto-saude-mental',
    title: 'Estresse Minorizado: Como o Preconceito Afeta a Saúde Mental',
    excerpt: 'O estresse minorizado explica por que pessoas LGBTQ+ têm mais ansiedade e depressão. Entenda os mecanismos, os sinais no corpo e estratégias para se proteger emocionalmente.',
    content: `<p>O <strong>estresse minorizado (minority stress)</strong> é um conceito da psicologia da saúde que explica como o preconceito, discriminação e estigma afetam a saúde mental e física de grupos minorizados. Para pessoas LGBTQ+, isso significa que <strong>viver em uma sociedade heteronormativa e cisnormativa gera um estresse crônico</strong> que se acumula ao longo dos anos.</p>

<h3>As Três Fontes do Estresse Minorizado</h3>
<p>Segundo o modelo desenvolvido pelo pesquisador Ilan Meyer, o estresse minorizado tem três fontes principais:</p>

<h4>1. Eventos Discriminatórios Externos</h4>
<p>Experiências diretas de preconceito:</p>
<ul>
<li>Violência física e verbal</li>
<li>Discriminação no trabalho ou moradia</li>
<li>Rejeição familiar</li>
<li>Bullying escolar</li>
<li>Discriminação no acesso à saúde</li>
</ul>

<h4>2. Expectativa de Rejeição</h4>
<p>O medo constante de ser rejeitado ou atacado, mesmo sem uma situação concreta:</p>
<ul>
<li>Vigilância excessiva em espaços públicos</li>
<li>Medo de demonstrar afeto em locais abertos</li>
<li>Ansiedade antes de revelar a identidade para alguém</li>
<li>Inibição de traços de gênero para evitar perseguição</li>
</ul>

<h4>3. Internalização do Estigma</h4>
<p>Quando a pessoa absorve as mensagens negativas da sociedade e começa a se ver como inferior:</p>
<ul>
<li>Homofobia internalizada</li>
<li>Transfobia internalizada</li>
<li>Vergaça de ser quem se é</li>
<li>Negação da própria identidade</li>
</ul>

<h3>Como o Estresse Afeta o Corpo</h3>
<p>O estresse crônico ativa o sistema nervoso simpático ("luta ou fuga") de forma constante, liberando cortisol e adrenalina. Em longo prazo, isso causa:</p>
<ul>
<li>Hipertensão arterial</li>
<li>Doenças cardiovasculares</li>
<li>Disregulação do sono</li>
<li>Alterações no sistema imunológico</li>
<li>Aumento do risco de diabetes tipo 2</li>
<li>Envelhecimento celular acelerado</li>
</ul>

<h3>Estratégias de Enfrentamento</h3>
<p>Nem todo estresse minorizado pode ser eliminado (depende de mudanças sociais), mas existem formas de mitigar seus efeitos:</p>

<h4>Fortaleça sua Rede de Apoio</h4>
<p>Pessoas com redes de apoio LGBTQ+ (amigos, grupos, organizações) têm níveis significativamente menores de estresse. Conectar-se com quem entende sua experiência é protetivo.</p>

<h4>Terapia Afirmativa</h4>
<p>Um terapeuta que valida sua identidade pode ajudar a processar trauma, desenvolver estratégias de enfrentamento e fortalecer a autoestima.</p>

<h4>Ativismo e Engajamento Comunitário</h4>
<p>Participar de causas e comunidades LGBTQ+ transforma a experiência de minoria em fonte de empoderamento e sentido de pertencimento.</p>

<h4>Práticas de Regulação do Sistema Nervoso</h4>
<ul>
<li><strong>Respiração diafragmática:</strong> 5 minutos, 4 segundos inspirar, 6 expirar</li>
<li><strong>Exercício físico:</strong> libera endorfinas e quebra o ciclo de ruminação</li>
<li><strong>Mindfulness:</strong> práticas de atenção plena reduzem a reatividade ao estresse</li>
<li><strong>Sono:</strong> priorize 7-8 horas, o sono é quando o cérebro processa o estresse</li>
</ul>

<h4>Defina Limites Saudáveis</h4>
<p>Não precisa educar todo mundo, não precisa se expor a discursos de ódio "para se fortalecer". Proteja seu espaço mental como prioridade.</p>`,
    category: 'saude-mental',
    image: 'https://readdy.ai/api/search-image?query=person%20sitting%20peacefully%20by%20window%20with%20soft%20natural%20light%20indoor%20plants%20calm%20contemplative%20moment%20mental%20wellness%20self%20care%20editorial%20photography%20warm%20tones&width=800&height=500&seq=health5&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth3&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por profissionais de saúde mental.',
    readTime: 11,
    views: 11200,
    publishedAt: '2026-03-05',
    featured: false,
    tags: ['Saúde Mental', 'Estresse Minorizado', 'Preconceito', 'Ansiedade', 'Resiliência'],
  },
  {
    id: 'h6',
    slug: 'grupos-apoio-saude-mental-lgbtq',
    title: 'Grupos de Apoio e Comunidade: Cuidado Coletivo da Saúde Mental',
    excerpt: 'Grupos de apoio LGBTQ+ são espaços terapêuticos poderosos. Conheça como funcionam, onde encontrar e por que o cuidado coletivo complementa a terapia individual.',
    content: `<p>A <strong>conexão comunitária é um dos fatores mais protetivos para a saúde mental LGBTQ+</strong>. Estudos mostram que pessoas que participam de grupos de apoio, organizações ou redes comunitárias têm menores taxas de depressão, ansiedade e ideação suicida.</p>

<h3>Por Que Grupos de Apoio Funcionam?</h3>
<p>Grupos de apoio LGBTQ+ oferecem algo que a terapia individual não pode sozinha:</p>
<ul>
<li><strong>Validação experiencial:</strong> ouvir que outras pessoas passaram pelo mesmo ajuda a superar a sensação de isolamento</li>
<li><strong>Modelagem positiva:</strong> ver pessoas que ultrapassaram desafios semelhantes inspira esperança</li>
<li><strong>Redução do estigma:</strong> falar abertamente sobre experiências LGBTQ+ em ambiente seguro desarma a vergonha</li>
<li><strong>Empoderamento:</strong> compartilhar estratégias de enfrentamento fortalece a autoeficácia</li>
<li><strong>Sentido de pertencimento:</strong> fazer parte de uma comunidade satisfaz a necessidade humana básica de conexão</li>
</ul>

<h3>Tipos de Grupos de Apoio</h3>

<h4>Grupos Terapêuticos Facilitados</h4>
<p>Conduzidos por psicólogos ou assistentes sociais, com estrutura e temas definidos. Podem ser:</p>
<ul>
<li>Grupos de coming out e aceitação</li>
<li>Grupos para pais e familiares</li>
<li>Grupos de apoio à transição de gênero</li>
<li>Grupos para pessoas vivendo com HIV</li>
</ul>

<h4>Grupos de Apoio Entre Pares</h4>
<p>Sem profissional facilitador, são espaços de conversa e acolhimento entre pessoas LGBTQ+. Funcionam com regras de confidencialidade e respeito.</p>

<h4>Grupos de Ativismo e Cultura</h4>
<p>Não são terapêuticos por definição, mas oferecem pertencimento e propósito: coletivos de arte, grupos de esporte, coral, dança, etc.</p>

<h3>Onde Encontrar Grupos no Nordeste</h3>
<p>Fortaleza, Recife, Salvador e outras capitais nordestinas têm organizações que oferecem grupos de apoio:</p>
<ul>
<li><strong>Centros de referência em saúde LGBTQ+</strong> — geralmente vinculados às secretarias municipais de saúde</li>
<li><strong>ONGs locais</strong> — Grupo Gay da Bahia, Arco-Íris Ceará, Grupo de Mulheres Lesbicas de Pernambuco</li>
<li><strong>Universidades</strong> — grupos de extensão e atendimento psicológico</li>
<li><strong>Centros comunitários</strong> — espaços culturais e de acolhimento</li>
</ul>

<h3>Grupos Online e Telemedicina</h3>
<p>Para quem não tem acesso presencial:</p>
<ul>
<li><strong>Plataformas:</strong> Vittude, Zenklub e Cíngulo oferecem grupos terapêuticos online</li>
<li><strong>Comunidades virtuais:</strong> Discord servers, grupos de WhatsApp e Telegram moderados</li>
<li><strong>Redes sociais:</strong> Instagram e TikTok como portas de entrada para comunidades</li>
</ul>

<h3>Como Participar pela Primeira Vez</h3>
<p>Se é sua primeira experiência em grupo:</p>
<ol>
<li><strong>Comece observando:</strong> não precisa falar se não quiser</li>
<li><strong>Respeite seu ritmo:</strong> compartilhe apenas o que se sentir confortável</li>
<li><strong>Confidencialidade:</strong> o que é dito no grupo, fica no grupo</li>
<li><strong>Seja gentil:</strong> com você e com os outros</li>
<li><strong>Experimente mais de um:</strong> cada grupo tem uma energia diferente</li>
</ol>

<h3>Quando Complementar com Terapia Individual</h3>
<p>Grupos são poderosos, mas não substituem a terapia individual quando há:</p>
<ul>
<li>Transtornos mentais diagnosticados (depressão, TAG, transtorno bipolar)</li>
<li>Trauma complexo ou PTSD</li>
<li>Pensamentos suicidas</li>
<li>Dependência química</li>
<li>Necessidade de atenção individualizada</li>
</ul>
<p>A combinação de terapia individual + grupo de apoio + comunidade é a estrutura mais resiliente de cuidado mental.</p>`,
    category: 'saude-mental',
    image: 'https://readdy.ai/api/search-image?query=diverse%20group%20of%20people%20sitting%20in%20circle%20having%20supportive%20conversation%20indoor%20community%20space%20warm%20natural%20lighting%20authentic%20friendship%20editorial%20photography%20inclusive%20atmosphere&width=800&height=500&seq=health6&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth3&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por profissionais de saúde mental.',
    readTime: 9,
    views: 8760,
    publishedAt: '2026-01-28',
    featured: false,
    tags: ['Saúde Mental', 'Grupos de Apoio', 'Comunidade', 'Terapia', 'Bem-Estar'],
  },
  {
    id: 'h7',
    slug: 'hormonioterapia-trans-masculinizante',
    title: 'Hormonioterapia Trans Masculinizante: Guia Completo',
    excerpt: 'Testosterona, seus efeitos, riscos, acompanhamento médico necessário e como acessar pelo SUS. Guia para homens trans e pessoas não-binárias que buscam masculinização.',
    content: `<p>A <strong>hormonioterapia com testosterona</strong> é um dos principais recursos médicos para masculinização corporal de homens trans e pessoas não-binárias que buscam características masculinas. Quando bem conduzida, é segura e transformadora.</p>

<h3>Efeitos Esperados da Testosterona</h3>
<p>A testosterona promove mudanças graduais que geralmente começam entre 1 e 3 meses e continuam por anos:</p>

<h4>Primeiros 1-3 Meses</h4>
<ul>
<li>Aumento da libido</li>
<li>Aumento da oleosidade da pele e acne</li>
<li>Crescimento do clitóris (mínimo a moderado)</li>
<li>Alterações de humor (instabilidade inicial, depois estabilização)</li>
<li>Cessação da menstruação (nem sempre imediata)</li>
</ul>

<h4>3-6 Meses</h4>
<ul>
<li>Aumento de massa muscular e força</li>
<li>Redistribuição de gordura (menos quadril, mais abdômen)</li>
<li>Voz mais grossa (irreversível)</li>
<li>Crescimento de pelos faciais e corporais</li>
</ul>

<h4>6-12 Meses</h4>
<ul>
<li>Alopecia androgenética (queda de cabelo hereditária) pode começar</li>
<li>Engrossamento da pele</li>
<li>Aumento do apetite e ganho de peso</li>
<li>Mudanças na distribuição de gordura consolidadas</li>
</ul>

<h4>1-2 Anos e Além</h4>
<ul>
<li>Pelos faciais completos (se geneticamente predisposição)</li>
<li>Mudanças na estrutura facial (mais angular)</li>
<li>Aumento da massa muscular estabilizado</li>
</ul>

<h3>Efeitos Irreversíveis</h3>
<p>Algumas mudanças são permanentes mesmo que a testosterona seja suspensa:</p>
<ul>
<li>Voz mais grossa</li>
<li>Crescimento do clitóris</li>
<li>Pelos faciais e corporais (podem diminuir, mas não desaparecem)</li>
<li>Alopecia (queda de cabelo)</li>
</ul>

<h3>Via de Administração</h3>
<p>A testosterona pode ser administrada por:</p>
<ul>
<li><strong>Injeção intramuscular:</strong> mais comum, aplicação a cada 2-4 semanas (enantato ou cipionato)</li>
<li><strong>Gel transdérmico:</strong> aplicação diária na pele</li>
<li><strong>Adesivo:</strong> aplicação diária</li>
<li><strong>Implante subcutâneo:</strong> liberação lenta, dura meses</li>
</ul>
<p>No SUS, a injeção intramuscular é a forma mais disponível.</p>

<h3>Acompanhamento Médico Necessário</h3>
<p>A hormonioterapia exige acompanhamento multiprofissional:</p>
<ul>
<li><strong>Endocrinologista:</strong> prescrição e monitoramento dos níveis hormonais</li>
<li><strong>Hematologia:</strong> contagem de hemácias (testosterona aumenta a produção)</li>
<li><strong>Ginecologia:</strong> acompanhamento do trato reprodutivo (ultrassom transvaginal anual)</li>
<li><strong>Psicologia:</strong> avaliação de saúde mental (alguns serviços exigem, outros não)</li>
<li><strong>Nutrição:</strong> acompanhamento de peso e saúde metabólica</li>
</ul>

<h3>Riscos e Monitoramento</h3>
<p>A testosterona, como qualquer hormônio, tem riscos que precisam de monitoramento:</p>
<ul>
<li><strong>Poliglobulia:</strong> aumento excessivo de glóbulos vermelhos (risco de trombose)</li>
<li><strong>Dislipidemia:</strong> alteração do colesterol</li>
<li><strong>Hipertensão:</strong> aumento da pressão arterial</li>
<li><strong>Doenças cardiovasculares:</strong> risco aumentado em predisposição familiar</li>
<li><strong>Câncer de ovário e útero:</strong> monitoramento ginecológico é essencial</li>
<li><strong>Alterações hepáticas:</strong> exames de função hepática periódicos</li>
</ul>

<h3>Acesso pelo SUS</h3>
<p>A hormonioterapia trans está disponível no SUS, mas o acesso é desigual:</p>
<ul>
<li><strong>Centros de referência:</strong> ambulatórios de endocrinologia em hospitais universitários</li>
<li><strong>Política Nacional de Saúde Integral LGBT:</strong> garante o direito, mas implementação varia por estado</li>
<li><strong>Processo:</strong> geralmente exige avaliação multiprofissional (psicologia + endocrinologia + assistência social)</li>
<li><strong>Demanda:</strong> filas de espera podem ser longas</li>
</ul>

<h3>Direitos e Documentação</h3>
<p>A <strong>Resolução CFM 2.265/2019</strong> proíbe o diagnóstico de "transtorno de identidade de gênero" e garante que médicos possam prescrever hormonioterapia sem exigir laudos psiquiátricos. O <strong>Decreto 8.727/2016</strong> instituiu a Política Nacional de Saúde Integral LGBT.</p>`,
    category: 'saude-trans',
    image: 'https://readdy.ai/api/search-image?query=medical%20consultation%20room%20with%20doctor%20and%20patient%20warm%20professional%20environment%20trust%20healthcare%20setting%20natural%20light%20editorial%20photography%20clean%20aesthetic&width=800&height=500&seq=health7&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth4&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por endocrinologistas especializados em saúde trans.',
    readTime: 16,
    views: 21500,
    publishedAt: '2026-05-01',
    featured: true,
    tags: ['Hormonioterapia', 'Testosterona', 'Saúde Trans', 'SUS', 'Transição'],
    sources: ['CFM - Resolução 2.265/2019', 'Ministério da Saúde - Política Nacional de Saúde Integral LGBT', 'WPATH SOC 8'],
    faqs: [
      { question: 'A hormonioterapia é reversível?', answer: 'Parcialmente. Alguns efeitos como voz grossa, crescimento do clitóris e pelos faciais são irreversíveis. Outros como distribuição de gordura e menstruação podem reverter se a hormonioterapia for suspensa.' },
      { question: 'Preciso de laudo psiquiátrico para começar?', answer: 'Não. A Resolução CFM 2.265/2019 proíbe essa exigência. No entanto, alguns serviços ainda solicitam avaliação psicológica como parte do processo multiprofissional.' },
      { question: 'Quanto tempo leva para a menstruação parar?', answer: 'Varia. Algumas pessoas param nos primeiros 1-2 meses, outras levam 6-12 meses. Nem todas param completamente — nesses casos, a ginecologista pode avaliar opções adicionais.' },
    ],
  },
  {
    id: 'h8',
    slug: 'hormonioterapia-trans-feminizante',
    title: 'Hormonioterapia Trans Feminizante: Guia Completo',
    excerpt: 'Estradiol e antiandrógenos, efeitos esperados, riscos, acompanhamento médico e como acessar pelo SUS. Guia para mulheres trans e pessoas não-binárias que buscam feminização.',
    content: `<p>A <strong>hormonioterapia feminizante</strong> utiliza estradiol (hormônio feminino) associado a antiandrógenos (bloqueadores de testosterona) para promover características femininas em mulheres trans e pessoas não-binárias. É um tratamento seguro quando monitorado por endocrinologistas experientes.</p>

<h3>Efeitos Esperados</h3>

<h4>Primeiros 1-3 Meses</h4>
<ul>
<li>Redução da libido</li>
<li>Redução das ereções espontâneas</li>
<li>Secreção mamária inicial (sensibilidade nos seios)</li>
<li>Alterações de humor (mais emocionalidade)</li>
<li>Redução da oleosidade da pele</li>
</ul>

<h4>3-6 Meses</h4>
<ul>
<li>Desenvolvimento dos seios (começa com tecido mamário)</li>
<li>Redistribuição de gordura (mais quadril e nádegas, menos abdômen)</li>
<li>Pele mais fina e macia</li>
<li>Redução de pelos corporais e faciais (não elimina, apenas diminui)</li>
<li>Redução da massa muscular</li>
</ul>

<h4>6-12 Meses</h4>
<ul>
<li>Desenvolvimento mamário continua (pode levar 2-3 anos para estabilizar)</li>
<li>Redistribuição de gordura mais evidente</li>
<li>Cabelos mais finos e menos oleosos</li>
<li>Mudanças sutis na estrutura facial</li>
</ul>

<h4>1-2 Anos e Além</h4>
<ul>
<li>Desenvolvimento mamário estabilizado</li>
<li>Mudanças na distribuição de gordura consolidadas</li>
<li>Pele mantém características femininas</li>
</ul>

<h3>Efeitos Irreversíveis</h3>
<p>Se a hormonioterapia for suspensa:</p>
<ul>
<li>Desenvolvimento mamário é permanente (tecido mamário não regredirá)</li>
<li>Infertilidade pode ser permanente (não garantida)</li>
<li>Redistribuição de gordura pode reverter</li>
<li>Pele pode voltar a ser mais espessa</li>
<li>Pelos corporais podem voltar a crescer</li>
</ul>

<h3>Medicamentos Utilizados</h3>

<h4>Estradiol (Hormônio Feminino)</h4>
<ul>
<li><strong>Via oral:</strong> comprimidos de valerato de estradiol ou hemihidrato de estradiol</li>
<li><strong>Via transdérmica:</strong> adesivos de estradiol (liberação constante, menos impacto hepático)</li>
<li><strong>Via injetável:</strong> aplicado a cada 1-2 semanas (menos comum no SUS)</li>
</ul>

<h4>Antiandrógenos (Bloqueadores de Testosterona)</h4>
<ul>
<li><strong>Espironolactona:</strong> diurético com efeito antiandrogênico, mais acessível</li>
<li><strong>Ciproterona:</strong> potente, mas com risco hepático que exige monitoramento</li>
<li><strong>Bicalutamida:</strong> alternativa, menos impacto hepático</li>
<li><strong>Agonistas de GnRH:</strong> bloqueiam a produção de testosterona nos testículos (mais caro, menos disponível no SUS)</li>
</ul>

<h3>Acompanhamento Médico</h3>
<p>Acompanhamento multiprofissional é essencial:</p>
<ul>
<li><strong>Endocrinologia:</strong> monitoramento dos níveis de estradiol e testosterona no sangue</li>
<li><strong>Hepatologia:</strong> função hepática (antiandrógenos podem afetar o fígado)</li>
<li><strong>Nefrologia:</strong> função renal (espironolactona é diurética)</li>
<li><strong>Cardiologia:</strong> risco de trombose (estrogenioterapia aumenta risco, especialmente via oral)</li>
<li><strong>Psicologia:</strong> avaliação de saúde mental (em alguns serviços)</li>
</ul>

<h3>Riscos e Monitoramento</h3>
<ul>
<li><strong>Trombose venosa:</strong> risco aumentado, especialmente com estradiol oral e tabagismo</li>
<li><strong>Doenças cardiovasculares:</strong> risco aumentado se houver história familiar</li>
<li><strong>Hiperprolactinemia:</strong> aumento da prolactina (pode causar secreção mamária anormal)</li>
<li><strong>Alterações hepáticas:</strong> ciproterona requer monitoramento hepático estrito</li>
<li><strong>Hipercalemia:</strong> espironolactona pode aumentar potássio</li>
<li><strong>Osteoporose:</strong> se testosterona estiver muito baixa e estradiol inadequado</li>
</ul>

<h3>Dicas para Reduzir Riscos</h3>
<ul>
<li>Não fume — tabagismo + estradiol oral aumenta muito o risco de trombose</li>
<li>Mantenha exames em dia — compareça a todas as consultas de acompanhamento</li>
<li>Considere adesivo transdérmico — menor risco hepático e cardiovascular</li>
<li>Cuide do peso — obesidade aumenta riscos cardiovasculares</li>
<li>Informe seu médico sobre todos os medicamentos que usa</li>
</ul>

<h3>Acesso pelo SUS</h3>
<p>A disponibilidade varia por região:</p>
<ul>
<li>Centros de referência em ambulatórios de endocrinologia de hospitais universitários</li>
<li>Alguns serviços exigem avaliação multiprofissional, outros iniciam direto pela endocrinologia</li>
<li>A Política Nacional de Saúde Integral LGBT garante o direito, mas implementação é desigual</li>
</ul>`,
    category: 'saude-trans',
    image: 'https://readdy.ai/api/search-image?query=transgender%20pride%20medical%20healthcare%20inclusive%20warm%20consultation%20room%20with%20rainbow%20elements%20subtle%20natural%20light%20editorial%20photography%20clean%20professional%20aesthetic%20warm%20tones&width=800&height=500&seq=health8&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth4&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por endocrinologistas especializados em saúde trans.',
    readTime: 15,
    views: 19800,
    publishedAt: '2026-04-08',
    featured: false,
    tags: ['Hormonioterapia', 'Estradiol', 'Saúde Trans', 'SUS', 'Transição'],
  },
  {
    id: 'h9',
    slug: 'cirurgias-redesignacao-sexo-sus',
    title: 'Cirurgias de Redesignação Sexual no SUS: O Que Mudou em 2026',
    excerpt: 'Acesso a mastectomia, vaginoplastia, feminização facial e outras cirurgias pelo SUS. Entenda os critérios, processo e o que mudou com as novas políticas de saúde.',
    content: `<p>Em <strong>2026, o acesso a cirurgias de redesignação sexual pelo SUS avançou significativamente</strong>, graças à pressão do movimento trans, decisões judiciais e atualizações na Política Nacional de Saúde Integral LGBT. Ainda há desafios, mas o cenário é bem diferente de anos anteriores.</p>

<h3>Cirurgias Disponíveis pelo SUS</h3>
<p>O SUS oferece atualmente:</p>

<h4>Para Pessoas Trans Masculinas</h4>
<ul>
<li><strong>Mastectomia (retirada das mamas):</strong> a cirurgia mais acessível e com menores filas</li>
<li><strong>Histerectomia (retirada do útero):</li>
<li><strong>Ooforectomia (retirada dos ovários):</strong> frequentemente feita junto com histerectomia</li>
<li><strong>Metoidioplastia ou Faloideoplastia:</strong> reconstrução de pênis (menos disponível, poucos centros no Brasil)</li>
</ul>

<h4>Para Pessoas Trans Femininas</h4>
<ul>
<li><strong>Vaginoplastia:</strong> construção de vagina e vulva (disponível em poucos centros, filas longas)</li>
<li><strong>Orquiectomia (retirada dos testículos):</strong> mais acessível</li>
<li><strong>Feminização facial:</strong> alguns serviços oferecem (varia muito)</li>
<li><strong>Aumento de seios (prótese):</strong> em casos onde a hormonioterapia não desenvolveu satisfatoriamente</li>
</ul>

<h3>Processo de Acesso</h3>
<p>O caminho geralmente envolve:</p>
<ol>
<li><strong>Avaliação multiprofissional:</strong> endocrinologista, psicólogo e, em alguns casos, assistente social</li>
<li><strong>Tempo de acompanhamento:</strong> a maioria dos serviços exige pelo menos 1-2 anos de acompanhamento hormonal e/ou psicológico</li>
<li><strong>Laudos:</strong> avaliação de saúde física e mental para cirurgia</li>
<li><strong>Encaminhamento:</strong> para centro cirúrgico de referência</li>
<li><strong>Fila de espera:</strong> varia de meses a anos dependendo da cirurgia e da região</li>
</ol>

<h3>O Que Mudou em 2026</h3>
<p>Várias mudanças melhoraram o acesso:</p>
<ul>
<li><strong>Ampliação de centros credenciados:</strong> mais hospitais universitários começaram a oferecer cirurgias</li>
<li><strong>Padronização de critérios:</strong> o Ministério da Saúde publicou diretrizes nacionais mais claras</li>
<li><strong>Redução de barreiras burocráticas:</strong> alguns estados eliminaram exigências excessivas de documentação</li>
<li><strong>Ações judiciais:</strong> decisões do STF e de tribunais regionais garantiram o acesso como direito fundamental</li>
<li><strong>Telemedicina no pré-operatório:</strong> algumas avaliações podem ser feitas online</li>
</ul>

<h3>Desafios que Persistem</h3>
<ul>
<li><strong>Concentração geográfica:</strong> a maioria dos serviços está em capitais (São Paulo, Rio, Salvador, Recife, Fortaleza)</li>
<li><strong>Filas de espera:</strong> vaginoplastia e faloideoplastia têm filas de anos</li>
<li><strong>Falta de profissionais:</strong> poucos cirurgiões com treinamento específico</li>
<li><strong>Discriminação:</strong> pacientes trans ainda enfrentam resistência em alguns serviços</li>
<li><strong>Cobertura incompleta:</strong> algumas cirurgias ainda não são reconhecidas pelo SUS em todas as regiões</li>
</ul>

<h3>Alternativas Enquanto Aguarda</h3>
<p>Se você está na fila ou não tem acesso:</p>
<ul>
<li><strong>Advocacia judicial:</strong> muitas pessoas conseguem cirurgias via ação civil pública ou mandado de segurança</li>
<li><strong>ONGs e projetos:</strong> algumas organizações acompanham processos judiciais e oferecem suporte jurídico</li>
<li><strong>Cirurgias no exterior:</strong> algumas pessoas optam por países como Tailândia ou México (custo elevado)</li>
<li><strong>Hormonioterapia:</strong> enquanto aguarda, a HT pode trazer mudanças significativas</li>
</ul>

<h3>Direitos Legais</h3>
<p>Você tem direito garantido por lei:</p>
<ul>
<li><strong>Decreto 8.727/2016:</strong> instituiu a Política Nacional de Saúde Integral LGBT</li>
<li><strong>Resolução CFM 2.265/2019:</strong> garante atendimento médico sem patologização</li>
<li><strong>STF:</strong> reconheceu o acesso a cirurgias de redesignação sexual como direito fundamental à dignidade da pessoa humana</li>
</ul>
<p>Se encontrar negativa de atendimento, procure a Defensoria Pública, OAB ou associações de direitos humanos.</p>`,
    category: 'saude-trans',
    image: 'https://readdy.ai/api/search-image?query=modern%20hospital%20surgical%20center%20corridor%20clean%20bright%20professional%20healthcare%20environment%20natural%20light%20editorial%20photography%20warm%20tones%20medical%20facility&width=800&height=500&seq=health9&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth4&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por especialistas em saúde trans.',
    readTime: 13,
    views: 16700,
    publishedAt: '2026-02-18',
    featured: false,
    tags: ['Cirurgias', 'Saúde Trans', 'SUS', 'Redesignação Sexual', 'Direitos'],
  },
  {
    id: 'h10',
    slug: 'consentimento-comunicacao-prevencao-ists',
    title: 'Consentimento, Comunicação e Prevenção de ISTs',
    excerpt: 'Saúde sexual vai além da camisinha. Aprenda sobre comunicação de limites, negociação de práticas, testagem regular e como construir relações mais seguras e saudáveis.',
    content: `<p>A <strong>saúde sexual LGBTQ+</strong> é mais do que prevenção de ISTs — envolve autonomia, comunicação, prazer e cuidado mútuo. Este guia aborda desde a negociação de práticas sexuais até a testagem regular, com foco em informação baseada em evidências e respeito à diversidade.</p>

<h3>Comunicação e Consentimento</h3>
<p>O <strong>consentimento</strong> é a base de qualquer interação sexual saudável. Ele deve ser:</p>
<ul>
<li><strong>Informado:</strong> todos sabem o que vai acontecer</li>
<li><strong>Livre:</strong> sem coerção, pressão ou manipulação</li>
<li><strong>Entusiasta:</strong> todos querem estar ali</li>
<li><strong>Específico:</strong> consentimento para uma prática não significa consentimento para outras</li>
<li><strong>Reversível:</strong> qualquer pessoa pode mudar de ideia a qualquer momento</li>
<li><strong>Contínuo:</strong> precisa ser verificado ao longo da relação</li>
</ul>

<h3>Negociação de Práticas e Limites</h3>
<p>Falar sobre sexo pode ser difícil, mas é essencial para segurança e prazer:</p>
<ul>
<li><strong>Status sorológico:</strong> "Quando foi sua última testagem? Qual foi o resultado?"</li>
<li><strong>Práticas:</strong> "O que você gosta? O que está fora dos limites?"</li>
<li><strong>Proteção:</strong> "Vamos usar camisinha? PrEP? Luvas?"</li>
<li><strong>Exposição:</strong> "Você teve outras relações recentemente?"</li>
</ul>
<p>Essas conversas ficam mais fáceis com a prática. Apps de encontros e espaços LGBTQ+ têm normalizado essa comunicação.</p>

<h3>Prevenção de ISTs: Além da Camisinha</h3>

<h4>Camisinha</h4>
<p>Ainda é a única proteção contra a maioria das ISTs. Use sempre:</p>
<ul>
<li>Camisinha masculina ou feminina para sexo anal e vaginal</li>
<li>Camisinha de látex ou poliisopreno (alternativa para alérgicos a látex)</li>
<li>Preservativo bucal (dental dam) para sexo oral em vulvas</li>
<li>Camisinha sempre nova para cada relação e troca de prática (anal → oral, etc.)</li>
</ul>

<h4>PrEP (Profilaxia Pré-Exposição)</h4>
<p>Previne HIV em até 99% quando tomada corretamente. Não previne outras ISTs. Saiba mais em nosso guia completo de PrEP.</p>

<h4>PEP (Profilaxia Pós-Exposição)</h4>
<p>Tratamento de emergência após exposição de risco ao HIV. Deve ser iniciada em até 72 horas.</p>

<h4>Tratamento como Prevenção (TasP)</h4>
<p>Pessoas que vivem com HIV e têm carga viral indetectável (por tratamento antirretroviral) <strong>não transmitem o vírus sexualmente</strong> — U=U (Indetectável = Intransmissível).</p>

<h4>Vacinas Preventivas</h4>
<ul>
<li><strong>Hepatite A e B:</strong> disponíveis pelo SUS, recomendadas para todas as pessoas LGBTQ+ sexualmente ativas</li>
<li><strong>HPV:</strong> disponível pelo SUS para pessoas de 9 a 45 anos</li>
<li><strong>Mpox:</strong> vacina disponível em surtos</li>
</ul>

<h3>Testagem Regular: Quando e O Que Testar</h3>
<p>A testagem regular é a base da prevenção. Recomendações gerais:</p>

<table>
<tr><th>IST</th><th>Frequência</th><th>Quem deve testar</th></tr>
<tr><td>HIV</td><td>A cada 3-6 meses</td><td>Pessoas sexualmente ativas com múltiplos parceiros ou em situação de vulnerabilidade</td></tr>
<tr><td>Sífilis</td><td>A cada 3-6 meses</td><td>Mesmo grupo acima + gestantes</td></tr>
<tr><td>Hepatite B e C</td><td>Anual</td><td>Todas as pessoas sexualmente ativas, usuários de drogas injetáveis</td></tr>
<tr><td>Gonorreia</td><td>A cada 3-6 meses</td><td>HSH e pessoas trans em situação de vulnerabilidade</td></tr>
<tr><td>Clamídia</td><td>A cada 3-6 meses</td><td>Mesmo grupo acima</td></tr>
<tr><td>HPV</td><td>Coleta cervical anual</td><td>Pessoas com colo de útero (incluindo mulheres trans com colo)</td></tr>
</table>

<h3>Onde Testar</h3>
<ul>
<li><strong>Centros de Testagem e Aconselhamento (CTAs):</strong> testes rápidos gratuitos e confidenciais</li>
<li><strong>UBS:</strong> testes gratuitos, mas nem sempre com sigilo garantido</li>
<li><strong>Laboratórios particulares:</strong> pagos, com sigilo absoluto</li>
<li><strong>Testagem em eventos:</strong> muitas ONGs fazem testagem em paradas e festas</li>
<li><strong>Auto-teste de HIV:</strong> disponível em farmácias, permite testar em casa</li>
</ul>

<h3>Saúde Sexual e Relacionamentos</h3>
<p>Prevenção não é só individual — é coletiva:</p>
<ul>
<li><strong>Relações não monogâmicas:</strong> conversem sobre acordos, frequência de testagem e proteção</li>
<li><strong>Parceiros fixos:</strong> testagem conjunta pode fortalecer confiança</li>
<li><strong>Apps de encontros:</strong> alguns permitem compartilhar status de testagem (com cuidado com a privacidade)</li>
<li><strong>PrEP em parceiria:</strong> se um parceiro usa PrEP, isso protege ambos contra HIV</li>
</ul>`,
    category: 'educacao-sexual',
    image: 'https://readdy.ai/api/search-image?query=health%20wellness%20education%20materials%20condoms%20and%20medical%20brochures%20on%20clean%20white%20surface%20soft%20natural%20light%20editorial%20photography%20minimal%20healthcare%20prevention%20aesthetic%20warm%20tones&width=800&height=500&seq=health10&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth5&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por especialistas em saúde sexual.',
    readTime: 12,
    views: 14300,
    publishedAt: '2026-04-30',
    featured: true,
    tags: ['Educação Sexual', 'ISTs', 'Consentimento', 'Prevenção', 'Saúde Sexual'],
    faqs: [
      { question: 'Quanto tempo após a exposição devo testar?', answer: 'O teste rápido de HIV detecta a partir de 30 dias. O teste laboratorial (4ª geração) detecta a partir de 15 dias. Para outras ISTs como sífilis e gonorreia, o período varia — consulte seu médico.' },
      { question: 'Auto-teste de HIV é confiável?', answer: 'Sim, quando usado corretamente após o período de janela (30 dias). Se der reagente, confirme em laboratório. Se der não-reagente mas houve risco recente, repita em 30 dias.' },
      { question: 'Vacina de HPV funciona para HSH?', answer: 'Sim. A vacina de HPV é indicada para todas as pessoas de 9 a 45 anos, independente de gênero ou orientação sexual. HSH têm maior risco de câncer anal relacionado ao HPV.' },
    ],
  },
  {
    id: 'h11',
    slug: 'saude-anal-lgbtq-cuidados-e-prevencao',
    title: 'Saúde Anal: Cuidados e Prevenção para HSH e Pessoas Trans',
    excerpt: 'A saúde anal é pouco discutida, mas fundamental. Guia sobre higiene, prevenção, cuidados pós-relação e quando procurar um proctologista sem vergonha.',
    content: `<p>A <strong>saúde anal</strong> é um tema tabu para muitas pessoas, mas é especialmente relevante para homens que fazem sexo com homens (HSH) e mulheres trans que praticam sexo anal. Cuidar da saúde anal é tão importante quanto cuidar de qualquer outra parte do corpo — e não deveria ser motivo de vergonha.</p>

<h3>Anatomia e Funcionamento</h3>
<p>O ânus e o reto são partes naturais do corpo com funções importantes. O reto é revestido por mucosa delicada, que pode ser facilmente lesionada. O esfíncter anal controla a abertura e fechamento. Entender essa anatomia ajuda a entender os cuidados necessários.</p>

<h3>Higiene Anal</h3>
<p>Diferente do que muitos pensam, a higiene anal não exige enemas constantes:</p>
<ul>
<li><strong>Higiene externa:</strong> lavar a região com água e sabão neutro no banho é suficiente</li>
<li><strong>Enemas:</strong> devem ser evitados com frequência. O uso excessivo de enemas pode desregular a flora intestinal e irritar a mucosa</li>
<li><strong>Se fizer enema:</strong> use água morna (nunca quente), sem produtos químicos, e espere 1-2 horas antes da relação</li>
<li><strong>Ducha higiênica:</strong> alternativa mais suave que o enema, com menor pressão de água</li>
</ul>

<h3>Prevenção de Lesões Durante Sexo Anal</h3>
<ul>
<li><strong>Use lubrificante em abundância:</strong> a mucosa anal não produz lubrificação natural. Lubrificantes à base de água ou silicone são ideais. Evite lubrificantes à base de óleo (quebra camisinha de látex)</li>
<li><strong>Comece devagar:</strong> estimulação manual ou com brinquedos pequenos antes da penetração ajuda a relaxar os músculos</li>
<li><strong>Camisinha sempre:</strong> protege contra HIV e outras ISTs. Troque a camisinha se mudar de prática (anal → vaginal/oral)</li>
<li><strong>Use luvas:</strong> para sexo manual (fisting ou estimulação digital), luvas de látex ou nitrilo reduzem risco de transmissão</li>
<li><strong>Comunique:</strong> se sentir dor, pare. Dor é sinal de que algo não está certo</li>
</ul>

<h3>ISTs de Transmissão Anal</h3>
<p>O sexo anal sem proteção tem maior risco de transmissão de ISTs porque a mucosa retal é delicada:</p>
<ul>
<li><strong>HIV:</strong> o sexo anal passivo tem o maior risco de transmissão entre todas as práticas sexuais</li>
<li><strong>Sífilis:</strong> pode causar lesões anais (condiloma lata)</li>
<li><strong>Gonorreia e Clamídia:</strong> frequentemente assintomáticas no ânus, mas causam infecção</li>
<li><strong>HPV:</strong> pode causar verrugas anais e, em casos raros, câncer anal</li>
<li><strong>Hepatite A:</strong> transmissível via sexo oral-anal (anilingus)</li>
</ul>

<h3>Papanicolau Anal</h3>
<p>O <strong>papanicolau anal</strong> é um exame de rastreamento para lesões causadas pelo HPV no ânus. É recomendado para:</p>
<ul>
<li>HSH que fazem sexo anal passivo</li>
<li>Pessoas com HIV</li>
<li>Pessoas trans que praticam sexo anal</li>
</ul>
<p>O exame é simples, feito com swab no consultório. O SUS ainda não oferece universalmente, mas alguns CTAs e serviços especializados o fazem.</p>

<h3>Sinais de Alerta — Quando Procurar um Médico</h3>
<p>Procure um proctologista ou clínico geral se tiver:</p>
<ul>
<li>Dor anal persistente ou intensa</li>
<li>Sangramento durante ou após relações sexuais</li>
<li>Secreção anormal (pus, muco)</li>
<li>Verrugas ou lesões na região anal</li>
<li>Prurido (coceira) persistente</li>
<li>Alterações nos hábitos intestinais</li>
<li>Massa ou inchaço na região</li>
</ul>
<p><strong>Não tenha vergonha.</strong> Proctologistas e infectologistas já viram de tudo — sua saúde é mais importante.</p>

<h3>Cuidados Pós-Relação</h3>
<ul>
<li>Lave a região externa com água morna</li>
<li>Evite enemas após relações sexuais (pode irritar a mucosa)</li>
<li>Hidrate-se bem</li>
<li>Se houve sexo sem camisinha, considere PEP (até 72h) e marque testagem</li>
</ul>`,
    category: 'educacao-sexual',
    image: 'https://readdy.ai/api/search-image?query=medical%20consultation%20room%20proctology%20health%20examination%20setting%20clean%20professional%20environment%20soft%20natural%20light%20editorial%20photography%20warm%20tones%20healthcare&width=800&height=500&seq=health11&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth6&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por profissionais de saúde.',
    readTime: 10,
    views: 11800,
    publishedAt: '2026-03-12',
    featured: false,
    tags: ['Saúde Anal', 'Prevenção', 'ISTs', 'Sexo Seguro', 'HSH'],
  },
  {
    id: 'h12',
    slug: 'saude-lgbtq-adolescentes-jovens',
    title: 'Saúde LGBTQ+ para Adolescentes e Jovens: Guia dos 13 aos 24',
    excerpt: 'Informação sobre saúde sexual, identidade de gênero, saúde mental e onde buscar apoio para jovens LGBTQ+ e seus responsáveis. Conteúdo apropriado para idade.',
    content: `<p>A <strong>adolescência é uma fase de descoberta</strong> — da identidade, da sexualidade, do corpo e das relações. Para jovens LGBTQ+, essa fase pode ser especialmente desafiadora, mas também cheia de potencial quando há informação e apoio.</p>

<h3>Descobrindo sua Orientação Sexual e Identidade de Gênero</h3>
<p>Não há idade certa para saber. Algumas pessoas sabem desde criança, outras descobrem na vida adulta. <strong>Todos os ritmos são válidos.</strong> Não precisa ter certeza de nada agora — é normal questionar, explorar e mudar de compreensão ao longo do tempo.</p>
<p>Termos como gay, lésbica, bissexual, pansexual, assexual, trans, não-binário, gênero-fluido e outros existem para ajudar a descrever experiências, não para prender você em caixas. Use o que ressoa com você, e saiba que pode mudar.</p>

<h3>Saúde Sexual na Adolescência</h3>

<h4>Prevenção de ISTs</h4>
<ul>
<li><strong>Camisinha:</strong> protege contra HIV, sífilis, gonorreia e outras ISTs. Use sempre em relações sexuais</li>
<li><strong>PrEP:</strong> disponível para adolescentes a partir de 15 anos no SUS, mediante avaliação</li>
<li><strong>PEP:</strong> em caso de emergência (exposição ao HIV), disponível em pronto-socorros</li>
</ul>

<h4>Testagem</h4>
<p>A partir do momento em que iniciar vida sexual, a testagem regular é importante. CTAs oferecem atendimento confidencial para menores de idade a partir de 14 anos, sem necessidade de responsável (sigilo garantido).</p>

<h4>Gravidez</h4>
<p>Pessoas LGBTQ+ também podem engravidar ou gerar gravidez, dependendo da anatomia e das práticas. Métodos contraceptivos (camisinha, anticoncepcional, DIU) são relevantes para quem pode engravidar e não deseja.</p>

<h3>Saúde Mental na Adolescência LGBTQ+</h3>
<p>Jovens LGBTQ+ têm maior risco de:</p>
<ul>
<li>Ansiedade e depressão</li>
<li>Autolesão</li>
<li>Pensamentos suicidas</li>
<li>Uso de álcool e drogas</li>
<li>Insegurança alimentar e distúrbios alimentares</li>
</ul>
<p>Isso <strong>não acontece por ser LGBTQ+</strong>, mas pela rejeição, bullying, discriminação e falta de apoio. Ter uma rede de apoio (mesmo que pequena) reduz drasticamente esses riscos.</p>

<h3>Como Ajudar um Amigo ou Amiga LGBTQ+</h3>
<p>Se alguém te contou sobre sua identidade:</p>
<ul>
<li>Agradeça a confiança</li>
<li>Respeite a confidencialidade — não conte para outros sem permissão</li>
<li>Pergunte como pode apoiar</li>
<li>Não minimize: "é só uma fase" ou "você ainda vai mudar de ideia" machuca</li>
<li>Informe-se — ler sobre o tema mostra que você se importa</li>
</ul>

<h3>Para Pais e Responsáveis</h3>
<p>Se seu filho ou filha é LGBTQ+:</p>
<ul>
<li><strong>Aceitação protege:</strong> jovens LGBTQ+ aceitos pela família têm taxas 8x menores de ideação suicida</li>
<li><strong>Ouça sem julgar:</strong> às vezes o jovem só precisa ser ouvido</li>
<li><strong>Respeite privacidade:</strong> não force o jovem a contar para outras pessoas</li>
<li><strong>Busque apoio:</strong> grupos de pais e responsáveis de pessoas LGBTQ+ existem em várias cidades</li>
<li><strong>Cuide de você também:</strong> é normal ter dúvidas e precisar de apoio</li>
</ul>

<h3>Onde Buscar Apoio</h3>
<ul>
<li><strong>CVV 188:</strong> apoio emocional 24h, gratuito e confidencial</li>
<li><strong>Centros de referência LGBTQ+:</strong> atendimento psicológico, social e de saúde</li>
<li><strong>ONGs locais:</strong> muitas têm programas específicos para jovens</li>
<li><strong>Nas escolas:</strong> procure professores ou profissionais de apoio que você confie</li>
<li><strong>Online:</strong> comunidades virtuais, fóruns e grupos de apoio (com cuidado com a privacidade)</li>
</ul>

<h3>Direitos dos Jovens LGBTQ+</h3>
<ul>
<li><strong>Nome social:</strong> escolas públicas são obrigadas a usar o nome social do estudante trans</li>
<li><strong>Banheiro:</strong> estudantes trans devem usar o banheiro de acordo com sua identidade de gênero</li>
<li><strong>Uniforme:</strong> deve respeitar a expressão de gênero</li>
<li><strong>Saúde:</strong> atendimento pelo SUS sem discriminação, com sigilo garantido a partir de 14 anos</li>
</ul>`,
    category: 'educacao-sexual',
    image: 'https://readdy.ai/api/search-image?query=young%20diverse%20people%20studying%20together%20in%20bright%20library%20warm%20natural%20light%20inclusive%20friendly%20environment%20editorial%20photography%20youth%20education%20community%20warm%20tones&width=800&height=500&seq=health12&orientation=landscape',
    author: 'Redação',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=100&height=100&seq=auth5&orientation=squarish',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste, com conteúdo revisado por especialistas em saúde da adolescência.',
    readTime: 11,
    views: 13400,
    publishedAt: '2026-01-15',
    featured: false,
    tags: ['Jovens', 'Adolescentes', 'Saúde LGBTQ+', 'Educação Sexual', 'Família'],
  },
];