import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AdminRoute from "./AdminRoute";

// Code-splitting por rota: cada página vira um chunk separado, carregado
// sob demanda. Isso reduz drasticamente o bundle inicial.
const Home = lazy(() => import("../pages/home/page"));
const AboutPage = lazy(() => import("../pages/about/page"));
const ArticlesPage = lazy(() => import("../pages/articles/page"));
const ArticlePage = lazy(() => import("../pages/article/page"));
const CulturePage = lazy(() => import("../pages/culture/page"));
const CultureCategoryPage = lazy(() => import("../pages/culture-category/page"));
const CultureDetailPage = lazy(() => import("../pages/culture-detail/page"));
const EventsPage = lazy(() => import("../pages/events/page"));
const EventSubmitPage = lazy(() => import("../pages/event-submit/page"));
const EventDetailPage = lazy(() => import("../pages/event-detail/page"));
const HealthPage = lazy(() => import("../pages/health/page"));
const HealthDetailPage = lazy(() => import("../pages/health-detail/page"));
const FamilyPage = lazy(() => import("../pages/family/page"));
const GuidePage = lazy(() => import("../pages/guide/page"));
const SafeSpaceSubmitPage = lazy(() => import("../pages/safe-space-submit/page"));
const RightsPage = lazy(() => import("../pages/rights/page"));
const RoutesPage = lazy(() => import("../pages/routes/page"));
const SosPage = lazy(() => import("../pages/sos/page"));
const ParadesPage = lazy(() => import("../pages/parades/page"));
const EducationPage = lazy(() => import("../pages/education/page"));
const CommunityPage = lazy(() => import("../pages/community/page"));
const AdminPage = lazy(() => import("../pages/admin/page"));
const LoginPage = lazy(() => import("../pages/login/page"));
const NotFound = lazy(() => import("../pages/NotFound"));

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/sobre", element: <AboutPage /> },
  { path: "/artigos", element: <ArticlesPage /> },
  { path: "/artigos/categoria/:category", element: <ArticlesPage /> },
  { path: "/artigos/:slug", element: <ArticlePage /> },
  { path: "/cultura", element: <CulturePage /> },
  { path: "/cultura/cinema", element: <CultureCategoryPage /> },
  { path: "/cultura/series", element: <CultureCategoryPage /> },
  { path: "/cultura/musica", element: <CultureCategoryPage /> },
  { path: "/cultura/drag", element: <CultureCategoryPage /> },
  { path: "/cultura/:slug", element: <CultureDetailPage /> },
  { path: "/eventos", element: <EventsPage /> },
  { path: "/eventos/submeter", element: <EventSubmitPage /> },
  { path: "/eventos/:slug", element: <EventDetailPage /> },
  { path: "/saude", element: <HealthPage /> },
  { path: "/saude/prep-pep", element: <HealthPage /> },
  { path: "/saude/saude-mental", element: <HealthPage /> },
  { path: "/saude/saude-trans", element: <HealthPage /> },
  { path: "/saude/educacao-sexual", element: <HealthPage /> },
  { path: "/saude/:slug", element: <HealthDetailPage /> },
  { path: "/familia", element: <FamilyPage /> },
  { path: "/guia-fortaleza", element: <GuidePage /> },
  { path: "/guia-fortaleza/indicar", element: <SafeSpaceSubmitPage /> },
  { path: "/direitos", element: <RightsPage /> },
  { path: "/roteiros", element: <RoutesPage /> },
  { path: "/sos", element: <SosPage /> },
  { path: "/paradas", element: <ParadesPage /> },
  { path: "/educacao", element: <EducationPage /> },
  { path: "/comunidade", element: <CommunityPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/admin", element: <AdminRoute><AdminPage /></AdminRoute> },
  { path: "*", element: <NotFound /> },
];

export default routes;
