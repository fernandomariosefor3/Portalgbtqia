import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { typeColors, typeIcons } from '@/mocks/culture';

interface CultureSubNavProps {
  activeType?: string;
}

export default function CultureSubNav({ activeType }: CultureSubNavProps) {
  const { t } = useTranslation();
  const types = [
    { key: 'cinema', label: t('culture.type.cinema'), path: '/cultura/cinema' },
    { key: 'series', label: t('culture.type.series'), path: '/cultura/series' },
    { key: 'musica', label: t('culture.type.musica'), path: '/cultura/musica' },
    { key: 'drag', label: t('culture.type.drag'), path: '/cultura/drag' },
  ];

  return (
    <div className="w-full border-b border-dark-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex items-center gap-1 overflow-x-auto py-3">
          <Link
            to="/cultura"
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              !activeType
                ? 'bg-dark-700 text-white'
                : 'text-dark-600 hover:bg-dark-50'
            }`}
          >
            {t('culture.all')}
          </Link>
          {types.map((t) => (
            <Link
              key={t.key}
              to={t.path}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeType === t.key
                  ? `${typeColors[t.key]} ring-1 ring-inset`
                  : 'text-dark-600 hover:bg-dark-50'
              }`}
            >
              <i className={`${typeIcons[t.key]} text-sm`}></i>
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}