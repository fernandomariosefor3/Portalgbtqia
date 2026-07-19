import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AdminRoute from "./AdminRoute";

// Code-splitting
const Home = lazy(() => import("../pages/home/page"));
const AboutPage = lazy(() => import("../pages/about/page"));
const InstitutionalPage = lazy(() => import("../pages/institutional/page"));
const ArticlesPage = lazy(() => import("../pages/articles/page"));
const ArticlePage = lazy(() => import("../pages/article/page"));
const EventsPage = lazy(() => import("../pages/events/page"));
const EventSubmitPage = lazy(() => import("../pages/event-submit/page"));
const EventDetailPage = lazy(() => import("../pages/event-detail/page"));
const GuidePage = lazy(() => import("../pages/guide/page"));
const SafeSpaceSubmitPage = lazy(() => import("../pages/safe-space-submit/page"));
const RoutesPage = lazy(() => import("../pages/routes/page"));
const SosPage = lazy(() => import("../pages/sos/page"));
const ParadesPage = lazy(() => import("../pages/parades/page"));
const CommunityPage = lazy(() => import("../pages/community/page"));
const AdminPage = lazy(() => import("../pages/admin/page"));
const LoginPage = lazy(() => import("../pages/login/page"));
const FavoritesPage = lazy(() => import("../pages/favorites/page"));
const LibrasPage = lazy(() => import("../pages/libras/page"));
const ObservatoryPage = lazy(() => import("../pages/observatory/page"));
const FarolPage = lazy(() => import("../pages/farol/page"));
const OpportunitiesPage = lazy(() => import("../pages/opportunities/page"));
const NotFound = lazy(() => import("../pages/NotFound"));

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  
  // Institucionais
  { path: "/quem-somos", element: <AboutPage /> },
  { path: "/sobre", element: <Navigate to="/quem-somos" replace /> },
  { path: "/politica-editorial", element: <InstitutionalPage /> },
  { path: "/nossas-fontes", element: <InstitutionalPage /> },
  { path: "/politica-de-correcoes", element: <InstitutionalPage /> },
  { path: "/contato", element: <InstitutionalPage /> },
  { path: "/privacidade", element: <InstitutionalPage /> },
  { path: "/termos-de-uso", element: <InstitutionalPage /> },
  
  // Editorial Principal
  { path: "/artigos", element: <ArticlesPage /> },
  { path: "/artigos/categoria/:category", element: <Navigate to="/artigos" replace /> },
  { path: "/artigos/:slug", element: <ArticlePage /> },
  
  // Redirecionamentos de Temas para Categoria (Fase 6A)
  { path: "/cultura", element: <Navigate to="/artigos?categoria=cultura" replace /> },
  { path: "/cultura/:slug", element: <Navigate to="/artigos" replace /> },
  { path: "/saude", element: <Navigate to="/artigos?categoria=saude" replace /> },
  { path: "/saude/:slug", element: <Navigate to="/artigos" replace /> },
  { path: "/direitos", element: <Navigate to="/artigos?categoria=direitos" replace /> },
  { path: "/familia", element: <Navigate to="/artigos?categoria=familia" replace /> },
  { path: "/educacao", element: <Navigate to="/artigos?categoria=educacao" replace /> },

  // Rotas mantidas mas ocultas da navegação principal
  { path: "/eventos", element: <EventsPage /> },
  { path: "/eventos/submeter", element: <EventSubmitPage /> },
  { path: "/eventos/:slug", element: <EventDetailPage /> },
  { path: "/guia-fortaleza", element: <GuidePage /> },
  { path: "/guia-fortaleza/indicar", element: <SafeSpaceSubmitPage /> },
  { path: "/roteiros", element: <RoutesPage /> },
  { path: "/sos", element: <SosPage /> },
  { path: "/paradas", element: <ParadesPage /> },
  { path: "/comunidade", element: <CommunityPage /> },
  { path: "/libras", element: <LibrasPage /> },
  { path: "/observatorio", element: <ObservatoryPage /> },
  { path: "/farol", element: <FarolPage /> },
  { path: "/oportunidades", element: <OpportunitiesPage /> },
  
  // Admin & User
  { path: "/login", element: <LoginPage /> },
  { path: "/favoritos", element: <FavoritesPage /> },
  { path: "/admin", element: <AdminRoute><AdminPage /></AdminRoute> },
  
  // 404
  { path: "*", element: <NotFound /> },
];

export default routes;
