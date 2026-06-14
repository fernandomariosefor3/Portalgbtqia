import { useMemo } from 'react';
import type { Article } from '@/mocks/articles-full';
import { categoryLabels } from '@/mocks/articles-full';

interface ArticleHeaderProps {
  article: Article;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const formattedDate = useMemo(() => {
    return new Date(article.date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [article.date]);

  return (
    <header className="relative w-full">
      <div className="relative w-full h-[320px] md:h-[480px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-dark-700/60 to-transparent"></div>
      </div>

      <div className="relative -mt-24 md:-mt-32 px-4 md:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-dark-100 p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700`}>
                {categoryLabels[article.category] || article.category}
              </span>
              {article.subcategory && (
                <span className="text-xs text-dark-400">
                  {article.subcategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-playfair font-bold text-dark-700 leading-tight">
              {article.title}
            </h1>

            <p className="mt-4 text-base md:text-lg text-dark-500 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-4 pt-6 border-t border-dark-50">
              <div className="flex items-center gap-3">
                <img
                  src={article.authorPhoto}
                  alt={article.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="block text-sm font-medium text-dark-700">{article.author}</span>
                  <span className="block text-xs text-dark-400">{article.authorRole}</span>
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
                  {article.readTime} min de leitura
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-eye-line" aria-hidden="true"></i>
                  {article.views.toLocaleString()} leituras
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}