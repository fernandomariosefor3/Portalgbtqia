import { useLocation } from 'react-router-dom';
import CultureCard from '../culture/components/CultureCard';
import CultureSubNav from '../culture/components/CultureSubNav';
import { allCulture, typeLabels, typeColors, typeIcons } from '@/mocks/culture';

export default function CultureCategoryPage() {
  const location = useLocation();
  const segment = location.pathname.split('/').pop() || '';
  const validType = ['cinema', 'series', 'musica', 'drag'].includes(segment) ? segment : 'cinema';

  const items = allCulture.filter((c) => c.type === validType);

  return (
    <main className="w-full min-h-screen bg-surface font-inter">
      <section className="relative w-full bg-dark-700 pt-20 pb-10 md:pt-24 md:pb-20 px-4 md:px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20warm%20gradient%20background%20with%20soft%20light%20rays%20and%20subtle%20texture%20minimal%20artistic%20editorial%20style%20warm%20tones%20orange%20pink%20red&width=1600&height=500&seq=cat-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-4 ${typeColors[validType]}`}>
            <i className={`${typeIcons[validType]} mr-1`}></i>
            {typeLabels[validType]}
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-2xl leading-tight">
            {typeLabels[validType]} LGBTQ+
          </h1>
          <p className="mt-4 text-base text-white/60 max-w-xl leading-relaxed">
            Análises, curadorias e histórias sobre {typeLabels[validType].toLowerCase()} que celebram e problematizam a produção cultural queer.
          </p>
        </div>
      </section>

      <CultureSubNav activeType={validType} />

      <section className="w-full py-10 md:py-14 px-4 md:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-dark-400">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <CultureCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-dark-50 mb-4">
                <i className="ri-film-line text-2xl text-dark-300"></i>
              </div>
              <h3 className="text-lg font-medium text-dark-600">Nenhum item encontrado</h3>
              <p className="mt-1 text-sm text-dark-400">Volte em breve para novos conteúdos.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}