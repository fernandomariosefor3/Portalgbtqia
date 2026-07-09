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

  const featuredRoute = visibleRoutes.find((route) => route.slug === activeSlug) ?? visibleRoutes[0];

  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      <section className="relative w-full min-h-[520px] px-4 md:px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredRoute?.image || 'https://readdy.ai/api/search-image?query=northeast%20brazil%20travel%20coast%20warm%20sunset%20editorial%20photography&width=1600&height=800&seq=routes-hero-v2&orientation=landscape'}
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
        </div>
        <div className="relative max-w-7xl mx-auto pt-20 md:pt-28 pb-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium uppercase tracking-wider mb-5 border border-white/20">
              <i className="ri-compass-3-line" aria-hidden="true"></i>
              Turismo LGBTQIA+
            </span>
            <h1 className="text-3xl md:text-6xl font-playfair font-bold text-white max-w-3xl leading-tight">
              Roteiros queer pelo Nordeste
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
              Curadorias de viagem com cultura, acolhimento, segurança e pontos de apoio para explorar o Nordeste com mais tranquilidade.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            {[
              { label: 'Roteiros', value: routes.length },
              { label: 'Estados', value: new Set(routes.map((route) => route.state)).size },
              { label: 'Tipos', value: queerRouteTypes.length },
              { label: 'Pilotos', value: 'MVP' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8">
        <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4 md:p-5 flex items-start gap-3 mb-6">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-500 shrink-0">
            <i className="ri-map-pin-heart-line text-lg" aria-hidden="true"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark-700">Roteiros em fase piloto</p>
            <p className="mt-1 text-xs text-dark-500 leading-relaxed">
              Esta versão organiza destinos prioritários. As próximas etapas podem incluir mapa offline, avaliações de viagem, reservas e roteiros em PDF.
            </p>
          </div>
        </div>

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

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pb-8">
        {visibleRoutes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {visibleRoutes.map((route) => (
              <article
                key={route.slug}
                className={`rounded-2xl bg-white border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  featuredRoute?.slug === route.slug ? 'border-primary-300 shadow-sm' : 'border-dark-100'
                }`}
              >
                <div className="h-48 bg-dark-50 overflow-hidden">
                  <img src={route.image} alt={route.title} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 text-xs mb-3">
                    <span className="font-semibold text-primary-500">{route.destination}/{route.state}</span>
                    <span className="text-dark-400">{route.duration}</span>
                  </div>
                  <h2 className="text-lg font-playfair font-bold text-dark-800 leading-snug">{route.title}</h2>
                  <p className="mt-2 text-sm text-dark-500 leading-relaxed line-clamp-3">{route.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-secondary-50 text-secondary-700 text-xs">{route.type}</span>
                    <span className="px-2.5 py-1 rounded-full bg-dark-50 text-dark-500 text-xs">{route.budget}</span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs">{safetyLabel(route.safetyLevel)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSlug(route.slug);
                      document.getElementById('roteiro-detalhe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700 text-white text-xs font-semibold hover:bg-dark-800 transition-colors"
                  >
                    Ver roteiro
                    <i className="ri-arrow-down-line" aria-hidden="true"></i>
                  </button>
                </div>
              </article>
            ))}
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

      {featuredRoute && (
        <section id="roteiro-detalhe" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pb-14 md:pb-20 scroll-mt-24">
          <article className="rounded-2xl border border-dark-100 bg-white overflow-hidden">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[320px] bg-dark-50">
                <img src={featuredRoute.image} alt={featuredRoute.title} className="absolute inset-0 w-full h-full object-cover object-top" />
              </div>
              <div className="p-5 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">{featuredRoute.type}</span>
                  <span className="px-3 py-1 rounded-full bg-dark-50 text-dark-600 text-xs font-semibold">{featuredRoute.duration}</span>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">{safetyLabel(featuredRoute.safetyLevel)}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">{featuredRoute.title}</h2>
                <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">{featuredRoute.summary}</p>

                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-dark-50 border border-dark-100 p-4">
                    <p className="text-xs text-dark-400">Destino</p>
                    <p className="mt-1 text-sm font-semibold text-dark-700">{featuredRoute.destination}/{featuredRoute.state}</p>
                  </div>
                  <div className="rounded-xl bg-dark-50 border border-dark-100 p-4">
                    <p className="text-xs text-dark-400">Orçamento</p>
                    <p className="mt-1 text-sm font-semibold text-dark-700">{featuredRoute.budget}</p>
                  </div>
                  <div className="rounded-xl bg-dark-50 border border-dark-100 p-4">
                    <p className="text-xs text-dark-400">Segurança</p>
                    <p className="mt-1 text-sm font-semibold text-dark-700">{safetyLabel(featuredRoute.safetyLevel)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8 border-t border-dark-100">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">Roteiro dia a dia</h3>
                  <div className="space-y-4">
                    {featuredRoute.itinerary.map((item) => (
                      <div key={`${item.day}-${item.title}`} className="rounded-xl border border-dark-100 bg-surface p-5">
                        <p className="text-xs font-semibold text-primary-500">{item.day}</p>
                        <h4 className="mt-1 text-base font-semibold text-dark-800">{item.title}</h4>
                        <p className="mt-2 text-sm text-dark-500 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="space-y-5">
                  <div className="rounded-xl bg-secondary-50 border border-secondary-100 p-5">
                    <h3 className="text-sm font-semibold text-secondary-700 uppercase tracking-wider mb-4">Destaques</h3>
                    <div className="flex flex-wrap gap-2">
                      {featuredRoute.highlights.map((highlight) => (
                        <span key={highlight} className="px-3 py-1 rounded-full bg-white text-secondary-700 text-xs font-medium border border-secondary-100">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-5">
                    <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-4">Segurança</h3>
                    <ul className="space-y-3">
                      {featuredRoute.safetyTips.map((tip) => (
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
                      {featuredRoute.usefulContacts.map((contact) => (
                        <li key={contact} className="flex items-start gap-2 text-sm text-primary-700 leading-relaxed">
                          <i className="ri-phone-line mt-0.5" aria-hidden="true"></i>
                          <span>{contact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
