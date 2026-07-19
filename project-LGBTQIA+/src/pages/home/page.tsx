import { Link } from 'react-router-dom';
import ArticleCard from '../articles/components/ArticleCard';
import { useArticles } from '@/lib/useArticles';

const THEMES = [
  { label: 'Saúde', path: '/artigos?categoria=saude', icon: 'ri-heart-pulse-line' },
  { label: 'Direitos', path: '/artigos?categoria=direitos', icon: 'ri-scales-3-line' },
  { label: 'Cultura', path: '/artigos?categoria=cultura', icon: 'ri-palette-line' },
  { label: 'Trabalho', path: '/artigos?categoria=trabalho', icon: 'ri-briefcase-4-line' },
  { label: 'Educação', path: '/artigos?categoria=educacao', icon: 'ri-book-open-line' },
  { label: 'Família', path: '/artigos?categoria=familia', icon: 'ri-parent-line' },
  { label: 'História', path: '/artigos?categoria=historia', icon: 'ri-history-line' },
];

export default function Home() {
  const { articles, loading } = useArticles();

  // Seleção Determinística
  // 1. Hero: O primeiro destacado
  const heroArticle = articles.find(a => a.featured) || articles[0];
  
  // 2. Destaques: Próximos 3 artigos mais recentes (ignorando o hero)
  const availableForHighlights = articles.filter(a => a.id !== heroArticle?.id);
  const highlights = availableForHighlights.slice(0, 3);
  
  // 3. Recentes: Próximos 6 a 9 artigos (ignorando hero e destaques)
  const usedIds = new Set([
    ...(heroArticle ? [heroArticle.id] : []),
    ...highlights.map(h => h.id)
  ]);
  const recentArticles = articles.filter(a => !usedIds.has(a.id)).slice(0, 6);

  return (
    <main className="w-full min-h-screen bg-surface font-inter">
      {/* Hero Editorial */}
      <section className="relative w-full bg-dark-700 pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-600" />
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 items-center">
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight">
              Informação, cultura, saúde e direitos para viver com mais liberdade, segurança e orgulho.
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Conteúdo LGBTQIA+ explicado de forma simples, responsável e conectado à realidade do Nordeste.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                to="/artigos"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-700"
              >
                Explorar artigos
              </Link>
              <Link
                to="/sobre"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-dark-700"
              >
                Conheça o portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Destaques (Hero + 3 Cards) */}
          <section className="w-full py-12 md:py-20 px-4 md:px-6 lg:px-10 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-playfair font-bold text-dark-700 mb-8 border-b border-dark-100 pb-4">
                Destaques
              </h2>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Artigo Principal (Hero da Seção) */}
                {heroArticle && (
                  <div className="lg:w-2/3">
                    <ArticleCard article={heroArticle} variant="featured" />
                  </div>
                )}
                
                {/* Artigos Secundários */}
                {highlights.length > 0 && (
                  <div className="lg:w-1/3 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-dark-100 pt-6 lg:pt-0 lg:pl-8">
                    {highlights.map(article => (
                      <ArticleCard key={article.id} article={article} variant="compact" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Explore por tema */}
          <section className="w-full py-12 md:py-16 px-4 md:px-6 lg:px-10 bg-dark-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-playfair font-bold text-dark-700 mb-8">
                Explore por tema
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {THEMES.map(theme => (
                  <Link
                    key={theme.label}
                    to={theme.path}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white border border-dark-100 hover:border-primary-300 hover:shadow-sm transition-all group focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      <i className={`${theme.icon} text-2xl`} aria-hidden="true"></i>
                    </div>
                    <span className="text-sm font-semibold text-dark-600 group-hover:text-primary-600">
                      {theme.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Artigos recentes */}
          {recentArticles.length > 0 && (
            <section className="w-full py-12 md:py-20 px-4 md:px-6 lg:px-10 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-dark-100 pb-4">
                  <h2 className="text-2xl font-playfair font-bold text-dark-700">
                    Artigos recentes
                  </h2>
                  <Link to="/artigos" className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 focus:outline-none focus:underline">
                    Ver todos <i className="ri-arrow-right-line" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {recentArticles.map(article => (
                    <ArticleCard key={article.id} article={article} variant="default" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Compromisso Editorial */}
          <section className="w-full py-12 md:py-16 px-4 md:px-6 lg:px-10 bg-dark-700 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-white/10 text-white mb-6">
                <i className="ri-shield-check-line text-2xl" aria-hidden="true"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-playfair font-bold text-white mb-4">
                Compromisso Editorial
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                Conteúdo independente, linguagem simples e fontes identificadas. 
                Informações de saúde e direitos não substituem orientação profissional individual.
              </p>
              <div className="mt-8">
                <Link
                  to="/politica-editorial"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
                >
                  Ler nossa política completa <i className="ri-arrow-right-line" aria-hidden="true"></i>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
