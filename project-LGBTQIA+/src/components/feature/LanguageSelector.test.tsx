import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {
  beforeEach(async () => {
    window.history.replaceState({}, '', '/');
    await i18n.changeLanguage('pt-BR');
  });

  it('troca para espanhol e volta ao português', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.click(screen.getByRole('button', { name: 'Idioma: EN / ES' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'ES — Español' }));
    expect(i18n.resolvedLanguage).toBe('es');
    expect(new URL(window.location.href).searchParams.get('lang')).toBe('es');

    await user.click(screen.getByRole('button', { name: 'Idioma: ES' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'PT — Português' }));
    expect(i18n.resolvedLanguage).toBe('pt-BR');
    expect(new URL(window.location.href).searchParams.get('lang')).toBe('pt-BR');
    expect(screen.getByRole('button', { name: 'Idioma: EN / ES' })).toBeInTheDocument();
  });

  it('exibe as três opções em um menu branco com texto escuro', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'Idioma: EN / ES' }));

    const menu = screen.getByRole('menu', { name: 'Idioma' });
    expect(menu).toHaveStyle({ backgroundColor: '#ffffff', color: '#1f2937' });
    expect(screen.getByRole('menuitemradio', { name: 'EN — English' })).toBeVisible();
    expect(screen.getByRole('menuitemradio', { name: 'ES — Español' })).toBeVisible();
    expect(screen.getByRole('menuitemradio', { name: 'PT — Português' })).toBeVisible();
  });

  it('troca para inglês', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);
    await user.click(screen.getByRole('button', { name: 'Idioma: EN / ES' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'EN — English' }));
    expect(i18n.resolvedLanguage).toBe('en');
  });
});
