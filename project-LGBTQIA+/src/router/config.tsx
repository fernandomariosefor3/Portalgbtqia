import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import AboutPage from "../pages/about/page";
import AdminPage from "../pages/admin/page";
import CommunityPage from "../pages/community/page";
import CultureCategoryPage from "../pages/culture-category/page";
import CultureDetailPage from "../pages/culture-detail/page";
import CulturePage from "../pages/culture/page";
import EducationPage from "../pages/education/page";
import EventDetailPage from "../pages/event-detail/page";
import EventSubmitPage from "../pages/event-submit/page";
import EventsPage from "../pages/events/page";
import FamilyPage from "../pages/family/page";
import GuidePage from "../pages/guide/page";
import HealthDetailPage from "../pages/health-detail/page";
import HealthPage from "../pages/health/page";
import Home from "../pages/home/page";
import ArticlePage from "../pages/article/page";
import ArticlesPage from "../pages/articles/page";
import ParadesPage from "../pages/parades/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/sobre", element: <AboutPage /> },
  { path: "/artigos", element: <ArticlesPage /> },
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
  { path: "/paradas", element: <ParadesPage /> },
  { path: "/educacao", element: <EducationPage /> },
  { path: "/comunidade", element: <CommunityPage /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
