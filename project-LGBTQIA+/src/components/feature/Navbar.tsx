import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, signInWithGoogle, signOut } from '../../lib/auth';

const ADMIN_EMAIL = "fernandomariodasmartins@gmail.com";

const navLinks = [
  { label: 'Artigos', path: '/artigos' },
  { label: 'Cultura', path: '/cultura' },
  { label: 'Eventos', path: '/eventos' },
  { label: 'Saúde', path: '/saude' },
  { label: 'Família', path: '/familia' },
  { label: 'Guia CE', path: '/guia-fortaleza' },
  { label: 'Paradas', path: '/paradas' },
  { label: 'Educação', path: '/educacao' },
  { label: 'Sobre', path: '/sobre' },
  { label: 'Comunidade', path: '/comunidade' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="flex items-center justify-between px-4 md:px-6 lg:px-10 h-16 md:h-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg md:text-xl font-playfair font-bold tracking-tight whitespace-nowrap"
          style={{ color: scrolled ? '#1A1A1A' : '#FFFFFF' }}
        >
          <span className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-primary-400 text-white text-sm md:text-base">
            <i className="ri-rainbow-line"></i>
          </span>
          Portal LGBTQ+
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                scrolled
                  ? 'text-dark-600 hover:text-primary-400 hover:bg-primary-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              scrolled ? 'text-dark-600 hover:bg-dark-50' : 'text-white/90 hover:bg-white/10'
            }`}
            aria-label="Buscar"
          >
            <i className="ri-search-line text-lg"></i>
          </button>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Admin
              </Link>
              <button
                onClick={() => signOut()}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  scrolled ? 'text-dark-600 hover:bg-dark-50' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Sair
              </button>
            </div>
          ) : user ? (
            <button
              onClick={() => signOut()}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                scrolled ? 'text-dark-600 hover:bg-dark-50 border border-dark-200' : 'text-white/80 hover:bg-white/10 border border-white/20'
              }`}
            >
              Sair
            </button>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="px-5 py-2 text-sm font-medium rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors whitespace-nowrap"
            >
              Entrar
            </button>
          )}
        </div>

        <button
          className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg ${
            scrolled ? 'text-dark-700' : 'text-white'
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <i className={mobileOpen ? 'ri-close-line text-2xl' : 'ri-menu-line text-2xl'}></i>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-dark-100 shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-dark-600 hover:text-primary-400 hover:bg-primary-50 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-dark-100" />
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="px-3 py-3 text-sm font-medium text-left text-dark-600 hover:bg-dark-50 rounded-md transition-colors"
              >
                Sair
              </button>
            ) : (
              <button
                onClick={() => { signInWithGoogle(); setMobileOpen(false); }}
                className="px-3 py-3 text-sm font-medium text-left text-primary-400 hover:bg-primary-50 rounded-md transition-colors"
              >
                Entrar com Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
