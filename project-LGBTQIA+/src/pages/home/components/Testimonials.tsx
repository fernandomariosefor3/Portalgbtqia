const purposes = [
  {
    icon: "ri-heart-pulse-line",
    title: "Saúde e prevenção",
    desc: "Informações claras sobre PrEP, PEP, saúde trans, terapia afirmativa e acesso ao SUS. Conteúdo baseado em protocolos do Ministério da Saúde.",
    color: "text-primary-500",
    bg: "bg-primary-50",
  },
  {
    icon: "ri-book-open-line",
    title: "Direitos e família",
    desc: "Orientação sobre casamento igualitário, adoção homoparental, nome social, identidade de gênero e legislação brasileira vigente.",
    color: "text-secondary-500",
    bg: "bg-secondary-50",
  },
  {
    icon: "ri-map-pin-line",
    title: "Espaços e comunidade",
    desc: "Guia de locais acolhedores em Fortaleza e região: bares, centros culturais, serviços de saúde e ONGs verificadas pela comunidade.",
    color: "text-accent-500",
    bg: "bg-accent-50",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-surface-cream py-14 md:py-20 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-accent-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-400"></span>
            Nosso propósito
          </span>
          <h2 className="mt-3 text-2xl md:text-4xl font-playfair font-bold text-dark-700">
            Por que este portal existe
          </h2>
          <p className="mt-3 text-base text-dark-400 max-w-xl mx-auto">
            Reunimos informação de qualidade, espaços verificados e recursos de apoio para fortalecer a comunidade LGBTQ+ no Nordeste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {purposes.map((p) => (
            <div
              key={p.title}
              className="flex flex-col p-5 md:p-6 rounded-xl bg-white shadow-sm"
            >
              <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${p.bg} ${p.color} mb-4`}>
                <i className={`${p.icon} text-xl`}></i>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-dark-800">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-dark-500 leading-relaxed flex-1">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}