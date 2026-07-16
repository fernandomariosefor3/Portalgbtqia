import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from './components/HeroSection';
import OnboardingSelector from './components/OnboardingSelector';
import FeaturedArticles from './components/FeaturedArticles';
import SectionsGrid from './components/SectionsGrid';
import CommunityCTA from './components/CommunityCTA';
import Testimonials from './components/Testimonials';

export default function Home() {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { t } = useTranslation();

  return (
    <main className="w-full min-h-screen bg-surface font-inter">
      <HeroSection />
      <OnboardingSelector />
      <FeaturedArticles />
      <SectionsGrid />
      <CommunityCTA />
      <Testimonials />

      <section className="w-full bg-surface py-14 md:py-20 px-4 md:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs md:text-sm font-medium text-accent-400 uppercase tracking-wider">
            {t('home.newsletter.eyebrow')}
          </span>
          <h2 className="mt-3 text-2xl md:text-4xl font-playfair font-bold text-dark-700">
            {t('home.newsletter.title')}
          </h2>
          <p className="mt-3 text-base text-dark-400 max-w-xl mx-auto leading-relaxed">
            {t('home.newsletter.description')}
          </p>
          <form
            data-readdy-form
            id="newsletter-form"
            action="https://readdy.ai/api/form/d850jd1n2eikjpjtqh80"
            method="POST"
            className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              fetch(form.action, {
                method: 'POST',
                body: new URLSearchParams(formData as any),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              })
                .then(() => {
                  setFormStatus('success');
                  form.reset();
                  setTimeout(() => setFormStatus('idle'), 5000);
                })
                .catch(() => {
                  setFormStatus('error');
                  setTimeout(() => setFormStatus('idle'), 5000);
                });
            }}
          >
            <input
              type="email"
              name="email"
              placeholder={t('home.newsletter.placeholder')}
              required
              className="w-full sm:flex-1 px-5 py-3.5 text-sm rounded-full border border-dark-200 bg-white text-dark-700 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              {t('home.newsletter.submit')}
            </button>
          </form>
          {formStatus === 'success' && (
            <p className="mt-3 text-sm font-medium text-accent-500">
              {t('home.newsletter.success')}
            </p>
          )}
          {formStatus === 'error' && (
            <p className="mt-3 text-sm font-medium text-primary-500">
              {t('home.newsletter.error')}
            </p>
          )}
          {formStatus === 'idle' && (
            <p className="mt-3 text-xs text-dark-400">
              {t('home.newsletter.privacy')}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
