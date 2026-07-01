import { allArticles, categoryLabels, categoryColors } from '@/mocks/articles-full';

interface ArticleFiltersProps {
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function ArticleFilters({ activeCategory, onChange }: ArticleFiltersProps) {
  const categories = ['todas', ...Array.from(new Set(allArticles.map((a) => a.category)))];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const label = cat === 'todas' ? 'Todas' : categoryLabels[cat] || cat;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isActive
                ? (cat === 'todas' ? 'bg-dark-700 text-white' : categoryColors[cat]?.replace('100', '400').replace('text-', 'bg-').replace('700', '50').replace('600', '400') || 'bg-primary-500 text-white')
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