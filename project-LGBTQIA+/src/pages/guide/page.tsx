
const spaces = [
  {
    name: "Gandaia Bar & Club",
    category: "Bar & Entretenimento",
    address: "Rua Dragão do Mar — Praia de Iracema",
    desc: "Casa de festas LGBTQIA+ em casarões históricos da Praia de Iracema. Três ambientes, duas pistas internas e bar externo. Programação com pop, brasilidades e house. Sedia selos de festas como a famosa 'Fica, Vai Ter Pop!'.",
    tags: ["Noite", "Festas", "DJs"],
    image: "https://readdy.ai/api/search-image?query=vibrant%20nightlife%20bar%20club%20interior%20colorful%20neon%20lighting%20diverse%20crowd%20dancing%20festive%20atmosphere%20LGBTQ%20friendly%20space%20editorial%20photography%20dynamic%20warm%20tones&width=400&height=250&seq=guide1&orientation=landscape",
  },
  {
    name: "Y'all Club",
    category: "Bar & Entretenimento",
    address: "Rua Dragão do Mar — Praia de Iracema",
    desc: "Balada pop e eletrônica na Praia de Iracema. DJs residentes, festas temáticas de funk e pop nacional. Público jovem e vibrante que movimenta os finais de semana.",
    tags: ["Noite", "Pop", "Funk"],
    image: "https://readdy.ai/api/search-image?query=modern%20nightclub%20dance%20floor%20colorful%20laser%20lights%20energetic%20crowd%20young%20people%20dancing%20LGBTQ%20party%20atmosphere%20editorial%20photography%20vibrant%20dynamic&width=400&height=250&seq=guide2&orientation=landscape",
  },
  {
    name: "Moreno's Bar — Divino Domingos",
    category: "Bar & Entretenimento",
    address: "Benfica — Fortaleza, CE",
    desc: "Projeto 'Divino Domingos' mantém viva a cultura drag e transformista tradicional de Fortaleza. Atrai público de diversas gerações aos domingos em ambiente acolhedor.",
    tags: ["Domingo", "Drag", "Cultura"],
    image: "https://readdy.ai/api/search-image?query=cozy%20bar%20interior%20warm%20lighting%20people%20socializing%20sunday%20afternoon%20casual%20atmosphere%20diverse%20community%20gathering%20editorial%20photography%20natural%20warm%20tones&width=400&height=250&seq=guide3&orientation=landscape",
  },
  {
    name: "Centro Dragão do Mar de Arte e Cultura",
    category: "Centro Cultural",
    address: "Rua Dragão do Mar, 81 — Praia de Iracema",
    desc: "Maior complexo cultural da cidade. Ponto histórico de encontro e resistência da comunidade queer. Abriga o Museu da Cultura Cearense, teatros e o Hub Cultural Porto Dragão.",
    tags: ["Cultura", "Arte", "Museu"],
    image: "https://readdy.ai/api/search-image?query=modern%20cultural%20center%20building%20exterior%20contemporary%20architecture%20public%20space%20artistic%20urban%20design%20editorial%20photography%20bright%20natural%20light&width=400&height=250&seq=guide4&orientation=landscape",
  },
  {
    name: "Outra Casa Coletiva",
    category: "ONG & Acolhimento",
    address: "Benfica — Fortaleza, CE",
    desc: "República de acolhimento e centro cultural focado na comunidade LGBTQIAP+. Promove feiras, eventos artísticos e atividades voltadas para cidadania, inclusão e convivência.",
    tags: ["Acolhimento", "Cultura", "Comunidade"],
    image: "https://readdy.ai/api/search-image?query=community%20cultural%20center%20interior%20warm%20welcoming%20space%20people%20gathering%20plants%20natural%20light%20alternative%20creative%20environment%20editorial%20photography%20cozy%20atmosphere&width=400&height=250&seq=guide5&orientation=landscape",
  },
  {
    name: "Sertrans — Hospital Universitário do Ceará (HUC)",
    category: "Saúde",
    address: "Rua Betel, 2021 — Itaperi, Fortaleza",
    desc: "Serviço Ambulatorial Transdisciplinar para Pessoas Transgênero. Atendimento multiprofissional, hormonioterapia, exames e apoio social. Acesso gratuito pelo SUS mediante encaminhamento.",
    tags: ["SUS", "Trans", "Hormonização"],
    image: "https://readdy.ai/api/search-image?query=modern%20hospital%20outpatient%20clinic%20interior%20clean%20bright%20welcoming%20healthcare%20environment%20natural%20light%20professional%20medical%20setting%20editorial%20photography&width=400&height=250&seq=guide6&orientation=landscape",
  },
];

export default function GuidePage() {
  return (
    <main className="w-full bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative w-full h-[380px] md:h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://readdy.ai/api/search-image?query=fortaleza%20ceara%20brazil%20cityscape%20coastal%20aerial%20view%20warm%20sunset%20golden%20light%20tropical%20beach%20urban%20skyline%20editorial%20photography%20vibrant%20warm%20colors&width=1200&height=480&seq=guidehero&orientation=landscape")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
          <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
            Fortaleza, CE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white leading-tight max-w-3xl">
            Guia de <span className="italic text-secondary-300">espaços seguros</span>
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Bares, centros culturais, ONGs e serviços de saúde acolhedores para a comunidade LGBTQ+ em Fortaleza.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pt-10 pb-4">
        <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 md:p-5 flex items-start gap-3 mb-6">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-500 shrink-0">
            <i className="ri-information-line text-lg" aria-hidden="true"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark-700">Guia colaborativo com referências verificadas</p>
            <p className="mt-1 text-xs text-dark-500 leading-relaxed">
              Horários de funcionamento e programação podem variar. Recomendamos confirmar com os espaços antes de visitar.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Todos", "Bar & Entretenimento", "Centro Cultural", "ONG & Acolhimento", "Saúde", "Trabalho"].map(
            (f, i) => (
              <button
                key={f}
                className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${
                  i === 0
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-dark-600 border-dark-200 hover:border-primary-300"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>
      </section>

      {/* Spaces grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {spaces.map((s) => (
            <div
              key={s.name}
              className="group rounded-xl md:rounded-2xl border border-dark-100 bg-white overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="relative w-full h-44 md:h-48 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 text-dark-700 backdrop-blur-sm">
                  {s.category}
                </div>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-dark-800">{s.name}</h3>
                <p className="mt-1 text-xs text-dark-400 flex items-center gap-1">
                  <i className="ri-map-pin-line" aria-hidden="true"></i>
                  {s.address}
                </p>
                <p className="mt-3 text-sm text-dark-500 leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs rounded-full bg-primary-50 text-primary-500 border border-primary-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-dark-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="bg-white rounded-xl md:rounded-2xl border border-dark-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-dark-800">
                Conhece um espaço seguro que não está aqui?
              </h3>
              <p className="mt-2 text-sm text-dark-500 leading-relaxed">
                Nossa equipe verifica cada indicação para garantir que o ambiente seja realmente acolhedor para a comunidade LGBTQ+.
              </p>
            </div>
            <a
              href="mailto:contato@portallgbtq.com.br?subject=Indicação de espaço seguro"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap shrink-0"
            >
              Indicar espaço
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}