import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', short: 'EN', labelKey: 'language.english' },
  { code: 'es', short: 'ES', labelKey: 'language.spanish' },
  { code: 'pt-BR', short: 'PT', labelKey: 'language.portuguese' },
] as const;

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const activeLanguage = i18n.resolvedLanguage || 'pt-BR';
  const activeOption = languages.find((language) => language.code === activeLanguage);
  const triggerLabel = activeLanguage === 'pt-BR' ? 'EN / ES' : activeOption?.short || 'EN / ES';

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  async function changeLanguage(code: string) {
    await i18n.changeLanguage(code);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', code);
    window.history.replaceState({}, '', url);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative notranslate" translate="no">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`${t('language.label')}: ${triggerLabel}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className={`flex items-center justify-between gap-2 rounded-full border border-current/20 bg-transparent px-3 py-2 text-xs font-semibold outline-none ${compact ? 'min-w-24' : 'min-w-32'}`}
      >
        <span>{triggerLabel}</span>
        <i className={`ri-arrow-down-s-line text-sm transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('language.label')}
          className="absolute right-0 top-full z-[100] mt-2 min-w-52 overflow-hidden rounded-xl border border-dark-100 bg-white p-1.5 text-dark-800 shadow-xl"
          style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="menuitemradio"
              aria-checked={activeLanguage === language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                activeLanguage === language.code
                  ? 'bg-primary-50 font-semibold text-primary-600'
                  : 'bg-white text-dark-800 hover:bg-dark-50'
              }`}
              style={{ color: activeLanguage === language.code ? '#db2858' : '#1f2937' }}
            >
              <span>{language.short} — {t(language.labelKey)}</span>
              {activeLanguage === language.code && <i className="ri-check-line" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
