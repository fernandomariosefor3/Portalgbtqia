export default function TeamSection() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">

        {/* Fundador */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-primary-50 text-primary-500 border border-primary-100">
              Fundador
            </span>
          </div>
          <div className="rounded-2xl border border-dark-100 bg-gradient-to-br from-white to-primary-50 p-8 md:p-10 flex flex-col sm:flex-row items-center gap-7">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-4xl flex-shrink-0 shadow-lg">
              <i className="ri-user-heart-line" aria-hidden="true"></i>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl md:text-2xl font-playfair font-bold text-dark-800">
                Fernando Mário da Silva Martins
              </h3>
              <p className="text-sm font-medium text-primary-500 mt-1 mb-3">
                Fundador & Editor — @nando_apollo
              </p>
              <p className="text-sm text-dark-500 leading-relaxed">
                Criador do Portal LGBTQ+ Nordeste, espaço digital dedicado à
                informação, cultura e acolhimento da comunidade LGBTQIA+ no Brasil,
                com foco especial na região Nordeste e em Fortaleza, Ceará.
              </p>
              <div className="flex items-center gap-3 mt-4 justify-center sm:justify-start">
                <a
                  href="https://instagram.com/nando_apollo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <i className="ri-instagram-line text-base" aria-hidden="true"></i>
                  @nando_apollo
                </a>
                <span className="text-dark-200">·</span>
                <a
                  href="mailto:fernandomariodasmartins@gmail.com"
                  className="flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <i className="ri-mail-line text-base" aria-hidden="true"></i>
                  Contato
                </a>
              </div>
            </div>
          </div>
        </div>

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
              <i className="ri-article-line text-xl" aria-hidden="true"></i>
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
              <i className="ri-map-pin-add-line text-xl" aria-hidden="true"></i>
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
              <i className="ri-calendar-event-line text-xl" aria-hidden="true"></i>
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