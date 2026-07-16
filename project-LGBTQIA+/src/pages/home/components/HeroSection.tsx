import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSection } from '@/lib/useSiteSection';

const fallbackHero = {
  title: 'Informacao, cultura e comunidade para todas as identidades',
  subtitle: 'Portal de cidadania, saúde e cultura LGBTQIA+ do Nordeste',
  description:
    'Artigos, guias, mapa de espaços em verificação e uma comunidade focada em acolhimento, representatividade e informação de qualidade no Nordeste.',
  image:
    'https://readdy.ai/api/search-image?query=diverse%20group%20of%20LGBTQ%20people%20celebrating%20together%20at%20pride%20event%20rainbow%20flags%20warm%20golden%20hour%20lighting%20photorealistic%20editorial%20photography%20outdoor%20celebration%20joyful%20atmosphere%20authentic%20diversity&width=1600&height=900&seq=hero1&orientation=landscape',
  ctaLabel: 'Ler artigos',
  ctaUrl: '/artigos',
};

export default function HeroSection() {
  const { content } = useSiteSection('home-hero', fallbackHero);
  const { i18n, t } = useTranslation();
  const isPortuguese = (i18n.resolvedLanguage || 'pt-BR').startsWith('pt');
  const localizedContent = isPortuguese ? content : {
    ...content,
    subtitle: t('home.hero.subtitle'),
    title: t('home.hero.title'),
    description: t('home.hero.description'),
    ctaLabel: t('home.hero.articlesCta'),
  };

  return (
    <section className="relative w-full min-h-[420px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center object-top"
        style={{
          backgroundImage: `url("${localizedContent.image || fallbackHero.image}")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-700/60 via-dark-700/40 to-dark-700/70" />

      <div className="relative z-10 w-full px-4 md:px-6 lg:px-10 text-center py-10">
        {localizedContent.subtitle && (
          <span className="mb-4 inline-flex px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm">
            {localizedContent.subtitle}
          </span>
        )}
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-5xl mx-auto">
          {localizedContent.title}
        </h1>
        <p className="mt-4 md:mt-6 text-sm md:text-lg text-white/85 max-w-2xl mx-auto font-inter leading-relaxed">
          {localizedContent.description}
        </p>
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to={localizedContent.ctaUrl || '/artigos'}
            className="px-6 py-3 text-sm font-semibold rounded-full bg-white text-dark-700 hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            {localizedContent.ctaLabel || t('home.hero.articlesCta')}
          </Link>
          <Link
            to="/saude"
            className="px-6 py-3 text-sm font-semibold rounded-full border-2 border-white/60 text-white hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            {t('home.hero.healthCta')}
          </Link>
        </div>

        <div className="mt-8 md:mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-white/70">
          <div className="text-center">
            <div className="text-xl md:text-3xl font-playfair font-bold text-white">9</div>
            <div className="text-xs md:text-sm mt-1">Estados do Nordeste</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/30" />
          <div className="text-center">
            <div className="text-xl md:text-3xl font-playfair font-bold text-white"><i className="ri-check-double-line"></i></div>
            <div className="text-xs md:text-sm mt-1">Conteúdos revisados</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/30" />
          <div className="text-center">
            <div className="text-xl md:text-3xl font-playfair font-bold text-white"><i className="ri-search-eye-line"></i></div>
            <div className="text-xs md:text-sm mt-1">Serviços em verificação</div>
          </div>
        </div>
      </div>
    </section>
  );
}
