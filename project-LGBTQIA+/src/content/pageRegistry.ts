export interface EditablePage {
  key: string;
  label: string;
  matches: (pathname: string) => boolean;
}

export const editablePages: EditablePage[] = [
  { key: 'home', label: 'Página inicial', matches: (path) => path === '/' },
  { key: 'about', label: 'Quem somos', matches: (path) => path === '/quem-somos' },
  { key: 'articles', label: 'Artigos', matches: (path) => path.startsWith('/artigos') },
  { key: 'culture', label: 'Cultura', matches: (path) => path.startsWith('/cultura') },
  { key: 'events', label: 'Eventos', matches: (path) => path.startsWith('/eventos') },
  { key: 'health', label: 'Saúde', matches: (path) => path.startsWith('/saude') },
  { key: 'family', label: 'Família', matches: (path) => path === '/familia' },
  { key: 'guide', label: 'Guia CE', matches: (path) => path.startsWith('/guia-fortaleza') },
  { key: 'rights', label: 'Direitos', matches: (path) => path === '/direitos' },
  { key: 'routes', label: 'Roteiros', matches: (path) => path === '/roteiros' },
  { key: 'sos', label: 'SOS', matches: (path) => path === '/sos' },
  { key: 'parades', label: 'Paradas', matches: (path) => path === '/paradas' },
  { key: 'education', label: 'Educação', matches: (path) => path === '/educacao' },
  { key: 'community', label: 'Comunidade', matches: (path) => path === '/comunidade' },
];

export const editablePageOptions = editablePages.map(({ key, label }) => ({ key, label }));

export function getEditablePageKey(pathname: string): string | null {
  return editablePages.find((page) => page.matches(pathname))?.key ?? null;
}

export type ContentLocale = 'pt-BR' | 'es' | 'en';

export const contentLocales: Array<{ code: ContentLocale; label: string }> = [
  { code: 'pt-BR', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

export function normalizeContentLocale(language?: string): ContentLocale {
  if (language?.startsWith('es')) return 'es';
  if (language?.startsWith('en')) return 'en';
  return 'pt-BR';
}
