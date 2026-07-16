import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setMessage('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setStatus('loading');
      
      // Verificar se já existe
      const q = query(collection(db, 'newsletter_subscribers'), where('email', '==', email.trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setStatus('error');
        setMessage('Este e-mail já está inscrito.');
        return;
      }

      // Adicionar novo
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
        source: 'footer'
      });

      setStatus('success');
      setMessage('Inscrição confirmada com sucesso!');
      setEmail('');
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setStatus('error');
      setMessage('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
        Newsletter
      </h4>
      <p className="text-sm text-white/60 mb-4">
        Receba nossa curadoria de notícias, eventos e cultura LGBTQ+ diretamente no seu e-mail.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder="Seu melhor e-mail"
            disabled={status === 'loading'}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm disabled:opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="w-full px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <i className="ri-loader-4-line animate-spin"></i>
          ) : (
            <>
              <i className="ri-mail-send-line"></i> Inscrever
            </>
          )}
        </button>
        {status === 'success' && (
          <p className="text-xs text-emerald-400 mt-1">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-rose-400 mt-1">{message}</p>
        )}
      </form>
    </div>
  );
}
