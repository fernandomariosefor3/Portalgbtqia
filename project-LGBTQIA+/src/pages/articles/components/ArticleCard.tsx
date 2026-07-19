import { Link } from 'react-router-dom';
import type { Article } from '@/mocks/articles-full';
import { categoryLabels, categoryColors } from '@/mocks/articles-full';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

function FallbackImage({ category }: { category: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${categoryColors[category] || 'bg-dark-100 text-dark-400'}`}>
      <i className="ri-article-line text-4xl opacity-50" aria-hidden="true"></i>
    </div>
  );
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = article.image && !imageError;
  const cardUrl = `/artigos/${article.slug}`;

  if (variant === 'featured') {
    return (
      <Link 
        to={cardUrl} 
        className="group relative flex flex-col md:flex-row gap-0 md:gap-6 rounded-xl overflow-hidden bg-white border border-dark-100 hover:border-primary-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent block w-full"
      >
        <div className="w-full md:w-[45%] h-52 md:h-auto overflow-hidden bg-dark-50 shrink-0 aspect-[16/9] md:aspect-auto">
          {hasImage ? (
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <FallbackImage category={article.category} />
          )}
        </div>
        <div className="flex-1 p-5 md:py-6 md:pr-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-dark-100 text-dark-600'}`}>
              {categoryLabels[article.category] || article.category}
            </span>
            <span className="text-xs text-dark-400 font-medium">
              {article.date || 'Sem data'}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-playfair font-bold text-dark-700 leading-snug group-hover:text-primary-500 transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-dark-400 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
          <div className="mt-auto pt-4 flex items-center gap-3">
            {article.authorPhoto && (
              <img
                src={article.authorPhoto}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <span className="text-xs text-dark-500 font-medium">{article.author || 'Redação'}</span>
            <span className="text-dark-200">·</span>
            <span className="text-xs text-dark-400 font-medium">{article.readTime || 3} min de leitura</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link 
        to={cardUrl} 
        className="group flex gap-4 items-start focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-lg p-1 -m-1 transition-all"
      >
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-dark-50">
          {hasImage ? (
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <FallbackImage category={article.category} />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
          <span className={`inline-flex self-start items-center px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5 ${categoryColors[article.category] || 'bg-dark-100 text-dark-600'}`}>
            {categoryLabels[article.category] || article.category}
          </span>
          <h4 className="text-sm font-medium text-dark-700 leading-snug group-hover:text-primary-500 transition-colors line-clamp-2">
            {article.title}
          </h4>
          <span className="mt-1 block text-xs text-dark-400 font-medium">{article.date || 'Sem data'}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={cardUrl} 
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-dark-100 hover:border-primary-200 hover:shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent w-full"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-dark-50 shrink-0">
        {hasImage ? (
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <FallbackImage category={article.category} />
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-dark-100 text-dark-600'}`}>
            {categoryLabels[article.category] || article.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-playfair font-bold text-dark-700 leading-snug group-hover:text-primary-500 transition-colors line-clamp-3">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-dark-400 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-4 flex items-center gap-3 border-t border-dark-50">
          <div className="flex flex-col">
            <span className="text-xs text-dark-500 font-medium">{article.author || 'Redação'}</span>
            <span className="text-[11px] text-dark-400 font-medium mt-0.5">{article.date || 'Sem data'} · {article.readTime || 3} min de leitura</span>
          </div>
        </div>
      </div>
    </Link>
  );
}