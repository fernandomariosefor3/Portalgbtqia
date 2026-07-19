import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/artigos?busca=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <main className="w-full min-h-screen bg-surface font-inter flex items-center justify-center py-20 px-4 md:px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-dark-50 text-dark-400 mb-6">
          <i className="ri-error-warning-line text-4xl" aria-hidden="true"></i>
        </div>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-dark-700 mb-4">
          Página não encontrada
        </h1>
        <p className="text-base md:text-lg text-dark-500 mb-8 max-w-lg mx-auto">
          Não conseguimos encontrar a página <code className="text-sm bg-dark-50 px-1 py-0.5 rounded text-dark-600">{location.pathname}</code>. Ela pode ter sido removida, renomeada ou estar temporariamente indisponível.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10 relative">
          <input
            type="text"
            placeholder="Pesquisar artigos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-full border border-dark-200 bg-white text-dark-700 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
            aria-label="Pesquisar conteúdo"
          />
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" aria-hidden="true"></i>
          <button type="submit" className="sr-only">Pesquisar</button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            <i className="ri-home-line" aria-hidden="true"></i>
            Voltar ao Início
          </Link>
          <Link
            to="/artigos"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border border-dark-200 text-dark-600 hover:bg-dark-50 transition-colors"
          >
            <i className="ri-article-line" aria-hidden="true"></i>
            Explorar Artigos
          </Link>
        </div>
      </div>
    </main>
  );
}