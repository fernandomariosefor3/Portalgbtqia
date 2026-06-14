// Funções puras de processamento de eventos.
// Mantidas separadas de firestore.ts (que inicializa o Firebase) para
// permitir testes unitários sem dependências externas.

/** Gera um slug a partir de um título (sem acentos, kebab-case). */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Gera uma descrição curta (máx. 160 caracteres) a partir da descrição. */
export function generateShortDescription(description?: string): string {
  if (!description) return '';
  if (description.length <= 160) return description;
  return description.slice(0, 157) + '...';
}

/** Categoriza automaticamente um evento com base no título e descrição. */
export function autoCategorize(title: string, description?: string): string {
  const text = (title + ' ' + (description || '')).toLowerCase();
  if (text.includes('parada') || text.includes('marcha') || text.includes('orgulho')) return 'parada';
  if (text.includes('festa') || text.includes('ball') || text.includes('baile') || text.includes('party')) return 'festa';
  if (text.includes('drag') || text.includes('show') || text.includes('teatro') || text.includes('cinema') || text.includes('exposição')) return 'cultura';
  if (text.includes('saude') || text.includes('prep') || text.includes('teste') || text.includes('mental') || text.includes('hormônio')) return 'saude';
  if (text.includes('educação') || text.includes('palestra') || text.includes('workshop') || text.includes('capacitação')) return 'educacao';
  if (text.includes('visibilidade') || text.includes('dia da') || text.includes('semana')) return 'visibilidade';
  return 'encontro';
}

/** Extrai tags automaticamente com base em palavras-chave. */
export function autoTags(title: string, description?: string): string[] {
  const text = (title + ' ' + (description || '')).toLowerCase();
  const keywords: [string, string[]][] = [
    ['lgbtq', ['lgbtq', 'lgbt', 'lgbtqia+']],
    ['trans', ['trans', 'transexual', 'travesti', 'nao-binario', 'nao binario']],
    ['gay', ['gay', 'homossexual']],
    ['lesbica', ['lesbica', 'lesbian', 'sapatao']],
    ['bissexual', ['bissexual', 'bi', 'pansexual']],
    ['drag', ['drag', 'queen', 'king']],
    ['parada', ['parada', 'marcha']],
    ['fortaleza', ['fortaleza']],
    ['ceara', ['ceara', 'ceará']],
    ['nordeste', ['nordeste']],
    ['recife', ['recife']],
    ['salvador', ['salvador']],
    ['saude', ['saude', 'saúde', 'prep', 'mental']],
    ['cultura', ['cultura', 'arte', 'musica', 'música']],
    ['familia', ['familia', 'família', 'pais', 'filhos']],
    ['direitos', ['direitos', 'politica', 'política', 'lei']],
  ];
  const tags: string[] = [];
  for (const [tag, variants] of keywords) {
    if (variants.some((v) => text.includes(v))) {
      tags.push(tag);
    }
  }
  return tags;
}
