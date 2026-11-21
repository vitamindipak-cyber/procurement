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
      className="fixed inset-x-0 bottom-0 z-40 box-border overflow-x-clip border-t border-slate-200/80 bg-white/95 text-slate-500 shadow-[0_-10px_30px_-22px_rgba(15,28,46,0.35)] backdrop-blur-md no-print lg:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid h-16 w-full max-w-lg grid-cols-[repeat(5,minmax(0,1fr))] items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex h-full w-full min-w-0 flex-col items-center justify-center overflow-hidden px-1 py-1 transition-all ${
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
                <Icon className="h-5 w-5 shrink-0" />
              </div>
              <span className="mt-0.5 block w-full min-w-0 truncate text-center text-[10px] tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-full w-full min-w-0 flex-col items-center justify-center overflow-hidden px-1 py-1 text-slate-500 transition-all hover:text-slate-800"
          title="सबै मेनु खोल्नुहोस्"
        >
          <div className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
            <Menu className="h-5 w-5 shrink-0" />
          </div>
          <span className="mt-0.5 block w-full min-w-0 truncate text-center text-[10px] tracking-tight">
            सबै मेनु
          </span>
        </button>
      </div>
    </nav>
  );
};

