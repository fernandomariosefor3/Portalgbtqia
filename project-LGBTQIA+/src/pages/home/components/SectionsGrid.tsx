import { Link } from 'react-router-dom';
import { portalSections } from '@/mocks/sections';

export default function SectionsGrid() {
  return (
    <section className="w-full bg-surface-warm py-14 md:py-20 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <span className="text-xs md:text-sm font-medium text-accent-400 uppercase tracking-wider">
            Explore o portal
          </span>
          <h2 className="mt-2 text-2xl md:text-4xl font-playfair font-bold text-dark-700">
            Nove caminhos para <span className="italic">conhecer</span>,
            <br className="hidden md:block" />
            {' '}aprender e se conectar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {portalSections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[16/10] sm:aspect-[4/5] overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-700/80 via-dark-700/20 to-transparent" />
                <div className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                  <i className={section.icon}></i>
                </div>
              </div>
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <h3 className="text-base md:text-lg font-bold text-dark-700 group-hover:text-primary-400 transition-colors">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-dark-400 leading-relaxed line-clamp-2">
                  {section.description}
                </p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-500">{section.stats}</span>
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-dark-50 text-dark-500 group-hover:bg-primary-400 group-hover:text-white transition-colors">
                    <i className="ri-arrow-right-line text-sm" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}