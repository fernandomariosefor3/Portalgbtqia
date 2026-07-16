import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = process.cwd();
const mode = process.argv[2] || 'prepare';
const cacheFile = join(root, '.seo-cache.json');
const publicDir = join(root, 'public');
const distDir = join(root, 'dist');

const routeDefinitions = [
  ['/', 'Portal LGBTQ+ Nordeste — Informação, cultura, saúde e direitos', 'Jornalismo, cultura, saúde, direitos e comunidade LGBTQ+ no Nordeste do Brasil.'],
  ['/quem-somos', 'Quem somos | Portal LGBTQ+ Nordeste', 'Conheça a missão, os valores e a equipe responsável pelo portal.', 'Produzimos jornalismo de serviço, cultura e informação para pessoas LGBTQ+ no Nordeste, com compromisso com dignidade, contexto regional e acesso gratuito.'],
  ['/politica-editorial', 'Política editorial | Portal LGBTQ+ Nordeste', 'Como produzimos, revisamos e atualizamos conteúdos sensíveis.', 'Todo artigo deve identificar autoria, datas, fontes e revisão. Conteúdos com auxílio de inteligência artificial exigem checagem humana, regionalização e contribuição editorial própria antes da publicação.'],
  ['/nossas-fontes', 'Nossas fontes | Portal LGBTQ+ Nordeste', 'Critérios para documentos oficiais, estudos, especialistas e fontes locais.', 'Priorizamos órgãos públicos, legislação, artigos científicos, universidades, instituições reconhecidas e especialistas identificados. Ferramentas de inteligência artificial não são tratadas como fonte.'],
  ['/politica-de-correcoes', 'Política de correções | Portal LGBTQ+ Nordeste', 'Como solicitar correções e como sinalizamos mudanças relevantes.', 'Erros factuais confirmados são corrigidos e mudanças materiais recebem nota no artigo e nova data de atualização. Solicitações podem ser enviadas para contato@portallgbtq.com.br.'],
  ['/contato', 'Contato | Portal LGBTQ+ Nordeste', 'Canais para pautas, correções, privacidade e problemas técnicos.', 'Escreva para contato@portallgbtq.com.br e identifique no assunto se a mensagem trata de pauta, correção, privacidade, parceria ou problema técnico.'],
  ['/privacidade', 'Política de privacidade | Portal LGBTQ+ Nordeste', 'Como o portal trata dados pessoais e protege os direitos dos usuários.', 'Tratamos apenas dados necessários para operar, proteger e melhorar o portal, responder solicitações e moderar contribuições. Não vendemos dados pessoais.'],
  ['/termos-de-uso', 'Termos de uso | Portal LGBTQ+ Nordeste', 'Regras de acesso, participação e uso dos conteúdos do portal.', 'O conteúdo tem finalidade informativa e educativa. Informações de saúde e direitos não substituem atendimento médico ou aconselhamento jurídico individual.'],
  ['/artigos', 'Artigos e opinião LGBTQ+', 'Reportagens, análises e histórias sobre vivências LGBTQ+ no Nordeste do Brasil.'],
  ['/cultura', 'Cultura LGBTQ+: cinema, séries, música e drag', 'Notícias, críticas e histórias sobre cultura LGBTQ+ no Brasil.'],
  ['/cultura/cinema', 'Cinema LGBTQ+ e queer', 'Críticas, notícias e histórias do cinema LGBTQ+ e queer.'],
  ['/cultura/series', 'Séries LGBTQ+ e queer', 'Críticas, notícias e histórias de séries LGBTQ+ e queer.'],
  ['/cultura/musica', 'Música LGBTQ+ e queer', 'Artistas, lançamentos e histórias da música LGBTQ+ e queer.'],
  ['/cultura/drag', 'Arte drag no Brasil', 'Notícias, perfis e histórias da arte drag no Brasil.'],
  ['/eventos', 'Eventos LGBTQ+ no Nordeste', 'Agenda de festas, encontros e atividades LGBTQ+ no Nordeste.'],
  ['/saude', 'Saúde LGBTQ+: prevenção, bem-estar e cuidado', 'Informações responsáveis sobre saúde integral para pessoas LGBTQ+.'],
  ['/saude/prep-pep', 'PrEP e PEP: prevenção ao HIV', 'Informações sobre acesso à PrEP e à PEP e prevenção combinada.'],
  ['/saude/saude-mental', 'Saúde mental LGBTQ+', 'Informação e acolhimento sobre saúde mental LGBTQ+.'],
  ['/saude/saude-trans', 'Saúde trans: cuidado e direitos', 'Informações de saúde e cuidado integral para pessoas trans.'],
  ['/saude/educacao-sexual', 'Educação sexual inclusiva', 'Informação segura e inclusiva sobre sexualidade e prevenção.'],
  ['/familia', 'Famílias LGBTQ+: acolhimento e orientação', 'Conteúdo para famílias LGBTQ+ e familiares que desejam acolher.'],
  ['/guia-fortaleza', 'Guia LGBTQ+ de Fortaleza e do Ceará', 'Espaços seguros e serviços acolhedores em Fortaleza e no Ceará.'],
  ['/direitos', 'Direitos LGBTQ+ no Brasil', 'Guias sobre direitos, cidadania e proteção para pessoas LGBTQ+.'],
  ['/roteiros', 'Roteiros LGBTQ+ seguros e inclusivos', 'Roteiros de viagem, cultura e lazer para pessoas LGBTQ+.'],
  ['/sos', 'SOS LGBTQ+ — Apoio e emergência', 'Contatos e orientações para situações de violência, crise ou vulnerabilidade.'],
  ['/paradas', 'Paradas LGBTQ+ — Calendário e história', 'Calendário, notícias e história das paradas do orgulho LGBTQ+.'],
  ['/educacao', 'Educação e diversidade LGBTQ+', 'Guias e materiais educativos sobre diversidade e inclusão LGBTQ+.'],
  ['/comunidade', 'Comunidade LGBTQ+ — Redes e participação', 'Redes de apoio e oportunidades para a comunidade LGBTQ+.'],
];

const categories = ['artigos', 'opiniao', 'cultura', 'saude', 'familia', 'paradas', 'educacao', 'guia', 'comunidade', 'politica'];
const categoryLabels = { artigos: 'Artigos', opiniao: 'Opinião', cultura: 'Cultura', saude: 'Saúde', familia: 'Família', paradas: 'Paradas', educacao: 'Educação', guia: 'Guia', comunidade: 'Comunidade', politica: 'Política' };

async function loadEnvironment() {
  const values = { ...process.env };
  try {
    const source = await readFile(join(root, '.env'), 'utf8');
    for (const line of source.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !(match[1] in values)) values[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  } catch {
    // A .env local é opcional; a Vercel fornece as variáveis no ambiente.
  }
  return values;
}

function decodeValue(value = {}) {
  if ('stringValue' in value) return value.stringValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
  return '';
}

function decodeFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

async function fetchPublishedArticles(env) {
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  if (!projectId || !apiKey || apiKey === 'your_api_key_here') {
    console.warn('[seo] Firebase não configurado; sitemap gerado apenas com rotas estáticas.');
    return [];
  }
  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${encodeURIComponent(apiKey)}`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'articles' }],
          where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'published' } } },
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Firestore respondeu ${response.status}`);
    const rows = await response.json();
    return rows
      .filter((row) => row.document?.fields)
      .map((row) => decodeFields(row.document.fields))
      .filter((article) => article.slug && article.title);
  } catch (error) {
    console.warn(`[seo] Não foi possível obter artigos publicados: ${error.message}`);
    return [];
  }
}

const escapeHtml = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const textOnly = (value = '') => String(value).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function buildSitemap(siteUrl, articles) {
  const today = new Date().toISOString().slice(0, 10);
  const validDate = (value) => {
    const parsed = value ? new Date(value) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : today;
  };
  const latestForCategory = (category) => {
    const dates = articles
      .filter((article) => article.category === category)
      .map((article) => validDate(article.updated_at || article.published_at))
      .sort();
    return dates.at(-1) || today;
  };
  const paths = [
    ...routeDefinitions.map(([path]) => ({ path, lastmod: today })),
    ...categories.map((category) => ({ path: `/artigos/categoria/${category}`, lastmod: latestForCategory(category) })),
    ...articles.map((article) => ({ path: `/artigos/${article.slug}`, lastmod: validDate(article.updated_at || article.published_at) })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(({ path, lastmod }) =>
    `  <url><loc>${escapeHtml(siteUrl + path)}</loc><lastmod>${lastmod}</lastmod></url>`
  ).join('\n')}\n</urlset>\n`;
}

function buildRobots(siteUrl) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /api/\nDisallow: /eventos/submeter\nDisallow: /guia-fortaleza/indicar\n\nSitemap: ${siteUrl}/sitemap.xml\nHost: ${siteUrl}\n`;
}

function replaceMeta(html, matcher, replacement) {
  return matcher.test(html) ? html.replace(matcher, replacement) : html.replace('</head>', `  ${replacement}\n</head>`);
}

function renderPage(template, page, siteUrl) {
  const url = siteUrl + page.path;
  const image = page.image || `${siteUrl}/og-image.png`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  const tags = [
    [/\s*<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(page.description)}" />`],
    [/\s*<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(url)}" />`],
    [/\s*<meta property="og:type"[^>]*>/i, `<meta property="og:type" content="${page.type || 'website'}" />`],
    [/\s*<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHtml(url)}" />`],
    [/\s*<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(page.title)}" />`],
    [/\s*<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(page.description)}" />`],
    [/\s*<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(image)}" />`],
    [/\s*<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`],
    [/\s*<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`],
    [/\s*<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(image)}" />`],
  ];
  for (const [matcher, tag] of tags) html = replaceMeta(html, matcher, tag);
  if (page.jsonLd) {
    const json = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', `<script type="application/ld+json" data-generated-seo="true">${json}</script>\n</head>`);
  }
  const links = (page.articleLinks || []).map((article) => `<li><a href="/artigos/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a></li>`).join('');
  const sources = (page.sources || []).map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title || source.publisher || source.url)}</a></li>`).join('');
  const trust = page.reviewerName
    ? `<p>Revisão responsável: ${escapeHtml(page.reviewerName)}. Atualizado em ${escapeHtml(page.updatedAt || '')}.</p>`
    : '';
  const warning = page.healthDisclaimer
    ? '<aside><strong>Informação de saúde:</strong> este conteúdo não substitui atendimento profissional.</aside>'
    : '';
  const fallback = `<main data-seo-fallback><h1>${escapeHtml(page.heading || page.title)}</h1><p>${escapeHtml(page.description)}</p>${trust}${page.content ? `<p>${escapeHtml(textOnly(page.content))}</p>` : ''}${warning}${sources ? `<section><h2>Fontes e documentos consultados</h2><ol>${sources}</ol></section>` : ''}${links ? `<ul>${links}</ul>` : ''}<p><a href="/artigos">Ver todos os artigos</a></p></main>`;
  return html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

async function writeRoute(dist, path, html) {
  const target = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

async function prepare() {
  const env = await loadEnvironment();
  const siteUrl = (env.VITE_SITE_URL || 'https://portalgbtqia.vercel.app').replace(/\/$/, '');
  const articles = await fetchPublishedArticles(env);
  const cache = { siteUrl, articles };
  await mkdir(publicDir, { recursive: true });
  await writeFile(cacheFile, JSON.stringify(cache));
  await writeFile(join(publicDir, 'sitemap.xml'), buildSitemap(siteUrl, articles));
  await writeFile(join(publicDir, 'robots.txt'), buildRobots(siteUrl));
  console.log(`[seo] sitemap.xml gerado com ${routeDefinitions.length + categories.length + articles.length} URLs.`);
}

async function finalize() {
  const { siteUrl, articles } = JSON.parse(await readFile(cacheFile, 'utf8'));
  const template = await readFile(join(distDir, 'index.html'), 'utf8');
  const siteGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Portal LGBTQ+ Nordeste', url: siteUrl },
      { '@type': 'Person', '@id': `${siteUrl}/#founder`, name: 'Fernando Mário da Silva Martins', url: `${siteUrl}/quem-somos` },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Portal LGBTQ+ Nordeste', url: siteUrl, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/artigos?busca={search_term_string}` }, 'query-input': 'required name=search_term_string' } },
    ],
  };

  for (const [path, title, description, content] of routeDefinitions) {
    const articleLinks = path === '/' || path === '/artigos' ? articles : [];
    await writeRoute(distDir, path, renderPage(template, { path, title, description, content, articleLinks, jsonLd: siteGraph }, siteUrl));
  }

  for (const category of categories) {
    const label = categoryLabels[category];
    const path = `/artigos/categoria/${category}`;
    const articleLinks = articles.filter((article) => article.category === category);
    await writeRoute(distDir, path, renderPage(template, {
      path,
      title: `${label}: artigos LGBTQ+ | Portal LGBTQ+ Nordeste`,
      description: `Artigos, reportagens e análises sobre ${label.toLowerCase()} e vivências LGBTQ+.`,
      heading: `Artigos de ${label}`,
      articleLinks,
      jsonLd: siteGraph,
    }, siteUrl));
  }

  for (const article of articles) {
    const path = `/artigos/${article.slug}`;
    const url = siteUrl + path;
    const description = String(article.excerpt || '').slice(0, 160);
    const articleSources = Array.isArray(article.sources) && article.sources.length > 0
      ? article.sources
      : article.source_url
        ? [{ title: 'Fonte original', url: article.source_url }]
        : [];
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Article', '@id': `${url}#article`, mainEntityOfPage: url, headline: article.title, description, image: [article.featured_image || `${siteUrl}/og-image.png`], datePublished: article.published_at, dateModified: article.updated_at || article.published_at, author: { '@type': 'Person', name: article.author || 'Fernando Mário da Silva Martins' }, editor: article.reviewer_name ? { '@type': 'Person', name: article.reviewer_name } : undefined, citation: articleSources.map((source) => source.url).filter(Boolean), publisher: { '@id': `${siteUrl}/#organization` } },
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Artigos', item: `${siteUrl}/artigos` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ] },
      ],
    };
    await writeRoute(distDir, path, renderPage(template, {
      path,
      title: `${article.title} | Portal LGBTQ+ Nordeste`,
      heading: article.title,
      description,
      image: article.featured_image,
      type: 'article',
      content: article.content,
      sources: articleSources,
      reviewerName: article.reviewer_name,
      updatedAt: article.updated_at,
      healthDisclaimer: article.health_disclaimer === true || article.category === 'saude',
      jsonLd,
    }, siteUrl));
  }
  console.log(`[seo] HTML indexável gerado para ${routeDefinitions.length + categories.length + articles.length} rotas.`);
}

if (mode === 'prepare') await prepare();
else if (mode === 'finalize') await finalize();
else throw new Error(`Modo desconhecido: ${mode}`);
