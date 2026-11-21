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
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(9rem+env(safe-area-inset-bottom))] z-40 flex max-w-[100vw] justify-end overflow-x-clip px-3 no-print lg:bottom-24 lg:px-6">
      <button
        type="button"
        onClick={scrollToTop}
        title="माथि जानुहोस् (Scroll to top)"
        aria-label="माथि जानुहोस्"
        className="pointer-events-auto box-border flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-blue-700 p-0 text-white shadow-lg transition-colors duration-200 hover:bg-blue-800 active:scale-95 lg:transition-all lg:hover:scale-105"
      >
        <ArrowUp className="block h-5 w-5 shrink-0" />
      </button>
    </div>
  );
};

