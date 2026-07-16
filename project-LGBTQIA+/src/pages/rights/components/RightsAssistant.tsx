import { useState } from 'react';
import { legalCategories } from '@/mocks/legalRights';

type Step = 'estado' | 'situacao' | 'necessidade' | 'resultado';

export default function RightsAssistant() {
  const [step, setStep] = useState<Step>('estado');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [need, setNeed] = useState('');

  const states = ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'];
  const needs = ['Informação', 'Serviço/Atendimento', 'Denúncia'];

  const handleReset = () => {
    setState('');
    setCategory('');
    setNeed('');
    setStep('estado');
  };

  return (
    <section className="w-full bg-white border-b border-dark-100">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-10 py-10 md:py-14">
        <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-playfair font-bold text-dark-800">
                Meus Direitos LGBTQIA+
              </h2>
              <p className="mt-1 text-sm text-dark-500">
                Responda algumas perguntas simples para encontrar orientação prática.
              </p>
            </div>
            {step !== 'estado' && (
              <button 
                onClick={handleReset}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
              >
                Recomeçar
              </button>
            )}
          </div>

          <div className="min-h-[250px]">
            {step === 'estado' && (
              <div className="animate-fade-in">
                <h3 className="text-base font-semibold text-dark-700 mb-4">1. Em qual estado do Nordeste você mora?</h3>
                <div className="flex flex-wrap gap-3">
                  {states.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setState(s);
                        setStep('situacao');
                      }}
                      className="px-5 py-2.5 rounded-xl border border-dark-200 bg-white text-dark-700 hover:border-primary-400 hover:bg-primary-50 transition-all font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'situacao' && (
              <div className="animate-fade-in">
                <h3 className="text-base font-semibold text-dark-700 mb-4">2. Qual o contexto da situação?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {legalCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setStep('necessidade');
                      }}
                      className="p-4 rounded-xl border border-dark-200 bg-white text-dark-700 hover:border-primary-400 hover:bg-primary-50 transition-all text-left font-medium text-sm flex items-center justify-between group"
                    >
                      {cat}
                      <i className="ri-arrow-right-line opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'necessidade' && (
              <div className="animate-fade-in">
                <h3 className="text-base font-semibold text-dark-700 mb-4">3. O que você precisa no momento?</h3>
                <div className="flex flex-col gap-3 max-w-sm">
                  {needs.map(n => (
                    <button
                      key={n}
                      onClick={() => {
                        setNeed(n);
                        setStep('resultado');
                      }}
                      className="p-4 rounded-xl border border-dark-200 bg-white text-dark-700 hover:border-primary-400 hover:bg-primary-50 transition-all text-left font-medium text-sm flex items-center justify-between group"
                    >
                      {n}
                      <i className="ri-check-line text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'resultado' && (
              <div className="animate-fade-in bg-white rounded-xl p-6 border border-primary-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <i className="ri-lightbulb-flash-line text-xl"></i>
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-dark-800">Orientação Prática</h3>
                    <p className="text-xs text-dark-500">Baseada na sua seleção: {state} &gt; {category} &gt; {need}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-3">
                      O que a lei diz
                    </h4>
                    <p className="text-sm text-dark-600 leading-relaxed bg-primary-50/50 p-4 rounded-xl border border-primary-100">
                      {category === 'Trabalho' ? 'A discriminação por orientação sexual e identidade de gênero no ambiente de trabalho é crime de racismo (decisão do STF). Você tem direito a um ambiente seguro e ao uso do nome social.' 
                      : category === 'Violência' ? 'LGBTQIA+fobia é crime no Brasil. Casos de violência física, verbal ou psicológica podem e devem ser registrados em delegacia, preferencialmente especializada, quando houver.' 
                      : 'Você tem direitos garantidos por lei ou por decisões do STF. Para cada contexto, existem normas específicas que protegem a cidadania LGBTQIA+.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-secondary-700 uppercase tracking-wider mb-3">
                      Passos Iniciais
                    </h4>
                    <ul className="space-y-3 bg-secondary-50/50 p-4 rounded-xl border border-secondary-100">
                      <li className="flex gap-2 text-sm text-dark-600">
                        <i className="ri-folder-info-line text-secondary-500 mt-0.5"></i>
                        <span>Reúna provas (prints, testemunhas, documentos) se for o caso.</span>
                      </li>
                      <li className="flex gap-2 text-sm text-dark-600">
                        <i className="ri-map-pin-user-line text-secondary-500 mt-0.5"></i>
                        <span>Procure a Defensoria Pública do estado ({state}) ou o Centro de Referência LGBT local.</span>
                      </li>
                      {need === 'Denúncia' && (
                        <li className="flex gap-2 text-sm text-dark-600">
                          <i className="ri-phone-line text-secondary-500 mt-0.5"></i>
                          <span>Ligue para o Disque 100 para registrar uma denúncia de violação de Direitos Humanos.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-dark-100 flex items-center justify-between">
                  <p className="text-xs text-dark-400">Esta é uma orientação automatizada e não substitui aconselhamento jurídico.</p>
                  <button 
                    onClick={() => {
                      document.querySelector('input[placeholder="Buscar direito, documento, denúncia..."]')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2 text-xs font-semibold rounded-full bg-dark-800 text-white hover:bg-dark-900 transition-colors"
                  >
                    Ler guias detalhados
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
