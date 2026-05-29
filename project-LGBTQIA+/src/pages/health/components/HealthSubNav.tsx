import { Link } from 'react-router-dom';
import { categoryLabels, categoryIcons } from '@/mocks/health';

interface HealthSubNavProps {
  activeCategory?: string;
}

const categories = [
  { key: 'prep-pep', label: categoryLabels['prep-pep'], path: '/saude/prep-pep' },
  { key: 'saude-mental', label: categoryLabels['saude-mental'], path: '/saude/saude-mental' },
  { key: 'saude-trans', label: categoryLabels['saude-trans'], path: '/saude/saude-trans' },
  { key: 'educacao-sexual', label: categoryLabels['educacao-sexual'], path: '/saude/educacao-sexual' },
];

export default function HealthSubNav({ activeCategory }: HealthSubNavProps) {
  return (
    <div className="w-full border-b border-dark-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex items-center gap-1 overflow-x-auto py-3">
          <Link
            to="/saude"
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              !activeCategory
                ? 'bg-dark-700 text-white'
                : 'text-dark-600 hover:bg-dark-50'
            }`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={cat.path}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? 'bg-dark-700 text-white'
                  : 'text-dark-600 hover:bg-dark-50'
              }`}
            >
              <i className={`${categoryIcons[cat.key as keyof typeof categoryIcons]} text-sm`}></i>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}