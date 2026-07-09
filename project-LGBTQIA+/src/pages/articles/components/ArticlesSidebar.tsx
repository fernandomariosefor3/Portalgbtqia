export default function ArticlesSidebar() {
  const allTags = [
    'política', 'trans', 'cinema', 'saúde', 'família', 'cultura',
    'drag', 'PrEP', 'adoção', 'direitos', 'jovens', 'história',
    'Nordeste', 'Fortaleza', 'LGBTQ+', 'guia', 'música',
  ];

  return (
    <aside className="space-y-8">
      <div className="bg-white rounded-xl border border-dark-100 p-5">
        <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
          Tags populares
        </h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs bg-dark-50 text-dark-500 hover:bg-primary-50 hover:text-primary-500 transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-primary-500 p-5 text-white">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 mb-3">
          <i className="ri-mail-line text-lg" aria-hidden="true"></i>
        </div>
        <h4 className="text-base font-playfair font-bold mb-2">
          Newsletter semanal
        </h4>
        <p className="text-sm text-white/80 leading-relaxed mb-4">
          Receba os melhores artigos, guias e dicas direto no seu e-mail.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-white text-primary-500 hover:bg-white/90 transition-colors whitespace-nowrap"
        >
          Inscrever-se
          <i className="ri-arrow-right-line" aria-hidden="true"></i>
        </a>
      </div>
    </aside>
  );
}
