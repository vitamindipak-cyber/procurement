import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Building2,
  HardHat,
  Sparkles,
  Layers,
  FileCheck2,
  ClipboardList,
  BookOpen,
  ShieldCheck,
  FileText,
  Calculator,
  Scale,
  MessageSquareText,
  Search,
  PlusCircle,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  HelpCircle,
  Users,
  FileCheck,
  BookA,
  Clock,
  Globe,
  Gavel,
  Bot,
} from 'lucide-react';
import { UserRole } from '../types/auth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSearch: () => void;
  onOpenNewProject: () => void;
  userRole: UserRole;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  userMode?: 'entity' | 'bidder';
  onToggleUserMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  onOpenSearch,
  onOpenNewProject,
  userRole,
  isCollapsed = false,
  onToggleCollapse,
  userMode = 'entity',
  onToggleUserMode,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const navGroups = useMemo(() => {
    const lawGroup = {
      groupTitle: 'कानूनी संग्रह',
      items: [
        { id: 'law-corpus', label: 'ऐन/नियमका व्यवस्थाहरू', icon: BookOpen },
        { id: 'amendments', label: '१६औँ संशोधनका विशेषता', icon: ShieldCheck },
        { id: 'glossary', label: 'शब्दावली कोष', icon: BookA },
        { id: 'clauses', label: 'महत्वपूर्ण दफाहरू', icon: BookOpen },
        { id: 'schedules', label: 'अनुसूचीहरू (१–८)', icon: Scale },
        { id: 'ppmo-pprc', label: 'PPMO राय र PPRC निर्णय', icon: MessageSquareText },
      ],
    };
    const toolsGroup = {
      groupTitle: 'उपकरण',
      items: [
        // { id: 'procurement-chat', label: 'खरिद AI सहायक', icon: Bot },
        { id: 'dilemma-solver', label: 'FAQ', icon: HelpCircle },
        { id: 'timeline-calculator', label: 'कानूनी म्याद क्याल्कुलेटर', icon: Clock },
        { id: 'calculator', label: 'थ्रेसहोल्ड क्याल्कुलेटर', icon: Calculator },
      ],
    };

    if (userMode === 'bidder') {
      return [
        {
          groupTitle: 'बोलपत्रदाता कर्नर',
          items: [
            { id: 'bidder-hub', label: 'बोलपत्रदाता गृहपृष्ठ', icon: HardHat },
            { id: 'bidding-forms', label: 'बोलपत्र फाराम जेनेरेटर', icon: FileText },
            { id: 'icb-guide', label: 'अन्तर्राष्ट्रिय बोलपत्र (ICB)', icon: Globe },
            { id: 'egp-guidelines', label: 'e-GP निर्देशिका, २०८०', icon: FileCheck },
          ],
        },
        {
          groupTitle: 'बुझ्नुपर्ने प्रक्रिया',
          items: [
            { id: 'methods', label: 'खरिद विधिहरू', icon: Layers },
            { id: 'bid-evaluation', label: 'बोलपत्र मूल्याङ्कन गाइड', icon: Gavel },
            { id: 'templates', label: 'कागजात ढाँचाहरू', icon: FileText },
          ],
        },
        lawGroup,
        toolsGroup,
      ];
    }

    return [
      {
        groupTitle: 'खरिद सल्लाह',
        items: [
          { id: 'dashboard', label: 'सार्वजनिक निकाय ड्यासबोर्ड', icon: Briefcase },
          { id: 'bidder-hub', label: 'बोलपत्रदाता कर्नर', icon: HardHat },
          { id: 'advisor', label: 'खरिद सल्लाहकार', icon: Sparkles },
          { id: 'workflow-wizard', label: 'चरणबद्ध गाइड', icon: ClipboardList },
          ...(userRole === 'admin'
            ? [{ id: 'user-management', label: 'प्रयोगकर्ता व्यवस्थापन', icon: Users }]
            : []),
        ],
      },
      {
        groupTitle: 'खरिद विधि तथा अनुपालन',
        items: [
          { id: 'methods', label: 'खरिद विधिहरू', icon: Layers },
          { id: 'icb-guide', label: 'अन्तर्राष्ट्रिय बोलपत्र (ICB)', icon: Globe },
          { id: 'method-checklists', label: 'विधिगत चेकलिस्ट', icon: FileCheck2 },
          { id: 'bid-evaluation', label: 'बोलपत्र मूल्याङ्कन गाइड', icon: Gavel },
          { id: 'stages', label: 'प्रक्रियागत ७ चरणहरू', icon: ClipboardList },
          { id: 'egp-guidelines', label: 'e-GP निर्देशिका, २०८०', icon: FileCheck },
          { id: 'checklists', label: 'एकीकृत चेकलिस्ट', icon: ShieldCheck },
          { id: 'templates', label: 'कागजात ढाँचाहरू', icon: FileText },
        ],
      },
      lawGroup,
      toolsGroup,
    ];
  }, [userMode, userRole]);

  const toggleGroupCollapse = (groupTitle: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const filteredNavGroups = useMemo(() => {
    const q = filterQuery.trim().toLocaleLowerCase('ne-NP');
    if (!q) return navGroups;

    return navGroups.map((group) => {
      const matchedItems = group.items.filter((item) =>
        item.label.toLocaleLowerCase('ne-NP').includes(q) ||
        item.id.toLocaleLowerCase().includes(q)
      );
      return {
        ...group,
        items: matchedItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [navGroups, filterQuery]);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'
          } w-72 bg-[#173b63] text-blue-50 border-r border-[#31577b] flex flex-col justify-between transition-all duration-200 ease-in-out lg:translate-x-0 ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        {/* Top: Branding & Close button for mobile / Collapse button for desktop */}
        <div className="shrink-0">
          <div className={`p-4 border-b border-[#31577b] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} bg-[#214f83]`}>
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleNavClick(userMode === 'bidder' ? 'bidder-hub' : 'dashboard')}
                  title="सार्वजनिक खरिद सहयोगी - गृहपृष्ठ"
                  aria-label="गृहपृष्ठमा जानुहोस्"
                  className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm hover:bg-blue-800 transition-colors"
                >
                  ख
                </button>
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    title="साइडबार खोल्नुहोस् (Expand)"
                    aria-label="साइडबार खोल्नुहोस्"
                    className="hidden lg:flex p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick(userMode === 'bidder' ? 'bidder-hub' : 'dashboard')}
                  className="flex items-center gap-2.5 text-left group focus:outline-hidden min-w-0"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-800 transition-colors shrink-0">
                    ख
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold tracking-tight text-white group-hover:text-blue-100 transition-colors truncate">
                      सार्वजनिक खरिद सहयोगी
                    </span>
                    <span className="text-[11px] font-medium text-blue-100/80 truncate">
                      सार्वजनिक खरिद ऐन २०६३ र नियमावली २०६४
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  {onToggleCollapse && (
                    <button
                      onClick={onToggleCollapse}
                      title="साइडबार संकुचित गर्नुहोस् (Collapse)"
                      aria-label="साइडबार संकुचित गर्नुहोस्"
                      className="hidden lg:flex p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={onCloseMobile}
                    className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg lg:hidden transition-colors shrink-0"
                    title="बन्द गर्नुहोस्"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mode Switcher inside Sidebar */}
          {onToggleUserMode && (
            <div className={`p-2.5 border-b border-[#31577b] bg-[#1a426e] ${isCollapsed ? 'flex justify-center' : ''}`}>
              {isCollapsed ? (
                <button
                  type="button"
                  onClick={onToggleUserMode}
                  title={userMode === 'bidder' ? 'सार्वजनिक निकाय मोडमा जानुहोस्' : 'बोलपत्रदाता मोडमा जानुहोस्'}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-colors shadow-2xs cursor-pointer ${userMode === 'bidder'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-800 hover:bg-blue-700 text-blue-100'
                    }`}
                >
                  {userMode === 'bidder' ? <HardHat className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                </button>
              ) : (
                <div className="flex items-center bg-[#143355] p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => { if (userMode !== 'entity') onToggleUserMode(); }}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${userMode === 'entity'
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'text-blue-200 hover:text-white'
                      }`}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>सार्वजनिक निकाय</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (userMode !== 'bidder') onToggleUserMode(); }}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${userMode === 'bidder'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-blue-200 hover:text-white'
                      }`}
                  >
                    <HardHat className="h-3.5 w-3.5" />
                    <span>बोलपत्रदाता</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {userMode === 'entity' && (
            <div className={`p-2.5 border-b border-[#31577b] bg-[#173b63] ${isCollapsed ? 'flex justify-center' : ''}`}>
              {isCollapsed ? (
                <button
                  onClick={() => { onOpenNewProject(); onCloseMobile(); }}
                  title="नयाँ खरिद आयोजना थप्नुहोस्"
                  aria-label="नयाँ खरिद आयोजना थप्नुहोस्"
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center justify-center shadow-xs transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => { onOpenNewProject(); onCloseMobile(); }}
                  className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>नयाँ खरिद आयोजना थप्नुहोस्</span>
                </button>
              )}
            </div>
          )}

          {/* Live In-Sidebar Filter Search */}
          {!isCollapsed && (
            <div className="p-2.5 border-b border-[#31577b]/50 bg-[#163a62]">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-blue-200/70 pointer-events-none" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="मेनूमा तुरुन्त खोज्नुहोस्..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-blue-200/60 rounded-lg border border-white/15 outline-none transition-colors"
                />
                {filterQuery && (
                  <button
                    type="button"
                    onClick={() => setFilterQuery('')}
                    className="absolute right-2 text-blue-200 hover:text-white p-0.5"
                    title="खाली गर्नुहोस्"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Middle: Scrollable Navigation Groups */}
        <div className={`flex-1 overflow-y-auto py-3 space-y-3 text-left ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {filteredNavGroups.length === 0 ? (
            <div className="py-6 text-center text-blue-200/70 space-y-2">
              <p className="text-sm">'{filterQuery}' फेला परेन</p>
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="text-xs text-blue-300 underline hover:text-white"
              >
                सबै मेनु देखाउनुहोस्
              </button>
            </div>
          ) : (
            filteredNavGroups.map((group, gIdx) => {
              const isGroupCollapsed = !filterQuery && Boolean(collapsedGroups[group.groupTitle]);
              return (
                <div key={gIdx} className="space-y-1">
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleGroupCollapse(group.groupTitle)}
                      className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-blue-200/80 uppercase tracking-wider hover:text-white transition-colors cursor-pointer group"
                    >
                      <span>{group.groupTitle} ({group.items.length})</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-blue-300/60 group-hover:text-white transition-transform duration-200 ${isGroupCollapsed ? '-rotate-90' : 'rotate-0'
                          }`}
                      />
                    </button>
                  ) : (
                    gIdx > 0 && <div className="h-px bg-white/10 my-2 mx-1" />
                  )}
                  {!isGroupCollapsed && (
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            title={item.label}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                            className={`w-full flex items-center rounded-lg transition-all group cursor-pointer ${isCollapsed
                              ? `justify-center p-2.5 ${isActive
                                ? 'bg-blue-100 text-blue-950 font-bold shadow-2xs'
                                : 'text-blue-100 hover:text-white hover:bg-white/10'
                              }`
                              : `justify-start px-3 py-2 ${isActive
                                ? 'bg-blue-100 text-blue-950 font-bold border-l-4 border-blue-600 shadow-2xs'
                                : 'text-blue-100 hover:text-white hover:bg-white/10'
                              }`
                              }`}
                          >
                            {isCollapsed ? (
                              <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-blue-700' : 'text-blue-300 group-hover:text-white'}`} />
                            ) : (
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive ? 'text-blue-700' : 'text-blue-300 group-hover:text-white'}`} />
                                <span className="truncate text-sm font-medium">{item.label}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Sidebar Footer */}
        {isCollapsed ? (
          <div className="p-3 border-t border-[#31577b] bg-[#143553] flex justify-center shrink-0">
            <span
              title="१६औँ संशोधन समावेश — सार्वजनिक खरिदका लागि सहयोगी प्रणाली"
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/30"
            />
          </div>
        ) : (
          <div className="p-3 border-t border-[#31577b] bg-[#143553] text-[11px] text-blue-200 space-y-1 shrink-0">
            <div className="flex items-center gap-1.5 font-semibold text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>१६औँ संशोधन समावेश</span>
            </div>
            <p className="text-[10px] text-blue-200/80 leading-tight">
              सार्वजनिक खरिदका लागि सहयोगी प्रणाली
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
