import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import { featuredEvents } from '@/mocks/events';

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState('todas');
  const [sortBy, setSortBy] = useState('date_asc');
  const [timeFilter, setTimeFilter] = useState('todos');

  const cities = useMemo(() => {
    const set = new Set(featuredEvents.map((e) => e.city));
    return Array.from(set).sort();
  }, []);

  const filteredEvents = useMemo(() => {
    let result = [...featuredEvents];

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
  }, [activeCategory, searchQuery, activeCity, sortBy, timeFilter]);

  const featured = filteredEvents.filter((e) => e.is_featured);
  const regular = filteredEvents.filter((e) => !e.is_featured);

  return (
    <main className="min-h-screen bg-surface-50">
      <section className="relative pt-20 md:pt-24 pb-10 md:pb-14 bg-dark-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://readdy.ai/api/search-image?query=Aerial%20view%20of%20colorful%20LGBTQ%20pride%20parade%20crowd%20from%20above%2C%20confetti%20and%20rainbow%20flags%20filling%20the%20streets%2C%20warm%20tropical%20sunlight%2C%20editorial%20photography%2C%20high%20quality%2C%20vibrant%20warm%20tones&width=1400&height=500&seq=eventshero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-800/90 via-dark-800/70 to-dark-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-primary-300 bg-primary-400/20 rounded-full mb-4">
                <i className="ri-calendar-event-line"></i> Agenda LGBTQ+ Nordeste
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight">
                Eventos & Agenda
              </h1>
              <p className="mt-3 text-base md:text-lg text-white/70 max-w-xl">
                Descubra paradas, festas, encontros, workshops e celebrações da comunidade LGBTQ+ em Fortaleza e todo o Nordeste.
              </p>
            </div>
            <Link
              to="/eventos/submeter"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors whitespace-nowrap"
            >
              <i className="ri-add-circle-line"></i>
              Indicar evento
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10">
        <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4 md:p-5 flex items-start gap-3 mb-8">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-500 shrink-0">
            <i className="ri-calendar-event-line text-lg"></i>
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
          activeCity={activeCity}
          onCityChange={setActiveCity}
          cities={cities}
          sortBy={sortBy}
          onSortChange={setSortBy}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />

        <div className="mt-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-100 text-dark-400 text-2xl mb-4">
                <i className="ri-calendar-close-line"></i>
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