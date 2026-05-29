import { useLocation, Link } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-gray-50 select-none pointer-events-none z-0">
        404
      </h1>
      <div className="relative z-10">
        <h1 className="text-xl md:text-2xl font-semibold mt-6">Esta página ainda não existe</h1>
        <p className="mt-2 text-base text-gray-400 font-mono">{location.pathname}</p>
        <p className="mt-4 text-lg md:text-xl text-gray-500">Verifique o endereço ou volte para a página inicial.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors"
        >
          <i className="ri-arrow-left-line"></i>
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}