import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface BeginnerTooltipProps {
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const BeginnerTooltip: React.FC<BeginnerTooltipProps> = ({
  title,
  content,
  position = 'right',
  showIcon = true,
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div className={`relative inline-flex ${className}`} ref={tooltipRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={children
          ? 'inline-flex rounded-full transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700'
          : 'inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors'}
        aria-expanded={isOpen}
        aria-label={children ? `${title} को अर्थ देखाउनुहोस्` : 'सहायता देखाउनुहोस्'}
      >
        {children || <HelpCircle className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-[min(18rem,calc(100vw-2rem))] bg-white rounded-xl border border-blue-200 shadow-lg p-4 ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="बन्द गर्नुहोस्"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

// Simplified inline help text component for beginners
interface BeginnerHelpTextProps {
  title: string;
  content: string;
  variant?: 'info' | 'warning' | 'success' | 'risk';
  showIcon?: boolean;
}

export const BeginnerHelpText: React.FC<BeginnerHelpTextProps> = ({
  title,
  content,
  variant = 'info',
  showIcon = true,
}) => {
  const variantStyles = {
    info: 'ui-guidance',
    warning: 'ui-attention',
    success: 'ui-safe',
    risk: 'ui-risk',
  };

  const icons = {
    info: HelpCircle,
    warning: HelpCircle,
    success: HelpCircle,
    risk: HelpCircle,
  };

  const Icon = icons[variant];

  return (
    <div className={`rounded-lg border p-3 flex items-start gap-2.5 ${variantStyles[variant]}`}>
      {showIcon && (
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/50 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs font-bold mb-0.5">{title}</p>
        <p className="text-xs leading-relaxed">{content}</p>
      </div>
    </div>
  );
};
