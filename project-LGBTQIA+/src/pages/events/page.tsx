import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import { useEvents } from '@/lib/useEvents';
import { useSiteSection } from '@/lib/useSiteSection';

const fallbackHero = {
  title: 'Eventos & Agenda',
  subtitle: 'Agenda LGBTQ+ Nordeste',
  description: 'Descubra paradas, festas, encontros, workshops e celebrações da comunidade LGBTQ+ em Fortaleza e todo o Nordeste.',
  image: 'https://readdy.ai/api/search-image?query=Aerial%20view%20of%20colorful%20LGBTQ%20pride%20parade%20crowd%20from%20above%2C%20confetti%20and%20rainbow%20flags%20filling%20the%20streets%2C%20warm%20tropical%20sunlight%2C%20editorial%20photography%2C%20high%20quality%2C%20vibrant%20warm%20tones&width=1400&height=500&seq=eventshero&orientation=landscape',
  ctaLabel: 'Indicar evento',
  ctaUrl: '/eventos/submeter',
};

export default function EventsPage() {
  const { events, loading } = useEvents();
  const { content: heroContent } = useSiteSection('events-hero', fallbackHero);
  
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeState, setActiveState] = useState('todos');
  const [activeCity, setActiveCity] = useState('todas');
  const [sortBy, setSortBy] = useState('date_asc');
  const [timeFilter, setTimeFilter] = useState('todos');

  const states = useMemo(() => {
    const defaultNortheastStates = ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'];
    const statesFromData = new Set(events.map(e => e.state).filter(Boolean));
    defaultNortheastStates.forEach(st => statesFromData.add(st));
    return Array.from(statesFromData).sort();
  }, [events]);

  const cities = useMemo(() => {
    let filtered = events;
    if (activeState !== 'todos') {
      filtered = filtered.filter(e => e.state === activeState);
    }
    const set = new Set(filtered.map((e) => e.city).filter(Boolean));
    return Array.from(set).sort();
  }, [events, activeState]);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (activeCategory !== 'todos') {
      result = result.filter((e) => e.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.tags.some((t) => t.includes(q))
      );
    }

    if (activeState !== 'todos') {
      result = result.filter((e) => e.state === activeState);
    }

    if (activeCity !== 'todas') {
      result = result.filter((e) => e.city === activeCity);
    }

    if (timeFilter !== 'todos') {
      const days = parseInt(timeFilter, 10);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + days);
      result = result.filter((e) => {
        const d = new Date(e.start_date);
        return d <= cutoff && d >= new Date();
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        case 'date_desc':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case 'views':
          return b.views - a.views;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [events, activeCategory, searchQuery, activeState, activeCity, sortBy, timeFilter]);

  const featured = filteredEvents.filter((e) => e.is_featured);
  const regular = filteredEvents.filter((e) => !e.is_featured);

  return (
    <main className="min-h-screen bg-surface-50">
      <section className="relative pt-20 md:pt-24 pb-10 md:pb-14 bg-dark-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroContent.image || fallbackHero.image}
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-800/90 via-dark-800/70 to-dark-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-primary-300 bg-primary-400/20 rounded-full mb-4">
                <i className="ri-calendar-event-line" aria-hidden="true"></i> {heroContent.subtitle || fallbackHero.subtitle}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight">
                {heroContent.title || fallbackHero.title}
              </h1>
              <p className="mt-3 text-base md:text-lg text-white/70 max-w-xl">
                {heroContent.description || fallbackHero.description}
              </p>
            </div>
            <Link
              to={heroContent.ctaUrl || fallbackHero.ctaUrl}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              <i className="ri-add-circle-line" aria-hidden="true"></i>
              {heroContent.ctaLabel || fallbackHero.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10">
        <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 md:p-5 flex items-start gap-3 mb-8">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-500 shrink-0">
            <i className="ri-calendar-event-line text-lg" aria-hidden="true"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-dark-700">Agenda em construção</p>
            <p className="mt-1 text-xs text-dark-500 leading-relaxed">
              Estamos construindo nossa agenda de eventos com parcerias locais. Envie sugestões de paradas, festas, rodas de conversa e workshops da comunidade LGBTQ+ no Nordeste.
            </p>
          </div>
        </div>

        <EventFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeState={activeState}
          onStateChange={(state) => { setActiveState(state); setActiveCity('todas'); }}
          states={states}
          activeCity={activeCity}
          onCityChange={setActiveCity}
          cities={cities}
          sortBy={sortBy}
          onSortChange={setSortBy}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-dark-100 bg-white overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-dark-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-dark-100 rounded" />
                    <div className="h-3 w-1/2 bg-dark-100 rounded" />
                    <div className="h-3 w-full bg-dark-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-100 text-dark-400 text-2xl mb-4">
                <i className="ri-calendar-close-line" aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-semibold text-dark-700">Nenhum evento encontrado</h3>
              <p className="mt-1 text-sm text-dark-500">Tente ajustar os filtros ou a busca.</p>
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-dark-500 mb-4">
                    Destaques
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {featured.map((event) => (
                      <EventCard key={event.id} event={event} variant="featured" />
                    ))}
                  </div>
                </div>
              )}

              {regular.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-dark-500 mb-4">
                    Todos os eventos ({filteredEvents.length})
                  </h2>
                  <div className="flex flex-col gap-4">
                    {regular.map((event) => (
                      <EventCard key={event.id} event={event} variant="default" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}