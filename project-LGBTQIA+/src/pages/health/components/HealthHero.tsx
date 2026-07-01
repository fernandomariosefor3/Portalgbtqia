import { Link } from 'react-router-dom';

export default function HealthHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=warm%20healthcare%20wellness%20center%20interior%20with%20plants%20natural%20light%20peaceful%20healing%20environment%20editorial%20photography%20clean%20minimal%20aesthetic%20soft%20warm%20tones%20inviting%20atmosphere&width=1400&height=500&seq=healthhero&orientation=landscape"
          alt="Saúde e bem-estar"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-20 md:py-28 lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-400/90 text-white text-xs font-medium mb-5">
            <i className="ri-heart-pulse-line" aria-hidden="true"></i>
            Cuidado e informação
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight">
            Saúde LGBTQ+
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
            Guias completos e baseados em evidências sobre PrEP, saúde mental, 
            cuidados trans e educação sexual. Informação que protege e empodera.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/saude/prep-pep"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-accent-400 text-white hover:bg-accent-500 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <i className="ri-capsule-line" aria-hidden="true"></i>
              PrEP/PEP
            </Link>
            <Link
              to="/saude/saude-mental"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <i className="ri-mental-health-line" aria-hidden="true"></i>
              Saúde Mental
            </Link>
            <Link
              to="/saude/saude-trans"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-secondary-400 text-white hover:bg-secondary-500 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <i className="ri-user-heart-line" aria-hidden="true"></i>
              Saúde Trans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}