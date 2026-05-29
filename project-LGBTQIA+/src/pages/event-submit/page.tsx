import { useState } from 'react';
import { Link } from 'react-router-dom';

const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;

export default function EventSubmitPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    city: 'Fortaleza',
    state: 'CE',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    image_url: '',
    source_url: '',
    organizer: '',
    contact_email: '',
    contact_phone: '',
    price_info: 'Gratuito',
  });
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');
  const [scrapeSuccess, setScrapeSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    event?: Record<string, unknown>;
    ai_actions?: Record<string, unknown>;
    error?: string;
  } | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    setScrapeError('');
    setScrapeSuccess(false);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/process-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_url: scrapeUrl.trim(), auto_scrape: true }),
      });
      const data = await res.json();

      if (!res.ok) {
        setScrapeError(data.error || 'Não foi possível analisar este link.');
      } else if (data.scraped && data.data) {
        const d = data.data as Record<string, string | undefined>;
        setForm((prev) => ({
          ...prev,
          title: d.title || prev.title,
          description: d.description || prev.description,
          image_url: d.image_url || prev.image_url,
          source_url: d.source_url || prev.source_url,
          start_date: d.start_date || prev.start_date,
          end_date: d.end_date || prev.end_date,
          start_time: d.start_time || prev.start_time,
          end_time: d.end_time || prev.end_time,
          city: d.city || prev.city,
          state: d.state || prev.state,
          location: d.location || prev.location,
        }));
        setScrapeSuccess(true);
      }
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : 'Erro de conexão');
    } finally {
      setScraping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || form.title.trim().length < 3) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/process-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          location: form.location.trim() || undefined,
          address: form.address.trim() || undefined,
          city: form.city.trim() || undefined,
          state: form.state.trim() || undefined,
          start_date: form.start_date || undefined,
          end_date: form.end_date || undefined,
          start_time: form.start_time || undefined,
          end_time: form.end_time || undefined,
          image_url: form.image_url.trim() || undefined,
          source_url: form.source_url.trim() || undefined,
          organizer: form.organizer.trim() || undefined,
          contact_email: form.contact_email.trim() || undefined,
          contact_phone: form.contact_phone.trim() || undefined,
          price_info: form.price_info.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ success: false, error: data.error || 'Erro ao processar evento' });
      } else {
        setResult({ success: true, event: data.event, ai_actions: data.ai_actions });
        setForm({
          title: '',
          description: '',
          location: '',
          address: '',
          city: 'Fortaleza',
          state: 'CE',
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
          image_url: '',
          source_url: '',
          organizer: '',
          contact_email: '',
          contact_phone: '',
          price_info: 'Gratuito',
        });
        setScrapeUrl('');
      }
    } catch (err) {
      setResult({ success: false, error: err instanceof Error ? err.message : 'Erro de conexão' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-50">
      <section className="pt-20 md:pt-24 pb-8 md:pb-12 bg-white border-b border-dark-100">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-14">
          <Link
            to="/eventos"
            className="inline-flex items-center gap-1 text-sm text-dark-500 hover:text-primary-400 transition-colors mb-6"
          >
            <i className="ri-arrow-left-line"></i> Voltar para eventos
          </Link>

          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-dark-800">
            Indicar um evento
          </h1>
          <p className="mt-2 text-sm md:text-base text-dark-500">
            Cole o link do Instagram, Facebook ou X e nossa IA extrai automaticamente as informações. Você pode revisar e completar antes de publicar.
          </p>

          {/* Link scraper */}
          <div className="mt-8 bg-dark-50 rounded-xl p-5 border border-dark-100">
            <label className="block text-sm font-medium text-dark-700 mb-2">
              <i className="ri-link mr-1"></i> Link do evento (Instagram, Facebook, X, site)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="flex-1 px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              />
              <button
                onClick={handleScrape}
                disabled={scraping || !scrapeUrl.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-dark-700 text-white hover:bg-dark-800 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {scraping ? (
                  <><i className="ri-loader-4-line animate-spin"></i> Analisando...</>
                ) : (
                  <><i className="ri-magic-line"></i> Analisar link</>
                )}
              </button>
            </div>
            {scrapeError && (
              <p className="mt-2 text-xs text-rose-600">{scrapeError}</p>
            )}
            {scrapeSuccess && (
              <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                <i className="ri-checkbox-circle-line"></i> Dados extraídos com sucesso! Revise abaixo antes de publicar.
              </p>
            )}
            <p className="mt-2 text-xs text-dark-400">
              Funciona com posts públicos. Para links privados, preencha manualmente.
            </p>
          </div>

          {result && (
            <div className={`mt-6 rounded-xl p-5 ${result.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
              {result.success ? (
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                    <i className="ri-checkbox-circle-line text-xl"></i>
                    Evento publicado com sucesso!
                  </div>
                  <p className="text-sm text-emerald-600 mb-3">
                    A IA processou e enriqueceu seu evento automaticamente.
                  </p>
                  {result.ai_actions && (
                    <div className="bg-white rounded-lg p-3 border border-emerald-100 mb-3">
                      <p className="text-xs font-semibold text-dark-600 mb-1">Ações da IA:</p>
                      <ul className="text-xs text-dark-500 space-y-0.5">
                        <li className="flex items-center gap-1">
                          <i className="ri-check-line text-emerald-500"></i> Slug gerado automaticamente
                        </li>
                        <li className="flex items-center gap-1">
                          <i className="ri-check-line text-emerald-500"></i> Categoria detectada: <span className="font-medium text-dark-700">{String(result.ai_actions.category_detected || '')}</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <i className="ri-check-line text-emerald-500"></i> Tags extraídas: <span className="font-medium text-dark-700">{Array.isArray(result.ai_actions.tags_extracted) ? result.ai_actions.tags_extracted.join(', ') : ''}</span>
                        </li>
                        {result.ai_actions.short_description_generated && (
                          <li className="flex items-center gap-1">
                            <i className="ri-check-line text-emerald-500"></i> Resumo gerado automaticamente
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  {result.event && (
                    <Link
                      to={`/eventos/${String((result.event as Record<string, string>).slug || '')}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary-400 hover:text-primary-500 transition-colors"
                    >
                      Ver evento publicado <i className="ri-arrow-right-line"></i>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-700">
                  <i className="ri-error-warning-line text-xl"></i>
                  <span className="text-sm">{result.error}</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" data-readdy-form>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Título do evento <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                minLength={3}
                placeholder="Ex: Parada LGBT de Fortaleza 2026"
                className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Descrição completa
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Descreva o evento com detalhes..."
                className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 resize-none"
              />
              <p className="mt-1 text-xs text-dark-400 text-right">{form.description.length}/500</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Local</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Ex: Av. Beira Mar"
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Endereço</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Rua, número, bairro"
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Estado</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  maxLength={2}
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Data início</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Data fim</label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Hora início</label>
                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Hora fim</label>
                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Preço</label>
                <input
                  type="text"
                  name="price_info"
                  value={form.price_info}
                  onChange={(e) => handleChange('price_info', e.target.value)}
                  placeholder="Gratuito ou valor"
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Organizador</label>
                <input
                  type="text"
                  name="organizer"
                  value={form.organizer}
                  onChange={(e) => handleChange('organizer', e.target.value)}
                  placeholder="Nome do coletivo/ONG"
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">E-mail de contato</label>
                <input
                  type="email"
                  name="email"
                  value={form.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  placeholder="contato@evento.com.br"
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Telefone</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  placeholder="(85) 99999-0000"
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">URL da imagem</label>
                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Link do evento (fonte)</label>
                <input
                  type="url"
                  name="source_url"
                  value={form.source_url}
                  onChange={(e) => handleChange('source_url', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !form.title.trim() || form.title.trim().length < 3}
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <><i className="ri-loader-4-line animate-spin"></i> Processando com IA...</>
                ) : (
                  <><i className="ri-magic-line"></i> Enviar e processar com IA</>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}