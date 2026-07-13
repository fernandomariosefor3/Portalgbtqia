import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { homeTranslations } from './homeTranslations';

const resources = {
  'pt-BR': { translation: {
    ...homeTranslations['pt-BR'],
    'site.title': 'Portal LGBTQ+ Nordeste — Artigos, Cultura, Saúde e Comunidade',
    'site.description': 'Portal LGBTQ+ dedicado a informação, cultura, saúde, direitos e comunidade no Nordeste do Brasil.',
    'nav.articles': 'Artigos', 'nav.culture': 'Cultura', 'nav.events': 'Eventos', 'nav.health': 'Saúde',
    'nav.family': 'Família', 'nav.guide': 'Guia CE', 'nav.rights': 'Direitos', 'nav.routes': 'Roteiros',
    'nav.parades': 'Paradas', 'nav.education': 'Educação', 'nav.about': 'Sobre', 'nav.community': 'Comunidade',
    'nav.login': 'Entrar', 'nav.logout': 'Sair', 'nav.search': 'Buscar', 'nav.menu': 'Menu',
    'language.label': 'Idioma', 'language.portuguese': 'Português', 'language.spanish': 'Español',
    'language.english': 'English',
  }},
  es: { translation: {
    ...homeTranslations.es,
    'site.title': 'Portal LGBTQ+ Nordeste — Artículos, Cultura, Salud y Comunidad',
    'site.description': 'Portal LGBTQ+ con información, cultura, salud, derechos y comunidad en el Nordeste de Brasil.',
    'nav.articles': 'Artículos', 'nav.culture': 'Cultura', 'nav.events': 'Eventos', 'nav.health': 'Salud',
    'nav.family': 'Familia', 'nav.guide': 'Guía CE', 'nav.rights': 'Derechos', 'nav.routes': 'Rutas',
    'nav.parades': 'Orgullos', 'nav.education': 'Educación', 'nav.about': 'Acerca de', 'nav.community': 'Comunidad',
    'nav.login': 'Ingresar', 'nav.logout': 'Salir', 'nav.search': 'Buscar', 'nav.menu': 'Menú',
    'language.label': 'Idioma', 'language.portuguese': 'Português', 'language.spanish': 'Español',
    'language.english': 'English',
  }},
  en: { translation: {
    ...homeTranslations.en,
    'site.title': 'LGBTQ+ Northeast Portal — Articles, Culture, Health and Community',
    'site.description': 'LGBTQ+ portal for information, culture, health, rights and community in Northeast Brazil.',
    'nav.articles': 'Articles', 'nav.culture': 'Culture', 'nav.events': 'Events', 'nav.health': 'Health',
    'nav.family': 'Family', 'nav.guide': 'CE Guide', 'nav.rights': 'Rights', 'nav.routes': 'Travel',
    'nav.parades': 'Prides', 'nav.education': 'Education', 'nav.about': 'About', 'nav.community': 'Community',
    'nav.login': 'Sign in', 'nav.logout': 'Sign out', 'nav.search': 'Search', 'nav.menu': 'Menu',
    'language.label': 'Language', 'language.portuguese': 'Português', 'language.spanish': 'Español',
    'language.english': 'English',
  }},
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['pt-BR', 'es', 'en'],
    fallbackLng: 'pt-BR',
    load: 'currentOnly',
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'portal-language',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
