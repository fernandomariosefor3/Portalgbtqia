import { useState, useMemo } from 'react';
import ArticleCard from './components/ArticleCard';
import ArticleFilters from './components/ArticleFilters';
import ArticlesSidebar from './components/ArticlesSidebar';
import { categoryLabels } from '@/mocks/articles-full';
import { useArticles } from '@/lib/useArticles';

const ARTICLES_PER_PAGE = 9;

export default function ArticlesPage() {
  const { articles, loading: loadingArticles } = useArticles();
  const [activeCategory, setActiveCategory] = useState('todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (activeCategory !== 'todas') {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [articles, activeCategory, searchQuery]);

  const paginatedArticles = filteredArticles.slice(0, currentPage * ARTICLES_PER_PAGE);
  const hasMore = paginatedArticles.length < filteredArticles.length;

  const featuredArticle = filteredArticles.find((a) => a.featured);
  const gridArticles = featuredArticle
    ? paginatedArticles.filter((a) => a.id !== featuredArticle.id)
    : paginatedArticles;

  return (
    <main className="w-full min-h-screen bg-surface font-inter">
      <section className="relative w-full bg-dark-700 pt-20 pb-10 md:pt-24 md:pb-20 px-4 md:px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20warm%20gradient%20background%20with%20soft%20light%20rays%20and%20subtle%20texture%20minimal%20artistic%20editorial%20style%20warm%20tones%20orange%20pink%20red&width=1600&height=500&seq=artlist-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-400/20 text-primary-300 text-xs font-medium uppercase tracking-wider mb-4">
            Artigos & Opinião
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-2xl leading-tight">
            Histórias, análises e vozes que importam
          </h1>
          <p className="mt-4 text-base text-white/60 max-w-xl leading-relaxed">
            Jornalismo independente sobre política, cultura, saúde e direitos da comunidade LGBTQ+ no Nordeste do Brasil.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-lg">
            <div className="relative w-full sm:flex-1">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300" aria-hidden="true"></i>
              <input
                type="text"
                id="article-search"
                name="article-search"
                placeholder="Buscar artigos, autores, tags..."
                aria-label="Buscar artigos, autores, tags"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 px-4 md:px-6 lg:px-10 border-b border-dark-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <ArticleFilters activeCategory={activeCategory} onChange={(cat) => { setActiveCategory(cat); setCurrentPage(1); }} />
            <span className="text-xs text-dark-400">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo' : 'artigos'}
              {activeCategory !== 'todas' && ` em ${categoryLabels[activeCategory]}`}
            </span>
          </div>
        </div>
      </section>

      <section className="w-full py-10 md:py-14 px-4 md:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="flex-1 min-w-0">
              {loadingArticles ? (
                <div className="flex justify-center items-center py-24">
                  <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {featuredArticle && (
                    <div className="mb-8">
                      <ArticleCard article={featuredArticle} variant="featured" />
                    </div>
                  )}

                  {gridArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {gridArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} variant="default" />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-50 mb-4">
                        <i className="ri-article-line text-2xl text-dark-300" aria-hidden="true"></i>
                      </div>
                      <h3 className="text-lg font-medium text-dark-600">Nenhum artigo publicado ainda</h3>
                      <p className="mt-1 text-sm text-dark-400">Publique o primeiro artigo pelo painel admin.</p>
                    </div>
                  )}

                  {hasMore && (
                    <div className="mt-10 text-center">
                      <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full border border-dark-200 text-dark-600 hover:bg-dark-50 hover:border-dark-300 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Carregar mais artigos
                        <i className="ri-arrow-down-line" aria-hidden="true"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="w-full lg:w-80 flex-shrink-0">
              <ArticlesSidebar />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
