const values = [
  {
    icon: "ri-shield-check-line",
    title: "Verificação e rigor",
    description:
      "Todo conteúdo de saúde é revisado por profissionais da área. Dados e estatísticas citam sempre a fonte primária. Não publicamos desinformação.",
    color: "primary",
  },
  {
    icon: "ri-group-line",
    title: "Pluralidade de vozes",
    description:
      "Nosso editorial reflete a diversidade da comunidade LGBTQ+: diferentes gêneros, sexualidades, raças, classes e territórios. Nenhuma identidade é apagada.",
    color: "secondary",
  },
  {
    icon: "ri-heart-pulse-line",
    title: "Acolhimento primeiro",
    description:
      "Priorizamos o bem-estar emocional dos leitores. Conteúdos sensíveis trazem avisos de gatilho e recursos de apoio. Nosso fórum é moderado 24 horas.",
    color: "accent",
  },
  {
    icon: "ri-lightbulb-flash-line",
    title: "Inovação editorial",
    description:
      "Experimentamos formatos: reportagens multimídia, podcasts, newsletters e eventos presenciais. A informação viva se adapta às necessidades da comunidade.",
    color: "primary",
  },
  {
    icon: "ri-hand-heart-line",
    title: "Independência e transparência",
    description:
      "Somos um projeto independente. Nossos financiadores e parceiros são sempre declarados. Editorial e comercial caminham separados, sem interferência.",
    color: "secondary",
  },
  {
    icon: "ri-global-line",
    title: "Você também é o portal",
    description:
      "Aceitamos colaborações da comunidade: artigos de opinião, indicações de eventos e denúncias. Nossa equipe de moderação garante respeito e qualidade.",
    color: "accent",
  },
];

const colorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  primary: {
    bg: "bg-primary-50",
    text: "text-primary-500",
    border: "border-primary-100",
  },
  secondary: {
    bg: "bg-secondary-50",
    text: "text-secondary-500",
    border: "border-secondary-100",
  },
  accent: {
    bg: "bg-accent-50",
    text: "text-accent-500",
    border: "border-accent-100",
  },
};

export default function ValuesSection() {
  return (
    <section className="w-full bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-white text-dark-600 border border-dark-100 mb-5">
            Valores editoriais
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
            O que nos guia em cada publicação
          </h2>
          <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
            Nossos valores editoriais não estão apenas no papel. Eles ditam
            escolhas diárias: de pauta, de linguagem, de imagem e de relação com
            leitores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {values.map((v) => {
            const c = colorMap[v.color];
            return (
              <div
                key={v.title}
                className={`rounded-xl md:rounded-2xl border ${c.border} bg-white p-5 md:p-6 hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-11 h-11 flex items-center justify-center rounded-xl ${c.bg} ${c.text}`}
                >
                  <i className={`${v.icon} text-xl`}></i>
                </div>
                <h3 className="mt-4 text-base md:text-lg font-semibold text-dark-800">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-dark-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}