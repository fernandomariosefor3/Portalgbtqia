import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFarol } from '@/lib/useFarol';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

const suggestedQuestions = [
  'Onde encontro PrEP perto de mim?',
  'Sofri discriminação no trabalho. O que devo guardar como prova?',
  'Quais eventos LGBTQIA+ acontecem em Fortaleza neste mês?',
  'Explique PEP de maneira simples.',
];

export default function FarolPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Olá! Eu sou o **Farol LGBTQIA+**. **Demonstração:** este assistente utiliza respostas previamente configuradas e ainda não está conectado a inteligência artificial, serviços ou bases verificadas. Não utilize estas informações como aconselhamento médico, jurídico ou de emergência.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { searchKnowledge, loading } = useFarol();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Fetch response from Firebase hook
    setTimeout(() => {
      if (loading) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Ainda estou carregando minha base de conhecimento. Tente novamente em alguns instantes.' }]);
        setIsTyping(false);
        return;
      }

      const knowledge = searchKnowledge(text);
      let replyContent = "Desculpe, ainda não encontrei uma resposta curada para essa pergunta na minha base de dados. Tente usar outras palavras-chave ou acesse o Guia SOS para ajuda humana.";
      
      if (knowledge) {
        replyContent = knowledge.response_template;
        if (knowledge.official_source_name) {
          replyContent += `\n\n*Fonte: ${knowledge.official_source_name}*`;
        }
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: replyContent }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <main className="w-full min-h-screen bg-surface font-inter pt-16 md:pt-20 pb-10 flex flex-col">
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-10 py-6 flex flex-col h-full">
        <div className="bg-white rounded-2xl shadow-sm border border-dark-100 flex-1 flex flex-col overflow-hidden h-[calc(100vh-160px)] min-h-[500px]">
          
          {/* Header */}
          <div className="px-6 py-4 bg-primary-600 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i className="ri-robot-2-line text-xl"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg leading-tight">Farol LGBTQIA+</h1>
                  <span className="px-1.5 py-0.5 bg-amber-500 text-dark-800 text-[10px] font-bold uppercase rounded">Protótipo</span>
                </div>
                <p className="text-xs text-white/80">Demonstração visual do assistente</p>
              </div>
            </div>
            <Link to="/sos" className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
              <i className="ri-alarm-warning-line mr-1"></i> Falar com Humano
            </Link>
          </div>

          {/* Legal Warning */}
          <div className="bg-amber-50 px-6 py-3 border-b border-amber-100 flex items-start gap-3 shrink-0">
            <i className="ri-information-line text-amber-600 mt-0.5"></i>
            <p className="text-xs text-amber-800 leading-relaxed">
              O Farol consulta cartilhas, leis e dados governamentais, mas <strong>não substitui diagnóstico médico ou aconselhamento jurídico individual</strong>. Se houver divergência, acione os órgãos oficiais.
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-dark-800 text-white rounded-tr-sm' 
                    : 'bg-white border border-dark-100 text-dark-700 shadow-sm rounded-tl-sm'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-dark-100 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-dark-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-dark-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-dark-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-6 pb-2 shrink-0 bg-surface-50">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(q)}
                    className="px-3 py-1.5 text-xs text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-full transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-dark-100 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                placeholder="Pergunte ao Farol..."
                className="w-full bg-dark-50 border border-dark-200 rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full bg-primary-500 text-white disabled:opacity-50 disabled:bg-dark-300 hover:bg-primary-600 transition-colors"
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
