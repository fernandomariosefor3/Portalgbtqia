import { useState, useMemo } from 'react';

const mockOpportunities = [
  {
    id: 1,
    type: 'vaga',
    title: 'Desenvolvedor(a) Front-end Pleno',
    organization: 'Tech Para Todes',
    state: 'CE',
    category: 'Tecnologia',
    verified: true,
    deadline: '2026-08-30',
    description: 'Vaga afirmativa para pessoas trans. Trabalho remoto, mas com base e contratação no Ceará.'
  },
  {
    id: 2,
    type: 'empreendedor',
    title: 'Cozinha da Bixa',
    organization: 'Restaurante / Delivery',
    state: 'PE',
    category: 'Gastronomia',
    verified: true,
    deadline: null,
    description: 'Comida regional pernambucana feita com afeto. Empreendimento focado em contratar pessoas LGBTQIA+ em vulnerabilidade.'
  },
  {
    id: 3,
    type: 'edital',
    title: 'Fundo Elas+',
    organization: 'Instituto Elas',
    state: 'BA',
    category: 'Financiamento',
    verified: true,
    deadline: '2026-09-15',
    description: 'Edital para financiamento de coletivos de mulheres lésbicas e bissexuais no Nordeste.'
  },
  {
    id: 4,
    type: 'empreendedor',
    title: 'Corte Inclusivo',
    organization: 'Barbearia / Salão',
    state: 'RN',
    category: 'Beleza',
    verified: false,
    deadline: null,
    description: 'Um espaço seguro para cortar o cabelo e fazer a barba. Focado no público transmasculino.'
  },
  {
    id: 5,
    type: 'curso',
    title: 'Formação em Design Gráfico',
    organization: 'ONG Cores do Amanhã',
    state: 'MA',
    category: 'Educação',
    verified: true,
    deadline: '2026-10-01',
    description: 'Curso gratuito de 3 meses para jovens LGBTQIA+ periféricos.'
  }
];

export default function OpportunitiesPage() {
  const [filterType, setFilterType] = useState('todos');
  const [filterState, setFilterState] = useState('todos');
  const states = ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'];
  const types = [
    { value: 'todos', label: 'Tudo' },
    { value: 'vaga', label: 'Vagas de Emprego' },
    { value: 'edital', label: 'Editais / Bolsas' },
    { value: 'curso', label: 'Cursos' },
    { value: 'empreendedor', label: 'Empreendedores Locais' }
  ];

  const filteredItems = useMemo(() => {
    return mockOpportunities.filter(item => {
      const matchType = filterType === 'todos' || item.type === filterType;
      const matchState = filterState === 'todos' || item.state === filterState;
      return matchType && matchState;
    });
  }, [filterType, filterState]);

  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20">
      <section className="relative w-full bg-dark-800 px-4 md:px-6 lg:px-10 pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://readdy.ai/api/search-image?query=diverse%20group%20of%20people%20working%20in%20a%20modern%20bright%20coworking%20space%20collaborating%20happy%20professional%20editorial&width=1600&height=520&seq=opportunities-hero&orientation=landscape"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-medium uppercase tracking-wider mb-4">
            <i className="ri-briefcase-line" aria-hidden="true"></i>
            Rede Econômica
          </span>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-3xl leading-tight">
            Guia de Oportunidades & Empreendedores
          </h1>
          <p className="mt-4 text-base text-white/70 max-w-2xl leading-relaxed">
            Conectando talentos a empresas inclusivas e divulgando pequenos negócios da comunidade LGBTQIA+ de todo o Nordeste.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-16">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 pb-6 border-b border-dark-100">
          <div className="flex-1 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {types.map(t => (
                <button
                  key={t.value}
                  onClick={() => setFilterType(t.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    filterType === t.value ? 'bg-dark-800 text-white' : 'bg-white border border-dark-200 text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <label className="text-sm text-dark-500 font-medium">Estado:</label>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-white border border-dark-200 text-dark-700 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="todos">Todos do NE</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <article key={item.id} className="bg-white rounded-2xl border border-dark-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white ${
                  item.type === 'vaga' ? 'bg-blue-600' :
                  item.type === 'edital' ? 'bg-emerald-600' :
                  item.type === 'curso' ? 'bg-purple-600' : 'bg-orange-500'
                }`}>
                  {item.type}
                </span>
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-dark-400 bg-dark-50 px-2 py-1 rounded">{item.state}</span>
                  {item.verified && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1" title="Cadastro Verificado">
                      <i className="ri-checkbox-circle-fill"></i>
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-dark-800 mb-1">{item.title}</h3>
              <p className="text-sm font-semibold text-primary-600 mb-4">{item.organization}</p>
              
              <p className="text-sm text-dark-500 leading-relaxed flex-1">
                {item.description}
              </p>
              
              <div className="mt-6 pt-4 border-t border-dark-100 flex justify-between items-center">
                {item.deadline ? (
                  <span className="text-xs text-rose-600 font-medium">
                    <i className="ri-time-line mr-1"></i>
                    Até {item.deadline.split('-').reverse().join('/')}
                  </span>
                ) : (
                  <span className="text-xs text-dark-400 font-medium">Aberto/Contínuo</span>
                )}
                
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-800">
                  Acessar <i className="ri-arrow-right-line align-middle"></i>
                </button>
              </div>
            </article>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="w-16 h-16 mx-auto bg-dark-50 rounded-full flex items-center justify-center text-dark-300 text-2xl mb-4">
                <i className="ri-search-eye-line"></i>
              </div>
              <h3 className="text-lg font-bold text-dark-700">Nenhuma oportunidade encontrada</h3>
              <p className="text-sm text-dark-500 mt-1">Tente mudar o filtro de estado ou categoria.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
