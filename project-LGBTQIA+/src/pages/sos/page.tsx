import { useEffect, useMemo, useRef, useState } from 'react';

type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
};

type RiskZone = {
  id: string;
  name: string;
  city: string;
  radius: number;
  latitude: number | null;
  longitude: number | null;
  reason: string;
};

type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: 'sos' | 'risk' | 'content' | 'badge';
  createdAt: string;
};

type PositionState = {
  latitude: number;
  longitude: number;
  accuracy: number;
  updatedAt: string;
};

const CONTACTS_KEY = 'portalgbtqia:sos-contacts';
const ZONES_KEY = 'portalgbtqia:risk-zones';
const NOTIFICATIONS_KEY = 'portalgbtqia:notifications';

const defaultZones: RiskZone[] = [
  {
    id: 'praia-iracema-noite',
    name: 'Entorno movimentado da Praia de Iracema',
    city: 'Fortaleza',
    radius: 650,
    latitude: -3.7219,
    longitude: -38.5137,
    reason: 'Atenção redobrada em deslocamentos noturnos e saída de eventos.',
  },
  {
    id: 'centro-transporte',
    name: 'Corredores de transporte do Centro',
    city: 'Fortaleza',
    radius: 800,
    latitude: -3.7305,
    longitude: -38.5267,
    reason: 'Relatos comunitários recomendam circular em grupo e manter rota compartilhada.',
  },
];

const seedNotifications: AppNotification[] = [
  {
    id: 'seed-health',
    title: 'Saúde e cuidado',
    message: 'Novos guias sobre PrEP, PEP e saúde mental LGBTQIA+ estão disponíveis.',
    type: 'content',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-safe-spaces',
    title: 'Espaços seguros',
    message: 'O guia de Fortaleza ganhou novos pontos de acolhimento e cultura.',
    type: 'content',
    createdAt: new Date().toISOString(),
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function formatPhoneForSms(phone: string) {
  return phone.replace(/[^\d+]/g, '');
}

function distanceInMeters(from: PositionState, zone: RiskZone) {
  if (zone.latitude === null || zone.longitude === null) return Number.POSITIVE_INFINITY;
  const earthRadius = 6371000;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (zone.latitude * Math.PI) / 180;
  const deltaLat = ((zone.latitude - from.latitude) * Math.PI) / 180;
  const deltaLon = ((zone.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function buildMapsUrl(position: PositionState | null) {
  if (!position) return '';
  return `https://www.google.com/maps?q=${position.latitude},${position.longitude}`;
}

export default function SosPage() {
  const [position, setPosition] = useState<PositionState | null>(null);
  const [locationStatus, setLocationStatus] = useState('Localização ainda não ativada.');
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => readStorage(CONTACTS_KEY, []));
  const [contactForm, setContactForm] = useState({ name: '', phone: '' });
  const [riskZones, setRiskZones] = useState<RiskZone[]>(() => readStorage(ZONES_KEY, defaultZones));
  const [zoneForm, setZoneForm] = useState({ name: '', city: 'Fortaleza', radius: 500, reason: '' });
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    readStorage(NOTIFICATIONS_KEY, seedNotifications),
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => writeStorage(CONTACTS_KEY, contacts), [contacts]);
  useEffect(() => writeStorage(ZONES_KEY, riskZones), [riskZones]);
  useEffect(() => writeStorage(NOTIFICATIONS_KEY, notifications), [notifications]);

  const nearbyZones = useMemo(() => {
    if (!position) return [];
    return riskZones
      .map((zone) => ({ zone, distance: distanceInMeters(position, zone) }))
      .filter((item) => item.distance <= item.zone.radius)
      .sort((a, b) => a.distance - b.distance);
  }, [position, riskZones]);

  useEffect(() => {
    if (nearbyZones.length === 0) return;
    const zone = nearbyZones[0].zone;
    const notification: AppNotification = {
      id: `risk-${zone.id}-${Date.now()}`,
      title: 'Alerta de zona de atenção',
      message: `Você está perto de ${zone.name}. ${zone.reason}`,
      type: 'risk',
      createdAt: new Date().toISOString(),
    };
    setNotifications((current) => [notification, ...current].slice(0, 12));
  }, [nearbyZones]);

  const emergencyMessage = useMemo(() => {
    const mapUrl = buildMapsUrl(position);
    return [
      'SOS Portal LGBTQIA+ Nordeste: preciso de ajuda agora.',
      position ? `Minha localização: ${mapUrl}` : 'Minha localização ainda não foi capturada.',
      nearbyZones[0] ? `Zona de atenção próxima: ${nearbyZones[0].zone.name}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }, [nearbyZones, position]);

  function addNotification(title: string, message: string, type: AppNotification['type']) {
    setNotifications((current) =>
      [
        {
          id: `${type}-${Date.now()}`,
          title,
          message,
          type,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ].slice(0, 12),
    );
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('Seu navegador não oferece geolocalização.');
      return;
    }

    setLocationStatus('Buscando GPS em tempo real...');
    navigator.geolocation.getCurrentPosition(
      (result) => {
        const nextPosition = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
          accuracy: result.coords.accuracy,
          updatedAt: new Date().toISOString(),
        };
        setPosition(nextPosition);
        setLocationStatus('Localização atualizada e pronta para compartilhar.');
        addNotification('GPS atualizado', 'Sua localização de emergência foi capturada.', 'sos');
      },
      () => setLocationStatus('Não foi possível acessar sua localização. Verifique a permissão do navegador.'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 },
    );
  }

  async function shareEmergency() {
    if (navigator.share) {
      await navigator.share({ title: 'SOS Portal LGBTQIA+ Nordeste', text: emergencyMessage });
      addNotification('SOS compartilhado', 'A mensagem de emergência foi enviada pelo compartilhamento do aparelho.', 'sos');
      return;
    }
    await navigator.clipboard.writeText(emergencyMessage);
    addNotification('SOS copiado', 'A mensagem de emergência foi copiada para você enviar aos contatos.', 'sos');
  }

  function addContact() {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) return;
    setContacts((current) => [
      ...current.slice(-4),
      { id: `contact-${Date.now()}`, name: contactForm.name.trim(), phone: contactForm.phone.trim() },
    ]);
    setContactForm({ name: '', phone: '' });
    addNotification('Contato salvo', 'Um contato de emergência foi adicionado ao SOS.', 'badge');
  }

  function addRiskZone() {
    if (!zoneForm.name.trim() || !position) return;
    setRiskZones((current) => [
      {
        id: `zone-${Date.now()}`,
        name: zoneForm.name.trim(),
        city: zoneForm.city.trim() || 'Nordeste',
        radius: zoneForm.radius,
        latitude: position.latitude,
        longitude: position.longitude,
        reason: zoneForm.reason.trim() || 'Zona cadastrada pela comunidade para atenção no deslocamento.',
      },
      ...current,
    ]);
    setZoneForm({ name: '', city: 'Fortaleza', radius: 500, reason: '' });
    addNotification('Zona cadastrada', 'A posição atual foi salva como zona de atenção comunitária.', 'risk');
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      addNotification('Áudio indisponível', 'Seu navegador não permite gravação de áudio nesta sessão.', 'sos');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
      setIsRecording(false);
      setRecordingSeconds(0);
      addNotification('Áudio salvo', 'Uma evidência de áudio de até 30s foi gravada neste dispositivo.', 'sos');
      if (timerRef.current) window.clearInterval(timerRef.current);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((seconds) => {
        if (seconds >= 29) {
          mediaRecorderRef.current?.stop();
          return 30;
        }
        return seconds + 1;
      });
    }, 1000);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      {/* Banner de Aviso Real */}
      <div className="w-full bg-red-600 text-white text-center py-2 px-4 shadow-md flex items-center justify-center gap-2 relative z-20">
        <i className="ri-alarm-warning-fill text-lg"></i>
        <span className="text-xs md:text-sm font-bold uppercase tracking-wide">
          Recurso experimental: esta ferramenta não aciona automaticamente a polícia, ambulância ou serviço público de emergência. Em emergência policial, ligue 190. Os recursos de gravação, localização e contato possuem limitações descritas nesta página.
        </span>
      </div>

      <section className="relative overflow-hidden bg-dark-900 px-4 md:px-6 lg:px-10 py-10 md:py-16">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=diverse%20lgbtqia%20community%20northeast%20brazil%20night%20city%20support%20network%20documentary%20photo&width=1600&height=800&seq=sos-hero&orientation=landscape"
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/85 to-dark-900/45" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              <i className="ri-shield-heart-line" aria-hidden="true"></i>
              SOS comunitário
            </span>
            <h1 className="mt-5 max-w-3xl font-playfair text-4xl font-bold leading-tight text-white md:text-6xl">
              Segurança rápida para circular com mais apoio
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              Acione contatos, compartilhe localização, registre evidências e veja alertas comunitários em um só lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={requestLocation}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-dark-800 transition-colors hover:bg-primary-50"
              >
                <i className="ri-map-pin-user-line" aria-hidden="true"></i>
                Ativar GPS
              </button>
              <button
                type="button"
                onClick={shareEmergency}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                <i className="ri-alarm-warning-line" aria-hidden="true"></i>
                Enviar SOS
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Status agora</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-xs text-white/55">GPS</p>
                <p className="mt-1 text-sm font-semibold">{locationStatus}</p>
                {position && (
                  <a
                    href={buildMapsUrl(position)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-xs font-semibold text-primary-100 underline"
                  >
                    Abrir localização no mapa
                  </a>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">{contacts.length}/5</p>
                  <p className="text-xs text-white/55">contatos</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">{nearbyZones.length}</p>
                  <p className="text-xs text-white/55">zonas próximas</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:px-10">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <a href="tel:190" className="rounded-xl border border-red-100 bg-white p-5 transition-shadow hover:shadow-md">
              <i className="ri-police-car-line text-2xl text-red-600" aria-hidden="true"></i>
              <h2 className="mt-3 text-lg font-bold text-dark-800">190</h2>
              <p className="mt-1 text-sm text-dark-500">Polícia Militar</p>
            </a>
            <a href="tel:192" className="rounded-xl border border-red-100 bg-white p-5 transition-shadow hover:shadow-md">
              <i className="ri-heart-pulse-line text-2xl text-red-600" aria-hidden="true"></i>
              <h2 className="mt-3 text-lg font-bold text-dark-800">192</h2>
              <p className="mt-1 text-sm text-dark-500">SAMU</p>
            </a>
            <a href="tel:100" className="rounded-xl border border-primary-100 bg-white p-5 transition-shadow hover:shadow-md">
              <i className="ri-customer-service-2-line text-2xl text-primary-500" aria-hidden="true"></i>
              <h2 className="mt-3 text-lg font-bold text-dark-800">Disque 100</h2>
              <p className="mt-1 text-sm text-dark-500">Direitos humanos</p>
            </a>
          </div>

          <section className="rounded-2xl border border-dark-100 bg-white p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-dark-800">Contatos de emergência</h2>
                <p className="mt-1 text-sm text-dark-500">Salve até 5 pessoas. O navegador abre SMS com a mensagem pronta.</p>
              </div>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
                {contacts.length} contatos
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <input
                value={contactForm.name}
                onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
                placeholder="Nome"
                className="rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
              <input
                value={contactForm.phone}
                onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })}
                placeholder="Telefone"
                className="rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={addContact}
                className="rounded-xl bg-dark-800 px-5 py-3 text-sm font-semibold text-white hover:bg-dark-900"
              >
                Adicionar
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex flex-col gap-3 rounded-xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-dark-800">{contact.name}</p>
                    <p className="text-sm text-dark-500">{contact.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${formatPhoneForSms(contact.phone)}`} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-dark-700">
                      Ligar
                    </a>
                    <a
                      href={`sms:${formatPhoneForSms(contact.phone)}?&body=${encodeURIComponent(emergencyMessage)}`}
                      className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white"
                    >
                      SMS
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-dark-100 bg-white p-5 md:p-6">
            <h2 className="text-2xl font-playfair font-bold text-dark-800">Zonas de risco comunitárias</h2>
            <p className="mt-1 text-sm text-dark-500">Cadastre a posição atual como zona de atenção percebida pela comunidade.</p>
            {nearbyZones.length > 0 && (
              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                <strong>Alerta:</strong> você está perto de {nearbyZones[0].zone.name}.
              </div>
            )}
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input
                value={zoneForm.name}
                onChange={(event) => setZoneForm({ ...zoneForm, name: event.target.value })}
                placeholder="Nome da zona"
                className="rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none focus:border-primary-300"
              />
              <input
                value={zoneForm.city}
                onChange={(event) => setZoneForm({ ...zoneForm, city: event.target.value })}
                placeholder="Cidade"
                className="rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none focus:border-primary-300"
              />
              <input
                type="number"
                min={100}
                max={2000}
                value={zoneForm.radius}
                onChange={(event) => setZoneForm({ ...zoneForm, radius: Number(event.target.value) })}
                className="rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none focus:border-primary-300"
              />
              <input
                value={zoneForm.reason}
                onChange={(event) => setZoneForm({ ...zoneForm, reason: event.target.value })}
                placeholder="Motivo do alerta"
                className="rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none focus:border-primary-300"
              />
            </div>
            <button
              type="button"
              onClick={addRiskZone}
              disabled={!position}
              className="mt-4 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cadastrar zona na posição atual
            </button>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {riskZones.map((zone) => (
                <article key={zone.id} className="rounded-xl border border-dark-100 bg-surface p-4">
                  <p className="font-semibold text-dark-800">{zone.name}</p>
                  <p className="mt-1 text-xs text-dark-400">{zone.city} • raio de {zone.radius}m</p>
                  <p className="mt-3 text-sm text-dark-500">{zone.reason}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-dark-100 bg-white p-5">
            <h2 className="text-xl font-playfair font-bold text-dark-800">Evidência em áudio</h2>
            <p className="mt-1 text-sm text-dark-500">A gravação fica salva temporariamente apenas na memória deste dispositivo e é perdida ao fechar a página. Nenhuma prova é enviada para servidores externos ou autoridades.</p>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`mt-5 w-full rounded-xl px-5 py-4 text-sm font-semibold text-white ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-dark-800 hover:bg-dark-900'
              }`}
            >
              {isRecording ? `Parar gravação (${recordingSeconds}s)` : 'Gravar áudio'}
            </button>
            {audioUrl && <audio controls src={audioUrl} className="mt-4 w-full" />}
          </section>

          <section className="rounded-2xl border border-dark-100 bg-white p-5">
            <h2 className="text-xl font-playfair font-bold text-dark-800">Notificações</h2>
            <div className="mt-4 space-y-3">
              {notifications.map((item) => (
                <div key={item.id} className="rounded-xl bg-surface p-4">
                  <p className="text-sm font-semibold text-dark-800">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-dark-500">{item.message}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
            <h2 className="text-xl font-playfair font-bold text-primary-700">Badges e pontos</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-4">
                <p className="text-2xl font-bold text-dark-800">{contacts.length * 25 + riskZones.length * 10}</p>
                <p className="text-xs text-dark-500">pontos</p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <p className="text-2xl font-bold text-dark-800">{contacts.length >= 3 ? '3' : '1'}</p>
                <p className="text-xs text-dark-500">badges</p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
