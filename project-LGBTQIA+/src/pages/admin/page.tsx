import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("artigos");

  const fetchLink = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setPreview(data.data);
        setTitle(data.data.title || "");
        setExcerpt(data.data.description || "");
        setImage(data.data.image?.url || "");
      }
    } catch (e) {
      alert("Erro ao buscar. Cole manualmente.");
    }
    setLoading(false);
  };

  const publish = async () => {
    if (!title) return alert("Título obrigatório");
    setLoading(true);
    try {
      const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await addDoc(collection(db, "articles"), {
        title, slug, excerpt,
        content: `<p class="lead">${excerpt}</p><p>Fonte: <a href="${url}" target="_blank">${url}</a></p><p><em>Publicado por Fernando Mário da Silva Martins (@nando_apollo)</em></p>`,
        category, subcategory: "", author: "Fernando Mário da Silva Martins",
        authorRole: "Fundador", published_at: serverTimestamp(),
        status: "published", featured_image: image, tags: [], views: 0, source_url: url,
      });
      alert("Publicado!");
      setUrl(""); setTitle(""); setExcerpt(""); setImage(""); setPreview(null);
    } catch (e) { alert("Erro: " + e); }
    setLoading(false);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Painel Admin</h1>
      <p className="text-gray-600 mb-8">Olá, Fernando! Cole um link para publicar.</p>
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Link da matéria</label>
          <div className="flex gap-2">
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="flex-1 px-4 py-2 border rounded-lg" />
            <button onClick={fetchLink} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg">{loading ? "..." : "Buscar"}</button>
          </div>
        </div>
        {preview && (
          <div className="border-t pt-4 space-y-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Título" />
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg" placeholder="Resumo" />
            <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="URL da imagem" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="artigos">Artigos</option><option value="cultura">Cultura</option><option value="saude">Saúde</option><option value="familia">Família</option>
            </select>
            <button onClick={publish} disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold">{loading ? "Publicando..." : "Publicar"}</button>
          </div>
        )}
      </div>
    </main>
  );
}