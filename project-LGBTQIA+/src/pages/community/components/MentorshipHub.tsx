import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import {
  findMentors,
  joinSupportGroup,
  mentorshipTopics,
  requestMentorship,
  saveMentorProfile,
  type MentorProfile,
  type MentorshipTopic,
} from '@/lib/mentorship';

const groups = [
  { id: 'coming-out', name: 'Coming out', icon: 'ri-door-open-line', description: 'Acolhimento para quem está pensando em se assumir ou vivendo esse processo.' },
  { id: 'familia-acolhedora', name: 'Família acolhedora', icon: 'ri-home-heart-line', description: 'Trocas entre pessoas LGBTQIA+ e familiares que desejam construir apoio.' },
  { id: 'transicao-genero', name: 'Transição de gênero', icon: 'ri-transgender-line', description: 'Rede de experiências sobre transição social, direitos, cuidado e pertencimento.' },
  { id: 'empregabilidade', name: 'Empregabilidade LGBTQIA+', icon: 'ri-briefcase-4-line', description: 'Currículo, entrevistas, carreira, direitos e ambientes de trabalho inclusivos.' },
];

const emptyMentor = {
  displayName: '',
  identity: '',
  region: '',
  topics: [] as MentorshipTopic[],
  bio: '',
  availability: '',
};

export default function MentorshipHub() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'find' | 'mentor'>('find');
  const [mentorForm, setMentorForm] = useState(emptyMentor);
  const [preferences, setPreferences] = useState({ identity: '', region: '', topics: [] as MentorshipTopic[] });
  const [matches, setMatches] = useState<Array<{ mentor: MentorProfile; score: number }>>([]);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [intro, setIntro] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; text: string } | null>(null);

  function toggleTopic(current: MentorshipTopic[], topic: MentorshipTopic) {
    return current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic];
  }

  async function submitMentor(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      await saveMentorProfile(mentorForm);
      setFeedback({ success: true, text: 'Perfil de mentor enviado. Você já pode aparecer em matches compatíveis.' });
    } catch (error) {
      setFeedback({ success: false, text: error instanceof Error ? error.message : 'Não foi possível salvar o perfil.' });
    } finally {
      setBusy(false);
    }
  }

  async function search(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const results = await findMentors(preferences);
      setMatches(results);
      if (!results.length) setFeedback({ success: false, text: 'Ainda não há mentor compatível. Tente ampliar a região ou os temas.' });
    } catch (error) {
      setFeedback({ success: false, text: error instanceof Error ? error.message : 'Não foi possível buscar mentores.' });
    } finally {
      setBusy(false);
    }
  }

  async function sendRequest() {
    if (!selectedMentor || intro.trim().length < 10) {
      setFeedback({ success: false, text: 'Escreva uma apresentação com pelo menos 10 caracteres.' });
      return;
    }
    setBusy(true);
    try {
      await requestMentorship(selectedMentor, preferences.topics, intro.trim());
      setSelectedMentor(null);
      setIntro('');
      setFeedback({ success: true, text: 'Solicitação enviada. Seus dados de contato não foram expostos.' });
    } catch (error) {
      setFeedback({ success: false, text: error instanceof Error ? error.message : 'Não foi possível enviar.' });
    } finally {
      setBusy(false);
    }
  }

  async function join(group: (typeof groups)[number]) {
    setBusy(true);
    try {
      await joinSupportGroup(group.id, group.name);
      setFeedback({ success: true, text: 'Entrada registrada no grupo “' + group.name + '”.' });
    } catch (error) {
      setFeedback({ success: false, text: error instanceof Error ? error.message : 'Não foi possível entrar no grupo.' });
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100';

  return (
    <section className="bg-dark-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Conexão humana real</span>
          <h2 className="mt-2 font-playfair text-3xl font-bold text-dark-800 md:text-4xl">Mentoria e acolhimento</h2>
          <p className="mt-3 text-sm leading-relaxed text-dark-500 md:text-base">Encontre alguém com vivências próximas ou compartilhe sua experiência como mentor. O contato começa dentro da plataforma, sem divulgar telefone ou e-mail.</p>
        </div>

        {!user ? (
          <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-6">
            <h3 className="text-lg font-semibold text-dark-800">Entre para acessar a rede</h3>
            <p className="mt-2 text-sm text-dark-500">O login protege os perfis e reduz abordagens abusivas.</p>
            <Link to="/login" className="mt-4 inline-flex rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white">Entrar ou criar conta</Link>
          </div>
        ) : (
          <>
            {feedback && <div role="status" className={'mt-6 rounded-xl border p-4 text-sm ' + (feedback.success ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700')}>{feedback.text}</div>}
            <div className="mt-8 flex flex-wrap gap-2">
              <button type="button" onClick={() => setMode('find')} className={'rounded-full px-5 py-2.5 text-sm font-semibold ' + (mode === 'find' ? 'bg-primary-500 text-white' : 'border border-dark-200 bg-white text-dark-600')}>Encontrar mentor</button>
              <button type="button" onClick={() => setMode('mentor')} className={'rounded-full px-5 py-2.5 text-sm font-semibold ' + (mode === 'mentor' ? 'bg-primary-500 text-white' : 'border border-dark-200 bg-white text-dark-600')}>Quero ser mentor</button>
            </div>

            {mode === 'find' ? (
              <form onSubmit={search} className="mt-5 rounded-2xl border border-dark-100 bg-white p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={preferences.identity} onChange={(e) => setPreferences({ ...preferences, identity: e.target.value })} placeholder="Como você se identifica? (opcional)" className={inputClass} />
                  <input value={preferences.region} onChange={(e) => setPreferences({ ...preferences, region: e.target.value })} required placeholder="Cidade ou região" className={inputClass} />
                </div>
                <TopicPicker selected={preferences.topics} onToggle={(topic) => setPreferences({ ...preferences, topics: toggleTopic(preferences.topics, topic) })} />
                <button disabled={busy || !preferences.topics.length} className="mt-5 rounded-full bg-dark-800 px-7 py-3 text-sm font-semibold text-white disabled:opacity-50">Buscar compatibilidade</button>
              </form>
            ) : (
              <form onSubmit={submitMentor} className="mt-5 space-y-4 rounded-2xl border border-dark-100 bg-white p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={mentorForm.displayName} onChange={(e) => setMentorForm({ ...mentorForm, displayName: e.target.value })} required minLength={2} maxLength={80} placeholder="Nome de exibição" className={inputClass} />
                  <input value={mentorForm.identity} onChange={(e) => setMentorForm({ ...mentorForm, identity: e.target.value })} required maxLength={100} placeholder="Identidade ou vivência" className={inputClass} />
                  <input value={mentorForm.region} onChange={(e) => setMentorForm({ ...mentorForm, region: e.target.value })} required maxLength={100} placeholder="Cidade ou região" className={inputClass} />
                  <input value={mentorForm.availability} onChange={(e) => setMentorForm({ ...mentorForm, availability: e.target.value })} required maxLength={100} placeholder="Disponibilidade, ex.: noites" className={inputClass} />
                </div>
                <textarea value={mentorForm.bio} onChange={(e) => setMentorForm({ ...mentorForm, bio: e.target.value })} required minLength={30} maxLength={600} rows={4} placeholder="Conte brevemente sua experiência e como deseja apoiar." className={inputClass} />
                <TopicPicker selected={mentorForm.topics} onToggle={(topic) => setMentorForm({ ...mentorForm, topics: toggleTopic(mentorForm.topics, topic) })} />
                <label className="flex items-start gap-2 text-xs leading-relaxed text-dark-500"><input type="checkbox" required className="mt-0.5 accent-primary-500" /> Confirmo que esta é uma atividade voluntária de escuta e orientação entre pares, não atendimento médico ou psicológico.</label>
                <button disabled={busy || !mentorForm.topics.length} className="rounded-full bg-primary-500 px-7 py-3 text-sm font-semibold text-white disabled:opacity-50">Cadastrar como mentor</button>
              </form>
            )}

            {matches.length > 0 && (
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {matches.map(({ mentor, score }) => (
                  <article key={mentor.id} className="rounded-2xl border border-dark-100 bg-white p-5">
                    <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-dark-800">{mentor.displayName}</h3><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{score} compat.</span></div>
                    <p className="mt-1 text-xs text-dark-400">{mentor.identity} · {mentor.region}</p>
                    <p className="mt-3 text-sm leading-relaxed text-dark-500">{mentor.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-2">{mentor.topics.map((topic) => <span key={topic} className="rounded-full bg-primary-50 px-2.5 py-1 text-xs text-primary-600">{topic}</span>)}</div>
                    <p className="mt-3 text-xs text-dark-500">Disponibilidade: {mentor.availability}</p>
                    <button type="button" onClick={() => setSelectedMentor(mentor)} className="mt-4 rounded-full bg-dark-800 px-5 py-2.5 text-xs font-semibold text-white">Solicitar mentoria</button>
                  </article>
                ))}
              </div>
            )}

            {selectedMentor && (
              <div className="mt-5 rounded-2xl border border-primary-100 bg-white p-5">
                <h3 className="font-semibold text-dark-800">Apresente-se para {selectedMentor.displayName}</h3>
                <textarea value={intro} onChange={(e) => setIntro(e.target.value)} maxLength={600} rows={4} className={inputClass + ' mt-3'} placeholder="Explique brevemente o apoio que procura. Evite telefone, endereço e outros dados sensíveis." />
                <div className="mt-3 flex gap-2"><button type="button" disabled={busy} onClick={sendRequest} className="rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white">Enviar solicitação</button><button type="button" onClick={() => setSelectedMentor(null)} className="rounded-full border border-dark-200 px-6 py-2.5 text-sm text-dark-600">Cancelar</button></div>
              </div>
            )}
          </>
        )}

        <div className="mt-12">
          <h3 className="font-playfair text-2xl font-bold text-dark-800">Grupos de apoio por tema</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {groups.map((group) => (
              <article key={group.id} className="rounded-2xl border border-dark-100 bg-white p-5">
                <i className={group.icon + ' text-2xl text-primary-500'} aria-hidden="true" />
                <h4 className="mt-3 font-semibold text-dark-800">{group.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-dark-500">{group.description}</p>
                <button type="button" disabled={busy || !user} onClick={() => join(group)} className="mt-4 rounded-full border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-600 disabled:opacity-50">Participar do grupo</button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TopicPicker({ selected, onToggle }: { selected: MentorshipTopic[]; onToggle: (topic: MentorshipTopic) => void }) {
  return <fieldset className="mt-4"><legend className="text-sm font-semibold text-dark-700">Temas de interesse</legend><div className="mt-3 flex flex-wrap gap-2">{mentorshipTopics.map((topic) => <label key={topic} className={'cursor-pointer rounded-full border px-3 py-2 text-xs font-medium ' + (selected.includes(topic) ? 'border-primary-500 bg-primary-500 text-white' : 'border-dark-200 text-dark-600')}><input type="checkbox" checked={selected.includes(topic)} onChange={() => onToggle(topic)} className="sr-only" />{topic}</label>)}</div></fieldset>;
}
