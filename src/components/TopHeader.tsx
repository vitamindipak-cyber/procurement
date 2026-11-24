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
  dashboard:            { title: 'ड्यासबोर्ड तथा आयोजना अनुगमन',                       shortTitle: 'ड्यासबोर्ड',       category: 'व्यवस्थापन',           rootTab: 'dashboard' },
  'simulation-dashboard': { title: 'व्यावहारिक अभ्यासशाला', shortTitle: 'अभ्यासशाला', category: 'Practical Simulation Lab', rootTab: 'simulation-dashboard' },
  'simulation-learning': { title: 'भिडियोबाट सिकौँ', shortTitle: 'भिडियो सिकाइ', category: 'Practical Simulation Lab', rootTab: 'simulation-dashboard' },
  'simulation-cases': { title: 'अभ्यास केसहरू', shortTitle: 'अभ्यास केस', category: 'Practical Simulation Lab', rootTab: 'simulation-dashboard' },
  'simulation-progress': { title: 'अभ्यास प्रगति', shortTitle: 'प्रगति', category: 'Practical Simulation Lab', rootTab: 'simulation-dashboard' },
  'simulation-reports': { title: 'अभ्यास प्रतिवेदन', shortTitle: 'प्रतिवेदन', category: 'Practical Simulation Lab', rootTab: 'simulation-dashboard' },
  'simulation-certificates': { title: 'अभ्यास प्रमाणपत्र', shortTitle: 'प्रमाणपत्र', category: 'Practical Simulation Lab', rootTab: 'simulation-dashboard' },
  'simulation-legal': { title: 'अभ्यासका कानुनी सन्दर्भ', shortTitle: 'कानुनी सन्दर्भ', category: 'Practical Simulation Lab', rootTab: 'simulation-dashboard' },
  'simulation-case-management': { title: 'अभ्यास केस व्यवस्थापन', shortTitle: 'केस व्यवस्थापन', category: 'प्रणाली व्यवस्थापन', rootTab: 'simulation-dashboard' },
  'simulation-verify': { title: 'अभ्यास प्रमाणपत्र प्रमाणीकरण', shortTitle: 'प्रमाणीकरण', category: 'Practical Simulation Lab', rootTab: 'simulation-certificates' },
  'procurement-chat':   { title: 'सार्वजनिक खरिद स्रोत सहायक',                          shortTitle: 'AI सहायक',          category: 'प्रश्नोत्तर',           rootTab: 'procurement-chat' },
  'bidder-hub':         { title: 'बोलपत्रदाता विशेष कर्नर (Bidder Portal)',              shortTitle: 'बोलपत्रदाता कर्नर', category: 'बोलपत्रदाता',           rootTab: 'bidder-hub' },
  'bidding-forms':      { title: 'बोलपत्र फाराम तथा ढाँचा जेनेरेटर',                   shortTitle: 'फाराम जेनेरेटर',    category: 'बोलपत्रदाता',           rootTab: 'bidder-hub' },
  // ── Bidder sub-tab direct routes ─────────────────────────────────────
  'bidder-eligibility':       { title: 'योग्यता स्व-मूल्याङ्कन (निर्माण)',              shortTitle: 'योग्यता जाँच',       category: 'बोलपत्रदाता',    rootTab: 'bidder-hub' },
  'bidder-bid-no-bid':        { title: 'बिड / नो-बिड रणनीतिक विश्लेषक',               shortTitle: 'बिड/नो-बिड',         category: 'बोलपत्रदाता',    rootTab: 'bidder-hub' },
  'bidder-fatal-mistakes':    { title: 'घातक गल्तीहरू र जोखिम अडिट',                  shortTitle: 'घातक गल्तीहरू',      category: 'बोलपत्रदाता',    rootTab: 'bidder-hub' },
  'bidder-safeguards':        { title: 'बोलपत्रदाताले अपनाउनुपर्ने सावधानी',          shortTitle: 'सावधानीहरू',         category: 'बोलपत्रदाता',    rootTab: 'bidder-hub' },
  'bidder-checklist':         { title: 'बिड पेश गर्नुपूर्वको ३०-बुँदे चेकलिस्ट',     shortTitle: 'पेश-अघि चेकलिस्ट',  category: 'बोलपत्रदाता',    rootTab: 'bidder-hub' },
  'bidder-sbd-hub':           { title: 'SBD कागजात भण्डार (Download)',                 shortTitle: 'SBD भण्डार',         category: 'बोलपत्रदाता',    rootTab: 'bidder-hub' },
  'bidder-review':            { title: 'पुनरावलोकन तथा उजुरी (दफा ४७/४९)',            shortTitle: 'पुनरावलोकन/उजुरी',  category: 'बोलपत्रदाता',    rootTab: 'bidder-hub' },
  // ─────────────────────────────────────────────────────────────────────
  advisor:              { title: 'खरिद विधि सल्लाहकार',                                  shortTitle: 'विधि सल्लाहकार',    category: 'सुरुआत',              rootTab: 'advisor' },
  'workflow-wizard':    { title: 'चरणबद्ध खरिद कार्ययोजना',                            shortTitle: 'कार्ययोजना',         category: 'प्रक्रिया',            rootTab: 'workflow-wizard' },
  'user-management':    { title: 'प्रयोगकर्ता व्यवस्थापन',                             shortTitle: 'प्रयोगकर्ता',       category: 'प्रणाली व्यवस्थापन',   rootTab: 'dashboard' },
  'audit-log':           { title: 'Audit log / audit trail',                             shortTitle: 'Audit log',         category: 'प्रणाली व्यवस्थापन',   rootTab: 'dashboard' },
  'dilemma-solver':     { title: 'खरिद समस्या समाधान',                                  shortTitle: 'समस्या समाधान',     category: 'सल्लाह तथा नजिर',       rootTab: 'dilemma-solver' },
  methods:              { title: 'खरिदका सम्पूर्ण विधिहरू',                             shortTitle: 'खरिद विधिहरू',      category: 'विधिहरू',               rootTab: 'methods' },
  'method-checklists':  { title: 'विधि अनुसारको चेकलिस्ट',                             shortTitle: 'विधिगत चेकलिस्ट',  category: 'अनुपालन',               rootTab: 'methods' },
  'bid-evaluation':     { title: 'बोलपत्र मूल्याङ्कन गाइड',                            shortTitle: 'मूल्याङ्कन गाइड',  category: 'अनुपालन',               rootTab: 'methods' },
  'law-corpus':         { title: 'ऐन तथा नियमावली संग्रह',                             shortTitle: 'ऐन/नियमावली',       category: 'कानूनी संग्रह',         rootTab: 'law-corpus' },
  amendments:           { title: '१६औँ संशोधनका विशेषताहरू',                           shortTitle: '१६औँ संशोधन',       category: 'संशोधन',                rootTab: 'law-corpus' },
  stages:               { title: 'प्रक्रियागत ७ चरणहरू',                               shortTitle: '७ चरणहरू',          category: 'चरणहरू',                rootTab: 'stages' },
  'egp-guidelines':     { title: 'विद्युतीय खरिद प्रणाली सञ्चालन निर्देशिका, २०८०',   shortTitle: 'e-GP निर्देशिका',   category: 'e-GP अनुपालन',          rootTab: 'egp-guidelines' },
  'icb-guide':          { title: 'अन्तर्राष्ट्रिय प्रतिस्पर्धात्मक बोलपत्र',          shortTitle: 'ICB गाइड',          category: 'खरिद विधि',             rootTab: 'methods' },
  templates:            { title: 'कागजात ढाँचा भण्डार',                                shortTitle: 'कागजात ढाँचा',      category: 'ढाँचाहरू',              rootTab: 'templates' },
  checklists:           { title: 'एकीकृत अनुपालन चेकलिस्ट',                           shortTitle: 'एकीकृत चेकलिस्ट',  category: 'चेकलिस्ट',              rootTab: 'checklists' },
  calculator:           { title: 'सीमा तथा अख्तियारी क्याल्कुलेटर',                   shortTitle: 'थ्रेसहोल्ड क्याल्कुलेटर', category: 'उपकरण',          rootTab: 'calculator' },
  clauses:              { title: 'महत्वपूर्ण कानुनी दफाहरू',                           shortTitle: 'महत्वपूर्ण दफाहरू', category: 'दफाहरू',                rootTab: 'law-corpus' },
  schedules:            { title: 'आधिकारिक अनुसूचीहरू (१–८)',                          shortTitle: 'अनुसूचीहरू',        category: 'अनुसूचीहरू',            rootTab: 'law-corpus' },
  'ppmo-pprc':          { title: 'PPMO राय तथा PPRC पुनरावलोकन निर्णय',                shortTitle: 'PPMO/PPRC',          category: 'राय तथा नजिर',          rootTab: 'ppmo-pprc' },
  glossary:             { title: 'खरिद शब्दावली',                                       shortTitle: 'शब्दावली कोष',      category: 'सन्दर्भ',               rootTab: 'glossary' },
  'timeline-calculator':{ title: 'खरिद समयसीमा क्याल्कुलेटर',                         shortTitle: 'म्याद क्याल्कुलेटर', category: 'उपकरण',                rootTab: 'calculator' },
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
  const current = TAB_TITLES[activeTab] ?? { title: 'सार्वजनिक खरिद सहयोगी', category: 'प्रणाली' };
  const homeTab = userMode === 'bidder' ? 'bidder-hub' : 'dashboard';

  return (
    <header
      className="sticky top-0 z-30 flex flex-col max-w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80"
    >
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <div className="min-h-14 flex items-center justify-between px-2.5 sm:px-5 gap-1.5 sm:gap-2">

        {/* Left: mobile hamburger + history + breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">

          {/* Hamburger (mobile only) */}
          <button
            onClick={onToggleSidebarMobile}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors shrink-0"
            title="मेनु खोल्नुहोस्"
            aria-label="मेनु खोल्नुहोस्"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* History nav */}
          <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5 shrink-0">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              className={`p-1.5 rounded-md transition-colors ${
                canGoBack
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-xs cursor-pointer'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              title="अघिल्लो पृष्ठ (Alt + ←)"
              aria-label="अघिल्लो पृष्ठ"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onGoForward}
              disabled={!canGoForward}
              className={`p-1.5 rounded-md transition-colors ${
                canGoForward
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-xs cursor-pointer'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
              title="पछिल्लो पृष्ठ (Alt + →)"
              aria-label="पछिल्लो पृष्ठ"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-1 items-center gap-1 text-xs text-slate-500 truncate min-w-0 sm:ml-1"
          >
            <button
              type="button"
              onClick={() => setActiveTab(homeTab)}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
              title="गृहपृष्ठमा जानुहोस्"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-medium">गृहपृष्ठ</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            {current.rootTab && current.rootTab !== activeTab ? (
              <button
                type="button"
                onClick={() => setActiveTab(current.rootTab!)}
                className="text-slate-500 hover:text-slate-900 transition-colors truncate max-w-[100px] sm:max-w-none shrink-0 text-xs"
                title={`${current.category} समूहमा जानुहोस्`}
              >
                {current.category}
              </button>
            ) : (
              <span className="text-slate-400 truncate hidden md:inline text-xs">{current.category}</span>
            )}

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            <span
              className="font-semibold text-slate-900 truncate text-xs sm:text-[13px] bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/80"
            >
              {current.shortTitle ?? current.title}
            </span>
          </nav>
        </div>

        {/* Right: mode toggle, search, print, ext-link, logout */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">

          {/* Mode toggle pill */}
          {onToggleUserMode && (
            <button
              type="button"
              onClick={onToggleUserMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer shrink-0 ${
                userMode === 'bidder'
                  ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title={userMode === 'bidder' ? 'सार्वजनिक निकाय मोडमा स्विच' : 'बोलपत्रदाता मोडमा स्विच'}
              aria-label="मोड स्विच"
            >
              {userMode === 'bidder' ? <HardHat className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {userMode === 'bidder' ? 'बोलपत्रदाता' : 'सार्वजनिक निकाय'}
              </span>
            </button>
          )}

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2 py-1.5 sm:px-2.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shrink-0"
            title="खोज तथा फिल्टर (Ctrl+K वा /)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">खोज्नुहोस्</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white border border-slate-200 rounded text-slate-400 leading-none">
              /
            </kbd>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors no-print shrink-0"
            title="प्रिन्ट"
            aria-label="प्रिन्ट"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* External link */}
          <button
            onClick={() => window.open('https://financial-procedures.vercel.app/', '_blank', 'noopener,noreferrer')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors shrink-0 whitespace-nowrap"
            aria-label="आर्थिक कार्यविधि नयाँ window मा खोल्नुहोस्"
            title="आर्थिक कार्यविधि"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>आर्थिक कार्यविधि</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              if (window.confirm('के तपाईं लगआउट गर्न चाहनुहुन्छ?')) {
                onLogout();
              }
            }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="लगआउट"
            aria-label="लगआउट"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Recent tabs sub-bar ───────────────────────────────────────────── */}
      {recentTabs.length > 1 && (
        <div
          className="px-3 sm:px-5 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px] no-print bg-slate-50/70 border-t border-slate-200/70"
        >
          <div className="flex items-center gap-1 text-slate-400 font-semibold shrink-0">
            <Clock className="w-3 h-3" />
            <span>भर्खरै:</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {recentTabs.map((tabId) => {
              const meta = TAB_TITLES[tabId];
              if (!meta) return null;
              const isActive = activeTab === tabId;
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setActiveTab(tabId)}
                  className={`px-2.5 py-0.5 rounded-full transition-all shrink-0 flex items-center gap-1 border ${
                    isActive
                      ? 'bg-[#123f6d] text-white font-semibold border-[#123f6d]'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/80" />}
                  <span>{meta.shortTitle ?? meta.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
