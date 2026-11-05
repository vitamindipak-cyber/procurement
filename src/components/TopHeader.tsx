import React from 'react';
import {
  Menu,
  Search,
  ExternalLink,
  Printer,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Home,
  Clock,
  Building2,
  HardHat,
} from 'lucide-react';

export interface TabMeta {
  title: string;
  shortTitle?: string;
  category: string;
  rootTab?: string;
}

export const TAB_TITLES: Record<string, TabMeta> = {
  dashboard: { title: 'ड्यासबोर्ड तथा आयोजना अनुगमन', shortTitle: 'ड्यासबोर्ड', category: 'व्यवस्थापन', rootTab: 'dashboard' },
  'procurement-chat': { title: 'सार्वजनिक खरिद स्रोत सहायक', shortTitle: 'AI सहायक', category: 'प्रश्नोत्तर', rootTab: 'procurement-chat' },
  'bidder-hub': { title: 'बोलपत्रदाता विशेष कर्नर (Bidder Portal)', shortTitle: 'बोलपत्रदाता कर्नर', category: 'बोलपत्रदाता', rootTab: 'bidder-hub' },
  'bidding-forms': { title: 'बोलपत्र फाराम तथा ढाँचा जेनेरेटर', shortTitle: 'फाराम जेनेरेटर', category: 'बोलपत्रदाता', rootTab: 'bidder-hub' },
  advisor: { title: 'खरिद सल्लाहकार (Wizard)', shortTitle: 'खरिद सल्लाहकार', category: 'सल्लाहकार', rootTab: 'advisor' },
  'workflow-wizard': { title: 'चरणबद्ध खरिद कार्यप्रवाह', shortTitle: 'कार्यप्रवाह', category: 'प्रक्रिया', rootTab: 'workflow-wizard' },
  'user-management': { title: 'प्रयोगकर्ता व्यवस्थापन', shortTitle: 'प्रयोगकर्ता', category: 'प्रणाली व्यवस्थापन', rootTab: 'dashboard' },
  'dilemma-solver': { title: 'खरिद समस्या समाधान', shortTitle: 'समस्या समाधान', category: 'सल्लाह तथा नजिर', rootTab: 'dilemma-solver' },
  methods: { title: 'खरिदका सम्पूर्ण विधिहरू', shortTitle: 'खरिद विधिहरू', category: 'विधिहरू', rootTab: 'methods' },
  'method-checklists': { title: 'विधि अनुसारको चेकलिस्ट', shortTitle: 'विधिगत चेकलिस्ट', category: 'अनुपालन', rootTab: 'methods' },
  'bid-evaluation': { title: 'बोलपत्र मूल्याङ्कन गाइड', shortTitle: 'मूल्याङ्कन गाइड', category: 'अनुपालन', rootTab: 'methods' },
  'law-corpus': { title: 'ऐन तथा नियमावली संग्रह', shortTitle: 'ऐन/नियमावली', category: 'कानूनी संग्रह', rootTab: 'law-corpus' },
  amendments: { title: '१६औँ संशोधनका विशेषताहरू', shortTitle: '१६औँ संशोधन', category: 'संशोधन', rootTab: 'law-corpus' },
  stages: { title: 'प्रक्रियागत ७ चरणहरू', shortTitle: '७ चरणहरू', category: 'चरणहरू', rootTab: 'stages' },
  'egp-guidelines': { title: 'विद्युतीय खरिद प्रणाली सञ्चालन निर्देशिका, २०८०', shortTitle: 'e-GP निर्देशिका', category: 'e-GP अनुपालन', rootTab: 'egp-guidelines' },
  'icb-guide': { title: 'अन्तर्राष्ट्रिय प्रतिस्पर्धात्मक बोलपत्र', shortTitle: 'ICB गाइड', category: 'खरिद विधि', rootTab: 'methods' },
  templates: { title: 'कागजात ढाँचा भण्डार', shortTitle: 'कागजात ढाँचा', category: 'ढाँचाहरू', rootTab: 'templates' },
  checklists: { title: 'एकीकृत अनुपालन चेकलिस्ट', shortTitle: 'एकीकृत चेकलिस्ट', category: 'चेकलिस्ट', rootTab: 'checklists' },
  calculator: { title: 'सीमा तथा अख्तियारी क्याल्कुलेटर', shortTitle: 'थ्रेसहोल्ड क्याल्कुलेटर', category: 'उपकरण', rootTab: 'calculator' },
  clauses: { title: 'महत्वपूर्ण कानुनी दफाहरू', shortTitle: 'महत्वपूर्ण दफाहरू', category: 'दफाहरू', rootTab: 'law-corpus' },
  schedules: { title: 'आधिकारिक अनुसूचीहरू (१–८)', shortTitle: 'अनुसूचीहरू', category: 'अनुसूचीहरू', rootTab: 'law-corpus' },
  'ppmo-pprc': { title: 'PPMO राय तथा PPRC पुनरावलोकन निर्णय', shortTitle: 'PPMO/PPRC', category: 'राय तथा नजिर', rootTab: 'ppmo-pprc' },
  glossary: { title: 'खरिद शब्दावली', shortTitle: 'शब्दावली कोष', category: 'सन्दर्भ', rootTab: 'glossary' },
  'timeline-calculator': { title: 'खरिद समयसीमा क्याल्कुलेटर', shortTitle: 'म्याद क्याल्कुलेटर', category: 'उपकरण', rootTab: 'calculator' },
};

interface TopHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleSidebarMobile: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  userMode?: 'entity' | 'bidder';
  onToggleUserMode?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
  recentTabs?: string[];
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  onToggleSidebarMobile,
  onOpenSearch,
  onLogout,
  userMode = 'entity',
  onToggleUserMode,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  recentTabs = [],
}) => {
  const current = TAB_TITLES[activeTab] || { title: 'सार्वजनिक खरिद सहयोगी', category: 'प्रणाली' };
  const homeTab = userMode === 'bidder' ? 'bidder-hub' : 'dashboard';

  return (
    <header className="sticky top-0 z-30 bg-[#173b63]/95 text-white backdrop-blur-md border-b border-[#31577b] flex flex-col shadow-2xs max-w-full">
      {/* Main Top Bar */}
      <div className="h-16 flex items-center justify-between px-3 sm:px-6">
        {/* Left: Mobile hamburger + Desktop collapse + History buttons + Interactive Breadcrumbs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <button
            onClick={onToggleSidebarMobile}
            className="p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 lg:hidden transition-colors shrink-0"
            title="मेनु खोल्नुहोस्"
            aria-label="मेनु खोल्नुहोस्"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* History Navigation: Back & Forward Buttons */}
          <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5 border border-white/10 shrink-0">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              className={`p-1.5 rounded-md transition-colors ${
                canGoBack
                  ? 'text-white hover:bg-white/15 cursor-pointer'
                  : 'text-white/35 cursor-not-allowed'
              }`}
              title="अघिल्लो पृष्ठ (Alt + ←)"
              aria-label="अघिल्लो पृष्ठ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onGoForward}
              disabled={!canGoForward}
              className={`p-1.5 rounded-md transition-colors ${
                canGoForward
                  ? 'text-white hover:bg-white/15 cursor-pointer'
                  : 'text-white/35 cursor-not-allowed'
              }`}
              title="पछिल्लो पृष्ठ (Alt + →)"
              aria-label="पछिल्लो पृष्ठ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Clickable Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-blue-100/80 font-medium truncate min-w-0 ml-1">
            <button
              type="button"
              onClick={() => setActiveTab(homeTab)}
              className="inline-flex items-center gap-1 text-blue-200 hover:text-white transition-colors shrink-0 font-semibold"
              title="गृहपृष्ठमा जानुहोस्"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">गृहपृष्ठ</span>
            </button>
            <ChevronRight className="w-3 h-3 text-blue-200/50 shrink-0" />
            {current.rootTab && current.rootTab !== activeTab ? (
              <button
                type="button"
                onClick={() => setActiveTab(current.rootTab!)}
                className="hover:text-white transition-colors truncate max-w-[120px] sm:max-w-none underline-offset-2 hover:underline text-blue-200/90 shrink-0"
                title={`${current.category} समूहमा जानुहोस्`}
              >
                {current.category}
              </button>
            ) : (
              <span className="text-blue-200/70 truncate hidden md:inline shrink-0">{current.category}</span>
            )}
            <ChevronRight className="w-3 h-3 text-blue-200/50 shrink-0" />
            <span className="font-bold text-white truncate text-xs sm:text-sm bg-white/10 px-2 py-0.5 rounded-md">
              {current.title}
            </span>
          </nav>
        </div>

        {/* Right: Mode Switcher, Search, Print, External link, Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* User Mode Switcher Pill */}
          {onToggleUserMode && (
            <button
              type="button"
              onClick={onToggleUserMode}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs border cursor-pointer shrink-0 ${
                userMode === 'bidder'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/60'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={userMode === 'bidder' ? 'सार्वजनिक निकाय मोडमा स्विच गर्नुहोस्' : 'बोलपत्रदाता मोडमा स्विच गर्नुहोस्'}
              aria-label="मोड स्विच गर्नुहोस्"
            >
              {userMode === 'bidder' ? <HardHat className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{userMode === 'bidder' ? 'बोलपत्रदाता मोड' : 'सार्वजनिक निकाय मोड'}</span>
              <span className="sm:hidden">{userMode === 'bidder' ? 'बोलपत्रदाता' : 'सार्वजनिक निकाय'}</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-50 bg-white/10 hover:bg-white/15 rounded-lg transition-colors border border-white/15 shrink-0"
            title="खोज तथा फिल्टर (Ctrl + K वा /)"
          >
            <Search className="w-4 h-4 text-blue-200" />
            <span className="hidden md:inline">खोज्नुहोस्</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 border border-white/20 rounded-sm text-blue-100">
              /
            </kbd>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 sm:p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors no-print shrink-0"
            title="प्रिन्ट गर्नुहोस्"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.open('https://financial-procedures.vercel.app/', '_blank', 'noopener,noreferrer')}
            className="flex items-center justify-center gap-1.5 p-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors shrink-0"
            aria-label="आर्थिक कार्यविधि पेज नयाँ window मा खोल्नुहोस्"
            title="आर्थिक कार्यविधि पेज (नयाँ window मा खोल्नुहोस्)"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">आर्थिक कार्यविधि</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('के तपाईं लगआउट गर्न चाहनुहुन्छ?')) {
                onLogout();
              }
            }}
            className="p-1.5 sm:p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title="लगआउट"
            aria-label="लगआउट"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-bar: Recent Tabs (भर्खरै हेरिएका पृष्ठहरू) */}
      {recentTabs.length > 1 && (
        <div className="px-3 sm:px-6 py-1.5 bg-[#143355]/90 border-t border-[#31577b]/60 flex items-center gap-2 overflow-x-auto text-[11px] no-print">
          <div className="flex items-center gap-1 text-blue-200/70 font-semibold shrink-0">
            <Clock className="w-3 h-3" />
            <span>भर्खरै:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {recentTabs.map((tabId) => {
              const meta = TAB_TITLES[tabId];
              if (!meta) return null;
              const isActive = activeTab === tabId;
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setActiveTab(tabId)}
                  className={`px-2.5 py-0.5 rounded-full transition-all shrink-0 flex items-center gap-1 ${
                    isActive
                      ? 'bg-blue-500 text-white font-bold shadow-xs'
                      : 'bg-white/10 text-blue-100/90 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  <span>{meta.shortTitle || meta.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
