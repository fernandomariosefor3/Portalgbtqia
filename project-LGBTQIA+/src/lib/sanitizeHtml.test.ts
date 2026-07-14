// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('removes executable markup and unsafe attributes', () => {
    const html = '<h2 onclick="alert(1)">Título</h2><script>alert(1)</script><img src="x" onerror="alert(1)">';
    const sanitized = sanitizeHtml(html);

    expect(sanitized).toContain('<h2>Título</h2>');
    expect(sanitized).not.toContain('script');
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('onerror');
  });

  it('keeps safe editorial markup and strips forbidden forms and inline styles', () => {
    const html = '<p style="color:red">Texto <strong>importante</strong></p><form><input value="segredo"></form>';
    const sanitized = sanitizeHtml(html);

    expect(sanitized).toContain('<p>Texto <strong>importante</strong></p>');
    expect(sanitized).not.toContain('style=');
    expect(sanitized).not.toContain('<form');
    expect(sanitized).not.toContain('<input');
  });
});
