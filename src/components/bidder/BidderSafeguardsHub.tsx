import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  HardHat,
  Gavel,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  FileText,
  Search,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  FileWarning,
  DollarSign,
  AlertOctagon,
  HelpCircle
} from 'lucide-react';
import {
  BIDDER_SAFEGUARDS,
  BIDDER_TWELVE_QUESTIONS,
  PPRC_FREQUENT_PATTERNS,
  PPMO_PPRC_METRICS,
  CORE_SAFEGUARD_PRINCIPLES,
  SafeguardItem
} from '../../data/procurementSafeguardsData';

export const BidderSafeguardsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'safeguards' | 'twelve-questions' | 'review-protocol' | 'patterns'>('safeguards');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 12-Questions Checklist State
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('bidder_submission_audit_questions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bidder_submission_audit_questions', JSON.stringify(checkedQuestions));
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
    BIDDER_TWELVE_QUESTIONS.forEach((q) => {
      all[q.id] = true;
    });
    setCheckedQuestions(all);
  };

  const verifiedCount = useMemo(() => {
    return Object.values(checkedQuestions).filter(Boolean).length;
  }, [checkedQuestions]);

  const verifiedPercent = Math.round((verifiedCount / BIDDER_TWELVE_QUESTIONS.length) * 100);

  // Filtered safeguards
  const filteredSafeguards = useMemo(() => {
    return BIDDER_SAFEGUARDS.filter((item) => {
      let matchCat = true;
      if (selectedCategoryFilter === 'prep') matchCat = item.stageNumber === 1;
      else if (selectedCategoryFilter === 'forms') matchCat = item.stageNumber === 2;
      else if (selectedCategoryFilter === 'security') matchCat = item.stageNumber === 3;
      else if (selectedCategoryFilter === 'qual') matchCat = item.stageNumber === 4;
      else if (selectedCategoryFilter === 'eval') matchCat = item.stageNumber === 5;
      else if (selectedCategoryFilter === 'review') matchCat = item.stageNumber === 6;
      else if (selectedCategoryFilter === 'contract') matchCat = item.stageNumber === 7;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.topic.toLowerCase().includes(q) ||
        item.contextOrMistake.toLowerCase().includes(q) ||
        item.safeActionProtocol.toLowerCase().includes(q) ||
        item.legalProvision.toLowerCase().includes(q) ||
        item.precedentOrOpinionRefs.some((ref) => ref.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200">
            <span className="flex items-center gap-1 bg-emerald-800/80 px-2.5 py-1 rounded-md border border-emerald-600/40">
              <HardHat className="w-3.5 h-3.5 text-emerald-300" />
              बोलपत्रदाता विशेष मार्गदर्शन
            </span>
            <span>·</span>
            <span className="text-amber-300 font-mono">guide.docx अध्ययनमा आधारित</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            सार्वजनिक खरिदमा बोलपत्रदाताले अपनाउनुपर्ने चरणगत सावधानीहरू
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-4xl leading-relaxed">
            PPMO का <strong>१,२९५ राय/परामर्श</strong> र पुनरावलोकन समितिका <strong>२२१ निर्णयहरू</strong>को अध्ययनले देखाउँछ कि बोलपत्रदाताको कम दर वा प्राविधिक क्षमता मात्र पर्याप्त हुँदैन; फारमको पूर्णता, वैध जमानत, अख्तियारनामा, हदम्याद र कागजात पेश गर्ने अनुशासनले मात्र ठेक्का सुरक्षित गर्दछ।
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-emerald-200 block text-[11px]">खारेज भएका निवेदनहरू</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-rose-300">१०१ निवेदन</span>
              <span className="text-[10px] text-rose-200 block mt-0.5">कागजात/हदम्याद नपुगेका कारण</span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-emerald-200 block text-[11px]">जफत भएको धरौटी</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-amber-300">३६+ ठेक्कामा</span>
              <span className="text-[10px] text-amber-200 block mt-0.5">गलत प्रक्रियामा उजुरी गर्दा</span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-emerald-200 block text-[11px]">बोलपत्रदाताको पक्षमा निर्णय</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-300">१०८ निर्णय</span>
              <span className="text-[10px] text-emerald-200 block mt-0.5">निकायका बदर भएका निर्णयहरू</span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs">
              <span className="text-emerald-200 block text-[11px]">अन्तिम सबमिसन अडिट</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-white">१२ प्रश्न</span>
              <span className="text-[10px] text-emerald-200 block mt-0.5">बिड बुझाउनु अघि अनिवार्य</span>
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
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>चरणगत बोलपत्रदाता सावधानीहरू ({BIDDER_SAFEGUARDS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('twelve-questions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'twelve-questions'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>अन्तिम Submit अघि जाँच्नुपर्ने १२ प्रश्न</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
              {verifiedCount}/12
            </span>
          </button>

          <button
            onClick={() => setActiveTab('review-protocol')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'review-protocol'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>पुनरावलोकन उजुरीमा जोगिने उपाय (दफा ४७/५०)</span>
          </button>

          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'patterns'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>PPRC मा बोलपत्रदाता हार्ने मुख्य कारणहरू</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: BIDDER STAGE-WISE SAFEGUARDS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'safeguards' && (
        <div className="space-y-5">
          {/* Filters & Search */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                विषय:
              </span>
              {[
                { id: 'all', label: 'सबै' },
                { id: 'prep', label: 'सूचना र कागजात' },
                { id: 'forms', label: 'फारम र अख्तियारी' },
                { id: 'security', label: 'बैंक जमानत' },
                { id: 'qual', label: 'योग्यता र जेभी' },
                { id: 'eval', label: 'मूल्याङ्कन' },
                { id: 'review', label: 'पुनरावलोकन' },
                { id: 'contract', label: 'सम्झौता' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="विषय, फारम, जमानत, नजिर नं. खोज्नुहोस्..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Cards List */}
          {filteredSafeguards.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
              खोजिएको मापदण्डमा कुनै सावधानी फेला परेन।
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSafeguards.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 transition-all space-y-3.5"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-md font-mono border border-emerald-200">
                          {item.stageName}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md font-mono">
                          {item.legalProvision}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {item.topic}
                      </h3>
                    </div>

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

                  {/* Fatal Pitfall / Mistake */}
                  <div className="text-xs text-slate-800 bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                    <strong className="text-rose-900 block mb-1 font-bold flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                      बोलपत्रदाताबाट हुने असावधानी वा घातक गल्ती:
                    </strong>
                    <p className="leading-relaxed">{item.contextOrMistake}</p>
                  </div>

                  {/* Safe Action Protocol */}
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    <strong className="text-emerald-900 block mb-1 flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      बोलपत्रदाताले अपनाउनुपर्ने सुरक्षित कार्यविधि (Safe Action Protocol):
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
      {/* TAB 2: TWELVE CRITICAL SUBMISSION AUDIT QUESTIONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'twelve-questions' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  बोलपत्रदाताले अन्तिम Submit अघि जाँच्नुपर्ने १२ अनिवार्य प्रश्न
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  e-GP मा Final Submit बटन थिच्नुभन्दा ठीक अगाडि यी १२ बुँदाहरू एक-एक गरी प्रमाणित गर्नुहोस्:
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCheckAllQuestions}
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
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
                <span className="text-slate-700">सबमिसन प्रमाणीकरण स्थिति:</span>
                <span className={verifiedPercent === 100 ? 'text-emerald-700 font-mono' : 'text-slate-800 font-mono'}>
                  {verifiedCount} / {BIDDER_TWELVE_QUESTIONS.length} ({verifiedPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    verifiedPercent === 100 ? 'bg-emerald-600' : 'bg-emerald-700'
                  }`}
                  style={{ width: `${verifiedPercent}%` }}
                />
              </div>
            </div>

            {verifiedPercent === 100 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>बधाई छ! तपाईंका सम्पूर्ण १२ वटा पूर्व-सर्तहरू परीक्षण भएका छन्। बोलपत्र पूर्ण, वैध र जोखिममुक्त रूपमा दर्ता हुन योग्य छ!</span>
              </div>
            )}
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {BIDDER_TWELVE_QUESTIONS.map((q) => {
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
      {/* TAB 3: REVIEW & APPEAL PROTOCOLS (पुनरावलोकन उजुरीमा जोगिने उपाय) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'review-protocol' && (
        <div className="space-y-5">
          <div className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 text-xs text-purple-950 leading-relaxed space-y-2">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-700" />
              <h3 className="font-extrabold text-sm text-purple-900">
                पुनरावलोकन उजुरीमा बोलपत्रदाताले अपनाउनुपर्ने कानुनी सतर्कता
              </h3>
            </div>
            <p>
              पुनरावलोकन समितिमा परेका २२१ उजुरीहरूमध्ये <strong>१०१ वटा निवेदन खारेज</strong> भएका छन् र तीमध्ये <strong>कम्तीमा ३६ वटामा धरौटी रकम नै जफत</strong> भएको छ। यसको मुख्य कारण कानूनी हदम्याद, गलत क्रम, रु २ करोडको न्यूनतम सीमा र अख्तियारनामाको त्रुटि नै हुन्।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Step 1: Head of Entity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm border-b border-slate-100 pb-2">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-mono">१</span>
                <span>पहिलो चरण: सार्वजनिक निकाय प्रमुख समक्ष निवेदन</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>हदम्याद:</strong> आशयको सूचना प्रकाशित भएको मितिले <strong>७ दिनभित्र</strong> (दफा ४७(३))।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>अनिवार्य पूर्वसर्त:</strong> सिधै पुनरावलोकन समितिमा जान पाइँदैन। निकाय प्रमुख समक्ष निवेदन नदिई समितिमा जाँदा निवेदन खारेज हुन्छ [पुन.-६, पुन.-८]।</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>निकाय प्रमुखको दायित्व:</strong> निवेदन परेको <strong>५ दिनभित्र</strong> कारणसहित लिखित निर्णय दिनुपर्छ।</span>
                </li>
              </ul>
            </div>

            {/* Step 2: Review Committee */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm border-b border-slate-100 pb-2">
                <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-mono">२</span>
                <span>दोस्रो चरण: सार्वजनिक खरिद पुनरावलोकन समिति</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>हदम्याद:</strong> निकाय प्रमुखले निर्णय दिएको मिति वा ५ दिनको म्याद सकिएको मितिले <strong>७ दिनभित्र</strong> (दफा ४७(६), ५०(१))।</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>रकमको सीमा:</strong> कबोल अङ्क (भ्याट बाहेक) <strong>रु २ करोडभन्दा बढी</strong> भएको खरिदमा मात्र समितिमा उजुरी लाग्छ (दफा ४७(८))। २ करोडमुनिका सबै निवेदन खारेज भएका छन् [पुन.-१२, पुन.-९१]।</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>धरौटी जफत जोखिम:</strong> कबोल अङ्कको ०.१५% नगद वा बैंक जमानत अनिवार्य हुन्छ। हदम्याद नाघेर वा विना आधार दिएमा धरौटी जफत हुन्छ [पुन.-१०]।</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Submission Methods Warning */}
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-950 space-y-2">
            <strong className="font-bold flex items-center gap-1.5 text-rose-900">
              <FileWarning className="w-4 h-4 text-rose-700" />
              हुलाक वा कुरियरबाट पठाउँदा हुने हदम्याद जोखिम (नियम १०५(२)):
            </strong>
            <p className="leading-relaxed text-slate-800">
              म्याद नाघेर हुलाक वा कुरियर मार्फत निवेदन पुगेमा समितिले हदम्याद भित्र दर्ता भएको मान्दैन र दरपीठ वा खारेज गर्छ। त्यसैले पुनरावलोकन निवेदन तोकिएको म्यादभित्र समितिको सचिवालय (ताहाचल, काठमाडौं) मा स्वयं उपस्थित भई वा आधिकारिक ईमेल/ई-जिपी मार्फत दर्ता गराउनुहोस्।
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: COMMON REASONS WHY BIDDERS LOSE (नजिरहरू) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'patterns' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 mb-1">
              PPRC निर्णयहरूमा बोलपत्रदाता असफल भएका मुख्य कारणहरू:
            </h3>
            <p className="text-slate-600">
              पुनरावलोकन समितिले उजुरी खारेज गरेका र धरौटी जफत गरेका प्रमुख आधारहरू तल तालिकामा दिइएको छ:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 text-xs">
            {[
              {
                title: '१. अनिवार्य फारम खाली वा "N/A" राखेको',
                desc: 'Bid Submission Form मा वैधता अवधि वा मूल्यमा N/A लेख्ने, Specific Experience फारम खाली पेश गर्ने वा LIT-1 फारममा मुद्दा विवरण नखुलाउँदा सिधै खारेज।',
                refs: 'पुन. ४५, १४०, १८४, १९३, १९८, २०७',
              },
              {
                title: '२. अख्तियारनामा (Power of Attorney) र जेभीमा बेमेल',
                desc: 'बोर्ड बैठकको निर्णय विनाको POA पेश गरेको, वा POA पाउने व्यक्ति र JV Agreement मा हस्ताक्षर गर्ने व्यक्ति फरक परेको अवस्थामा अयोग्य ठहर सदर।',
                refs: 'पुन. ४८, १३०, १६९',
              },
              {
                title: '३. बैंक जमानतमा १ दिन म्याद कम वा शर्त थपिनु',
                desc: '१२० दिन हुनुपर्नेमा ११९ दिनको ग्यारेन्टी पेश भएको, वा FIN-5 मा बैंकले "Subject to approval" लेखिदिएका कारण बोलपत्र रद्द कानूनसम्मत ठहर।',
                refs: 'पुन. ३२, ३५',
              },
              {
                title: '४. प्रक्रिया मिचेर सिधै समितिमा उजुरी दिएको',
                desc: 'ऐनको दफा ४७ अनुसार पहिले निकाय प्रमुखमा नगई सिधै समितिमा गएका सबै निवेदन क्षेत्राधिकार नभएको भनी खारेज र धरौटी जफत।',
                refs: 'पुन. ६, ८, १०',
              },
              {
                title: '५. रु २ करोडभन्दा कम कबोल रकम भएको खरिदमा उजुरी',
                desc: 'दफा ४७(८) को २ करोडको कानूनी थ्रेसहोल्ड विपरित समितिमा दिएका निवेदन प्रारम्भमै खारेज वा दरपीठ।',
                refs: 'पुन. १२, २६, ९१',
              },
            ].map((pitfall, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {pitfall.title}
                  </h4>
                  <span className="font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {pitfall.refs}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {pitfall.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
