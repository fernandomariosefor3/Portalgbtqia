import { useState } from 'react';
import type { Article } from '@/mocks/articles-full';
import { Link } from 'react-router-dom';
import { SITE_URL } from '@/components/feature/MultilingualSeo';

interface ArticleSidebarProps {
  article: Article;
}

import TableOfContents from './TableOfContents';

export default function ArticleSidebar({ article }: ArticleSidebarProps) {
  const [copied, setCopied] = useState(false);

  const publicArticleUrl = `${SITE_URL}/artigos/${article.slug}`;
  const shareUrl = publicArticleUrl;
  const shareText = encodeURIComponent(`${article.title} — Portal LGBTQ+ Nordeste`);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const facebookShareUrl = new URL('https://www.facebook.com/sharer/sharer.php');
  facebookShareUrl.searchParams.set('u', publicArticleUrl);
  facebookShareUrl.searchParams.set('quote', article.title);
  facebookShareUrl.searchParams.set('hashtag', '#LGBTQIA');

  return (
    <aside className="space-y-8">
      <TableOfContents />
      <div className="bg-white rounded-xl border border-dark-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={article.authorPhoto}
            alt={article.author}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <span className="block text-sm font-semibold text-dark-700">{article.author}</span>
            <span className="block text-xs text-primary-500">{article.authorRole}</span>
          </div>
        </div>
        <p className="text-sm text-dark-500 leading-relaxed">
          {article.authorBio}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-dark-100 p-5">
        <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
          Transparência editorial
        </h4>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-dark-400">Revisão responsável</dt>
            <dd className="font-medium text-dark-700">
              {article.reviewerName || 'Revisão editorial pendente'}
            </dd>
            {article.reviewerName && <dd className="text-xs text-dark-400">{article.reviewerRole}</dd>}
          </div>
          <div>
            <dt className="text-dark-400">Revisão humana</dt>
            <dd className={article.humanReviewed ? 'text-green-700' : 'text-amber-700'}>
              {article.humanReviewed ? 'Concluída' : 'Ainda não registrada'}
            </dd>
            {article.reviewedAt && (
              <dd className="text-xs text-dark-400">
                Em {new Date(article.reviewedAt).toLocaleDateString('pt-BR')}
              </dd>
            )}
          </div>
          {article.aiAssisted && (
            <div>
              <dt className="text-dark-400">Uso de inteligência artificial</dt>
              <dd className="text-dark-600">Texto produzido com auxílio de IA e submetido à revisão editorial humana.</dd>
            </div>
          )}
          {article.regionalContext && (
            <div>
              <dt className="text-dark-400">Contexto regional</dt>
              <dd className="text-dark-600">{article.regionalContext}</dd>
            </div>
          )}
        </dl>
        <div className="mt-4 pt-4 border-t border-dark-100 flex flex-col gap-2 text-sm">
          <Link to="/politica-editorial" className="text-primary-600 hover:underline">Como produzimos conteúdo</Link>
          <Link to="/politica-de-correcoes" className="text-primary-600 hover:underline">Solicitar uma correção</Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-dark-100 p-5">
        <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
          Compartilhar
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={facebookShareUrl.toString()}
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
            <i className={copied ? 'ri-check-line' : 'ri-link'}></i>
          </button>
        </div>
        {copied && (
          <p className="mt-2 text-xs text-accent-500 font-medium">Link copiado!</p>
        )}
      </div>

      {article.tags.length > 0 && (
        <div className="bg-white rounded-xl border border-dark-100 p-5">
          <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
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
    </aside>
  );
}
