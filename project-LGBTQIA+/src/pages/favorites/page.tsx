import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useFavorites } from '@/lib/useFavorites';
import FavoriteButton from '@/components/feature/FavoriteButton';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();

  if (authLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const articles = favorites.filter(f => f.type === 'article');
  const events = favorites.filter(f => f.type === 'event');
  const places = favorites.filter(f => f.type === 'place');

  return (
    <main className="w-full min-h-screen bg-surface-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10">
        <header className="mb-10">
          <h1 className="text-3xl font-playfair font-bold text-dark-700">Meus Favoritos</h1>
          <p className="mt-2 text-dark-500">
            Artigos, eventos e locais seguros salvos para leitura ou visita posterior.
          </p>
        </header>

        {favoritesLoading ? (
          <div className="flex justify-center py-20">
            <i className="ri-loader-4-line text-3xl text-primary-500 animate-spin"></i>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dark-100">
            <div className="w-16 h-16 mx-auto bg-dark-50 rounded-full flex items-center justify-center text-dark-300 mb-4">
              <i className="ri-bookmark-line text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-dark-700">Nenhum favorito salvo</h2>
            <p className="mt-2 text-dark-500 max-w-md mx-auto">
              Navegue pelo portal e clique no ícone de salvar nos artigos, eventos ou no guia para encontrá-los facilmente aqui.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/artigos" className="px-5 py-2 rounded-full bg-primary-50 text-primary-600 font-medium hover:bg-primary-100">Ler Artigos</Link>
              <Link to="/guia-fortaleza" className="px-5 py-2 rounded-full bg-secondary-50 text-secondary-700 font-medium hover:bg-secondary-100">Explorar o Guia</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {articles.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <i className="ri-article-line text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold text-dark-800">Artigos ({articles.length})</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {articles.map(article => (
                    <div key={article.id} className="relative group rounded-xl overflow-hidden bg-white border border-dark-100 hover:shadow-md transition-shadow">
                      <Link to={`/artigos/${article.slug}`} className="block">
                        <div className="w-full h-40 bg-dark-50 overflow-hidden">
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 pr-12">
                          <span className="text-[10px] font-bold text-accent-500 uppercase tracking-wide">{article.category}</span>
                          <h3 className="mt-1 text-sm font-semibold text-dark-700 line-clamp-2 group-hover:text-primary-600">{article.title}</h3>
                        </div>
                      </Link>
                      <div className="absolute bottom-4 right-4 bg-white rounded-full">
                        <FavoriteButton item={article} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {events.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <i className="ri-calendar-event-line text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold text-dark-800">Eventos ({events.length})</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {events.map(event => (
                    <div key={event.id} className="relative group rounded-xl overflow-hidden bg-white border border-dark-100 hover:shadow-md transition-shadow">
                      <Link to={`/eventos/${event.slug}`} className="block">
                        <div className="w-full h-40 bg-dark-50 overflow-hidden">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 pr-12">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">{event.category}</span>
                          <h3 className="mt-1 text-sm font-semibold text-dark-700 line-clamp-2 group-hover:text-emerald-600">{event.title}</h3>
                        </div>
                      </Link>
                      <div className="absolute bottom-4 right-4 bg-white rounded-full">
                        <FavoriteButton item={event} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {places.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
                    <i className="ri-map-pin-heart-line text-xl"></i>
                  </div>
                  <h2 className="text-xl font-bold text-dark-800">Locais Salvos ({places.length})</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {places.map(place => (
                    <div key={place.id} className="relative group rounded-xl overflow-hidden bg-white border border-dark-100 hover:shadow-md transition-shadow">
                      <div className="block">
                        <div className="w-full h-40 bg-dark-50 overflow-hidden">
                          <img src={place.image} alt={place.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 pr-12">
                          <span className="text-[10px] font-bold text-secondary-600 uppercase tracking-wide">{place.category}</span>
                          <h3 className="mt-1 text-sm font-semibold text-dark-700 line-clamp-2">{place.title}</h3>
                          <Link to="/guia-fortaleza" className="mt-2 inline-block text-xs font-medium text-secondary-600 hover:underline">Ver no mapa</Link>
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white rounded-full">
                        <FavoriteButton item={place} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
