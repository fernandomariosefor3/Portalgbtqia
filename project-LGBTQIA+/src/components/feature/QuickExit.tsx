import { useEffect } from 'react';

export default function QuickExit() {
  const handleExit = () => {
    // Replace the current history state and navigate away immediately
    window.location.replace('https://www.google.com');
  };

  useEffect(() => {
    // Escape key listener (triple tap)
    let escCount = 0;
    let escTimeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        escCount++;
        if (escCount >= 3) {
          handleExit();
        }
        
        clearTimeout(escTimeout);
        escTimeout = setTimeout(() => {
          escCount = 0;
        }, 1000); // Reset if not pressed 3 times within 1 second
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(escTimeout);
    };
  }, []);

  return (
    <button
      onClick={handleExit}
      title="Sair Rapidamente (ESC 3x)"
      className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-5 md:py-3 rounded-full bg-red-600 text-white font-bold shadow-2xl hover:bg-red-700 hover:scale-105 transition-all group border-2 border-white/20"
      aria-label="Sair rapidamente e esconder página"
    >
      <i className="ri-logout-box-r-line text-xl md:mr-2"></i>
      <span className="hidden md:inline uppercase tracking-widest text-xs">Sair Rapidamente</span>
    </button>
  );
}
