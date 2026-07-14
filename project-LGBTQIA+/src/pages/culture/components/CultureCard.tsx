import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CultureItem } from '@/mocks/culture';
import { typeColors, typeIcons } from '@/mocks/culture';

interface CultureCardProps {
  item: CultureItem;
  variant?: 'default' | 'featured' | 'compact';
}

export default function CultureCard({ item, variant = 'default' }: CultureCardProps) {
  const { t, i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'pt-BR');

  if (variant === 'featured') {
    return (
      <article className="group relative flex flex-col md:flex-row gap-0 md:gap-6 rounded-xl overflow-hidden bg-white border border-dark-100 hover:border-primary-200 transition-[border-color,box-shadow] duration-300">
        <div className="w-full md:w-[45%] h-52 md:h-auto overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex-1 p-5 md:py-6 md:pr-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
              <i className={`${typeIcons[item.type]} text-xs`} aria-hidden="true"></i>
              {t(`culture.type.${item.type}`)}
            </span>
            {item.year && (
              <span className="text-xs text-dark-400">{item.year}</span>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-playfair font-bold text-dark-700 leading-snug group-hover:text-primary-500 transition-colors">
            <Link to={`/cultura/${item.slug}`} className="after:absolute after:inset-0 focus:outline-none">
              {item.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-dark-400 leading-relaxed line-clamp-3">
            {item.excerpt}
          </p>
          <div className="mt-auto pt-4 flex items-center gap-3">
            <img
              src={item.authorPhoto}
              alt={item.author}
              className="w-7 h-7 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-xs text-dark-500 font-medium">{item.author}</span>
            <span className="text-dark-200">·</span>
            <span className="text-xs text-dark-400">{t('culture.readTime', { count: item.readTime })}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 items-start">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5 ${typeColors[item.type]}`}>
            <i className={`${typeIcons[item.type]} text-[10px]`} aria-hidden="true"></i>
            {t(`culture.type.${item.type}`)}
          </span>
          <h4 className="text-sm font-medium text-dark-700 leading-snug group-hover:text-primary-500 transition-colors">
            <Link to={`/cultura/${item.slug}`}>{item.title}</Link>
          </h4>
          <span className="mt-1 block text-xs text-dark-400">{item.year}</span>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden bg-white border border-dark-100 hover:border-primary-200 hover:shadow-sm transition-[border-color,box-shadow] duration-300">
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
            <i className={`${typeIcons[item.type]} text-xs`} aria-hidden="true"></i>
            {t(`culture.type.${item.type}`)}
          </span>
        </div>
        {item.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-dark-700">
            <i className="ri-star-fill text-secondary-400" aria-hidden="true"></i>
            {item.rating}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-playfair font-bold text-dark-700 leading-snug group-hover:text-primary-500 transition-colors">
          <Link to={`/cultura/${item.slug}`} className="after:absolute after:inset-0 focus:outline-none relative">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-dark-400 leading-relaxed line-clamp-3">
          {item.excerpt}
        </p>
        <div className="mt-auto pt-4 flex items-center gap-3 border-t border-dark-50">
          <img
            src={item.authorPhoto}
            alt={item.author}
            className="w-7 h-7 rounded-full object-cover"
            loading="lazy"
          />
          <div className="flex flex-col">
            <span className="text-xs text-dark-500 font-medium">{item.author}</span>
            <span className="text-[11px] text-dark-400">{t('culture.readTime', { count: item.readTime })} · {t('culture.views', { count: numberFormatter.format(item.views) })}</span>
          </div>
        </div>
      </div>
    </article>
  );
}