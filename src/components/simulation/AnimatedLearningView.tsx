import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Film,
  GraduationCap,
  ListChecks,
  Music,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  AnimatedLesson,
  findLinkedSimulation,
} from '../../data/animatedLessons';
import {
  SimulationAttempt,
  SimulationCaseVersion,
} from '../../types/simulation';
import { voiceEnhancer } from '../../utils/audioEnhancer';
import procurementRulesPdfUrl from '../../../procurement_rules.pdf?url';

interface AnimatedLearningViewProps {
  lessons: AnimatedLesson[];
  cases: SimulationCaseVersion[];
  attempts: SimulationAttempt[];
  selectedLessonId: string;
  progressScope: string;
  onSelectLesson: (lessonId: string) => void;
  onStartSimulation: (simulationCase: SimulationCaseVersion) => void;
}

const WATCHED_LESSONS_STORAGE_KEY = 'public-procurement:animated-lessons-watched:v1';
const procurementActPdfUrl = '/procurement_act.pdf';

const getDisplayLegalClause = (clause: string): string => {
  const displayClause = clause
    .replace(/\s*\([^)]*(?:पुष्टि|समीक्षा)[^)]*\)/gu, '')
    .replace(/\s*[—–-]\s*[^—–-]*(?:पुष्टि|समीक्षा)[^—–-]*$/u, '')
    .trim();

  return /(?:पुष्टि|समीक्षा)\s*(?:आवश्यक|बाँकी)/u.test(displayClause) ? '' : displayClause;
};

const sceneIllustrations = [
  { icon: 'योजना', color: '#dbeafe' },
  { icon: 'आवश्यकता', color: '#dcfce7' },
  { icon: 'बजेट', color: '#fef3c7' },
  { icon: 'समय', color: '#e0e7ff' },
  { icon: 'समीक्षा', color: '#cffafe' },
  { icon: 'अनुगमन', color: '#fce7f3' },
  { icon: 'अभ्यास', color: '#e2e8f0' },
];

const SceneIllustration: React.FC<{ sceneIndex: number }> = ({ sceneIndex }) => (
  <svg
    viewBox="0 0 320 150"
    role="img"
    aria-labelledby="selected-scene-illustration"
    className="mt-3 h-28 w-full"
  >
    <title id="selected-scene-illustration">दृश्य {sceneIndex + 1} को मौलिक vector illustration</title>
    <rect x="1" y="1" width="318" height="148" rx="18" fill="#f8fafc" stroke="#dbe4ef" />
    {sceneIndex === 0 && (
      <g fill="none" stroke="#123f6d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="104" y="25" width="112" height="101" rx="10" />
        <path d="M104 51h112M127 16v19M193 16v19M126 72h13M156 72h13M186 72h13M126 98h13M156 98h13" />
      </g>
    )}
    {sceneIndex === 1 && (
      <g fill="none" stroke="#176b70" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M117 34h94v91h-94zM142 25h45v19h-45z" />
        <path d="m133 68 8 8 13-15M163 71h31m-61 25 8 8 13-15m9 4h31" />
      </g>
    )}
    {sceneIndex === 2 && (
      <g fill="none" stroke="#9a6700" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="117" cy="73" r="32" />
        <path d="M127 59c-4-7-21-8-22 2-1 11 22 7 22 19 0 11-17 13-25 5m15-38v53M173 116V91h22v25m12 0V70h22v46m11 0V51h22v65m-83 0h105" />
      </g>
    )}
    {sceneIndex === 3 && (
      <g fill="none" stroke="#4338ca" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="99" y="28" width="122" height="97" rx="11" />
        <path d="M99 55h122M127 18v20m66-20v20m-66 39h12m22 0h12m22 0h12m-78 24h12m22 0h12" />
      </g>
    )}
    {sceneIndex === 4 && (
      <g fill="none" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M112 29h70l27 27v69h-97zM182 29v29h27" />
        <path d="m133 85 17 17 39-41" />
      </g>
    )}
    {sceneIndex === 5 && (
      <g fill="none" stroke="#be185d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M102 119h119M113 119V91h22v28m21 0V66h22v53m21 0V42h22v77" />
        <path d="m111 69 37-21 29 9 37-28" />
        <path d="M207 29h17v17" />
      </g>
    )}
    {sceneIndex === 6 && (
      <g fill="none" stroke="#123f6d" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="119" cy="75" r="34" />
        <path d="m110 59 25 16-25 16zM163 75h62m-20-20 20 20-20 20" />
      </g>
    )}
  </svg>
);

export const AnimatedLearningView: React.FC<AnimatedLearningViewProps> = ({
  lessons,
  cases,
  attempts,
  selectedLessonId,
  progressScope,
  onSelectLesson,
  onStartSimulation,
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [transcriptError, setTranscriptError] = useState('');
  const [transcriptRetryCount, setTranscriptRetryCount] = useState(0);
  const [transcriptVisible, setTranscriptVisible] = useState(true);
  const [subtitlesOn, setSubtitlesOn] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [mediaError, setMediaError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [watchedLessonIds, setWatchedLessonIds] = useState<string[]>([]);
  const [progressError, setProgressError] = useState('');
  const [knowledgeAnswers, setKnowledgeAnswers] = useState<Record<string, Record<string, string>>>({});
  const [checkedLessons, setCheckedLessons] = useState<Record<string, boolean>>({});
  const [knowledgeCheckError, setKnowledgeCheckError] = useState('');
  const [voiceEnhancerOn, setVoiceEnhancerOn] = useState(() => {
    try {
      const saved = window.localStorage.getItem('public-procurement:natural-voice-filter:v1');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [ambientBgmOn, setAmbientBgmOn] = useState(() => {
    try {
      const saved = window.localStorage.getItem('public-procurement:ambient-bgm:v1');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const lesson = lessons.find((item) => item.lessonId === selectedLessonId) ?? lessons[0];
  const watchedStorageKey = `${WATCHED_LESSONS_STORAGE_KEY}:${encodeURIComponent(progressScope)}`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(watchedStorageKey);
      if (!saved) {
        setWatchedLessonIds([]);
        setProgressError('');
        return;
      }
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'string')) {
        throw new Error('Stored lesson progress has an invalid shape.');
      }
      setWatchedLessonIds(parsed);
      setProgressError('');
    } catch {
      setWatchedLessonIds([]);
      setProgressError('भिडियो हेर्ने प्रगति पढ्न सकिएन। अभ्यास र स्कोर भने यथावत् छन्।');
    }
  }, [watchedStorageKey]);

  useEffect(() => {
    if (!lesson?.transcriptPath) {
      setTranscript('');
      setTranscriptError('यस पाठको transcript path उपलब्ध छैन।');
      return;
    }

    const controller = new AbortController();
    setTranscript('');
    setTranscriptError('');
    fetch(lesson.transcriptPath, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Transcript HTTP ${response.status}`);
        }
        return response.text();
      })
      .then(setTranscript)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setTranscriptError('Transcript फाइल लोड भएन। पुनः प्रयास गर्नुहोस् वा पाठको विवरण प्रयोग गर्नुहोस्।');
      });

    return () => controller.abort();
  }, [lesson?.lessonId, lesson?.transcriptPath, transcriptRetryCount]);

  useEffect(() => {
    const media = videoRef.current ?? audioRef.current;
    if (!media) return;
    for (const track of Array.from(media.textTracks)) {
      track.mode = subtitlesOn ? 'showing' : 'disabled';
    }
  }, [subtitlesOn, lesson?.lessonId, retryCount, mediaError]);

  useEffect(() => {
    const media = videoRef.current ?? audioRef.current;
    if (media) media.playbackRate = playbackRate;
  }, [playbackRate, retryCount]);

  useEffect(() => {
    voiceEnhancer.setEnhanced(voiceEnhancerOn);
    try {
      window.localStorage.setItem('public-procurement:natural-voice-filter:v1', JSON.stringify(voiceEnhancerOn));
    } catch {
      // Local storage may be restricted in private browsing
    }
  }, [voiceEnhancerOn]);

  useEffect(() => {
    const media = videoRef.current ?? audioRef.current;
    const isPlaying = media ? !media.paused && !media.ended : false;
    voiceEnhancer.setBgmEnabled(ambientBgmOn, isPlaying);
    try {
      window.localStorage.setItem('public-procurement:ambient-bgm:v1', JSON.stringify(ambientBgmOn));
    } catch {
      // Local storage may be restricted in private browsing
    }
  }, [ambientBgmOn]);

  useEffect(() => {
    const media = videoRef.current ?? audioRef.current;
    if (media) {
      voiceEnhancer.attachMedia(media);
    }
    return () => {
      voiceEnhancer.updateBgmState(false);
    };
  }, [lesson?.lessonId, retryCount]);

  const handleMediaPlay = () => {
    voiceEnhancer.resume();
    const media = videoRef.current ?? audioRef.current;
    if (media) {
      voiceEnhancer.attachMedia(media);
      voiceEnhancer.updateBgmState(true);
    }
  };

  const handleMediaPause = () => {
    voiceEnhancer.updateBgmState(false);
  };

  const handleMediaEnded = () => {
    voiceEnhancer.updateBgmState(false);
    markLessonWatched();
  };

  if (!lesson) {
    return <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">हाल कुनै video learning पाठ प्रकाशित गरिएको छैन।</p>;
  }

  const linkedCase = findLinkedSimulation(lesson, cases);
  const lessonQuestions = lesson.knowledgeCheck ?? [];
  const lessonAnswers = knowledgeAnswers[lesson.lessonId] ?? {};
  const isKnowledgeCheckSubmitted = checkedLessons[lesson.lessonId] ?? false;
  const selectedQuestionCount = lessonQuestions.filter((question) => lessonAnswers[question.id]).length;
  const correctQuestionCount = lessonQuestions.filter(
    (question) => lessonAnswers[question.id] === question.correctOptionId,
  ).length;
  const latestAttempt = attempts
    .filter((attempt) => attempt.caseKey === lesson.linkedSimulationId)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0];
  const normalizedTranscript = transcript.replace(/^#{1,4}\s+/gm, '');
  const categories = [...new Set(lessons.map((item) => item.category).filter((category): category is string => Boolean(category)))];
  const filteredLessons = lessons.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const searchText = [
      item.title,
      item.description,
      item.category ?? '',
      ...item.learningObjectives,
      ...item.keyPoints,
    ].join(' ').toLocaleLowerCase();
    return matchesCategory && searchText.includes(searchQuery.trim().toLocaleLowerCase());
  });

  const markLessonWatched = () => {
    const updated = [...new Set([...watchedLessonIds, lesson.lessonId])];
    setWatchedLessonIds(updated);
    setProgressError('');
    try {
      window.localStorage.setItem(watchedStorageKey, JSON.stringify(updated));
    } catch {
      setProgressError('यो browser मा भिडियो प्रगति सुरक्षित गर्न सकिएन। अभ्यास र स्कोर भने सुरक्षित रहनेछन्।');
    }
  };

  const submitKnowledgeCheck = () => {
    if (selectedQuestionCount !== lessonQuestions.length) {
      setKnowledgeCheckError('नतिजा जाँच्न सबै प्रश्नको विकल्प छान्नुहोस्।');
      return;
    }
    setKnowledgeCheckError('');
    setCheckedLessons((previous) => ({ ...previous, [lesson.lessonId]: true }));
  };

  return (
    <section className="space-y-5" aria-labelledby="animated-learning-title">
      <header className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Film className="mt-1 h-6 w-6 shrink-0 text-[#123f6d]" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#176b70]">एकीकृत सिकाइ अनुभव</p>
            <h2 id="animated-learning-title" className="mt-1 text-xl font-bold text-slate-900">भिडियोबाट सिकौँ</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">
              पाठ, नेपाली transcript, मुख्य बुँदा र त्यही विषयको विद्यमान simulation एउटै अभ्यासशालामा।
              भिडियो पूरा हेर्नु simulation सुरु गर्नुपर्ने शर्त होइन।
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-600">
          पूरा भिडियो: {watchedLessonIds.filter((id) => lessons.some((item) => item.lessonId === id)).length}/{lessons.length}
        </p>
      </header>
      {progressError && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{progressError}</p>}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.55fr)]">
        <aside aria-label="भिडियो सिकाइका पाठहरू" className="space-y-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="पाठ वा विषय खोज्नुहोस्"
              aria-label="भिडियो पाठ खोज्नुहोस्"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            विषयअनुसार
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              aria-label="विषयअनुसार पाठ फिल्टर गर्नुहोस्"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="all">सबै विषय</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          {filteredLessons.length === 0 && (
            <p role="status" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">खोज वा छानिएको विषयसँग मिल्ने पाठ भेटिएन।</p>
          )}
          {filteredLessons.map((item) => {
            const itemCase = findLinkedSimulation(item, cases);
            const itemAttempts = attempts.filter((attempt) => attempt.caseKey === item.linkedSimulationId);
            const latest = itemAttempts.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0];
            const selected = item.lessonId === lesson.lessonId;
            const watched = watchedLessonIds.includes(item.lessonId);
            return (
              <button
                key={item.lessonId}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  onSelectLesson(item.lessonId);
                  setSelectedSceneIndex(0);
                  setMediaError('');
                }}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${selected
                  ? 'border-[#123f6d] bg-blue-50 ring-1 ring-[#123f6d]/15'
                  : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-bold leading-6 text-slate-900">{item.title}</span>
                  {selected && <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#123f6d]" aria-hidden="true" />}
                </span>
                <span className="mt-2 block text-sm leading-5 text-slate-600">{item.description}</span>
                <span className="mt-3 flex flex-wrap gap-2 text-xs">
                  {item.category && <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-900">{item.category}</span>}
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{item.durationLabel}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">{item.difficulty}</span>
                  <span className={`rounded-full px-2.5 py-1 font-semibold ${item.videoAvailable ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                    {item.videoAvailable ? 'भिडियो उपलब्ध छ' : 'भिडियो तयार गर्न बाँकी छ'}
                  </span>
                  {item.publicationStatus === 'draft' && <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-900">पाठ समीक्षा बाँकी</span>}
                  <span className={`rounded-full px-2.5 py-1 font-semibold ${watched ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-700'}`}>
                    {watched ? 'भिडियो पूरा' : 'हेर्न बाँकी'}
                  </span>
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                  अभ्यास: {latest?.result
                    ? `${latest.result.score}/100`
                    : latest?.status === 'in_progress'
                      ? 'जारी'
                      : itemCase ? 'सुरु भएको छैन' : 'अभ्यास उपलब्ध छैन'}
                </span>
              </button>
            );
          })}
        </aside>

        <article className="min-w-0 flex flex-col gap-5">
          <div className="order-1 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#176b70]">नेपाली animated lesson</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{lesson.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.description}</p>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${lesson.videoAvailable ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`} role="status">
                <Film className="h-3.5 w-3.5" aria-hidden="true" />
                {lesson.videoAvailable ? 'भिडियो उपलब्ध छ' : 'भिडियो तयार गर्न बाँकी छ'}
              </span>
              {lesson.publicationStatus === 'draft' && (
                <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900" role="status">
                  पाठ मस्यौदा · कानुनी समीक्षा आवश्यक
                </span>
              )}
            </div>

            {lesson.videoAvailable || lesson.voiceOverAvailable ? (
              <div className="space-y-3 p-4 sm:p-5">
                {mediaError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
                    <p className="font-semibold text-red-900">मिडिया लोड भएन</p>
                    <p className="mt-1 text-sm text-red-800">{mediaError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaError('');
                        setRetryCount((count) => count + 1);
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-900 hover:bg-red-50"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />पुनः प्रयास गर्नुहोस्
                    </button>
                  </div>
                ) : (
                  <>
                    {lesson.videoAvailable ? (
                      <video
                        key={`${lesson.lessonId}-${retryCount}`}
                        ref={videoRef}
                        className="aspect-video w-full rounded-xl bg-slate-950"
                        controls
                        playsInline
                        preload="metadata"
                        crossOrigin="anonymous"
                        poster={lesson.posterPath}
                        aria-label={`${lesson.title} भिडियो`}
                        onError={() => setMediaError('फाइल भेटिएन वा नेटवर्कमा समस्या आयो। Transcript पढ्न सक्नुहुन्छ; फाइल जाँचेर पुनः प्रयास गर्नुहोस्।')}
                        onPlay={handleMediaPlay}
                        onPause={handleMediaPause}
                        onEnded={handleMediaEnded}
                      >
                        <source src={lesson.videoPath} type="video/mp4" />
                        <track kind="subtitles" src={lesson.subtitlePath} srcLang="ne" label="नेपाली" />
                        तपाईंको browser ले HTML5 भिडियो समर्थन गर्दैन। Transcript पढ्नुहोस्।
                      </video>
                    ) : (
                      <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-800">नेपाली voice-over audio</p>
                        <audio
                          key={`${lesson.lessonId}-${retryCount}`}
                          ref={audioRef}
                          className="w-full"
                          controls
                          preload="metadata"
                          crossOrigin="anonymous"
                          aria-label={`${lesson.title} नेपाली voice-over`}
                          onError={() => setMediaError('Voice-over फाइल भेटिएन वा नेटवर्कमा समस्या आयो। Transcript पढ्न सक्नुहुन्छ; फाइल जाँचेर पुनः प्रयास गर्नुहोस्।')}
                          onPlay={handleMediaPlay}
                          onPause={handleMediaPause}
                          onEnded={handleMediaEnded}
                        >
                          <source src={lesson.voiceOverPath} type="audio/mpeg" />
                          <track kind="subtitles" src={lesson.subtitlePath} srcLang="ne" label="नेपाली" />
                          तपाईंको browser ले audio समर्थन गर्दैन। Transcript पढ्नुहोस्।
                        </audio>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        गति
                        <select
                          aria-label="भिडियो playback गति"
                          value={playbackRate}
                          onChange={(event) => setPlaybackRate(Number(event.target.value))}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-2"
                        >
                          {[0.75, 1, 1.25, 1.5].map((rate) => (
                            <option key={rate} value={rate}>{rate}x</option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        aria-pressed={subtitlesOn}
                        onClick={() => setSubtitlesOn((enabled) => !enabled)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        नेपाली subtitles {subtitlesOn ? 'बन्द गर्नुहोस्' : 'खोल्नुहोस्'}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#123f6d]">
                          <Sparkles className="h-4 w-4 text-[#176b70]" aria-hidden="true" />
                          ध्वनि गुणस्तर सुधार:
                        </span>
                        <button
                          type="button"
                          aria-pressed={voiceEnhancerOn}
                          onClick={() => setVoiceEnhancerOn((prev: boolean) => !prev)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                            voiceEnhancerOn
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          title="सिन्थेटिक आवाजको रोबोटिक रुखोपन घटाई न्यानोपन र मानव सुर थप्छ"
                        >
                          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                          स्वाभाविक आवाज फिल्टर {voiceEnhancerOn ? 'चालू' : 'बन्द'}
                        </button>
                        <button
                          type="button"
                          aria-pressed={ambientBgmOn}
                          onClick={() => setAmbientBgmOn((prev: boolean) => !prev)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                            ambientBgmOn
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          title="भ्वाइसओभर पछाडि हल्का अध्ययन धुन मिसाएर रोबोटिक आर्टिफ्याक्ट्स छोप्छ"
                        >
                          <Music className="h-3.5 w-3.5" aria-hidden="true" />
                          पृष्ठभूमि धुन {ambientBgmOn ? 'चालू' : 'बन्द'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {voiceEnhancerOn ? '✓ स्टुडियो EQ & De-buzz सक्रिय' : 'मूल सिन्थेटिक आवाज'}
                        {ambientBgmOn ? ' · पृष्ठभूमि धुन सक्रिय' : ''}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500">Play/pause, timeline र volume का लागि native keyboard-सुलभ controls प्रयोग गर्नुहोस्। भिडियो उपलब्ध हुँदा fullscreen पनि त्यहीँबाट खोल्न सकिन्छ।</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[1.25fr_1fr]">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={lesson.posterPath}
                    alt={`${lesson.title} को मौलिक स्थिर illustration`}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-950">
                    <Film className="h-4 w-4" aria-hidden="true" />भिडियो तयार गर्न बाँकी छ
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    यो चित्र स्थिर preview हो, MP4 होइन। नेपाली voice-over र वास्तविक भिडियो उपलब्ध भएपछि यस पाठमा जोडिनेछ।
                    अहिले नै transcript र मुख्य सिकाइ बुँदा पढेर simulation सुरु गर्न सक्नुहुन्छ।
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    अपेक्षित फाइलहरू: <code>videos/{lesson.lessonId}.mp4</code> र <code>audio/{lesson.lessonId}.ne.mp3</code>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="order-3 grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-bold text-slate-900"><GraduationCap className="h-5 w-5 text-[#123f6d]" aria-hidden="true" />सिकाइ उद्देश्य</h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {lesson.learningObjectives.map((objective) => <li key={objective} className="flex gap-2"><span className="text-emerald-700" aria-hidden="true">•</span><span>{objective}</span></li>)}
              </ul>
              <h4 className="mt-5 font-bold text-slate-900">मुख्य सिकाइ बुँदाहरू</h4>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                {lesson.keyPoints.map((point) => <li key={point} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" /><span>{point}</span></li>)}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="lesson-scenes-heading">
              <h3 id="lesson-scenes-heading" className="font-bold text-slate-900">{lesson.scenes.length} दृश्यको रूपरेखा</h3>
              <ol className="mt-3 space-y-2">
                {lesson.scenes.map((scene, index) => {
                  const illustration = sceneIllustrations[index % sceneIllustrations.length];
                  const selected = selectedSceneIndex === index;
                  return (
                    <li key={scene.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedSceneIndex(index)}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left ${selected ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-slate-800" style={{ backgroundColor: illustration.color }}>{index + 1}</span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">{scene.title}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-600">{scene.takeaway}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-3 rounded-xl bg-slate-50 p-4" aria-live="polite">
                <p className="text-xs font-bold text-[#176b70]">दृश्य {selectedSceneIndex + 1} · Voice-over script</p>
                <SceneIllustration sceneIndex={selectedSceneIndex} />
                <p className="mt-3 text-xs font-semibold text-slate-500">{sceneIllustrations[selectedSceneIndex]?.icon}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{lesson.scenes[selectedSceneIndex]?.narration}</p>
                {lesson.scenes[selectedSceneIndex]?.screenText && (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="यस दृश्यका मुख्य शब्द">
                    {lesson.scenes[selectedSceneIndex].screenText?.map((text) => (
                      <li key={text} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-900">{text}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          <section className="order-2 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#123f6d]" aria-hidden="true" />
                <h3 className="font-bold text-slate-900">नेपाली transcript</h3>
              </div>
              <button
                type="button"
                aria-expanded={transcriptVisible}
                onClick={() => setTranscriptVisible((visible) => !visible)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {transcriptVisible ? 'Transcript लुकाउनुहोस्' : 'Transcript देखाउनुहोस्'}
              </button>
            </div>
            {transcriptVisible && (
              <div className="p-5">
                {transcriptError ? (
                  <div role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                    <p>{transcriptError}</p>
                    <button
                      type="button"
                      onClick={() => setTranscriptRetryCount((count) => count + 1)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-semibold hover:bg-amber-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Transcript पुनः प्रयास गर्नुहोस्
                    </button>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">{normalizedTranscript || 'Transcript लोड हुँदैछ…'}</pre>
                )}
                <p className="mt-3 text-xs leading-5 text-slate-500">नेपाली voice-over स्थानीय Piper voice model बाट synthetic रूपमा तयार गरिएको हो। Subtitle cue हरू वास्तविक audio clip को अवधि अनुसार राखिएका छन्; उच्चारण र timing प्रकाशनअघि मानवीय रूपमा जाँच्नुहोस्।</p>
              </div>
            )}
          </section>

          <section className="order-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-emerald-950">कानुनी स्रोत र समीक्षा अवस्था</h3>
                {lesson.legalReferences.map((reference) => {
                  const clause = getDisplayLegalClause(reference.clause);
                  return (
                    <div key={reference.id} className="mt-2 text-sm leading-6 text-emerald-950">
                      <p>
                        <strong>{reference.lawName}</strong>
                        {clause && ` · ${clause}`}
                      </p>
                      <div className="flex flex-wrap gap-x-4">
                        {reference.lawName.includes('ऐन') && (
                          <a href={procurementActPdfUrl} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
                            सार्वजनिक खरिद ऐन, २०६३ — दोस्रो संशोधन, २०८३
                          </a>
                        )}
                        {reference.lawName.includes('नियमावली') && (
                          <a href={procurementRulesPdfUrl} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
                            सार्वजनिक खरिद नियमावली, २०६४ — सोह्रौँ संशोधन, २०८३
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
                <p className="mt-2 text-xs font-semibold text-emerald-900">
                  स्रोत समीक्षा: एपमा उपलब्ध सार्वजनिक खरिद ऐनको दोस्रो संशोधन (२०८३।०३।२५) र नियमावलीको सोह्रौँ संशोधन (२०८३।०५।०३) सम्म समेटिएको एकीकृत पाठअनुसार।
                </p>
              </div>
            </div>
          </section>

          {lesson.fictionalExample && (
            <section className="order-4 rounded-2xl border border-sky-200 bg-sky-50 p-5" aria-labelledby="fictional-example-title">
              <h3 id="fictional-example-title" className="font-bold text-slate-900">काल्पनिक व्यावहारिक उदाहरण</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{lesson.fictionalExample}</p>
            </section>
          )}

          {lessonQuestions.length > 0 && (
            <section className="order-5 rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="knowledge-check-title">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 id="knowledge-check-title" className="font-bold text-slate-900">ज्ञान-जाँच</h3>
                  <p className="mt-1 text-sm text-slate-600">{lessonQuestions.length} प्रश्न · उत्तरको व्याख्या तुरुन्त देखिन्छ।</p>
                </div>
                {isKnowledgeCheckSubmitted && (
                  <span role="status" className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-900">
                    अङ्क: {correctQuestionCount}/{lessonQuestions.length}
                  </span>
                )}
              </div>
              <div className="mt-4 space-y-4">
                {lessonQuestions.map((question, questionIndex) => {
                  const isCorrect = lessonAnswers[question.id] === question.correctOptionId;
                  return (
                    <fieldset key={question.id} className="rounded-xl border border-slate-200 p-4">
                      <legend className="px-1 text-sm font-semibold leading-6 text-slate-900">
                        {questionIndex + 1}. {question.prompt}
                      </legend>
                      <div className="mt-2 space-y-2">
                        {question.options.map((option) => (
                          <label key={option.id} className="flex cursor-pointer items-start gap-2 rounded-lg p-2 text-sm leading-6 text-slate-700 hover:bg-slate-50">
                            <input
                              type="radio"
                              name={`${lesson.lessonId}-${question.id}`}
                              value={option.id}
                              checked={lessonAnswers[question.id] === option.id}
                              onChange={() => {
                                setKnowledgeAnswers((previous) => ({
                                  ...previous,
                                  [lesson.lessonId]: { ...previous[lesson.lessonId], [question.id]: option.id },
                                }));
                                setCheckedLessons((previous) => ({ ...previous, [lesson.lessonId]: false }));
                                setKnowledgeCheckError('');
                              }}
                              className="mt-1 shrink-0 accent-[#123f6d]"
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {isKnowledgeCheckSubmitted && (
                        <div className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm leading-6 ${isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`} role="status">
                          {isCorrect
                            ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                            : <XCircle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />}
                          <span>{isCorrect ? 'सही निर्णय। ' : 'यो विकल्प सही होइन। '}{question.explanation}</span>
                        </div>
                      )}
                    </fieldset>
                  );
                })}
              </div>
              {knowledgeCheckError && <p role="alert" className="mt-3 text-sm font-semibold text-red-800">{knowledgeCheckError}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={submitKnowledgeCheck}
                  className="rounded-lg bg-[#123f6d] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0e3359]"
                >
                  उत्तर जाँच्नुहोस्
                </button>
                {isKnowledgeCheckSubmitted && (
                  <button
                    type="button"
                    onClick={() => {
                      setKnowledgeAnswers((previous) => ({ ...previous, [lesson.lessonId]: {} }));
                      setCheckedLessons((previous) => ({ ...previous, [lesson.lessonId]: false }));
                      setKnowledgeCheckError('');
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    पुनः प्रयास गर्नुहोस्
                  </button>
                )}
              </div>
            </section>
          )}

          <section className="order-7 flex flex-col gap-4 rounded-2xl border border-[#123f6d]/15 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#176b70]">यस पाठसँग जोडिएको अभ्यास</p>
              <h3 className="mt-1 font-bold text-slate-900">{linkedCase?.content.title ?? 'सम्बन्धित अभ्यास उपलब्ध छैन'}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {latestAttempt?.result
                  ? `पछिल्लो स्कोर ${latestAttempt.result.score}/100 · ${latestAttempt.result.passed ? 'उत्तीर्ण' : 'थप अभ्यास आवश्यक'}`
                  : latestAttempt?.status === 'in_progress'
                    ? 'यो केसमा तपाईंको अभ्यास जारी छ।'
                    : 'परिदृश्यमा निर्णय गरेर हरेक निर्णयको अङ्क र कारणसहितको प्रतिक्रिया हेर्नुहोस्।'}
              </p>
            </div>
            <button
              type="button"
              disabled={!linkedCase}
              onClick={() => linkedCase && onStartSimulation(linkedCase)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#123f6d] px-5 py-3 text-sm font-bold text-white hover:bg-[#0e3359] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              अब आफैँ अभ्यास गर्नुहोस्
            </button>
          </section>
        </article>
      </div>
    </section>
  );
};
