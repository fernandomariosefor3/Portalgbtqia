import { Link } from 'react-router-dom';
import CultureHero from './components/CultureHero';
import CultureCard from './components/CultureCard';
import CultureSubNav from './components/CultureSubNav';
import { allCulture, typeLabels, typeIcons } from '@/mocks/culture';

export default function CulturePage() {
  const featuredItems = allCulture.filter((c) => c.featured).slice(0, 4);
  const types = ['cinema', 'series', 'musica', 'drag'] as const;

  return (
    <main className="w-full min-h-screen bg-surface font-inter">
      <CultureHero />
      <CultureSubNav />

      <section className="w-full py-10 md:py-14 px-4 md:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-dark-700">
              Destaques da semana
            </h2>
            <p className="mt-1 text-sm text-dark-400">
              As análises e curadorias mais lidas do momento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredItems.map((item) => (
              <CultureCard key={item.id} item={item} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {types.map((type) => {
        const items = allCulture.filter((c) => c.type === type).slice(0, 3);
        return (
          <section key={type} className="w-full py-10 md:py-12 px-4 md:px-6 lg:px-10 border-t border-dark-100">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-dark-700 text-white text-sm">
                    <i className={`${typeIcons[type]}`}></i>
                  </span>
                  <h2 className="text-xl md:text-2xl font-playfair font-bold text-dark-700">
                    {typeLabels[type]}
                  </h2>
                </div>
                <Link
                  to={`/cultura/${type}`}
                  className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  Ver todos
                  <i className="ri-arrow-right-line" aria-hidden="true"></i>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <CultureCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}