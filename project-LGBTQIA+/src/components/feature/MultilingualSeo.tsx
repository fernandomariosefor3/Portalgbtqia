/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const SITE_NAME = 'Portal LGBTQ+ Nordeste';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://portalgbtqia.vercel.app').replace(/\/$/, '');
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export interface Metadata {
  title: string;
  description: string;
  noIndex?: boolean;
}

type MetadataTuple = [string, string];

const definitions: Record<string, MetadataTuple> = {
  '/': ['Portal LGBTQ+ Nordeste — Informação, cultura, saúde e direitos', 'Jornalismo, cultura, saúde, direitos e comunidade LGBTQ+ no Nordeste do Brasil. Conteúdo confiável, acolhimento e representatividade.'],
  '/quem-somos': ['Quem somos | Portal LGBTQ+ Nordeste', 'Conheça a missão, os valores e a equipe responsável pelo Portal LGBTQ+ Nordeste.'],
  '/politica-editorial': ['Política editorial | Portal LGBTQ+ Nordeste', 'Saiba como escolhemos, produzimos, revisamos e atualizamos conteúdos sobre saúde, direitos e diversidade.'],
  '/nossas-fontes': ['Nossas fontes | Portal LGBTQ+ Nordeste', 'Conheça os critérios usados para selecionar documentos oficiais, estudos, especialistas e fontes locais.'],
  '/politica-de-correcoes': ['Política de correções | Portal LGBTQ+ Nordeste', 'Veja como solicitar a correção de informações e como sinalizamos mudanças relevantes nos artigos.'],
  '/contato': ['Contato | Portal LGBTQ+ Nordeste', 'Entre em contato para enviar pautas, correções, dúvidas de privacidade ou relatar problemas técnicos.'],
  '/privacidade': ['Política de privacidade | Portal LGBTQ+ Nordeste', 'Entenda quais dados o portal pode tratar, para quais finalidades e como exercer seus direitos.'],
  '/termos-de-uso': ['Termos de uso | Portal LGBTQ+ Nordeste', 'Consulte as regras de acesso, participação, responsabilidade e uso dos conteúdos do portal.'],
  '/artigos': ['Artigos e opinião LGBTQ+ | Portal LGBTQ+ Nordeste', 'Reportagens, análises e histórias sobre política, cultura, saúde, direitos e vivências LGBTQ+ no Nordeste do Brasil.'],
  '/cultura': ['Cultura LGBTQ+: cinema, séries, música e drag', 'Notícias, críticas e histórias sobre cinema, séries, música, literatura e arte drag LGBTQ+ no Brasil.'],
  '/eventos': ['Eventos LGBTQ+ no Nordeste | Agenda e encontros', 'Encontre festas, encontros, atividades culturais e eventos LGBTQ+ em Fortaleza, no Ceará e no Nordeste.'],
  '/saude': ['Saúde LGBTQ+: prevenção, bem-estar e cuidado', 'Informações responsáveis sobre PrEP, PEP, saúde mental, saúde trans, prevenção e cuidado integral para pessoas LGBTQ+.'],
  '/familia': ['Famílias LGBTQ+: acolhimento, afeto e orientação', 'Conteúdo para famílias LGBTQ+ e familiares que desejam acolher com respeito, informação e afeto.'],
  '/guia-fortaleza': ['Guia LGBTQ+ de Fortaleza e do Ceará', 'Espaços seguros, cultura, turismo, saúde e serviços acolhedores para a comunidade LGBTQ+ em Fortaleza e no Ceará.'],
  '/direitos': ['Direitos LGBTQ+ no Brasil | Guias e orientação', 'Guias acessíveis sobre direitos, cidadania, proteção e acesso a serviços para pessoas LGBTQ+ no Brasil.'],
  '/roteiros': ['Roteiros LGBTQ+ seguros e inclusivos', 'Roteiros de viagem, cultura e lazer com foco em experiências seguras e acolhedoras para pessoas LGBTQ+.'],
  '/sos': ['SOS LGBTQ+ | Apoio e contatos de emergência', 'Contatos e orientações de apoio para pessoas LGBTQ+ em situação de violência, crise ou vulnerabilidade.'],
  '/paradas': ['Paradas LGBTQ+ | Calendário, história e notícias', 'Calendário, notícias e história das paradas do orgulho LGBTQ+ no Ceará, no Nordeste e no Brasil.'],
  '/educacao': ['Educação e diversidade LGBTQ+ | Conteúdo educativo', 'Guias, conceitos e materiais educativos sobre diversidade sexual, identidade de gênero e inclusão LGBTQ+.'],
  '/comunidade': ['Comunidade LGBTQ+ | Redes, apoio e participação', 'Conexões, iniciativas, redes de apoio e oportunidades de participação para a comunidade LGBTQ+.'],
};

const pages = Object.fromEntries(
  Object.entries(definitions).map(([path, [title, description]]) => [path, { title, description }]),
) as Record<string, Metadata>;

function meta(selector: string, attributes: Record<string, string>) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement('meta');
    document.head.appendChild(node);
  }
  Object.entries(attributes).forEach(([key, value]) => node?.setAttribute(key, value));
}

function link(selector: string, attributes: Record<string, string>) {
  let node = document.head.querySelector<HTMLLinkElement>(selector);
  if (!node) {
    node = document.createElement('link');
    document.head.appendChild(node);
  }
  Object.entries(attributes).forEach(([key, value]) => node?.setAttribute(key, value));
}

export function setJsonLd(id: string, value: unknown) {
  let node = document.head.querySelector<HTMLScriptElement>(`script[data-seo-jsonld="${id}"]`);
  if (!node) {
    node = document.createElement('script');
    node.type = 'application/ld+json';
    node.dataset.seoJsonld = id;
    document.head.appendChild(node);
  }
  node.textContent = JSON.stringify(value).replace(/</g, '\\u003c');
}

export function removeJsonLd(id: string) {
  document.head.querySelector(`script[data-seo-jsonld="${id}"]`)?.remove();
}

export function applyMetadata(data: Metadata & { url: string; image?: string; type?: string }) {
  const image = data.image || DEFAULT_IMAGE;
  document.title = data.title;
  meta('meta[name="description"]', { name: 'description', content: data.description });
  meta('meta[name="robots"]', { name: 'robots', content: data.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' });
  for (const key of ['title', 'description'] as const) {
    meta(`meta[property="og:${key}"]`, { property: `og:${key}`, content: data[key] });
    meta(`meta[name="twitter:${key}"]`, { name: `twitter:${key}`, content: data[key] });
  }
  meta('meta[property="og:url"]', { property: 'og:url', content: data.url });
  meta('meta[property="og:type"]', { property: 'og:type', content: data.type || 'website' });
  meta('meta[property="og:image"]', { property: 'og:image', content: image });
  meta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
  link('link[rel="canonical"]', { rel: 'canonical', href: data.url });
}

export default function MultilingualSeo() {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
    const url = `${SITE_URL}${path}`;
    const article = /^\/artigos\/[^/]+$/.test(path) && !path.includes('/categoria/');
    let data = pages[path];

    if (path.startsWith('/artigos/categoria/')) {
      const label = decodeURIComponent(path.split('/').pop() || 'artigos');
      data = {
        title: `${label}: artigos LGBTQ+ | ${SITE_NAME}`,
        description: `Artigos, reportagens e análises sobre ${label} e vivências LGBTQ+ no Nordeste.`,
      };
    }
    if (!data && path.startsWith('/cultura/')) data = pages['/cultura'];
    if (!data && path.startsWith('/saude/')) data = pages['/saude'];
    if (!article) applyMetadata({ ...(data || pages['/']), url, noIndex: !data });

    document.documentElement.lang = i18n.resolvedLanguage || 'pt-BR';
    document.querySelectorAll('link[data-i18n-alternate]').forEach((node) => node.remove());
    for (const lang of ['pt-BR', 'es', 'en', 'x-default']) {
      const node = document.createElement('link');
      node.rel = 'alternate';
      node.hreflang = lang;
      node.href = lang === 'x-default' ? url : `${url}?lang=${lang}`;
      node.dataset.i18nAlternate = 'true';
      document.head.appendChild(node);
    }

    setJsonLd('site', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          founder: { '@id': `${SITE_URL}/#founder` },
        },
        {
          '@type': 'Person',
          '@id': `${SITE_URL}/#founder`,
          name: 'Fernando Mário da Silva Martins',
          url: `${SITE_URL}/quem-somos`,
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: SITE_NAME,
          url: SITE_URL,
          publisher: { '@id': `${SITE_URL}/#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/artigos?busca={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    });
  }, [i18n.resolvedLanguage, location.pathname]);

  return null;
}
