import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  useAuth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from '@/lib/auth';

type Mode = 'login' | 'signup';

/** Traduz códigos de erro do Firebase Auth para mensagens amigáveis em PT-BR. */
function friendlyError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Tente entrar.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/popup-closed-by-user':
      return 'Janela de login fechada antes de concluir.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    default:
      return 'Não foi possível concluir. Tente novamente.';
  }
}

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/';

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Se já estiver logado, redireciona.
  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
      } else {
        if (!name.trim()) {
          setError('Informe seu nome.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, name.trim());
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-50 px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-playfair font-bold text-dark-700"
          >
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-500 text-white">
              <i className="ri-rainbow-line" aria-hidden="true"></i>
            </span>
            Portal LGBTQ+
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-dark-700">
            {mode === 'login' ? 'Entrar na sua conta' : 'Criar uma conta'}
          </h1>
          <p className="mt-1 text-sm text-dark-500">
            {mode === 'login'
              ? 'Acesse para participar da comunidade.'
              : 'Junte-se à comunidade do Portal.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-dark-100 shadow-sm p-6 md:p-8">
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2.5 text-sm text-rose-700"
            >
              <i className="ri-error-warning-line mt-0.5" aria-hidden="true"></i>
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full border border-dark-200 text-dark-700 hover:bg-dark-50 transition-colors disabled:opacity-60"
          >
            <i className="ri-google-fill text-base" aria-hidden="true"></i>
            Continuar com Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-dark-400">
            <span className="flex-1 h-px bg-dark-100" />
            ou
            <span className="flex-1 h-px bg-dark-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-600 mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-600 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400"
                placeholder="voce@exemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-600 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-60"
            >
              {loading && (
                <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i>
              )}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-500">
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="font-medium text-primary-500 hover:text-primary-600"
            >
              {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
