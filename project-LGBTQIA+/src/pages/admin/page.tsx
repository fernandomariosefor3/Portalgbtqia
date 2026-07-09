import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../lib/auth";
import { allCulture, type CultureItem } from "../../mocks/culture";
import { safeSpaceCategories, staticSafeSpaces, type SafeSpace, type SafeSpaceCategory } from "../../mocks/safeSpaces";
import { applySafeSpaceOverride, safeSpaceToOverride, type SafeSpaceOverride } from "../../lib/useSafeSpaces";

interface ArticleItem {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category: string;
  status?: string;
  featured_image?: string;
  source_url?: string;
  published_at: any;
}

interface EditableRecord {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  status: string;
}

interface SiteSection {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
}

interface CultureOverride {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  image: string;
  type: CultureItem["type"];
  status: "published" | "hidden";
  featured: boolean;
}

type TabKey = "articles" | "culture" | "sections" | "events" | "places" | "facebook";

const tabs: Array<{ id: TabKey; label: string }> = [
  { id: "articles", label: "Artigos" },
  { id: "culture", label: "Cultura" },
  { id: "sections", label: "Espacos do site" },
  { id: "events", label: "Eventos" },
  { id: "places", label: "Guia" },
  { id: "facebook", label: "Facebook" },
];

const defaultSections: SiteSection[] = [
  {
    key: "home-hero",
    label: "Home - destaque principal",
    title: "Portal LGBTQ+ Nordeste",
    subtitle: "Informacao, cultura, saude e comunidade",
    description: "Um espaco seguro de representatividade, servico e acolhimento para pessoas LGBTQIA+ no Nordeste.",
    image: "",
    ctaLabel: "Ver artigos",
    ctaUrl: "/artigos",
  },
  {
    key: "home-community",
    label: "Home - chamada comunidade",
    title: "Fortaleca a comunidade",
    subtitle: "Participe, compartilhe e acolha",
    description: "Divulgue eventos, guias e oportunidades para ampliar redes de protecao e pertencimento.",
    image: "",
    ctaLabel: "Enviar contribuicao",
    ctaUrl: "/comunidade",
  },
  {
    key: "about-page",
    label: "Pagina Sobre",
    title: "Sobre o Portal",
    subtitle: "Jornalismo, memoria e servico",
    description: "Conte a historia, missao, equipe e valores editoriais do portal.",
    image: "",
    ctaLabel: "Fale conosco",
    ctaUrl: "/comunidade",
  },
];

const emptyArticle = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  image: "",
  category: "artigos",
  status: "published",
  sourceUrl: "",
};

const emptyRecord: EditableRecord = {
  id: "",
  title: "",
  description: "",
  image: "",
  link: "",
  category: "comunidade",
  status: "published",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("articles");
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("artigos");
  const [articleStatus, setArticleStatus] = useState("published");
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cultureOverrides, setCultureOverrides] = useState<Record<string, CultureOverride>>({});
  const [cultureForm, setCultureForm] = useState<CultureOverride | null>(null);
  const [safeSpaceOverrides, setSafeSpaceOverrides] = useState<Record<string, SafeSpaceOverride>>({});
  const [safeSpaceForm, setSafeSpaceForm] = useState<SafeSpaceOverride | null>(null);
  const [sections, setSections] = useState<SiteSection[]>(defaultSections);
  const [selectedSectionKey, setSelectedSectionKey] = useState(defaultSections[0].key);
  const [sectionForm, setSectionForm] = useState<SiteSection>(defaultSections[0]);
  const [eventForm, setEventForm] = useState<EditableRecord>({ ...emptyRecord, category: "evento" });
  const [events, setEvents] = useState<EditableRecord[]>([]);
  const [placeForm, setPlaceForm] = useState<EditableRecord>({ ...emptyRecord, category: "espaco-seguro" });
  const [places, setPlaces] = useState<EditableRecord[]>([]);
  const [facebookText, setFacebookText] = useState("");
  const [facebookArticleUrl, setFacebookArticleUrl] = useState("");

  const loadArticles = useCallback(async () => {
    const q = query(collection(db, "articles"), orderBy("published_at", "desc"));
    const snap = await getDocs(q);
    setArticles(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ArticleItem)));
  }, []);

  const loadSections = useCallback(async () => {
    const next = await Promise.all(
      defaultSections.map(async (section) => {
        const snapshot = await getDoc(doc(db, "site_sections", section.key));
        return snapshot.exists() ? ({ ...section, ...snapshot.data(), key: section.key } as SiteSection) : section;
      }),
    );
    setSections(next);
    setSectionForm((current) => next.find((section) => section.key === current.key) ?? next[0]);
  }, []);

  const loadCultureOverrides = useCallback(async () => {
    const snap = await getDocs(collection(db, "culture_overrides"));
    const next: Record<string, CultureOverride> = {};
    snap.docs.forEach((item) => {
      next[item.id] = { slug: item.id, ...item.data() } as CultureOverride;
    });
    setCultureOverrides(next);
  }, []);

  const loadSafeSpaceOverrides = useCallback(async () => {
    const snap = await getDocs(collection(db, "safe_space_overrides"));
    const next: Record<string, SafeSpaceOverride> = {};
    snap.docs.forEach((item) => {
      next[item.id] = { slug: item.id, ...item.data() } as SafeSpaceOverride;
    });
    setSafeSpaceOverrides(next);
  }, []);

  const loadRecords = useCallback(async (collectionName: "events" | "places") => {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        title: data.title ?? data.name ?? "",
        description: data.description ?? data.short_description ?? "",
        image: data.image_url ?? data.image ?? "",
        link: data.source_url ?? data.link ?? "",
        category: data.category ?? "comunidade",
        status: data.status ?? "published",
      };
    }) as EditableRecord[];
  }, []);

  useEffect(() => {
    loadArticles();
    loadCultureOverrides();
    loadSafeSpaceOverrides();
    loadSections();
    loadRecords("events").then(setEvents).catch(() => setEvents([]));
    loadRecords("places").then(setPlaces).catch(() => setPlaces([]));
  }, [loadArticles, loadCultureOverrides, loadRecords, loadSafeSpaceOverrides, loadSections]);

  const deleteArticle = async (id: string) => {
    if (!confirm("Apagar este artigo?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "articles", id));
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      alert("Erro ao apagar: " + e.message);
    }
    setDeletingId(null);
  };

  const resetArticleForm = () => {
    setUrl(emptyArticle.sourceUrl);
    setTitle(emptyArticle.title);
    setExcerpt(emptyArticle.excerpt);
    setContent(emptyArticle.content);
    setImage(emptyArticle.image);
    setCategory(emptyArticle.category);
    setArticleStatus(emptyArticle.status);
    setEditingArticleId(null);
  };

  const editArticle = (article: ArticleItem) => {
    setEditingArticleId(article.id);
    setUrl(article.source_url ?? "");
    setTitle(article.title ?? "");
    setExcerpt(article.excerpt ?? "");
    setContent(article.content ?? "");
    setImage(article.featured_image ?? "");
    setCategory(article.category ?? "artigos");
    setArticleStatus(article.status ?? "published");
    setActiveTab("articles");
    setMessage({ type: "success", text: "Artigo carregado para edicao." });
  };

  const getCultureForm = (item: CultureItem): CultureOverride => ({
    slug: item.slug,
    title: cultureOverrides[item.slug]?.title ?? item.title,
    subtitle: cultureOverrides[item.slug]?.subtitle ?? item.subtitle,
    excerpt: cultureOverrides[item.slug]?.excerpt ?? item.excerpt,
    content: cultureOverrides[item.slug]?.content ?? item.content,
    image: cultureOverrides[item.slug]?.image ?? item.image,
    type: cultureOverrides[item.slug]?.type ?? item.type,
    status: cultureOverrides[item.slug]?.status ?? "published",
    featured: cultureOverrides[item.slug]?.featured ?? item.featured,
  });

  const saveCultureOverride = async (form: CultureOverride) => {
    setIsPublishing(true);
    setMessage(null);
    try {
      await setDoc(doc(db, "culture_overrides", form.slug), {
        ...form,
        updated_at: serverTimestamp(),
      }, { merge: true });
      setCultureOverrides((prev) => ({ ...prev, [form.slug]: form }));
      setCultureForm(form);
      setMessage({ type: "success", text: "Item de cultura salvo." });
    } catch (e: any) {
      setMessage({ type: "error", text: `Erro ao salvar cultura: ${e?.message || e}` });
    }
    setIsPublishing(false);
  };

  const toggleCultureItem = async (item: CultureItem) => {
    const form = getCultureForm(item);
    await saveCultureOverride({
      ...form,
      status: form.status === "published" ? "hidden" : "published",
    });
  };

  const getSafeSpaceForm = (space: SafeSpace): SafeSpaceOverride => {
    const controlled = applySafeSpaceOverride(space, safeSpaceOverrides[space.slug]);
    return safeSpaceToOverride(controlled);
  };

  const saveSafeSpaceOverride = async (form: SafeSpaceOverride) => {
    setIsPublishing(true);
    setMessage(null);
    try {
      await setDoc(doc(db, "safe_space_overrides", form.slug), {
        ...form,
        updated_at: serverTimestamp(),
      }, { merge: true });
      setSafeSpaceOverrides((prev) => ({ ...prev, [form.slug]: form }));
      setSafeSpaceForm(form);
      setMessage({ type: "success", text: "Espaço seguro salvo." });
    } catch (e: any) {
      setMessage({ type: "error", text: `Erro ao salvar espaço: ${e?.message || e}` });
    }
    setIsPublishing(false);
  };

  const toggleSafeSpace = async (space: SafeSpace) => {
    const form = getSafeSpaceForm(space);
    await saveSafeSpaceOverride({
      ...form,
      status: form.status === "published" ? "hidden" : "published",
    });
  };

  const saveSection = async () => {
    setIsPublishing(true);
    setMessage(null);
    try {
      await setDoc(doc(db, "site_sections", sectionForm.key), sectionForm, { merge: true });
      setSections((prev) => prev.map((section) => (section.key === sectionForm.key ? sectionForm : section)));
      setMessage({ type: "success", text: "Espaco do site salvo." });
    } catch (e: any) {
      setMessage({ type: "error", text: `Erro ao salvar espaco: ${e?.message || e}` });
    }
    setIsPublishing(false);
  };

  const saveRecord = async (collectionName: "events" | "places", form: EditableRecord) => {
    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Titulo e obrigatorio." });
      return;
    }

    setIsPublishing(true);
    setMessage(null);
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.title),
      description: form.description.trim(),
      short_description: form.description.trim(),
      category: form.category,
      image_url: form.image.trim(),
      source_url: form.link.trim(),
      status: collectionName === "events" && form.status === "published" ? "approved" : form.status,
      tags: [],
      updated_at: serverTimestamp(),
    };

    try {
      if (form.id) {
        await updateDoc(doc(db, collectionName, form.id), payload);
      } else {
        await addDoc(collection(db, collectionName), { ...payload, createdAt: new Date().toISOString() });
      }

      if (collectionName === "events") {
        setEventForm({ ...emptyRecord, category: "evento" });
        setEvents(await loadRecords("events"));
      } else {
        setPlaceForm({ ...emptyRecord, category: "espaco-seguro" });
        setPlaces(await loadRecords("places"));
      }
      setMessage({ type: "success", text: collectionName === "events" ? "Evento salvo." : "Item do guia salvo." });
    } catch (e: any) {
      setMessage({ type: "error", text: `Erro ao salvar: ${e?.message || e}` });
    }
    setIsPublishing(false);
  };

  const deleteRecord = async (collectionName: "events" | "places", id: string) => {
    if (!confirm("Apagar este item?")) return;
    await deleteDoc(doc(db, collectionName, id));
    if (collectionName === "events") {
      setEvents((prev) => prev.filter((item) => item.id !== id));
    } else {
      setPlaces((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  if (!user || !isAdmin) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso restrito</h1>
        <p className="text-gray-600">Você precisa estar autenticado como administrador.</p>
      </main>
    );
  }

  const fetchLink = async () => {
    if (!url.trim()) return;
    setIsFetching(true);
    setMessage(null);
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.status === "success") {
        setTitle(data.data.title || "");
        setExcerpt(data.data.description || "");
        setImage(data.data.image?.url || "");
        setMessage({ type: "success", text: "Dados carregados! Revise e publique." });
      } else {
        setMessage({ type: "error", text: "Não foi possível extrair dados. Preencha manualmente." });
      }
    } catch {
      setMessage({ type: "error", text: "Erro de rede. Preencha os campos manualmente." });
    }
    setIsFetching(false);
  };

  const publish = async () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Título é obrigatório." });
      return;
    }
    setIsPublishing(true);
    setMessage(null);
    try {
      const payload = {
        title: title.trim(),
        slug: slugify(title),
        excerpt: excerpt.trim(),
        content: content.trim() || `<p class="lead">${excerpt.trim()}</p>${url.trim() ? `<p>Fonte: <a href="${url}" target="_blank" rel="noopener">${url}</a></p>` : ""}<p><em>Publicado por Fernando Mario da Silva Martins (@nando_apollo)</em></p>`,
        category,
        subcategory: "",
        author: "Fernando Mario da Silva Martins",
        authorRole: "Fundador",
        published_at: articleStatus === "published" ? serverTimestamp() : null,
        status: articleStatus,
        featured_image: image.trim(),
        tags: [],
        views: 0,
        source_url: url.trim(),
        updated_at: serverTimestamp(),
      };

      if (editingArticleId) {
        await updateDoc(doc(db, "articles", editingArticleId), payload);
      } else {
        await addDoc(collection(db, "articles"), payload);
      }

      setMessage({ type: "success", text: editingArticleId ? "Artigo atualizado com sucesso!" : "Artigo salvo com sucesso!" });
      resetArticleForm();
      await loadArticles();
    } catch (e: any) {
      setMessage({ type: "error", text: `Erro ao publicar: ${e?.message || e}` });
    }
    setIsPublishing(false);
  };

  const copyFacebookText = async (text: string, successText: string) => {
    if (!text.trim()) {
      setMessage({ type: "error", text: "Selecione um artigo antes de copiar." });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setMessage({ type: "success", text: successText });
    } catch {
      setMessage({ type: "error", text: "Nao foi possivel copiar automaticamente. Selecione o texto e copie manualmente." });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-1">Painel Admin</h1>
      <p className="text-gray-500 mb-8">Edite artigos, espacos do site, eventos, guia e textos para redes sociais.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${activeTab === tab.id ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-700 border-gray-200 hover:border-pink-300"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {activeTab === "articles" && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6">
          <div className="bg-white border rounded-xl p-6 space-y-5 shadow-sm">

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link da matéria *</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLink()}
              placeholder="https://..."
              className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              onClick={fetchLink}
              disabled={isFetching || !url.trim()}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {isFetching ? "Buscando..." : "Auto-preencher"}
            </button>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Título da matéria"
          />
        </div>

        {/* Resumo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Descrição curta da matéria"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conteudo que aparece ao clicar</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Escreva aqui a informacao completa da postagem. Pode usar parágrafos simples ou HTML."
          />
        </div>

        {/* Imagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL da imagem</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="https://..."
          />
          {image && (
            <img src={image} alt="preview" className="mt-2 h-28 w-full object-cover rounded-lg" onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="artigos">Artigos</option>
              <option value="cultura">Cultura</option>
              <option value="saude">Saude</option>
              <option value="familia">Familia</option>
              <option value="politica">Politica</option>
              <option value="educacao">Educacao</option>
              <option value="comunidade">Comunidade</option>
            </select>
            <select
              value={articleStatus}
              onChange={(e) => setArticleStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>

            <div className="flex gap-3">
              <button
                onClick={publish}
                disabled={isPublishing || !title.trim()}
                className="flex-1 py-3 bg-pink-600 text-white rounded-lg font-semibold text-sm hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {isPublishing ? "Salvando..." : editingArticleId ? "Atualizar artigo" : "Salvar artigo"}
              </button>
              {editingArticleId && (
                <button onClick={resetArticleForm} className="px-5 py-3 border rounded-lg text-sm font-semibold hover:bg-gray-50">
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Artigos ({articles.length})</h2>
        {articles.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum artigo ainda.</p>
        ) : (
          <div className="space-y-2">
            {articles.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 bg-white border rounded-lg px-4 py-3 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.title || "(sem título)"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.category} · {a.published_at?.toDate?.()?.toLocaleDateString("pt-BR") ?? ""}
                  </p>
                </div>
                <button
                  onClick={() => editArticle(a)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteArticle(a.id)}
                  disabled={deletingId === a.id}
                  className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingId === a.id ? "Apagando..." : "Apagar"}
                </button>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      )}

      {activeTab === "culture" && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Cultura estática ({allCulture.length})</h2>
            <p className="text-sm text-gray-500 mb-4">
              Escolha o que fica publicado, o que sai do ar e edite textos sem apagar o conteúdo do projeto.
            </p>
            <div className="space-y-2">
              {allCulture.map((item) => {
                const form = getCultureForm(item);
                return (
                  <div key={item.slug} className="bg-white border rounded-lg px-4 py-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{form.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {form.type} · {form.status === "published" ? "Publicado" : "Fora do ar"}
                        </p>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold ${form.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {form.status === "published" ? "Publicado" : "Oculto"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setCultureForm(form)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCultureItem(item)}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-lg ${
                          form.status === "published"
                            ? "text-amber-700 border-amber-200 hover:bg-amber-50"
                            : "text-green-700 border-green-200 hover:bg-green-50"
                        }`}
                      >
                        {form.status === "published" ? "Tirar do ar" : "Publicar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4 h-fit lg:sticky lg:top-6">
            {cultureForm ? (
              <>
                <div>
                  <h2 className="text-xl font-bold">Editar cultura</h2>
                  <p className="text-xs text-gray-400 mt-1">{cultureForm.slug}</p>
                </div>
                <input value={cultureForm.title} onChange={(e) => setCultureForm({ ...cultureForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Titulo" />
                <input value={cultureForm.subtitle} onChange={(e) => setCultureForm({ ...cultureForm, subtitle: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Subtitulo" />
                <textarea value={cultureForm.excerpt} onChange={(e) => setCultureForm({ ...cultureForm, excerpt: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Resumo" />
                <textarea value={cultureForm.content} onChange={(e) => setCultureForm({ ...cultureForm, content: e.target.value })} rows={8} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Conteudo HTML" />
                <input value={cultureForm.image} onChange={(e) => setCultureForm({ ...cultureForm, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="URL da imagem" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <select value={cultureForm.type} onChange={(e) => setCultureForm({ ...cultureForm, type: e.target.value as CultureItem["type"] })} className="w-full px-4 py-2 border rounded-lg text-sm">
                    <option value="cinema">Cinema</option>
                    <option value="series">Séries</option>
                    <option value="musica">Música</option>
                    <option value="drag">Drag</option>
                  </select>
                  <select value={cultureForm.status} onChange={(e) => setCultureForm({ ...cultureForm, status: e.target.value as CultureOverride["status"] })} className="w-full px-4 py-2 border rounded-lg text-sm">
                    <option value="published">Publicado</option>
                    <option value="hidden">Fora do ar</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={cultureForm.featured} onChange={(e) => setCultureForm({ ...cultureForm, featured: e.target.checked })} />
                  Destaque
                </label>
                <button onClick={() => saveCultureOverride(cultureForm)} disabled={isPublishing || !cultureForm.title.trim()} className="w-full py-3 bg-pink-600 text-white rounded-lg font-semibold text-sm disabled:opacity-50">
                  {isPublishing ? "Salvando..." : "Salvar cultura"}
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Selecione um item de cultura para editar.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "sections" && (
        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
          <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => {
                  setSelectedSectionKey(section.key);
                  setSectionForm(section);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedSectionKey === section.key ? "bg-pink-50 text-pink-700" : "hover:bg-gray-50"}`}
              >
                {section.label}
              </button>
            ))}
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <input value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Titulo" />
            <input value={sectionForm.subtitle} onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Subtitulo" />
            <textarea value={sectionForm.description} onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })} rows={5} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Descricao" />
            <input value={sectionForm.image} onChange={(e) => setSectionForm({ ...sectionForm, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="URL da imagem" />
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={sectionForm.ctaLabel} onChange={(e) => setSectionForm({ ...sectionForm, ctaLabel: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Texto do botao" />
              <input value={sectionForm.ctaUrl} onChange={(e) => setSectionForm({ ...sectionForm, ctaUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Link do botao" />
            </div>
            <button onClick={saveSection} disabled={isPublishing} className="w-full py-3 bg-pink-600 text-white rounded-lg font-semibold text-sm disabled:opacity-50">
              {isPublishing ? "Salvando..." : "Salvar espaco"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <RecordEditor title="Eventos" form={eventForm} setForm={setEventForm} records={events} onSave={() => saveRecord("events", eventForm)} onDelete={(id) => deleteRecord("events", id)} isSaving={isPublishing} />
      )}

      {activeTab === "places" && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Espaços curados ({staticSafeSpaces.length})</h2>
              <p className="text-sm text-gray-500 mb-4">
                Controle os espaços que já vêm na página Guia CE. Você pode editar, tirar do ar ou publicar de novo sem apagar o conteúdo.
              </p>
              <div className="space-y-2">
                {staticSafeSpaces.map((space) => {
                  const form = getSafeSpaceForm(space);
                  return (
                    <div key={space.slug} className="bg-white border rounded-lg px-4 py-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{form.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {form.category} · {form.city}/{form.state} · {form.status === "published" ? "Publicado" : "Fora do ar"}
                          </p>
                        </div>
                        <span className={`flex-shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold ${form.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                          {form.status === "published" ? "Publicado" : "Oculto"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => setSafeSpaceForm(form)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSafeSpace(space)}
                          className={`px-3 py-1.5 text-xs font-medium border rounded-lg ${
                            form.status === "published"
                              ? "text-amber-700 border-amber-200 hover:bg-amber-50"
                              : "text-green-700 border-green-200 hover:bg-green-50"
                          }`}
                        >
                          {form.status === "published" ? "Tirar do ar" : "Publicar"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4 h-fit lg:sticky lg:top-6">
              {safeSpaceForm ? (
                <>
                  <div>
                    <h2 className="text-xl font-bold">Editar espaço</h2>
                    <p className="text-xs text-gray-400 mt-1">{safeSpaceForm.slug}</p>
                  </div>
                  <input value={safeSpaceForm.name} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Nome do espaço" />
                  <textarea value={safeSpaceForm.description} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, description: e.target.value })} rows={4} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Descrição" />
                  <input value={safeSpaceForm.address} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Endereço" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input value={safeSpaceForm.city} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Cidade" />
                    <input value={safeSpaceForm.state} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, state: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="UF" />
                  </div>
                  <input value={safeSpaceForm.image} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="URL da imagem" />
                  <input value={safeSpaceForm.mapUrl ?? ""} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, mapUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Link de rota ou mapa" />
                  <input value={safeSpaceForm.phone ?? ""} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Telefone" />
                  <input value={safeSpaceForm.website ?? ""} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, website: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Site ou Instagram" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <select value={safeSpaceForm.category} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, category: e.target.value as SafeSpaceCategory })} className="w-full px-4 py-2 border rounded-lg text-sm">
                      {safeSpaceCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <select value={safeSpaceForm.status} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, status: e.target.value as SafeSpaceOverride["status"] })} className="w-full px-4 py-2 border rounded-lg text-sm">
                      <option value="published">Publicado</option>
                      <option value="hidden">Fora do ar</option>
                    </select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="number" step="0.1" min="0" max="5" value={safeSpaceForm.rating} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, rating: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Nota" />
                    <input type="number" min="0" value={safeSpaceForm.reviews} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, reviews: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Avaliações" />
                  </div>
                  <input value={safeSpaceForm.tags.join(", ")} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Tags separadas por vírgula" />
                  <input value={safeSpaceForm.badges.join(", ")} onChange={(e) => setSafeSpaceForm({ ...safeSpaceForm, badges: e.target.value.split(",").map((badge) => badge.trim()).filter(Boolean) })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Badges: geral, trans, mental..." />
                  <button onClick={() => saveSafeSpaceOverride(safeSpaceForm)} disabled={isPublishing || !safeSpaceForm.name.trim()} className="w-full py-3 bg-pink-600 text-white rounded-lg font-semibold text-sm disabled:opacity-50">
                    {isPublishing ? "Salvando..." : "Salvar espaço"}
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Selecione um espaço curado para editar.
                </div>
              )}
            </div>
          </div>

          <RecordEditor title="Novos espaços do guia" form={placeForm} setForm={setPlaceForm} records={places} onSave={() => saveRecord("places", placeForm)} onDelete={(id) => deleteRecord("places", id)} isSaving={isPublishing} />
        </div>
      )}

      {activeTab === "facebook" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-bold">Post manual para o Facebook</h2>
              <p className="text-sm text-gray-500 mt-1">Escolha o artigo, copie o texto pronto e cole na pagina do Facebook.</p>
            </div>
            <label className="block text-sm font-medium text-gray-700">Escolha um artigo para gerar a chamada</label>
            <select
              className="w-full px-4 py-2 border rounded-lg text-sm"
              onChange={(e) => {
                const article = articles.find((item) => item.id === e.target.value);
                if (!article) return;
                const articleUrl = `https://portalgbtqia.vercel.app/artigos/${article.slug ?? slugify(article.title)}`;
                setFacebookArticleUrl(articleUrl);
                setFacebookText(`${article.title}\n\n${article.excerpt ?? ""}\n\n#LGBTQIA #Nordeste #Diversidade`);
              }}
            >
              <option value="">Selecionar artigo</option>
              {articles.map((article) => <option key={article.id} value={article.id}>{article.title}</option>)}
            </select>
            <textarea value={facebookText} onChange={(e) => setFacebookText(e.target.value)} rows={10} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Texto para publicar no Facebook" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link da postagem no portal</label>
              <input value={facebookArticleUrl} onChange={(e) => setFacebookArticleUrl(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="https://portalgbtqia.vercel.app/artigos/..." />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => copyFacebookText(`${facebookText.trim()}\n\n${facebookArticleUrl.trim()}`.trim(), "Texto completo copiado. Agora e so colar no Facebook.")}
                className="px-5 py-2 bg-pink-600 text-white rounded-lg text-sm font-semibold hover:bg-pink-700 transition-colors"
              >
                Copiar texto + link
              </button>
              <button type="button" onClick={() => copyFacebookText(facebookText, "Texto copiado.")} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                Copiar texto
              </button>
              <button type="button" onClick={() => copyFacebookText(facebookArticleUrl, "Link copiado.")} className="px-5 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50">
                Copiar link
              </button>
              <a href="https://www.facebook.com/profile.php?id=1202909452904232" target="_blank" rel="noopener noreferrer" className="px-5 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50">
                Abrir pagina
              </a>
            </div>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3">Previa</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 border rounded-lg p-4 min-h-64">{facebookText || "A previa do post aparece aqui."}{facebookArticleUrl ? `\n\n${facebookArticleUrl}` : ""}</pre>
          </div>
        </div>
      )}
    </main>
  );
}

function RecordEditor({
  title,
  form,
  setForm,
  records,
  onSave,
  onDelete,
  isSaving,
}: {
  title: string;
  form: EditableRecord;
  setForm: (value: EditableRecord) => void;
  records: EditableRecord[];
  onSave: () => void;
  onDelete: (id: string) => void;
  isSaving: boolean;
}) {
  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6">
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold">{form.id ? `Editar ${title}` : `Novo item - ${title}`}</h2>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Titulo" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Descricao" />
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="URL da imagem" />
        <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Link externo" />
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Categoria" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm">
            <option value="published">Publicado</option>
            <option value="draft">Rascunho</option>
            <option value="approved">Aprovado</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={onSave} disabled={isSaving || !form.title.trim()} className="flex-1 py-3 bg-pink-600 text-white rounded-lg font-semibold text-sm disabled:opacity-50">
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
          {form.id && (
            <button onClick={() => setForm({ ...emptyRecord, category: form.category })} className="px-5 py-3 border rounded-lg text-sm font-semibold hover:bg-gray-50">
              Novo
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">{title} ({records.length})</h2>
        <div className="space-y-2">
          {records.map((record) => (
            <div key={record.id} className="bg-white border rounded-lg px-4 py-3 shadow-sm">
              <p className="text-sm font-medium text-gray-800 truncate">{record.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{record.category} · {record.status}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setForm(record)} className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">Editar</button>
                <button onClick={() => onDelete(record.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Apagar</button>
              </div>
            </div>
          ))}
          {records.length === 0 && <p className="text-gray-400 text-sm">Nenhum item ainda.</p>}
        </div>
      </div>
    </div>
  );
}
