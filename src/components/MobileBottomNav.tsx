import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Bot,
  Menu,
  HardHat,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  userMode?: 'entity' | 'bidder';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  userMode = 'entity',
}) => {
  const isBidder = userMode === 'bidder';

  const navItems = [
    {
      id: isBidder ? 'bidder-hub' : 'dashboard',
      label: isBidder ? 'ड्यासबोर्ड' : 'ड्यासबोर्ड',
      icon: isBidder ? HardHat : LayoutDashboard,
    },
    {
      id: 'methods',
      label: 'विधिहरू',
      icon: Layers,
    },
    {
      id: 'law-corpus',
      label: 'ऐन/नियम',
      icon: BookOpen,
    },
    {
      id: 'procurement-chat',
      label: 'AI सहायक',
      icon: Bot,
    },
  ];

  return (
    <nav
      aria-label="मोबाइल नेभिगेसन बार"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#163e68]/95 backdrop-blur-md border-t border-[#31577b] text-white lg:hidden no-print shadow-lg pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full py-1 px-1 transition-all relative ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-blue-200/80 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-8 h-1 bg-blue-400 rounded-full shadow-sm animate-pulse" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-xs' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center h-full py-1 px-1 text-blue-200/80 hover:text-white transition-all"
          title="सबै मेनु खोल्नुहोस्"
        >
          <div className="p-1 rounded-xl hover:bg-white/10 transition-all">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
            सबै मेनु
          </span>
        </button>
      </div>
    </nav>
  );
};

