const librasVideos = [
  {
    id: 1,
    title: 'Prevenção e PrEP em Libras',
    category: 'Saúde Sexual',
    duration: '3:45',
    image: 'https://readdy.ai/api/search-image?query=abstract%20graphic%20design%20with%20smooth%20vibrant%20gradients%20in%20blue%20and%20teal%20colors%20representing%20health%20and%20care%20minimalist&width=600&height=400&seq=libras1&orientation=landscape',
  },
  {
    id: 2,
    title: 'Direitos básicos: Nome Social',
    category: 'Meus Direitos',
    duration: '2:30',
    image: 'https://readdy.ai/api/search-image?query=abstract%20graphic%20design%20with%20interlocking%20geometric%20shapes%20in%20warm%20orange%20and%20yellow%20tones%20symbolizing%20identity%20and%20rights&width=600&height=400&seq=libras2&orientation=landscape',
  },
  {
    id: 3,
    title: 'Como denunciar LGBTfobia',
    category: 'Segurança',
    duration: '4:15',
    image: 'https://readdy.ai/api/search-image?query=bold%20abstract%20shapes%20in%20red%20and%20magenta%20tones%20signifying%20strength%20and%20protection%20minimalist%20digital%20art&width=600&height=400&seq=libras3&orientation=landscape',
  },
  {
    id: 4,
    title: 'Glossário LGBTQIA+ em Libras',
    category: 'Cultura Surda',
    duration: '10:00',
    image: 'https://readdy.ai/api/search-image?query=colorful%20abstract%20waves%20and%20particles%20in%20rainbow%20colors%20representing%20diversity%20and%20culture%20vibrant%20digital%20illustration&width=600&height=400&seq=libras4&orientation=landscape',
  },
];

export default function LibrasPage() {
  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      <section className="relative w-full bg-secondary-900 px-4 md:px-6 lg:px-10 pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20artistic%20waves%20in%20vibrant%20blue%20and%20purple%20tones%2C%20representing%20communication%20and%20sound%20waves%2C%20digital%20art%20high%20quality&width=1600&height=520&seq=libras-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
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
            <p className="text-sm text-dark-500 mt-1">Conteúdos revisados por intérpretes e pessoas surdas da comunidade.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {librasVideos.map(video => (
            <article key={video.id} className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-dark-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative aspect-video bg-dark-800 overflow-hidden">
                <img src={video.image} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <i className="ri-play-fill text-white text-2xl ml-1"></i>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium text-white">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-600 mb-1 block">
                  {video.category}
                </span>
                <h3 className="text-sm font-semibold text-dark-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
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
            <i className="ri-vidicon-line text-4xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-dark-800 mb-2">Botão "Ver em Libras"</h3>
            <p className="text-sm text-dark-600 leading-relaxed max-w-2xl">
              Em breve, todos os artigos e guias do portal terão um botão flutuante de acessibilidade "Ver em Libras". Ele acionará um intérprete virtual (LibrasVox) treinado com o vocabulário específico da comunidade LGBTQIA+ nordestina, garantindo que ninguém fique de fora da informação.
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
