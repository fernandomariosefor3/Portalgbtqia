export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory: string;
  author: string;
  authorRole: string;
  authorBio: string;
  authorPhoto: string;
  date: string;
  readTime: number;
  image: string;
  featured: boolean;
  tags: string[];
  views: number;
}

export const allArticles: Article[] = [
  {
    id: '1',
    slug: 'prep-no-sus-guia-completo',
    title: 'PrEP no SUS: guia completo de acesso, adesão e prevenção ao HIV',
    excerpt: 'Tudo sobre a Profilaxia Pré-Exposição no sistema público de saúde: quem pode usar, como acessar gratuitamente e os cuidados necessários.',
    content: `
      <p class="lead">A <strong>Profilaxia Pré-Exposição (PrEP)</strong> é uma das ferramentas mais eficazes na prevenção ao HIV disponíveis atualmente. Quando tomada corretamente, reduz em até <strong>99% o risco de contaminação sexual</strong> pelo vírus. No Brasil, a PrEP está disponível gratuitamente pelo SUS desde 2018, mas muitas pessoas ainda enfrentam dificuldades para acessar o tratamento.</p>

      <h2>O que é a PrEP?</h2>
      <p>A PrEP consiste no uso contínuo de medicamentos antirretrovirais por pessoas que não têm HIV, mas estão em situação de vulnerabilidade à infecção. O medicamento utilizado no SUS brasileiro é a combinação de <strong>tenofovir e emtricitabina</strong>, em regime diário.</p>
      <p>A inclusão da PrEP no SUS colocou o Brasil na vanguarda da prevenção ao HIV em escala populacional. No entanto, a implementação efetiva depende de uma rede de serviços capacitados, estoques regulares de medicamentos e, crucialmente, da redução do estigma associado à busca por prevenção.</p>

      <h2>Quem pode usar?</h2>
      <p>A PrEP é indicada para pessoas que não têm HIV e que se enquadram em situações de vulnerabilidade definidas pelo Ministério da Saúde:</p>
      <ul>
        <li>Homens que fazem sexo com homens (HSH) e travestis e mulheres trans em situação de vulnerabilidade</li>
        <li>Pessoas que fazem uso de drogas e compartilham seringas</li>
        <li>Pessoas que têm parceiro fixo com HIV (discordância sorológica)</li>
        <li>Trabalhadores do sexo</li>
        <li>Pessoas que buscam atendimento por ISTs de forma repetida</li>
      </ul>

      <h2>Como acessar pelo SUS</h2>
      <p>O acesso se dá em unidades de saúde credenciadas, geralmente centros de testagem e aconselhamento (CTAs) e ambulatórios de DST/AIDS. O processo envolve:</p>
      <ol>
        <li><strong>Avaliação de elegibilidade:</strong> entrevista com profissional de saúde para verificar situação de vulnerabilidade</li>
        <li><strong>Testagem:</strong> teste rápido de HIV, sífilis e hepatites B e C</li>
        <li><strong>Avaliação renal:</strong> exame de creatinina para verificar função dos rins</li>
        <li><strong>Prescrição:</strong> se elegível, receita de 30 dias com renovação a cada 3 meses</li>
      </ol>

      <h2>Adesão é fundamental</h2>
      <p>Para a PrEP funcionar, é preciso tomar o comprimido todos os dias, sempre no mesmo horário. Esquecer doses reduz a proteção. Estudos mostram que apenas cerca de 40% dos iniciantes permanecem no tratamento após 12 meses, sendo os principais desafios a mudança de percepção de risco, efeitos colaterais transitórios e dificuldades de acesso.</p>

      <h2>PrEP não previne outras ISTs</h2>
      <p>É fundamental reforçar: <strong>a PrEP protege apenas contra o HIV</strong>. Ela não previne sífilis, gonorreia, clamídia, hepatite e outras infecções. Por isso, o uso de camisinha e a testagem regular continuam essenciais.</p>

      <h2>O futuro da prevenção</h2>
      <p>O Brasil testa a injetável de ação prolongada, que promete proteção por até dois meses com uma única aplicação. Se incorporada ao SUS, pode revolucionar a adesão, especialmente entre jovens e populações com dificuldade de rotina diária. A PrEP é, acima de tudo, uma ferramenta de empoderamento que devolve às pessoas o controle sobre sua saúde sexual.</p>
    `,
    category: 'saude',
    subcategory: 'prep-pep',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth1&orientation=squarish',
    date: '2025-11-10',
    readTime: 8,
    image: 'https://readdy.ai/api/search-image?query=modern%20public%20health%20clinic%20interior%20bright%20clean%20welcoming%20space%20healthcare%20facility%20with%20plants%20soft%20natural%20lighting%20editorial%20photography%20professional%20medical%20environment&width=1200&height=600&seq=art1&orientation=landscape',
    featured: true,
    tags: ['saúde', 'PrEP', 'HIV', 'SUS', 'prevenção'],
    views: 15670,
  },
  {
    id: '2',
    slug: 'cinema-queer-obras-essenciais',
    title: 'Cinema queer independente: obras essenciais para conhecer',
    excerpt: 'De Moonlight a Tangerine, uma seleção de filmes independentes LGBTQ+ que desafiaram convenções e abriram portas para novas narrativas.',
    content: `
      <p class="lead">O cinema independente sempre foi o espaço onde vozes marginalizadas encontram liberdade para existir. Para narrativas queer, essa independência não é apenas uma escolha estética — é uma necessidade política. Longe dos filtros comerciais de Hollywood, cineastas LGBTQ+ têm construído obras brutais, belas e inesquecíveis.</p>

      <h2>Moonlight: a revolução da representação</h2>
      <p>Lançado em 2016, <strong>Moonlight</strong>, de Barry Jenkins, não foi apenas um filme inovador. Ele foi revolucionário por colocar a experiência de um homem negro gay no centro da narrativa com uma sensibilidade rara. A triologia sobre a infância, adolescência e vida adulta de Chiron em Miami é uma meditação sobre masculinidade, trauma e ternura.</p>
      <p>A fotografia de James Laxton e a trilha sonora de Nicholas Britell criaram uma gramática visual para a beleza negra que o cinema raramente permite. Em 2017, Moonlight venceu o Oscar de Melhor Filme, abrindo portas para obras como <strong>Rapaz da Noite</strong>, <strong>A Vida Invisível</strong> e incontáveis curtas de jovens cineastas.</p>

      <h2>Tangerine: o iPhone como câmera de resistência</h2>
      <p>Em 2015, Sean Baker lançou <strong>Tangerine</strong>, inteiramente rodado com um iPhone 5S. O filme colocou travestis negras no centro da narrativa sem voyeurismo nem pathos barato. Mya Taylor e Kitana Kiki Rodriguez, artistas trans na vida real, deram performances genuínas que equilibram comédia e dignidade.</p>
      <p>Baker provou que orçamento não determina qualidade; visão determina. Jovens cineastas do Nordeste, em particular, abraçaram essa mensagem: a falta de recursos não é desculpa para não contar histórias importantes.</p>

      <h2>A Fantastic Woman: protagonismo trans no cinema latino-americano</h2>
      <p>O chileno Sebastián Lelio criou em 2017 uma obra que equilibra denúncia social e intimidade emocional. <strong>A Fantastic Woman</strong> mostra a vida de Marina após a morte repentina de seu parceiro, enfrentando a família que a desumaniza. O filme ganhou o Oscar de Melhor Filme Estrangeiro e impulsionou debates sobre representação trans na indústria cinematográfica.</p>

      <h2>Rapaz da Noite: o cinema queer brasileiro encontra sua voz</h2>
      <p>O filme de Pedro Dias, lançado em 2024, acompanha a jornada de um jovem gay de classe trabalhadora em Salvador. A direção minimalista, a fotografia noturna nas cores do mar e das luzes de poste criam uma atmosfera de melancolia sensual. O filme desafia a claustrofobia geográfica do cinema queer brasileiro, provando que a experiência LGBTQ+ existe em todas as latitudes.</p>

      <h2>Onde assistir</h2>
      <p>Plataformas como <strong>Mubi</strong>, <strong>Cinema Virtual</strong> e o <strong>Festival Mix Brasil</strong> são aliadas importantes na disseminação dessas narrativas. Festivais regionais como o CineCeará e iniciativas universitárias como o CineClube Diversidade promovem exibições seguidas de debates.</p>
    `,
    category: 'cultura',
    subcategory: 'cinema',
    author: 'Redação',
    authorRole: 'Crítica de Cinema',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth2&orientation=squarish',
    date: '2025-10-22',
    readTime: 6,
    image: 'https://readdy.ai/api/search-image?query=vintage%20movie%20theater%20interior%20with%20red%20velvet%20seats%20projector%20light%20beam%20atmospheric%20moody%20lighting%20classic%20cinema%20aesthetic%20editorial%20photography%20warm%20tones&width=1200&height=600&seq=art2&orientation=landscape',
    featured: true,
    tags: ['cinema', 'cultura', 'filmes', 'independente', 'queer', 'Moonlight'],
    views: 8930,
  },
  {
    id: '3',
    slug: 'guia-pais-apoiar-filho-lgbtq',
    title: 'Guia para familiares: como apoiar seu filho LGBTQ+ na adolescência',
    excerpt: 'Estratégias práticas e empáticas para fortalecer laços familiares e promover bem-estar emocional durante a descoberta da identidade.',
    content: `
      <p class="lead">A descoberta de que um filho ou filha é LGBTQ+ pode ser um momento de transformação profunda para toda a família. Este guia foi construído com base em literatura científica sobre psicologia familiar e nas diretrizes do Conselho Federal de Psicologia sobre atendimento afirmativo.</p>

      <h2>O primeiro passo: escutar sem julgar</h2>
      <p>Quando um adolescente decide se abrir com os pais sobre sua orientação sexual ou identidade de gênero, está exercendo um ato de coragem imenso. A reação inicial dos pais pode definir o tom de todo o relacionamento futuro. O primeiro princípio é simples, mas difícil: <strong>escutar sem interromper, sem minimizar e sem apressar soluções</strong>.</p>
      <p>Frases como "é só uma fase" ou "você ainda vai mudar de ideia" invalidam a experiência do jovem e fecham portas de comunicação. A mensagem que o adolescente precisa receber é: <strong>"eu te amo, eu te aceito, e estou aqui para entender"</strong>.</p>

      <h2>Processando suas próprias emoções</h2>
      <p>É natural que pais passem por um processo de adaptação. Choro, confusão, preocupação com o futuro do filho — todas essas emoções são válidas. O que não é saudável é descarregá-las sobre o adolescente. Especialistas recomendam que pais busquem espaços próprios para processar suas reações: terapia individual, grupos de apoio ou conversas com outros pais que já passaram pela mesma experiência.</p>

      <h2>A escola e o ambiente social</h2>
      <p>A adolescência já é um período desafiador de formação de identidade. Para jovens LGBTQ+, o ambiente escolar pode ser particularmente hostil. Dados do IBGE e de organizações como a ABGLT mostram que a maioria dos estudantes LGBTQ+ brasileiros já sofreu bullying por orientação sexual ou identidade de gênero.</p>
      <p>Pais podem atuar como aliados importantes na escola, conversando com coordenadores e professores, participando de reuniões que abordem diversidade, e encaminhando formalmente casos de discriminação.</p>

      <h2>Saúde mental e suicídio</h2>
      <p>É um dado doloroso, mas necessário de ser dito: <strong>jovens LGBTQ+ têm taxas de ideação suicida significativamente maiores</strong> que seus pares heterossexuais e cisgênero. O apoio familiar é o fator protetivo mais poderoso contra esses resultados. Estudos internacionais consistentes mostram que adolescentes LGBTQ+ aceitos pela família têm riscos depressivos e suicidas estatisticamente equivalentes aos de adolescentes heterossexuais.</p>
      <p>Isso significa que o apoio dos pais não é apenas "bom de ter" — é literalmente salva-vidas. Ante qualquer sinal de sofrimento mental, buscar ajuda profissional é urgente. O <strong>Centro de Valorização da Vida (CVV)</strong> atende 24h pelo telefone 188.</p>

      <h2>Um relacionamento que se reinventa</h2>
      <p>A jornada de apoio a um filho LGBTQ+ não tem fim — e isso é positivo. Cada fase da vida do jovem trará novas questões: primeiros relacionamentos, escolhas de carreira, possibilidades de paternidade. A construção de um laço parental baseado na aceitação abre espaço para que essas conversas aconteçam naturalmente, sem vergonha ou segredos.</p>
    `,
    category: 'familia',
    subcategory: 'meu-filho-e-gay',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth4&orientation=squarish',
    date: '2025-09-15',
    readTime: 7,
    image: 'https://readdy.ai/api/search-image?query=warm%20family%20scene%20parent%20and%20teenager%20talking%20on%20living%20room%20couch%20soft%20afternoon%20light%20through%20window%20cozy%20home%20environment%20tender%20moment%20editorial%20photography%20natural%20colors&width=1200&height=600&seq=art4&orientation=landscape',
    featured: true,
    tags: ['família', 'adolescência', 'pais', 'aceitação', 'guia', 'saúde mental'],
    views: 22100,
  },
  {
    id: '4',
    slug: 'saude-mental-lgbtq-terapia-afirmativa',
    title: 'Saúde mental LGBTQ+: quando e como buscar ajuda terapêutica',
    excerpt: 'Um guia acessível sobre terapia afirmativa, estresse minorizado e recursos de apoio emocional disponíveis no Brasil.',
    content: `
      <p class="lead">A saúde mental da população LGBTQ+ é uma pauta urgente. Estudos brasileiros e internacionais apontam taxas de ansiedade, depressão e ideação suicida significativamente mais altas entre pessoas LGBTQ+ do que na população geral. Mas por trás desses números existem histórias de resiliência, cura e reconstrução.</p>

      <h2>Por que a saúde mental LGBTQ+ precisa de atenção especial?</h2>
      <p>A resposta está no conceito de <strong>minority stress</strong>, desenvolvido pelo psicólogo Ilan Meyer. Pessoas de minorias vivenciam estressores adicionais àqueles comuns a todos: discriminação, estigma internalizado, expectativa de rejeição, necessidade de ocultar a identidade e violências diretas. Esses estressores, acumulados ao longo da vida, aumentam dramaticamente o risco de transtornos mentais.</p>
      <p>No Brasil, a realidade é particularmente grave. O país lidera estatísticas de assassinatos de pessoas LGBT no mundo, e o Nordeste concentra parcela significativa desses crimes. A combinação de violência extrema, desigualdade socioeconômica e baixa oferta de serviços especializados cria um cenário onde cuidar da saúde mental LGBTQ+ é, muitas vezes, uma questão de sobrevivência.</p>

      <h2>O que é terapia afirmativa?</h2>
      <p><strong>Terapia afirmativa</strong> não é um tipo específico de abordagem terapêutica, mas sim uma <strong>postura ética e clínica</strong>. Um terapeuta afirmativo reconhece e valida as identidades LGBTQ+ como saudáveis e naturais, não tenta "curar" orientação sexual ou identidade de gênero, e está capacitado para trabalhar questões específicas da experiência de minoria.</p>
      <p>Infelizmente, nem todo profissional de saúde mental é afirmativo. Relatos de práticas reparativas disfarçadas ainda são comuns, mesmo após a criminalização dessas práticas pelo Conselho Federal de Psicologia em 2018. Por isso, escolher um terapeuta requer cuidado.</p>

      <h2>Como encontrar um terapeuta afirmativo</h2>
      <p>Redes de profissionais afirmativos mantêm diretórios online com filtros por estado e cidade. Em Fortaleza, o <strong>Centro de Apoio Psicológico à Diversidade</strong>, vinculado à UFC, oferece atendimento gratuito com psicólogos em formação supervisionados. Outras alternativas incluem plataformas de telemedicina com filtros por especialidade LGBTQ+ e CAPS do SUS.</p>

      <h2>Recursos gratuitos e imediatos</h2>
      <p>Para quem precisa de ajuda imediata:</p>
      <ul>
        <li><strong>CVV — Centro de Valorização da Vida:</strong> 188 (ligação gratuita, 24h)</li>
        <li><strong>Disque Saúde Mental SUS:</strong> 136</li>
        <li><strong>CAPS LGBTI+:</strong> atendimento psicológico gratuito em grandes centros</li>
      </ul>

      <h2>A jornada de cura</h2>
      <p>Saúde mental não é ausência de sofrimento — é capacidade de processá-lo. Para pessoas LGBTQ+, essa capacidade frequentemente precisa ser reconstruída após anos de invalidação. Terapia é uma ferramenta poderosa nesse processo, mas não é a única. Comunidade, arte, espiritualidade, exercício físico e relacionamentos afirmativos também são medicina.</p>
    `,
    category: 'saude',
    subcategory: 'saude-mental',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth6&orientation=squarish',
    date: '2025-08-30',
    readTime: 6,
    image: 'https://readdy.ai/api/search-image?query=serene%20therapy%20session%20setting%20comfortable%20couch%20soft%20blanket%20plants%20in%20background%20calming%20warm%20lighting%20peaceful%20mental%20health%20space%20editorial%20photography%20natural%20tones&width=1200&height=600&seq=art6&orientation=landscape',
    featured: true,
    tags: ['saúde mental', 'terapia', 'LGBTQ+', 'afirmativa', 'apoio'],
    views: 18700,
  },
  {
    id: '5',
    slug: 'cena-drag-brasileira-resistencia',
    title: 'A cena drag brasileira: da resistência ao mainstream',
    excerpt: 'Como a arte drag se transformou de manifestação underground em expressão cultural reconhecida nos palcos, na TV e nas ruas do Brasil.',
    content: `
      <p class="lead">A arte drag sempre existiu no Brasil, mas nos últimos anos assistimos a uma transformação. O que antes era confinado a festas underground e circuitos fechados agora ocupa teatros, galerias de arte e programação oficial de centros culturais. Performers brasileiros estão redefinindo o que significa ser drag — e o mundo está começando a prestar atenção.</p>

      <h2>O renascimento pós-pandemia</h2>
      <p>A pandemia de COVID-19 foi devastadora para artistas performáticos. Sem palcos, sem público e sem renda, muitos drag queens e kings foram obrigados a reinventar-se. Coletivos organizaram lives, oficinas online e festivais virtuais, reunindo performers de diferentes estados. Essa crise criativa gerou uma nova geração de artistas mais políticos, mais artísticos e menos dependentes do entretenimento convencional.</p>

      <h2>A diversidade de estilos</h2>
      <p>Se há alguns anos o imaginário popular associava drag quase exclusivamente a feminilidade exagerada, a cena atual desafia qualquer definição rígida. Drag kings exploram masculinidades não-hegemônicas em performances que misturam spoken word e dança contemporânea. Artistas não-binárias criam personagens andróginos que transitam entre o orgânico e o tecnológico. Cada performer constrói um universo próprio.</p>

      <h2>Espaços e resistência</h2>
      <p>A expansão da cena drag não ocorreu sem resistência. Bares tradicionais inicialmente resistiram em abrir espaço para performances drag, especialmente de artistas trans e travestis. A pressão de coletivos e a mudança de hábitos do público jovem forçaram uma reabertura gradual. Hoje, centros culturais como o SESC e universidades públicas oferecem oficinas e disciplinas sobre história e teoria da performance drag.</p>

      <h2>Desafios econômicos e sociais</h2>
      <p>Apesar da visibilidade crescente, a realidade econômica da maioria dos performers continua precária. Raramente há cachês justos, e muitos artistas dependem de trabalhos informais para sobreviver. A falta de reconhecimento da drag como profissão dificulta acesso a benefícios previdenciários e crédito. Questões de segurança também persistem, com artistas que performam em espaços públicos relatando assédio verbal e agressões.</p>

      <h2>O futuro da drag brasileira</h2>
      <p>Com a crescente internacionalização e a consolidação de uma estética própria que dialoga com tradições regionais, a cena drag brasileira parece destinada a um papel de protagonismo. A mensagem é clara: a arte drag pode ser profundamente política, esteticamente inovadora e culturalmente enraizada. Não estamos copiando Nova York ou Paris. Estamos criando algo que só existe aqui.</p>
    `,
    category: 'cultura',
    subcategory: 'drag',
    author: 'Redação',
    authorRole: 'Crítica Cultural',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth5&orientation=squarish',
    date: '2025-07-18',
    readTime: 9,
    image: 'https://readdy.ai/api/search-image?query=drag%20queen%20performance%20on%20stage%20vibrant%20colorful%20lighting%20confetti%20sparkles%20glamorous%20makeup%20and%20costume%20theatrical%20atmosphere%20editorial%20photography%20dynamic%20pose&width=1200&height=600&seq=art5&orientation=landscape',
    featured: true,
    tags: ['drag', 'cultura', 'Brasil', 'arte', 'performance', 'LGBTQ+'],
    views: 11200,
  },
  {
    id: '6',
    slug: 'historia-movimento-lgbtq-brasil',
    title: 'A história do movimento LGBTQ+ no Brasil: da ditadura à atualidade',
    excerpt: 'Uma linha do tempo completa das conquistas, perdas e resistências que construíram o movimento de orgulho brasileiro.',
    content: `
      <p class="lead">A história do movimento LGBTQ+ no Brasil não começou nas paradas de rua. Começou em apartamentos clandestinos, em boates escondidas, em cartas anônimas publicadas em jornais underground. É uma história de coragem coletiva, de estratégias de sobrevivência e, eventualmente, de conquistas que transformaram a sociedade brasileira.</p>

      <h2>O período ditatorial (1964-1985)</h2>
      <p>Durante a ditadura militar, a homossexualidade era tratada como "desvio" e "ameaça à moral nacional". Policiais invadiam boates, prendiam frequentadores e publicavam nomes em jornais para expô-los. Apesar da repressão, comunidades homossexuais se organizavam — inicialmente de forma clandestina, depois com maior ousadia na década de 1970.</p>
      <p>Em 1978, o Grupo Gay da Bahia (GGB) foi fundado em Salvador por Luiz Mott, tornando-se a primeira organização LGBTQ+ do Brasil. No mesmo ano, o Núcleo de Ação pela Liberdade de Expressão Sexual (NALES) surgiu em São Paulo. Essas organizações começaram a articular uma agenda política que, na época, parecia impossível.</p>

      <h2>A década de 1980: AIDS e organização</h2>
      <p>A chegada da epidemia de AIDS no Brasil, no início dos anos 1980, foi um divisor de águas. Inicialmente chamada de "doença dos homossexuais" pela mídia e pelo governo, a epidemia expôs a vulnerabilidade da comunidade gay e, paradoxalmente, catalisou sua organização política. ONGs como a ABIA e a Pela Vidda foram criadas para oferecer apoio a pessoas vivendo com HIV e pressionar o governo por políticas de saúde.</p>

      <h2>Anos 1990: paradas e visibilidade</h2>
      <p>A primeira Parada do Orgulho LGBT de São Paulo aconteceu em 1997, com cerca de 2.000 participantes. Hoje, é a maior do mundo. Fortaleza realizou sua primeira parada em 2005. Recife, em 2006. Salvador, em 2002. Cada parada era um ato de coragem em cidades onde a homofobia violenta era — e em muitos lugares ainda é — a norma.</p>
      <p>A década também viu avanços jurídicos importantes. Em 1995, o Código Penal deixou de considerar homossexualidade como atenuante de crimes de estupro. Em 1999, o Conselho Federal de Medicina proibiu tratamentos reparativos de homossexualidade.</p>

      <h2>Século XXI: conquistas e retrocessos</h2>
      <p>O novo milênio trouxe avanços significativos: a união estável homoafetiva reconhecida pelo STF em 2011, o casamento igualitário em 2013, a criminalização da homofobia como racismo pelo STF em 2019, e a inclusão do nome social em documentos oficiais. O Brasil elegeu, em 2018, sua primeira deputada federal trans.</p>
      <p>Contudo, o período também foi marcado por retrocessos. Governos implementaram políticas explícitas de apagamento LGBTQ+, removendo menções a diversidade sexual de documentos oficiais e cortando financiamento a projetos culturais queer. O número de assassinatos de pessoas LGBT no Brasil permanece entre os mais altos do mundo.</p>

      <h2>O movimento hoje</h2>
      <p>O movimento LGBTQ+ brasileiro é mais diversificado do que nunca. Não há mais uma única agenda: existem agendas trans, negras, indígenas, de pessoas com deficiência, de periferias. A interseccionalidade deixou de ser um conceito acadêmico para se tornar prática organizativa. As paradas continuam, mas agora coexistem com fóruns legislativos, plataformas digitais de denúncia, coletivos de arte e campanhas de educação em escolas.</p>
    `,
    category: 'educacao',
    subcategory: 'historia',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth12&orientation=squarish',
    date: '2025-06-20',
    readTime: 10,
    image: 'https://readdy.ai/api/search-image?query=historical%20black%20and%20white%20photo%20style%20of%20brazilian%20lgbtq%20protest%20march%201980s%20vintage%20archival%20photography%20documentary%20style%20street%20protest%20signs&width=1200&height=600&seq=art12&orientation=landscape',
    featured: true,
    tags: ['história', 'educação', 'movimento', 'Brasil', 'ditadura', 'conquistas'],
    views: 28900,
  },
  {
    id: '7',
    slug: 'paradas-lgbtq-brasil-calendario',
    title: 'Paradas LGBTQ+ no Brasil: calendário e história das marchas',
    excerpt: 'As principais paradas de orgulho do país, suas origens e como a manifestação se tornou um ato político de resistência e celebração.',
    content: `
      <p class="lead">A Parada do Orgulho LGBT é mais do que uma festa. É uma manifestação política, um ato de resistência e uma celebração coletiva que reúne milhões de pessoas anualmente nas ruas brasileiras. Este guia apresenta as principais paradas do país e a história dessa tradição de luta.</p>

      <h2>Parada de São Paulo</h2>
      <p>A primeira Parada do Orgulho LGBT de São Paulo aconteceu em 1997, com cerca de 2.000 participantes. Hoje, é a maior parada do mundo, reunindo mais de 3 milhões de pessoas na Avenida Paulista. O evento transformou-se em um megafestival, mas mantém sua raiz política: cada edição elege uma pauta central, como criminalização da LGBTfobia ou visibilidade trans.</p>

      <h2>Parada do Rio de Janeiro</h2>
      <p>A parada carioca, realizada tradicionalmente na Praia de Copacabana, é uma das mais antigas do Brasil. Com o cenário natural da orla como pano de fundo, o evento combina festa e ativismo, com forte presença de coletivos de favelas que reivindicam o direito à cidade.</p>

      <h2>Parada do Nordeste</h2>
      <p>Fortaleza, Recife e Salvador concentram as maiores paradas da região. A Parada de Fortaleza, iniciada em 2005, tornou-se a maior manifestação LGBTQ+ do Nordeste. Recife, com sua tradição de carnaval e frevo, traz uma energia particular à celebração. Salvador, berço do Grupo Gay da Bahia, tem uma parada profundamente politizada desde sua origem.</p>

      <h2>Outras paradas pelo Brasil</h2>
      <p>Além das capitais, dezenas de cidades do interior realizam paradas anuais. Belo Horizonte, Curitiba, Brasília, Porto Alegre, Manaus, Belém — a lista cresce a cada ano. Cada parada local tem suas características, mas todas compartilham o mesmo propósito: existir visivelmente em espaços que historicamente negaram essa possibilidade.</p>

      <h2>Datas de visibilidade importantes</h2>
      <ul>
        <li><strong>28 de junho:</strong> Dia Internacional do Orgulho LGBT (marcando a revolta de Stonewall em 1969)</li>
        <li><strong>29 de agosto:</strong> Dia da Visibilidade Lésbica</li>
        <li><strong>29 de janeiro:</strong> Dia da Visibilidade Trans</li>
        <li><strong>23 de setembro:</strong> Dia da Visibilidade Bissexual</li>
        <li><strong>17 de maio:</strong> Dia Internacional de Combate à Homofobia, Transfobia e Bifobia</li>
      </ul>

      <h2>Segurança nas paradas</h2>
      <p>A segurança é prioridade absoluta. Organizações recomendam: levar protetor solar e água, manter identificação de contato de emergência, ficar atento a pontos de hidratação e apoio médico, e usar transporte público devido ao fechamento de vias. Grupos de apoio com voluntários identificados costumam estar presentes para auxiliar em casos de discriminação ou assédio.</p>
    `,
    category: 'paradas',
    subcategory: 'calendario',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth7&orientation=squarish',
    date: '2025-08-10',
    readTime: 5,
    image: 'https://readdy.ai/api/search-image?query=aerial%20view%20of%20massive%20pride%20parade%20crowd%20rainbow%20flags%20colorful%20confetti%20streets%20of%20brazilian%20city%20afternoon%20sunlight%20vibrant%20celebration%20editorial%20photography%20wide%20angle&width=1200&height=600&seq=art7&orientation=landscape',
    featured: false,
    tags: ['parada', 'evento', 'orgulho', 'LGBTQ+', 'manifestação', 'calendário'],
    views: 25400,
  },
  {
    id: '8',
    slug: 'glossario-lgbtq-atualizado',
    title: 'Glossário LGBTQ+ atualizado: entenda os termos da comunidade',
    excerpt: 'De "cis" a "não-binário", um guia completo e respeitoso para quem quer entender melhor a linguagem da diversidade.',
    content: `
      <p class="lead">A linguagem é poder. Saber usar termos corretamente quando se fala sobre identidade, orientação sexual e expressão de gênero não é apenas uma questão de correção política — é uma forma de respeito fundamental. Este glossário foi elaborado para ser um recurso acessível, atualizado e livre de julgamentos.</p>

      <h2>Identidade de gênero</h2>
      <p><strong>Cisgênero:</strong> Pessoa cuja identidade de gênero corresponde ao sexo designado ao nascimento. O termo existe para nomear uma experiência sem torná-la normativa ou superior.</p>
      <p><strong>Transgênero:</strong> Pessoa cuja identidade de gênero difere do sexo designado ao nascimento. Inclui homens trans, mulheres trans e pessoas não-binárias.</p>
      <p><strong>Não-binário:</strong> Pessoa cujo gênero não se encaixa exclusivamente nas categorias masculino ou feminino. Pode incluir gêneros fluentes, agêneros, bigêneros e muitas outras experiências.</p>
      <p><strong>Travesti:</strong> Termo político e identitário usado principalmente na América Latina para designar pessoas designadas homens ao nascimento que adotam expressões femininas. Reivindicado como identidade própria por muitas pessoas no Brasil.</p>

      <h2>Orientação sexual</h2>
      <p><strong>Lésbica:</strong> Mulher que sente atração romântica e/ou sexual por outras mulheres.</p>
      <p><strong>Gay:</strong> Homem que sente atração romântica e/ou sexual por outros homens. Também usado como termo guarda-chuva para homossexualidade.</p>
      <p><strong>Bissexual:</strong> Pessoa que sente atração romântica e/ou sexual por mais de um gênero. Não implica necessariamente atração igual por todos os gêneros.</p>
      <p><strong>Pansexual:</strong> Pessoa que sente atração independentemente de gênero.</p>
      <p><strong>Assexual:</strong> Pessoa que experimenta pouca ou nenhuma atração sexual por outras pessoas. A assexualidade é uma orientação sexual válida e existem espectros dentro dela.</p>

      <h2>Expressão de gênero</h2>
      <p><strong>Drag:</strong> Forma de performance artística onde uma pessoa adota uma persona de gênero exagerada para entretenimento, comentário social ou expressão artística. Não define a identidade de gênero do performer.</p>
      <p><strong>Queer:</strong> Termo guarda-chuva para identidades e orientações que não se encaixam em categorias normativas. Foi ressignificado de insulto para termo de empoderamento a partir dos anos 1990.</p>

      <h2>Conceitos sociais</h2>
      <p><strong>Ally (aliado):</strong> Pessoa heterossexual e/ou cisgênero que apoia ativamente os direitos e a igualdade de pessoas LGBTQ+.</p>
      <p><strong>Interseccionalidade:</strong> Conceito que reconhece que diferentes formas de opressão (racismo, sexismo, homofobia, transfobia, classismo) se cruzam e se reforçam mutuamente.</p>
      <p><strong>Armário:</strong> Metáfora que descreve quando uma pessoa LGBTQ+ não revela publicamente sua orientação sexual ou identidade de gênero. "Sair do armário" é o processo de revelação.</p>
      <p><strong>Deadname:</strong> Nome de registro anterior ao reconhecimento da identidade de gênero de uma pessoa trans. Usar o deadname sem consentimento é invasivo e desrespeitoso.</p>

      <h2>Como usar este glossário</h2>
      <p>Termos evoluem. Significados mudam. Comunidades diferem em suas preferências. O mais importante não é memorizar definições, mas cultivar humildade epistêmica: reconhecer que não sabemos tudo e que a melhor fonte sobre a identidade de alguém é a própria pessoa. Quando em dúvida, pergunte respeitosamente como a pessoa prefere ser chamada.</p>
    `,
    category: 'educacao',
    subcategory: 'glossario',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth8&orientation=squarish',
    date: '2025-11-05',
    readTime: 8,
    image: 'https://readdy.ai/api/search-image?query=open%20dictionary%20book%20on%20wooden%20desk%20with%20reading%20glasses%20and%20pen%20soft%20natural%20light%20academic%20study%20atmosphere%20editorial%20photography%20minimal%20warm%20tones&width=1200&height=600&seq=art8&orientation=landscape',
    featured: false,
    tags: ['educação', 'glossário', 'terminologia', 'LGBTQ+', 'diversidade', 'guia'],
    views: 32100,
  },
  {
    id: '9',
    slug: 'homoparentalidade-direitos-brasil',
    title: 'Homoparentalidade no Brasil: direitos, desafios e conquistas',
    excerpt: 'Um panorama da adoção e reconhecimento legal de famílias homoafetivas, com dados atualizados sobre a realidade brasileira.',
    content: `
      <p class="lead">A família brasileira de hoje não se parece com aquela dos livros didáticos de décadas passadas. Pais solteiros, famílias recompostas, casais homoafetivos com filhos — a diversidade familiar é uma realidade que a lei, aos trancos e barrancos, vai reconhecendo. Este artigo apresenta um panorama dos direitos, desafios e conquistas da homoparentalidade no Brasil.</p>

      <h2>O antes de 2013</h2>
      <p>Antes da resolução do CNJ, casais homoafetivos que queriam se casar enfrentavam um cenário jurídico incerto. Alguns conseguiam autorizações judiciais individuais; outros viajavam para países onde o casamento era legal. A maioria, porém, simplesmente não tinha acesso a essa forma de reconhecimento.</p>
      <p>A união estável, reconhecida pelo Supremo Tribunal Federal desde 2011, oferecia proteção patrimonial, mas não o simbolismo e os direitos plenos do casamento civil. Para muitos, a diferença era mais do que burocrática — era existencial.</p>

      <h2>Casamento igualitário</h2>
      <p>Em maio de 2013, o Conselho Nacional de Justiça (CNJ) determinou que cartórios de todo o Brasil deveriam converter uniões estáveis homoafetivas em casamentos civis. Foi o pontapé inicial de uma revolução silenciosa nas famílias brasileiras. Desde então, estima-se que mais de 120 mil casamentos homoafetivos tenham sido celebrados no país.</p>

      <h2>Adoção homoparental</h2>
      <p>O Superior Tribunal de Justiça (STJ) reconheceu o direito à adoção conjunta independentemente de orientação sexual. No entanto, o processo continua desafiador. Casais relatam burocracia excessiva, resistência de alguns cartórios e a necessidade de recorrer à Justiça para garantir direitos que deveriam ser automáticos.</p>

      <h2>Desafios que persistem</h2>
      <p>Apesar da legalidade, obstáculos práticos continuam. Em alguns cartórios do interior, funcionários ainda criam dificuldades — pedindo documentos extras ou recorrendo a objeções de consciência. A ausência de legislação específica sobre regime de bens para casais homoafetivos gera insegurança jurídica. Advogados especializados recomendam testamento e planejamento sucessório desde o início do casamento.</p>

      <h2>Um futuro de igualdade plena</h2>
      <p>O próximo passo na agenda é a aprovação de uma lei específica que regule todos os aspectos do matrimônio homoafetivo, eliminando dependência de decisões judiciais. Além disso, a paternidade/maternidade igualitária — o reconhecimento automático de ambos os cônjuges como pais/mães de filhos nascidos durante o casamento — ainda não é universal no Brasil. Cada casal que se une é uma página nova escrita na história de um país que aprende, aos poucos, que amor não precisa de permissão para existir.</p>
    `,
    category: 'familia',
    subcategory: 'homoparentalidade',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth9&orientation=squarish',
    date: '2025-09-28',
    readTime: 12,
    image: 'https://readdy.ai/api/search-image?query=same%20sex%20parents%20with%20children%20playing%20in%20park%20afternoon%20golden%20hour%20warm%20light%20happy%20family%20scene%20tender%20moments%20editorial%20photography%20natural%20outdoor%20setting&width=1200&height=600&seq=art9&orientation=landscape',
    featured: false,
    tags: ['família', 'homoparentalidade', 'adoção', 'direitos', 'amor', 'diversidade'],
    views: 19800,
  },
  {
    id: '10',
    slug: 'playlist-lgbtq-brasileira',
    title: 'Playlist LGBTQ+ brasileira: artistas essenciais para ouvir',
    excerpt: 'Da MPB ao pop, passando pelo rap e eletrônica, uma curadoria musical que celebra a diversidade sonora do Brasil.',
    content: `
      <p class="lead">A música brasileira sempre foi queer, mesmo quando não sabia. De Clara Nunes cantando Cazuza a Liniker reivindicando espaço no pop nacional, a trajetória da diversidade sonora do país é tão rica quanto subestimada. Nesta curadoria, reunimos artistas LGBTQ+ brasileiros — de nomes consolidados a promessas independentes — que merecem ocupar suas playlists.</p>

      <h2>MPB e canção de autor</h2>
      <p><strong>Liniker:</strong> A voz mais importante do pop queer brasileiro atual. De "Zero" a "Lili", cada música é um manifesto de generosidade afetiva e estética.</p>
      <p><strong>Johnny Hooker:</strong> Performer cearense que mistura brega, MPB e teatro em espetáculos que desafiam qualquer categorização.</p>
      <p><strong>Elza Soares:</strong> A eterna diva, que em seus últimos anos de vida abraçou explicitamente a causa LGBTQ+ e colaborou com artistas queer.</p>
      <p><strong>Cadu Tenório:</strong> Cantautor pernambucano que escreve sobre amor gay com a mesma naturalidade com que Chico Buarque escreveu sobre amor hetero.</p>

      <h2>Rap e hip-hop</h2>
      <p><strong>Linn da Quebrada:</strong> Artista trans que transformou o rap em ferramenta de denúncia política e celebração da vida travesti.</p>
      <p><strong>Drik Barbosa:</strong> Uma das vozes mais potentes do feminismo negro e queer no rap nacional.</p>
      <p><strong>Tássia Reis:</strong> Rapper que explora sexualidade, corpo negro e subjetividade feminina com rima afiada e batidas envolventes.</p>

      <h2>Eletrônica e experimental</h2>
      <p><strong>Pabllo Vittar:</strong> A drag pop mais famosa do Brasil, que eletrificou o forró, o arrocha e o funk em hits imensos.</p>
      <p><strong>Gloria Groove:</strong> Rapper, cantora e performer que construiu um universo visual e sonoro sem precedentes na música brasileira.</p>
      <p><strong>Mateus Carrilho:</strong> Produtor de eletrônica baiana que colabora regularmente com vocalistas trans e não-binários.</p>

      <h2>Rock e indie</h2>
      <p><strong>As Bahias e a Cozinha Mineira:</strong> Banda indie de Salvador com vocalistas trans e negros, misturando rock, MPB e temática social.</p>
      <p><strong>Transa:</strong> Banda cearense de rock alternativo formada inteiramente por pessoas trans.</p>
      <p><strong>Letrux:</strong> Letícia Novaes constrói canções indie de intensidade emocional rara, frequentemente explorando desejos não normativos.</p>

      <h2>Samba e regional</h2>
      <p><strong>Ludmilla:</strong> A funkeira que se reinventou como rainha do pagode e é abertamente bissexual, desafiando preconceitos de classe e gênero.</p>
      <p><strong>Don L:</strong> Rapper carioca com forte presença queer em suas letras e clipes.</p>

      <h2>Onde ouvir</h2>
      <p>Todos os artistas citados estão disponíveis nas principais plataformas de streaming. Festivais como o Rec-Beat, em Pernambuco, e o Mix Brasil, em São Paulo, mantêm tradição de programar artistas LGBTQ+ emergentes e consolidados.</p>
    `,
    category: 'cultura',
    subcategory: 'musica',
    author: 'Redação',
    authorRole: 'Curadoria Musical',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth10&orientation=squarish',
    date: '2025-10-15',
    readTime: 4,
    image: 'https://readdy.ai/api/search-image?query=person%20listening%20to%20music%20with%20headphones%20vibrant%20vinyl%20records%20on%20wall%20behind%20colorful%20neon%20lighting%20urban%20aesthetic%20editorial%20photography%20warm%20tones%20creative%20space&width=1200&height=600&seq=art10&orientation=landscape',
    featured: false,
    tags: ['música', 'playlist', 'cultura', 'LGBTQ+', 'Brasil', 'artistas'],
    views: 14300,
  },
  {
    id: '11',
    slug: 'casamento-igualitario-brasil',
    title: 'Casamento igualitário no Brasil: 12 anos de história',
    excerpt: 'Uma retrospectiva das conquistas, obstáculos e narrativas de amor que moldaram o direito ao casamento LGBTQ+ desde 2013.',
    content: `
      <p class="lead">Em maio de 2013, o Conselho Nacional de Justiça (CNJ) determinou que cartórios de todo o Brasil deveriam converter uniões estáveis homoafetivas em casamentos civis, caso solicitado. Foi o pontapé inicial de uma revolução silenciosa nas famílias brasileiras. Doze anos depois, o casamento igualitário é realidade consolidada — mas a jornada até aqui foi feita de pequenas batalhas, grandes amores e resistências que persistem.</p>

      <h2>O antes de 2013</h2>
      <p>Antes da resolução do CNJ, casais homoafetivos que queriam se casar enfrentavam um cenário jurídico incerto. Alguns conseguiam autorizações judiciais individuais; outros viajavam para países onde o casamento era legal. A maioria, porém, simplesmente não tinha acesso a essa forma de reconhecimento.</p>
      <p>A união estável, reconhecida pelo Supremo Tribunal Federal desde 2011, oferecia proteção patrimonial, mas não o simbolismo e os direitos plenos do casamento civil.</p>

      <h2>As primeiras histórias</h2>
      <p>No Brasil, estima-se que mais de 120 mil casamentos homoafetivos tenham sido celebrados desde 2013. São Paulo e Rio de Janeiro concentram o maior número, mas o Nordeste mostra crescimento acelerado — especialmente após a regulamentação mais clara dos cartórios nos últimos cinco anos.</p>

      <h2>Desafios que persistem</h2>
      <p>Apesar da legalidade, obstáculos práticos continuam. Em alguns cartórios do interior nordestino, funcionários ainda criam dificuldades — pedindo documentos extras, recorrendo a objeções de consciência ou simplesmente demorando para marcar datas. A falta de capacitação sobre diversidade em órgãos públicos é uma realidade.</p>
      <p>Questões patrimoniais também geram insegurança. A ausência de legislação específica sobre regime de bens para casais homoafetivos faz com que muitos optem por separação total de bens para evitar complicações em caso de separação ou óbito.</p>

      <h2>O amor como ato político</h2>
      <p>Para muitos casais, casar nunca foi apenas uma escolha pessoal — foi um ato político de visibilidade. A resistência a essa visibilidade continua. Grupos conservadores tentam regularmente impugnar a resolução do CNJ ou propor leis que apaguem a existência de famílias homoafetivas. A resposta da comunidade é sempre a mesma: existir, abertamente e sem pedir desculpas.</p>

      <h2>Um futuro de igualdade plena</h2>
      <p>O próximo passo na agenda do casamento igualitário é a aprovação de uma lei específica que regule todos os aspectos do matrimônio homoafetivo, eliminando dependência de decisões judiciais. Além disso, a paternidade/maternidade igualitária — o reconhecimento automático de ambos os cônjuges como pais/mães de filhos nascidos durante o casamento — ainda não é universal no Brasil.</p>
    `,
    category: 'familia',
    subcategory: 'casamento',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth11&orientation=squarish',
    date: '2025-07-05',
    readTime: 8,
    image: 'https://readdy.ai/api/search-image?query=same%20sex%20wedding%20ceremony%20indoor%20venue%20elegant%20warm%20lighting%20floral%20decorations%20romantic%20atmosphere%20editorial%20photography%20natural%20tones%20celebration&width=1200&height=600&seq=art11&orientation=landscape',
    featured: false,
    tags: ['casamento', 'direitos', 'família', 'LGBTQ+', 'história', 'igualdade'],
    views: 16700,
  },
  {
    id: '12',
    slug: 'saude-trans-sus-acesso',
    title: 'Saúde de pessoas trans no SUS: hormonização, cirurgias e desafios',
    excerpt: 'Um panorama completo dos serviços disponíveis, filas de espera e conquistas recentes na assistência à saúde trans pela rede pública.',
    content: `
      <p class="lead">A transição de gênero é um direito humano reconhecido pela Organização Mundial da Saúde e pela legislação brasileira. No entanto, acessar serviços de saúde trans pelo SUS no Brasil ainda é uma jornada marcada por burocracia, filas intermináveis e falta de profissionais capacitados.</p>

      <h2>O que o SUS oferece</h2>
      <p>Pela <strong>Portaria GM/MS nº 2.803/2013</strong>, o SUS garante às pessoas trans acesso integral à saúde, incluindo atendimento multiprofissional, hormonização, cirurgias de redesignação sexual e tratamentos estéticos. Na prática, a oferta varia drasticamente entre estados e municípios.</p>
      <p>A maioria dos serviços está concentrada em hospitais universitários de capitais. Ambulatórios trans atendem cerca de 800 pessoas, com listas de espera que podem chegar a 18 meses para início de hormonização.</p>

      <h2>A fila da hormonização</h2>
      <p>A hormonização — uso de testosterona ou estrogênio para desenvolver características sexuais secundárias do gênero vivido — é o serviço mais demandado. O processo exige avaliação psiquiátrica, endocrinológica e psicológica antes da prescrição, o que gera atrasos significativos. Pacientes relatam que a espera entre a primeira consulta e o início da hormonização pode ultrapassar dois anos. Durante esse período, muitos recorrem ao mercado informal — uma prática perigosa, sem acompanhamento laboratorial.</p>

      <h2>Cirurgias: a promessa e a realidade</h2>
      <p>O SUS oferece cirurgias de redesignação sexual desde 2008, mas a oferta é extremamente limitada. No Brasil, apenas poucos hospitais realizam o procedimento pelo SUS, a maioria no Sudeste. Pessoas trans do Nordeste que desejam cirurgia precisam viajar para outros estados — às próprias custas. A ANTRA estima que mais de 15 mil pessoas trans aguardam cirurgia pelo SUS, com tempo médio de espera de sete anos.</p>

      <h2>Iniciativas regionais</h2>
      <p>Apesar dos gargalos, iniciativas locais trazem esperança. Hospitais universitários de Recife, Salvador e Fortaleza mantêm ambulatórios trans. Projetos de telemedicina propõem teleconsultas para acompanhamento de pacientes em hormonização, reduzindo demanda presencial e acelerando o acesso para o interior.</p>

      <h2>Profissionais de saúde e capacitação</h2>
      <p>A falta de profissionais capacitados é um dos maiores gargalos. Médicos de atenção primária frequentemente desconhecem protocolos de saúde trans ou reproduzem preconceitos que afastam pacientes. O Ministério da Saúde oferece cursos de capacitação, mas a adesão é baixa. ONGs como a Rede Nacional de Saúde de Pessoas Trans promovem oficinas, mas seu alcance é limitado.</p>

      <h2>Olhando para frente</h2>
      <p>O Plano Nacional de Saúde LGBTQ+ estabeleceu metas ambiciosas: reduzir filas de espera para hormonização, ampliar oferta de cirurgias e universalizar o atendimento multiprofissional. O cumprimento dessas metas depende de investimento federal consistente. Para pessoas trans do Nordeste, a saúde pública continua sendo um direito mais no papel do que na prática. Mas cada paciente atendido, cada profissional capacitado e cada política implementada é um passo na direção da dignidade que toda pessoa merece.</p>
    `,
    category: 'saude',
    subcategory: 'saude-trans',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth13&orientation=squarish',
    date: '2025-06-01',
    readTime: 9,
    image: 'https://readdy.ai/api/search-image?query=modern%20hospital%20consultation%20room%20doctor%20and%20patient%20consultation%20warm%20welcoming%20healthcare%20environment%20natural%20light%20professional%20medical%20setting%20editorial%20photography&width=1200&height=600&seq=art13&orientation=landscape',
    featured: false,
    tags: ['saúde trans', 'SUS', 'hormonização', 'cirurgia', 'direitos'],
    views: 21300,
  },
  {
    id: '13',
    slug: 'conteudo-jovens-lgbtq',
    title: 'Conteúdo para jovens LGBTQ+: sua identidade, seu ritmo',
    excerpt: 'Um espaço de acolhimento com respostas para as dúvidas mais comuns de jovens que estão descobrindo sua identidade.',
    content: `
      <p class="lead">Se você tem entre 13 e 17 anos e está descobrindo algo sobre si mesmo — sua orientação sexual, sua identidade de gênero, ou simplesmente que você não se encaixa nas caixinhas que o mundo tentou te colocar — este texto é para você. Não é um manual de regras. É uma conversa. E a primeira coisa que queremos que você saiba: <strong>você não está sozinho</strong>.</p>

      <h2>É normal ter dúvidas</h2>
      <p>Muitos jovens LGBTQ+ passam anos se perguntando se são "normais". A resposta é sim — mas vamos além disso. Normal é apenas uma estatística. O que importa é se você está bem, se se sente inteiro, se consegue ser quem é nos lugares onde passa.</p>
      <p>Não há prazo para descobrir quem você é. Algumas pessoas sabem desde criança. Outras só entendem na faculdade, ou depois dos 30, ou nunca param de descobrir. Todos esses caminhos são válidos.</p>

      <h2>Saindo do armário (ou não)</h2>
      <p>"Sair do armário" é a expressão usada quando alguém conta para outras pessoas que é LGBTQ+. Mas saiba: <strong>você não tem obrigação de contar para ninguém</strong>. Sua segurança emocional e física vem antes de qualquer expectativa.</p>
      <p>Se quiser contar, escolha primeiro alguém em quem confia. Não precisa fazer um anúncio público. Pode ser uma conversa simples, um texto, um áudio. E lembre-se: a reação da outra pessoa é sobre o que ela carrega, não sobre quem você é.</p>

      <h2>Saúde mental e bullying</h2>
      <p>Se está sofrendo bullying na escola, saiba que isso não é sua culpa. Ninguém merece ser humilhado por quem ama ou como se identifica. Documente o que acontece e procure um adulto de confiança: professor, coordenador, psicólogo escolar.</p>
      <p>A escola tem obrigação legal de proteger você. O ECA e a Lei 13.185/2015 garantem que instituições de ensino combatam o bullying. Se a escola não agir, seus pais ou responsáveis podem acionar o Ministério Público.</p>
      <p>Se está se sentindo muito triste, ansioso ou com pensamentos de machucar a si mesmo, <strong>peça ajuda</strong>. O CVV atende 24h pelo 188. O Disque 100 denuncia violações de direitos.</p>

      <h2>Internet e comunidade</h2>
      <p>A internet pode ser um lugar maravilhoso ou perigoso. Para jovens LGBTQ+ de cidades pequenas ou de famílias não aceitantes, pode ser a única janela para encontrar gente como você. Mas também expõe a haters e pessoas mal-intencionadas.</p>
      <p>Dicas de segurança online:</p>
      <ul>
        <li>Nunca revele dados pessoais (endereço, escola, número) para desconhecidos</li>
        <li>Desconfie de adultos que tentam se aproximar de forma excessiva</li>
        <li>Use apelidos em fóruns públicos</li>
        <li>Bloqueie e denuncie conteúdo de ódio</li>
        <li>Conheça pessoas da internet apenas em lugares públicos e avisando alguém de confiança</li>
      </ul>

      <h2>Seus direitos</h2>
      <p>Você tem direito a ser chamado pelo nome que escolheu. Tem direito a usar o banheiro onde se sente seguro. Tem direito a não ser discriminado na escola, na saúde, no trabalho. Tem direito à privacidade sobre sua identidade. Se alguém violar esses direitos, denuncie. O Brasil tem leis que protegem você.</p>

      <h2>Uma mensagem final</h2>
      <p>A adolescência é difícil para todo mundo. Ser LGBTQ+ em um mundo que ainda aprende a nos respeitar adiciona camadas de dificuldade. Mas também adiciona camadas de beleza: você faz parte de uma história de resistência que tem séculos, e de um futuro que será mais justo porque pessoas como você existem.</p>
    `,
    category: 'educacao',
    subcategory: 'jovens',
    author: 'Redação',
    authorRole: 'Portal LGBTQ+',
    authorBio: 'Equipe editorial do Portal LGBTQ+ Nordeste.',
    authorPhoto: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20diverse%20editorial%20team%20in%20modern%20newsroom%20warm%20lighting%20collaborative%20atmosphere%20editorial%20photography%20natural%20tones&width=200&height=200&seq=auth15&orientation=squarish',
    date: '2025-05-20',
    readTime: 7,
    image: 'https://readdy.ai/api/search-image?query=young%20diverse%20teenagers%20sitting%20together%20in%20colorful%20safe%20space%20having%20conversation%20warm%20natural%20light%20welcoming%20environment%20editorial%20photography%20youth%20community&width=1200&height=600&seq=art15&orientation=landscape',
    featured: false,
    tags: ['jovens', 'educação', 'adolescência', 'apoio', 'comunidade', 'direitos'],
    views: 41200,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return allArticles.filter((a) => a.category === category);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, limit);
}

export function getMostViewed(limit = 5): Article[] {
  return [...allArticles].sort((a, b) => b.views - a.views).slice(0, limit);
}

export const categoryLabels: Record<string, string> = {
  opiniao: 'Opinião',
  cultura: 'Cultura',
  saude: 'Saúde',
  familia: 'Família',
  paradas: 'Paradas',
  educacao: 'Educação',
  guia: 'Guia',
  comunidade: 'Comunidade',
};

export const categoryColors: Record<string, string> = {
  opiniao: 'bg-primary-100 text-primary-700',
  cultura: 'bg-secondary-100 text-secondary-700',
  saude: 'bg-accent-100 text-accent-700',
  familia: 'bg-primary-50 text-primary-600',
  paradas: 'bg-secondary-50 text-secondary-600',
  educacao: 'bg-accent-50 text-accent-600',
  guia: 'bg-dark-100 text-dark-600',
  comunidade: 'bg-primary-50 text-primary-600',
};