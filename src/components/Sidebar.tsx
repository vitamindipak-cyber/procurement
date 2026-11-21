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
  ShieldAlert,
  FileText,
  Calculator,
  Scale,
  MessageSquareText,
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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'थप उपकरणहरू': true,
  });

  const navGroups = useMemo(() => {
    const lawGroup = {
      groupTitle: 'कानूनी संग्रह',
      items: [
        { id: 'law-corpus',  label: 'ऐन/नियमका व्यवस्थाहरू',       icon: BookOpen },
        { id: 'amendments',  label: '१६औँ संशोधनका विशेषता',         icon: ShieldCheck },
        { id: 'glossary',    label: 'शब्दावली कोष',                  icon: BookA },
        { id: 'clauses',     label: 'महत्वपूर्ण दफाहरू',              icon: BookOpen },
        { id: 'schedules',   label: 'अनुसूचीहरू (१–८)',               icon: Scale },
        { id: 'ppmo-pprc',   label: 'PPMO राय र PPRC निर्णय',         icon: MessageSquareText },
      ],
    };
    const toolsGroup = {
      groupTitle: 'उपकरण',
      items: [
        { id: 'dilemma-solver',       label: 'FAQ / समस्या समाधान',        icon: HelpCircle },
        { id: 'calculator',           label: 'थ्रेसहोल्ड क्याल्कुलेटर',    icon: Calculator },
        { id: 'timeline-calculator',  label: 'म्याद क्याल्कुलेटर',         icon: Clock },
      ],
    };

    if (userMode === 'bidder') {
      return [
        {
          groupTitle: 'बोलपत्रदाता मुख्य',
          items: [
            { id: 'bidder-hub',              label: 'गृहपृष्ठ / अवलोकन',                icon: HardHat },
            { id: 'bidder-eligibility',      label: 'योग्यता स्व-मूल्याङ्कन',           icon: Calculator },
            { id: 'bidder-bid-no-bid',       label: 'बिड/नो-बिड विश्लेषक',              icon: Sparkles },
            { id: 'bidder-fatal-mistakes',   label: 'घातक गल्तीहरू',                    icon: ShieldAlert },
            { id: 'bidder-safeguards',       label: 'अपनाउनुपर्ने सावधानी',             icon: ShieldCheck },
          ],
        },
        {
          groupTitle: 'खरिद प्रकार र कागजात',
          items: [
            { id: 'bidding-forms',           label: 'फाराम जेनेरेटर (SBD)',             icon: FileText },
            { id: 'bidder-checklist',        label: 'पेश-अघि चेकलिस्ट',                icon: FileCheck2 },
            { id: 'bidder-sbd-hub',          label: 'SBD कागजात भण्डार',               icon: BookOpen },
            { id: 'icb-guide',               label: 'अन्तर्राष्ट्रिय बोलपत्र (ICB)',    icon: Globe },
            { id: 'egp-guidelines',          label: 'e-GP निर्देशिका, २०८०',            icon: FileCheck },
            { id: 'bidder-review',           label: 'पुनरावलोकन / उजुरी',               icon: Scale },
          ],
        },
        {
          groupTitle: 'बुझ्नुपर्ने प्रक्रिया',
          items: [
            { id: 'methods',       label: 'खरिद विधिहरू',              icon: Layers },
            { id: 'bid-evaluation',label: 'बोलपत्र मूल्याङ्कन गाइड',   icon: Gavel },
            { id: 'templates',     label: 'कागजात ढाँचाहरू',            icon: FileText },
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
          { id: 'dashboard',        label: 'सार्वजनिक निकाय ड्यासबोर्ड', icon: Briefcase },
          { id: 'bidder-hub',       label: 'बोलपत्रदाता कर्नर',           icon: HardHat },
          { id: 'advisor',          label: 'खरिद सल्लाहकार',              icon: Sparkles },
          { id: 'workflow-wizard',  label: 'चरणबद्ध गाइड',                icon: ClipboardList },
          ...(userRole === 'admin'
            ? [{ id: 'user-management', label: 'प्रयोगकर्ता व्यवस्थापन', icon: Users }]
            : []),
        ],
      },
      {
        groupTitle: 'खरिद विधि तथा अनुपालन',
        items: [
          { id: 'methods',           label: 'खरिद विधिहरू',                icon: Layers },
          { id: 'icb-guide',         label: 'अन्तर्राष्ट्रिय बोलपत्र (ICB)', icon: Globe },
          { id: 'method-checklists', label: 'विधिगत चेकलिस्ट',             icon: FileCheck2 },
          { id: 'bid-evaluation',    label: 'बोलपत्र मूल्याङ्कन गाइड',      icon: Gavel },
          { id: 'stages',            label: 'प्रक्रियागत ७ चरणहरू',          icon: ClipboardList },
          { id: 'egp-guidelines',    label: 'e-GP निर्देशिका, २०८०',         icon: FileCheck },
          { id: 'checklists',        label: 'एकीकृत चेकलिस्ट',              icon: ShieldCheck },
          { id: 'templates',         label: 'कागजात ढाँचाहरू',              icon: FileText },
        ],
      },
      lawGroup,
      toolsGroup,
    ];
  }, [userMode, userRole]);

  // Keep the first level intentionally small. Less-frequent, specialist screens remain
  // available under one collapsed group instead of competing with the everyday workflow.
  const simplifiedNavGroups = useMemo(() => {
    const allItems = navGroups.flatMap((group) => group.items);
    const pick = (ids: string[]) => allItems.filter((item) => ids.includes(item.id));

    if (userMode === 'bidder') {
      const primaryIds = ['bidder-hub'];
      const toolIds = ['bidder-eligibility', 'bidder-bid-no-bid', 'bidder-checklist'];
      const documentIds = ['bidding-forms', 'bidder-sbd-hub'];
      const helpIds = ['egp-guidelines', 'bidder-review', 'dilemma-solver', 'law-corpus'];
      const shown = new Set([...primaryIds, ...toolIds, ...documentIds, ...helpIds]);
      return [
        { groupTitle: 'मुख्य', items: pick(primaryIds) },
        { groupTitle: 'उपकरणहरू', items: pick(toolIds) },
        { groupTitle: 'कागजात / ढाँचा', items: pick(documentIds) },
        { groupTitle: 'कानून / सहायता', items: pick(helpIds) },
        { groupTitle: 'थप उपकरणहरू', items: allItems.filter((item) => !shown.has(item.id)) },
      ].filter((group) => group.items.length > 0);
    }

    const primaryIds = ['dashboard', 'workflow-wizard'];
    const toolIds = ['advisor', 'methods', 'calculator', 'checklists', 'bid-evaluation'];
    const documentIds = ['templates'];
    const helpIds = ['law-corpus', 'dilemma-solver', 'glossary'];
    const shown = new Set([...primaryIds, ...toolIds, ...documentIds, ...helpIds]);
    return [
      { groupTitle: 'मुख्य', items: pick(primaryIds) },
      { groupTitle: 'उपकरणहरू', items: pick(toolIds) },
      { groupTitle: 'कागजात / ढाँचा', items: pick(documentIds) },
      { groupTitle: 'कानून / सहायता', items: pick(helpIds) },
      { groupTitle: 'थप उपकरणहरू', items: allItems.filter((item) => !shown.has(item.id)) },
    ].filter((group) => group.items.length > 0);
  }, [navGroups, userMode]);

  const toggleGroupCollapse = (groupTitle: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupTitle]: !prev[groupTitle] }));
  };

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  /* ─────────────────────────────────────────────────────────────────────
     Colour tokens derived from CSS variables defined in index.css
     ──────────────────────────────────────────────────────────────────── */
  const SB = {
    bg:       'bg-white',
    bgMid:    'bg-white',
    bgDeep:   'bg-[#fafcff]',
    border:   'border-[#e7ecf4]',
    text:     'text-[#4a5a6e]',
    muted:    'text-[#8b99ab]',
    activeText: 'text-[#123f6d]',
    activeBg:   'bg-[#eff5fc]',
    hoverBg:    'hover:bg-[#f5f8fc]',
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        className={[
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col',
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-[16.83rem]',
          'w-[16.83rem]',
          SB.bg,
          SB.border, 'border-r',
          'shadow-[0_0_0_1px_rgba(15,28,46,0.02)]',
          'transition-all duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        ].join(' ')}
      >

        {/* ── Brand header ─────────────────────────────────────────────── */}
        <div className={`shrink-0 ${SB.bgMid} ${SB.border} border-b`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-4'}`}>
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleNavClick(userMode === 'bidder' ? 'bidder-hub' : 'dashboard')}
                  title="गृहपृष्ठ"
                  aria-label="गृहपृष्ठमा जानुहोस्"
                  className="w-9 h-9 rounded-xl bg-[#123f6d] text-white flex items-center justify-center font-bold text-base shadow-sm hover:bg-[#0e3359] transition-colors"
                >
                  ख
                </button>
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    title="Expand sidebar"
                    aria-label="साइडबार खोल्नुहोस्"
                    className={`hidden lg:flex p-1.5 ${SB.muted} hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick(userMode === 'bidder' ? 'bidder-hub' : 'dashboard')}
                  className="flex items-center gap-3 text-left group focus:outline-none min-w-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#123f6d] text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-[#0e3359] transition-colors shrink-0">
                    ख
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-[#123f6d] transition-colors truncate leading-tight">
                      सार्वजनिक खरिद सहयोगी
                    </span>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">
                      ऐन २०६३ · नियमावली २०६४
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  {onToggleCollapse && (
                    <button
                      onClick={onToggleCollapse}
                      title="Collapse sidebar"
                      aria-label="साइडबार संकुचित गर्नुहोस्"
                      className={`hidden lg:flex p-1.5 ${SB.muted} hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onCloseMobile}
                    className={`p-1.5 ${SB.muted} hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden transition-colors`}
                    title="बन्द गर्नुहोस्"
                    aria-label="Sidebar बन्द"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Mode switcher ──────────────────────────────────────────── */}
          {onToggleUserMode && (
            <div className={`px-3 pb-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
              {isCollapsed ? (
                <button
                  type="button"
                  onClick={onToggleUserMode}
                  title={userMode === 'bidder' ? 'सार्वजनिक निकाय मोड' : 'बोलपत्रदाता मोड'}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-xs cursor-pointer border ${
                    userMode === 'bidder'
                      ? 'bg-teal-700 hover:bg-teal-600 text-white border-teal-700'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {userMode === 'bidder' ? <HardHat className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </button>
              ) : (
                <div className="flex rounded-xl bg-slate-100 border border-slate-200/70 p-1">
                  <button
                    type="button"
                    onClick={() => { if (userMode !== 'entity') onToggleUserMode(); }}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userMode === 'entity'
                        ? 'bg-white text-[#123f6d] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>सार्वजनिक निकाय</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (userMode !== 'bidder') onToggleUserMode(); }}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userMode === 'bidder'
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5" />
                    <span>बोलपत्रदाता</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Add project button ─────────────────────────────────────── */}
          {userMode === 'entity' && (
            <div className={`px-3 pb-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
              {isCollapsed ? (
                <button
                  onClick={() => { onOpenNewProject(); onCloseMobile(); }}
                  title="नयाँ खरिद आयोजना"
                  aria-label="नयाँ खरिद आयोजना थप्नुहोस्"
                  className="w-9 h-9 bg-[#123f6d] hover:bg-[#0e3359] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                </button>
              ) : (
                <button
                  onClick={() => { onOpenNewProject(); onCloseMobile(); }}
                  className="w-full py-2.5 px-3 bg-[#123f6d] hover:bg-[#0e3359] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>नयाँ खरिद आयोजना थप्नुहोस्</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Scrollable nav ─────────────────────────────────────────────── */}
        <div className={`flex-1 overflow-y-auto py-3 space-y-1 ${isCollapsed ? 'px-2' : 'px-2.5'}`}>
          {simplifiedNavGroups.map((group, gIdx) => {
            const isGroupCollapsed = Boolean(collapsedGroups[group.groupTitle]);
            return (
              <div key={gIdx}>
                {/* Group label */}
                {!isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroupCollapse(group.groupTitle)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 mt-2 mb-0.5 text-[10px] font-bold uppercase tracking-widest ${SB.muted} hover:text-slate-600 transition-colors cursor-pointer group`}
                  >
                    <span>{group.groupTitle}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${isGroupCollapsed ? '-rotate-90' : 'rotate-0'}`}
                    />
                  </button>
                ) : (
                  gIdx > 0 && <div className="h-px bg-slate-200/80 my-2 mx-1" />
                )}

                {/* Nav items */}
                {!isGroupCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      // For bidder sidebar sub-tab items, also highlight when bidder-hub is active
                      // and the hash matches (e.g. #bidder-hub:eligibility)
                      const isBidderSubTabItem = [
                        'bidder-eligibility', 'bidder-bid-no-bid', 'bidder-fatal-mistakes',
                        'bidder-safeguards', 'bidder-checklist', 'bidder-sbd-hub', 'bidder-review',
                      ].includes(item.id);
                      const isActive = activeTab === item.id ||
                        (item.id === 'bidder-hub' && activeTab === 'bidder-hub' &&
                          !isBidderSubTabItem) ||
                        (isBidderSubTabItem && activeTab === 'bidder-hub' &&
                          typeof window !== 'undefined' &&
                          window.location.hash.includes(item.id.replace('bidder-', '')));
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          title={item.label}
                          aria-label={item.label}
                          aria-current={isActive ? 'page' : undefined}
                          className={[
                            'w-full relative flex items-center rounded-xl transition-all group cursor-pointer',
                            isCollapsed
                              ? `justify-center p-2.5 ${
                                  isActive
                                    ? 'bg-[#eff5fc] text-[#123f6d]'
                                    : `text-slate-500 ${SB.hoverBg} hover:text-slate-900`
                                }`
                              : `justify-start gap-2.5 px-3 py-2 ${
                                  isActive
                                    ? 'bg-[#eff5fc] text-[#123f6d]'
                                    : `text-slate-600 ${SB.hoverBg} hover:text-slate-900`
                                }`,
                          ].join(' ')}
                        >
                          {/* Active left accent bar */}
                          {!isCollapsed && isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#123f6d] rounded-r-full" aria-hidden="true" />
                          )}

                          <Icon
                            className={`shrink-0 transition-colors ${
                              isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                            } ${
                              isActive
                                ? 'text-[#123f6d]'
                                : `text-slate-400 group-hover:text-slate-600`
                            }`}
                          />
                          {!isCollapsed && (
                            <span className={`text-[13px] leading-snug truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                              {item.label}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer badge ──────────────────────────────────────────────── */}
        <div className={`shrink-0 ${SB.bgDeep} ${SB.border} border-t ${isCollapsed ? 'flex justify-center p-3' : 'px-4 py-3'}`}>
          {isCollapsed ? (
            <span
              title="१६औँ संशोधन समावेश"
              className="w-2.5 h-2.5 rounded-full bg-teal-500 ring-2 ring-teal-500/25"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
              <span className="text-[11px] text-slate-500 leading-tight">
                १६औँ संशोधन समावेश
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
