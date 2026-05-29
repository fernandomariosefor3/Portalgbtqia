import { Link } from 'react-router-dom';

export default function CultureHero() {
  return (
    <section className="relative w-full bg-dark-700 pt-20 pb-10 md:pt-24 md:pb-20 px-4 md:px-6 lg:px-10 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://readdy.ai/api/search-image?query=abstract%20artistic%20background%20with%20film%20reels%20vinyl%20records%20theatrical%20masks%20and%20spotlights%20warm%20artistic%20palette%20orange%20pink%20gold%20tones%20editorial%20photography%20soft%20focus%20creative%20composition&width=1600&height=500&seq=cult-hero&orientation=landscape"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary-400/20 text-secondary-300 text-xs font-medium uppercase tracking-wider mb-4">
          Cultura
        </span>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-2xl leading-tight">
          Cinema, séries, música e drag
        </h1>
        <p className="mt-4 text-base text-white/60 max-w-xl leading-relaxed">
          Críticas, curadorias e histórias da produção cultural LGBTQ+ no Brasil e no mundo. Do cinema independente à cena drag cearense.
        </p>
      </div>
    </section>
  );
}