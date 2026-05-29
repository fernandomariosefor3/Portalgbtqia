import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { featuredEvents, eventCategories } from '@/mocks/events';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

function getCategoryColor(category: string): string {
  const cat = eventCategories.find((c) => c.value === category);
  return cat?.color || 'bg-dark-700';
}

function getCategoryLabel(category: string): string {
  const cat = eventCategories.find((c) => c.value === category);
  return cat?.label || category;
}

function getPlatformInfo(url: string): { icon: string; label: string; color: string } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.includes('instagram') || host.includes('instagr.am')) {
      return { icon: 'ri-instagram-line', label: 'Ver no Instagram', color: 'hover:bg-pink-50 hover:text-pink-600' };
    }
    if (host.includes('facebook') || host.includes('fb.me')) {
      return { icon: 'ri-facebook-fill', label: 'Ver no Facebook', color: 'hover:bg-blue-50 hover:text-blue-600' };
    }
    if (host.includes('twitter') || host.includes('x.com')) {
      return { icon: 'ri-twitter-x-line', label: 'Ver no X', color: 'hover:bg-sky-50 hover:text-sky-500' };
    }
    return { icon: 'ri-external-link-line', label: 'Site oficial do evento', color: 'hover:bg-primary-50 hover:text-primary-400' };
  } catch {
    return { icon: 'ri-external-link-line', label: 'Site oficial do evento', color: 'hover:bg-primary-50 hover:text-primary-400' };
  }
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const event = useMemo(() => {
    return featuredEvents.find((e) => e.slug === slug);
  }, [slug]);

  const related = useMemo(() => {
    if (!event) return [];
    return featuredEvents
      .filter((e) => e.slug !== event.slug && (e.category === event.category || e.city === event.city))
      .slice(0, 3);
  }, [event]);

  if (!event) {
    return (
      <main className="min-h-screen bg-surface-50 pt-24 pb-16">
        <div className="text-center px-4">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-100 text-dark-400 text-2xl mb-4">
            <i className="ri-calendar-close-line"></i>
          </div>
          <h1 className="text-xl font-semibold text-dark-700">Evento não encontrado</h1>
          <Link to="/eventos" className="mt-4 inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-500">
            <i className="ri-arrow-left-line"></i> Ver todos os eventos
          </Link>
        </div>
      </main>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(`${event.title} — ${event.city}, ${event.state}`);
    const url = encodeURIComponent(shareUrl);
    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        return;
    }
    if (shareLink) window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const platformInfo = event.source_url ? getPlatformInfo(event.source_url) : null;

  return (
    <main className="min-h-screen bg-surface-50">
      <section className="relative pt-16 md:pt-20">
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-800/90 via-dark-800/40 to-dark-800/20"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pb-6 md:pb-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${getCategoryColor(event.category)}`}>
                {getCategoryLabel(event.category)}
              </span>
              {event.is_featured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
                  <i className="ri-star-fill text-xs"></i> Destaque
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight max-w-4xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <i className="ri-calendar-line"></i>
                {formatDate(event.start_date)}
                {event.end_date && event.end_date !== event.start_date && ` - ${formatDate(event.end_date)}`}
              </span>
              <span className="flex items-center gap-1">
                <i className="ri-time-line"></i>
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </span>
              <span className="flex items-center gap-1">
                <i className="ri-map-pin-line"></i>
                {event.city}, {event.state}
              </span>
              <span className="flex items-center gap-1">
                <i className="ri-eye-line"></i>
                {event.views.toLocaleString('pt-BR')} visualizações
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-dark-100 p-5 md:p-7">
              <h2 className="text-lg font-semibold text-dark-800 mb-4">Sobre o evento</h2>
              <p className="text-sm md:text-base text-dark-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>

              {event.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-dark-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium text-dark-600 bg-dark-50 border border-dark-100 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {related.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-dark-800 mb-4">Eventos relacionados</h3>
                <div className="flex flex-col gap-4">
                  {related.map((e) => (
                    <Link
                      key={e.id}
                      to={`/eventos/${e.slug}`}
                      className="group flex gap-4 bg-white rounded-xl border border-dark-100 hover:border-primary-200 transition-all p-3"
                    >
                      <div className="w-24 h-20 md:w-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={e.image_url}
                          alt={e.title}
                          className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded-full ${getCategoryColor(e.category)} mb-1`}>
                          {getCategoryLabel(e.category)}
                        </span>
                        <h4 className="text-sm font-semibold text-dark-800 group-hover:text-primary-400 transition-colors line-clamp-1">
                          {e.title}
                        </h4>
                        <p className="mt-1 text-xs text-dark-500 line-clamp-1">
                          {formatDate(e.start_date)} — {e.city}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-dark-100 p-5">
              <h3 className="text-sm font-semibold text-dark-700 mb-4">Informações</h3>
              <div className="space-y-3.5 text-sm">
                {event.location && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 text-primary-400 flex-shrink-0">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <div>
                      <p className="font-medium text-dark-700">{event.location}</p>
                      {event.address && <p className="text-dark-500 text-xs mt-0.5">{event.address}</p>}
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 text-primary-400 flex-shrink-0">
                    <i className="ri-calendar-line"></i>
                  </div>
                  <div>
                    <p className="font-medium text-dark-700">{formatDate(event.start_date)}</p>
                    {event.end_date && event.end_date !== event.start_date && (
                      <p className="text-dark-500 text-xs mt-0.5">Até {formatDate(event.end_date)}</p>
                    )}
                  </div>
                </div>
                {event.start_time && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-50 text-primary-400 flex-shrink-0">
                      <i className="ri-time-line"></i>
                    </div>
                    <div>
                      <p className="font-medium text-dark-700">
                        {formatTime(event.start_time)}
                        {event.end_time && ` - ${formatTime(event.end_time)}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-500 flex-shrink-0">
                    <i className="ri-price-tag-3-line"></i>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-600">{event.price_info}</p>
                  </div>
                </div>
                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 flex-shrink-0">
                      <i className="ri-building-line"></i>
                    </div>
                    <div>
                      <p className="font-medium text-dark-700">{event.organizer}</p>
                    </div>
                  </div>
                )}
                {event.contact_email && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-50 text-dark-400 flex-shrink-0">
                      <i className="ri-mail-line"></i>
                    </div>
                    <a href={`mailto:${event.contact_email}`} className="text-primary-400 hover:text-primary-500 text-xs break-all">
                      {event.contact_email}
                    </a>
                  </div>
                )}
                {event.contact_phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-50 text-dark-400 flex-shrink-0">
                      <i className="ri-phone-line"></i>
                    </div>
                    <span className="text-dark-600 text-xs">{event.contact_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {platformInfo && event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center px-5 py-3 text-sm font-medium rounded-full bg-dark-700 text-white transition-colors ${platformInfo.color}`}
              >
                <i className={`${platformInfo.icon} mr-1`}></i>
                {platformInfo.label}
              </a>
            )}

            <div className="bg-white rounded-xl border border-dark-100 p-5">
              <h3 className="text-sm font-semibold text-dark-700 mb-3">Compartilhar</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-50 text-dark-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  aria-label="Compartilhar no Facebook"
                >
                  <i className="ri-facebook-fill"></i>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-50 text-dark-500 hover:bg-sky-50 hover:text-sky-500 transition-colors"
                  aria-label="Compartilhar no Twitter"
                >
                  <i className="ri-twitter-x-fill"></i>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-50 text-dark-500 hover:bg-green-50 hover:text-green-600 transition-colors"
                  aria-label="Compartilhar no WhatsApp"
                >
                  <i className="ri-whatsapp-line"></i>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-50 text-dark-500 hover:bg-primary-50 hover:text-primary-400 transition-colors"
                  aria-label="Copiar link"
                >
                  <i className="ri-link"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}