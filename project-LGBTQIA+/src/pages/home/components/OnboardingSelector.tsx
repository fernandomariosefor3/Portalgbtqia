import { useNavigate } from 'react-router-dom';

const profiles = [
  { id: 'me', label: 'Quero informações para mim', icon: 'ri-user-smile-line', path: '/guia-fortaleza' },
  { id: 'family', label: 'Sou familiar ou responsável', icon: 'ri-parent-line', path: '/familia' },
  { id: 'educator', label: 'Sou educador', icon: 'ri-presentation-line', path: '/educacao' },
  { id: 'health', label: 'Sou profissional da saúde', icon: 'ri-stethoscope-line', path: '/saude' },
  { id: 'company', label: 'Sou empresa', icon: 'ri-building-4-line', path: '/comunidade' },
  { id: 'culture', label: 'Quero acompanhar cultura', icon: 'ri-movie-line', path: '/cultura' },
];

export default function OnboardingSelector() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white border-b border-dark-100 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-dark-800">
            Como podemos ajudar você hoje?
          </h2>
          <p className="mt-3 text-sm text-dark-500">
            Escolha seu perfil para acessar conteúdos selecionados. Não exigimos cadastro.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => navigate(profile.path)}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-dark-200 bg-white hover:border-primary-400 hover:bg-primary-50 text-dark-700 hover:text-primary-700 transition-all font-medium text-sm shadow-sm hover:shadow"
            >
              <i className={`${profile.icon} text-lg`} aria-hidden="true"></i>
              {profile.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
