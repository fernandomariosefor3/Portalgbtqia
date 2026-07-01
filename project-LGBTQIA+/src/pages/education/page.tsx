import { Link } from "react-router-dom";

const glossary = [
  { term: "LGBTQ+", def: "Sigla que representa lésbicas, gays, bissexuais, transexuais, queer e outras identidades de gênero e sexualidade." },
  { term: "Cisgênero", def: "Pessoa cuja identidade de gênero corresponde ao sexo designado ao nascer." },
  { term: "Transgênero", def: "Pessoa cuja identidade de gênero difere do sexo designado ao nascer." },
  { term: "Não-binário", def: "Identidade de gênero que não se encaixa exclusivamente nas categorias masculina ou feminina." },
  { term: "Intersexual", def: "Pessoa que nasce com características sexuais que não se encaixam nas definições típicas de masculino ou feminino." },
  { term: "Pansexual", def: "Atração romântica ou sexual por pessoas independentemente de seu gênero." },
  { term: "Assexual", def: "Pessoa que experimenta pouca ou nenhuma atração sexual por outras pessoas." },
  { term: "PrEP", def: "Profilaxia Pré-Exposição — medicamento para prevenção da infecção pelo HIV." },
  { term: "PEP", def: "Profilaxia Pós-Exposição — medicamento tomado após possível contato com o HIV para prevenir infecção." },
  { term: "Nome social", def: "Nome pelo qual uma pessoa trans ou travesti deseja ser chamada no ambiente social e profissional." },
];

const materials = [
  {
    title: "História do movimento LGBTQ+ no Brasil",
    desc: "Do século XIX aos dias de hoje: as organizações, as leis e as conquistas que moldaram os direitos da comunidade.",
    link: "/artigos/historia-movimento-lgbtq-brasil",
    icon: "ri-history-line",
  },
  {
    title: "Como usar pronomes corretamente",
    desc: "Guia prático para respeitar e usar os pronomes de cada pessoa no ambiente de trabalho, escola e vida social.",
    link: "/artigos",
    icon: "ri-chat-quote-line",
  },
  {
    title: "Marco Legal da Identidade de Gênero",
    desc: "Entenda como o Brasil reconhece o direito à retificação de nome e gênero em documentos oficiais.",
    link: "/artigos",
    icon: "ri-scales-3-line",
  },
  {
    title: "Estatísticas sobre diversidade sexual",
    desc: "Dados oficiais sobre população LGBTQ+ no Brasil, Nordeste e Ceará com fontes do IBGE e Ministério da Saúde.",
    link: "/artigos",
    icon: "ri-bar-chart-2-line",
  },
];

export default function EducationPage() {
  return (
    <main className="w-full bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative w-full h-[380px] md:h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://readdy.ai/api/search-image?query=open%20books%20stacked%20on%20wooden%20desk%20with%20reading%20lamp%20warm%20soft%20light%20cozy%20study%20atmosphere%20editorial%20photography%20educational%20setting%20minimal%20elegant%20composition&width=1200&height=480&seq=edhero&orientation=landscape")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
          <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
            Aprenda
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white leading-tight max-w-3xl">
            Educação e <span className="italic text-secondary-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">glossário</span>
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Conteúdo educativo, glossário completo e materiais para todas as idades sobre identidade, sexualidade e direitos.
          </p>
        </div>
      </section>

      {/* Glossary */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
            Glossário LGBTQ+
          </h2>
          <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
            Termos essenciais para entender e respeitar a diversidade de identidades e orientações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {glossary.map((g) => (
            <div
              key={g.term}
              className="rounded-xl border border-dark-100 bg-white p-4 md:p-5"
            >
              <h3 className="text-sm md:text-base font-semibold text-dark-800">{g.term}</h3>
              <p className="mt-1 text-sm text-dark-500 leading-relaxed">{g.def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Educational materials */}
      <section className="w-full bg-dark-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
              Materiais educativos
            </h2>
            <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
              Artigos, guias e recursos para escolas, empresas e famílias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {materials.map((m) => (
              <Link
                key={m.title}
                to={m.link}
                className="group rounded-xl md:rounded-2xl border border-dark-100 bg-white p-5 md:p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <i className={`${m.icon} text-xl`}></i>
                </div>
                <h3 className="mt-4 text-base md:text-lg font-semibold text-dark-800 group-hover:text-primary-500 transition-colors">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-dark-500 leading-relaxed">{m.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="bg-white rounded-xl md:rounded-2xl border border-dark-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-dark-800">
              Tem uma dúvida sobre terminologia ou identidade?
            </h3>
            <p className="mt-2 text-sm text-dark-500 leading-relaxed">
              Nossa equipe editorial está sempre atualizando o glossário. Envie sugestões de termos ou correções.
            </p>
          </div>
          <a
            href="mailto:contato@portallgbtq.com.br?subject=Sugestão de glossário"
            className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap shrink-0"
          >
            Enviar sugestão
          </a>
        </div>
      </section>
    </main>
  );
}