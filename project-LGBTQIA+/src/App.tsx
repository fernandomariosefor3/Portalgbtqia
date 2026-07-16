import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Navbar from "./components/feature/Navbar";
import Footer from "./components/feature/Footer";
import MusicPlayer from "./components/feature/MusicPlayer";
import MultilingualSeo from "./components/feature/MultilingualSeo";
import ManagedPageBlocks from "./components/feature/ManagedPageBlocks";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <MultilingualSeo />
        <div className="flex flex-col min-h-screen">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary-500 focus:text-white focus:shadow-lg"
          >
            Pular para o conteúdo
          </a>
          <Navbar />
          <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <AppRoutes />
            <ManagedPageBlocks />
          </div>
          <Footer />
          <MusicPlayer />
          <Analytics />
          <SpeedInsights />
        </div>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
