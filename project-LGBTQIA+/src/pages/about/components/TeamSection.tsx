export default function TeamSection() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-primary-50 text-primary-500 border border-primary-100 mb-5">
            Colaboração
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
            Faça parte do projeto
          </h2>
          <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
            Este portal é um projeto colaborativo em construção. Aceitamos
            propostas de artigos, cobertura de eventos, indicações de espaços
            seguros e parcerias com organizações da comunidade LGBTQ+.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto">
          <div className="rounded-xl md:rounded-2xl border border-dark-100 bg-white p-5 md:p-6 text-center">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500 mx-auto">
              <i className="ri-article-line text-xl"></i>
            </div>
            <h3 className="mt-4 text-base font-semibold text-dark-800">
              Envie um artigo
            </h3>
            <p className="mt-2 text-sm text-dark-500 leading-relaxed">
              Textos de opinião, reportagens e guias sobre cultura, saúde,
              direitos e família.
            </p>
          </div>

          <div className="rounded-xl md:rounded-2xl border border-dark-100 bg-white p-5 md:p-6 text-center">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-secondary-50 text-secondary-500 mx-auto">
              <i className="ri-map-pin-add-line text-xl"></i>
            </div>
            <h3 className="mt-4 text-base font-semibold text-dark-800">
              Indique um espaço
            </h3>
            <p className="mt-2 text-sm text-dark-500 leading-relaxed">
              Bares, centros culturais, ONGs e serviços de saúde acolhedores no
              Nordeste.
            </p>
          </div>

          <div className="rounded-xl md:rounded-2xl border border-dark-100 bg-white p-5 md:p-6 text-center">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent-50 text-accent-500 mx-auto">
              <i className="ri-calendar-event-line text-xl"></i>
            </div>
            <h3 className="mt-4 text-base font-semibold text-dark-800">
              Divulgue um evento
            </h3>
            <p className="mt-2 text-sm text-dark-500 leading-relaxed">
              Paradas, festas, rodas de conversa, oficinas e encontros da
              comunidade.
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-14 bg-dark-50 rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-dark-800">
              Quer colaborar com o portal?
            </h3>
            <p className="mt-1 text-sm text-dark-500 leading-relaxed">
              Recebemos propostas de artigos, cobertura de eventos, parcerias e
              voluntariado.
            </p>
          </div>
          <a
            href="mailto:contato@portallgbtq.com.br"
            className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors whitespace-nowrap shrink-0"
          >
            Enviar proposta
          </a>
        </div>
      </div>
    </section>
  );
}