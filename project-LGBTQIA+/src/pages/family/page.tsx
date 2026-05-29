import { Link } from "react-router-dom";

const topics = [
  {
    icon: "ri-parent-line",
    title: "Homoparentalidade",
    desc: "Direitos, adoção por casais do mesmo sexo, reconhecimento de famílias homoafetivas e os avanços legislativos no Brasil.",
    link: "/artigos/homoparentalidade-direitos-brasil",
  },
  {
    icon: "ri-user-heart-line",
    title: "Apoio para familiares",
    desc: "Como apoiar um filho, irmão ou parente LGBTQ+. Recursos para pais e mães em processo de aceitação e compreensão.",
    link: "/artigos",
  },
  {
    icon: "ri-home-heart-line",
    title: "Casamento igualitário",
    desc: "Tudo sobre o casamento civil entre pessoas do mesmo sexo no Brasil desde 2013: direitos, deveres e questões práticas.",
    link: "/artigos/casamento-igualitario-brasil",
  },
  {
    icon: "ri-heart-add-line",
    title: "Adoção e guarda",
    desc: "Processo de adoção por casais LGBTQ+, guarda compartilhada e os desafios do sistema de acolhimento brasileiro.",
    link: "/artigos",
  },
  {
    icon: "ri-group-line",
    title: "Famílias trans",
    desc: "Apoio a famílias com pessoas trans e não-binárias. Nomes sociais, identidade de gênero e relacionamentos afetivos.",
    link: "/artigos",
  },
  {
    icon: "ri-book-open-line",
    title: "Materiais para escolas",
    desc: "Guias para educadores sobre diversidade familiar, bullying homofóbico e inclusão de famílias LGBTQ+ na escola.",
    link: "/artigos",
  },
];

export default function FamilyPage() {
  return (
    <main className="w-full bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative w-full h-[380px] md:h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://readdy.ai/api/search-image?query=diverse%20family%20with%20children%20playing%20in%20park%20warm%20golden%20hour%20sunlight%20tender%20authentic%20moment%20editorial%20photography%20inclusive%20family%20love%20and%20happiness%20natural%20scene%20soft%20colors&width=1200&height=480&seq=famhero&orientation=landscape")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
          <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
            Família
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white leading-tight max-w-3xl">
            Famílias <span className="italic text-secondary-300">diversas</span>, amores <span className="italic text-secondary-300">iguais</span>
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Apoio, informação e recursos para famílias LGBTQ+ e seus entes queridos no Nordeste do Brasil.
          </p>
        </div>
      </section>

      {/* Topics grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
            Temas essenciais
          </h2>
          <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
            Conteúdo jurídico, psicológico e prático para fortalecer vínculos familiares e garantir direitos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {topics.map((t) => (
            <Link
              key={t.title}
              to={t.link}
              className="group rounded-xl md:rounded-2xl border border-dark-100 bg-white p-5 md:p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <i className={`${t.icon} text-xl`}></i>
              </div>
              <h3 className="mt-4 text-base md:text-lg font-semibold text-dark-800 group-hover:text-primary-500 transition-colors">
                {t.title}
              </h3>
              <p className="mt-2 text-sm text-dark-500 leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-dark-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="bg-white rounded-xl md:rounded-2xl border border-dark-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-dark-800">
                Precisa de orientação jurídica sobre direitos de família?
              </h3>
              <p className="mt-2 text-sm text-dark-500 leading-relaxed">
                Artigos sobre adoção, reconhecimento de união estável, partilha de bens e guarda compartilhada estão disponíveis na seção Artigos.
              </p>
            </div>
            <Link
              to="/artigos"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors whitespace-nowrap shrink-0"
            >
              Ver artigos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}