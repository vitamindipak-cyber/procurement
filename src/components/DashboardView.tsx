import React, { useState } from 'react';
import dashboardImage from '../../image1.jpeg';
import { 
  PlusCircle, 
  Briefcase, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ChevronRight,
  Filter,
  Calendar,
  X,
  Printer,
  Edit3,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ProcessGuideStrip } from './ProcessGuideStrip';
import { BeginnerJourney } from './BeginnerJourney';
import { BeginnerTooltip } from './BeginnerTooltip';
import { TrackedProject, ProcurementType } from '../types/procurement';
import { 
  PROCUREMENT_METHODS, 
  PROCUREMENT_STAGES, 
  COMPLIANCE_CHECKLIST_MASTER 
} from '../data/procurementData';
import { 
  formatNepaliCurrency, 
  formatCompactCurrency, 
  analyzeProcurementThreshold 
} from '../utils/procurementUtils';

interface DashboardViewProps {
  projects: TrackedProject[];
  onUpdateProject: (project: TrackedProject) => void;
  onOpenNewProjectModal: () => void;
  onSelectMethod: (methodId: string) => void;
  onSelectStage: (stageId: string) => void;
  onNavigateToGuide?: (tabId: string) => void;
  beginnerMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onUpdateProject,
  onOpenNewProjectModal,
  onSelectMethod,
  onSelectStage,
  onNavigateToGuide,
  beginnerMode = true,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<TrackedProject | null>(null);
  const [activeTabInDrawer, setActiveTabInDrawer] = useState<'timeline' | 'checklist' | 'info'>('timeline');

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (selectedTypeFilter !== 'all' && p.procurementType !== selectedTypeFilter) return false;
    return true;
  });

  // Calculate Metrics
  const totalBudget = projects.reduce((acc, p) => acc + p.estimatedAmount, 0);
  const preparationCount = projects.filter((p) => p.currentStageId === 'stage-1' || p.currentStageId === 'stage-2').length;
  const biddingCount = projects.filter((p) => p.currentStageId === 'stage-3' || p.currentStageId === 'stage-4').length;
  const evaluationCount = projects.filter((p) => p.currentStageId === 'stage-5' || p.currentStageId === 'stage-6').length;
  const executionCount = projects.filter((p) => p.currentStageId === 'stage-7').length;
  const stageCounts = projects.reduce<Record<string, number>>((counts, project) => {
    counts[project.currentStageId] = (counts[project.currentStageId] ?? 0) + 1;
    return counts;
  }, {});
  const highlightedStageId = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const toggleChecklist = (projectId: string, checkId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const newStatus = {
      ...proj.checklistStatus,
      [checkId]: !proj.checklistStatus[checkId],
    };

    // calculate new progress percent based on completed items
    const relevantChecks = COMPLIANCE_CHECKLIST_MASTER.filter(c => c.procurementTypes.includes(proj.procurementType));
    const completedCount = relevantChecks.filter(c => newStatus[c.id]).length;
    const newProgress = Math.round((completedCount / relevantChecks.length) * 100);

    const updated = {
      ...proj,
      checklistStatus: newStatus,
      progressPercent: newProgress,
    };

    onUpdateProject(updated);
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(updated);
    }
  };

  const advanceStage = (projectId: string, nextStageId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;
    const updated = {
      ...proj,
      currentStageId: nextStageId,
    };
    onUpdateProject(updated);
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Quick Action */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:rounded-3xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(18,63,109,0.075),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(15,118,110,0.055),transparent_50%)]" />
        <div className="relative grid gap-4 p-4 sm:gap-8 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-600">
              <Building2 className="h-3.5 w-3.5 text-[#123f6d]" aria-hidden="true" />
              सार्वजनिक निकाय · खरिद अधिकृत गाइड
            </span>
            <h1 className="mt-3 text-xl font-extrabold leading-[1.18] text-slate-900 sm:mt-4 sm:text-3xl lg:text-[2.15rem]">
              खरिद प्रक्रियाको पूर्ण <span className="text-[#123f6d]">ड्यासबोर्ड</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              {beginnerMode
                ? 'तलको चरण छानेर एक-एक गर्दै अघि बढ्नुहोस्। प्रत्येक चरणमा के गर्ने, के नबिर्सने र कुन पृष्ठ खोल्ने लेखिएको छ।'
                : 'विधि छनोटदेखि मूल्याङ्कन, सम्झौता र फाइल अनुपालनसम्मको मार्गदर्शन — आयोजना ट्र्याकिङसहित।'}
            </p>

            <div className="mt-4 flex flex-col items-stretch gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={onOpenNewProjectModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123f6d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e3359]"
              >
                <PlusCircle className="h-4 w-4" />
                नयाँ खरिद आयोजना थप्नुहोस्
              </button>
              {beginnerMode ? (
                <button
                  type="button"
                  onClick={() => document.getElementById('beginner-journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>चरणबद्ध प्रक्रिया हेर्नुहोस्</span>
                  <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              ) : onNavigateToGuide && (
                <button
                  type="button"
                  onClick={() => onNavigateToGuide('advisor')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>विधि सल्लाहकारबाट सुरु गर्नुहोस्</span>
                  <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                १६औँ संशोधन समावेश
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                e-GP अनुपालन
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                ७ प्रक्रियागत चरण
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-white/70 shadow-lg">
              <img
                src={dashboardImage}
                alt="सार्वजनिक खरिद कार्यालय"
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2543]/80 via-[#0b2543]/15 to-transparent" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/60 bg-white/95 p-3.5 shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">हालको अवस्था</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  सक्रिय
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold tabular-nums text-slate-900">{projects.length}</div>
                  <div className="text-[10px] text-slate-500">आयोजना</div>
                </div>
                <div className="border-x border-slate-100">
                  <div className="text-lg font-bold tabular-nums text-slate-900">{biddingCount}</div>
                  <div className="text-[10px] text-slate-500">बोलपत्रमा</div>
                </div>
                <div>
                  <div className="text-lg font-bold tabular-nums text-slate-900">{executionCount}</div>
                  <div className="text-[10px] text-slate-500">कार्यान्वयन</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {beginnerMode && (
        <BeginnerJourney
          audience="entity"
          highlightStageId={highlightedStageId}
          onOpen={(step) => {
            if (step.tab && step.tab !== 'stages') onNavigateToGuide?.(step.tab);
            else onSelectStage(step.stageId || 'stage-1');
          }}
        />
      )}

      {onNavigateToGuide && (
        beginnerMode ? (
          <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <summary className="cursor-pointer text-sm font-bold text-slate-800">
              उपकरणहरू कुन क्रममा खोल्ने?
              <span className="mt-0.5 block text-xs font-medium text-slate-500">विधि सल्लाहकार, चेकलिस्ट र ऐन खोल्ने विस्तृत सूची</span>
            </summary>
            <div className="mt-4">
              <ProcessGuideStrip audience="entity" onSelect={onNavigateToGuide} />
            </div>
          </details>
        ) : (
          <ProcessGuideStrip audience="entity" onSelect={onNavigateToGuide} />
        )
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[
          {
            label: 'कुल चालू योजना',
            value: projects.length,
            unit: 'आयोजना',
            sub: `${formatCompactCurrency(totalBudget)} बजेट`,
            subClass: 'text-slate-500',
            icon: Briefcase,
            tint: 'bg-blue-50 text-blue-700',
            tooltipTitle: 'कुल चालू योजना',
            tooltip: 'यस प्रणालीमा राखिएका खरिद आयोजनाको संख्या र तिनीहरूको अनुमानित बजेट।',
            span: '',
          },
          {
            label: 'पूर्वतयारी/लागत',
            value: preparationCount,
            unit: 'योजना',
            sub: 'चरण १ र २ मा',
            subClass: 'text-amber-700',
            icon: Clock,
            tint: 'bg-amber-50 text-amber-700',
            tooltipTitle: 'पूर्वतयारी र लागत',
            tooltip: 'अहिले योजना बनाउने वा लागत अनुमान स्वीकृत गर्ने चरणमा रहेका आयोजना। खरिदको सुरुका दुई चरण हुन्।',
            span: '',
          },
          {
            label: 'बोलपत्र आह्वान',
            value: biddingCount,
            unit: 'योजना',
            sub: 'सूचना जारी (चरण ३-४)',
            subClass: 'text-sky-700',
            icon: FileText,
            tint: 'bg-sky-50 text-sky-700',
            tooltipTitle: 'बोलपत्र आह्वान',
            tooltip: 'सूचना प्रकाशित भइसकेको वा प्रस्ताव संकलन हुँदै गरेका आयोजना। अहिले चरण ३ र ४ मा छन्।',
            span: '',
          },
          {
            label: 'मूल्याङ्कन/आशय',
            value: evaluationCount,
            unit: 'योजना',
            sub: 'समितिमा विचाराधीन',
            subClass: 'text-violet-700',
            icon: CheckCircle2,
            tint: 'bg-violet-50 text-violet-700',
            tooltipTitle: 'मूल्याङ्कन र आशय',
            tooltip: 'प्रस्ताव जाँच्ने वा कसलाई छानियो भन्ने सूचना दिने चरणमा रहेका आयोजना।',
            span: '',
          },
          {
            label: 'सम्झौता कार्यान्वयन',
            value: executionCount,
            unit: 'योजना',
            sub: 'कार्य प्रगतिमा (चरण ७)',
            subClass: 'text-emerald-700',
            icon: Building2,
            tint: 'bg-emerald-50 text-emerald-700',
            tooltipTitle: 'सम्झौता कार्यान्वयन',
            tooltip: 'सम्झौता भइसकेर काम, आपूर्ति वा भुक्तानी चलिरहेका आयोजना।',
            span: 'col-span-2 sm:col-span-1',
          },
        ].map((metric) => {
          const MetricIcon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${metric.span}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold leading-snug text-slate-500">
                  {metric.label}
                  <BeginnerTooltip title={metric.tooltipTitle} content={metric.tooltip} position="bottom" />
                </span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${metric.tint}`}>
                  <MetricIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-slate-900 sm:text-[1.7rem]">{metric.value}</span>
                <span className="text-[11px] text-slate-500">{metric.unit}</span>
              </div>
              <div className={`mt-1.5 text-[11px] font-medium ${metric.subClass}`}>
                {metric.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects Management Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              खरिद आयोजनाहरूको सूची तथा चरणबद्ध स्थिति
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              आयोजनामा क्लिक गरी विस्तृत प्रक्रियागत चरण र कानूनी व्यवस्थाहरुको चेकलिस्ट हेर्नुहोस् र सम्पादन गर्नुहोस्।
            </p>
          </div>

          <div className="flex w-full items-center gap-2 overflow-x-auto sm:w-auto">
            {/* Filter buttons */}
            <div className="flex w-max items-center rounded-xl bg-slate-100 p-1 text-xs font-medium" role="group" aria-label="आयोजना प्रकारबाट छान्नुहोस्">
              <button
                onClick={() => setSelectedTypeFilter('all')}
                aria-pressed={selectedTypeFilter === 'all'}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedTypeFilter === 'all'
                    ? 'bg-white text-[#123f6d] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                सबै ({projects.length})
              </button>
              <button
                onClick={() => setSelectedTypeFilter('works')}
                aria-pressed={selectedTypeFilter === 'works'}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedTypeFilter === 'works'
                    ? 'bg-white text-[#123f6d] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                निर्माण
              </button>
              <button
                onClick={() => setSelectedTypeFilter('goods')}
                aria-pressed={selectedTypeFilter === 'goods'}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedTypeFilter === 'goods'
                    ? 'bg-white text-[#123f6d] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                मालसामान
              </button>
              <button
                onClick={() => setSelectedTypeFilter('consulting')}
                aria-pressed={selectedTypeFilter === 'consulting'}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedTypeFilter === 'consulting'
                    ? 'bg-white text-[#123f6d] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                परामर्श
              </button>
              <button
                onClick={() => setSelectedTypeFilter('services')}
                aria-pressed={selectedTypeFilter === 'services'}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedTypeFilter === 'services'
                    ? 'bg-white text-[#123f6d] shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                गैर-परामर्श सेवा
              </button>
            </div>
          </div>
        </div>

        {/* Project Table List */}
        <div className="divide-y divide-slate-100">
          {filteredProjects.length === 0 && (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff5fc] text-[#123f6d]">
                <Briefcase className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                {projects.length === 0 ? 'अहिलेसम्म कुनै आयोजना छैन' : 'यो प्रकारको आयोजना भेटिएन'}
              </h3>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">
                {projects.length === 0
                  ? 'नयाँ हुनुहुन्छ भने पहिले खरिद विधि सल्लाहकारबाट सुरु गर्नुहोस्। त्यसपछि आयोजना थपेर यसको चरण, बजेट र अनुपालन प्रगति यहाँ हेर्न सक्नुहुन्छ।'
                  : 'अर्को प्रकार छान्नुहोस् वा सबै आयोजना सूचीमा फर्कनुहोस्।'}
              </p>
              {projects.length === 0 ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {onNavigateToGuide && (
                    <button
                      onClick={() => onNavigateToGuide('advisor')}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#123f6d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e3359]"
                    >
                      <ShieldCheck className="h-4 w-4" /> पहिले विधि सल्लाहकार चलाउनुहोस्
                    </button>
                  )}
                  <button onClick={onOpenNewProjectModal} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <PlusCircle className="h-4 w-4" /> पहिलो आयोजना थप्नुहोस्
                  </button>
                </div>
              ) : (
                <button onClick={() => setSelectedTypeFilter('all')} className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  सबै आयोजना देखाउनुहोस्
                </button>
              )}
            </div>
          )}
          {filteredProjects.map((project) => {
            const method = PROCUREMENT_METHODS.find((m) => m.id === project.methodId);
            const stage = PROCUREMENT_STAGES.find((s) => s.id === project.currentStageId);
            const totalChecks = COMPLIANCE_CHECKLIST_MASTER.filter(c => c.procurementTypes.includes(project.procurementType)).length;
            const completedChecks = Object.keys(project.checklistStatus).filter(k => project.checklistStatus[k]).length;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                aria-label={`${project.title} को विवरण खोल्नुहोस्`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                className="p-3 hover:bg-slate-50/60 transition-colors cursor-pointer group sm:p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Project title & metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-slate-700">{project.officeName}</span>
                      <span>·</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/70 font-semibold">
                        {project.procurementType === 'works' ? 'निर्माण कार्य' : project.procurementType === 'goods' ? 'मालसामान' : project.procurementType === 'services' ? 'गैर-परामर्श सेवा' : 'परामर्श सेवा'}
                      </span>
                      <span>·</span>
                      <span className="text-slate-500">{method?.nameNepali || 'खुला बोलपत्र'}</span>
                    </div>

                    <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[#123f6d] transition-colors">
                      {project.title}
                    </h3>

                    {project.notes && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                        टिप्पणी: {project.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Stage, Amount & Progress */}
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(130px,1fr)_32px] items-center gap-2 sm:flex sm:items-center sm:gap-6 sm:justify-between lg:justify-end">
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] text-slate-500">लागत अनुमान</div>
                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatNepaliCurrency(project.estimatedAmount)}
                      </div>
                    </div>

                    <div className="text-left lg:text-right min-w-[130px]">
                      <div className="text-xs font-medium text-slate-700">
                        {stage?.titleNepali.split('.')[1] || 'कार्यान्वयन'}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#123f6d] h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${project.progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 tabular-nums">
                          {project.progressPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#eff5fc] group-hover:text-[#123f6d] transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Micro Stage Steps Visual Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-7 gap-1">
                  {PROCUREMENT_STAGES.map((stg) => {
                    const isCurrent = project.currentStageId === stg.id;
                    const isPassed = stg.stageNo < (stage?.stageNo || 1);
                    return (
                      <div
                        key={stg.id}
                        className="flex flex-col items-center text-center"
                        title={`${stg.titleNepali}`}
                      >
                        <div
                          className={`h-1.5 w-full rounded-full transition-colors ${
                            isPassed
                              ? 'bg-emerald-500'
                              : isCurrent
                              ? 'bg-[#123f6d] ring-2 ring-[#123f6d]/10'
                              : 'bg-slate-200'
                          }`}
                        ></div>
                        <span className={`text-[10px] mt-1 hidden sm:block truncate w-full ${isCurrent ? 'text-[#123f6d] font-semibold' : 'text-slate-400'}`}>
                          {stg.stageNo}. {stg.titleNepali.split('.')[1]?.trim().slice(0, 8)}...
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Project Drawer / Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-white flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700">{selectedProject.officeName}</span>
                  <span>·</span>
                  <span>बजेट: {formatNepaliCurrency(selectedProject.estimatedAmount)}</span>
                  <span>·</span>
                  <span>स्रोत: {selectedProject.budgetSource}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {selectedProject.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors no-print"
                  title="प्रिन्ट सारांश"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-nav inside Drawer */}
            <div className="px-5 pt-2 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTabInDrawer('timeline')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
                    activeTabInDrawer === 'timeline'
                      ? 'border-[#123f6d] text-[#123f6d]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  प्रक्रियागत चरण तथा टाइमलाइन
                </button>
                <button
                  onClick={() => setActiveTabInDrawer('checklist')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
                    activeTabInDrawer === 'checklist'
                      ? 'border-[#123f6d] text-[#123f6d]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  परिपालना चेकलिस्ट ({Object.keys(selectedProject.checklistStatus).filter(k => selectedProject.checklistStatus[k]).length} सम्पन्न)
                </button>
                <button
                  onClick={() => setActiveTabInDrawer('info')}
                  className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
                    activeTabInDrawer === 'info'
                      ? 'border-[#123f6d] text-[#123f6d]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  कानूनी व्यवस्था तथा स्वीकृत गर्ने अधिकारी
                </button>
              </div>

              {/* Quick stage advance selector */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-slate-500 font-medium">हालको चरण:</span>
                <select
                  value={selectedProject.currentStageId}
                  onChange={(e) => advanceStage(selectedProject.id, e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123f6d]/20"
                >
                  {PROCUREMENT_STAGES.map((stg) => (
                    <option key={stg.id} value={stg.id}>
                      {stg.titleNepali}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-6 bg-slate-50/40">
              {activeTabInDrawer === 'timeline' && (
                <div className="space-y-4">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-center justify-between">
                    <div>
                      खरिद विधि: <span className="font-semibold text-slate-900">{PROCUREMENT_METHODS.find(m => m.id === selectedProject.methodId)?.nameNepali}</span>
                    </div>
                    <div>
                      समग्र प्रगति: <span className="font-bold text-[#123f6d] tabular-nums">{selectedProject.progressPercent}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {PROCUREMENT_STAGES.map((stg) => {
                      const isCurrent = selectedProject.currentStageId === stg.id;
                      const currentStageObj = PROCUREMENT_STAGES.find(s => s.id === selectedProject.currentStageId);
                      const isCompleted = stg.stageNo < (currentStageObj?.stageNo || 1);

                      return (
                        <div
                          key={stg.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'border-[#123f6d]/25 bg-white shadow-xs ring-1 ring-[#123f6d]/10'
                              : isCompleted
                              ? 'border-slate-200/80 bg-white'
                              : 'border-slate-200/60 bg-slate-50/60 opacity-75'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                    ? 'bg-[#123f6d] text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {isCompleted ? <Check className="w-4 h-4" /> : stg.stageNo}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">
                                  {stg.titleNepali}
                                </h4>
                                <p className="text-xs text-slate-600 mt-1">{stg.description}</p>
                                <div className="text-[11px] text-slate-500 font-mono mt-1">
                                  कानूनी आधार: {stg.legalBasis}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => advanceStage(selectedProject.id, stg.id)}
                              className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                                isCurrent
                                  ? 'bg-[#123f6d] text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isCurrent ? 'सक्रिय चरण' : 'यस चरणमा सार्नुहोस्'}
                            </button>
                          </div>

                          {/* Quick stage activities preview */}
                          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                            <span className="font-semibold text-slate-700">प्रमुख कार्यहरू:</span>
                            <ul className="list-disc pl-5 mt-1 space-y-0.5">
                              {stg.keyActivities.slice(0, 3).map((act, idx) => (
                                <li key={idx}>{act}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTabInDrawer === 'checklist' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                    <span>
                      यस आयोजनाका लागि लागू हुने कानूनी व्यवस्थाहरू टिक लगाउनुहोस्।
                    </span>
                    <span className="font-semibold text-slate-900">
                      प्रगति: {selectedProject.progressPercent}%
                    </span>
                  </div>

                  <div className="space-y-4">
                    {PROCUREMENT_STAGES.map((stg) => {
                      const stageChecks = COMPLIANCE_CHECKLIST_MASTER.filter(
                        c => c.stageId === stg.id && c.procurementTypes.includes(selectedProject.procurementType)
                      );
                      if (stageChecks.length === 0) return null;

                      return (
                        <div key={stg.id} className="border border-slate-200/80 rounded-2xl p-3.5 bg-white">
                          <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide flex items-center justify-between">
                            <span>{stg.titleNepali}</span>
                            <span className="text-[11px] text-slate-500 font-normal">
                              ({stageChecks.filter(c => selectedProject.checklistStatus[c.id]).length} / {stageChecks.length} सम्पन्न)
                            </span>
                          </h4>

                          <div className="space-y-2">
                            {stageChecks.map((chk) => {
                              const isChecked = !!selectedProject.checklistStatus[chk.id];
                              return (
                                <label
                                  key={chk.id}
                                  className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left bg-slate-50/60 border border-slate-200/70"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleChecklist(selectedProject.id, chk.id)}
                                    className="mt-0.5 w-4 h-4 accent-[#123f6d] rounded border-slate-300 focus:ring-[#123f6d]/30 cursor-pointer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                      {chk.text}
                                    </span>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                                      <span className="font-mono text-emerald-800">{chk.legalRef}</span>
                                      {chk.notes && <span>· {chk.notes}</span>}
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTabInDrawer === 'info' && (
                <div className="space-y-4">
                  {/* Analysis of threshold for this project */}
                  {(() => {
                    const analysis = analyzeProcurementThreshold(selectedProject.procurementType, selectedProject.estimatedAmount);
                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/80">
                          <h4 className="text-sm font-bold text-slate-900 mb-2">
                            स्वीकृत गर्ने अधिकारी तथा रकमको सीमा
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
                              <span className="text-slate-500 block">लागत अनुमान स्वीकृत गर्ने अधिकारी</span>
                              <span className="font-bold text-slate-900 mt-0.5 block">{analysis.approvingAuthorityCostEstimate}</span>
                            </div>
                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
                              <span className="text-slate-500 block">बोलपत्र स्वीकृत गर्ने अधिकारी</span>
                              <span className="font-bold text-slate-900 mt-0.5 block">{analysis.approvingAuthorityBidAcceptance}</span>
                            </div>
                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
                              <span className="text-slate-500 block">बोलपत्र जमानत (Bid Security २-३%)</span>
                              <span className="font-bold text-slate-900 mt-0.5 block font-mono">
                                {formatNepaliCurrency(analysis.requiredBidSecurityRange.minAmount)} देखि {formatNepaliCurrency(analysis.requiredBidSecurityRange.maxAmount)}
                              </span>
                            </div>
                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70">
                              <span className="text-slate-500 block">कार्यसम्पादन जमानत (५%)</span>
                              <span className="font-bold text-slate-900 mt-0.5 block font-mono">
                                {formatNepaliCurrency(analysis.minimumPerformanceSecurity)} (कबुल अङ्कको ५% — दफा २७(४))
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                          <h4 className="font-bold text-slate-900 text-sm">यस आयोजनाका मुख्य कानूनी सर्तहरू:</h4>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">बोलपत्र मान्य अवधि:</span>
                            <span className="font-mono">{analysis.bidValidityDays} दिन (जमानत अवधि {analysis.bidSecurityValidityDays} दिन)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">सूचना प्रकाशन म्याद:</span>
                            <span className="font-mono">कम्तीमा {analysis.minimumNoticeDays} दिन (e-GP अनिवार्य)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">दुई खाम प्रणाली:</span>
                            <span className="font-mono">{analysis.isTwoEnvelopeRequired ? 'अनिवार्य (लागत रु २ करोड माथि)' : 'ऐच्छिक/लागू नहुने'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">सामाजिक सुरक्षा कोष (SSF):</span>
                            <span>ऐनको दफा ५२ख अनुसार कामदारहरूको SSF आबद्धता र बैंक खाता भुक्तानी अनिवार्य</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">मोबिलाइजेसन पेश्की:</span>
                            <span>अधिकतम २०% (पहिलो पटक १०% सम्म) बैंक ग्यारेन्टी विरुद्ध</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono text-slate-500">आयोजना ID: {selectedProject.id}</span>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-[#123f6d] hover:bg-[#0e3359] text-white font-semibold rounded-lg transition-colors"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
