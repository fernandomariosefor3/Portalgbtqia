import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

/**
 * Protege rotas administrativas: exige usuário autenticado E com permissão
 * de admin (papel `role: 'admin'` no perfil, ou e-mail do fundador).
 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-dark-500">
        Carregando…
      </div>
    );
  }

  // Não autenticado → vai para o login e volta para cá após entrar.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Autenticado mas sem permissão de admin → volta para a home.
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
