import { useMemo, useState } from 'react';
import { badgeLabels, safeSpaceCategories } from '@/mocks/safeSpaces';
import { useSafeSpaces } from '@/lib/useSafeSpaces';

const filters = ['Todos', ...safeSpaceCategories] as const;

const mappedRegions = [
  {
    name: 'Praia de Iracema / Dragão do Mar',
    description: 'Circuito de noite, cultura, pontos de encontro, turismo e boemia LGBTQIA+.',
    tags: ['Gandaia', "Y'all", 'Dragão do Mar', 'Estoril', 'Ponte dos Ingleses'],
    icon: 'ri-disc-line',
  },
  {
    name: 'Benfica',
    description: 'Território de convivência, cultura independente, bares alternativos e acolhimento comunitário.',
    tags: ['Outra Casa', "Moreno's Bar", 'Cultura drag', 'Coletivos'],
    icon: 'ri-community-line',
  },
  {
    name: 'Itaperi / rede SUS',
    description: 'Referências públicas de saúde, cuidado trans e atendimento multiprofissional.',
    tags: ['Sertrans', 'HUC', 'SUS', 'Saúde trans'],
    icon: 'ri-heart-pulse-line',
  },
  {
    name: 'Centro / direitos',
    description: 'Serviços de proteção, memória política e articulação do movimento LGBTQIA+ cearense.',
    tags: ['Janaína Dutra', 'GRAB', 'Denúncia', 'Direitos'],
    icon: 'ri-shield-user-line',
  },
];

export default function GuidePage() {
  const { spaces, loading } = useSafeSpaces();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Todos');
  const [query, setQuery] = useState('');

  const visibleSpaces = useMemo(() => {
    const search = query.trim().toLowerCase();
    return spaces.filter((space) => {
      const matchesCategory = activeFilter === 'Todos' || space.category === activeFilter;
      const matchesSearch =
        !search ||
        space.name.toLowerCase().includes(search) ||
        space.description.toLowerCase().includes(search) ||
        space.address.toLowerCase().includes(search) ||
        space.tags.some((tag) => tag.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, query, spaces]);

  const categoryCounts = useMemo(() => {
    return spaces.reduce<Record<string, number>>(
      (acc, space) => {
        acc.Todos += 1;
        acc[space.category] = (acc[space.category] || 0) + 1;
        return acc;
      },
      { Todos: 0 },
    );
  }, [spaces]);

  return (
    <main className="w-full bg-white pt-16 md:pt-20">
      <section className="relative w-full min-h-[440px] md:min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://readdy.ai/api/search-image?query=fortaleza%20ceara%20brazil%20cityscape%20coastal%20aerial%20view%20warm%20sunset%20golden%20light%20tropical%20beach%20urban%20skyline%20editorial%20photography%20vibrant%20warm%20colors&width=1600&height=700&seq=guidehero-v2&orientation=landscape")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pt-20 md:pt-28 pb-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
              <i className="ri-map-pin-heart-line" aria-hidden="true"></i>
              Fortaleza, CE
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white leading-tight">
              Mapa de espaços gays e LGBTQIA+ em Fortaleza
            </h1>
            <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
              Lugares de saúde, cultura, acolhimento, direitos e convivência organizados por circuitos da cidade, com rotas rápidas e controle editorial pelo portal.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              {[
                { label: 'Espaços', value: spaces.length },
                { label: 'Categorias', value: safeSpaceCategories.length },
                { label: 'Badges', value: Object.keys(badgeLabels).length },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pt-10 pb-4">
        <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 md:p-5 flex items-start gap-3 mb-6">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-500 shrink-0">
            <i className="ri-shield-check-line text-lg" aria-hidden="true"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark-700">MVP do mapa de espaços seguros</p>
            <p className="mt-1 text-xs text-dark-500 leading-relaxed">
              Esta primeira versão organiza espaços por categoria, badges e regiões. A curadoria pode ocultar, editar ou incluir novos pontos pelo admin enquanto o mapa interativo entra nas próximas etapas.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300" aria-hidden="true"></i>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, bairro, tag..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-full bg-white border border-dark-200 text-dark-700 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-300"
            />
          </div>
          <span className="text-xs text-dark-400">
            {loading ? 'Carregando espaços...' : `${visibleSpaces.length} espaços encontrados`}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-dark-600 border-dark-200 hover:border-primary-300'
              }`}
            >
              {filter}
              <span className="ml-1 opacity-70">({categoryCounts[filter] || 0})</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Regiões mapeadas</p>
              <h2 className="mt-2 text-xl md:text-2xl font-semibold text-dark-800">Circuitos iniciais de Fortaleza</h2>
            </div>
            <p className="text-sm text-dark-500 max-w-2xl leading-relaxed">
              O guia começa pelos territórios mais citados na cena cultural, no acolhimento e nos serviços públicos. Cada circuito pode receber novos pontos sem apagar os existentes.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {mappedRegions.map((region) => (
              <article key={region.name} className="rounded-xl border border-dark-100 bg-white p-5">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <i className={`${region.icon} text-xl`} aria-hidden="true"></i>
                </div>
                <h3 className="mt-4 text-base font-semibold text-dark-800">{region.name}</h3>
                <p className="mt-2 text-sm text-dark-500 leading-relaxed">{region.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {region.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-dark-50 text-dark-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
        {visibleSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {visibleSpaces.map((space) => (
              <article
                key={`${space.source}-${space.slug}`}
                className="group rounded-xl md:rounded-2xl border border-dark-100 bg-white overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="relative w-full h-44 md:h-48 overflow-hidden bg-dark-50">
                  {space.image ? (
                    <img
                      src={space.image}
                      alt={space.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-300">
                      <i className="ri-map-pin-line text-3xl" aria-hidden="true"></i>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 text-dark-700 backdrop-blur-sm">
                    {space.category}
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-dark-800">{space.name}</h3>
                      <p className="mt-1 text-xs text-dark-400 flex items-center gap-1">
                        <i className="ri-map-pin-line" aria-hidden="true"></i>
                        {space.address}
                      </p>
                    </div>
                    {space.rating > 0 && (
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-dark-700">{space.rating.toFixed(1)}</p>
                        <p className="text-[11px] text-dark-400">{space.reviews} aval.</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-dark-500 leading-relaxed">{space.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {space.badges.slice(0, 4).map((badge) => (
                      <span
                        key={badge}
                        className="px-2.5 py-1 text-xs rounded-full bg-secondary-50 text-secondary-700 border border-secondary-100"
                      >
                        {badgeLabels[badge] || badge}
                      </span>
                    ))}
                    {space.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs rounded-full bg-primary-50 text-primary-500 border border-primary-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {space.mapUrl && (
                      <a
                        href={space.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-dark-700 text-white hover:bg-dark-800 transition-colors"
                      >
                        <i className="ri-route-line" aria-hidden="true"></i>
                        Rota
                      </a>
                    )}
                    {space.website && (
                      <a
                        href={space.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-dark-200 text-dark-600 hover:bg-dark-50 transition-colors"
                      >
                        <i className="ri-global-line" aria-hidden="true"></i>
                        Site
                      </a>
                    )}
                    {space.phone && (
                      <a
                        href={`tel:${space.phone}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-dark-200 text-dark-600 hover:bg-dark-50 transition-colors"
                      >
                        <i className="ri-phone-line" aria-hidden="true"></i>
                        Ligar
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-50 text-dark-300 mb-4">
              <i className="ri-map-pin-line text-2xl" aria-hidden="true"></i>
            </div>
            <h3 className="text-lg font-medium text-dark-600">Nenhum espaço encontrado</h3>
            <p className="mt-1 text-sm text-dark-400">Tente outro filtro ou cadastre um espaço pelo admin.</p>
          </div>
        )}
      </section>

      <section className="w-full bg-dark-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="bg-white rounded-xl md:rounded-2xl border border-dark-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-dark-800">
                Conhece um espaço seguro que não está aqui?
              </h3>
              <p className="mt-2 text-sm text-dark-500 leading-relaxed">
                A curadoria pode cadastrar novos lugares no admin e, nas próximas versões, a comunidade poderá avaliar e denunciar informações desatualizadas.
              </p>
            </div>
            <a
              href="mailto:contato@portallgbtq.com.br?subject=Indicação de espaço seguro"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap shrink-0"
            >
              Indicar espaço
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
