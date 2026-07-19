import { useState, useEffect } from 'react';
import type { Article } from '@/mocks/articles-full';
import { categoryLabels } from '@/mocks/articles-full';
import FavoriteButton from '@/components/feature/FavoriteButton';
import { Link } from 'react-router-dom';

interface ArticleHeaderProps {
  article: Article;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [hasWebShare, setHasWebShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setHasWebShare(true);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Ignored
      }
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${article.title}\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (value: string, fallback: string) => {
    if (!value) return fallback;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const formattedDate = formatDate(article.date, 'Publicado recentemente');
  const formattedUpdatedAt = formatDate(article.updatedAt, '');

  return (
    <header className="relative w-full">
      <div className="relative w-full h-[320px] md:h-[480px] overflow-hidden bg-dark-50">
        {article.image && (
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-dark-700/60 to-transparent"></div>
      </div>

      <div className="relative -mt-24 md:-mt-32 px-4 md:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-dark-100 p-6 md:p-10 shadow-sm">
            
            <nav className="mb-6 flex text-sm text-dark-400 overflow-x-auto whitespace-nowrap pb-2" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center hover:text-primary-500 transition-colors focus:outline-none focus:underline">
                    Início
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <i className="ri-arrow-right-s-line mx-1" aria-hidden="true"></i>
                    <Link to="/artigos" className="hover:text-primary-500 transition-colors focus:outline-none focus:underline">
                      Artigos
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <i className="ri-arrow-right-s-line mx-1" aria-hidden="true"></i>
                    <Link to={`/artigos?categoria=${article.category}`} className="hover:text-primary-500 transition-colors focus:outline-none focus:underline">
                      {categoryLabels[article.category] || article.category}
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <i className="ri-arrow-right-s-line mx-1" aria-hidden="true"></i>
                    <span className="text-dark-600 font-medium truncate max-w-[150px] sm:max-w-[300px]">
                      {article.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700`}>
                  {categoryLabels[article.category] || article.category}
                </span>
                {article.subcategory && (
                  <span className="text-xs text-dark-400 font-medium">
                    {article.subcategory}
                  </span>
                )}
              </div>
              <FavoriteButton 
                item={{
                  id: article.id,
                  type: 'article',
                  title: article.title,
                  slug: article.slug,
                  image: article.image,
                  category: article.category
                }} 
                showText 
              />
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-dark-700 leading-tight">
              {article.title}
            </h1>

            <p className="mt-4 text-base md:text-lg text-dark-500 leading-relaxed font-medium">
              {article.excerpt}
            </p>

            <div className="mt-8 pt-6 border-t border-dark-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  {article.authorPhoto && (
                    <img
                      src={article.authorPhoto}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <span className="block text-sm font-bold text-dark-700">{article.author}</span>
                    <span className="block text-xs text-dark-500">{article.authorRole}</span>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-dark-100"></div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-dark-500">
                  <span className="flex items-center gap-1.5">
                    <i className="ri-calendar-line text-dark-400 text-sm" aria-hidden="true"></i>
                    {formattedDate}
                  </span>
                  {formattedUpdatedAt && article.updatedAt !== article.date && (
                    <span className="flex items-center gap-1.5">
                      <i className="ri-refresh-line text-dark-400 text-sm" aria-hidden="true"></i>
                      Atualizado: {formattedUpdatedAt}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <i className="ri-time-line text-dark-400 text-sm" aria-hidden="true"></i>
                    {article.readTime} min
                  </span>
                </div>
              </div>

              {/* Share actions */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-dark-500 mr-2">Compartilhar:</span>
                
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  aria-label="Compartilhar no WhatsApp"
                >
                  <i className="ri-whatsapp-line text-lg" aria-hidden="true"></i>
                </button>

                {hasWebShare && (
                  <button
                    type="button"
                    onClick={handleWebShare}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-dark-50 text-dark-600 hover:bg-dark-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Compartilhar via menu do sistema"
                  >
                    <i className="ri-share-line text-lg" aria-hidden="true"></i>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full bg-dark-50 text-dark-600 hover:bg-dark-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Copiar link"
                >
                  <i className={copied ? "ri-check-line text-green-600 text-lg" : "ri-link text-lg"} aria-hidden="true"></i>
                  {copied && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-800 text-white text-xs rounded shadow-sm whitespace-nowrap" role="status" aria-live="polite">
                      Link copiado!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
