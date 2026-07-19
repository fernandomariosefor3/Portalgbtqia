import { Link, useLocation } from 'react-router-dom';

interface PolicyPage {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: Array<{ title: string; paragraphs?: string[]; items?: string[] }>;
}

const pages: Record<string, PolicyPage> = {
  '/politica-editorial': {
    eyebrow: 'Transparência',
    title: 'Política editorial',
    intro: 'Esta política explica como escolhemos, produzimos, revisamos e atualizamos conteúdos da Rede Farol - Portal LGBTQIA+.',
    updated: '15 de julho de 2026',
    sections: [
      { title: 'Nossa missão', paragraphs: ['A Rede Farol produz informação de interesse público, serviço e cultura para pessoas LGBTQIA+ no Nordeste, com linguagem acessível, respeito à diversidade e atenção ao contexto regional. Publicamos jornalismo construtivo para informar, combater a desinformação sem estigmatizar, ampliar direitos e fortalecer redes de cuidado.'] },
      { title: 'Autoria e responsabilidade', items: ['Todo artigo deve identificar autoria, publicação e última atualização.', 'Conteúdos sensíveis devem informar a pessoa responsável pela revisão.', 'Opinião, reportagem, guia e conteúdo patrocinado devem ser identificados de forma clara.', 'Conflitos de interesse relevantes devem ser declarados.'] },
      { title: 'Saúde, direitos e segurança', paragraphs: ['Priorizamos documentos oficiais, legislação vigente, consensos científicos e especialistas identificáveis. Informações médicas não substituem atendimento; orientações jurídicas gerais não substituem análise profissional do caso concreto. Evitamos recomendações clínicas individualizadas e detalhes que possam expor pessoas vulneráveis.'] },
      { title: 'Uso de inteligência artificial', paragraphs: ['Ferramentas de IA podem auxiliar pesquisa inicial, organização ou revisão linguística, mas não são consideradas fonte. Conteúdo com auxílio de IA precisa de revisão humana, checagem das afirmações, regionalização, inclusão de fontes verificáveis e contribuição editorial própria antes da publicação. O uso relevante é informado no artigo.'] },
      { title: 'Originalidade e qualidade', items: ['Não publicamos textos em massa apenas para capturar buscas.', 'Evitamos páginas repetitivas sem informação nova.', 'Buscamos exemplos, serviços, dados e contexto do Nordeste.', 'Atualizamos ou removemos conteúdo que perdeu utilidade ou segurança.'] },
      { title: 'Independência editorial', paragraphs: ['Parcerias, publicidade ou interesses pessoais não podem alterar conclusões editoriais. Eventuais conteúdos comerciais devem ser identificados e não recebem tratamento privilegiado nos resultados editoriais.'] },
    ],
  },
  '/nossas-fontes': {
    eyebrow: 'Metodologia',
    title: 'Nossas fontes',
    intro: 'Veja quais fontes a Rede Farol prioriza e como documentos, dados e entrevistas são usados nos conteúdos.',
    updated: '15 de julho de 2026',
    sections: [
      { title: 'Ordem de prioridade', items: ['Órgãos públicos e documentos oficiais, como Ministério da Saúde, secretarias, tribunais e legislação.', 'Artigos científicos, revisões sistemáticas e diretrizes de sociedades profissionais reconhecidas.', 'Instituições de direitos humanos, universidades e organizações com metodologia pública.', 'Especialistas identificados e pessoas diretamente envolvidas, com contexto sobre sua atuação.', 'Veículos jornalísticos confiáveis como apoio, sempre buscando a fonte primária da informação.'] },
      { title: 'Como citamos', paragraphs: ['Sempre que possível, informamos o título do documento, a instituição responsável e um link direto. Dados que mudam com frequência devem indicar o período de referência. Links promocionais, páginas sem autoria e conteúdos gerados por IA não são tratados como evidência.'] },
      { title: 'Fontes locais e vivências', paragraphs: ['Relatos e experiências ajudam a representar a realidade regional, mas não substituem evidência científica ou documentação oficial. Preservamos a identidade de fontes vulneráveis quando a exposição puder causar risco e explicamos ao leitor quando uma fonte precisa permanecer anônima.'] },
      { title: 'Avaliação contínua', paragraphs: ['Links, leis, protocolos de saúde e serviços podem mudar. Revemos conteúdos prioritários e aceitamos alertas de leitores por meio da nossa política de correções.'] },
    ],
  },
  '/politica-de-correcoes': {
    eyebrow: 'Prestação de contas',
    title: 'Política de correções',
    intro: 'Erros devem ser corrigidos de forma clara, proporcional e transparente.',
    updated: '15 de julho de 2026',
    sections: [
      { title: 'Como solicitar uma correção', paragraphs: ['Envie um e-mail para contato@redefarol.com.br com o assunto “Correção”, incluindo o endereço da página, o trecho questionado, a justificativa e, se possível, documentos que sustentem a solicitação. Não envie dados pessoais sensíveis que não sejam indispensáveis.'] },
      { title: 'Como analisamos', items: ['Conferimos a publicação original e as fontes disponíveis.', 'Consultamos documentos ou especialistas quando o tema exigir.', 'Corrigimos erros factuais assim que confirmados.', 'Pedidos de opinião ou discordância editorial são avaliados, mas não implicam alteração automática.'] },
      { title: 'Como sinalizamos mudanças', paragraphs: ['Correções materiais recebem uma nota no artigo e atualizam a data de modificação. Ajustes apenas ortográficos ou de formatação podem ser feitos sem nota. Se um conteúdo não puder ser corrigido com segurança, ele poderá ser retirado do ar com explicação apropriada.'] },
      { title: 'Direito de resposta', paragraphs: ['Pessoas ou organizações diretamente citadas podem apresentar esclarecimentos. A publicação de resposta considera relevância pública, evidências e segurança das pessoas envolvidas.'] },
    ],
  },
  '/contato': {
    eyebrow: 'Fale conosco',
    title: 'Contato',
    intro: 'Use nossos canais para pautas, correções, parcerias responsáveis e dúvidas sobre a Rede Farol.',
    updated: '15 de julho de 2026',
    sections: [
      { title: 'E-mail', paragraphs: ['Escreva para contato@redefarol.com.br. Para agilizar a triagem, use no assunto: “Pauta”, “Correção”, “Privacidade”, “Parceria” ou “Problema técnico”.'] },
      { title: 'Correções e privacidade', paragraphs: ['Para corrigir uma publicação, inclua o link e a evidência relevante. Para solicitações de privacidade, informe apenas os dados necessários para localizar o registro e confirmar sua identidade.'] },
      { title: 'Situações de emergência', paragraphs: ['Este canal não presta atendimento emergencial ou clínico. Em risco imediato, procure os serviços públicos de emergência e os contatos reunidos na página SOS.'] },
    ],
  },
  '/privacidade': {
    eyebrow: 'Seus dados',
    title: 'Política de privacidade',
    intro: 'Explicamos de forma direta quais dados podem ser tratados e para quais finalidades.',
    updated: '15 de julho de 2026',
    sections: [
      { title: 'Dados que podemos receber', items: ['Dados de conta e autenticação quando você acessa áreas restritas.', 'Informações enviadas voluntariamente em formulários, eventos, avaliações ou pedidos de contato.', 'Dados técnicos básicos, como endereço IP, navegador, registros de segurança e funcionamento.'] },
      { title: 'Finalidades', items: ['Operar, proteger e melhorar o portal.', 'Responder solicitações e moderar contribuições.', 'Prevenir abuso, fraude e incidentes de segurança.', 'Cumprir obrigações legais e proteger direitos.'] },
      { title: 'Serviços contratados', paragraphs: ['O portal utiliza infraestrutura de terceiros, como Firebase e Vercel, que podem tratar dados técnicos para autenticação, banco de dados, hospedagem e segurança conforme seus próprios termos. Não vendemos dados pessoais.'] },
      { title: 'Retenção e segurança', paragraphs: ['Mantemos dados pelo período necessário às finalidades informadas e adotamos controles técnicos e administrativos compatíveis com o projeto. Nenhum sistema é totalmente imune a incidentes; por isso, evitamos solicitar dados sensíveis desnecessários.'] },
      { title: 'Seus direitos', paragraphs: ['Você pode pedir confirmação de tratamento, acesso, correção ou exclusão quando aplicável. Envie a solicitação para contato@redefarol.com.br com o assunto “Privacidade”. Podemos solicitar confirmação de identidade para proteger seus dados.'] },
      { title: 'Crianças e adolescentes', paragraphs: ['Não solicitamos deliberadamente dados de crianças sem base legal e proteção adequada. Responsáveis podem comunicar cadastros ou exposições indevidas pelo canal de privacidade.'] },
    ],
  },
  '/termos-de-uso': {
    eyebrow: 'Regras de uso',
    title: 'Termos de uso',
    intro: 'Ao utilizar o portal, você concorda com estas regras de acesso, participação e responsabilidade.',
    updated: '15 de julho de 2026',
    sections: [
      { title: 'Finalidade informativa', paragraphs: ['O conteúdo é oferecido para informação, educação e serviço público. Materiais de saúde não substituem atendimento profissional; informações sobre direitos não constituem aconselhamento jurídico individual.'] },
      { title: 'Uso permitido', items: ['Acessar e compartilhar links para fins pessoais, educativos e não discriminatórios.', 'Enviar contribuições verdadeiras, relevantes e que respeitem direitos de terceiros.', 'Citar trechos curtos com crédito e link para a publicação original.'] },
      { title: 'Condutas proibidas', items: ['Assédio, discurso de ódio, exposição de dados pessoais ou incentivo à violência.', 'Tentativas de acesso indevido, automação abusiva ou interferência no funcionamento do serviço.', 'Envio de conteúdo falso, ilícito ou que viole propriedade intelectual.'] },
      { title: 'Contribuições de usuários', paragraphs: ['Ao enviar conteúdo, você declara ter autorização para fazê-lo. A Rede Farol pode moderar, editar, rejeitar ou remover contribuições para proteger a comunidade e cumprir esta política, sem obrigação de publicação.'] },
      { title: 'Links externos e disponibilidade', paragraphs: ['Links externos são fornecidos como referência; não controlamos seu conteúdo ou disponibilidade. O portal pode mudar, interromper recursos ou atualizar estes termos para manter segurança e conformidade.'] },
      { title: 'Direitos autorais', paragraphs: ['Textos, identidade visual e materiais próprios são protegidos pela legislação aplicável. Usos além das exceções legais dependem de autorização. Conteúdos de terceiros permanecem sujeitos aos direitos de seus titulares.'] },
    ],
  },
};

export default function InstitutionalPage() {
  const { pathname } = useLocation();
  const page = pages[pathname] || pages['/politica-editorial'];

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16 px-4 md:px-6">
      <article className="max-w-4xl mx-auto">
        <header className="rounded-2xl bg-dark-700 px-6 py-10 md:px-12 md:py-14 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">{page.eyebrow}</span>
          <h1 className="mt-3 text-3xl md:text-5xl font-playfair font-bold">{page.title}</h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-white/75">{page.intro}</p>
          <p className="mt-5 text-xs text-white/50">Última atualização: {page.updated}</p>
        </header>

        <div className="mt-8 rounded-2xl border border-dark-100 bg-white p-6 md:p-10">
          <div className="space-y-10">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl md:text-2xl font-playfair font-bold text-dark-700">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-base leading-7 text-dark-600">{paragraph}</p>
                ))}
                {section.items && (
                  <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-dark-600">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {pathname === '/contato' && (
            <div className="mt-10 flex flex-wrap gap-3 border-t border-dark-100 pt-8">
              <a href="mailto:contato@redefarol.com.br" className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400">
                Enviar e-mail
              </a>
              <Link to="/sos" className="rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400">
                Ver contatos de emergência
              </Link>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
