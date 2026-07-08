import { Link } from 'react-router-dom';
import { useSiteSection } from '@/lib/useSiteSection';

const fallbackCommunity = {
  title: 'Um espaco seguro para conversar, aprender e crescer juntos',
  subtitle: 'Junte-se a comunidade',
  description:
    'Participe do forum de discussoes, encontre um mentor ou converse no chat seguro. Sua voz importa e faz parte da mudanca.',
  image:
    'https://readdy.ai/api/search-image?query=diverse%20group%20of%20people%20holding%20hands%20in%20circle%20community%20gathering%20indoor%20soft%20warm%20lighting%20authentic%20friendship%20unity%20editorial%20photography%20top%20view%20artistic%20composition&width=1200&height=500&seq=cta1&orientation=landscape',
  ctaLabel: 'Entrar no forum',
  ctaUrl: '/comunidade',
};

export default function CommunityCTA() {
  const { content } = useSiteSection('home-community', fallbackCommunity);

  return (
    <section className="w-full bg-dark-700 py-16 md:py-24 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${content.image || fallbackCommunity.image}")`,
            }}
          />
          <div className="absolute inset-0 bg-dark-700/70" />

          <div className="relative z-10 flex flex-col items-center text-center py-12 md:py-20 px-6 md:px-10">
            <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-secondary-400/20 text-secondary-300 border border-secondary-400/30">
              {content.subtitle}
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight max-w-3xl">
              {content.title}
            </h2>
            <p className="mt-4 md:mt-5 text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
              {content.description}
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to={content.ctaUrl || '/comunidade'}
                className="px-8 py-3.5 text-sm md:text-base font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap shadow-lg"
              >
                {content.ctaLabel || 'Entrar no forum'}
              </Link>
              <Link
                to="/comunidade"
                className="px-8 py-3.5 text-sm md:text-base font-semibold rounded-full border-2 border-white/60 text-white hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Programa de mentoria
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto flex items-center justify-center rounded-2xl bg-primary-400/20 text-primary-300">
              <i className="ri-message-3-line text-2xl md:text-3xl" aria-hidden="true"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Fórum de discussões</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Debata temas importantes, tire dúvidas e compartilhe experiências em um ambiente moderado e respeitoso.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto flex items-center justify-center rounded-2xl bg-secondary-400/20 text-secondary-300">
              <i className="ri-user-heart-line text-2xl md:text-3xl" aria-hidden="true"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Mentoria gratuita</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Conecte-se com mentores experientes em áreas como empregabilidade, saúde mental, transição de gênero e mais.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto flex items-center justify-center rounded-2xl bg-accent-400/20 text-accent-300">
              <i className="ri-chat-smile-2-line text-2xl md:text-3xl" aria-hidden="true"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Chat seguro</h3>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Converse em tempo real com anonimato opcional. Um espaço para desabafar, fazer amizades e encontrar apoio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
