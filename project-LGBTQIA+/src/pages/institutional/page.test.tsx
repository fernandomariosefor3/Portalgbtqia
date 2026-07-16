import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import InstitutionalPage from './page';

function renderPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <InstitutionalPage />
    </MemoryRouter>,
  );
}

describe('InstitutionalPage', () => {
  it('explica revisão humana e uso de inteligência artificial', () => {
    renderPage('/politica-editorial');
    expect(screen.getByRole('heading', { level: 1, name: 'Política editorial' })).toBeInTheDocument();
    expect(screen.getByText(/Ferramentas de IA podem auxiliar/)).toBeInTheDocument();
    expect(screen.getByText(/precisa de revisão humana/)).toBeInTheDocument();
  });

  it('publica canais claros para correções', () => {
    renderPage('/politica-de-correcoes');
    expect(screen.getByRole('heading', { level: 1, name: 'Política de correções' })).toBeInTheDocument();
    expect(screen.getByText(/contato@portallgbtq.com.br/)).toBeInTheDocument();
    expect(screen.getByText(/Correções materiais recebem uma nota/)).toBeInTheDocument();
  });

  it('mantém privacidade e termos em endereços próprios', () => {
    const { unmount } = renderPage('/privacidade');
    expect(screen.getByRole('heading', { level: 1, name: 'Política de privacidade' })).toBeInTheDocument();
    unmount();
    renderPage('/termos-de-uso');
    expect(screen.getByRole('heading', { level: 1, name: 'Termos de uso' })).toBeInTheDocument();
  });
});
