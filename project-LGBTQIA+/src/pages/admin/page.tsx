import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const publish = async () => {
    if (!title) return alert("Título obrigatório");
    setLoading(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await addDoc(collection(db, "articles"), {
      title, slug, excerpt,
      content: `<p>${excerpt}</p><p>Fonte: <a href="${url}">${url}</a></p><p><em>Por Fernando Mário da Silva Martins (@nando_apollo)</em></p>`,
      category: "artigos", author: "Fernando Mário da Silva Martins",
      published_at: serverTimestamp(), status: "published",
    });
    alert("Publicado com sucesso!");
    setLoading(false);
  };

  return (
    <div style={{maxWidth: 800, margin: '40px auto', padding: 20}}>
      <h1>Painel Admin - Fernando</h1>
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Cole o link aqui" style={{width:'100%',padding:10,margin:'10px 0'}} />
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" style={{width:'100%',padding:10,margin:'10px 0'}} />
      <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="Resumo" style={{width:'100%',padding:10,margin:'10px 0',height:100}} />
      <button onClick={publish} disabled={loading} style={{padding:'10px 20px',background:'green',color:'white',border:'none',cursor:'pointer'}}>
        {loading ? 'Publicando...' : 'PUBLICAR'}
      </button>
    </div>
  );
}
