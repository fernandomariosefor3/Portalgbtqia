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
    const selector = screen.getByLabelText('Idioma');

    await user.selectOptions(selector, 'es');
    expect(i18n.resolvedLanguage).toBe('es');
    expect(new URL(window.location.href).searchParams.get('lang')).toBe('es');

    await user.selectOptions(selector, 'pt-BR');
    expect(i18n.resolvedLanguage).toBe('pt-BR');
    expect(new URL(window.location.href).searchParams.get('lang')).toBe('pt-BR');
  });

  it('exibe as três opções com texto escuro sobre fundo branco', () => {
    render(<LanguageSelector />);
    const english = screen.getByRole('option', { name: 'EN — English' });
    const spanish = screen.getByRole('option', { name: 'ES — Español' });
    const portuguese = screen.getByRole('option', { name: 'PT — Português' });

    for (const option of [english, spanish, portuguese]) {
      expect(option).toHaveStyle({ backgroundColor: '#ffffff', color: '#1f2937' });
    }
  });

  it('troca para inglês', async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    await user.selectOptions(screen.getByLabelText('Idioma'), 'en');
    expect(i18n.resolvedLanguage).toBe('en');
  });
});
