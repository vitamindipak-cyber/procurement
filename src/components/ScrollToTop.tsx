import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="माथि जानुहोस् (Scroll to top)"
      aria-label="माथि जानुहोस्"
      className="fixed bottom-[calc(9rem+env(safe-area-inset-bottom))] right-4 z-40 box-border max-w-[calc(100vw-2rem)] rounded-full border border-white/20 bg-blue-700 p-2.5 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-800 active:scale-95 no-print lg:bottom-24 lg:right-6"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

