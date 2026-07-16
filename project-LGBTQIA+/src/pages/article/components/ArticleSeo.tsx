import { useEffect } from 'react';
import { applyMetadata, removeJsonLd, setJsonLd, SITE_NAME, SITE_URL } from '@/components/feature/MultilingualSeo';
import { categoryLabels, type Article } from '@/mocks/articles-full';

export default function ArticleSeo({ article }: { article: Article }) {
  useEffect(() => {
    const url = `${SITE_URL}/artigos/${encodeURIComponent(article.slug)}`;
    const description = article.excerpt.slice(0, 160);
    const category = categoryLabels[article.category] || article.category;

    applyMetadata({
      title: `${article.title} | ${SITE_NAME}`,
      description,
      url,
      image: article.image,
      type: 'article',
    });
    setJsonLd('article', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${url}#article`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          headline: article.title,
          description,
          image: [article.image],
          datePublished: article.date,
          dateModified: article.updatedAt || article.date,
          inLanguage: 'pt-BR',
          articleSection: category,
          keywords: article.tags.join(', '),
          author: { '@type': 'Person', name: article.author },
          editor: article.reviewerName ? { '@type': 'Person', name: article.reviewerName } : undefined,
          citation: article.sources.map((source) => source.url),
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Artigos', item: `${SITE_URL}/artigos` },
            { '@type': 'ListItem', position: 3, name: category, item: `${SITE_URL}/artigos/categoria/${article.category}` },
            { '@type': 'ListItem', position: 4, name: article.title, item: url },
          ],
        },
      ],
    });
    return () => removeJsonLd('article');
  }, [article]);

  return null;
}
