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
      className="fixed bottom-20 lg:bottom-6 right-5 z-40 p-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border border-white/20 no-print"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

