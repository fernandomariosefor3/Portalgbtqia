import { Link } from 'react-router-dom';
import type { EventItem } from '@/mocks/events';
import { eventCategories } from '@/mocks/events';

interface EventCardProps {
  event: EventItem;
  variant?: 'default' | 'featured';
}

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

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        to={`/eventos/${event.slug}`}
        className="group block rounded-xl overflow-hidden bg-white border border-dark-100 hover:border-primary-200 transition-all hover:shadow-lg"
      >
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${getCategoryColor(event.category)}`}>
              {getCategoryLabel(event.category)}
            </span>
          </div>
          {event.is_featured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
                <i className="ri-star-fill text-xs"></i> Destaque
              </span>
            </div>
          )}
        </div>
        <div className="p-4 md:p-5">
          <h3 className="text-base md:text-lg font-semibold text-dark-800 group-hover:text-primary-400 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-dark-500">
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
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-dark-500">
            <i className="ri-map-pin-line"></i>
            <span className="truncate">{event.city}, {event.state}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-600">{event.price_info}</span>
            <span className="text-xs text-dark-400 flex items-center gap-1">
              <i className="ri-eye-line"></i> {event.views.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/eventos/${event.slug}`}
      className="group flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-xl overflow-hidden bg-white border border-dark-100 hover:border-primary-200 transition-all hover:shadow-md p-3 sm:p-0"
    >
      <div className="relative w-full sm:w-40 md:w-48 h-40 sm:h-auto sm:aspect-[4/3] flex-shrink-0 rounded-lg sm:rounded-none overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 sm:hidden">
          <span className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded-full ${getCategoryColor(event.category)}`}>
            {getCategoryLabel(event.category)}
          </span>
        </div>
      </div>
      <div className="flex-1 py-1 sm:py-3 pr-3 flex flex-col justify-between">
        <div>
          <div className="hidden sm:flex items-center gap-2 mb-2">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium text-white rounded-full ${getCategoryColor(event.category)}`}>
              {getCategoryLabel(event.category)}
            </span>
            {event.is_featured && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                <i className="ri-star-fill text-xs"></i> Destaque
              </span>
            )}
          </div>
          <h3 className="text-sm md:text-base font-semibold text-dark-800 group-hover:text-primary-400 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="mt-1 text-xs text-dark-500 line-clamp-2 hidden sm:block">
            {event.short_description}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dark-500">
          <span className="flex items-center gap-1">
            <i className="ri-calendar-line"></i>
            {formatDate(event.start_date)}
          </span>
          <span className="flex items-center gap-1">
            <i className="ri-map-pin-line"></i>
            {event.city}
          </span>
          <span className="text-emerald-600 font-medium">{event.price_info}</span>
        </div>
      </div>
    </Link>
  );
}