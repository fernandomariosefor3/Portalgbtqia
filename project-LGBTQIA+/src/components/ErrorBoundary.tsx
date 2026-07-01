import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Erro não tratado na aplicação:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-playfair font-bold text-dark-700 mb-3">
            Algo deu errado
          </h1>
          <p className="text-sm text-dark-500 leading-relaxed mb-6">
            Ocorreu um erro inesperado ao carregar esta página. Tente recarregar; se o problema
            continuar, entre em contato conosco.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            Recarregar página
          </button>
        </div>
      </div>
    );
  }
}
