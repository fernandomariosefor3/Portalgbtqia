import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', short: 'EN', labelKey: 'language.english' },
  { code: 'es', short: 'ES', labelKey: 'language.spanish' },
  { code: 'pt-BR', short: 'PT', labelKey: 'language.portuguese' },
] as const;

type TranslateWindow = Window & {
  google?: { translate?: { TranslateElement?: new (options: object, elementId: string) => unknown } };
  googleTranslateElementInit?: () => void;
};

function clearTranslationCookies() {
  const expiredCookie = 'googtrans=; Max-Age=0; path=/; SameSite=Lax';
  document.cookie = expiredCookie;
  document.cookie = `${expiredCookie}; domain=${window.location.hostname}`;
  document.cookie = `${expiredCookie}; domain=.${window.location.hostname}`;
}

function saveTranslationLanguage(language: string) {
  clearTranslationCookies();
  if (language !== 'pt-BR') {
    document.cookie = `googtrans=/pt/${language}; path=/; SameSite=Lax`;
  }
}

function ensurePageTranslator() {
  const translateWindow = window as TranslateWindow;
  if (!document.getElementById('google_translate_element')) {
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
  }

  translateWindow.googleTranslateElementInit = () => {
    const TranslateElement = translateWindow.google?.translate?.TranslateElement;
    if (TranslateElement && !document.querySelector('#google_translate_element select')) {
      new TranslateElement(
        { pageLanguage: 'pt', includedLanguages: 'en,es', autoDisplay: false },
        'google_translate_element',
      );
    }
  };

  if (translateWindow.google?.translate?.TranslateElement) {
    translateWindow.googleTranslateElementInit();
  } else if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }
}

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    ensurePageTranslator();
  }, []);

  function changeLanguage(code: string) {
    saveTranslationLanguage(code);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', code);
    window.location.assign(url.toString());
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
        <option value="" disabled className="text-dark-800">EN / ES</option>
        {languages.map((language) => <option key={language.code} value={language.code} className="text-dark-800">{language.short} — {t(language.labelKey)}</option>)}
      </select>
    </div>
  );
}
