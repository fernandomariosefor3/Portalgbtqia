import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, signOut } from '../../lib/auth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import SearchModal from '../Search/SearchModal';

const navLinks = [
  { labelKey: 'nav.articles', path: '/artigos' },
  { labelKey: 'nav.culture', path: '/cultura' },
  { labelKey: 'nav.events', path: '/eventos' },
  { labelKey: 'nav.health', path: '/saude' },
  { labelKey: 'nav.family', path: '/familia' },
  { labelKey: 'nav.guide', path: '/guia-fortaleza' },
  { labelKey: 'nav.rights', path: '/direitos' },
  { labelKey: 'nav.routes', path: '/roteiros' },
  { labelKey: 'nav.parades', path: '/paradas' },
  { labelKey: 'nav.education', path: '/educacao' },
  { labelKey: 'nav.libras', path: '/libras' },
  { labelKey: 'nav.community', path: '/comunidade' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();

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
          <span className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-primary-500 text-white text-sm md:text-base">
            <i className="ri-rainbow-line" aria-hidden="true"></i>
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
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className={scrolled ? 'text-dark-600' : 'text-white'}>
            <LanguageSelector />
          </div>
          <Link
            to="/sos"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-alarm-warning-line" aria-hidden="true"></i>
            SOS
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
              scrolled ? 'text-dark-600 hover:bg-dark-50' : 'text-white/90 hover:bg-white/10'
            }`}
            aria-label={t('nav.search')}
          >
            <i className="ri-search-line text-lg" aria-hidden="true"></i>
          </button>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                to="/favoritos"
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  scrolled ? 'text-dark-600 hover:bg-dark-50' : 'text-white/90 hover:bg-white/10'
                }`}
                title="Meus Favoritos"
              >
                <i className="ri-bookmark-line text-lg" aria-hidden="true"></i>
              </Link>
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
                {t('nav.logout')}
              </button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/favoritos"
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  scrolled ? 'text-dark-600 hover:bg-dark-50' : 'text-white/90 hover:bg-white/10'
                }`}
                title="Meus Favoritos"
              >
                <i className="ri-bookmark-line text-lg" aria-hidden="true"></i>
              </Link>
              <button
                onClick={() => signOut()}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  scrolled ? 'text-dark-600 hover:bg-dark-50 border border-dark-200' : 'text-white/80 hover:bg-white/10 border border-white/20'
                }`}
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>

        <button
          className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg ${
            scrolled ? 'text-dark-700' : 'text-white'
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t('nav.menu')}
        >
          <i className={mobileOpen ? 'ri-close-line text-2xl' : 'ri-menu-line text-2xl'}></i>
        </button>
        {/* Modals & Overlays */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
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
                {t(link.labelKey)}
              </Link>
            ))}
            <div className="px-3 py-2 text-dark-600">
              <LanguageSelector compact />
            </div>
            <Link
              to="/sos"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <i className="ri-alarm-warning-line mr-2" aria-hidden="true"></i>
              SOS
            </Link>
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
              <>
                <Link
                  to="/favoritos"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-left text-dark-600 hover:bg-dark-50 rounded-md transition-colors"
                >
                  <i className="ri-bookmark-line mr-2" aria-hidden="true"></i>
                  Meus Favoritos
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="px-3 py-3 text-sm font-medium text-left text-dark-600 hover:bg-dark-50 rounded-md transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-left text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
