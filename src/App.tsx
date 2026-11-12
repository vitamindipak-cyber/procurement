/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader, TAB_TITLES } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { FloatingProcurementChatLauncher } from './components/FloatingProcurementChatLauncher';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ScrollToTop } from './components/ScrollToTop';
import { LoginPage } from './components/LoginPage';

// Code-split dynamic lazy loading for lightweight instant page loads
const ProcurementAdvisorWizard = lazy(() => import('./components/ProcurementAdvisorWizard').then(m => ({ default: m.ProcurementAdvisorWizard })));
const ProcurementMethodsView = lazy(() => import('./components/ProcurementMethodsView').then(m => ({ default: m.ProcurementMethodsView })));
const MethodChecklistsView = lazy(() => import('./components/MethodChecklistsView').then(m => ({ default: m.MethodChecklistsView })));
const CompleteLawCorpusView = lazy(() => import('./components/CompleteLawCorpusView').then(m => ({ default: m.CompleteLawCorpusView })));
const AmendmentsHighlightView = lazy(() => import('./components/AmendmentsHighlightView').then(m => ({ default: m.AmendmentsHighlightView })));
const StagesGuideView = lazy(() => import('./components/StagesGuideView').then(m => ({ default: m.StagesGuideView })));
const EgpGuidelinesView = lazy(() => import('./components/EgpGuidelinesView').then(m => ({ default: m.EgpGuidelinesView })));
const ChecklistsView = lazy(() => import('./components/ChecklistsView').then(m => ({ default: m.ChecklistsView })));
const TemplatesView = lazy(() => import('./components/TemplatesView').then(m => ({ default: m.TemplatesView })));
const CalculatorView = lazy(() => import('./components/CalculatorView').then(m => ({ default: m.CalculatorView })));
const LegalClausesView = lazy(() => import('./components/LegalClausesView').then(m => ({ default: m.LegalClausesView })));
const SchedulesView = lazy(() => import('./components/SchedulesView').then(m => ({ default: m.SchedulesView })));
const ProcurementGlossaryView = lazy(() => import('./components/ProcurementGlossaryView').then(m => ({ default: m.ProcurementGlossaryView })));
const ProcurementDilemmaSolverView = lazy(() => import('./components/ProcurementDilemmaSolverView').then(m => ({ default: m.ProcurementDilemmaSolverView })));
const ProcurementWorkflowWizard = lazy(() => import('./components/ProcurementWorkflowWizard').then(m => ({ default: m.ProcurementWorkflowWizard })));
const SearchAndFilterModal = lazy(() => import('./components/SearchAndFilterModal').then(m => ({ default: m.SearchAndFilterModal })));
const NewProjectModal = lazy(() => import('./components/NewProjectModal').then(m => ({ default: m.NewProjectModal })));
const UserManagementView = lazy(() => import('./components/UserManagementView').then(m => ({ default: m.UserManagementView })));
const BidderPortalView = lazy(() => import('./components/BidderPortalView').then(m => ({ default: m.BidderPortalView })));
const BiddingFormsGenerator = lazy(() => import('./components/BiddingFormsGenerator').then(m => ({ default: m.BiddingFormsGenerator })));
const IcbProcurementHub = lazy(() => import('./components/IcbProcurementHub').then(m => ({ default: m.IcbProcurementHub })));
const BidEvaluationGuideView = lazy(() => import('./components/BidEvaluationGuideView').then(m => ({ default: m.BidEvaluationGuideView })));

function ViewLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 space-y-3" role="status" aria-live="polite">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-semibold text-slate-500">सामग्री लोड हुँदैछ, कृपया प्रतीक्षा गर्नुहोस्...</p>
    </div>
  );
}
import { TrackedProject } from './types/procurement';
import { AppUser, ManagedUserInput } from './types/auth';
import {
  createManagedUser,
  createProject,
  deleteManagedUser,
  listManagedUsers,
  listProjects,
  restoreSessionUser,
  signUpWithEmail,
  signInWithUsername,
  signOut,
  updateManagedUser,
  updateProject,
} from './lib/supabaseApi';
import { isSupabaseConfigured, supabase } from './lib/supabase';

const PpmoPprcGuide = lazy(() => import('../ppmo_pprc/src/App'));
const ProcurementChatbot = lazy(() => import('./components/ProcurementChatbot'));

function ProcurementApp({
  currentUser,
  onLogout,
  authError,
}: {
  currentUser: AppUser;
  onLogout: () => void;
  authError: string;
}) {
  const [userMode, setUserMode] = useState<'entity' | 'bidder'>(() => {
    try {
      const saved = localStorage.getItem('app_user_mode');
      if (saved === 'bidder' || saved === 'entity') return saved;
    } catch {
      return 'entity';
    }
    return 'entity';
  });
  const [activeTab, setActiveTabState] = useState<string>(() => {
    try {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && TAB_TITLES[hash]) return hash;
      const savedMode = localStorage.getItem('app_user_mode');
      if (savedMode === 'bidder') return 'bidder-hub';
    } catch { }
    return 'dashboard';
  });

  const [historyStack, setHistoryStack] = useState<string[]>([activeTab]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [recentTabs, setRecentTabs] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('recent_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return [activeTab];
  });

  const setActiveTab = (tabId: string, addToHistory = true) => {
    if (!TAB_TITLES[tabId]) return;
    setActiveTabState(tabId);
    try {
      window.location.hash = '#' + tabId;
    } catch { }

    if (addToHistory) {
      setHistoryStack((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, tabId];
      });
      setHistoryIndex((prev) => prev + 1);
    }

    setRecentTabs((prev) => {
      const updated = [tabId, ...prev.filter((id) => id !== tabId)].slice(0, 6);
      try {
        sessionStorage.setItem('recent_tabs', JSON.stringify(updated));
      } catch { }
      return updated;
    });
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevTab = historyStack[historyIndex - 1];
      setHistoryIndex((i) => i - 1);
      setActiveTabState(prevTab);
      try {
        window.location.hash = '#' + prevTab;
      } catch { }
    }
  };

  const handleGoForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextTab = historyStack[historyIndex + 1];
      setHistoryIndex((i) => i + 1);
      setActiveTabState(nextTab);
      try {
        window.location.hash = '#' + nextTab;
      } catch { }
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyStack.length - 1;

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && TAB_TITLES[hash] && hash !== activeTab) {
        setActiveTab(hash, false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleUserMode = () => {
    setUserMode((prev) => {
      const next = prev === 'entity' ? 'bidder' : 'entity';
      try {
        localStorage.setItem('app_user_mode', next);
      } catch { }
      if (next === 'bidder') {
        setActiveTab('bidder-hub');
      } else {
        setActiveTab('dashboard');
      }
      return next;
    });
  };
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState<boolean>(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateSource, setTemplateSource] = useState<'advisor' | 'workflow' | null>(() => {
    try {
      const saved = sessionStorage.getItem('template_source');
      if (saved === 'advisor' || saved === 'workflow') return saved;
      if (sessionStorage.getItem('is_from_advisor') === 'true') return 'advisor';
    } catch {
      return null;
    }
    return null;
  });
  const [projects, setProjects] = useState<TrackedProject[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [userManagementError, setUserManagementError] = useState('');

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar_collapsed', String(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  useEffect(() => {
    let isCurrent = true;
    setIsProjectsLoading(true);
    setDataError('');
    void listProjects()
      .then((loadedProjects) => {
        if (isCurrent) setProjects(loadedProjects);
      })
      .catch((error: unknown) => {
        if (isCurrent) setDataError(error instanceof Error ? error.message : 'आयोजना विवरण लोड गर्न सकिएन।');
      })
      .finally(() => {
        if (isCurrent) setIsProjectsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (currentUser.role !== 'admin' || activeTab !== 'user-management') return;
    let isCurrent = true;
    setIsUsersLoading(true);
    setUserManagementError('');
    void listManagedUsers()
      .then((loadedUsers) => {
        if (isCurrent) setUsers(loadedUsers);
      })
      .catch((error: unknown) => {
        if (isCurrent) setUserManagementError(error instanceof Error ? error.message : 'प्रयोगकर्ता सूची लोड गर्न सकिएन।');
      })
      .finally(() => {
        if (isCurrent) setIsUsersLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [activeTab, currentUser.role]);

  useEffect(() => {
    if (currentUser.role !== 'admin' && activeTab === 'user-management') {
      setActiveTab('dashboard');
    }
  }, [activeTab, currentUser.role]);

  // Global keyboard shortcuts: "/" or "Ctrl+K" for search, "Ctrl+B" for sidebar collapse toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !isSearchOpen && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && !isInput) {
        e.preventDefault();
        handleToggleSidebarCollapse();
      } else if (e.altKey && e.key === 'ArrowLeft' && !isInput) {
        e.preventDefault();
        handleGoBack();
      } else if (e.altKey && e.key === 'ArrowRight' && !isInput) {
        e.preventDefault();
        handleGoForward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleUpdateProject = async (updated: TrackedProject) => {
    setDataError('');
    try {
      const savedProject = await updateProject(updated);
      setProjects((previous) => previous.map((project) => (
        project.id === savedProject.id ? savedProject : project
      )));
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'आयोजना परिवर्तन सुरक्षित गर्न सकिएन।');
    }
  };

  const handleAddProject = async (newProject: TrackedProject) => {
    setDataError('');
    try {
      const savedProject = await createProject(newProject, currentUser.id);
      setProjects((previous) => [savedProject, ...previous]);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'नयाँ आयोजना सुरक्षित गर्न सकिएन।');
      throw error;
    }
  };

  const handleAddUser = async (input: ManagedUserInput) => {
    const createdUser = await createManagedUser(input);
    setUsers((previous) => [...previous, createdUser]);
    return createdUser;
  };

  const handleUpdateUser = async (id: string, input: ManagedUserInput) => {
    const updatedUser = await updateManagedUser(id, input);
    setUsers((previous) => previous.map((user) => (user.id === id ? updatedUser : user)));
    return updatedUser;
  };

  const handleDeleteUser = async (id: string) => {
    await deleteManagedUser(id);
    setUsers((previous) => previous.filter((user) => user.id !== id));
  };

  const handleSelectSearchResult = (
    category: 'method' | 'stage' | 'checklist' | 'clause' | 'schedule' | 'dilemma' | 'glossary' | 'template' | 'restriction',
    id: string
  ) => {
    if (category === 'method') {
      setSelectedMethodId(id);
      setActiveTab('methods');
    } else if (category === 'stage') {
      setActiveTab('stages');
    } else if (category === 'checklist') {
      setActiveTab('checklists');
    } else if (category === 'clause') {
      setActiveTab('clauses');
    } else if (category === 'schedule') {
      setActiveTab('schedules');
    } else if (category === 'dilemma') {
      setActiveTab('dilemma-solver');
    } else if (category === 'glossary') {
      setActiveTab('glossary');
    } else if (category === 'template') {
      setSelectedTemplateId(id);
      setActiveTab('templates');
    } else if (category === 'restriction') {
      setActiveTab('law-corpus');
    }
  };

  const navigateToMethodWithId = (methodId: string) => {
    if (methodId === 'icb-goods' || methodId === 'icb-works') {
      setActiveTab('icb-guide');
      return;
    }
    setSelectedMethodId(methodId);
    setActiveTab('methods');
  };

  const navigateToTemplate = (templateId: string, source: 'advisor' | 'workflow' | null = null) => {
    setSelectedTemplateId(templateId);
    setTemplateSource(source);
    try {
      if (source) {
        sessionStorage.setItem('template_source', source);
      } else {
        sessionStorage.removeItem('template_source');
      }
    } catch {
      // ignore storage errors
    }
    setActiveTab('templates');
  };

  const handleBackToAdvisor = () => {
    setTemplateSource(null);
    try {
      sessionStorage.removeItem('template_source');
      sessionStorage.removeItem('is_from_advisor');
    } catch {
      // ignore storage errors
    }
    setActiveTab('advisor');
  };

  const handleBackToWorkflow = () => {
    setTemplateSource(null);
    try {
      sessionStorage.removeItem('template_source');
    } catch {
      // ignore storage errors
    }
    setActiveTab('workflow-wizard');
  };

  return (
    <div className="min-h-screen bg-[#f0f4fa] text-slate-900 font-sans">
      <a href="#main-content" className="skip-to-content">
        मुख्य सामग्रीमा जानुहोस्
      </a>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={currentUser.role}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
        userMode={userMode}
        onToggleUserMode={handleToggleUserMode}
      />
      <FloatingProcurementChatLauncher onOpen={() => setActiveTab('procurement-chat')} />

      {/* Main Content Area (offset by Sidebar width on desktop) */}
      <div className={`${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'} flex flex-col min-h-screen transition-all duration-200 ease-in-out`}>
        {/* Top Header with Breadcrumbs & Actions */}
        <TopHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onToggleSidebarMobile={() => setIsSidebarMobileOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onLogout={onLogout}
          userMode={userMode}
          onToggleUserMode={handleToggleUserMode}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          recentTabs={recentTabs}
        />

        {/* Viewport Content */}
        <main id="main-content" aria-label="पृष्ठको मुख्य सामग्री" className="flex-1 w-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {authError && (
            <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {authError}
            </p>
          )}

          {dataError && (
            <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {dataError}
            </p>
          )}

          {isProjectsLoading && activeTab === 'dashboard' && userMode !== 'bidder' && (
            <p role="status" className="mb-4 text-sm text-slate-600">आयोजना विवरण लोड हुँदैछ...</p>
          )}

          <Suspense fallback={<ViewLoadingFallback />}>
          {activeTab === 'dashboard' && (
            userMode === 'bidder' ? (
              <BidderPortalView
                onSwitchToEntityMode={handleToggleUserMode}
                onNavigateToLaw={() => setActiveTab('law-corpus')}
                onNavigateToEgpGuidelines={() => setActiveTab('egp-guidelines')}
              />
            ) : (
              <DashboardView
                projects={projects}
                onUpdateProject={handleUpdateProject}
                onOpenNewProjectModal={() => setIsNewProjectOpen(true)}
                onSelectMethod={navigateToMethodWithId}
                onSelectStage={() => setActiveTab('stages')}
                onNavigateToGuide={setActiveTab}
              />
            )
          )}

          {activeTab === 'bidder-hub' && (
            <BidderPortalView
              onSwitchToEntityMode={handleToggleUserMode}
              onNavigateToLaw={() => setActiveTab('law-corpus')}
              onNavigateToEgpGuidelines={() => setActiveTab('egp-guidelines')}
            />
          )}

          {activeTab === 'bidding-forms' && (
            <BiddingFormsGenerator />
          )}

          {activeTab === 'advisor' && (
            <ProcurementAdvisorWizard
              onSelectMethod={navigateToMethodWithId}
              onNavigateToTemplate={(templateId) => navigateToTemplate(templateId, 'advisor')}
              onNavigateToIcb={() => setActiveTab('icb-guide')}
            />
          )}

          {activeTab === 'workflow-wizard' && (
            <ProcurementWorkflowWizard
              onNavigateToTemplate={(templateId) => navigateToTemplate(templateId, 'workflow')}
              onNavigateToClause={(clause) => setActiveTab('law-corpus')}
            />
          )}

          {activeTab === 'methods' && (
            <ProcurementMethodsView
              initialSelectedMethodId={selectedMethodId}
              onClearInitialMethod={() => setSelectedMethodId(null)}
              onNavigateToIcb={() => setActiveTab('icb-guide')}
            />
          )}

          {activeTab === 'method-checklists' && (
            <MethodChecklistsView
              initialMethodId={selectedMethodId || undefined}
              onNavigateToTemplate={navigateToTemplate}
            />
          )}

          {activeTab === 'dilemma-solver' && (
            <ProcurementDilemmaSolverView />
          )}

          {activeTab === 'law-corpus' && (
            <CompleteLawCorpusView />
          )}

          {activeTab === 'amendments' && (
            <AmendmentsHighlightView />
          )}

          {activeTab === 'glossary' && (
            <ProcurementGlossaryView />
          )}

          {activeTab === 'stages' && (
            <StagesGuideView
              onSelectMethod={navigateToMethodWithId}
              onNavigateToEgpGuide={() => setActiveTab('egp-guidelines')}
            />
          )}

          {activeTab === 'icb-guide' && (
            <IcbProcurementHub
              initialUserMode={userMode}
              onNavigateToMethod={(methodId) => navigateToMethodWithId(methodId)}
              onNavigateToStages={() => setActiveTab('stages')}
              onNavigateToLaw={() => setActiveTab('law-corpus')}
            />
          )}

          {activeTab === 'egp-guidelines' && (
            <EgpGuidelinesView />
          )}

          {activeTab === 'templates' && (
            <TemplatesView
              initialTemplateId={selectedTemplateId}
              onSelectMethod={navigateToMethodWithId}
              onBackToAdvisor={templateSource === 'advisor' ? handleBackToAdvisor : undefined}
              onBackToWorkflow={templateSource === 'workflow' ? handleBackToWorkflow : undefined}
            />
          )}

          {activeTab === 'checklists' && (
            <ChecklistsView
              onNavigateToEvaluation={() => setActiveTab('bid-evaluation')}
              onNavigateToMethodChecklists={() => setActiveTab('method-checklists')}
            />
          )}

          {activeTab === 'bid-evaluation' && (
            <BidEvaluationGuideView
              onNavigateToLaw={() => setActiveTab('law-corpus')}
              onNavigateToChecklists={() => setActiveTab('checklists')}
            />
          )}

          {activeTab === 'timeline-calculator' && (
            <CalculatorView
              initialSubTab="timeline"
              onSelectMethod={navigateToMethodWithId}
            />
          )}

          {activeTab === 'calculator' && (
            <CalculatorView
              initialSubTab="threshold"
              onSelectMethod={navigateToMethodWithId}
            />
          )}

          {activeTab === 'clauses' && (
            <LegalClausesView />
          )}

          {activeTab === 'schedules' && (
            <SchedulesView />
          )}

          {activeTab === 'user-management' && currentUser.role === 'admin' && (
            isUsersLoading
              ? <p role="status" className="text-sm text-slate-600">प्रयोगकर्ता सूची लोड हुँदैछ...</p>
              : (
                <UserManagementView
                  users={users}
                  currentUser={currentUser}
                  error={userManagementError}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              )
          )}

          {activeTab === 'procurement-chat' && (
            <ProcurementChatbot onNavigate={setActiveTab} />
          )}

          {activeTab === 'ppmo-pprc' && (
            <PpmoPprcGuide embedded />
          )}
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-5 px-4 sm:px-8 no-print border-t border-slate-200/80 bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#1a4b82] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                ख
              </div>
              <span className="font-semibold text-slate-700">सार्वजनिक खरिद सहयोगी</span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="hidden sm:inline">ऐन २०६३ · नियमावली २०६४ (१६औँ संशोधन)</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              {[
                ['advisor', 'खरिद सल्लाहकार'],
                ['law-corpus', 'ऐन/नियम'],
                ['templates', 'कागजात ढाँचा'],
                ['calculator', 'क्याल्कुलेटर'],
              ].map(([tab, label]) => (
                <React.Fragment key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className="text-slate-400 hover:text-[#1a4b82] transition-colors font-medium"
                  >
                    {label}
                  </button>
                  <span className="text-slate-200 last:hidden">·</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* Universal Search & Multi-facet Filter Modal */}
      <Suspense fallback={null}>
        {isSearchOpen && (
          <SearchAndFilterModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectResult={handleSelectSearchResult}
          />
        )}

        {/* Add New Procurement Project Modal */}
        {isNewProjectOpen && (
          <NewProjectModal
            isOpen={isNewProjectOpen}
            onClose={() => setIsNewProjectOpen(false)}
            onAddProject={handleAddProject}
          />
        )}
      </Suspense>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMobileMenu={() => setIsSidebarMobileOpen(true)}
        userMode={userMode}
      />

      {/* Floating Scroll to Top button */}
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    let isCurrent = true;
    void restoreSessionUser()
      .then((user) => {
        if (isCurrent) setCurrentUser(user);
      })
      .catch((error: unknown) => {
        if (isCurrent) setAuthError(error instanceof Error ? error.message : 'लगइन सत्र पुनःस्थापना गर्न सकिएन।');
      })
      .finally(() => {
        if (isCurrent) setIsAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setCurrentUser(null);
    });

    return () => {
      isCurrent = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!currentUser) {
    if (!isSupabaseConfigured) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#f0f4fa] p-6">
          <section className="max-w-xl rounded-2xl border border-amber-200 bg-white p-7 shadow-sm">
            <h1 className="text-lg font-bold text-slate-900">Supabase configuration आवश्यक छ</h1>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
              Build गर्दा <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">VITE_SUPABASE_URL</code> र{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code> उपलब्ध गराउनुहोस्।
              Database schema र पहिलो admin setup का लागि <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">supabase/SETUP.md</code> हेर्नुहोस्।
            </p>
          </section>
        </main>
      );
    }
    if (isAuthLoading) {
      return (
        <main role="status" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f0f4fa]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a4b82] text-xl font-bold text-white shadow-lg">ख</div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">सार्वजनिक खरिद सहयोगी</p>
            <p className="text-xs text-slate-400 mt-1">लोड हुँदैछ...</p>
          </div>
          <div className="w-6 h-6 border-2 border-[#1a4b82]/20 border-t-[#1a4b82] rounded-full animate-spin" />
        </main>
      );
    }
    return (
      <LoginPage
        errorMessage={authError}
        onLogin={async (username, password) => {
          setAuthError('');
          const user = await signInWithUsername(username, password);
          setCurrentUser(user);
        }}
        onSignUp={async (username, email, password) => {
          setAuthError('');
          const user = await signUpWithEmail(username, email, password);
          if (user) {
            setCurrentUser(user);
            return false;
          }
          return true;
        }}
      />
    );
  }

  return (
    <ProcurementApp
      currentUser={currentUser}
      authError={authError}
      onLogout={() => {
        void signOut()
          .then(() => {
            setCurrentUser(null);
            setAuthError('');
          })
          .catch((error: unknown) => {
            setAuthError(error instanceof Error ? error.message : 'लगआउट गर्न सकिएन।');
          });
      }}
    />
  );
}
