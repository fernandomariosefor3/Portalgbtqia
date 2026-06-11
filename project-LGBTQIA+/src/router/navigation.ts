import type { NavigateFunction } from "react-router-dom";

/**
 * Permite acessar a função de navegação do React Router fora de componentes
 * (ex.: em utilitários). Resolvida uma vez que <AppRoutes/> é montado.
 */
let navigateResolver: (navigate: NavigateFunction) => void;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: NavigateFunction;
  }
}

export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

export function registerNavigate(navigate: NavigateFunction) {
  window.REACT_APP_NAVIGATE = navigate;
  navigateResolver(navigate);
}
