import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { categoryLabels, categoryColors, categoryIcons } from '@/mocks/health';
import { useHealth } from '@/lib/useHealth';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export default function HealthDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [showCopied, setShowCopied] = useState(false);
  const { guides: allHealthGuides, loading } = useHealth();

  const guide = allHealthGuides.find((g) => g.slug === slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-dark-400">
        Carregando…
      </div>
    );
  }

  if (!guide) {
    return (
      <main className="w-full min-h-screen bg-surface font-inter pt-24 pb-16 px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-50 text-dark-300 mb-4">
            <i className="ri-file-search-line text-2xl" aria-hidden="true"></i>
          </div>
          <h1 className="text-xl font-playfair font-bold text-dark-700">Guia não encontrado</h1>
          <p className="mt-2 text-sm text-dark-400">O guia de saúde que você procura não existe ou foi removido.</p>
          <Link to="/saude" className="mt-6 inline-flex px-5 py-2.5 text-sm font-medium rounded-full bg-accent-400 text-white hover:bg-accent-500 transition-colors">
            Voltar para Saúde
          </Link>
        </div>
      </main>
    );
  }

  const relatedGuides = allHealthGuides
    .filter((g) => g.id !== guide.id && (g.category === guide.category || g.tags.some((t) => guide.tags.includes(t))))
    .slice(0, 3);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`${guide.title} — Portal LGBTQ+`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${guide.title} — ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <main className="w-full min-h-screen bg-surface font-inter">
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pt-28 md:pt-36 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[guide.category]}`}>
                <i className={`${categoryIcons[guide.category]} text-xs`}></i>
                {categoryLabels[guide.category]}
              </span>
              <span className="text-xs text-white/60">{guide.readTime} min de leitura</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-white leading-tight">
              {guide.title}
            </h1>
            <p className="mt-3 text-base text-white/80 leading-relaxed max-w-2xl">
              {guide.excerpt}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <img
                src={guide.authorPhoto}
                alt={guide.author}
                className="w-10 h-10 rounded-full object-cover border border-white/30"
              />
              <div>
                <p className="text-sm font-medium text-white">{guide.author}</p>
                <p className="text-xs text-white/60">{guide.publishedAt} · {guide.views.toLocaleString()} leituras</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-10 md:py-14 px-4 md:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2">
              <article
                className="prose prose-sm md:prose-base max-w-none text-dark-600"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(guide.content) }}
              />

              {guide.faqs && guide.faqs.length > 0 && (
                <div className="mt-10 pt-8 border-t border-dark-100">
                  <h3 className="text-lg font-playfair font-bold text-dark-700 mb-6">
                    Perguntas frequentes
                  </h3>
                  <div className="space-y-4">
                    {guide.faqs.map((faq, idx) => (
                      <div key={idx} className="rounded-lg border border-dark-100 bg-white p-5">
                        <h4 className="text-sm font-semibold text-dark-700 mb-2 flex items-start gap-2">
                          <i className="ri-question-line text-accent-400 mt-0.5" aria-hidden="true"></i>
                          {faq.question}
                        </h4>
                        <p className="text-sm text-dark-500 leading-relaxed pl-6">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {guide.sources && guide.sources.length > 0 && (
                <div className="mt-10 pt-8 border-t border-dark-100">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-dark-400 mb-4">
                    Fontes e referências
                  </h3>
                  <ul className="space-y-2">
                    {guide.sources.map((source, idx) => (
                      <li key={idx} className="text-sm text-dark-500 flex items-start gap-2">
                        <i className="ri-bookmark-line text-accent-400 mt-0.5" aria-hidden="true"></i>
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-dark-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={guide.authorPhoto}
                      alt={guide.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-dark-700">{guide.author}</p>
                      <p className="text-xs text-dark-400">{guide.authorBio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark-400 mr-1">Compartilhar:</span>
                    <button
                      onClick={shareFacebook}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-50 text-dark-400 hover:bg-primary-100 hover:text-primary-500 transition-colors"
                      aria-label="Compartilhar no Facebook"
                    >
                      <i className="ri-facebook-fill text-sm" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={shareTwitter}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-50 text-dark-400 hover:bg-primary-100 hover:text-primary-500 transition-colors"
                      aria-label="Compartilhar no Twitter"
                    >
                      <i className="ri-twitter-x-fill text-sm" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={shareWhatsApp}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-50 text-dark-400 hover:bg-primary-100 hover:text-primary-500 transition-colors"
                      aria-label="Compartilhar no WhatsApp"
                    >
                      <i className="ri-whatsapp-line text-sm" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-50 text-dark-400 hover:bg-primary-100 hover:text-primary-500 transition-colors relative"
                      aria-label="Copiar link"
                    >
                      <i className="ri-link text-sm" aria-hidden="true"></i>
                      {showCopied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-700 text-white text-[10px] rounded whitespace-nowrap">
                          Copiado!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border border-dark-100 bg-white p-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-dark-400 mb-4">
                    Sobre este guia
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Categoria</span>
                      <span className="font-medium text-dark-600">{categoryLabels[guide.category]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Tempo de leitura</span>
                      <span className="font-medium text-dark-600">{guide.readTime} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Publicado</span>
                      <span className="font-medium text-dark-600">{guide.publishedAt}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-400">Leituras</span>
                      <span className="font-medium text-dark-600">{guide.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-accent-100 bg-accent-50 p-5">
                  <div className="flex items-start gap-3">
                    <i className="ri-information-line text-accent-500 text-lg mt-0.5" aria-hidden="true"></i>
                    <div>
                      <h4 className="text-sm font-semibold text-accent-600 mb-1">
                        Aviso importante
                      </h4>
                      <p className="text-xs text-accent-500 leading-relaxed">
                        Este conteúdo é informativo e não substitui consulta médica. 
                        Sempre busque um profissional de saúde para avaliação individualizada.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dark-100 bg-white p-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-dark-400 mb-4">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-dark-50 text-dark-500 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {relatedGuides.length > 0 && (
                  <div className="rounded-xl border border-dark-100 bg-white p-5">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-dark-400 mb-4">
                      Guias relacionados
                    </h4>
                    <div className="space-y-4">
                      {relatedGuides.map((g) => (
                        <Link
                          key={g.id}
                          to={`/saude/${g.slug}`}
                          className="group flex gap-3 items-start"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={g.image}
                              alt={g.title}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <h5 className="text-xs font-medium text-dark-700 leading-snug group-hover:text-accent-500 transition-colors line-clamp-2">
                              {g.title}
                            </h5>
                            <span className="text-[11px] text-dark-400 mt-0.5 block">
                              {g.readTime} min
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-primary-50 border border-primary-100 p-5">
                  <h4 className="text-sm font-semibold text-primary-600 mb-2">
                    Precisa conversar?
                  </h4>
                  <p className="text-xs text-primary-500 leading-relaxed mb-3">
                    Se este conteúdo trouxe angústia ou você precisa de apoio emocional, 
                    o CVV está disponível 24h.
                  </p>
                  <a
                    href="tel:188"
                    className="inline-flex px-4 py-2 text-xs font-medium rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap items-center gap-1.5"
                  >
                    <i className="ri-phone-line" aria-hidden="true"></i>
                    Ligar CVV 188
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}