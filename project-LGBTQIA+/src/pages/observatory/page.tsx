import { useState } from 'react';
import { Link } from 'react-router-dom';

const statesData = [
  { state: 'CE', reports: 1240, color: 'bg-emerald-500', width: '85%' },
  { state: 'BA', reports: 1105, color: 'bg-blue-500', width: '75%' },
  { state: 'PE', reports: 980, color: 'bg-purple-500', width: '65%' },
  { state: 'PB', reports: 450, color: 'bg-amber-500', width: '30%' },
  { state: 'RN', reports: 380, color: 'bg-rose-500', width: '25%' },
  { state: 'MA', reports: 310, color: 'bg-teal-500', width: '20%' },
  { state: 'AL', reports: 290, color: 'bg-indigo-500', width: '18%' },
  { state: 'PI', reports: 150, color: 'bg-pink-500', width: '10%' },
  { state: 'SE', reports: 110, color: 'bg-orange-500', width: '8%' },
];

const categoryData = [
  { name: 'Discriminação em serviço público', percentage: 35, color: 'bg-rose-500' },
  { name: 'Violência física/ameaça', percentage: 28, color: 'bg-orange-500' },
  { name: 'Discriminação no trabalho', percentage: 20, color: 'bg-amber-500' },
  { name: 'Conflitos familiares', percentage: 12, color: 'bg-blue-500' },
  { name: 'Outros', percentage: 5, color: 'bg-dark-300' },
];

export default function ObservatoryPage() {
  const [activeTab, setActiveTab] = useState('denuncias');

  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      <section className="relative w-full bg-dark-800 px-4 md:px-6 lg:px-10 pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden">
        {/* Banner de Alerta de Demonstração */}
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center py-2 px-4 z-20 shadow-md flex items-center justify-center gap-2">
          <i className="ri-error-warning-fill text-lg"></i>
          <span className="text-xs md:text-sm font-bold uppercase tracking-wide">
            Demonstração visual com dados ilustrativos. Não utilizar para análise ou tomada de decisão.
          </span>
        </div>
        
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://readdy.ai/api/search-image?query=abstract%20data%20visualization%20dashboard%20nodes%20glowing%20lines%20dark%20background%20technology%20information%20clean%20minimalist&width=1600&height=520&seq=observatory-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-medium uppercase tracking-wider mb-4">
            <i className="ri-bar-chart-box-line" aria-hidden="true"></i>
            Painel de Dados
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-3xl leading-tight">
            Observatório LGBTQIA+ Nordeste
          </h1>
          <p className="mt-4 text-base text-white/70 max-w-2xl leading-relaxed">
            Acompanhe métricas, entenda as desigualdades regionais e veja números reais sobre direitos, violência e acesso a serviços em nosso território.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 md:p-6 mb-10 flex flex-col md:flex-row gap-5 items-start">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
            <i className="ri-alert-line text-2xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800">Nota Metodológica Importante</h3>
            <p className="mt-2 text-sm text-red-700 leading-relaxed max-w-4xl">
              Os dados apresentados neste observatório são recortes de bases abertas governamentais (Disque 100, SINAN, Atlas da Violência) referentes ao período de <strong>2023 a 2025</strong>. 
              <strong>ATENÇÃO:</strong> Existe um alto índice de <em>subnotificação</em> histórico. Um estado com menos denúncias não é necessariamente mais seguro; pode indicar apenas uma rede de proteção e notificação menos acessível ou estruturada.
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          <button
            onClick={() => setActiveTab('denuncias')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'denuncias' ? 'bg-dark-800 text-white' : 'bg-white border border-dark-200 text-dark-600 hover:bg-dark-50'
            }`}
          >
            Volume de Denúncias
          </button>
          <button
            onClick={() => setActiveTab('violencia')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'violencia' ? 'bg-dark-800 text-white' : 'bg-white border border-dark-200 text-dark-600 hover:bg-dark-50'
            }`}
          >
            Tipos de Violações
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {activeTab === 'denuncias' && (
              <div className="bg-white rounded-2xl border border-dark-100 p-6 md:p-8 shadow-sm">
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold text-dark-800">Como os estados do Nordeste se comparam?</h2>
                    <p className="text-sm text-dark-500 mt-1">Registros totais via Disque 100 (2023-2025)</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {statesData.map((item) => (
                    <div key={item.state} className="flex items-center gap-4">
                      <span className="w-8 font-bold text-dark-600 shrink-0 text-sm">{item.state}</span>
                      <div className="flex-1 h-6 bg-dark-50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: item.width }}
                        ></div>
                      </div>
                      <span className="w-12 text-right text-xs font-medium text-dark-500">{item.reports}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'violencia' && (
              <div className="bg-white rounded-2xl border border-dark-100 p-6 md:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-dark-800">Quais grupos de violações aparecem com maior frequência?</h2>
                  <p className="text-sm text-dark-500 mt-1">Categorização de chamados na região Nordeste</p>
                </div>
                
                <div className="space-y-5">
                  {categoryData.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-dark-700">{item.name}</span>
                        <span className="text-dark-500">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-3 bg-dark-50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6">
              <h3 className="font-bold text-primary-800 mb-2">Quer denunciar?</h3>
              <p className="text-sm text-primary-700 mb-4 leading-relaxed">
                O Disque 100 funciona 24 horas por dia, incluindo sábados, domingos e feriados. A ligação é gratuita e pode ser anônima.
              </p>
              <Link 
                to="/sos"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-sm"
              >
                <i className="ri-phone-line"></i>
                Acessar Guia SOS
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-dark-100 p-6">
              <h3 className="font-bold text-dark-800 mb-2">Detalhes da Fonte</h3>
              <ul className="space-y-3 mt-4 text-sm text-dark-600">
                <li className="flex gap-2">
                  <i className="ri-database-2-line text-dark-400"></i>
                  <span><strong>Base:</strong> Painel de Dados Abertos de Direitos Humanos</span>
                </li>
                <li className="flex gap-2">
                  <i className="ri-calendar-2-line text-dark-400"></i>
                  <span><strong>Período:</strong> Jan/2023 - Jun/2025</span>
                </li>
                <li className="flex gap-2">
                  <i className="ri-refresh-line text-dark-400"></i>
                  <span><strong>Última atualização:</strong> 15 de Julho de 2026</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
