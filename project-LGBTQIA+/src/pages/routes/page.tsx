import { useMemo, useState } from 'react';
import { queerRouteTypes } from '@/mocks/queerRoutes';
import { useQueerRoutes } from '@/lib/useQueerRoutes';

const filters = ['Todos', ...queerRouteTypes] as const;

function safetyLabel(level: number) {
  if (level >= 5) return 'Muito seguro';
  if (level >= 4) return 'Seguro';
  if (level >= 3) return 'Atenção normal';
  return 'Atenção redobrada';
}

export default function RoutesPage() {
  const { routes, loading } = useQueerRoutes();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Todos');
  const [query, setQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const visibleRoutes = useMemo(() => {
    const search = query.trim().toLowerCase();
    return routes.filter((route) => {
      const matchesType = activeFilter === 'Todos' || route.type === activeFilter;
      const matchesSearch =
        !search ||
        route.title.toLowerCase().includes(search) ||
        route.destination.toLowerCase().includes(search) ||
        route.summary.toLowerCase().includes(search) ||
        route.tags.some((tag) => tag.toLowerCase().includes(search));
      return matchesType && matchesSearch;
    });
  }, [activeFilter, query, routes]);

  const activeRoute = visibleRoutes.find((route) => route.slug === activeSlug) ?? visibleRoutes[0];

  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      <section className="relative w-full bg-dark-700 px-4 md:px-6 lg:px-10 pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://readdy.ai/api/search-image?query=northeast%20brazil%20travel%20coast%20colorful%20streets%20inclusive%20tourism%20warm%20sunset%20editorial%20photography&width=1600&height=560&seq=routes-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-400/20 text-secondary-200 text-xs font-medium uppercase tracking-wider mb-4">
            <i className="ri-compass-3-line" aria-hidden="true"></i>
            Turismo LGBTQIA+
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-3xl leading-tight">
            Roteiros queer pelo Nordeste
          </h1>
          <p className="mt-4 text-base text-white/70 max-w-2xl leading-relaxed">
            Viagens com curadoria de segurança, cultura, acolhimento e pontos de apoio para explorar cidades nordestinas com mais autonomia.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300" aria-hidden="true"></i>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar destino, cidade, tag..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-full bg-white border border-dark-200 text-dark-700 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-300"
            />
          </div>
          <span className="text-xs text-dark-400">
            {loading ? 'Carregando roteiros...' : `${visibleRoutes.length} roteiros encontrados`}
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
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pb-14 md:pb-20">
        {visibleRoutes.length > 0 && activeRoute ? (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-6 lg:gap-8">
            <aside className="space-y-4">
              {visibleRoutes.map((route) => (
                <button
                  key={route.slug}
                  type="button"
                  onClick={() => setActiveSlug(route.slug)}
                  className={`w-full text-left rounded-2xl border overflow-hidden bg-white transition-all ${
                    activeRoute.slug === route.slug ? 'border-primary-200 shadow-sm' : 'border-dark-100 hover:border-primary-100'
                  }`}
                >
                  <div className="h-36 bg-dark-50 overflow-hidden">
                    <img src={route.image} alt={route.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-primary-500">{route.destination}/{route.state}</span>
                      <span className="text-dark-400">{route.duration}</span>
                    </div>
                    <h2 className="mt-2 text-sm font-semibold text-dark-800">{route.title}</h2>
                    <p className="mt-1 text-xs text-dark-400 line-clamp-2">{route.summary}</p>
                  </div>
                </button>
              ))}
            </aside>

            <article className="rounded-2xl border border-dark-100 bg-white overflow-hidden">
              <div className="relative h-64 md:h-80 bg-dark-50">
                <img src={activeRoute.image} alt={activeRoute.title} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-dark-700 text-xs font-semibold">{activeRoute.type}</span>
                    <span className="px-3 py-1 rounded-full bg-white/90 text-dark-700 text-xs font-semibold">{activeRoute.duration}</span>
                    <span className="px-3 py-1 rounded-full bg-white/90 text-dark-700 text-xs font-semibold">{activeRoute.budget}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-playfair font-bold text-white leading-tight">{activeRoute.title}</h2>
                </div>
              </div>

              <div className="p-5 md:p-7">
                <p className="text-sm md:text-base text-dark-500 leading-relaxed">{activeRoute.summary}</p>

                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-dark-50 border border-dark-100 p-4">
                    <p className="text-xs text-dark-400">Destino</p>
                    <p className="mt-1 text-sm font-semibold text-dark-700">{activeRoute.destination}/{activeRoute.state}</p>
                  </div>
                  <div className="rounded-xl bg-dark-50 border border-dark-100 p-4">
                    <p className="text-xs text-dark-400">Segurança</p>
                    <p className="mt-1 text-sm font-semibold text-dark-700">{safetyLabel(activeRoute.safetyLevel)}</p>
                  </div>
                  <div className="rounded-xl bg-dark-50 border border-dark-100 p-4">
                    <p className="text-xs text-dark-400">Orçamento</p>
                    <p className="mt-1 text-sm font-semibold text-dark-700">{activeRoute.budget}</p>
                  </div>
                </div>

                <div className="mt-7">
                  <h3 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-3">Destaques</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeRoute.highlights.map((highlight) => (
                      <span key={highlight} className="px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 text-xs font-medium border border-secondary-100">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">Roteiro dia a dia</h3>
                  <div className="space-y-4">
                    {activeRoute.itinerary.map((item) => (
                      <div key={`${item.day}-${item.title}`} className="rounded-xl border border-dark-100 bg-surface p-5">
                        <p className="text-xs font-semibold text-primary-500">{item.day}</p>
                        <h4 className="mt-1 text-base font-semibold text-dark-800">{item.title}</h4>
                        <p className="mt-2 text-sm text-dark-500 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-5">
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-5">
                    <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-4">Dicas de segurança</h3>
                    <ul className="space-y-3">
                      {activeRoute.safetyTips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-sm text-amber-800 leading-relaxed">
                          <i className="ri-shield-check-line mt-0.5" aria-hidden="true"></i>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-primary-50 border border-primary-100 p-5">
                    <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">Contatos úteis</h3>
                    <ul className="space-y-3">
                      {activeRoute.usefulContacts.map((contact) => (
                        <li key={contact} className="flex items-start gap-2 text-sm text-primary-700 leading-relaxed">
                          <i className="ri-phone-line mt-0.5" aria-hidden="true"></i>
                          <span>{contact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {activeRoute.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-dark-50 text-dark-500 text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-50 text-dark-300 mb-4">
              <i className="ri-compass-3-line text-2xl" aria-hidden="true"></i>
            </div>
            <h3 className="text-lg font-medium text-dark-600">Nenhum roteiro encontrado</h3>
            <p className="mt-1 text-sm text-dark-400">Tente outro filtro ou publique um roteiro pelo admin.</p>
          </div>
        )}
      </section>
    </main>
  );
}
