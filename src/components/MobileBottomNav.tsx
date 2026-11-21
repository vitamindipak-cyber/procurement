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
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 text-slate-500 lg:hidden no-print shadow-[0_-10px_30px_-22px_rgba(15,28,46,0.35)] pb-[env(safe-area-inset-bottom)]"
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
                  ? 'text-[#123f6d] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#eff5fc] text-[#123f6d]' : 'text-slate-400'
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
          className="flex flex-col items-center justify-center h-full py-1 px-1 text-slate-500 hover:text-slate-800 transition-all"
          title="सबै मेनु खोल्नुहोस्"
        >
          <div className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
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

