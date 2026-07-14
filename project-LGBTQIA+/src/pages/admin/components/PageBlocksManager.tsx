import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { contentLocales, editablePageOptions, type ContentLocale } from '@/content/pageRegistry';
import type { PageBlock } from '@/lib/usePageBlocks';

type PageBlockForm = Omit<PageBlock, 'id'> & { id?: string };

const emptyForm: PageBlockForm = {
  page: 'home',
  locale: 'pt-BR',
  title: '',
  content: '',
  image: '',
  imageAlt: '',
  ctaLabel: '',
  ctaUrl: '',
  order: 0,
  status: 'draft',
};

function toForm(id: string, data: Record<string, unknown>): PageBlockForm {
  return {
    id,
    page: typeof data.page === 'string' ? data.page : 'home',
    locale: (contentLocales.some((locale) => locale.code === data.locale) ? data.locale : 'pt-BR') as ContentLocale,
    title: typeof data.title === 'string' ? data.title : '',
    content: typeof data.content === 'string' ? data.content : '',
    image: typeof data.image === 'string' ? data.image : '',
    imageAlt: typeof data.imageAlt === 'string' ? data.imageAlt : '',
    ctaLabel: typeof data.ctaLabel === 'string' ? data.ctaLabel : '',
    ctaUrl: typeof data.ctaUrl === 'string' ? data.ctaUrl : '',
    order: typeof data.order === 'number' ? data.order : 0,
    status: data.status === 'published' ? 'published' : 'draft',
  };
}

export default function PageBlocksManager() {
  const [blocks, setBlocks] = useState<PageBlockForm[]>([]);
  const [form, setForm] = useState<PageBlockForm>({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterPage, setFilterPage] = useState('all');

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, 'page_blocks'));
      setBlocks(
        snapshot.docs
          .map((item) => toForm(item.id, item.data()))
          .sort((a, b) => a.page.localeCompare(b.page) || a.order - b.order),
      );
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível carregar os blocos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBlocks();
  }, [loadBlocks]);

  const coverage = useMemo(
    () => editablePageOptions.map((page) => ({
      ...page,
      published: blocks.filter((block) => block.page === page.key && block.status === 'published').length,
      locales: contentLocales.filter((locale) => blocks.some((block) => block.page === page.key && block.locale === locale.code && block.status === 'published')),
    })),
    [blocks],
  );

  const visibleBlocks = filterPage === 'all' ? blocks : blocks.filter((block) => block.page === filterPage);

  async function saveBlock() {
    if (!form.title.trim() && !form.content.trim()) {
      setError('Informe um título ou conteúdo para o bloco.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    const payload = {
      page: form.page,
      locale: form.locale,
      title: form.title.trim(),
      content: form.content.trim(),
      image: form.image.trim(),
      imageAlt: form.imageAlt.trim(),
      ctaLabel: form.ctaLabel.trim(),
      ctaUrl: form.ctaUrl.trim(),
      order: Number(form.order) || 0,
      status: form.status,
      updated_at: serverTimestamp(),
    };

    try {
      if (form.id) {
        await updateDoc(doc(db, 'page_blocks', form.id), payload);
      } else {
        await addDoc(collection(db, 'page_blocks'), { ...payload, created_at: serverTimestamp() });
      }
      setForm({ ...emptyForm, page: form.page, locale: form.locale });
      setSuccess(form.id ? 'Bloco atualizado.' : 'Bloco criado.');
      await loadBlocks();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível salvar o bloco.');
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(id: string) {
    if (!window.confirm('Apagar este bloco editorial?')) return;
    try {
      await deleteDoc(doc(db, 'page_blocks', id));
      setBlocks((current) => current.filter((block) => block.id !== id));
      if (form.id === id) setForm({ ...emptyForm });
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível apagar o bloco.');
    }
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="coverage-title" className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 id="coverage-title" className="text-xl font-bold text-gray-900">Auditoria das páginas</h2>
          <p className="mt-1 text-sm text-gray-500">Veja quais páginas possuem blocos publicados e em quais idiomas.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.map((page) => (
            <button
              key={page.key}
              type="button"
              onClick={() => setFilterPage(page.key)}
              className="min-h-16 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-pink-300 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <span className="block text-sm font-semibold text-gray-800">{page.label}</span>
              <span className="mt-1 block text-xs text-gray-500">
                {page.published} publicado(s) · {page.locales.length > 0 ? page.locales.map((locale) => locale.code).join(', ') : 'sem conteúdo gerenciado'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {(error || success) && (
        <div role={error ? 'alert' : 'status'} aria-live={error ? 'assertive' : 'polite'} className={`rounded-lg border px-4 py-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
          {error ?? success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section aria-labelledby="blocks-title">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="blocks-title" className="text-xl font-bold">Blocos editoriais ({visibleBlocks.length})</h2>
              <p className="mt-1 text-sm text-gray-500">Adicione informações sem alterar o código fixo da página.</p>
            </div>
            <select aria-label="Filtrar blocos por página" value={filterPage} onChange={(event) => setFilterPage(event.target.value)} className="min-h-11 rounded-lg border px-3 text-sm">
              <option value="all">Todas as páginas</option>
              {editablePageOptions.map((page) => <option key={page.key} value={page.key}>{page.label}</option>)}
            </select>
          </div>

          {loading ? (
            <p className="rounded-lg border bg-white p-5 text-sm text-gray-500">Carregando blocos…</p>
          ) : visibleBlocks.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-white p-8 text-center">
              <p className="font-medium text-gray-700">Nenhum bloco nesta página.</p>
              <p className="mt-1 text-sm text-gray-500">Crie o primeiro conteúdo usando o formulário ao lado.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {visibleBlocks.map((block) => (
                <article key={block.id} className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-800">{block.title || 'Bloco sem título'}</h3>
                      <p className="mt-1 text-xs text-gray-500">{block.page} · {block.locale} · ordem {block.order}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${block.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {block.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setForm({ ...block })} className="min-h-10 rounded-lg border border-blue-200 px-3 text-xs font-semibold text-blue-700 hover:bg-blue-50">Editar</button>
                    <button type="button" onClick={() => block.id && void removeBlock(block.id)} className="min-h-10 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">Apagar</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="block-form-title" className="h-fit space-y-4 rounded-xl border bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="block-form-title" className="text-xl font-bold">{form.id ? 'Editar bloco' : 'Novo bloco'}</h2>
              <p className="mt-1 text-xs text-gray-500">O idioma escolhido acompanha o seletor público.</p>
            </div>
            {form.id && <button type="button" onClick={() => setForm({ ...emptyForm })} className="text-sm font-semibold text-pink-700">Novo</button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">Página
              <select value={form.page} onChange={(event) => setForm({ ...form, page: event.target.value })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal">
                {editablePageOptions.map((page) => <option key={page.key} value={page.key}>{page.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">Idioma
              <select value={form.locale} onChange={(event) => setForm({ ...form, locale: event.target.value as ContentLocale })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal">
                {contentLocales.map((locale) => <option key={locale.code} value={locale.code}>{locale.label}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-gray-700">Título
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal" />
          </label>
          <label className="block text-sm font-medium text-gray-700">Conteúdo
            <textarea name="page-block-content" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={9} className="mt-1 w-full rounded-lg border p-3 font-normal" placeholder="Texto ou HTML editorial" />
          </label>
          <label className="block text-sm font-medium text-gray-700">URL da imagem
            <input type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal" />
          </label>
          <label className="block text-sm font-medium text-gray-700">Descrição da imagem
            <input value={form.imageAlt} onChange={(event) => setForm({ ...form, imageAlt: event.target.value })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal" placeholder="Descreva a imagem para leitores de tela…" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">Texto do botão<input value={form.ctaLabel} onChange={(event) => setForm({ ...form, ctaLabel: event.target.value })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal" /></label>
            <label className="text-sm font-medium text-gray-700">Link do botão<input value={form.ctaUrl} onChange={(event) => setForm({ ...form, ctaUrl: event.target.value })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal" /></label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">Ordem<input type="number" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal" /></label>
            <label className="text-sm font-medium text-gray-700">Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as PageBlockForm['status'] })} className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal">
                <option value="draft">Rascunho</option><option value="published">Publicado</option>
              </select>
            </label>
          </div>
          <button type="button" onClick={() => void saveBlock()} disabled={saving} className="min-h-11 w-full rounded-lg bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50">
            {saving ? 'Salvando…' : form.id ? 'Atualizar bloco' : 'Criar bloco'}
          </button>
        </section>
      </div>
    </div>
  );
}
