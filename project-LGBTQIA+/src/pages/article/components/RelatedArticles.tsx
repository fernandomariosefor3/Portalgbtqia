import { Link } from 'react-router-dom';
import type { Article } from '@/mocks/articles-full';
import { useArticles } from '@/lib/useArticles';

interface RelatedArticlesProps {
  currentArticle: Article;
}

export default function RelatedArticles({ currentArticle }: RelatedArticlesProps) {
  const { articles } = useArticles();

  // Artigos relacionados - lógica determinística e estrita
  const related = articles
    .filter((a) => a.id !== currentArticle.id)
    .sort((a, b) => {
      // 1. mesma categoria
      const aSameCategory = a.category === currentArticle.category ? 1 : 0;
      const bSameCategory = b.category === currentArticle.category ? 1 : 0;
      if (aSameCategory !== bSameCategory) return bSameCategory - aSameCategory;

      // 2. maior quantidade de tags ou palavras-chave em comum
      const currentTags = currentArticle.tags || [];
      const aCommonTags = (a.tags || []).filter((t) => currentTags.includes(t)).length;
      const bCommonTags = (b.tags || []).filter((t) => currentTags.includes(t)).length;
      if (aCommonTags !== bCommonTags) return bCommonTags - aCommonTags;

      // 3. mais recentes
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      if (aDate !== bDate) return bDate - aDate;

      // 4. fallback determinístico pelo ID
      return a.id.localeCompare(b.id);
    })
    .slice(0, 3); // 5. limite de três artigos (nenhuma duplicidade já garantida pelo ID)

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-10 border-t border-dark-100" aria-labelledby="related-articles-title">
      <h2 id="related-articles-title" className="text-xl font-playfair font-bold text-dark-700 mb-6">
        Artigos relacionados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {related.map((article) => (
          <Link
            key={article.id}
            to={`/artigos/${article.slug || article.id}`}
            className="group flex flex-col gap-3 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
          >
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-dark-50">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-accent-500 uppercase tracking-wide">
                {article.subcategory || article.category}
              </span>
              <h3 className="mt-1 text-sm font-semibold text-dark-700 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
