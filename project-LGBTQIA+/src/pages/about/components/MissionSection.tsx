import { Link } from "react-router-dom";

export default function MissionSection() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-primary-50 text-primary-500 border border-primary-100 mb-5">
              Nossa história
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
              Um projeto de informação e{" "}
              <span className="italic text-primary-500">voz própria</span>
            </h2>
            <p className="mt-5 text-sm md:text-base text-dark-500 leading-relaxed">
              Este portal é uma iniciativa digital dedicada a reunir e
              compartilhar informações de qualidade sobre cultura, saúde,
              direitos e comunidade para a população LGBTQ+ no Nordeste do
              Brasil. Nosso objetivo é tornar visíveis as narrativas,
              resistências e conquistas de cidades como Fortaleza, Recife,
              Salvador e Natal — que muitas vezes não recebem a atenção
              proporcional que merecem.
            </p>
            <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
              O conteúdo é produzido com base em fontes verificáveis e
              revisado para garantir precisão. Buscamos combinar cobertura
              jornalística, produção cultural e acolhimento comunitário em uma
              única plataforma acessível a todos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/artigos"
                className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap"
              >
                Explorar conteúdo
              </Link>
              <Link
                to="/eventos"
                className="px-6 py-3 text-sm font-semibold rounded-full border border-dark-200 text-dark-700 hover:bg-dark-50 transition-colors whitespace-nowrap"
              >
                Fazer parte
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=diverse%20group%20of%20young%20brazilian%20people%20gathered%20around%20table%20working%20on%20laptops%20and%20notebooks%20collaborative%20editorial%20meeting%20warm%20natural%20light%20indoor%20cozy%20modern%20workspace%20inclusive%20environment&width=600&height=450&seq=about1&orientation=landscape"
                alt="Equipe colaborativa do Portal LGBTQ+ em reunião editorial"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-5 max-w-[260px]">
              <p className="text-xs text-dark-400 leading-relaxed italic">
                "Nosso compromisso é dar voz a quem historicamente foi
                silenciado pelas narrativas dominantes."
              </p>
              <p className="mt-2 text-xs font-semibold text-dark-700">
                — Propósito do projeto
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}