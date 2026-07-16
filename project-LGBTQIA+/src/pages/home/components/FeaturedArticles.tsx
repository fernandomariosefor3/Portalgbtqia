import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useArticles } from '@/lib/useArticles';

export default function FeaturedArticles() {
  const { articles } = useArticles();
  const { t } = useTranslation();

  // Os 3 primeiros como destaque e os 4 seguintes como "últimos".
  const featuredArticles = articles.slice(0, 3);
  const latestArticles = articles.slice(3, 7);

  return (
    <section className="w-full bg-surface py-14 md:py-20 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-xs md:text-sm font-medium text-accent-400 uppercase tracking-wider">
              {t('home.featured.eyebrow')}
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-playfair font-bold text-dark-700">
              {t('home.featured.title')}
            </h2>
          </div>
          <Link
            to="/artigos"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors whitespace-nowrap"
          >
            {t('home.featured.viewAll')}
            <i className="ri-arrow-right-line" aria-hidden="true"></i>
          </Link>
        </div>

        {/* Área de Destaques: 1 Principal + 2 Secundários */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          {/* Destaque Principal (Maior) */}
          {featuredArticles.length > 0 && (
            <Link
              key={featuredArticles[0].id}
              to={`/artigos/${featuredArticles[0].slug || featuredArticles[0].id}`}
              className="lg:col-span-8 group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full aspect-[16/10] md:aspect-[16/8] overflow-hidden">
                <img
                  src={featuredArticles[0].image}
                  alt={featuredArticles[0].title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-800/90 via-dark-800/20 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold rounded-full bg-primary-500 text-white shadow-sm">
                  {featuredArticles[0].subcategory || featuredArticles[0].category}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <h3 className="text-xl md:text-3xl font-playfair font-bold text-white leading-tight group-hover:text-primary-300 transition-colors line-clamp-2 md:line-clamp-3">
                  {featuredArticles[0].title}
                </h3>
                <p className="mt-2 md:mt-3 text-sm md:text-base text-white/80 line-clamp-2 leading-relaxed max-w-3xl">
                  {featuredArticles[0].excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs font-medium text-white/70">
                  <span className="text-white/90">{featuredArticles[0].author}</span>
                  <div className="flex items-center gap-1">
                    <i className="ri-time-line" aria-hidden="true"></i>
                    {featuredArticles[0].readTime} {t('home.featured.readTime')}
                  </div>
                  <span className="hidden sm:inline">{featuredArticles[0].date}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Destaques Secundários */}
          <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6">
            {featuredArticles.slice(1, 3).map((article) => (
              <Link
                key={article.id}
                to={`/artigos/${article.slug || article.id}`}
                className="group relative flex flex-col flex-1 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-dark-100"
              >
                <div className="relative w-full aspect-[16/9] lg:aspect-[4/3] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-700/60 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-white/95 text-dark-700 backdrop-blur-sm">
                    {article.subcategory || article.category}
                  </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-dark-700 leading-snug group-hover:text-primary-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-dark-400">
                    <span className="font-medium text-dark-500 truncate max-w-[120px]">{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Últimas Publicações (Acesso Rápido) */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-dark-100">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-playfair font-bold text-dark-700">Mais recentes</h3>
            <div className="flex-1 h-px bg-dark-100"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                to={`/artigos/${article.slug || article.id}`}
                className="group flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-white border border-transparent hover:border-primary-100 hover:bg-primary-50/30 transition-all hover:shadow-sm"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[10px] font-bold text-accent-500 uppercase tracking-wide">
                    {article.category}
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-dark-700 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h4>
                  <span className="mt-1.5 text-xs text-dark-400 flex items-center gap-1">
                    <i className="ri-calendar-line"></i> {article.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            to="/artigos"
            className="inline-flex items-center justify-center w-full py-3 px-6 rounded-full bg-dark-50 text-sm font-semibold text-dark-600 hover:bg-dark-100 transition-colors"
          >
            {t('home.featured.viewAllArticles')}
            <i className="ri-arrow-right-line ml-2" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
