import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, signOut } from '../../lib/auth';
import LanguageSelector from './LanguageSelector';
import SearchModal from '../Search/SearchModal';

const themes = [
  { label: 'Saúde', path: '/artigos?categoria=saude' },
  { label: 'Direitos', path: '/artigos?categoria=direitos' },
  { label: 'Cultura', path: '/artigos?categoria=cultura' },
  { label: 'Trabalho', path: '/artigos?categoria=trabalho' },
  { label: 'Educação', path: '/artigos?categoria=educacao' },
  { label: 'Família', path: '/artigos?categoria=familia' },
  { label: 'História e memória', path: '/artigos?categoria=historia' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setThemesOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setThemesOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setThemesOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="flex items-center justify-between px-4 md:px-6 lg:px-10 h-16 md:h-20">
        <Link
          to="/"
          className="flex flex-col justify-center"
          style={{ color: scrolled || mobileOpen ? '#1A1A1A' : '#FFFFFF' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-500 text-white text-sm">
              <i className="ri-rainbow-line" aria-hidden="true"></i>
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight">Rede Farol</span>
              <span className="text-xs font-medium opacity-80">Portal LGBTQIA+</span>
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              scrolled
                ? 'text-dark-600 hover:text-primary-400 hover:bg-primary-50 focus:ring-2 focus:ring-primary-400 focus:outline-none'
                : 'text-white/90 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none'
            }`}
          >
            Início
          </Link>
          <Link
            to="/artigos"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              scrolled
                ? 'text-dark-600 hover:text-primary-400 hover:bg-primary-50 focus:ring-2 focus:ring-primary-400 focus:outline-none'
                : 'text-white/90 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none'
            }`}
          >
            Artigos
          </Link>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setThemesOpen(!themesOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setThemesOpen(!themesOpen);
                }
              }}
              aria-expanded={themesOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                scrolled
                  ? 'text-dark-600 hover:text-primary-400 hover:bg-primary-50 focus:ring-2 focus:ring-primary-400 focus:outline-none'
                  : 'text-white/90 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none'
              }`}
            >
              Temas
              <i className={`ri-arrow-down-s-line transition-transform ${themesOpen ? 'rotate-180' : ''}`} aria-hidden="true"></i>
            </button>

            {themesOpen && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-dark-100 py-1 z-50 flex flex-col"
                role="menu"
              >
                {themes.map((theme) => (
                  <Link
                    key={theme.path}
                    to={theme.path}
                    role="menuitem"
                    className="px-4 py-2 text-sm text-dark-600 hover:text-primary-500 hover:bg-primary-50 focus:bg-primary-50 focus:text-primary-500 focus:outline-none"
                    onClick={() => setThemesOpen(false)}
                  >
                    {theme.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/sobre"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              scrolled
                ? 'text-dark-600 hover:text-primary-400 hover:bg-primary-50 focus:ring-2 focus:ring-primary-400 focus:outline-none'
                : 'text-white/90 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none'
            }`}
          >
            Sobre
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className={scrolled ? 'text-dark-600' : 'text-white'}>
            <LanguageSelector />
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              scrolled ? 'text-dark-600 hover:bg-dark-50 focus:ring-2 focus:ring-primary-400 focus:outline-none' : 'text-white/90 hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none'
            }`}
            aria-label="Buscar no portal"
          >
            <i className="ri-search-line text-lg" aria-hidden="true"></i>
          </button>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-600 focus:outline-none"
              >
                Admin
              </Link>
              <button
                onClick={() => signOut()}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  scrolled ? 'text-dark-600 hover:bg-dark-50 focus:ring-2 focus:ring-primary-400 focus:outline-none' : 'text-white/80 hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none'
                }`}
              >
                Sair
              </button>
            </div>
          ) : user ? (
            <button
              onClick={() => signOut()}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                scrolled ? 'text-dark-600 hover:bg-dark-50 border border-dark-200 focus:ring-2 focus:ring-primary-400 focus:outline-none' : 'text-white/80 hover:bg-white/10 border border-white/20 focus:ring-2 focus:ring-white focus:outline-none'
              }`}
            >
              Sair
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap focus:ring-2 focus:ring-primary-400 focus:outline-none"
            >
              Entrar
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              scrolled || mobileOpen ? 'text-dark-700' : 'text-white'
            }`}
            aria-label="Buscar no portal"
          >
            <i className="ri-search-line text-2xl" aria-hidden="true"></i>
          </button>
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 ${
              scrolled || mobileOpen ? 'text-dark-700 focus:ring-primary-400' : 'text-white focus:ring-white'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu principal"
            aria-expanded={mobileOpen}
          >
            <i className={mobileOpen ? 'ri-close-line text-2xl' : 'ri-menu-line text-2xl'} aria-hidden="true"></i>
          </button>
        </div>
        
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-dark-100 shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link
              to="/"
              className="px-3 py-3 text-sm font-medium text-dark-600 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
            >
              Início
            </Link>
            <Link
              to="/artigos"
              className="px-3 py-3 text-sm font-medium text-dark-600 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
            >
              Artigos
            </Link>

            <div className="px-3 py-2">
              <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Temas</span>
              <div className="flex flex-col pl-2 border-l-2 border-dark-100 gap-1">
                {themes.map((theme) => (
                  <Link
                    key={theme.path}
                    to={theme.path}
                    className="px-3 py-2 text-sm text-dark-600 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
                  >
                    {theme.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/sobre"
              className="px-3 py-3 text-sm font-medium text-dark-600 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
            >
              Sobre
            </Link>

            <div className="px-3 py-2 mt-2">
              <LanguageSelector compact />
            </div>
            
            <hr className="my-2 border-dark-100" />
            
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-3 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-3 py-3 text-sm font-medium text-left text-dark-600 hover:bg-dark-50 rounded-md transition-colors"
              >
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-3 text-sm font-medium text-left text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
