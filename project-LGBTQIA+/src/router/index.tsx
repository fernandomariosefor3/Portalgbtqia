import { Suspense, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import routes from "./config";
import { registerNavigate } from "./navigation";

function RouteFallback() {
  return (
    <div className="flex justify-center items-center min-h-[60vh] text-dark-400">
      <span className="inline-flex items-center gap-2 text-sm">
        <i className="ri-loader-4-line animate-spin text-lg" aria-hidden="true" />
        Carregando…
      </span>
    </div>
  );
}

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate]);

  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}
