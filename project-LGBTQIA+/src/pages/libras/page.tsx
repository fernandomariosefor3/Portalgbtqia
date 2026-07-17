const librasVideos = [
  {
    id: 1,
    title: 'Prevenção e PrEP em Libras',
    category: 'Saúde Sexual',
    duration: 'Em produção',
    color: 'bg-primary-200',
  },
  {
    id: 2,
    title: 'Direitos básicos: Nome Social',
    category: 'Meus Direitos',
    duration: 'Em produção',
    color: 'bg-secondary-200',
  },
  {
    id: 3,
    title: 'Como denunciar LGBTfobia',
    category: 'Segurança',
    duration: 'Em produção',
    color: 'bg-red-200',
  },
  {
    id: 4,
    title: 'Glossário LGBTQIA+ em Libras',
    category: 'Cultura Surda',
    duration: 'Em produção',
    color: 'bg-purple-200',
  },
];

export default function LibrasPage() {
  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      {/* Banner de Demonstração */}
      <div className="w-full bg-amber-500 text-dark-900 text-center py-2 px-4 shadow-md flex items-center justify-center gap-2">
        <i className="ri-error-warning-fill text-lg"></i>
        <span className="text-xs md:text-sm font-bold uppercase tracking-wide">
          Demonstração visual. Funcionalidade em fase de desenvolvimento.
        </span>
      </div>

      <section className="relative w-full bg-secondary-900 px-4 md:px-6 lg:px-10 py-12 md:py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-400/20 text-secondary-200 text-xs font-medium uppercase tracking-wider mb-4">
            <i className="ri-sign-language-line" aria-hidden="true"></i>
            Projeto Especial
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-3xl leading-tight">
            Orgulho em Libras
          </h1>
          <p className="mt-4 text-base text-white/70 max-w-2xl leading-relaxed">
            Uma área dedicada à comunidade surda LGBTQIA+ do Nordeste. Informação sobre saúde, direitos e cultura traduzida de forma contextualizada.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-dark-800">
              Acervo de Vídeos
            </h2>
            <p className="text-sm text-dark-500 mt-1">Os conteúdos em Libras ainda estão em produção e passarão por revisão de pessoas surdas e profissionais qualificados antes da publicação.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {librasVideos.map(video => (
            <article key={video.id} className="group rounded-2xl overflow-hidden bg-white border border-dark-100 shadow-sm opacity-80">
              <div className={`relative aspect-video ${video.color} overflow-hidden flex items-center justify-center`}>
                <div className="text-center text-dark-600">
                  <i className="ri-video-add-line text-3xl opacity-50 mb-2 block"></i>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Vídeo em Produção</span>
                </div>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-600 mb-1 block">
                  {video.category}
                </span>
                <h3 className="text-sm font-semibold text-dark-800 line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pb-16">
        <div className="bg-primary-50 rounded-2xl border border-primary-100 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 shrink-0 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center">
            <i className="ri-robot-2-line text-4xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-dark-800 mb-2">LibrasVox (Protótipo)</h3>
            <p className="text-sm text-dark-600 leading-relaxed max-w-2xl">
              Imagens geradas por IA podem apresentar anatomia incorreta e não representam sinais de Libras linguisticamente validados. O avatar virtual será integrado a serviços reais após validação.
            </p>
            <div className="mt-4 flex gap-3">
              <button disabled className="px-5 py-2.5 text-sm font-semibold rounded-full bg-primary-500 text-white opacity-50 cursor-not-allowed flex items-center gap-2">
                <i className="ri-sign-language-fill"></i>
                Ativar LibrasVox (Em breve)
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
