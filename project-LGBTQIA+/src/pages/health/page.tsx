import { Link, useLocation } from 'react-router-dom';
import HealthHero from './components/HealthHero';
import HealthCard from './components/HealthCard';
import HealthSubNav from './components/HealthSubNav';
import { categoryLabels, categoryDescriptions, categoryColors, categoryIcons } from '@/mocks/health';
import { useHealth } from '@/lib/useHealth';

export default function HealthPage() {
  const location = useLocation();
  const { guides: allHealthGuides } = useHealth();
  const pathParts = location.pathname.split('/');
  const category = pathParts[2] && pathParts[2] !== '' ? pathParts[2] : undefined;
  const validCategories = ['prep-pep', 'saude-mental', 'saude-trans', 'educacao-sexual'];
  const activeCategory = category && validCategories.includes(category) ? category : undefined;

  const filteredGuides = activeCategory
    ? allHealthGuides.filter((g) => g.category === activeCategory)
    : allHealthGuides;

  const featuredGuides = filteredGuides.filter((g) => g.featured).slice(0, 2);
  const regularGuides = filteredGuides.filter((g) => !g.featured);

  const categories = ['prep-pep', 'saude-mental', 'saude-trans', 'educacao-sexual'] as const;

  return (
    <main className="w-full min-h-screen bg-surface font-inter">
      <HealthHero />
      <HealthSubNav activeCategory={activeCategory} />

      <section className="w-full py-10 md:py-14 px-4 md:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-dark-700">
              {activeCategory ? categoryLabels[activeCategory as keyof typeof categoryLabels] : 'Guias em destaque'}
            </h2>
            <p className="mt-1 text-sm text-dark-400">
              {activeCategory
                ? categoryDescriptions[activeCategory as keyof typeof categoryDescriptions]
                : 'Conteúdo médico revisado e baseado em evidências para cuidar de você'}
            </p>
          </div>

          {featuredGuides.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {featuredGuides.map((guide) => (
                <HealthCard key={guide.id} guide={guide} variant="featured" />
              ))}
            </div>
          )}

          {regularGuides.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularGuides.map((guide) => (
                <HealthCard key={guide.id} guide={guide} />
              ))}
            </div>
          )}

          {filteredGuides.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-50 text-dark-300 mb-4">
                <i className="ri-file-search-line text-2xl" aria-hidden="true"></i>
              </div>
              <p className="text-sm text-dark-400">Nenhum guia encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {!activeCategory && (
        <section className="w-full py-10 md:py-14 px-4 md:px-6 lg:px-10 border-t border-dark-100 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-dark-700 mb-8">
              Explore por tema
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const count = allHealthGuides.filter((g) => g.category === cat).length;
                return (
                  <Link
                    key={cat}
                    to={`/saude/${cat}`}
                    className="group flex flex-col p-5 rounded-xl border border-dark-100 hover:border-accent-200 bg-surface hover:shadow-sm transition-all duration-300"
                  >
                    <span className={`w-10 h-10 flex items-center justify-center rounded-full mb-3 ${categoryColors[cat]}`}>
                      <i className={`${categoryIcons[cat]} text-lg`}></i>
                    </span>
                    <h3 className="text-base font-playfair font-bold text-dark-700 group-hover:text-accent-500 transition-colors">
                      {categoryLabels[cat]}
                    </h3>
                    <p className="mt-1.5 text-xs text-dark-400 leading-relaxed line-clamp-2">
                      {categoryDescriptions[cat]}
                    </p>
                    <span className="mt-auto pt-3 text-xs font-medium text-accent-500 flex items-center gap-1">
                      {count} guias
                      <i className="ri-arrow-right-line group-hover:translate-x-0.5 transition-transform" aria-hidden="true"></i>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="w-full py-10 md:py-14 px-4 md:px-6 lg:px-10 border-t border-dark-100 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl bg-accent-50 border border-accent-100 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-playfair font-bold text-accent-600">
                Precisa de ajuda imediata?
              </h3>
              <p className="mt-1 text-sm text-accent-500 max-w-lg">
                Se você está em crise, pensando em se autolesionar ou precisa conversar, 
                o CVV está disponível 24 horas, gratuitamente e de forma confidencial.
              </p>
            </div>
            <a
              href="tel:188"
              className="px-6 py-3 text-sm font-medium rounded-full bg-accent-400 text-white hover:bg-accent-500 transition-colors whitespace-nowrap flex items-center gap-2 flex-shrink-0"
            >
              <i className="ri-phone-line" aria-hidden="true"></i>
              Ligar CVV 188
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}