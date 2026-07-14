import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CultureItem } from '@/mocks/culture';
import { typeColors, typeIcons } from '@/mocks/culture';

interface CultureHeaderProps {
  item: CultureItem;
}

export default function CultureHeader({ item }: CultureHeaderProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'pt-BR';
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formattedDate = useMemo(() => {
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) return item.date;
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [item.date, locale]);

  return (
    <header className="relative w-full">
      <div className="relative w-full h-[320px] md:h-[480px] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          width={1600}
          height={900}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-dark-700/60 to-transparent"></div>
      </div>

      <div className="relative -mt-24 md:-mt-32 px-4 md:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-dark-100 p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
                <i className={`${typeIcons[item.type]} text-xs`} aria-hidden="true"></i>
                {t(`culture.type.${item.type}`)}
              </span>
              {item.year && (
                <span className="text-xs text-dark-400">{item.year}</span>
              )}
              {item.rating && (
                <span className="flex items-center gap-1 text-xs font-semibold text-secondary-500">
                  <i className="ri-star-fill" aria-hidden="true"></i>
                  {item.rating}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-playfair font-bold text-dark-700 leading-tight">
              {item.title}
            </h1>
            <p className="mt-2 text-base md:text-lg text-dark-500 leading-relaxed">
              {item.subtitle}
            </p>
            <p className="mt-3 text-sm text-dark-400 leading-relaxed">
              {item.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-4 pt-6 border-t border-dark-50">
              <div className="flex items-center gap-3">
                <img
                  src={item.authorPhoto}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="block text-sm font-medium text-dark-700">{item.author}</span>
                  <span className="block text-xs text-dark-400">{item.authorRole}</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-dark-100"></div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-dark-400">
                <span className="flex items-center gap-1">
                  <i className="ri-calendar-line" aria-hidden="true"></i>
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-time-line" aria-hidden="true"></i>
                  {t('culture.readTime', { count: item.readTime })}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-eye-line" aria-hidden="true"></i>
                  {t('culture.views', { count: numberFormatter.format(item.views) })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}