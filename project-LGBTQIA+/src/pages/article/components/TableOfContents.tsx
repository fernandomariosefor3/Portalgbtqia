import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    const elements = Array.from(articleContent.querySelectorAll('h2'));
    const newHeadings = elements.map((el, index) => {
      // Add id to the element if it doesn't have one
      if (!el.id) {
        el.id = `heading-${index}`;
      }
      return {
        id: el.id,
        text: el.textContent || '',
      };
    }).filter(h => h.text.trim().length > 0);

    setHeadings(newHeadings);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-dark-100 p-5 mb-8">
      <h4 className="text-sm font-semibold text-dark-700 uppercase tracking-wider mb-4">
        Sumário
      </h4>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-dark-500 hover:text-primary-600 hover:underline transition-colors block leading-snug"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
