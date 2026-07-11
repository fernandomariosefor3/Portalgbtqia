import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const baseUrl = 'https://portalgbtqia.vercel.app';

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.setAttribute(attribute, value);
}

export default function MultilingualSeo() {
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const language = i18n.resolvedLanguage || 'pt-BR';
    const locale = language === 'es' ? 'es_ES' : language === 'en' ? 'en_US' : 'pt_BR';
    document.documentElement.lang = language;
    document.title = t('site.title');
    setMeta('meta[name="description"]', 'content', t('site.description'));
    setMeta('meta[property="og:title"]', 'content', t('site.title'));
    setMeta('meta[property="og:description"]', 'content', t('site.description'));
    setMeta('meta[property="og:locale"]', 'content', locale);
    setMeta('meta[name="twitter:title"]', 'content', t('site.title'));
    setMeta('meta[name="twitter:description"]', 'content', t('site.description'));

    document.querySelectorAll('link[data-i18n-alternate]').forEach((link) => link.remove());
    for (const alternate of ['pt-BR', 'es', 'en']) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alternate;
      link.href = baseUrl + location.pathname + '?lang=' + alternate;
      link.dataset.i18nAlternate = 'true';
      document.head.appendChild(link);
    }
  }, [i18n.resolvedLanguage, location.pathname, t]);

  return null;
}
