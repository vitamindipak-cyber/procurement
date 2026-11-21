import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Eye,
  FileJson2,
  FileText,
  Filter,
  GraduationCap,
  ListChecks,
  Play,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import { AppUser } from '../types/auth';
import {
  SimulationAttempt,
  SimulationCaseDraft,
  SimulationCaseVersion,
  SimulationCertificate,
  SimulationLegalReference,
  SimulationMockDocument,
  SimulationSection,
  SimulationTargetAudience,
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
import { formatSourceVersion } from '../utils/simulationLegalHelper';
import {
  PRACTICAL_SIMULATION_CASES,
  SIMULATION_LEGAL_REFERENCES,
  SIMULATION_SECTION_TO_TAB,
} from '../data/practicalSimulationCases';
import { SimulationDocViewerModal } from './simulation/SimulationDocViewerModal';
import { SimulationLegalDrawer } from './simulation/SimulationLegalDrawer';
import { SimulationCalculatorModal } from './simulation/SimulationCalculatorModal';
import { SimulationOfficeMinuteModal } from './simulation/SimulationOfficeMinuteModal';

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
  const [visibleHintStepId, setVisibleHintStepId] = useState<string | null>(null);
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

  // Modals & Tools
  const [activeMockDoc, setActiveMockDoc] = useState<SimulationMockDocument | null>(null);
  const [activeLegalRef, setActiveLegalRef] = useState<SimulationLegalReference | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isOfficeMinuteOpen, setIsOfficeMinuteOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('सबै');
  const [audienceFilter, setAudienceFilter] = useState<'सबै' | 'सार्वजनिक निकाय' | 'बोलपत्रदाता'>('सबै');
  const [difficultyFilter, setDifficultyFilter] = useState('सबै');
  const [statusFilter, setStatusFilter] = useState<'सबै' | 'नयाँ' | 'जारी' | 'सम्पन्न'>('सबै');

  // Timed Exam & Progress sub-views
  const [examTimeRemaining, setExamTimeRemaining] = useState<number | null>(null);
  const [progressSubTab, setProgressSubTab] = useState<'overview' | 'weak-spots'>('overview');

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

  const printCertificate = (certificate: SimulationCertificate) => {
    const issuedDate = new Date(certificate.issuedAt).toLocaleDateString('ne-NP', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const sampleNote = certificate.isSample
      ? '<p style="color:#b45309;font-size:11px;margin-top:8px;">स्थानीय नमुना — आधिकारिक प्रमाणपत्र होइन</p>'
      : '';
    const html = `<!DOCTYPE html><html lang="ne"><head>
<meta charset="UTF-8"/>
<title>प्रमाणपत्र — ${certificate.displayName}</title>
<link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Mukta',sans-serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .cert{width:210mm;min-height:148mm;padding:40px 56px;border:12px solid #123f6d;position:relative;text-align:center;}
  .cert::before{content:'';position:absolute;inset:6px;border:2px solid #d4af37;pointer-events:none;}
  .org{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:16px;}
  .title{font-size:28px;font-weight:800;color:#123f6d;margin-bottom:8px;}
  .subtitle{font-size:13px;color:#555;margin-bottom:28px;}
  .presented{font-size:13px;color:#333;margin-bottom:6px;}
  .name{font-size:32px;font-weight:700;color:#0f172a;border-bottom:2px solid #d4af37;display:inline-block;padding:0 24px 4px;margin-bottom:28px;}
  .case{font-size:15px;color:#1e3a5f;margin-bottom:6px;}
  .score{font-size:22px;font-weight:700;color:#176b70;margin-bottom:28px;}
  .meta{font-size:11px;color:#888;margin-bottom:4px;}
  .code{font-size:10px;color:#aaa;margin-top:16px;font-family:monospace;}
  @media print{body{display:block;}@page{size:A4 landscape;margin:0;}}
</style>
</head><body>
<div class="cert">
  <p class="org">सार्वजनिक खरिद व्यावहारिक अभ्यासशाला</p>
  <h1 class="title">सहभागिता प्रमाणपत्र</h1>
  <p class="subtitle">Certificate of Completion</p>
  <p class="presented">यो प्रमाणपत्र प्रदान गरिन्छ</p>
  <p class="name">${certificate.displayName}</p>
  <p class="case">अभ्यास केस: ${certificate.caseTitle}</p>
  <p class="score">प्राप्त अंक: ${certificate.score}/100</p>
  <p class="meta">जारी मिति: ${issuedDate}</p>
  ${sampleNote}
  <p class="code">कोड: ${certificate.code}</p>
</div>
</body></html>`;
    const win = window.open('', '_blank', 'width=900,height=650');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  };

  const beginCase = async (simulationCase: SimulationCaseVersion, mode: 'practice' | 'exam' = 'practice') => {
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
        if (existing.mode === 'exam') {
          setExamTimeRemaining((existingCase.content.estimatedMinutes || 10) * 60);
        } else {
          setExamTimeRemaining(null);
        }
      } else {
        const attempt = await startSimulationAttempt(currentUser.id, simulationCase, mode);
        setActiveCase(simulationCase);
        setActiveAttempt(attempt);
        setNumericDrafts({});
        setAttempts((previous) => [attempt, ...previous]);
        if (mode === 'exam') {
          setExamTimeRemaining((simulationCase.content.estimatedMinutes || 10) * 60);
        } else {
          setExamTimeRemaining(null);
        }
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
      if (attempt.mode === 'exam') {
        setExamTimeRemaining((simulationCase.content.estimatedMinutes || 10) * 60);
      } else {
        setExamTimeRemaining(null);
      }
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

  const retryCase = async (simulationCase: SimulationCaseVersion, mode: 'practice' | 'exam' = 'practice') => {
    // Clear active state so beginCase starts a fresh attempt (not resume)
    setActiveAttempt(null);
    setActiveCase(null);
    setWorking(true);
    setError('');
    try {
      const attempt = await startSimulationAttempt(currentUser.id, simulationCase, mode);
      setActiveCase(simulationCase);
      setActiveAttempt(attempt);
      setNumericDrafts({});
      setAttempts((previous) => [attempt, ...previous]);
      setStepIndex(0);
      if (mode === 'exam') {
        setExamTimeRemaining((simulationCase.content.estimatedMinutes || 10) * 60);
      } else {
        setExamTimeRemaining(null);
      }
      navigate('cases');
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : 'नयाँ प्रयास सुरु गर्न सकिएन।');
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
      setExamTimeRemaining(null);
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
        difficulty: 'सरल',
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

  useEffect(() => {
    if (!activeAttempt || activeAttempt.status !== 'in_progress' || activeAttempt.mode !== 'exam') {
      return;
    }
    if (examTimeRemaining === null) return;
    if (examTimeRemaining <= 0) {
      void submitAttempt();
      return;
    }

    const timer = setInterval(() => {
      setExamTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAttempt?.id, activeAttempt?.status, activeAttempt?.mode, examTimeRemaining]);

  const formatTimeMinutes = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return str.replace(/\d/g, (d) => nepaliDigits[Number(d)]);
  };

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.content.title.toLowerCase().includes(query);
        const matchesScenario = c.content.scenario.toLowerCase().includes(query);
        const matchesCategory = c.content.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesScenario && !matchesCategory) return false;
      }
      if (audienceFilter !== 'सबै') {
        if (c.content.targetAudience && c.content.targetAudience !== 'दुवै' && c.content.targetAudience !== audienceFilter) {
          return false;
        }
      }
      if (categoryFilter !== 'सबै') {
        if (!c.content.category.includes(categoryFilter) && categoryFilter !== c.content.category) {
          return false;
        }
      }
      if (difficultyFilter !== 'सबै') {
        if (c.content.difficulty !== difficultyFilter) return false;
      }
      if (statusFilter !== 'सबै') {
        const caseAttempts = attempts.filter((a) => a.caseKey === c.caseKey);
        const hasOpen = caseAttempts.some((a) => a.status === 'in_progress');
        const hasCompleted = caseAttempts.some((a) => a.result);
        if (statusFilter === 'नयाँ' && (hasOpen || hasCompleted)) return false;
        if (statusFilter === 'जारी' && !hasOpen) return false;
        if (statusFilter === 'सम्पन्न' && !hasCompleted) return false;
      }
      return true;
    });
  }, [cases, searchQuery, audienceFilter, categoryFilter, difficultyFilter, statusFilter, attempts]);

  const weakSpots = useMemo(() => {
    const list: Array<{
      attemptId: string;
      caseKey: string;
      caseTitle: string;
      simulationCase: SimulationCaseVersion;
      stepId: string;
      stepTitle: string;
      userAnswer: string;
      correctAnswer: string;
      explanation: string;
      pointsLost: number;
      date: string;
    }> = [];

    for (const attempt of attempts) {
      if (!attempt.result) continue;
      const simCase = cases.find((c) => c.caseKey === attempt.caseKey);
      if (!simCase) continue;

      for (const row of attempt.result.breakdown) {
        if (!row.isCorrect) {
          const step = simCase.content.steps.find((s) => s.id === row.stepId);
          const rawAnswer = attempt.answers[row.stepId];
          let userLabel = String(rawAnswer ?? 'अनुत्तरित');
          if (step?.options) {
            const opt = step.options.find((o) => o.id === rawAnswer);
            if (opt) userLabel = opt.label;
          }

          list.push({
            attemptId: attempt.id,
            caseKey: attempt.caseKey,
            caseTitle: simCase.content.title,
            simulationCase: simCase,
            stepId: row.stepId,
            stepTitle: step?.title ?? row.stepId,
            userAnswer: userLabel,
            correctAnswer: row.correctAnswer,
            explanation: row.explanation,
            pointsLost: row.pointsAvailable - row.pointsEarned,
            date: attempt.result.completedAt,
          });
        }
      }
    }
    return list;
  }, [attempts, cases]);

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
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors shadow-sm"
            >
              <Calculator className="h-4 w-4 text-emerald-300" />
              खरिद क्याल्कुलेटर
            </button>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
              <p className="text-blue-100">अभ्यासकर्ता</p>
              <p className="mt-0.5 font-bold">{currentUser.username}</p>
            </div>
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
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${isActive
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
                      onRetry={() => void retryCase(activeCase, activeAttempt.mode || 'practice')}
                      working={working}
                      onReturn={() => {
                        setActiveAttempt(null);
                        setActiveCase(null);
                        setExamTimeRemaining(null);
                        navigate('progress');
                      }}
                      onOpenOfficeMinute={() => setIsOfficeMinuteOpen(true)}
                      onOpenLegalRef={(ref) => setActiveLegalRef(ref)}
                    />
                  ) : currentStep ? (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveAttempt(null);
                              setActiveCase(null);
                              setExamTimeRemaining(null);
                            }}
                            className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900"
                          >
                            <ChevronLeft className="h-4 w-4" /> केस सूची
                          </button>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wide text-[#176b70]">
                              {activeCase.content.category} · प्रयास {activeAttempt.attemptNumber}
                            </span>
                            {activeAttempt.mode === 'exam' ? (
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${(examTimeRemaining ?? 0) <= 60
                                ? 'bg-red-100 text-red-800 animate-pulse border border-red-300'
                                : (examTimeRemaining ?? 0) <= 180
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-blue-100 text-blue-800 border border-blue-300'
                                }`}>
                                <Timer className="h-3.5 w-3.5" />
                                परीक्षा मोड · बाँकी: {formatTimeMinutes(examTimeRemaining ?? 0)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                <i className="fas fa-bullseye text-emerald-700 text-xs"></i>
                                सिकाइ मोड
                              </span>
                            )}
                          </div>
                          <h2 className="mt-1 text-xl font-bold text-slate-900">{activeCase.content.title}</h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsCalculatorOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                          >
                            <Calculator className="h-3.5 w-3.5 text-emerald-600" />
                            खरिद क्याल्कुलेटर
                          </button>
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            प्रश्न {stepIndex + 1} / {activeCase.content.steps.length}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={activeCase.content.steps.length}>
                        <div className="h-full rounded-full bg-[#176b70] transition-all" style={{ width: `${((stepIndex + 1) / activeCase.content.steps.length) * 100}%` }} />
                      </div>
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-blue-950">परिदृश्य</h3>
                          {activeCase.content.targetAudience && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-200/60 px-2.5 py-0.5 text-xs font-bold text-blue-900">
                              {activeCase.content.targetAudience === 'सार्वजनिक निकाय' ? (
                                <>
                                  <i className="fas fa-landmark text-xs"></i>
                                  सार्वजनिक निकाय
                                </>
                              ) : activeCase.content.targetAudience === 'बोलपत्रदाता' ? (
                                <>
                                  <i className="fas fa-briefcase text-xs"></i>
                                  बोलपत्रदाता
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-users text-xs"></i>
                                  दुवै पक्ष
                                </>
                              )}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-blue-900">{activeCase.content.scenario}</p>
                        {activeCase.content.mockDocuments && activeCase.content.mockDocuments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-blue-200/60 flex flex-wrap gap-2">
                            {activeCase.content.mockDocuments.map((doc) => (
                              <button
                                key={doc.id}
                                type="button"
                                onClick={() => setActiveMockDoc(doc)}
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-white px-3.5 py-2 text-xs font-bold text-[#123f6d] hover:bg-blue-50 transition-colors shadow-sm"
                              >
                                <FileText className="h-4 w-4 text-[#123f6d]" />
                                सम्बन्धित काल्पनिक कागजात परीक्षण गर्नुहोस्: {doc.title}
                                <Eye className="h-3.5 w-3.5 opacity-70 ml-1" />
                              </button>
                            ))}
                          </div>
                        )}
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
                                  className={`w-full rounded-xl border p-4 text-left text-sm leading-6 transition-colors disabled:opacity-60 ${selected ? 'border-[#176b70] bg-emerald-50 text-emerald-950 ring-1 ring-[#176b70]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
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
                          <div className="mt-4 space-y-2">
                            {activeAttempt.mode === 'exam' ? (
                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 flex items-center gap-2">
                                <Timer className="h-4 w-4 text-slate-400" />
                                <span>परीक्षा मोडमा कानुनी संकेतहरू परीक्षा अवधिभर लुकाइएका छन्। परीक्षा पूरा भएपछि पूर्ण व्याख्या देखिनेछ।</span>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setVisibleHintStepId(
                                    visibleHintStepId === currentStep.id ? null : currentStep.id,
                                  )}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                                >
                                  <CircleHelp className="h-3.5 w-3.5" />
                                  {visibleHintStepId === currentStep.id ? 'संकेत लुकाउनुहोस्' : 'संकेत हेर्नुहोस्'}
                                </button>
                                {visibleHintStepId === currentStep.id && (
                                  <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-xs font-bold text-amber-900">सम्बन्धित कानुनी सन्दर्भ</p>
                                    {currentStep.legalReferenceIds.map((refId) => {
                                      const ref = SIMULATION_LEGAL_REFERENCES.find((r) => r.id === refId);
                                      return ref ? (
                                        <div key={refId} className="rounded-lg bg-white/80 p-3 shadow-sm border border-amber-100">
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-xs font-bold text-[#176b70]">{ref.clause}</p>
                                            <button
                                              type="button"
                                              onClick={() => setActiveLegalRef(ref)}
                                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#123f6d] hover:underline"
                                            >
                                              <BookOpen className="h-3 w-3" />
                                              पूर्ण कानुनी पाठ पढ्नुहोस्
                                            </button>
                                          </div>
                                          <p className="mt-1 text-xs leading-5 text-amber-900">{ref.summary}</p>
                                        </div>
                                      ) : null;
                                    })}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                        <button type="button" disabled={stepIndex === 0 || working} onClick={() => { setStepIndex((index) => Math.max(0, index - 1)); setVisibleHintStepId(null); }} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> अघिल्लो</button>
                        {stepIndex < activeCase.content.steps.length - 1 ? (
                          <button type="button" disabled={working} onClick={() => { setStepIndex((index) => Math.min(activeCase.content.steps.length - 1, index + 1)); setVisibleHintStepId(null); }} className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#123f6d] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">अर्को प्रश्न <ChevronRight className="h-4 w-4" /></button>
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
                <div className="space-y-5">
                  {/* Search and Filters toolbar */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="केसको शीर्षक, परिदृश्य वा मुख्य शब्द खोज्नुहोस्..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 pl-10 pr-9 py-2.5 text-sm outline-none focus:border-[#123f6d] focus:ring-2 focus:ring-blue-100"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Target Audience role tabs */}
                      <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
                        {(['सबै', 'सार्वजनिक निकाय', 'बोलपत्रदाता'] as const).map((aud) => (
                          <button
                            key={aud}
                            type="button"
                            onClick={() => setAudienceFilter(aud)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${audienceFilter === aud
                              ? 'bg-white text-[#123f6d] shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            {aud === 'सबै' ? (
                              'सबै सरोकारवाला'
                            ) : aud === 'सार्वजनिक निकाय' ? (
                              <span className="inline-flex items-center gap-1.5">
                                <i className="fas fa-landmark text-xs"></i>
                                सार्वजनिक निकाय
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5">
                                <i className="fas fa-briefcase text-xs"></i>
                                बोलपत्रदाता
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category, Difficulty & Status filters */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-500">श्रेणी:</span>
                        {['सबै', 'योजना तथा तयारी', 'खरिद विधि', 'लागत अनुमान', 'मूल्याङ्कन', 'सम्झौता व्यवस्थापन'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoryFilter(cat)}
                            className={`rounded-full px-2.5 py-1 transition-colors ${categoryFilter === cat
                              ? 'bg-[#123f6d] text-white font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-500">कठिनाइ:</span>
                          {['सबै', 'सरल', 'मध्यम', 'उन्नत'].map((diff) => (
                            <button
                              key={diff}
                              type="button"
                              onClick={() => setDifficultyFilter(diff)}
                              className={`rounded-full px-2.5 py-1 transition-colors ${difficultyFilter === diff
                                ? 'bg-[#176b70] text-white font-bold'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-500">अवस्था:</span>
                          {(['सबै', 'नयाँ', 'जारी', 'सम्पन्न'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setStatusFilter(st)}
                              className={`rounded-full px-2.5 py-1 transition-colors ${statusFilter === st
                                ? 'bg-slate-800 text-white font-bold'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active count & Reset */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>
                        कुल {cases.length} मध्ये <strong>{filteredCases.length}</strong> अभ्यास केसहरू उपलब्ध छन्
                      </span>
                      {(searchQuery || categoryFilter !== 'सबै' || audienceFilter !== 'सबै' || difficultyFilter !== 'सबै' || statusFilter !== 'सबै') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('सबै');
                            setAudienceFilter('सबै');
                            setDifficultyFilter('सबै');
                            setStatusFilter('सबै');
                          }}
                          className="text-[#123f6d] font-bold underline"
                        >
                          सबै फिल्टर हटाउनुहोस्
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cases Grid */}
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredCases.map((simulationCase) => {
                      const hasOpenAttempt = attempts.some((attempt) =>
                        attempt.caseKey === simulationCase.caseKey && attempt.status === 'in_progress',
                      );
                      const hasMockDocs = simulationCase.content.mockDocuments && simulationCase.content.mockDocuments.length > 0;
                      return (
                        <article key={simulationCase.caseKey} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                          {/* Top badges row */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                              {simulationCase.content.category}
                            </span>
                            <div className="flex items-center gap-2">
                              {simulationCase.content.targetAudience && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                  {simulationCase.content.targetAudience === 'सार्वजनिक निकाय' ? (
                                    <>
                                      <i className="fas fa-landmark text-blue-700 text-[10px]"></i>
                                      <span>निकाय</span>
                                    </>
                                  ) : simulationCase.content.targetAudience === 'बोलपत्रदाता' ? (
                                    <>
                                      <i className="fas fa-briefcase text-amber-700 text-[10px]"></i>
                                      <span>व्यवसायी</span>
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-users text-slate-600 text-[10px]"></i>
                                      <span>दुवै</span>
                                    </>
                                  )}
                                </span>
                              )}
                              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${difficultyBadge(simulationCase.content.difficulty)}`}>
                                {simulationCase.content.difficulty}
                              </span>
                              <span className="text-xs text-slate-400">{simulationCase.content.estimatedMinutes} मि.</span>
                            </div>
                          </div>

                          {/* Title + scenario */}
                          <h2 className="mt-3 text-lg font-bold text-slate-900">{simulationCase.content.title}</h2>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{simulationCase.content.scenario}</p>

                          {/* Mock Document indicator */}
                          {hasMockDocs && (
                            <div className="mt-3">
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                                <FileText className="h-3 w-3 text-amber-700" />
                                नमुना कागजात परीक्षण समावेश
                              </span>
                            </div>
                          )}

                          {/* Prior knowledge pills */}
                          {simulationCase.content.priorKnowledge.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                                <i className="fas fa-lightbulb text-amber-500 text-[11px]"></i>
                                पूर्व-ज्ञान आवश्यक
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {simulationCase.content.priorKnowledge.map((item) => (
                                  <span key={item} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{item}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Objectives */}
                          {simulationCase.content.objectives.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                                <i className="fas fa-bullseye text-[#176b70] text-[11px]"></i>
                                सिकाइ उद्देश्य
                              </p>
                              <ul className="space-y-1">
                                {simulationCase.content.objectives.slice(0, 2).map((obj) => (
                                  <li key={obj} className="flex items-start gap-1.5 text-xs text-slate-600">
                                    <i className="fas fa-check-circle mt-0.5 text-[11px] shrink-0 text-emerald-500"></i>
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Previous best score (if any completed attempt) */}
                          {(() => {
                            const best = attempts
                              .filter((a) => a.caseKey === simulationCase.caseKey && a.result)
                              .sort((a, b) => (b.result?.score ?? 0) - (a.result?.score ?? 0))[0];
                            return best ? (
                              <p className="mt-3 text-xs font-semibold text-[#176b70]">
                                सर्वोच्च स्कोर: {best.result!.score}/100
                              </p>
                            ) : null;
                          })()}

                          {/* Footer with dual mode launcher */}
                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-500">{simulationCase.content.steps.length} प्रश्न</span>
                            {hasOpenAttempt ? (
                              <button
                                type="button"
                                disabled={working}
                                onClick={() => void beginCase(simulationCase)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#123f6d] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#174f7e] disabled:opacity-50"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                जारी राख्नुहोस्
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={working}
                                  onClick={() => void beginCase(simulationCase, 'practice')}
                                  title="असीमित समय, चरणबद्ध संकेतसहित सिकाइ मोड"
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                                >
                                  <i className="fas fa-bullseye text-[11px]"></i>
                                  सिकाइ
                                </button>
                                <button
                                  type="button"
                                  disabled={working}
                                  onClick={() => void beginCase(simulationCase, 'exam')}
                                  title="समय सीमासहित परीक्षा मोड"
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#123f6d] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#174f7e] disabled:opacity-50"
                                >
                                  <i className="fas fa-stopwatch text-[11px]"></i>
                                  परीक्षा
                                </button>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  {filteredCases.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                      <p className="text-sm font-semibold text-slate-700">कुनै केस फेला परेन।</p>
                      <p className="text-xs text-slate-500">कृपया खोज शब्द वा फिल्टर परिवर्तन गर्नुहोस्।</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {section === 'progress' && (
            <section className="space-y-5">
              {/* Progress sub-tabs */}
              <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 pt-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => setProgressSubTab('overview')}
                  className={`border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${progressSubTab === 'overview'
                    ? 'border-[#123f6d] text-[#123f6d]'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                  समग्र प्रगति र स्कोर
                </button>
                <button
                  type="button"
                  onClick={() => setProgressSubTab('weak-spots')}
                  className={`border-b-2 px-4 py-2.5 text-sm font-bold transition-colors flex items-center gap-2 ${progressSubTab === 'weak-spots'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <span>कमजोरी सुधार बैंक</span>
                  {weakSpots.length > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                      {weakSpots.length}
                    </span>
                  )}
                </button>
              </div>

              {progressSubTab === 'weak-spots' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
                    <strong>कमजोरी सुधार बैंक (Mistake Review):</strong> यहाँ तपाईंले अघिल्ला अभ्यासहरूमा बिगार्नुभएका प्रश्नहरू संकलित छन्। ती प्रश्नहरूको सही कानुनी आधार अध्ययन गरी पुनः अभ्यास गर्न सक्नुहुन्छ।
                  </div>

                  {weakSpots.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                      <p className="text-sm font-bold text-slate-800">उत्कृष्ट! कुनै कमजोरी फेला परेन।</p>
                      <p className="text-xs text-slate-500">तपाईंले हल गर्नुभएका सबै प्रश्नहरू सही छन् वा अझै अभ्यास सम्पन्न भएको छैन।</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {weakSpots.map((spot, idx) => (
                        <article key={`${spot.attemptId}-${spot.stepId}-${idx}`} className="flex flex-col rounded-2xl border border-red-200 bg-white p-5 shadow-sm space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-bold text-slate-800">{spot.caseTitle}</span>
                            <span>गुमेको अङ्क: <strong className="text-red-700">-{spot.pointsLost}</strong></span>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{spot.stepTitle}</h3>
                            <div className="mt-2 space-y-1.5 text-xs">
                              <div className="rounded-lg bg-red-50 p-2 text-red-900">
                                <strong>तपाईंको जवाफ:</strong> {spot.userAnswer}
                              </div>
                              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-900">
                                <strong>सही कानुनी जवाफ:</strong> {spot.correctAnswer}
                              </div>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <strong>व्याख्या:</strong> {spot.explanation}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => void beginCase(spot.simulationCase, 'practice')}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#123f6d] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#174f7e]"
                            >
                              <RotateCcw className="h-3 w-3" />
                              यो केस पुनः अभ्यास गर्नुहोस्
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Per-case score summary cards */}
                  {cases.length > 0 && (() => {
                    const caseAttemptMap: Record<string, SimulationAttempt[]> = {};
                    for (const attempt of attempts) {
                      if (!caseAttemptMap[attempt.caseKey]) caseAttemptMap[attempt.caseKey] = [];
                      caseAttemptMap[attempt.caseKey].push(attempt);
                    }
                    const activeCaseKeys = Object.keys(caseAttemptMap);
                    if (activeCaseKeys.length === 0) return null;
                    return (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {activeCaseKeys.map((caseKey) => {
                          const caseAttempts = caseAttemptMap[caseKey].sort(
                            (a, b) => a.attemptNumber - b.attemptNumber,
                          );
                          const completed = caseAttempts.filter((a) => a.result);
                          const best = completed.reduce<SimulationAttempt | null>(
                            (top, a) => (!top || (a.result?.score ?? 0) > (top.result?.score ?? 0)) ? a : top,
                            null,
                          );
                          const simulationCase = cases.find((c) => c.caseKey === caseKey);
                          return (
                            <div key={caseKey} className="rounded-2xl border border-slate-200 bg-white p-4">
                              <p className="font-bold text-slate-900 text-sm">{simulationCase?.content.title ?? caseKey}</p>
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span>कुल प्रयास: <strong className="text-slate-800">{caseAttempts.length}</strong></span>
                                <span>सम्पन्न: <strong className="text-slate-800">{completed.length}</strong></span>
                                {best && (
                                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                                    सर्वोच्च: {best.result!.score}/100
                                  </span>
                                )}
                              </div>
                              {/* Score trend mini-bar chart */}
                              {completed.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs text-slate-400 mb-1.5">स्कोर प्रगति</p>
                                  <div className="flex items-end gap-1 h-10">
                                    {completed.map((a) => (
                                      <div key={a.id} className="flex flex-col items-center gap-0.5 flex-1">
                                        <span className="text-[9px] text-slate-500">{a.result!.score}</span>
                                        <div
                                          className={`w-full rounded-t ${a.result!.passed ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                          style={{ height: `${Math.max(4, (a.result!.score / 100) * 28)}px` }}
                                          title={`प्रयास ${a.attemptNumber}: ${a.result!.score}/100`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Full attempts table */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 p-5">
                      <h2 className="font-bold text-slate-900">तपाईंको अभ्यास प्रगति</h2>
                      <p className="mt-1 text-sm text-slate-500">प्रत्येक केसका प्रयास र प्राप्त स्कोर।</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                          <tr>
                            <th className="px-5 py-3">केस</th>
                            <th className="px-5 py-3">प्रयास</th>
                            <th className="px-5 py-3">मोड</th>
                            <th className="px-5 py-3">अवस्था</th>
                            <th className="px-5 py-3">स्कोर</th>
                            <th className="px-5 py-3">मिति</th>
                            <th className="px-5 py-3">कार्य</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {attempts.map((attempt) => {
                            const answeredCount = Object.keys(attempt.answers).length;
                            const totalSteps = cases.find((c) => c.caseKey === attempt.caseKey)?.content.steps.length ?? 0;
                            return (
                              <tr key={attempt.id} className="hover:bg-slate-50">
                                <td className="px-5 py-3 font-semibold text-slate-800">
                                  {cases.find((item) => item.caseKey === attempt.caseKey)?.content.title ?? attempt.caseKey}
                                </td>
                                <td className="px-5 py-3 text-slate-600">{attempt.attemptNumber}</td>
                                <td className="px-5 py-3">
                                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${attempt.mode === 'exam' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}`}>
                                    {attempt.mode === 'exam' ? 'परीक्षा' : 'सिकाइ'}
                                  </span>
                                </td>
                                <td className="px-5 py-3">
                                  {attempt.status === 'completed' ? (
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">सम्पन्न</span>
                                  ) : (
                                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                                      जारी {totalSteps > 0 ? `(${answeredCount}/${totalSteps})` : ''}
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-3">
                                  {attempt.result ? (
                                    <span className={`font-bold ${attempt.result.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                                      {attempt.result.score}/100
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">—</span>
                                  )}
                                </td>
                                <td className="px-5 py-3 text-slate-500">{formatDate(attempt.updatedAt)}</td>
                                <td className="px-5 py-3">
                                  {attempt.status === 'in_progress' && (
                                    <button
                                      type="button"
                                      onClick={() => void resumeAttempt(attempt)}
                                      className="font-semibold text-[#123f6d] hover:underline"
                                    >
                                      फेरि खोल्नुहोस्
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {attempts.length === 0 && (
                            <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-500">अहिलेसम्म कुनै अभ्यास सुरु भएको छैन।</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
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
                  <button
                    type="button"
                    onClick={() => printCertificate(certificate)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    प्रिन्ट / PDF
                  </button>
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
                <LegalReferenceCard
                  key={reference.id}
                  reference={reference}
                  onNavigate={onNavigate}
                  onOpenLegalRef={(ref) => setActiveLegalRef(ref)}
                />
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

      {/* Interactive Modals and Drawers */}
      <SimulationDocViewerModal
        document={activeMockDoc}
        onClose={() => setActiveMockDoc(null)}
      />

      <SimulationLegalDrawer
        reference={activeLegalRef}
        onClose={() => setActiveLegalRef(null)}
        onNavigate={onNavigate}
      />

      <SimulationCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <SimulationOfficeMinuteModal
        simulationCase={activeCase}
        attempt={activeAttempt}
        displayName={displayName}
        isOpen={isOfficeMinuteOpen}
        onClose={() => setIsOfficeMinuteOpen(false)}
      />
    </div>
  );
};

const difficultyBadge = (difficulty: string) => {
  switch (difficulty) {
    case 'सरल': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'मध्यम': return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'उन्नत': return 'bg-red-50 text-red-800 border-red-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
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
  onRetry,
  working,
  onReturn,
  onOpenOfficeMinute,
  onOpenLegalRef,
}: {
  simulationCase: SimulationCaseVersion;
  attempt: SimulationAttempt;
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  onIssueCertificate: () => void;
  onRetry: () => void;
  working: boolean;
  onReturn: () => void;
  onOpenOfficeMinute: () => void;
  onOpenLegalRef: (ref: SimulationLegalReference) => void;
}) => {
  const result = attempt.result!;

  return (
    <div className="space-y-5">
      {/* Score banner */}
      <div className={`rounded-2xl p-5 ${result.passed ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{simulationCase.content.title}</p>
            <h2 className="mt-1 text-2xl font-bold">{result.score}/100 · {classifySimulationScore(result.score)}</h2>
          </div>
          {result.passed && <CheckCircle2 className="h-8 w-8" />}
        </div>
        <p className="mt-2 text-sm">{result.passed ? 'तपाईं उत्तीर्ण हुनुभयो।' : 'उत्तीर्ण हुन थप अभ्यास गर्नुहोस्। आवश्यक अंक: ७०।'}</p>

        {/* Visual score bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-semibold opacity-80">
            <span>प्राप्त अंक</span>
            <span>{result.score} / 100</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-black/10">
            <div
              className={`h-full rounded-full transition-all ${result.passed ? 'bg-emerald-600' : 'bg-amber-500'}`}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <div className="mt-1 flex justify-end text-xs opacity-60">उत्तीर्ण सीमा: ७०</div>
        </div>
      </div>

      {/* Per-step breakdown */}
      <div className="space-y-3">
        {result.breakdown.map((row) => {
          const step = simulationCase.content.steps.find((item) => item.id === row.stepId);
          const legalRefs = step?.legalReferenceIds ?? [];
          return (
            <article key={row.stepId} className={`rounded-xl border p-4 ${row.isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/40'}`}>
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{step?.title ?? row.stepId}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${row.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {row.pointsEarned}/{row.pointsAvailable}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{row.explanation}</p>
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <i className="fas fa-check-circle text-emerald-600 text-xs"></i>
                सही जवाफ: <span className="font-semibold text-slate-700">{row.correctAnswer}</span>
              </p>
              {legalRefs.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500">कानुनी आधार:</span>
                  {legalRefs.map((refId) => {
                    const ref = SIMULATION_LEGAL_REFERENCES.find((r) => r.id === refId);
                    return ref ? (
                      <button
                        key={refId}
                        type="button"
                        onClick={() => onOpenLegalRef(ref)}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 text-xs text-blue-700 border border-blue-200 transition-colors"
                      >
                        <BookOpen className="h-3 w-3 text-blue-600" />
                        {ref.clause}
                      </button>
                    ) : null;
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Action row */}
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onReturn} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            प्रगति हेर्नुहोस्
          </button>
          <button
            type="button"
            disabled={working}
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl border border-[#123f6d] px-4 py-2.5 text-sm font-semibold text-[#123f6d] hover:bg-blue-50 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            फेरि प्रयास गर्नुहोस्
          </button>
          <button
            type="button"
            onClick={onOpenOfficeMinute}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-100 shadow-sm"
          >
            <FileText className="h-4 w-4 text-emerald-700" />
            कार्यालय टिप्पणी मस्यौदा
          </button>
        </div>
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
  onOpenLegalRef,
}: {
  reference: SimulationLegalReference;
  onNavigate: (tab: string) => void;
  onOpenLegalRef: (ref: SimulationLegalReference) => void;
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
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenLegalRef(reference)}
            className="text-sm font-bold text-[#176b70] hover:underline inline-flex items-center gap-1"
          >
            <BookOpen className="h-3.5 w-3.5" />
            पूर्ण कानुनी पाठ खोल्नुहोस्
          </button>
          <a href={reference.officialUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#123f6d] underline">आधिकारिक स्रोत खोल्नुहोस्</a>
          {internalTab && (
            <button type="button" onClick={() => onNavigate(internalTab)} className="text-sm font-semibold text-slate-600 underline">
              {internalLabel}
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{reference.summary}</p>
      <p className="mt-2 text-xs text-slate-500">{formatSourceVersion(reference.sourceVersion) || reference.lawName}</p>
      <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">{reference.verificationNote}</p>
    </article>
  );
};
