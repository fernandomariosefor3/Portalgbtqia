import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '@/lib/useArticles';
import { useTranslation } from 'react-i18next';
import { portalSections } from '@/mocks/sections';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useTranslation();
  const { articles } = useArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
      setSelectedCategory(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-surface/95 backdrop-blur-sm p-4 sm:p-6 lg:p-10 transition-opacity">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-dark-100">
        
        {/* Header / Input */}
        <div className="p-4 md:p-6 border-b border-dark-100 flex items-center gap-4">
          <i className="ri-search-line text-2xl text-dark-400"></i>
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar artigos, guias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-xl md:text-2xl font-medium text-dark-700 placeholder:text-dark-300 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-dark-50 text-dark-500 hover:bg-dark-100 transition-colors"
            aria-label="Fechar busca"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Categorias (Filtros) */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-dark-50 bg-dark-50/30 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-dark-500 hover:bg-dark-50 border border-dark-100'
              }`}
            >
              Todos
            </button>
            {portalSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedCategory(section.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === section.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-dark-500 hover:bg-dark-50 border border-dark-100'
                }`}
              >
                {t(`nav.${section.id}`, section.id)}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface-warm/30">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/artigos/${article.slug || article.id}`}
                  onClick={onClose}
                  className="flex gap-4 p-3 rounded-xl bg-white hover:shadow-md transition-all border border-transparent hover:border-primary-100"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-dark-50">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] font-bold text-accent-500 uppercase tracking-wide">
                      {article.subcategory || article.category}
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-dark-700 leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-16 h-16 rounded-full bg-dark-50 flex items-center justify-center text-dark-300 mb-4">
                <i className="ri-search-line text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-dark-700">Nenhum resultado encontrado</h3>
              <p className="text-sm text-dark-400 mt-1">Tente pesquisar com outras palavras-chave ou categorias.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
