import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CultureItem } from '@/mocks/culture';
import { getRelatedCulture, typeLabels, typeColors, typeIcons } from '@/mocks/culture';

interface CultureSidebarProps {
  item: CultureItem;
  /** Itens relacionados (do mesmo pool de dados). Se omitido, usa os mocks. */
  related?: CultureItem[];
}

export default function CultureSidebar({ item, related: relatedProp }: CultureSidebarProps) {
  const related = relatedProp ?? getRelatedCulture(item, 3);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(`${item.title} — Portal LGBTQ+ Nordeste`);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <aside className="space-y-8">
      <div className="bg-white rounded-xl border border-dark-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={item.authorPhoto}
            alt={item.author}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <span className="block text-sm font-semibold text-dark-700">{item.author}</span>
            <span className="block text-xs text-primary-500">{item.authorRole}</span>
          </div>
        </div>
        <p className="text-sm text-dark-500 leading-relaxed">
          {item.authorBio}
        </p>
      </div>

      {(item.director || item.cast || item.genre || item.platform || item.albums || item.performer) && (
        <div className="bg-white rounded-xl border border-dark-100 p-5">
          <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
            Ficha técnica
          </h4>
          <div className="space-y-3 text-sm">
            {item.director && (
              <div>
                <span className="block text-xs text-dark-400">Direção</span>
                <span className="block font-medium text-dark-700">{item.director}</span>
              </div>
            )}
            {item.performer && (
              <div>
                <span className="block text-xs text-dark-400">Artista/Performer</span>
                <span className="block font-medium text-dark-700">{item.performer}</span>
              </div>
            )}
            {item.cast && item.cast.length > 0 && (
              <div>
                <span className="block text-xs text-dark-400">Elenco</span>
                <span className="block font-medium text-dark-700">{item.cast.join(', ')}</span>
              </div>
            )}
            {item.genre && item.genre.length > 0 && (
              <div>
                <span className="block text-xs text-dark-400">Gênero</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.genre.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded-full text-xs bg-dark-50 text-dark-600">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.platform && (
              <div>
                <span className="block text-xs text-dark-400">Plataforma</span>
                <span className="block font-medium text-dark-700">{item.platform}</span>
              </div>
            )}
            {item.albums && item.albums.length > 0 && (
              <div>
                <span className="block text-xs text-dark-400">Álbuns</span>
                <ul className="mt-1 space-y-1">
                  {item.albums.map((a) => (
                    <li key={a} className="font-medium text-dark-700">{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.year && (
              <div>
                <span className="block text-xs text-dark-400">Ano</span>
                <span className="block font-medium text-dark-700">{item.year}</span>
              </div>
            )}
            {item.rating && (
              <div>
                <span className="block text-xs text-dark-400">Avaliação</span>
                <span className="flex items-center gap-1 font-medium text-dark-700">
                  <i className="ri-star-fill text-secondary-400" aria-hidden="true"></i>
                  {item.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-dark-100 p-5">
        <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
          Compartilhar
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-700 text-white hover:bg-primary-400 transition-colors"
            aria-label="Compartilhar no Facebook"
          >
            <i className="ri-facebook-fill" aria-hidden="true"></i>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-700 text-white hover:bg-primary-400 transition-colors"
            aria-label="Compartilhar no Twitter"
          >
            <i className="ri-twitter-x-fill" aria-hidden="true"></i>
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-700 text-white hover:bg-primary-400 transition-colors"
            aria-label="Compartilhar no WhatsApp"
          >
            <i className="ri-whatsapp-line" aria-hidden="true"></i>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-700 text-white hover:bg-primary-400 transition-colors"
            aria-label="Compartilhar no LinkedIn"
          >
            <i className="ri-linkedin-fill" aria-hidden="true"></i>
          </a>
          <button
            onClick={handleCopy}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-700 text-white hover:bg-primary-400 transition-colors cursor-pointer"
            aria-label="Copiar link"
          >
            <i className={copied ? 'ri-check-line' : 'ri-link'} aria-hidden="true"></i>
          </button>
        </div>
        {copied && (
          <p className="mt-2 text-xs text-accent-500 font-medium">Link copiado!</p>
        )}
      </div>

      {item.tags.length > 0 && (
        <div className="bg-white rounded-xl border border-dark-100 p-5">
          <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-dark-50 text-dark-500 hover:bg-primary-50 hover:text-primary-500 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="bg-white rounded-xl border border-dark-100 p-5">
          <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
            Leia também
          </h4>
          <div className="space-y-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/cultura/${rel.slug}`}
                className="group flex gap-3 items-start"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mb-1 ${typeColors[rel.type]}`}>
                    <i className={`${typeIcons[rel.type]} text-[10px]`} aria-hidden="true"></i>
                    {typeLabels[rel.type]}
                  </span>
                  <h5 className="text-sm font-medium text-dark-700 leading-snug group-hover:text-primary-500 transition-colors line-clamp-2">
                    {rel.title}
                  </h5>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}