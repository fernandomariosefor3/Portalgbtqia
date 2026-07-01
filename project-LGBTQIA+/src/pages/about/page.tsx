import MissionSection from "./components/MissionSection";
import ValuesSection from "./components/ValuesSection";
import TeamSection from "./components/TeamSection";

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="relative w-full h-[420px] md:h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://readdy.ai/api/search-image?query=diverse%20crowd%20of%20brazilian%20people%20marching%20in%20pride%20parade%20colorful%20flags%20and%20banners%20warm%20sunset%20light%20urban%20street%20editorial%20photography%20inclusive%20celebration%20joyful%20atmosphere%20high%20quality&width=1200&height=520&seq=about-hero&orientation=landscape")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
          <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
            Institucional
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight max-w-4xl">
            Sobre o{" "}
            <span className="italic text-secondary-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">Portal LGBTQ+</span>
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Informação de qualidade, cultura vibrante e acolhimento comunitário
            para a diversidade no Nordeste do Brasil.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="w-full bg-white border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10">
          <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-playfair font-bold text-primary-500">
                9
              </p>
              <p className="mt-1 text-xs md:text-sm text-dark-400">
                Seções editoriais
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-playfair font-bold text-primary-500">
                6
              </p>
              <p className="mt-1 text-xs md:text-sm text-dark-400">
                Estados do Nordeste
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-playfair font-bold text-primary-500">
                100%
              </p>
              <p className="mt-1 text-xs md:text-sm text-dark-400">
                Gratuito
              </p>
            </div>
          </div>
        </div>
      </section>

      <MissionSection />
      <ValuesSection />
      <TeamSection />
    </main>
  );
}