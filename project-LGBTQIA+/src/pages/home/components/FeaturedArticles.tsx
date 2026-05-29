import { Link } from 'react-router-dom';
import { featuredArticles, latestArticles } from '@/mocks/articles';

export default function FeaturedArticles() {
  return (
    <section className="w-full bg-surface py-14 md:py-20 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-xs md:text-sm font-medium text-accent-400 uppercase tracking-wider">
              Destaques editoriais
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-playfair font-bold text-dark-700">
              Artigos em destaque
            </h2>
          </div>
          <Link
            to="/artigos"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-500 transition-colors whitespace-nowrap"
          >
            Ver todos
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {featuredArticles.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              to={`/artigos/${article.slug || article.id}`}
              className="group relative flex flex-col rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-700/60 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-dark-700 backdrop-blur-sm">
                  {article.subcategory}
                </span>
              </div>
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <h3 className="text-base md:text-lg font-semibold text-dark-700 leading-snug group-hover:text-primary-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-dark-400 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-dark-400">
                  <span className="font-medium text-dark-500">{article.author}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      {article.readTime} min
                    </span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {latestArticles.map((article) => (
            <Link
              key={article.id}
              to={`/artigos/${article.slug || article.id}`}
              className="group flex gap-3 md:gap-4 p-3 md:p-4 rounded-lg bg-white hover:bg-surface-warm transition-colors"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-xs font-medium text-accent-400 uppercase">
                  {article.category}
                </span>
                <h4 className="mt-0.5 text-sm font-semibold text-dark-700 leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {article.title}
                </h4>
                <span className="mt-1 text-xs text-dark-400">{article.date}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 md:hidden text-center">
          <Link
            to="/artigos"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-500 transition-colors whitespace-nowrap"
          >
            Ver todos os artigos
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}