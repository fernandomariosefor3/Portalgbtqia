
const parades = [
  {
    name: "Parada LGBTQ+ de Fortaleza",
    city: "Fortaleza, CE",
    month: "Junho",
    image: "https://readdy.ai/api/search-image?query=pride%20parade%20marchers%20rainbow%20flags%20confetti%20joyful%20crowd%20street%20celebration%20warm%20sunlight%20editorial%20photography%20vibrant%20dynamic%20inclusive%20atmosphere&width=400&height=220&seq=prade1&orientation=landscape",
  },
  {
    name: "Parada LGBTQ+ de Recife",
    city: "Recife, PE",
    month: "Setembro",
    image: "https://readdy.ai/api/search-image?query=recife%20brazil%20pride%20parade%20marchers%20colorful%20rainbow%20flags%20warm%20tropical%20sunlight%20editorial%20photography%20vibrant%20urban%20celebration%20inclusive&width=400&height=220&seq=prade2&orientation=landscape",
  },
  {
    name: "Parada LGBTQ+ de Salvador",
    city: "Salvador, BA",
    month: "Setembro",
    image: "https://readdy.ai/api/search-image?query=salvador%20brazil%20pride%20parade%20crowd%20celebration%20colorful%20flags%20street%20festival%20warm%20sunlight%20editorial%20photography%20vibrant%20dynamic%20inclusive&width=400&height=220&seq=prade3&orientation=landscape",
  },
  {
    name: "Parada LGBTQ+ de São Luís",
    city: "São Luís, MA",
    month: "Julho",
    image: "https://readdy.ai/api/search-image?query=brazil%20pride%20parade%20marchers%20rainbow%20flags%20confetti%20street%20celebration%20warm%20sunlight%20editorial%20photography%20vibrant%20dynamic%20inclusive%20crowd&width=400&height=220&seq=prade4&orientation=landscape",
  },
];

const dates = [
  { day: "17 de maio", name: "Dia Internacional de Luta Contra a Homofobia, Transfobia e Bifobia", color: "bg-primary-400" },
  { day: "28 de junho", name: "Dia do Orgulho LGBTQ+", color: "bg-secondary-400" },
  { day: "23 de setembro", name: "Dia da Visibilidade Bissexual", color: "bg-accent-400" },
  { day: "29 de agosto", name: "Dia Nacional da Visibilidade Lésbica", color: "bg-primary-500" },
  { day: "20 de novembro", name: "Dia da Consciência Negra", color: "bg-dark-500" },
  { day: "8 de março", name: "Dia Internacional da Mulher", color: "bg-secondary-500" },
  { day: "29 de janeiro", name: "Dia Nacional da Visibilidade Trans", color: "bg-accent-500" },
  { day: "26 de outubro", name: "Dia da Visibilidade Intersexual", color: "bg-primary-400" },
];

export default function ParadesPage() {
  return (
    <main className="w-full bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative w-full h-[380px] md:h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://readdy.ai/api/search-image?query=large%20pride%20parade%20crowd%20in%20street%20rainbow%20flags%20waving%20warm%20sunset%20light%20joyful%20celebration%20editorial%20photography%20vibrant%20dynamic%20inclusive%20urban%20scene&width=1200&height=480&seq=pradhero&orientation=landscape")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
          <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
            Agenda
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white leading-tight max-w-3xl">
            Paradas e <span className="italic text-secondary-300">datas de visibilidade</span>
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Calendário das principais paradas LGBTQ+ do Nordeste e datas de conscientização ao longo do ano.
          </p>
        </div>
      </section>

      {/* Parades */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
            Paradas no Nordeste
          </h2>
          <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
            Os maiores eventos de visibilidade e celebração da comunidade LGBTQ+ na região.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {parades.map((p) => (
            <div
              key={p.name}
              className="group rounded-xl md:rounded-2xl border border-dark-100 bg-white overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="relative w-full h-40 md:h-44 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 text-dark-700 backdrop-blur-sm">
                  {p.month}
                </div>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-sm md:text-base font-semibold text-dark-800">{p.name}</h3>
                <p className="mt-1 text-xs text-dark-400">{p.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visibility dates */}
      <section className="w-full bg-dark-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
              Datas de visibilidade
            </h2>
            <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
              Acompanhe as datas de conscientização e luta ao longo de todo o ano.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {dates.map((d) => (
              <div
                key={d.name}
                className="rounded-xl border border-dark-100 bg-white p-4 md:p-5 flex flex-col items-start"
              >
                <span className={`w-3 h-3 rounded-full ${d.color} mb-3`}></span>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{d.day}</p>
                <p className="mt-1 text-sm font-medium text-dark-700 leading-snug">{d.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="bg-white rounded-xl md:rounded-2xl border border-dark-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-dark-800">
              Quer divulgar um evento ou parada na região?
            </h3>
            <p className="mt-2 text-sm text-dark-500 leading-relaxed">
              Envie as informações para nossa equipe editorial e ajude a manter o calendário sempre atualizado.
            </p>
          </div>
          <a
            href="mailto:contato@portallgbtq.com.br?subject=Divulgação de parada/evento"
            className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors whitespace-nowrap shrink-0"
          >
            Enviar evento
          </a>
        </div>
      </section>
    </main>
  );
}