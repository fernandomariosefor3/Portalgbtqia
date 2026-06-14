import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-dark-700 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-playfair font-bold">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-400 text-white text-sm">
                <i className="ri-rainbow-line" aria-hidden="true"></i>
              </span>
              Portal LGBTQ+
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Informação, cultura, saúde e comunidade para pessoas LGBTQ+ no Nordeste do Brasil.
              Um espaço seguro de representatividade e acolhimento.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <i className="ri-instagram-line" aria-hidden="true"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="Twitter"
              >
                <i className="ri-twitter-x-line" aria-hidden="true"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="YouTube"
              >
                <i className="ri-youtube-line" aria-hidden="true"></i>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="TikTok"
              >
                <i className="ri-tiktok-line" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Seções
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/artigos" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Artigos & Opinião</Link></li>
              <li><Link to="/cultura" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Cultura</Link></li>
              <li><Link to="/eventos" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Eventos & Agenda</Link></li>
              <li><Link to="/saude" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Saúde</Link></li>
              <li><Link to="/familia" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Família</Link></li>
              <li><Link to="/guia-fortaleza" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Guia CE</Link></li>
              <li><Link to="/paradas" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Paradas & Datas</Link></li>
              <li><Link to="/educacao" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Educação</Link></li>
              <li><Link to="/comunidade" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Comunidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Institucional
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/sobre" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Sobre o portal</Link></li>
              <li><a href="mailto:contato@portallgbtq.com.br" className="text-sm text-white/60 hover:text-primary-300 transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <i className="ri-map-pin-line mt-0.5 text-primary-300" aria-hidden="true"></i>
                <span>Fortaleza, Ceará — Brasil</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <i className="ri-mail-line mt-0.5 text-primary-300" aria-hidden="true"></i>
                <span>contato@portallgbtq.com.br</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 text-center sm:text-left">
            © 2026 Portal LGBTQ+ Nordeste. Todos os direitos reservados.{" "}
            Criado por{" "}
            <a
              href="/sobre"
              className="text-white/60 hover:text-primary-300 transition-colors"
            >
              Fernando Mário da Silva Martins
            </a>
            .
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link to="/sobre" className="hover:text-white/60 transition-colors">Privacidade</Link>
            <Link to="/sobre" className="hover:text-white/60 transition-colors">Termos</Link>
            <Link to="/sobre" className="hover:text-white/60 transition-colors">Acessibilidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}