import { useTranslation } from 'react-i18next';

const purposes = [
  {
    icon: "ri-heart-pulse-line",
    key: "health",
    color: "text-primary-500",
    bg: "bg-primary-50",
  },
  {
    icon: "ri-book-open-line",
    key: "rights",
    color: "text-secondary-500",
    bg: "bg-secondary-50",
  },
  {
    icon: "ri-map-pin-line",
    key: "spaces",
    color: "text-accent-500",
    bg: "bg-accent-50",
  },
];

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-surface-cream py-14 md:py-20 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-accent-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent-400"></span>
            {t('home.purpose.eyebrow')}
          </span>
          <h2 className="mt-3 text-2xl md:text-4xl font-playfair font-bold text-dark-700">
            {t('home.purpose.title')}
          </h2>
          <p className="mt-3 text-base text-dark-400 max-w-xl mx-auto">
            {t('home.purpose.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {purposes.map((p) => (
            <div
              key={p.key}
              className="flex flex-col p-5 md:p-6 rounded-xl bg-white shadow-sm"
            >
              <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${p.bg} ${p.color} mb-4`}>
                <i className={`${p.icon} text-xl`}></i>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-dark-800">
                {t(`home.purpose.${p.key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-dark-500 leading-relaxed flex-1">
                {t(`home.purpose.${p.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
