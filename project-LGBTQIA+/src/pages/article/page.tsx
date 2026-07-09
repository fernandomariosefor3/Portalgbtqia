import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import type { Article } from '@/mocks/articles-full';
import { getFirestoreArticleBySlug } from '@/lib/useArticles';
import ArticleHeader from './components/ArticleHeader';
import ArticleSidebar from './components/ArticleSidebar';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!slug) {
        setArticle(null);
        return;
      }

      try {
        const firestoreArticle = await getFirestoreArticleBySlug(slug);
        if (!active) return;
        setArticle(firestoreArticle ?? null);
      } catch (error) {
        console.error('Erro ao buscar artigo do Firestore:', error);
        if (active) setArticle(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  if (article === undefined) {
    return (
      <main className="w-full min-h-screen bg-surface font-inter flex items-center justify-center">
        <span className="inline-flex items-center gap-2 text-sm text-dark-400">
          <i className="ri-loader-4-line animate-spin text-lg" aria-hidden="true"></i>
          Carregando artigo...
        </span>
      </main>
    );
  }

  if (!article) {
    return <Navigate to="/artigos" replace />;
  }

  const contentHtml = article.content?.trim() || `<p class="lead">${article.excerpt}</p>`;

  return (
    <main className="w-full min-h-screen bg-surface font-inter pb-16">
      <ArticleHeader article={article} />

      <section className="w-full px-4 md:px-6 lg:px-10 pt-8 md:pt-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <article className="flex-1 min-w-0">
              <div
                className="article-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {article.sourceUrl && (
                <div className="mt-8">
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Acessar fonte original
                    <i className="ri-external-link-line" aria-hidden="true"></i>
                  </a>
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-dark-100">
                <Link
                  to="/artigos"
                  className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-primary-500 transition-colors"
                >
                  <i className="ri-arrow-left-line text-lg flex-shrink-0" aria-hidden="true"></i>
                  Voltar para artigos
                </Link>
              </div>
            </article>

            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <ArticleSidebar article={article} />
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
