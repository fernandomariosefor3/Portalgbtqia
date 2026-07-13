import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', short: 'EN', labelKey: 'language.english' },
  { code: 'es', short: 'ES', labelKey: 'language.spanish' },
  { code: 'pt-BR', short: 'PT', labelKey: 'language.portuguese' },
] as const;

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();

  async function changeLanguage(code: string) {
    await i18n.changeLanguage(code);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', code);
    window.history.replaceState({}, '', url);
  }

  const activeLanguage = i18n.resolvedLanguage || 'pt-BR';
  const selectorValue = activeLanguage === 'pt-BR' ? '' : activeLanguage;

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={compact ? 'language-mobile' : 'language-desktop'}>{t('language.label')}</label>
      <select
        id={compact ? 'language-mobile' : 'language-desktop'}
        value={selectorValue}
        onChange={(event) => changeLanguage(event.target.value)}
        className="rounded-full border border-current/20 bg-transparent px-3 py-2 text-xs font-semibold outline-none"
      >
        <option value="" disabled hidden>EN / ES</option>
        {languages.map((language) => (
          <option
            key={language.code}
            value={language.code}
            className="bg-white text-dark-800"
            style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
          >
            {language.short} — {t(language.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}
