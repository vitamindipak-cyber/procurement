import React, { useEffect, useRef, useState } from 'react';
import { Bot, GripVertical } from 'lucide-react';

interface Position {
  left: number;
  top: number;
}

function getSavedPosition(): Position | null {
  try {
    const saved = localStorage.getItem('procurement_chat_launcher_position');
    if (!saved) return null;
    const position: unknown = JSON.parse(saved);
    if (
      typeof position === 'object' &&
      position !== null &&
      'left' in position &&
      'top' in position &&
      typeof position.left === 'number' &&
      Number.isFinite(position.left) &&
      typeof position.top === 'number' &&
      Number.isFinite(position.top)
    ) {
      return { left: position.left, top: position.top };
    }
  } catch {
    return null;
  }
  return null;
}

function clampLauncherPosition(left: number, top: number, width: number, height: number): Position {
  const mobileNav = document.querySelector<HTMLElement>('[aria-label="मोबाइल नेभिगेसन बार"]');
  const bottomLimit = mobileNav && getComputedStyle(mobileNav).display !== 'none'
    ? mobileNav.getBoundingClientRect().top - 12
    : window.innerHeight;
  return {
    left: Math.max(0, Math.min(left, window.innerWidth - width)),
    top: Math.max(0, Math.min(top, bottomLimit - height)),
  };
}

export const FloatingProcurementChatLauncher: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const [position, setPosition] = useState<Position | null>(getSavedPosition);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    didMove: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const clampPosition = () => {
      const button = buttonRef.current;
      if (!button) return;
      const { width, height } = button.getBoundingClientRect();
      setPosition((current) => {
        if (!current) return current;
        const clamped = clampLauncherPosition(current.left, current.top, width, height);
        if (clamped.left !== current.left || clamped.top !== current.top) {
          try {
            localStorage.setItem('procurement_chat_launcher_position', JSON.stringify(clamped));
          } catch {
            // The launcher remains visible for this session if storage is unavailable.
          }
        }
        return clamped;
      });
    };
    clampPosition();
    window.addEventListener('resize', clampPosition);
    return () => window.removeEventListener('resize', clampPosition);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
      startX: event.clientX,
      startY: event.clientY,
      didMove: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.didMove && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return;
    drag.didMove = true;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition(clampLauncherPosition(
      event.clientX - drag.offsetX,
      event.clientY - drag.offsetY,
      bounds.width,
      bounds.height,
    ));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.didMove) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextPosition = clampLauncherPosition(
      event.clientX - drag.offsetX,
      event.clientY - drag.offsetY,
      bounds.width,
      bounds.height,
    );
    setPosition(nextPosition);
    try {
      localStorage.setItem('procurement_chat_launcher_position', JSON.stringify(nextPosition));
    } catch {
      // The launcher remains movable for this session if storage is unavailable.
    }
    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="खरिद सहायक खोल्नुहोस्; तानेर स्थान सार्नुहोस्"
      title="खरिद सहायक — तानेर सार्नुहोस्"
      onClick={() => {
        if (!suppressClickRef.current) onOpen();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      style={position ? { left: position.left, top: position.top } : undefined}
      className={`fixed z-40 inline-flex h-12 items-center gap-2 rounded-full border border-blue-200 bg-white px-3 text-blue-800 shadow-lg transition-shadow hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 touch-none sm:h-14 sm:px-4 ${position ? '' : 'bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-3 lg:bottom-6 lg:right-6'
        } cursor-grab active:cursor-grabbing`}
    >
      <Bot className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="hidden text-sm font-bold sm:inline">खरिद सहायक</span>
      <GripVertical className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true" />
    </button>
  );
};
