import { useTranslation } from 'react-i18next';


export default function CultureHero() {
  const { t } = useTranslation();
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
          {t('culture.hero.eyebrow')}
        </span>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white max-w-2xl leading-tight">
          {t('culture.hero.title')}
        </h1>
        <p className="mt-4 text-base text-white/60 max-w-xl leading-relaxed">
          {t('culture.hero.description')}
        </p>
      </div>
    </section>
  );
}