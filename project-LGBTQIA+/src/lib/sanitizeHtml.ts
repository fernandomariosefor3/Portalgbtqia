import createDOMPurify from 'dompurify';
const DOMPurify = createDOMPurify(window);

const SANITIZE_OPTIONS = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'form', 'input', 'button'],
  FORBID_ATTR: ['style'],
};

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_OPTIONS);
}
