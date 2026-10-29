import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  Building2,
  Gavel,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  ENTITY_SAFEGUARDS,
  ENTITY_TWELVE_QUESTIONS,
  PPRC_FREQUENT_PATTERNS,
  PPMO_PPRC_METRICS,
  CORE_SAFEGUARD_PRINCIPLES,
  SafeguardItem
} from '../../data/procurementSafeguardsData';

interface EntitySafeguardsHubProps {
  currentStageNo?: number;
  onNavigateToStage?: (stageNo: number) => void;
}

export const EntitySafeguardsHub: React.FC<EntitySafeguardsHubProps> = ({
  currentStageNo,
  onNavigateToStage,
}) => {
  const [activeTab, setActiveTab] = useState<'safeguards' | 'twelve-questions' | 'patterns' | 'principles'>('safeguards');
  const [selectedStageFilter, setSelectedStageFilter] = useState<number>(currentStageNo || 0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 12-Questions Checklist State
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pe_decision_audit_questions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pe_decision_audit_questions', JSON.stringify(checkedQuestions));
    } catch {}
  }, [checkedQuestions]);

  const handleToggleQuestion = (id: string) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleResetQuestions = () => {
    setCheckedQuestions({});
  };

  const handleCheckAllQuestions = () => {
    const all: Record<string, boolean> = {};
    ENTITY_TWELVE_QUESTIONS.forEach((q) => {
      all[q.id] = true;
    });
    setCheckedQuestions(all);
  };

  const verifiedCount = useMemo(() => {
    return Object.values(checkedQuestions).filter(Boolean).length;
  }, [checkedQuestions]);

  const verifiedPercent = Math.round((verifiedCount / ENTITY_TWELVE_QUESTIONS.length) * 100);

  // Filtered safeguards
  const filteredSafeguards = useMemo(() => {
    return ENTITY_SAFEGUARDS.filter((item) => {
      const matchStage = selectedStageFilter === 0 || item.stageNumber === selectedStageFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.topic.toLowerCase().includes(q) ||
        item.contextOrMistake.toLowerCase().includes(q) ||
        item.safeActionProtocol.toLowerCase().includes(q) ||
        item.legalProvision.toLowerCase().includes(q) ||
        item.precedentOrOpinionRefs.some((ref) => ref.toLowerCase().includes(q));
      return matchStage && matchSearch;
    });
  }, [selectedStageFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span className="flex items-center gap-1 bg-blue-800/80 px-2.5 py-1 rounded-md border border-blue-600/40">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              सार्वजनिक निकाय विशेष मार्गदर्शन
            </span>
            <span>·</span>
            <span className="text-amber-300 font-mono">guide.docx अध्ययनमा आधारित</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            सार्वजनिक खरिद प्रक्रियामा सार्वजनिक निकायले अपनाउनुपर्ने सावधानीहरू
          </h2>

          <p className="text-xs sm:text-sm text-blue-100/90 max-w-4xl leading-relaxed">
            सार्वजनिक खरिद अनुगमन कार्यालयका <strong>१,२९५ राय/परामर्श</strong> र सार्वजनिक खरिद पुनरावलोकन समितिका <strong>२२१ निर्णयहरू</strong>को विस्तृत अध्ययनबाट संश्लेषित व्यवहारिक सावधानी, कानूनी सीमा तथा निर्णय–पूर्व सोध्नुपर्ने चेकलिस्ट।
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-blue-200 block text-[11px]">अध्ययन गरिएका PPMO राय</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-white">१,२९५ वटा</span>
              <span className="text-[10px] text-blue-300 block mt-0.5">निर्माण ३८२ | माल ३५१ | सेवा ११६</span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-blue-200 block text-[11px]">PPRC पुनरावलोकन निर्णय</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-amber-300">२२१ वटा</span>
              <span className="text-[10px] text-amber-200 block mt-0.5">मुख्यतः २०७५ देखि २०८१ सम्म</span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-blue-200 block text-[11px]">निकायका बदर भएका निर्णय</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-rose-300">१०८ निर्णय</span>
              <span className="text-[10px] text-rose-200 block mt-0.5">नियमविपरीत शर्त/रद्दका कारण</span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-blue-200 block text-[11px]">बोलपत्रदाताका खारेज निवेदन</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-300">१०१ निवेदन</span>
              <span className="text-[10px] text-emerald-200 block mt-0.5">३६ मा धरौटी जफत</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('safeguards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'safeguards'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>चरणगत विस्तृत सावधानीहरू ({ENTITY_SAFEGUARDS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('twelve-questions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'twelve-questions'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>निर्णयपूर्व सोध्नुपर्ने १२ अनिवार्य प्रश्न</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold">
              {verifiedCount}/12
            </span>
          </button>

          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'patterns'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>PPRC निर्णय नजिर ढाँचा (१०८ बदर / १०१ खारेज)</span>
          </button>

          <button
            onClick={() => setActiveTab('principles')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'principles'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>४ आधारभूत कानूनी सिद्धान्त</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: STAGE-WISE DETAILED SAFEGUARDS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'safeguards' && (
        <div className="space-y-5">
          {/* Filters & Search Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            {/* Stage filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                चरण:
              </span>
              {[
                { id: 0, label: 'सबै चरणहरू' },
                { id: 1, label: '१. खरिद तयारी' },
                { id: 2, label: '२. कागजात र सूचना' },
                { id: 3, label: '३. दर्ता र खोल्ने' },
                { id: 4, label: '४. मूल्याङ्कन' },
                { id: 5, label: '५. स्वीकृति र रद्द' },
                { id: 6, label: '६. सम्झौता र भेरिएसन' },
              ].map((stg) => (
                <button
                  key={stg.id}
                  onClick={() => setSelectedStageFilter(stg.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedStageFilter === stg.id
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {stg.label}
                </button>
              ))}
            </div>

            {/* Keyword search input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="विषय, दफा, राय वा निर्णय नं. खोज्नुहोस्..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Safeguard Cards List */}
          {filteredSafeguards.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
              खोजिएको मापदण्डमा कुनै सावधानी बुँदा फेला परेन।
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSafeguards.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition-all space-y-3.5"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md font-mono border border-blue-200">
                          चरण {item.stageNumber}: {item.stageName}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md font-mono">
                          {item.legalProvision}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {item.topic}
                      </h3>
                    </div>

                    {/* Precedent / Opinion Reference Pills */}
                    <div className="flex flex-wrap items-center gap-1">
                      {item.precedentOrOpinionRefs.map((ref, idx) => {
                        const isPprc = ref.startsWith('पुन.');
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                              isPprc
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                            title={isPprc ? 'PPRC पुनरावलोकन निर्णय' : 'PPMO राय/परामर्श'}
                          >
                            [{ref}]
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Context / Mistake Seen in Opinions & Disputes */}
                  <div className="text-xs text-slate-700 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                    <strong className="text-rose-900 block mb-1 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      राय तथा विवादमा देखिएको त्रुटि / गल्ती:
                    </strong>
                    <p className="leading-relaxed text-slate-800">{item.contextOrMistake}</p>
                  </div>

                  {/* Safe Action Protocol for Public Entity */}
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    <strong className="text-emerald-900 block mb-1 flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-700" />
                      सार्वजनिक निकायले अनिवार्य अपनाउनुपर्ने सुरक्षित कार्यविधि:
                    </strong>
                    <p className="text-slate-800 leading-relaxed">{item.safeActionProtocol}</p>
                  </div>

                  {/* Practical Tip */}
                  <div className="flex items-start gap-2 p-2.5 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-950">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-amber-900 mr-1">व्यावहारिक सतर्कता:</strong>
                      <span>{item.practicalTip}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TWELVE CRITICAL AUDIT QUESTIONS FOR PUBLIC ENTITY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'twelve-questions' && (
        <div className="space-y-5">
          {/* Header & Progress Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-700" />
                  सार्वजनिक निकायले कुनै पनि निर्णय गर्नुअघि सोध्नुपर्ने १२ अनिवार्य प्रश्न
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  लागत अनुमान स्वीकृति, बोलपत्र आह्वान, संशोधन, मूल्याङ्कन, रद्द वा सम्झौता गर्नु अगाडि यी १२ बुँदा रुजु गर्नुहोस्:
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCheckAllQuestions}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  सबै ठीक लगाउनुहोस्
                </button>
                <button
                  onClick={handleResetQuestions}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  रिसेट
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">प्रमाणीकरण प्रगति (Verification Progress):</span>
                <span className={verifiedPercent === 100 ? 'text-emerald-700 font-mono' : 'text-blue-800 font-mono'}>
                  {verifiedCount} / {ENTITY_TWELVE_QUESTIONS.length} ({verifiedPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    verifiedPercent === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${verifiedPercent}%` }}
                />
              </div>
            </div>

            {verifiedPercent === 100 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>सम्पूर्ण १२ वटा पूर्व-सर्तहरू परीक्षण भएका छन्। निर्णय प्रक्रिया कानूनसम्मत र जोखिममुक्त छ!</span>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {ENTITY_TWELVE_QUESTIONS.map((q) => {
              const isChecked = !!checkedQuestions[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() => handleToggleQuestion(q.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isChecked ? 'text-emerald-950 font-semibold' : 'text-slate-900'
                        }`}
                      >
                        {q.questionNumber}. {q.questionText}
                      </h4>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-mono font-bold">
                        {q.legalRef}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PPRC FREQUENT DISPUTE PATTERNS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'patterns' && (
        <div className="space-y-5">
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 leading-relaxed flex items-start gap-3">
            <Gavel className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-sm block mb-1 text-purple-900">
                PPRC मा बारम्बार दोहोरिएका ८ मुख्य विवाद ढाँचा तथा नजिरहरू:
              </strong>
              पुनरावलोकन समितिले सार्वजनिक निकायका <strong>१०८ निर्णय बदर</strong> गरेको र बोलपत्रदाताका <strong>१०१ निवेदन खारेज</strong> (३६ मा धरौटी जफत) गरेको अध्ययनले देखाउँछ। तलका ढाँचाहरूले कुन अवस्थामा निकायको निर्णय बदर हुन्छ र कुनमा बोलपत्रदाता असफल हुन्छन् भन्ने स्पष्ट पार्छ।
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {PPRC_FREQUENT_PATTERNS.map((pat, idx) => {
              const isQuashed = pat.decisionType === 'quashed' || pat.decisionType === 'agreement-quashed';
              return (
                <div
                  key={pat.id}
                  className={`bg-white rounded-2xl border p-5 space-y-3 shadow-2xs ${
                    isQuashed ? 'border-rose-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs font-mono">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {pat.natureOfDispute}
                      </h4>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isQuashed
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isQuashed ? 'निकायको निर्णय बदर' : 'निवेदन खारेज / कानुनसम्मत'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <strong className="text-purple-900 block mb-0.5 font-bold">समितिको ठहर तथा आदेश:</strong>
                    {pat.committeeDecision}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">उदाहरण निर्णयहरू:</span>
                      <div className="flex flex-wrap gap-1 font-mono font-bold text-[11px] text-purple-800">
                        {pat.exampleDecisions.map((ex, i) => (
                          <span key={i} className="bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium italic">
                      💡 {pat.keyLesson}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: FOUR CORE PRINCIPLES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'principles' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950">
            <h3 className="font-extrabold text-sm mb-1 text-blue-900">
              सबै विवादमा बारम्बार देखिएका ४ आधारभूत सिद्धान्तहरू (Core Safeguard Principles):
            </h3>
            <p>
              १,२९५ PPMO राय र २२१ PPRC निर्णयहरूको अध्ययनले देखाएको केन्द्रीय निष्कर्ष यी ४ स्तम्भमा आधारित छन्:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORE_SAFEGUARD_PRINCIPLES.map((principle, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {principle.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-9">
                  {principle.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
