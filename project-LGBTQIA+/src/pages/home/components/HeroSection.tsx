import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[420px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center object-top"
        style={{
          backgroundImage:
            'url("https://readdy.ai/api/search-image?query=diverse%20group%20of%20LGBTQ%20people%20celebrating%20together%20at%20pride%20event%20rainbow%20flags%20warm%20golden%20hour%20lighting%20photorealistic%20editorial%20photography%20outdoor%20celebration%20joyful%20atmosphere%20authentic%20diversity&width=1600&height=900&seq=hero1&orientation=landscape")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-700/60 via-dark-700/40 to-dark-700/70" />

      <div className="relative z-10 w-full px-4 md:px-6 lg:px-10 text-center py-10">
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-5xl mx-auto">
          Informação, cultura e
          <span className="italic"> comunidade</span>
          <br className="hidden sm:block" />
          {' '}para todas as identidades
        </h1>
        <p className="mt-4 md:mt-6 text-sm md:text-lg text-white/85 max-w-2xl mx-auto font-inter leading-relaxed">
          O primeiro portal LGBTQ+ do Nordeste. Artigos, guias, mapa de espaços seguros e uma
          comunidade acolhedora para quem busca representatividade e informação de qualidade.
        </p>
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/artigos"
            className="px-6 py-3 text-sm font-semibold rounded-full bg-white text-dark-700 hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Ler artigos
          </Link>
          <Link
            to="/saude"
            className="px-6 py-3 text-sm font-semibold rounded-full border-2 border-white/60 text-white hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            Guias de saúde
          </Link>
        </div>

        <div className="mt-8 md:mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-white/70">
          <div className="text-center">
            <div className="text-xl md:text-3xl font-playfair font-bold text-white">9</div>
            <div className="text-xs md:text-sm mt-1">seções</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/30" />
          <div className="text-center">
            <div className="text-xl md:text-3xl font-playfair font-bold text-white">500+</div>
            <div className="text-xs md:text-sm mt-1">artigos</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/30" />
          <div className="text-center">
            <div className="text-xl md:text-3xl font-playfair font-bold text-white">80+</div>
            <div className="text-xs md:text-sm mt-1">espaços no mapa</div>
          </div>
        </div>
      </div>
    </section>
  );
}