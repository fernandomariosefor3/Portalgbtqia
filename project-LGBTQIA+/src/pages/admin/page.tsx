import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../lib/auth";

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  published_at: any;
}

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("artigos");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = async () => {
    const q = query(collection(db, "articles"), orderBy("published_at", "desc"));
    const snap = await getDocs(q);
    setArticles(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ArticleItem)));
  };

  useEffect(() => { loadArticles(); }, []);

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
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await addDoc(collection(db, "articles"), {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: `<p class="lead">${excerpt.trim()}</p><p>Fonte: <a href="${url}" target="_blank" rel="noopener">${url}</a></p><p><em>Publicado por Fernando Mário da Silva Martins (@nando_apollo)</em></p>`,
        category,
        subcategory: "",
        author: "Fernando Mário da Silva Martins",
        authorRole: "Fundador",
        published_at: serverTimestamp(),
        status: "published",
        featured_image: image.trim(),
        tags: [],
        views: 0,
        source_url: url.trim(),
      });

      setMessage({ type: "success", text: "✅ Artigo publicado com sucesso!" });
      setUrl("");
      setTitle("");
      setExcerpt("");
      setImage("");
    } catch (e: any) {
      setMessage({ type: "error", text: `Erro ao publicar: ${e?.message || e}` });
    }
    setIsPublishing(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-1">Painel Admin</h1>
      <p className="text-gray-500 mb-8">Olá, Fernando! Cole o link e publique.</p>

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

        {/* Feedback */}
        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="artigos">Artigos</option>
            <option value="cultura">Cultura</option>
            <option value="saude">Saúde</option>
            <option value="familia">Família</option>
            <option value="politica">Política</option>
          </select>
        </div>

        {/* Publicar */}
        <button
          onClick={publish}
          disabled={isPublishing || !title.trim()}
          className="w-full py-3 bg-pink-600 text-white rounded-lg font-semibold text-sm hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {isPublishing ? "Publicando..." : "Publicar artigo"}
        </button>
      </div>

      {/* Lista de artigos publicados */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Artigos publicados ({articles.length})</h2>
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
    </main>
  );
}
