import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const failures = [];
const read = (path) => readFile(path, 'utf8');
const fail = (message) => failures.push(message);

const sitemap = await read(join(dist, 'sitemap.xml'));
const robots = await read(join(dist, 'robots.txt'));
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, '&'));

if (urls.length === 0) fail('sitemap.xml não contém URLs.');
if (new Set(urls).size !== urls.length) fail('sitemap.xml contém URLs duplicadas.');
if (!/^User-agent: \*/m.test(robots)) fail('robots.txt não declara User-agent.');
if (!/^Sitemap: https:\/\//m.test(robots)) fail('robots.txt não aponta para um sitemap HTTPS.');

for (const url of urls) {
  const parsed = new URL(url);
  const relative = parsed.pathname === '/' ? 'index.html' : join(parsed.pathname.slice(1), 'index.html');
  let html;
  try {
    html = await read(join(dist, relative));
  } catch {
    fail(`${parsed.pathname}: arquivo HTML não foi gerado.`);
    continue;
  }

  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!title) fail(`${parsed.pathname}: título ausente.`);
  if (!description) fail(`${parsed.pathname}: descrição ausente.`);
  if (canonical !== url) fail(`${parsed.pathname}: canônica divergente (${canonical || 'ausente'}).`);
  if (!html.includes('data-seo-fallback')) fail(`${parsed.pathname}: conteúdo HTML pré-renderizado ausente.`);

  const isArticle = /^\/artigos\/[^/]+$/.test(parsed.pathname) && !parsed.pathname.includes('/categoria/');
  if (isArticle) {
    for (const type of ['Article', 'Organization', 'Person', 'BreadcrumbList', 'WebSite', 'SearchAction']) {
      const pattern = new RegExp(`"@type"\\s*:\\s*"${type}"`);
      if (!pattern.test(html)) fail(`${parsed.pathname}: JSON-LD ${type} ausente.`);
    }
  }
}

if (failures.length > 0) {
  console.error('[seo:check] Falha na validação:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`[seo:check] ${urls.length} URLs validadas: sitemap, robots, canônicas, metadados, HTML e JSON-LD.`);
