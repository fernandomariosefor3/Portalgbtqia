import { useState } from 'react';
import { eventCategories } from '@/mocks/events';

interface EventFiltersProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  timeFilter: string;
  onTimeFilterChange: (t: string) => void;
}

const timeFilters = [
  { value: 'todos', label: 'Todas as datas' },
  { value: '7', label: 'Próximos 7 dias' },
  { value: '30', label: 'Próximos 30 dias' },
  { value: '90', label: 'Próximos 3 meses' },
];

const sortOptions = [
  { value: 'date_asc', label: 'Data (mais próxima)' },
  { value: 'date_desc', label: 'Data (mais distante)' },
  { value: 'views', label: 'Mais visualizados' },
  { value: 'newest', label: 'Mais recentes' },
];

export default function EventFilters({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  activeCity,
  onCityChange,
  cities,
  sortBy,
  onSortChange,
  timeFilter,
  onTimeFilterChange,
}: EventFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" aria-hidden="true"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden px-4 py-2.5 text-sm font-medium border border-dark-200 rounded-lg flex items-center justify-center gap-2"
        >
          <i className="ri-filter-3-line" aria-hidden="true"></i>
          Filtros
        </button>
        <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-3`}>
          <select
            value={activeCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="px-3 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
          >
            <option value="todas">Todas as cidades</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select
            value={timeFilter}
            onChange={(e) => onTimeFilterChange(e.target.value)}
            className="px-3 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
          >
            {timeFilters.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2.5 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {eventCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
              activeCategory === cat.value
                ? `${cat.color} text-white`
                : 'bg-white text-dark-600 border border-dark-200 hover:border-primary-300 hover:text-primary-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}