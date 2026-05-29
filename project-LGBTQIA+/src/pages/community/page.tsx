import { Link } from "react-router-dom";

const features = [
  {
    icon: "ri-message-3-line",
    title: "Fórum de discussões",
    desc: "Debata temas como saúde, direitos, cultura e relacionamentos. Um espaço moderado para compartilhar experiências e tirar dúvidas.",
    status: "Em breve",
  },
  {
    icon: "ri-user-heart-line",
    title: "Programa de mentoria",
    desc: "Conecte-se com mentores em áreas como empregabilidade, saúde mental, transição de gênero e empoderamento pessoal.",
    status: "Em breve",
  },
  {
    icon: "ri-chat-smile-2-line",
    title: "Chat seguro",
    desc: "Converse em tempo real com anonimato opcional. Um espaço para desabafar, fazer amizades e encontrar apoio imediato.",
    status: "Em breve",
  },
  {
    icon: "ri-calendar-event-line",
    title: "Encontros presenciais",
    desc: "Cafés, rodas de conversa e atividades sociais organizadas pela comunidade em Fortaleza e região metropolitana.",
    status: "Em breve",
  },
];

const resources = [
  {
    title: "CVV — Centro de Valorização da Vida",
    contact: "188",
    desc: "Apoio emocional gratuito e voluntário 24 horas por dia, 7 dias por semana. Atendimento por telefone, chat e email.",
    link: "https://cvv.org.br",
  },
  {
    title: "Secretaria de Direitos Humanos",
    contact: "Disque 100",
    desc: "Canal oficial do governo federal para denunciar violações de direitos humanos, incluindo LGBTfobia.",
    link: "https://www.gov.br/mdh",
  },
  {
    title: "Disque Saúde",
    contact: "136",
    desc: "Central de atendimento do SUS para agendamentos, informações sobre saúde e encaminhamentos.",
    link: "https://conectesus.saude.gov.br",
  },
];

export default function CommunityPage() {
  return (
    <main className="w-full bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative w-full h-[380px] md:h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://readdy.ai/api/search-image?query=diverse%20group%20of%20people%20holding%20hands%20in%20circle%20community%20gathering%20indoor%20soft%20warm%20lighting%20authentic%20friendship%20unity%20editorial%20photography%20top%20view%20artistic%20composition&width=1200&height=480&seq=comhero&orientation=landscape")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
          <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-5">
            Comunidade
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white leading-tight max-w-3xl">
            Juntos somos <span className="italic text-secondary-300">mais fortes</span>
          </h1>
          <p className="mt-4 md:mt-5 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Fórum, mentoria, recursos de apoio e uma rede de conexão para a comunidade LGBTQ+ do Nordeste.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
            O que está por vir
          </h2>
          <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
            Estamos construindo ferramentas para conectar, acolher e fortalecer nossa comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl md:rounded-2xl border border-dark-100 bg-white p-5 md:p-6 relative"
            >
              <span className="absolute top-4 right-4 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary-50 text-primary-500 border border-primary-100">
                {f.status}
              </span>
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <i className={`${f.icon} text-xl`}></i>
              </div>
              <h3 className="mt-4 text-base md:text-lg font-semibold text-dark-800">{f.title}</h3>
              <p className="mt-2 text-sm text-dark-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="w-full bg-dark-50 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-dark-800 leading-tight">
              Recursos de apoio imediato
            </h2>
            <p className="mt-4 text-sm md:text-base text-dark-500 leading-relaxed">
              Canais oficiais de atendimento para momentos de crise ou necessidade de orientação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {resources.map((r) => (
              <div
                key={r.title}
                className="rounded-xl md:rounded-2xl border border-dark-100 bg-white p-5 md:p-6"
              >
                <div className="flex items-center gap-2">
                  <i className="ri-phone-line text-primary-500 text-lg"></i>
                  <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Ligue agora</span>
                </div>
                <p className="mt-2 text-xl font-playfair font-bold text-dark-800">{r.contact}</p>
                <h3 className="mt-1 text-sm md:text-base font-semibold text-dark-700">{r.title}</h3>
                <p className="mt-2 text-sm text-dark-500 leading-relaxed">{r.desc}</p>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Acessar site <i className="ri-arrow-right-line"></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14 md:py-20">
        <div className="bg-white rounded-xl md:rounded-2xl border border-dark-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-dark-800">
              Quer ser voluntário ou mentor?
            </h3>
            <p className="mt-2 text-sm text-dark-500 leading-relaxed">
              Estamos formando uma rede de apoio com psicólogos, advogados, profissionais de RH e ativistas experientes.
            </p>
          </div>
          <a
            href="mailto:contato@portallgbtq.com.br?subject=Quero ser voluntário"
            className="px-6 py-3 text-sm font-semibold rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors whitespace-nowrap shrink-0"
          >
            Se inscrever
          </a>
        </div>
      </section>
    </main>
  );
}