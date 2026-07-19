import { categoryLabels, type Article } from '@/mocks/articles-full';
import { useSearchParams } from 'react-router-dom';

interface ArticleFiltersProps {
  activeCategory: string;
  articles: ReadonlyArray<Pick<Article, 'category'>>;
}

export default function ArticleFilters({ activeCategory, articles }: ArticleFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const available = new Set(articles.map((article) => article.category));
  const categories = ['todas', ...Object.keys(categoryLabels).filter((category) => available.size === 0 || available.has(category))];

  const handleCategoryClick = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'todas') {
      newParams.delete('categoria');
    } else {
      newParams.set('categoria', cat);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const label = cat === 'todas' ? 'Todas' : categoryLabels[cat] || cat;

        return (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            aria-current={isActive ? 'page' : undefined}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isActive
                ? (cat === 'todas' ? 'bg-dark-700 text-white' : 'bg-primary-500 text-white')
                : 'bg-dark-50 text-dark-500 hover:bg-dark-100'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
