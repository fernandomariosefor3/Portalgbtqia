import { categoryLabels, categoryColors, type Article } from '@/mocks/articles-full';
import { Link } from 'react-router-dom';

interface ArticleFiltersProps {
  activeCategory: string;
  onNavigate: () => void;
  articles: ReadonlyArray<Pick<Article, 'category'>>;
}

export default function ArticleFilters({ activeCategory, onNavigate, articles }: ArticleFiltersProps) {
  const available = new Set(articles.map((article) => article.category));
  const categories = ['todas', ...Object.keys(categoryLabels).filter((category) => available.size === 0 || available.has(category))];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const label = cat === 'todas' ? 'Todas' : categoryLabels[cat] || cat;

        return (
          <Link
            key={cat}
            to={cat === 'todas' ? '/artigos' : `/artigos/categoria/${cat}`}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isActive
                ? (cat === 'todas' ? 'bg-dark-700 text-white' : categoryColors[cat]?.replace('100', '400').replace('text-', 'bg-').replace('700', '50').replace('600', '400') || 'bg-primary-500 text-white')
                : 'bg-dark-50 text-dark-500 hover:bg-dark-100'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
