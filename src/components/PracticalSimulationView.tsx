import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileJson2,
  GraduationCap,
  ListChecks,
  Play,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AppUser } from '../types/auth';
import {
  SimulationAttempt,
  SimulationCaseDraft,
  SimulationCaseVersion,
  SimulationCertificate,
  SimulationLegalReference,
  SimulationSection,
} from '../types/simulation';
import {
  completeSimulationAttempt,
  ensureDefaultSimulationCases,
  getPublishedSimulationCaseVersion,
  issueSimulationCertificate,
  listAdminSimulationCaseVersions,
  listPublishedSimulationCases,
  listSimulationAttempts,
  listSimulationCertificates,
  saveSimulationAnswer,
  saveSimulationCaseVersion,
  startSimulationAttempt,
  validateSimulationCaseDraft,
} from '../lib/supabaseApi';
import { classifySimulationScore } from '../lib/simulationScoring';
import {
  PRACTICAL_SIMULATION_CASES,
  SIMULATION_LEGAL_REFERENCES,
  SIMULATION_SECTION_TO_TAB,
} from '../data/practicalSimulationCases';

const SECTION_TO_TAB: Record<SimulationSection, string> = SIMULATION_SECTION_TO_TAB;

const TAB_TO_SECTION = Object.fromEntries(
  Object.entries(SECTION_TO_TAB).map(([section, tab]) => [tab, section]),
) as Record<string, SimulationSection>;

const sectionLinks: Array<{ id: SimulationSection; label: string; icon: typeof GraduationCap }> = [
  { id: 'dashboard', label: 'अवलोकन', icon: GraduationCap },
  { id: 'cases', label: 'अभ्यास केस', icon: ListChecks },
  { id: 'progress', label: 'प्रगति', icon: ClipboardCheck },
  { id: 'reports', label: 'प्रतिवेदन', icon: FileJson2 },
  { id: 'certificates', label: 'प्रमाणपत्र', icon: Award },
  { id: 'legal', label: 'कानुनी सन्दर्भ', icon: BookOpen },
  { id: 'case-management', label: 'केस व्यवस्थापन', icon: ShieldCheck },
];

const formatDate = (date: string) => new Date(date).toLocaleDateString('ne-NP', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const scoreLabel = (attempt: SimulationAttempt) =>
  attempt.result ? `${attempt.result.score}/100` : 'अपूर्ण';

const makeDraftJson = (draft: SimulationCaseDraft) => JSON.stringify(draft, null, 2);
const firstStarterCase = PRACTICAL_SIMULATION_CASES[0];
const firstStarterAnswerKey = firstStarterCase.answerKey;
if (!firstStarterAnswerKey) throw new Error('The starter simulation case must include an answer key.');

interface PracticalSimulationViewProps {
  currentUser: AppUser;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const PracticalSimulationView: React.FC<PracticalSimulationViewProps> = ({
  currentUser,
  activeTab,
  onNavigate,
}) => {
  const section = TAB_TO_SECTION[activeTab] ?? 'dashboard';
  const isAdmin = currentUser.role === 'admin';
  const [cases, setCases] = useState<SimulationCaseVersion[]>([]);
  const [attempts, setAttempts] = useState<SimulationAttempt[]>([]);
  const [certificates, setCertificates] = useState<SimulationCertificate[]>([]);
  const [adminVersions, setAdminVersions] = useState<SimulationCaseVersion[]>([]);
  const [activeAttempt, setActiveAttempt] = useState<SimulationAttempt | null>(null);
  const [activeCase, setActiveCase] = useState<SimulationCaseVersion | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [numericDrafts, setNumericDrafts] = useState<Record<string, string>>({});
  const [displayName, setDisplayName] = useState(currentUser.username);
  const [caseEditor, setCaseEditor] = useState(() => makeDraftJson({
    caseKey: firstStarterCase.caseKey,
    content: firstStarterCase.content,
    answerKey: firstStarterAnswerKey,
  }));
  const [selectedVersion, setSelectedVersion] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      const [publishedCases, userAttempts, userCertificates] = await Promise.all([
        listPublishedSimulationCases(),
        listSimulationAttempts(currentUser.id, currentUser.role),
        listSimulationCertificates(currentUser.id, currentUser.role),
      ]);
      setCases(publishedCases);
      setAttempts(userAttempts);
      setCertificates(userCertificates);

      if (isAdmin) {
        try {
          await ensureDefaultSimulationCases();
        } catch (seedError) {
          setError(seedError instanceof Error ? seedError.message : 'Starter case सुरक्षित गर्न सकिएन।');
        }
        try {
          setCases(await listPublishedSimulationCases());
        } catch (caseError) {
          const message = caseError instanceof Error ? caseError.message : 'प्रकाशित केस लोड गर्न सकिएन।';
          setError((previous) => previous ? `${previous} ${message}` : message);
        }
        try {
          setAdminVersions(await listAdminSimulationCaseVersions());
        } catch (adminError) {
          const message = adminError instanceof Error
            ? adminError.message
            : 'प्रशासक केस सूची लोड गर्न सकिएन।';
          setError((previous) => previous ? `${previous} ${message}` : message);
        }
      } else {
        setAdminVersions([]);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'अभ्यास विवरण लोड गर्न सकिएन।');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    void loadData(true);
  }, [currentUser.id, currentUser.role]);

  const selectedCaseDraft = useMemo(() => {
    if (!selectedVersion) return null;
    const [caseKey, version] = selectedVersion.split(':');
    return adminVersions.find((item) =>
      item.caseKey === caseKey && item.version === Number(version),
    ) ?? null;
  }, [adminVersions, selectedVersion]);

  useEffect(() => {
    if (!selectedCaseDraft?.answerKey) return;
    setCaseEditor(makeDraftJson({
      caseKey: selectedCaseDraft.caseKey,
      content: selectedCaseDraft.content,
      answerKey: selectedCaseDraft.answerKey,
    }));
  }, [selectedCaseDraft]);

  const navigate = (nextSection: SimulationSection) => onNavigate(SECTION_TO_TAB[nextSection]);

  const beginCase = async (simulationCase: SimulationCaseVersion) => {
    setWorking(true);
    setError('');
    try {
      const existing = attempts.find((attempt) =>
        attempt.caseKey === simulationCase.caseKey && attempt.status === 'in_progress',
      );
      if (existing) {
        const existingCase = await getPublishedSimulationCaseVersion(
          existing.caseKey,
          existing.caseVersion,
        );
        setActiveCase(existingCase);
        setActiveAttempt(existing);
        setNumericDrafts(Object.fromEntries(Object.entries(existing.answers)
          .map(([stepId, value]) => [stepId, String(value)])));
      } else {
        const attempt = await startSimulationAttempt(currentUser.id, simulationCase);
        setActiveCase(simulationCase);
        setActiveAttempt(attempt);
        setNumericDrafts({});
        setAttempts((previous) => [attempt, ...previous]);
      }
      setStepIndex(0);
      navigate('cases');
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : 'अभ्यास सुरु गर्न सकिएन।');
    } finally {
      setWorking(false);
    }
  };

  const resumeAttempt = async (attempt: SimulationAttempt) => {
    setWorking(true);
    setError('');
    try {
      const simulationCase = await getPublishedSimulationCaseVersion(
        attempt.caseKey,
        attempt.caseVersion,
      );
      setActiveCase(simulationCase);
      setActiveAttempt(attempt);
      setNumericDrafts(Object.fromEntries(Object.entries(attempt.answers)
        .map(([stepId, value]) => [stepId, String(value)])));
      setStepIndex(0);
      navigate('cases');
    } catch (resumeError) {
      setError(resumeError instanceof Error ? resumeError.message : 'अभ्यास पुनः सुरु गर्न सकिएन।');
    } finally {
      setWorking(false);
    }
  };

  const saveAnswer = async (stepId: string, value: string | number) => {
    if (!activeAttempt) return;
    setError('');
    setWorking(true);
    const previousValue = activeAttempt.answers[stepId];
    setActiveAttempt((previous) => previous ? {
      ...previous,
      answers: { ...previous.answers, [stepId]: value },
    } : previous);
    try {
      await saveSimulationAnswer(activeAttempt.id, currentUser.id, stepId, value);
      setActiveAttempt((previous) => previous ? {
        ...previous,
        answers: { ...previous.answers, [stepId]: value },
        updatedAt: new Date().toISOString(),
      } : previous);
    } catch (answerError) {
      setActiveAttempt((previous) => {
        if (!previous) return previous;
        const answers = { ...previous.answers };
        if (previousValue === undefined) delete answers[stepId];
        else answers[stepId] = previousValue;
        return { ...previous, answers };
      });
      setError(answerError instanceof Error ? answerError.message : 'उत्तर सुरक्षित गर्न सकिएन।');
    } finally {
      setWorking(false);
    }
  };

  const submitAttempt = async () => {
    if (!activeAttempt || !activeCase) return;
    const unanswered = activeCase.content.steps.find((step) =>
      activeAttempt.answers[step.id] === undefined || activeAttempt.answers[step.id] === '',
    );
    if (unanswered) {
      setError(`पहिले “${unanswered.title}” प्रश्नको उत्तर दिनुहोस्।`);
      return;
    }

    setWorking(true);
    setError('');
    try {
      const result = await completeSimulationAttempt(activeAttempt.id, currentUser.id);
      const completed = { ...activeAttempt, status: 'completed' as const, result };
      setActiveAttempt(completed);
      setAttempts((previous) => previous.map((item) => item.id === completed.id ? completed : item));
      setNotice('तपाईंको अभ्यास मूल्याङ्कन सम्पन्न भयो।');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'अभ्यास मूल्याङ्कन गर्न सकिएन।');
    } finally {
      setWorking(false);
    }
  };

  const requestCertificate = async () => {
    if (!activeAttempt) return;
    setWorking(true);
    setError('');
    try {
      const certificate = await issueSimulationCertificate(
        activeAttempt.id,
        currentUser.id,
        displayName,
      );
      setCertificates((previous) => [
        certificate,
        ...previous.filter((item) => item.code !== certificate.code),
      ]);
      setNotice(certificate.isSample
        ? 'स्थानीय नमुना प्रमाणपत्र तयार भयो; यो आधिकारिक प्रमाणपत्र होइन।'
        : 'प्रमाणपत्र तयार भयो।');
      navigate('certificates');
    } catch (certificateError) {
      setError(certificateError instanceof Error ? certificateError.message : 'प्रमाणपत्र तयार गर्न सकिएन।');
    } finally {
      setWorking(false);
    }
  };

  const saveCase = async (status: 'draft' | 'published') => {
    setWorking(true);
    setError('');
    setNotice('');
    try {
      const parsed: unknown = JSON.parse(caseEditor);
      validateSimulationCaseDraft(parsed);
      const saved = await saveSimulationCaseVersion(parsed, status);
      setNotice(`केस संस्करण ${saved.version} ${status === 'published' ? 'प्रकाशित' : 'मस्यौदाका रूपमा सुरक्षित'} भयो।`);
      setSelectedVersion(`${saved.caseKey}:${saved.version}`);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'केस सुरक्षित गर्न सकिएन।');
    } finally {
      setWorking(false);
    }
  };

  const newCase = () => {
    setSelectedVersion('');
    setCaseEditor(makeDraftJson({
      caseKey: 'new-simulation-case',
      content: {
        title: 'नयाँ अभ्यास केस',
        category: 'खरिद प्रक्रिया',
        difficulty: 'सुरुआती',
        estimatedMinutes: 10,
        scenario: '',
        objectives: [],
        priorKnowledge: [],
        steps: [],
        legalReferenceIds: [],
      },
      answerKey: {},
    }));
  };

  const currentStep = activeCase?.content.steps[stepIndex];
  const inProgressCount = attempts.filter((attempt) => attempt.status === 'in_progress').length;
  const completedAttempts = attempts.filter((attempt) => attempt.result);
  const averageScore = completedAttempts.length
    ? Math.round(completedAttempts.reduce((total, item) => total + (item.result?.score ?? 0), 0) / completedAttempts.length)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#123f6d] via-[#174f7e] to-[#0f766e] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-4 w-4" />
              Practical Simulation Lab
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">सार्वजनिक खरिद व्यावहारिक अभ्यासशाला</h1>
            <p className="mt-2 text-sm leading-6 text-blue-50">
              काल्पनिक परिदृश्यमा निर्णय अभ्यास गर्नुहोस्, आफ्नो प्रगति हेर्नुहोस् र कानुनी सन्दर्भ जाँच्नुहोस्।
              वास्तविक खरिद निर्णयमा लागू आधिकारिक कानून र कागजात नै हेर्नुहोस्।
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
            <p className="text-blue-100">अभ्यासकर्ता</p>
            <p className="mt-0.5 font-bold">{currentUser.username}</p>
          </div>
        </div>
      </header>

      <nav aria-label="Simulation sections" className="flex gap-2 overflow-x-auto pb-1">
        {sectionLinks.filter((item) => item.id !== 'case-management' || isAdmin).map((item) => {
          const Icon = item.icon;
          const isActive = item.id === section;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-[#123f6d] bg-[#123f6d] text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {loading ? (
        <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">अभ्यास विवरण लोड हुँदैछ...</p>
      ) : (
        <>
          {section === 'dashboard' && (
            <section className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'उपलब्ध केस', value: cases.length, icon: ListChecks },
                  { label: 'सुरु भएका अभ्यास', value: attempts.length, icon: Play },
                  { label: 'जारी अभ्यास', value: inProgressCount, icon: RotateCcw },
                  { label: 'औसत स्कोर', value: `${averageScore}/100`, icon: Award },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        {item.label}<Icon className="h-5 w-5 text-[#174f7e]" />
                      </div>
                      <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
                    </div>
                  );
                })}
              </div>
              <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">अभ्यास जारी राख्नुहोस्</h2>
                      <p className="mt-1 text-sm text-slate-500">बीचमै रोकिएका केसहरूबाट अगाडि बढ्नुहोस्।</p>
                    </div>
                    <button type="button" onClick={() => navigate('cases')} className="text-sm font-semibold text-[#123f6d]">सबै केस</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {attempts.filter((attempt) => attempt.status === 'in_progress').slice(0, 3).map((attempt) => {
                      const simulationCase = cases.find((item) => item.caseKey === attempt.caseKey);
                      return (
                        <div key={attempt.id} className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">{simulationCase?.content.title ?? attempt.caseKey}</p>
                            <p className="mt-1 text-xs text-slate-500">प्रयास {attempt.attemptNumber} · {formatDate(attempt.updatedAt)}</p>
                          </div>
                          <button type="button" disabled={working} onClick={() => void resumeAttempt(attempt)} className="rounded-lg bg-[#123f6d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">जारी राख्नुहोस्</button>
                        </div>
                      );
                    })}
                    {inProgressCount === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">अहिले जारी अभ्यास छैन। अभ्यास केसबाट सुरु गर्नुहोस्।</p>}
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <div>
                      <h2 className="font-bold text-amber-950">अभ्याससम्बन्धी सूचना</h2>
                      <p className="mt-2 text-sm leading-6 text-amber-900">
                        स्कोरिङ अभ्यासका लागि मात्र हो। केसमा दिइएका कर, मूल्य र कानुनी सन्दर्भ परिदृश्य-विशेष हुन्; तिनलाई वास्तविक कानुनी राय वा स्वीकृत निर्णय नमान्नुहोस्।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {section === 'cases' && (
            <section className="space-y-5">
              {activeAttempt && activeCase ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  {activeAttempt.result ? (
                    <ResultPanel
                      simulationCase={activeCase}
                      attempt={activeAttempt}
                      displayName={displayName}
                      onDisplayNameChange={setDisplayName}
                      onIssueCertificate={() => void requestCertificate()}
                      working={working}
                      onReturn={() => {
                        setActiveAttempt(null);
                        setActiveCase(null);
                        navigate('progress');
                      }}
                    />
                  ) : currentStep ? (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <button type="button" onClick={() => { setActiveAttempt(null); setActiveCase(null); }} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900"><ChevronLeft className="h-4 w-4" /> केस सूची</button>
                          <p className="text-xs font-bold uppercase tracking-wide text-[#176b70]">{activeCase.content.category} · प्रयास {activeAttempt.attemptNumber}</p>
                          <h2 className="mt-1 text-xl font-bold text-slate-900">{activeCase.content.title}</h2>
                        </div>
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">प्रश्न {stepIndex + 1} / {activeCase.content.steps.length}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={activeCase.content.steps.length}>
                        <div className="h-full rounded-full bg-[#176b70] transition-all" style={{ width: `${((stepIndex + 1) / activeCase.content.steps.length) * 100}%` }} />
                      </div>
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                        <h3 className="font-bold text-blue-950">परिदृश्य</h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-blue-900">{activeCase.content.scenario}</p>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{currentStep.title}</h3>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{currentStep.points} अङ्क</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{currentStep.prompt}</p>
                        {currentStep.questionType === 'single-choice' ? (
                          <div className="mt-4 grid gap-3">
                            {currentStep.options?.map((option) => {
                              const selected = activeAttempt.answers[currentStep.id] === option.id;
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  disabled={working}
                                  onClick={() => void saveAnswer(currentStep.id, option.id)}
                                  className={`w-full rounded-xl border p-4 text-left text-sm leading-6 transition-colors disabled:opacity-60 ${
                                    selected ? 'border-[#176b70] bg-emerald-50 text-emerald-950 ring-1 ring-[#176b70]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="flex items-start gap-3">
                                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#176b70] bg-[#176b70] text-white' : 'border-slate-300'}`}>{selected && <CheckCircle2 className="h-4 w-4" />}</span>
                                    {option.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <label className="mt-4 block max-w-md text-sm font-semibold text-slate-700">
                            उत्तर {currentStep.numberUnit ? `(${currentStep.numberUnit})` : ''}
                            <input
                              type="number"
                              value={numericDrafts[currentStep.id] ?? String(activeAttempt.answers[currentStep.id] ?? '')}
                              onChange={(event) => setNumericDrafts((previous) => ({
                                ...previous,
                                [currentStep.id]: event.target.value,
                              }))}
                              onBlur={(event) => {
                                const value = event.currentTarget.value;
                                if (value !== String(activeAttempt.answers[currentStep.id] ?? '')) {
                                  void saveAnswer(currentStep.id, value);
                                }
                              }}
                              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#176b70] focus:ring-2 focus:ring-emerald-100"
                            />
                          </label>
                        )}
                        {currentStep.legalReferenceIds.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {currentStep.legalReferenceIds.map((id) => {
                              const reference = SIMULATION_LEGAL_REFERENCES.find((item) => item.id === id);
                              return reference ? <span key={id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{reference.clause}</span> : null;
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                        <button type="button" disabled={stepIndex === 0 || working} onClick={() => setStepIndex((index) => Math.max(0, index - 1))} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> अघिल्लो</button>
                        {stepIndex < activeCase.content.steps.length - 1 ? (
                          <button type="button" disabled={working} onClick={() => setStepIndex((index) => Math.min(activeCase.content.steps.length - 1, index + 1))} className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#123f6d] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">अर्को प्रश्न <ChevronRight className="h-4 w-4" /></button>
                        ) : (
                          <button type="button" disabled={working} onClick={() => void submitAttempt()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" /> {working ? 'मूल्याङ्कन हुँदैछ...' : 'उत्तर बुझाउनुहोस्'}</button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">यो केसमा अभ्यास गर्न मिल्ने प्रश्न छैन।</p>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {cases.map((simulationCase) => {
                    const hasOpenAttempt = attempts.some((attempt) =>
                      attempt.caseKey === simulationCase.caseKey && attempt.status === 'in_progress',
                    );
                    return (
                      <article key={simulationCase.caseKey} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{simulationCase.content.category}</span>
                          <span className="text-xs text-slate-500">{simulationCase.content.estimatedMinutes} मिनेट</span>
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-slate-900">{simulationCase.content.title}</h2>
                        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-6 text-slate-600">{simulationCase.content.scenario}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-xs text-slate-500">{simulationCase.content.steps.length} चरण · {simulationCase.content.difficulty}</span>
                          <button type="button" disabled={working} onClick={() => void beginCase(simulationCase)} className="inline-flex items-center gap-2 rounded-lg bg-[#123f6d] px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-50">
                            {hasOpenAttempt ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            {hasOpenAttempt ? 'जारी राख्नुहोस्' : 'अभ्यास सुरु'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {cases.length === 0 && <p className="rounded-xl bg-white p-5 text-sm text-slate-600">हाल प्रकाशित अभ्यास केस उपलब्ध छैनन्।</p>}
                </div>
              )}
            </section>
          )}

          {section === 'progress' && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 p-5">
                <h2 className="font-bold text-slate-900">तपाईंको अभ्यास प्रगति</h2>
                <p className="mt-1 text-sm text-slate-500">प्रत्येक केसका प्रयास र प्राप्त स्कोर।</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">केस</th><th className="px-5 py-3">प्रयास</th><th className="px-5 py-3">अवस्था</th><th className="px-5 py-3">स्कोर</th><th className="px-5 py-3">मिति</th><th className="px-5 py-3">कार्य</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td className="px-5 py-3 font-semibold text-slate-800">{cases.find((item) => item.caseKey === attempt.caseKey)?.content.title ?? attempt.caseKey}</td>
                        <td className="px-5 py-3">{attempt.attemptNumber}</td>
                        <td className="px-5 py-3">{attempt.status === 'completed' ? 'सम्पन्न' : 'जारी'}</td>
                        <td className="px-5 py-3 font-bold">{scoreLabel(attempt)}</td>
                        <td className="px-5 py-3 text-slate-500">{formatDate(attempt.updatedAt)}</td>
                        <td className="px-5 py-3">{attempt.status === 'in_progress' && <button type="button" onClick={() => void resumeAttempt(attempt)} className="font-semibold text-[#123f6d]">फेरि खोल्नुहोस्</button>}</td>
                      </tr>
                    ))}
                    {attempts.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">अहिलेसम्म कुनै अभ्यास सुरु भएको छैन।</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {section === 'reports' && (
            <section className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryCard label="सम्पन्न अभ्यास" value={completedAttempts.length} />
                <SummaryCard label="उत्तीर्ण" value={completedAttempts.filter((item) => item.result?.passed).length} />
                <SummaryCard label="औसत प्राप्ताङ्क" value={`${averageScore}/100`} />
              </div>
              {completedAttempts.map((attempt) => (
                <article key={attempt.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">{cases.find((item) => item.caseKey === attempt.caseKey)?.content.title ?? attempt.caseKey}</h2>
                      <p className="mt-1 text-xs text-slate-500">प्रयास {attempt.attemptNumber} · {formatDate(attempt.result!.completedAt)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-sm font-bold ${attempt.result!.passed ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                      {attempt.result!.score}/100 · {classifySimulationScore(attempt.result!.score)}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {attempt.result!.breakdown.map((row) => (
                      <div key={row.stepId} className="rounded-xl bg-slate-50 p-3 text-sm">
                        <div className="flex justify-between gap-3 font-semibold text-slate-800"><span>{row.stepId}</span><span>{row.pointsEarned}/{row.pointsAvailable}</span></div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{row.explanation}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
              {completedAttempts.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">अभ्यास सम्पन्न गरेपछि प्रतिवेदन यहाँ देखिन्छ।</p>}
            </section>
          )}

          {section === 'certificates' && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                स्थानीय मोडमा बनेका प्रमाणपत्र नमुना हुन्। Supabase प्रमाणपत्र मात्र सार्वजनिक प्रमाणीकरण सेवाबाट जाँच्न सकिन्छ।
              </div>
              {certificates.map((certificate) => (
                <article key={certificate.code} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Award className="mt-1 h-6 w-6 shrink-0 text-amber-600" />
                    <div>
                      <h2 className="font-bold text-slate-900">{certificate.displayName}</h2>
                      <p className="mt-1 text-sm text-slate-600">{certificate.caseTitle} · {certificate.score}/100</p>
                      <p className="mt-1 break-all text-xs text-slate-500">कोड: {certificate.code} · {formatDate(certificate.issuedAt)}</p>
                      {certificate.isSample && <p className="mt-1 text-xs font-semibold text-amber-700">स्थानीय नमुना — आधिकारिक प्रमाणपत्र होइन</p>}
                      {!certificate.isSample && <a href={`#simulation-verify:${certificate.code}`} className="mt-2 inline-block text-xs font-semibold text-[#123f6d] underline">कोड प्रमाणीकरण गर्नुहोस्</a>}
                    </div>
                  </div>
                  <button type="button" onClick={() => window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">प्रिन्ट गर्नुहोस्</button>
                </article>
              ))}
              {certificates.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">उत्तीर्ण अभ्यासपछि प्रमाणपत्रका लागि अनुरोध गर्न सक्नुहुन्छ।</p>}
            </section>
          )}

          {section === 'legal' && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
                यी अभ्यास सन्दर्भहरू पढाइ र अभ्यासका लागि मात्र हुन्। स्थानीय पाठ, संशोधन सूची र आधिकारिक ऐन/नियमावलीसँग दफा/नियमको हाल लागू अवस्था पुष्टि नगरी कानुनी निष्कर्ष ननिकाल्नुहोस्।
              </div>
              {SIMULATION_LEGAL_REFERENCES.map((reference) => (
                <LegalReferenceCard key={reference.id} reference={reference} onNavigate={onNavigate} />
              ))}
            </section>
          )}

          {section === 'case-management' && isAdmin && (
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div><h2 className="font-bold text-slate-900">केस संस्करणहरू</h2><p className="mt-1 text-xs text-slate-500">प्रकाशनले नयाँ immutable version बनाउँछ।</p></div>
                  <button type="button" onClick={newCase} className="rounded-lg bg-[#123f6d] px-3 py-2 text-xs font-bold text-white">नयाँ केस</button>
                </div>
                <div className="mt-4 max-h-[34rem] space-y-2 overflow-y-auto">
                  {adminVersions.map((item) => (
                    <button
                      key={`${item.caseKey}:${item.version}`}
                      type="button"
                      onClick={() => setSelectedVersion(`${item.caseKey}:${item.version}`)}
                      className={`w-full rounded-xl border p-3 text-left ${selectedVersion === `${item.caseKey}:${item.version}` ? 'border-[#176b70] bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <span className="block text-sm font-semibold text-slate-800">{item.content.title}</span>
                      <span className="mt-1 block text-xs text-slate-500">{item.caseKey} · v{item.version} · {item.status === 'published' ? 'प्रकाशित' : 'मस्यौदा'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <label htmlFor="simulation-case-json" className="block font-bold text-slate-900">केस JSON सम्पादक</label>
                <p className="mt-1 text-xs leading-5 text-slate-500">सामग्री र answerKey सहितको JSON सम्पादन गर्नुहोस्। प्रकाशित गर्न rubric जम्मा १०० हुनुपर्छ।</p>
                <textarea
                  id="simulation-case-json"
                  value={caseEditor}
                  onChange={(event) => setCaseEditor(event.target.value)}
                  spellCheck={false}
                  className="mt-4 min-h-[32rem] w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <button type="button" disabled={working} onClick={() => void saveCase('draft')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><Save className="h-4 w-4" /> मस्यौदा सुरक्षित</button>
                  <button type="button" disabled={working} onClick={() => void saveCase('published')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><ShieldCheck className="h-4 w-4" /> प्रकाशित गर्नुहोस्</button>
                </div>
              </div>
            </section>
          )}
          {section === 'case-management' && !isAdmin && <p role="alert" className="rounded-xl bg-red-50 p-5 text-sm text-red-800">केस व्यवस्थापनका लागि प्रशासक अनुमति आवश्यक छ।</p>}
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const ResultPanel = ({
  simulationCase,
  attempt,
  displayName,
  onDisplayNameChange,
  onIssueCertificate,
  working,
  onReturn,
}: {
  simulationCase: SimulationCaseVersion;
  attempt: SimulationAttempt;
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  onIssueCertificate: () => void;
  working: boolean;
  onReturn: () => void;
}) => {
  const result = attempt.result!;
  return (
    <div className="space-y-5">
      <div className={`rounded-2xl p-5 ${result.passed ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{simulationCase.content.title}</p>
            <h2 className="mt-1 text-2xl font-bold">{result.score}/100 · {classifySimulationScore(result.score)}</h2>
          </div>
          {result.passed && <CheckCircle2 className="h-8 w-8" />}
        </div>
        <p className="mt-2 text-sm">{result.passed ? 'तपाईं उत्तीर्ण हुनुभयो।' : 'उत्तीर्ण हुन थप अभ्यास गर्नुहोस्। आवश्यक अंक: ७०।'}</p>
      </div>
      <div className="space-y-3">
        {result.breakdown.map((row) => {
          const step = simulationCase.content.steps.find((item) => item.id === row.stepId);
          return (
            <article key={row.stepId} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{step?.title ?? row.stepId}</h3>
                <span className="text-sm font-bold text-slate-700">{row.pointsEarned}/{row.pointsAvailable}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{row.explanation}</p>
              <p className="mt-2 text-xs text-slate-500">सही जवाफ: {row.correctAnswer}</p>
            </article>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <button type="button" onClick={onReturn} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">प्रगति हेर्नुहोस्</button>
        {result.passed && (
          <div className="flex flex-col gap-2 sm:items-end">
            <label className="text-xs font-semibold text-slate-600">प्रमाणपत्रमा देखाउने नाम
              <input value={displayName} onChange={(event) => onDisplayNameChange(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-72" />
            </label>
            <button type="button" disabled={working} onClick={onIssueCertificate} className="rounded-lg bg-[#123f6d] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">प्रमाणपत्र तयार गर्नुहोस्</button>
          </div>
        )}
      </div>
    </div>
  );
};

const LegalReferenceCard = ({
  reference,
  onNavigate,
}: {
  reference: SimulationLegalReference;
  onNavigate: (tab: string) => void;
}) => {
  const internalTab = reference.appTab ?? (
    reference.lawName.includes('सार्वजनिक खरिद ऐन')
      || reference.lawName.includes('सार्वजनिक खरिद नियमावली')
      ? 'law-corpus'
      : undefined
  );
  const internalLabel = internalTab === 'law-corpus'
    ? 'एपको स्थानीय ऐन/नियम पाठ खोल्नुहोस्'
    : 'एपको स्थानीय राय/नजिर संग्रह खोल्नुहोस्';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#176b70]">{reference.lawName}</p>
          <h2 className="mt-1 font-bold text-slate-900">{reference.clause}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={reference.officialUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#123f6d] underline">आधिकारिक स्रोत खोल्नुहोस्</a>
          {internalTab && (
            <button type="button" onClick={() => onNavigate(internalTab)} className="text-sm font-semibold text-[#176b70] underline">
              {internalLabel}
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{reference.summary}</p>
      <p className="mt-2 text-xs text-slate-500">{reference.sourceVersion}</p>
      <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">{reference.verificationNote}</p>
    </article>
  );
};
