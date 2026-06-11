import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

/**
 * Protege rotas administrativas: exige usuário autenticado E com permissão
 * de admin (papel `role: 'admin'` no perfil, ou e-mail do fundador).
 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-dark-500">
        Carregando…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
