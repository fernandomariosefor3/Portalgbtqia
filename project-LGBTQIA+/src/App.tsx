import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Navbar from "./components/feature/Navbar";
import Footer from "./components/feature/Footer";
import MusicPlayer from "./components/feature/MusicPlayer";
import { handleGoogleRedirect } from "./lib/auth";

function App() {
  useEffect(() => {
    handleGoogleRedirect();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <AppRoutes />
          </div>
          <Footer />
          <MusicPlayer />
        </div>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;