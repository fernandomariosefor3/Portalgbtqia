import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'pt-BR', short: 'PT', labelKey: 'language.portuguese' },
  { code: 'es', short: 'ES', labelKey: 'language.spanish' },
  { code: 'en', short: 'EN', labelKey: 'language.english' },
] as const;

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const [librasNotice, setLibrasNotice] = useState(false);

  async function changeLanguage(code: string) {
    await i18n.changeLanguage(code);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', code);
    window.history.replaceState({}, '', url);
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={compact ? 'language-mobile' : 'language-desktop'}>{t('language.label')}</label>
      <select
        id={compact ? 'language-mobile' : 'language-desktop'}
        value={i18n.resolvedLanguage || 'pt-BR'}
        onChange={(event) => changeLanguage(event.target.value)}
        className="rounded-full border border-current/20 bg-transparent px-3 py-2 text-xs font-semibold outline-none"
      >
        {languages.map((language) => <option key={language.code} value={language.code} className="text-dark-800">{language.short} — {t(language.labelKey)}</option>)}
      </select>
      <button type="button" onClick={() => setLibrasNotice(!librasNotice)} className="ml-1 rounded-full border border-current/20 px-3 py-2 text-xs font-semibold">Libras</button>
      {librasNotice && (
        <div role="status" className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-dark-100 bg-white p-4 text-xs leading-relaxed text-dark-600 shadow-lg">
          <strong className="block text-dark-800">Libras em vídeo</strong>
          <span className="mt-1 block">{t('libras.notice')}</span>
        </div>
      )}
    </div>
  );
}
