import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCulture } from '@/lib/useCulture';
import CultureHeader from './components/CultureHeader';
import CultureSidebar from './components/CultureSidebar';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export default function CultureDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { items: allCulture, loading } = useCulture();
  const item = slug ? allCulture.find((c) => c.slug === slug) : undefined;

  // Enquanto carrega, evita redirecionar prematuramente.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-dark-400">
        {t('culture.loading')}
      </div>
    );
  }

  if (!item) {
    return <Navigate to="/cultura" replace />;
  }

  const currentIndex = allCulture.findIndex((c) => c.id === item.id);
  const prevItem = currentIndex > 0 ? allCulture[currentIndex - 1] : null;
  const nextItem = currentIndex < allCulture.length - 1 ? allCulture[currentIndex + 1] : null;

  // Relacionados do mesmo pool: mesmo tipo, exceto o item atual.
  const related = allCulture
    .filter((c) => c.id !== item.id && c.type === item.type)
    .slice(0, 3);

  return (
    <main className="w-full min-h-screen bg-surface font-inter pb-16">
      <CultureHeader item={item} />

      <section className="w-full px-4 md:px-6 lg:px-10 pt-8 md:pt-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <article className="flex-1 min-w-0">
              <div
                className="article-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }}
              />

              <div className="mt-10 pt-8 border-t border-dark-100">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {prevItem ? (
                    <Link
                      to={`/cultura/${prevItem.slug}`}
                      className="group flex items-center gap-2 text-sm text-dark-500 hover:text-primary-500 transition-colors"
                    >
                      <i className="ri-arrow-left-line text-lg flex-shrink-0" aria-hidden="true"></i>
                      <div className="text-left">
                        <span className="block text-[10px] uppercase tracking-wider text-dark-400">{t('culture.previous')}</span>
                        <span className="block font-medium line-clamp-1 max-w-[140px] sm:max-w-[200px]">{prevItem.title}</span>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextItem ? (
                    <Link
                      to={`/cultura/${nextItem.slug}`}
                      className="group flex items-center gap-2 text-sm text-dark-500 hover:text-primary-500 transition-colors"
                    >
                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-wider text-dark-400">{t('culture.next')}</span>
                        <span className="block font-medium line-clamp-1 max-w-[140px] sm:max-w-[200px]">{nextItem.title}</span>
                      </div>
                      <i className="ri-arrow-right-line text-lg flex-shrink-0" aria-hidden="true"></i>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </article>

            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <CultureSidebar item={item} related={related} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .article-content .lead {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4A4A4A;
          margin-bottom: 2rem;
        }
        .article-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .article-content p {
          font-size: 1rem;
          line-height: 1.8;
          color: #2D2D2D;
          margin-bottom: 1.25rem;
        }
        .article-content strong {
          font-weight: 600;
          color: #1A1A1A;
        }
        .article-content blockquote {
          border-left: 4px solid #E94E77;
          padding-left: 1.25rem;
          margin: 2rem 0;
          font-style: italic;
          color: #4A4A4A;
          font-family: 'Playfair Display', serif;
          font-size: 1.125rem;
          line-height: 1.7;
        }
        .article-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .article-content ul li {
          font-size: 1rem;
          line-height: 1.8;
          color: #2D2D2D;
          margin-bottom: 0.5rem;
        }
        .article-content a {
          color: #E94E77;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .article-content a:hover {
          color: #D43D66;
        }
        @media (min-width: 768px) {
          .article-content h2 {
            font-size: 1.75rem;
          }
          .article-content .lead {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </main>
  );
}