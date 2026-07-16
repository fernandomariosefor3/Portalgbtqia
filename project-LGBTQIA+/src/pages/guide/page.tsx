import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  badgeLabels,
  guideHeroImage,
  safeSpaceCategories,
  safeSpaceCategoryImages,
  safeSpaceBadgeKeys,
  verificationLabels,
  type SafeSpace,
} from '@/mocks/safeSpaces';
import { useSafeSpaces } from '@/lib/useSafeSpaces';
import { createSafeSpaceReview, reportSafeSpace, verifySafeSpace } from '@/lib/safeSpaceCommunity';
import FavoriteButton from '@/components/feature/FavoriteButton';

const filters = ['Todos', ...safeSpaceCategories] as const;
const priceFilters = ['Todos', '$', '$$', '$$$', '$$$$'] as const;
const distanceFilters = [
  { label: '100km', value: 100 },
  { label: '10km', value: 10 },
  { label: '5km', value: 5 },
  { label: '1km', value: 1 },
] as const;

const reviewQuestions = [
  'Você se sentiu seguro(a)?',
  'Usaram seu nome social? (se aplicável)',
  'Usaram pronomes corretos? (se aplicável)',
  'Havia banheiro gender neutral?',
  'Funcionários treinados?',
  'Você voltaria/recomendaria?',
];

const reviewerTags = [
  'Lésbica',
  'Gay',
  'Bissexual',
  'Pansexual',
  'Homem cis',
  'Mulher cis',
  'Homem trans',
  'Mulher trans',
  'Não-binárie',
  'Gênero fluido',
  'Assexual',
  'Aromântique',
  'Família homoafetiva',
];

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

function GuideSpaceImage({ space }: { space: SafeSpace }) {
  const fallback = safeSpaceCategoryImages[space.category] || safeSpaceCategoryImages['ONG & Acolhimento'];
  const [src, setSrc] = useState(space.image || fallback);

  return (
    <img
      src={src}
      alt={space.name}
      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      onError={() => setSrc(fallback)}
    />
  );
}

export default function GuidePage() {
  const { spaces, loading } = useSafeSpaces();
  const [activeState, setActiveState] = useState<string>('CE');
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Todos');
  const [query, setQuery] = useState('');
  const [activeBadge, setActiveBadge] = useState('Todos');
  const [maxDistance, setMaxDistance] = useState(100);
  const [priceFilter, setPriceFilter] = useState<(typeof priceFilters)[number]>('Todos');
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [needsWifi, setNeedsWifi] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [activeReviewSlug, setActiveReviewSlug] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerTag, setReviewerTag] = useState(reviewerTags[0]);
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, boolean>>(
    Object.fromEntries(reviewQuestions.map((question) => [question, true])),
  );
  const [localScores, setLocalScores] = useState<Record<string, { rating: number; reviews: number }>>({});
  const [selectedMapSlug, setSelectedMapSlug] = useState<string | null>(null);
  const [activeReportSlug, setActiveReportSlug] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Informação desatualizada');
  const [reportDetails, setReportDetails] = useState('');
  const [communityMessage, setCommunityMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [communityBusy, setCommunityBusy] = useState(false);

  const visibleSpaces = useMemo(() => {
    const search = query.trim().toLowerCase();
    return spaces.filter((space) => {
      const matchesState = space.state === activeState;
      const matchesCategory = activeFilter === 'Todos' || space.category === activeFilter;
      const matchesSearch =
        !search ||
        space.name.toLowerCase().includes(search) ||
        space.description.toLowerCase().includes(search) ||
        space.address.toLowerCase().includes(search) ||
        space.tags.some((tag) => tag.toLowerCase().includes(search)) ||
        space.badges.some((badge) => (badgeLabels[badge] || badge).toLowerCase().includes(search));
      const matchesBadge = activeBadge === 'Todos' || space.badges.includes(activeBadge);
      const matchesDistance = (space.distanceKm ?? 0) <= maxDistance;
      const matchesPrice = priceFilter === 'Todos' || space.price === priceFilter;
      const matchesAccessibility = !needsAccessibility || Boolean(space.accessibility?.length);
      const matchesWifi = !needsWifi || Boolean(space.wifi);
      const matchesOpen = !openNowOnly || Boolean(space.openNow);
      return (
        matchesState &&
        matchesCategory &&
        matchesSearch &&
        matchesBadge &&
        matchesDistance &&
        matchesPrice &&
        matchesAccessibility &&
        matchesWifi &&
        matchesOpen
      );
    });
  }, [activeState, activeBadge, activeFilter, maxDistance, needsAccessibility, needsWifi, openNowOnly, priceFilter, query, spaces]);

  const categoryCounts = useMemo(() => {
    return spaces
      .filter((space) => space.state === activeState)
      .reduce<Record<string, number>>(
        (acc, space) => {
          acc.Todos += 1;
          acc[space.category] = (acc[space.category] || 0) + 1;
          return acc;
        },
        { Todos: 0 },
      );
  }, [spaces, activeState]);
  
  const availableStates = useMemo(() => {
    const states = new Set(spaces.map(s => s.state).filter(Boolean));
    if (states.size === 0) return ['CE'];
    return Array.from(states).sort();
  }, [spaces]);

  function scoreFor(space: SafeSpace) {
    return localScores[space.slug] || { rating: space.rating, reviews: space.reviews };
  }

  async function submitReview(space: SafeSpace) {
    setCommunityBusy(true);
    setCommunityMessage(null);
    try {
      await createSafeSpaceReview({
        spaceSlug: space.slug,
        spaceName: space.name,
        rating: reviewRating,
        reviewerTag,
        answers: reviewAnswers,
      });
    const current = scoreFor(space);
    const nextReviews = current.reviews + 1;
    const nextRating = (current.rating * current.reviews + reviewRating) / nextReviews;
    setLocalScores((scores) => ({
      ...scores,
      [space.slug]: { rating: nextRating, reviews: nextReviews },
    }));
    setActiveReviewSlug(null);
    setReviewRating(5);
    setReviewerTag(reviewerTags[0]);
      setCommunityMessage({ success: true, text: 'Avaliação enviada para moderação.' });
    } catch (error) {
      setCommunityMessage({ success: false, text: error instanceof Error ? error.message : 'Não foi possível enviar.' });
    } finally {
      setCommunityBusy(false);
    }
  }

  async function submitVerification(space: SafeSpace) {
    setCommunityBusy(true);
    setCommunityMessage(null);
    try {
      await verifySafeSpace(space.slug, space.name);
      setCommunityMessage({ success: true, text: 'Verificação comunitária registrada.' });
    } catch (error) {
      setCommunityMessage({ success: false, text: error instanceof Error ? error.message : 'Não foi possível verificar.' });
    } finally {
      setCommunityBusy(false);
    }
  }

  async function submitReport(space: SafeSpace) {
    if (reportDetails.trim().length < 10) {
      setCommunityMessage({ success: false, text: 'Explique o reporte com pelo menos 10 caracteres.' });
      return;
    }
    setCommunityBusy(true);
    setCommunityMessage(null);
    try {
      await reportSafeSpace({
        spaceSlug: space.slug,
        spaceName: space.name,
        reason: reportReason,
        details: reportDetails.trim(),
      });
      setActiveReportSlug(null);
      setReportDetails('');
      setCommunityMessage({ success: true, text: 'Reporte enviado com segurança para a curadoria.' });
    } catch (error) {
      setCommunityMessage({ success: false, text: error instanceof Error ? error.message : 'Não foi possível reportar.' });
    } finally {
      setCommunityBusy(false);
    }
  }

  const selectedMapSpace = spaces.find((space) => space.slug === selectedMapSlug) || visibleSpaces[0];
  const mapQuery = selectedMapSpace
    ? encodeURIComponent(selectedMapSpace.name + ', ' + selectedMapSpace.address + ', ' + selectedMapSpace.city)
    : encodeURIComponent('Fortaleza, CE');

  return (
    <main className="w-full bg-white pt-16 md:pt-20">
      <section className="relative w-full min-h-[440px] md:min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${guideHeroImage}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pt-20 md:pt-28 pb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm">
                <i className="ri-map-pin-heart-line" aria-hidden="true"></i>
                Guia Regional
              </span>
              <select 
                value={activeState}
                onChange={(e) => setActiveState(e.target.value)}
                className="bg-white/15 text-white border border-white/25 backdrop-blur-sm px-3 py-1.5 text-xs font-medium rounded-full outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                {availableStates.map(st => (
                  <option key={st} value={st} className="text-dark-800">{st}</option>
                ))}
              </select>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white leading-tight">
              Mapa de espaços LGBTQIA+ no estado: {activeState}
            </h1>
            <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
              Lugares de saúde, cultura, acolhimento, direitos e convivência. Selecione seu estado para encontrar rotas seguras e pontos verificados pela comunidade.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              {[
                { label: 'Espaços', value: spaces.length },
                { label: 'Categorias', value: safeSpaceCategories.length },
                { label: 'Badges', value: safeSpaceBadgeKeys.length },
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
        {communityMessage && (
          <div role="status" className={'mb-5 rounded-xl border p-4 text-sm ' + (communityMessage.success ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700')}>
            {communityMessage.text}
          </div>
        )}
        <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 md:p-5 flex items-start gap-3 mb-6">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-500 shrink-0">
            <i className="ri-shield-check-line text-lg" aria-hidden="true"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark-700">MVP do mapa de espaços seguros</p>
            <p className="mt-1 text-xs text-dark-500 leading-relaxed">
              Esta versão combina 12 badges oficiais, avaliação comunitária, níveis de verificação e filtros avançados para encontrar acolhimento com mais precisão.
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

        <div className="mt-6 rounded-2xl border border-dark-100 bg-white p-4 md:p-5">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Filtros avançados</p>
              <h2 className="mt-1 text-lg font-semibold text-dark-800">Badges, distância, preço e estrutura</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
              <div>
                <p className="mb-2 text-xs font-semibold text-dark-500">Badge</p>
                <div className="flex flex-wrap gap-2">
                  {['Todos', ...safeSpaceBadgeKeys].map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setActiveBadge(badge)}
                      className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                        activeBadge === badge
                          ? 'border-secondary-500 bg-secondary-500 text-white'
                          : 'border-dark-200 bg-white text-dark-600 hover:border-secondary-300'
                      }`}
                    >
                      {badge === 'Todos' ? 'Todos' : badgeLabels[badge]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-dark-500">Distância</p>
                <div className="flex flex-wrap gap-2">
                  {distanceFilters.map((distance) => (
                    <button
                      key={distance.value}
                      type="button"
                      onClick={() => setMaxDistance(distance.value)}
                      className={`rounded-full border px-3 py-2 text-xs font-medium ${
                        maxDistance === distance.value
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-dark-200 bg-white text-dark-600'
                      }`}
                    >
                      até {distance.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-dark-500">Preço</p>
                <div className="flex flex-wrap gap-2">
                  {priceFilters.map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setPriceFilter(price)}
                      className={`rounded-full border px-3 py-2 text-xs font-medium ${
                        priceFilter === price ? 'border-dark-800 bg-dark-800 text-white' : 'border-dark-200 bg-white text-dark-600'
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Acessibilidade', value: needsAccessibility, set: setNeedsAccessibility },
                { label: 'Wi-Fi disponível', value: needsWifi, set: setNeedsWifi },
                { label: 'Aberto agora', value: openNowOnly, set: setOpenNowOnly },
              ].map((filter) => (
                <label key={filter.label} className="inline-flex items-center gap-2 rounded-full border border-dark-200 px-3 py-2 text-xs font-medium text-dark-600">
                  <input
                    type="checkbox"
                    checked={filter.value}
                    onChange={(event) => filter.set(event.target.checked)}
                    className="h-4 w-4 accent-primary-500"
                  />
                  {filter.label}
                </label>
              ))}
            </div>
          </div>
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

        <div className="mt-8 overflow-hidden rounded-2xl border border-dark-100 bg-white">
          <div className="grid lg:grid-cols-[360px_1fr]">
            <div className="max-h-[520px] overflow-y-auto border-b border-dark-100 p-4 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Mapa colaborativo</p>
              <h2 className="mt-1 text-xl font-semibold text-dark-800">Espaços seguros próximos</h2>
              <p className="mt-2 text-xs leading-relaxed text-dark-500">Selecione um ponto para visualizar no mapa e conferir sua verificação comunitária.</p>
              <div className="mt-4 grid gap-2">
                {visibleSpaces.map((space) => (
                  <button
                    key={space.slug}
                    type="button"
                    onClick={() => setSelectedMapSlug(space.slug)}
                    className={'rounded-xl border p-3 text-left transition-colors ' + (selectedMapSpace?.slug === space.slug ? 'border-primary-300 bg-primary-50' : 'border-dark-100 hover:border-primary-200')}
                  >
                    <span className="block text-sm font-semibold text-dark-800">{space.name}</span>
                    <span className="mt-1 block text-xs text-dark-500">{space.category} · {space.address}</span>
                    <span className="mt-2 block text-[11px] font-semibold text-amber-700">Nível {space.verificationLevel || 1}: {verificationLabels[space.verificationLevel || 1]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="relative min-h-[420px] bg-dark-50">
              <iframe
                key={mapQuery}
                title={selectedMapSpace ? 'Mapa de ' + selectedMapSpace.name : 'Mapa de espaços seguros'}
                src={'https://www.google.com/maps?q=' + mapQuery + '&output=embed'}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
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
                  <GuideSpaceImage space={space} />
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 text-dark-700 backdrop-blur-sm">
                    {space.category}
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
                    <FavoriteButton 
                      item={{
                        id: space.slug,
                        type: 'place',
                        title: space.name,
                        slug: space.slug,
                        image: space.image,
                        category: space.category
                      }} 
                    />
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
                        <p className="text-sm font-bold text-dark-700">{scoreFor(space).rating.toFixed(1)} ⭐</p>
                        <p className="text-[11px] text-dark-400">{scoreFor(space).reviews} aval.</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
                      Nível {space.verificationLevel || 1}: {verificationLabels[space.verificationLevel || 1]}
                    </span>
                    {space.distanceKm !== undefined && (
                      <span className="rounded-full bg-dark-50 px-2.5 py-1 text-dark-500">{space.distanceKm}km</span>
                    )}
                    {space.price && <span className="rounded-full bg-dark-50 px-2.5 py-1 text-dark-500">{space.price}</span>}
                    {space.openNow && <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700">Aberto agora</span>}
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
                    <button
                      type="button"
                      onClick={() => setActiveReviewSlug(activeReviewSlug === space.slug ? null : space.slug)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                    >
                      <i className="ri-star-line" aria-hidden="true"></i>
                      Avaliar
                    </button>
                    <button
                      type="button"
                      disabled={communityBusy}
                      onClick={() => submitVerification(space)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      <i className="ri-shield-check-line" aria-hidden="true"></i>
                      Confirmar local
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReportSlug(activeReportSlug === space.slug ? null : space.slug)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      <i className="ri-flag-line" aria-hidden="true"></i>
                      Reportar
                    </button>
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
                  {activeReviewSlug === space.slug && (
                    <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50/40 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="text-sm font-semibold text-dark-700">
                          Nota
                          <select
                            value={reviewRating}
                            onChange={(event) => setReviewRating(Number(event.target.value))}
                            className="ml-2 rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm"
                          >
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <option key={rating} value={rating}>{rating} ⭐</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-sm font-semibold text-dark-700">
                          Perfil
                          <select
                            value={reviewerTag}
                            onChange={(event) => setReviewerTag(event.target.value)}
                            className="ml-2 rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm"
                          >
                            {reviewerTags.map((tag) => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="mt-4 grid gap-2">
                        {reviewQuestions.map((question) => (
                          <label key={question} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs text-dark-600">
                            <span>{question}</span>
                            <input
                              type="checkbox"
                              checked={reviewAnswers[question]}
                              onChange={(event) => setReviewAnswers({ ...reviewAnswers, [question]: event.target.checked })}
                              className="h-4 w-4 accent-primary-500"
                            />
                          </label>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => submitReview(space)}
                        disabled={communityBusy}
                        className="mt-4 w-full rounded-xl bg-dark-800 px-4 py-3 text-sm font-semibold text-white hover:bg-dark-900"
                      >
                        Enviar avaliação
                      </button>
                    </div>
                  )}
                  {activeReportSlug === space.slug && (
                    <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                      <label className="block text-sm font-semibold text-dark-700">
                        Motivo
                        <select value={reportReason} onChange={(event) => setReportReason(event.target.value)} className="mt-2 w-full rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm">
                          <option>Informação desatualizada</option>
                          <option>Relato de discriminação</option>
                          <option>Local fechado ou inexistente</option>
                          <option>Conteúdo inadequado</option>
                        </select>
                      </label>
                      <label className="mt-3 block text-sm font-semibold text-dark-700">
                        Detalhes
                        <textarea value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} maxLength={1000} rows={4} className="mt-2 w-full resize-y rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm" placeholder="Conte o que aconteceu sem incluir dados pessoais sensíveis." />
                      </label>
                      <button type="button" disabled={communityBusy} onClick={() => submitReport(space)} className="mt-3 w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
                        Enviar reporte
                      </button>
                    </div>
                  )}
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
                Envie os dados do local para a nossa curadoria. Verificamos as informações antes de publicar no guia.
              </p>
            </div>
            <Link
              to="/guia-fortaleza/indicar"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap shrink-0"
            >
              Indicar espaço
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
