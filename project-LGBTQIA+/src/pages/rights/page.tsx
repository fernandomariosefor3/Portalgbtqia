import { useMemo, useState } from 'react';
import { legalCategories } from '@/mocks/legalRights';
import { useLegalGuides } from '@/lib/useLegalGuides';
import RightsAssistant from './components/RightsAssistant';

const filters = ['Todos', ...legalCategories] as const;

const categoryMeta = {
  Relacionamentos: { icon: 'ri-hearts-line', title: 'Relacionamentos' },
  Identidade: { icon: 'ri-transgender-line', title: 'Identidade de gênero' },
  Saúde: { icon: 'ri-heart-pulse-line', title: 'Saúde' },
  Trabalho: { icon: 'ri-briefcase-line', title: 'Trabalho' },
  Violência: { icon: 'ri-alarm-warning-line', title: 'Violência' },
  Educação: { icon: 'ri-graduation-cap-line', title: 'Educação' },
  Serviços: { icon: 'ri-customer-service-2-line', title: 'Serviços' },
};

const priorityStyle = {
  alta: 'bg-red-50 text-red-700 border-red-100',
  media: 'bg-amber-50 text-amber-700 border-amber-100',
  baixa: 'bg-green-50 text-green-700 border-green-100',
};

export default function RightsPage() {
  const { guides, loading } = useLegalGuides();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Todos');
  const [query, setQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const visibleGuides = useMemo(() => {
    const search = query.trim().toLowerCase();
    return guides.filter((guide) => {
      const matchesCategory = activeFilter === 'Todos' || guide.category === activeFilter;
      const matchesSearch =
        !search ||
        guide.title.toLowerCase().includes(search) ||
        guide.summary.toLowerCase().includes(search) ||
        guide.content.toLowerCase().includes(search) ||
        guide.tags.some((tag) => tag.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, guides, query]);

  const activeGuide = visibleGuides.find((guide) => guide.slug === activeSlug) ?? visibleGuides[0];
  const groupedGuides = useMemo(() => {
    return legalCategories.map((category) => ({
      category,
      guides: guides.filter((guide) => guide.category === category),
    }));
  }, [guides]);

  function downloadText(filename: string, body: string) {
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      <section className="relative w-full bg-dark-700 px-4 md:px-6 lg:px-10 pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://readdy.ai/api/search-image?query=legal%20documents%20on%20desk%20with%20rainbow%20ribbon%20soft%20warm%20light%20human%20rights%20law%20editorial%20photography%20professional%20clean%20composition&width=1600&height=520&seq=rights-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-400/20 text-primary-200 text-xs font-medium uppercase tracking-wider mb-4">
            <i className="ri-scales-3-line" aria-hidden="true"></i>
            Meus Direitos LGBTQIA+
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-3xl leading-tight">
            Direitos explicados sem juridiquês
          </h1>
          <p className="mt-4 text-base text-white/70 max-w-2xl leading-relaxed">
            Um ponto de partida para entender seus direitos, reunir documentos, preservar provas e encontrar canais de apoio no Nordeste. Não substitui atendimento jurídico individual.
          </p>
        </div>
      </section>

      {/* Interactive Assistant */}
      <RightsAssistant />

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300" aria-hidden="true"></i>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar direito, documento, denúncia..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-full bg-white border border-dark-200 text-dark-700 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-300"
            />
          </div>
          <span className="text-xs text-dark-400">
            {loading ? 'Carregando direitos...' : `${visibleGuides.length} guias encontrados`}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setActiveFilter(filter);
                setActiveSlug(null);
              }}
              className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-dark-600 border-dark-200 hover:border-primary-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groupedGuides.map(({ category, guides: categoryGuides }) => {
            const meta = categoryMeta[category];
            return (
              <article key={category} className="rounded-2xl border border-dark-100 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                    <i className={`${meta.icon} text-xl`} aria-hidden="true"></i>
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-dark-800">{meta.title}</h2>
                    <p className="text-xs text-dark-400">{categoryGuides.length} guias</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryGuides.slice(0, 4).map((guide) => (
                    <button
                      key={guide.slug}
                      type="button"
                      onClick={() => {
                        setActiveFilter(category);
                        setActiveSlug(guide.slug);
                        // Scroll down to the guide content
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }}
                      className="block w-full rounded-lg bg-dark-50 px-3 py-2 text-left text-xs font-medium text-dark-600 hover:bg-primary-50 hover:text-primary-600"
                    >
                      {guide.title}
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pb-14 md:pb-20">
        {visibleGuides.length > 0 && activeGuide ? (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 lg:gap-8">
            <aside className="space-y-3">
              {visibleGuides.map((guide) => (
                <button
                  key={guide.slug}
                  type="button"
                  onClick={() => setActiveSlug(guide.slug)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    activeGuide.slug === guide.slug
                      ? 'bg-white border-primary-200 shadow-sm'
                      : 'bg-white border-dark-100 hover:border-primary-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-primary-500">{guide.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${priorityStyle[guide.priority]}`}>
                      {guide.priority}
                    </span>
                  </div>
                  <h2 className="mt-2 text-sm font-semibold text-dark-800">{guide.title}</h2>
                  <p className="mt-1 text-xs text-dark-400 line-clamp-2">{guide.summary}</p>
                </button>
              ))}
            </aside>

            <article className="rounded-2xl border border-dark-100 bg-white p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
                  {activeGuide.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityStyle[activeGuide.priority]}`}>
                  prioridade {activeGuide.priority}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-dark-800 leading-tight">
                {activeGuide.title}
              </h2>
              <p className="mt-3 text-sm md:text-base text-dark-500 leading-relaxed">
                {activeGuide.summary}
              </p>

              <div className="mt-6 prose prose-sm md:prose-base max-w-none text-dark-600">
                <p>{activeGuide.content}</p>
              </div>

              {activeGuide.subtopics?.length ? (
                <div className="mt-6 rounded-xl border border-secondary-100 bg-secondary-50/60 p-5">
                  <h3 className="text-sm font-semibold text-secondary-700 uppercase tracking-wider mb-4">
                    Tópicos deste guia
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeGuide.subtopics.map((topic) => (
                      <span key={topic} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-secondary-700">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 grid md:grid-cols-2 gap-5">
                {activeGuide.documents?.length ? (
                  <div className="rounded-xl bg-white border border-dark-100 p-5">
                    <h3 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
                      Documentos necessários
                    </h3>
                    <ul className="space-y-3">
                      {activeGuide.documents.map((document) => (
                        <li key={document} className="flex items-start gap-2 text-sm text-dark-500 leading-relaxed">
                          <i className="ri-file-list-3-line text-secondary-600 mt-0.5" aria-hidden="true"></i>
                          <span>{document}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="rounded-xl bg-dark-50 border border-dark-100 p-5">
                  <h3 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
                    Passos recomendados
                  </h3>
                  <ul className="space-y-3">
                    {activeGuide.actions.map((action) => (
                      <li key={action} className="flex items-start gap-2 text-sm text-dark-500 leading-relaxed">
                        <i className="ri-checkbox-circle-line text-primary-500 mt-0.5" aria-hidden="true"></i>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-primary-50 border border-primary-100 p-5">
                  <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
                    Canais úteis
                  </h3>
                  <ul className="space-y-3">
                    {activeGuide.contacts.map((contact) => (
                      <li key={contact} className="flex items-start gap-2 text-sm text-primary-700 leading-relaxed">
                        <i className="ri-phone-line mt-0.5" aria-hidden="true"></i>
                        <span>{contact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {(activeGuide.averageTime || activeGuide.costs || activeGuide.downloads?.length) && (
                <div className="mt-6 grid gap-5 md:grid-cols-3">
                  {activeGuide.averageTime && (
                    <div className="rounded-xl border border-dark-100 bg-white p-5">
                      <h3 className="text-sm font-semibold text-dark-700">Tempo médio</h3>
                      <p className="mt-2 text-sm leading-relaxed text-dark-500">{activeGuide.averageTime}</p>
                    </div>
                  )}
                  {activeGuide.costs && (
                    <div className="rounded-xl border border-dark-100 bg-white p-5">
                      <h3 className="text-sm font-semibold text-dark-700">Custos</h3>
                      <p className="mt-2 text-sm leading-relaxed text-dark-500">{activeGuide.costs}</p>
                    </div>
                  )}
                  {activeGuide.downloads?.length ? (
                    <div className="rounded-xl border border-primary-100 bg-primary-50 p-5">
                      <h3 className="text-sm font-semibold text-primary-700">Modelos para baixar</h3>
                      <div className="mt-3 space-y-2">
                        {activeGuide.downloads.map((download) => (
                          <button
                            key={download.filename}
                            type="button"
                            onClick={() => downloadText(download.filename, download.body)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-600"
                          >
                            <i className="ri-download-2-line" aria-hidden="true"></i>
                            {download.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {activeGuide.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-dark-50 text-dark-500 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-50 text-dark-300 mb-4">
              <i className="ri-scales-3-line text-2xl" aria-hidden="true"></i>
            </div>
            <h3 className="text-lg font-medium text-dark-600">Nenhum guia jurídico encontrado</h3>
            <p className="mt-1 text-sm text-dark-400">Tente outro filtro ou publique um guia pelo admin.</p>
          </div>
        )}
      </section>
    </main>
  );
}
