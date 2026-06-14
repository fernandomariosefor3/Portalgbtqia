/**
 * Script de seed: popula as coleções `culture` e `health_guides` no Firestore
 * a partir do conteúdo curado dos mocks do frontend.
 *
 * Uso:
 *   cd project-LGBTQIA+/agent
 *   cp .env.example .env   # preencha FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY
 *   npx tsx src/seed/seed-content.ts            # popula cultura + saúde
 *   npx tsx src/seed/seed-content.ts culture    # só cultura
 *   npx tsx src/seed/seed-content.ts health     # só saúde
 *   npx tsx src/seed/seed-content.ts --dry-run  # mostra o que faria, sem escrever
 *
 * Idempotente: usa o `slug` como ID do documento (merge), então rodar de novo
 * atualiza os mesmos documentos em vez de duplicar.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Conteúdo curado (mesmos mocks usados como fallback no site).
import { allCulture, type CultureItem } from '../../../src/mocks/culture.js';
import { allHealthGuides, type HealthGuide } from '../../../src/mocks/health.js';

function initFirebase() {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const privateKey = rawKey.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Variáveis de ambiente do Firebase não configuradas (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).'
      );
    }

    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return getFirestore();
}

/**
 * Converte a string de data em PT-BR ("28 de junho de 2026") ou ISO para um
 * Timestamp. Se não conseguir, usa a data atual.
 */
function toTimestamp(value?: string): Timestamp {
  if (!value) return Timestamp.now();
  const months: Record<string, number> = {
    janeiro: 0, fevereiro: 1, março: 2, marco: 2, abril: 3, maio: 4, junho: 5,
    julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
  };
  const m = value.toLowerCase().match(/(\d{1,2})\s+de\s+([a-zç]+)\s+de\s+(\d{4})/);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = months[m[2]] ?? 0;
    const year = parseInt(m[3], 10);
    return Timestamp.fromDate(new Date(year, month, day));
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? Timestamp.now() : Timestamp.fromDate(parsed);
}

function cultureToDoc(item: CultureItem) {
  return {
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle ?? '',
    excerpt: item.excerpt ?? '',
    content: item.content ?? '',
    type: item.type,
    author: item.author ?? '',
    authorRole: item.authorRole ?? '',
    authorBio: item.authorBio ?? '',
    authorPhoto: item.authorPhoto ?? '',
    date: item.date ?? '',
    readTime: item.readTime ?? 0,
    image: item.image ?? '',
    featured: Boolean(item.featured),
    tags: item.tags ?? [],
    views: item.views ?? 0,
    year: item.year ?? null,
    director: item.director ?? null,
    cast: item.cast ?? null,
    genre: item.genre ?? null,
    platform: item.platform ?? null,
    albums: item.albums ?? null,
    performer: item.performer ?? null,
    rating: item.rating ?? null,
    status: 'published',
    published_at: toTimestamp(item.date),
    seededAt: Timestamp.now(),
  };
}

function healthToDoc(guide: HealthGuide) {
  return {
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt ?? '',
    content: guide.content ?? '',
    category: guide.category,
    subcategory: guide.subcategory ?? null,
    image: guide.image ?? '',
    author: guide.author ?? '',
    authorPhoto: guide.authorPhoto ?? '',
    authorBio: guide.authorBio ?? '',
    readTime: guide.readTime ?? 0,
    views: guide.views ?? 0,
    publishedAt: guide.publishedAt ?? '',
    featured: Boolean(guide.featured),
    tags: guide.tags ?? [],
    sources: guide.sources ?? null,
    faqs: guide.faqs ?? null,
    status: 'published',
    published_at: toTimestamp(guide.publishedAt),
    seededAt: Timestamp.now(),
  };
}

async function seedCollection<T extends { slug: string }>(
  collectionName: string,
  items: T[],
  toDoc: (item: T) => Record<string, unknown>,
  dryRun: boolean
) {
  // Em dry-run não conectamos ao Firebase (não precisa de credenciais).
  const db = dryRun ? null : initFirebase();
  console.log(`\n📚 ${collectionName}: ${items.length} itens`);
  let ok = 0;
  for (const item of items) {
    const doc = toDoc(item);
    if (dryRun || !db) {
      console.log(`  • [dry-run] ${item.slug}`);
      ok++;
      continue;
    }
    try {
      await db.collection(collectionName).doc(item.slug).set(doc, { merge: true });
      console.log(`  ✓ ${item.slug}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${item.slug}:`, err instanceof Error ? err.message : err);
    }
  }
  console.log(`  → ${ok}/${items.length} gravados em "${collectionName}"`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const only = args.find((a) => !a.startsWith('--'));

  const doCulture = !only || only === 'culture';
  const doHealth = !only || only === 'health';

  console.log('🌱 Seed de conteúdo do Portal LGBTQIA+');
  if (dryRun) console.log('   (modo dry-run: nada será escrito)');

  if (doCulture) {
    await seedCollection('culture', allCulture, cultureToDoc, dryRun);
  }
  if (doHealth) {
    await seedCollection('health_guides', allHealthGuides, healthToDoc, dryRun);
  }

  console.log('\n✅ Concluído.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Falha no seed:', err);
  process.exit(1);
});
