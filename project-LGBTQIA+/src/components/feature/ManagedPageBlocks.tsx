import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEditablePageKey } from '@/content/pageRegistry';
import { usePageBlocks } from '@/lib/usePageBlocks';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export default function ManagedPageBlocks() {
  const { t } = useTranslation();
  const location = useLocation();
  const page = getEditablePageKey(location.pathname);
  const { blocks, loading, error } = usePageBlocks(page);

  if (!page || loading || error || blocks.length === 0) return null;

  return (
    <div aria-label={t('pageBlocks.label')}>
      {blocks.map((block, index) => {
        const headingId = `page-block-${block.id}`;
        const reversed = index % 2 === 1;
        return (
          <section
            key={block.id}
            aria-labelledby={block.title ? headingId : undefined}
            className="border-t border-dark-100 bg-white px-4 py-10 md:px-6 md:py-14 lg:px-10"
          >
            <div className={`mx-auto grid max-w-6xl items-center gap-8 ${block.image ? 'md:grid-cols-2' : ''}`}>
              {block.image && (
                <img
                  src={block.image}
                  alt={block.imageAlt}
                  width={1200}
                  height={675}
                  loading="lazy"
                  className={`h-64 w-full rounded-2xl object-cover shadow-sm ${reversed ? 'md:order-2' : ''}`}
                />
              )}
              <div className={reversed ? 'md:order-1' : ''}>
                {block.title && (
                  <h2 id={headingId} className="font-playfair text-2xl font-bold text-dark-700 md:text-3xl">
                    {block.title}
                  </h2>
                )}
                {block.content && (
                  <div
                    className="article-content mt-4 whitespace-pre-wrap text-base leading-7 text-dark-600"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.content) }}
                  />
                )}
                {block.ctaLabel && block.ctaUrl && (
                  <Link
                    to={block.ctaUrl}
                    className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                  >
                    {block.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
