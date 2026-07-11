import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { safeSpaceCategories } from '@/mocks/safeSpaces';

const initialForm = {
  name: '',
  category: safeSpaceCategories[0],
  address: '',
  city: 'Fortaleza',
  state: 'CE',
  description: '',
  website: '',
  contactName: '',
  contactEmail: '',
};

export default function SafeSpaceSubmitPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  function change(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      await addDoc(collection(db, 'safe_space_suggestions'), {
        name: form.name.trim(),
        category: form.category,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        description: form.description.trim(),
        website: form.website.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim().toLowerCase(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setForm(initialForm);
      setResult({ success: true, message: 'Indicação enviada! A curadoria verificará os dados antes da publicação.' });
    } catch (error) {
      console.error('Erro ao indicar espaço:', error);
      setResult({ success: false, message: 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full rounded-lg border border-dark-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200';

  return (
    <main className="min-h-screen bg-surface-50 pt-20">
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <Link to="/guia-fortaleza" className="mb-6 inline-flex items-center gap-1 text-sm text-dark-500 hover:text-primary-500">
          <i className="ri-arrow-left-line" aria-hidden="true" /> Voltar ao guia
        </Link>
        <h1 className="font-playfair text-3xl font-bold text-dark-800">Indicar um espaço seguro</h1>
        <p className="mt-2 text-sm leading-relaxed text-dark-500">
          Compartilhe um local acolhedor para a comunidade LGBTQIA+. Toda indicação passa por verificação.
        </p>

        {result && (
          <div role="status" className={'mt-6 rounded-xl border p-4 text-sm ' + (result.success ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700')}>
            {result.message}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-dark-100 bg-white p-6 md:p-8">
          <Field label="Nome do espaço *" htmlFor="space-name">
            <input id="space-name" value={form.name} onChange={(e) => change('name', e.target.value)} required minLength={3} maxLength={120} className={inputClass} />
          </Field>
          <Field label="Categoria *" htmlFor="space-category">
            <select id="space-category" value={form.category} onChange={(e) => change('category', e.target.value)} className={inputClass}>
              {safeSpaceCategories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </Field>
          <Field label="Endereço *" htmlFor="space-address">
            <input id="space-address" value={form.address} onChange={(e) => change('address', e.target.value)} required minLength={5} maxLength={200} placeholder="Rua, número e bairro" className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
            <Field label="Cidade *" htmlFor="space-city">
              <input id="space-city" value={form.city} onChange={(e) => change('city', e.target.value)} required minLength={2} maxLength={80} className={inputClass} />
            </Field>
            <Field label="UF *" htmlFor="space-state">
              <input id="space-state" value={form.state} onChange={(e) => change('state', e.target.value)} required minLength={2} maxLength={2} className={inputClass} />
            </Field>
          </div>
          <Field label="Por que você recomenda este espaço? *" htmlFor="space-description">
            <textarea id="space-description" value={form.description} onChange={(e) => change('description', e.target.value)} required minLength={10} maxLength={1000} rows={5} className={inputClass + ' resize-y'} />
            <p className="mt-1 text-right text-xs text-dark-400">{form.description.length}/1000</p>
          </Field>
          <Field label="Site ou rede social" htmlFor="space-website">
            <input id="space-website" type="url" value={form.website} onChange={(e) => change('website', e.target.value)} maxLength={300} placeholder="https://..." className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Seu nome" htmlFor="contact-name">
              <input id="contact-name" value={form.contactName} onChange={(e) => change('contactName', e.target.value)} maxLength={100} className={inputClass} />
            </Field>
            <Field label="Seu e-mail *" htmlFor="contact-email">
              <input id="contact-email" type="email" value={form.contactEmail} onChange={(e) => change('contactEmail', e.target.value)} required maxLength={200} className={inputClass} />
            </Field>
          </div>
          <p className="text-xs leading-relaxed text-dark-400">Seu e-mail será usado apenas para confirmar informações e não será exibido publicamente.</p>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <><i className="ri-loader-4-line animate-spin" aria-hidden="true" /> Enviando...</> : <><i className="ri-send-plane-line" aria-hidden="true" /> Enviar indicação</>}
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-dark-700">{label}</label>
      {children}
    </div>
  );
}
