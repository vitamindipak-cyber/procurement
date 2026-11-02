import React, { useState, useMemo } from 'react';
import {
  Search, BookOpen, AlertTriangle, ShieldCheck, Scale, FileText, CheckCircle2,
  HelpCircle, Copy, Check, ChevronDown, ChevronUp, Clock, Filter,
  Info, ArrowRight, Award, FileSpreadsheet, GitCompare, Bookmark,
  Layers, CheckSquare, BarChart3
} from 'lucide-react';
import {
  HANDBOOK_TOPICS,
  VERY_SHORT_QA,
  SHORT_QA,
  LONG_QA,
  COMPARATIVE_ANALYSES,
  MASTER_TIMELINES_TABLE,
  MASTER_FINANCIAL_TABLE,
  MASTER_PERCENTAGES_TABLE,
  MASTER_AUTHORITIES_TABLE,
  HandbookTopic,
  VeryShortQA,
  ShortQA,
  LongQA,
  ComparativeAnalysis,
  MasterFactRow
} from '../data/procurementHandbookData';
import {
  PROCUREMENT_DILEMMAS,
  ProcurementDilemma
} from '../data/procurementDilemmasData';
import delNewImage from '../../del_new.webp';

type MainTab = 'all' | 'level-a' | 'level-b' | 'level-c' | 'case-studies' | 'comparative' | 'fact-tables' | 'topics-directory';
type FactSubTab = 'timelines' | 'limits' | 'percentages' | 'authorities';

export const ProcurementDilemmaSolverView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [factSubTab, setFactSubTab] = useState<FactSubTab>('timelines');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Thematic Groups for filtering
  const thematicGroups = useMemo(() => [
    { id: 'all', label: 'सबै समूह (All 8 Groups)' },
    { id: 'khareed-tayari', label: '१. खरिद तयारी, योजना तथा लागत अनुमान' },
    { id: 'vidhi-chhanot', label: '२. खरिद विधि र योग्यता छनोट' },
    { id: 'bolpatra-prakriya', label: '३. बोलपत्र प्रक्रिया र कागजात' },
    { id: 'mulyankan-chhanot', label: '४. परीक्षण, मूल्याङ्कन र स्वीकृति' },
    { id: 'samjhauta-karyannawayan', label: '५. सम्झौता व्यवस्थापन र कार्यान्वयन' },
    { id: 'gunastar-bhuktani', label: '६. भेरिएसन, म्याद थप र भुक्तानी' },
    { id: 'vivad-punaravalokan', label: '७. उजुरी, पुनरावलोकन, विवाद र कालोसूची' },
    { id: 'sushasan-kanuni-byawastha', label: '८. संस्थागत संरचना, आचरण र सुशासन' },
  ], []);

  // Filter Level A Q&A
  const filteredLevelA = useMemo(() => {
    return VERY_SHORT_QA.filter((item: VeryShortQA) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.actRef.toLowerCase().includes(q) ||
        item.ruleRef.toLowerCase().includes(q) ||
        item.keyMetric.toLowerCase().includes(q);

      const topic = HANDBOOK_TOPICS.find((t: HandbookTopic) => t.id === item.topicId);
      const matchesGroup = selectedGroup === 'all' || (topic && topic.group === selectedGroup);
      const matchesTopic = selectedTopicId === null || item.topicId === selectedTopicId;

      return matchesSearch && matchesGroup && matchesTopic;
    });
  }, [searchQuery, selectedGroup, selectedTopicId]);

  // Filter Level B Q&A
  const filteredLevelB = useMemo(() => {
    return SHORT_QA.filter((item: ShortQA) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        item.question.toLowerCase().includes(q) ||
        item.purposeAndSignificance.toLowerCase().includes(q) ||
        item.legalBasis.toLowerCase().includes(q) ||
        item.responsibleAuthority.toLowerCase().includes(q) ||
        item.impactOrCaution.toLowerCase().includes(q) ||
        item.keyPointsOrSteps.some((step: string) => step.toLowerCase().includes(q));

      const topic = HANDBOOK_TOPICS.find((t: HandbookTopic) => t.id === item.topicId);
      const matchesGroup = selectedGroup === 'all' || (topic && topic.group === selectedGroup);
      const matchesTopic = selectedTopicId === null || item.topicId === selectedTopicId;

      return matchesSearch && matchesGroup && matchesTopic;
    });
  }, [searchQuery, selectedGroup, selectedTopicId]);

  // Filter Level C Q&A
  const filteredLevelC = useMemo(() => {
    return LONG_QA.filter((item: LongQA) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        item.question.toLowerCase().includes(q) ||
        item.introduction.toLowerCase().includes(q) ||
        item.legalGrounding.act.toLowerCase().includes(q) ||
        item.legalGrounding.rules.toLowerCase().includes(q) ||
        item.conclusion.toLowerCase().includes(q) ||
        item.integratedProvisions.some((p: string) => p.toLowerCase().includes(q));

      const topic = HANDBOOK_TOPICS.find((t: HandbookTopic) => t.id === item.topicId);
      const matchesGroup = selectedGroup === 'all' || (topic && topic.group === selectedGroup);
      const matchesTopic = selectedTopicId === null || item.topicId === selectedTopicId;

      return matchesSearch && matchesGroup && matchesTopic;
    });
  }, [searchQuery, selectedGroup, selectedTopicId]);

  // Filter Dilemmas (Level D)
  const filteredDilemmas = useMemo(() => {
    return PROCUREMENT_DILEMMAS.filter((item: ProcurementDilemma) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        item.question.toLowerCase().includes(q) ||
        item.scenario.toLowerCase().includes(q) ||
        item.verdict.toLowerCase().includes(q) ||
        item.ppmoPprcPrecedent.toLowerCase().includes(q) ||
        item.legalClauses.some((clause: string) => clause.toLowerCase().includes(q));

      return matchesSearch;
    });
  }, [searchQuery]);

  // Filter Comparative Matrices
  const filteredComparative = useMemo(() => {
    return COMPARATIVE_ANALYSES.filter((item: ComparativeAnalysis) => {
      const q = searchQuery.toLowerCase();
      return searchQuery === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.legalBasis.toLowerCase().includes(q) ||
        item.keyTakeaway.toLowerCase().includes(q) ||
        item.parameters.some((param: string) => param.toLowerCase().includes(q));
    });
  }, [searchQuery]);

  // Filter Fact Rows
  const filterFactRows = (rows: MasterFactRow[]) => {
    return rows.filter((r: MasterFactRow) => {
      const q = searchQuery.toLowerCase();
      return searchQuery === '' ||
        r.topic.toLowerCase().includes(q) ||
        r.matter.toLowerCase().includes(q) ||
        r.limitOrValue.toLowerCase().includes(q) ||
        r.legalRef.toLowerCase().includes(q) ||
        (r.remarks && r.remarks.toLowerCase().includes(q));
    });
  };

  const filteredTimelines = useMemo(() => filterFactRows(MASTER_TIMELINES_TABLE), [searchQuery]);
  const filteredLimits = useMemo(() => filterFactRows(MASTER_FINANCIAL_TABLE), [searchQuery]);
  const filteredPercentages = useMemo(() => filterFactRows(MASTER_PERCENTAGES_TABLE), [searchQuery]);
  const filteredAuthorities = useMemo(() => filterFactRows(MASTER_AUTHORITIES_TABLE), [searchQuery]);

  // Filter Topics
  const filteredTopics = useMemo(() => {
    return HANDBOOK_TOPICS.filter((t: HandbookTopic) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        t.title.toLowerCase().includes(q) ||
        t.actSections.toLowerCase().includes(q) ||
        t.ruleSections.toLowerCase().includes(q) ||
        t.coreSummary.toLowerCase().includes(q);
      const matchesGroup = selectedGroup === 'all' || t.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchQuery, selectedGroup]);

  const totalCount = VERY_SHORT_QA.length + SHORT_QA.length + LONG_QA.length + PROCUREMENT_DILEMMAS.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-16">

      {/* 1. HERO BANNER - Height reduced by 25% with right-side blended del_new.webp */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/80 pointer-events-none" />

        {/* Right side del_new.webp seamlessly blended on the left with banner colors */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[50%] md:w-[44%] lg:w-[38%] overflow-hidden select-none"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.15) 15%, rgba(0, 0, 0, 0.85) 50%, black 85%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.15) 15%, rgba(0, 0, 0, 0.85) 50%, black 85%)",
          }}
          aria-hidden="true"
        >
          <img
            src={delNewImage}
            alt="सार्वजनिक खरिद समस्या समाधान"
            className="h-full w-full object-cover object-right"
          />
          {/* Soft left-edge blend overlay matching banner's indigo/blue/slate gradient */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-indigo-950 via-indigo-950/70 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent pointer-events-none sm:hidden" />
        </div>

        {/* Banner Content (25% reduced height: py-4 sm:py-5 px-5 sm:px-7) */}
        <div className="relative py-4 sm:py-5 px-5 sm:px-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 z-10 max-w-2xl lg:max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Scale className="w-3.5 h-3.5" />
              सार्वजनिक खरिद प्रश्नोत्तर सङ्ग्रह
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              सार्वजनिक खरिद कानूनी प्रश्नोत्तर तथा समस्या समाधान
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl lg:max-w-2xl">
              सार्वजनिक खरिद ऐन, २०६३ (संशोधनसहित), खरिद नियमावली, २०६४ (१६औं संशोधनसहित), PPMO राय, PPRC पुनरावलोकन नजिरहरू तथा विषयगत क्षेत्र।
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-xs text-slate-300">
              <span className="px-2.5 py-0.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" /> ५४ विषयगत क्षेत्र
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> १६औं संशोधन २०८१ एकीकृत
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> ३ तहका प्रश्नोत्तर + व्यवहारिक केस
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" /> तथ्य सारणी तथा म्याट्रिक्स
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & THEMATIC GROUP FILTER BAR */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="दफा, नियम, खरिद विषय, म्याद, धरौटी, भेरिएसन, कालोसूची, वा शब्दावली खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded px-1.5 py-0.5"
              >
                खाली गर्नुहोस्
              </button>
            )}
          </div>

          <div className="w-full md:w-72">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setSelectedTopicId(null);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {thematicGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Topic filter indicator if topic is selected */}
        {selectedTopicId !== null && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
            <span className="font-semibold">
              चयनित विषय #{HANDBOOK_TOPICS.find((t: HandbookTopic) => t.id === selectedTopicId)?.number}: {HANDBOOK_TOPICS.find((t: HandbookTopic) => t.id === selectedTopicId)?.title}
            </span>
            <button
              onClick={() => setSelectedTopicId(null)}
              className="underline text-blue-600 hover:text-blue-800 ml-2"
            >
              सबै विषय देखाउनुहोस्
            </button>
          </div>
        )}
      </div>

      {/* 3. PRIMARY NAVIGATION TABS */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'all' ? 'bg-white text-blue-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Layers className="w-4 h-4 text-blue-600" /> सबै (All)
        </button>

        <button
          onClick={() => setActiveTab('level-a')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'level-a' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Clock className="w-4 h-4 text-emerald-600" /> तह १: अति छोटो ({filteredLevelA.length})
        </button>

        <button
          onClick={() => setActiveTab('level-b')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'level-b' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <FileText className="w-4 h-4 text-indigo-600" /> तह २: प्रक्रियागत ({filteredLevelB.length})
        </button>

        <button
          onClick={() => setActiveTab('level-c')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'level-c' ? 'bg-white text-purple-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Scale className="w-4 h-4 text-purple-600" /> तह ३: लामो ९-चरण ({filteredLevelC.length})
        </button>

        <button
          onClick={() => setActiveTab('case-studies')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'case-studies' ? 'bg-white text-amber-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" /> व्यवहारिक केस / अन्योल ({filteredDilemmas.length})
        </button>

        <button
          onClick={() => setActiveTab('comparative')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'comparative' ? 'bg-white text-rose-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <GitCompare className="w-4 h-4 text-rose-600" /> तुलनात्मक विश्लेषण ({COMPARATIVE_ANALYSES.length})
        </button>

        <button
          onClick={() => setActiveTab('fact-tables')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'fact-tables' ? 'bg-white text-cyan-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-600" /> तथ्य सारणी
        </button>

        <button
          onClick={() => setActiveTab('topics-directory')}
          className={`px-3 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${activeTab === 'topics-directory' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Bookmark className="w-4 h-4 text-slate-700" /> ५४ विषय सूची
        </button>
      </div>

      {/* 4. MAIN CONTENT AREA BASED ON TAB */}

      {/* TAB: TOPICS DIRECTORY */}
      {activeTab === 'topics-directory' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">सार्वजनिक खरिदका ५४ विषयगत क्षेत्र (54 Subject Areas Directory)</p>
              <p className="text-blue-800 text-xs mt-1">
                सार्वजनिक खरिद ऐन, २०६३ र नियमावली, २०६४ का सबै व्यवस्थाहरूलाई तलका ५४ विषयगत समूहमा व्यवस्थित गरिएको छ। कुनै पनि शीर्षकमा क्लिक गरी सम्बन्धित प्रश्नोत्तर सिधै हेर्न सक्नुहुन्छ।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTopics.map((topic: HandbookTopic) => (
              <div
                key={topic.id}
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setActiveTab('all');
                }}
                className={`p-4 rounded-xl border transition cursor-pointer text-left ${selectedTopicId === topic.id
                  ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                    #{topic.number}
                  </span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-medium truncate max-w-[180px]">
                    {topic.groupTitle}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-2 line-clamp-2">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {topic.coreSummary}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">ऐन:</span>
                    <span className="text-slate-800 truncate">{topic.actSections}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">नियमावली:</span>
                    <span className="text-slate-800 truncate">{topic.ruleSections}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-blue-600 font-medium">
                  <span>प्रश्नोत्तर हेर्नुहोस्</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MASTER FACT TABLES */}
      {activeTab === 'fact-tables' && (
        <div className="space-y-4">
          <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
            <button
              onClick={() => setFactSubTab('timelines')}
              className={`px-3 py-1.5 rounded-lg transition ${factSubTab === 'timelines' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              १. समयसीमा तथा म्यादहरू ({filteredTimelines.length})
            </button>
            <button
              onClick={() => setFactSubTab('limits')}
              className={`px-3 py-1.5 rounded-lg transition ${factSubTab === 'limits' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              २. आर्थिक सीमा तथा थ्रेसहोल्ड ({filteredLimits.length})
            </button>
            <button
              onClick={() => setFactSubTab('percentages')}
              className={`px-3 py-1.5 rounded-lg transition ${factSubTab === 'percentages' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              ३. प्रतिशत (जमानत/पेश्की/भेरिएसन/LD) ({filteredPercentages.length})
            </button>
            <button
              onClick={() => setFactSubTab('authorities')}
              className={`px-3 py-1.5 rounded-lg transition ${factSubTab === 'authorities' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              ४. स्वीकृति अधिकार तथा पदाधिकारी ({filteredAuthorities.length})
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-12">क्र.सं.</th>
                    <th className="py-3 px-4">विषय तथा कानूनी सन्दर्भ</th>
                    <th className="py-3 px-4">तोकिएको मान / व्यवस्था (Value/Rule)</th>
                    <th className="py-3 px-4">कानूनी आधार (Act / Rules)</th>
                    <th className="py-3 px-4">विशिष्ट सर्त / कैफियत (Remarks)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {factSubTab === 'timelines' && filteredTimelines.map((row: MasterFactRow, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.matter}</td>
                      <td className="py-3 px-4 font-bold text-cyan-800 bg-cyan-50/50 rounded">{row.limitOrValue}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{row.legalRef}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{row.remarks || '-'}</td>
                    </tr>
                  ))}
                  {factSubTab === 'limits' && filteredLimits.map((row: MasterFactRow, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.matter}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800 bg-emerald-50/50 rounded">{row.limitOrValue}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{row.legalRef}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{row.remarks || '-'}</td>
                    </tr>
                  ))}
                  {factSubTab === 'percentages' && filteredPercentages.map((row: MasterFactRow, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.matter}</td>
                      <td className="py-3 px-4 font-bold text-purple-800 bg-purple-50/50 rounded">{row.limitOrValue}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{row.legalRef}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{row.remarks || '-'}</td>
                    </tr>
                  ))}
                  {factSubTab === 'authorities' && filteredAuthorities.map((row: MasterFactRow, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.matter}</td>
                      <td className="py-3 px-4 font-bold text-amber-800 bg-amber-50/50 rounded">{row.limitOrValue}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{row.legalRef}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{row.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: COMPARATIVE ANALYSIS MATRICES */}
      {activeTab === 'comparative' && (
        <div className="space-y-6">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-900 flex items-start gap-3">
            <Scale className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">सार्वजनिक खरिद कानूनी तुलनात्मक विश्लेषण म्याट्रिक्स</p>
              <p className="text-rose-800 text-xs mt-1">
                प्रायः अन्योल हुने र परीक्षा वा कार्यक्षेत्रमा सूक्ष्म भिन्नता छुट्याउनुपर्ने प्रमुख खरिद अवधारणाहरूको आमनेसामने (Side-by-Side) कानूनी तुलना।
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {filteredComparative.map((matrix: ComparativeAnalysis) => (
              <div key={matrix.id} className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <h3 className="font-bold text-base text-white">{matrix.title}</h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">आधार: {matrix.legalBasis}</p>
                  </div>
                  <div className="text-xs text-slate-300">
                    {matrix.description}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4 w-1/4">तुलनाको आधार (Parameter)</th>
                        {matrix.columns.map((col, cIdx) => (
                          <th key={cIdx} className={`py-3 px-4 ${cIdx === 0 ? 'text-blue-900 bg-blue-50/40' : 'text-emerald-900 bg-emerald-50/40'}`}>
                            {col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matrix.parameters.map((param: string, pIdx: number) => (
                        <tr key={pIdx} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-semibold text-slate-800 bg-slate-50/30">{param}</td>
                          {matrix.columns.map((col, cIdx) => (
                            <td key={cIdx} className="py-3 px-4 text-slate-700 leading-relaxed">
                              {col.values[pIdx] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {matrix.keyTakeaway && (
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-700 font-medium">
                    <span className="font-bold text-blue-900">मुख्य कानूनी निष्कर्ष: </span>
                    {matrix.keyTakeaway}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LEVEL A - VERY SHORT FACTUAL Q&A */}
      {(activeTab === 'all' || activeTab === 'level-a') && filteredLevelA.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  तह १: अति छोटो वस्तुगत तथा संख्यात्मक कानूनी प्रश्नोत्तर
                </h2>
                <p className="text-xs text-slate-500">
                  रकम, दिन, प्रतिशत, म्याद, निर्णय गर्ने अधिकारी र वस्तुनिष्ठ तथ्यगत उत्तरहरू
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              {filteredLevelA.length} प्रश्नोत्तर
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLevelA.map((item: VeryShortQA) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      #{item.id} | विषय #{item.topicNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                      तह १ (वस्तुगत)
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.question}
                  </h3>

                  <div className="mt-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {item.answer}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong className="text-slate-700">ऐन:</strong> {item.actRef}</span>
                    <span>|</span>
                    <span><strong className="text-slate-700">नियमावली:</strong> {item.ruleRef}</span>
                  </div>
                  {item.keyMetric && (
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded text-[10px]">
                      {item.keyMetric}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LEVEL B - SHORT PROCEDURAL / EXPLANATORY Q&A */}
      {(activeTab === 'all' || activeTab === 'level-b') && filteredLevelB.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  तह २: छोटो प्रक्रियागत तथा कानूनी प्रावधान विश्लेषण प्रश्नोत्तर
                </h2>
                <p className="text-xs text-slate-500">
                  उद्देश्य, पूर्वसर्त, चरणबद्ध कार्यविधि, संलग्न गर्नुपर्ने कागजात तथा कानूनी परिणाम
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              {filteredLevelB.length} प्रश्नोत्तर
            </span>
          </div>

          <div className="space-y-4">
            {filteredLevelB.map((item: ShortQA) => {
              const isExpanded = expandedItems[item.id] ?? true;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-4 bg-slate-50/70 cursor-pointer flex items-start justify-between gap-3 border-b border-slate-100"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                          #{item.id} | विषय #{item.topicNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-medium">
                          तह २ (प्रक्रियागत)
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">
                        {item.question}
                      </h3>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 mt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-800">

                      {/* Purpose & Significance */}
                      <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-blue-950">
                        <span className="font-bold">उद्देश्य तथा कानूनी महत्त्व: </span>
                        {item.purposeAndSignificance}
                      </div>

                      {/* Step-by-Step Points */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-indigo-600" /> प्रमुख कानूनी प्रावधान तथा कार्यप्रवाह बुँदाहरू:
                        </h4>
                        <div className="space-y-1.5 pt-1">
                          {item.keyPointsOrSteps.map((step: string, sIdx: number) => (
                            <div key={sIdx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Authority & Impact/Caution */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
                          <span className="font-bold text-indigo-900">जिम्मेवार अधिकारी / निकाय: </span>
                          <span className="text-indigo-950">{item.responsibleAuthority}</span>
                        </div>
                        <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg">
                          <span className="font-bold text-amber-900">कानूनी परिणाम / सावधानी: </span>
                          <span className="text-amber-950">{item.impactOrCaution}</span>
                        </div>
                      </div>

                      {/* Legal Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
                        <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span><strong className="text-slate-800">कानूनी आधार:</strong> {item.legalBasis}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: LEVEL C - LONG 9-STEP ANALYTICAL LIFECYCLE Q&A */}
      {(activeTab === 'all' || activeTab === 'level-c') && filteredLevelC.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <Scale className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  तह ३: लामो विश्लेषणात्मक तथा ९-चरण जीवनचक्र प्रश्नोत्तर (Comprehensive Lifecycle)
                </h2>
                <p className="text-xs text-slate-500">
                  परिचय, कानूनी आधार, कार्यप्रवाह, अधिकारप्राप्त निकाय, सीमा, अपवाद, बेरुजु जोखिम र निष्कर्षको पूर्ण खाका
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
              {filteredLevelC.length} पूर्ण प्रश्नोत्तर
            </span>
          </div>

          <div className="space-y-6">
            {filteredLevelC.map((item: LongQA) => {
              const isExpanded = expandedItems[item.id] ?? true;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white cursor-pointer flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-white/20 text-white rounded">
                          #{item.id} | विषय #{item.topicNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-500/30 text-purple-200 border border-purple-400/40 rounded-full font-medium">
                          ९-चरण पूर्ण जीवनचक्र विश्लेषण
                        </span>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-white">
                        {item.question}
                      </h3>
                    </div>
                    <button className="text-purple-200 hover:text-white mt-1">
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-800">

                      {/* Step 1: Introduction */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-xs text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-purple-600" /> १. परिचय तथा कानूनी पृष्ठभूमि (Introduction)
                        </h4>
                        <p className="text-slate-700 leading-relaxed">{item.introduction}</p>
                      </div>

                      {/* Step 2 & 3: Legal Basis & Integrated Provisions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                          <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Scale className="w-4 h-4 text-blue-600" /> २. कानूनी आधार (Legal Foundations)
                          </h4>
                          <div className="space-y-1 text-xs text-blue-950">
                            <p><strong>ऐन:</strong> {item.legalGrounding.act}</p>
                            <p><strong>नियमावली:</strong> {item.legalGrounding.rules}</p>
                            {item.legalGrounding.amendments && (
                              <p className="text-emerald-700 font-semibold">
                                <strong>संशोधन:</strong> {item.legalGrounding.amendments}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                          <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ३. एकीकृत कानूनी व्यवस्था (Harmonized Rules)
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-emerald-950">
                            {item.integratedProvisions.map((prov: string, pIdx: number) => (
                              <li key={pIdx}>{prov}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Step 4: Step-by-Step Workflow */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-indigo-600" /> ४. चरणबद्ध कार्यप्रवाह (Step-by-Step Lifecycle Workflow)
                        </h4>
                        <div className="space-y-2">
                          {item.workflowSteps.map((ws, sIdx: number) => (
                            <div key={sIdx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                                    {ws.stepNo}
                                  </span>
                                  {ws.title}
                                </span>
                                {ws.timeline && (
                                  <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                    म्याद: {ws.timeline}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-700 text-xs pl-7 leading-relaxed">{ws.detail}</p>
                              <div className="text-[11px] text-slate-500 pl-7 pt-1 font-medium">
                                जिम्मेवार: {ws.authority}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step 5 & 6: Authority & Conditions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200">
                          <h4 className="font-bold text-xs text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" /> ५. जिम्मेवार तथा अधिकारप्राप्त निकाय
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-indigo-950">
                            {item.responsibleAuthorities.map((auth: string, aIdx: number) => (
                              <li key={aIdx}>{auth}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-cyan-50/60 rounded-xl border border-cyan-200">
                          <h4 className="font-bold text-xs text-cyan-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-cyan-600" /> ६. कानूनी सीमा तथा पूर्वसर्तहरू (Limits & Thresholds)
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-cyan-950">
                            {item.limitsAndThresholds.map((lim: string, lIdx: number) => (
                              <li key={lIdx}>{lim}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Step 7 & 8: Exceptions & Audit Risks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                          <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-amber-600" /> ७. अपवाद तथा विशेष छुटहरू (Exceptions)
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-amber-950">
                            {item.specialConditionsAndExceptions.map((exc: string, eIdx: number) => (
                              <li key={eIdx}>{exc}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
                          <h4 className="font-bold text-xs text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" /> ८. कानूनी जोखिम, बेरुजु तथा सतर्कता (Audit Risks)
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-rose-950">
                            {item.safeguardsAndAuditRisks.map((risk: string, rIdx: number) => (
                              <li key={rIdx}>{risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Step 9: Conclusion */}
                      <div className="p-4 bg-slate-900 text-white rounded-xl">
                        <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ९. रणनीतिक कानूनी निष्कर्ष (Strategic Conclusion)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{item.conclusion}</p>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: LEVEL D - PRACTICAL CASE STUDIES / DILEMMAS */}
      {(activeTab === 'all' || activeTab === 'case-studies') && filteredDilemmas.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  तह ४: व्यवहारिक केस स्टडी, कानूनी अन्योल तथा पुनरावलोकन नजिरहरू
                </h2>
                <p className="text-xs text-slate-500">
                  घटना विवरण, स्पष्ट कानूनी फैसला, गर्नुपर्ने प्रक्रिया, नजिर र टिप्पणी/निर्णयको मस्यौदा
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              {filteredDilemmas.length} केसहरू
            </span>
          </div>

          <div className="space-y-6">
            {filteredDilemmas.map((item: ProcurementDilemma) => {
              const isExpanded = expandedItems[item.id] ?? true;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-4 bg-amber-50/50 cursor-pointer flex items-start justify-between gap-3 border-b border-amber-100"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded font-bold">
                          केस #{item.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-white text-slate-700 border border-slate-200 rounded-full font-medium">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">
                        {item.question}
                      </h3>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 mt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-800">

                      {/* Scenario */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-slate-500" /> घटना सन्दर्भ (Practical Scenario)
                        </h4>
                        <p className="text-slate-700 leading-relaxed">{item.scenario}</p>
                      </div>

                      {/* Actionable Verdict */}
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> स्पष्ट कानूनी फैसला / समाधान (Actionable Verdict)
                        </h4>
                        <p className="text-emerald-950 font-medium leading-relaxed">{item.verdict}</p>
                      </div>

                      {/* Step-by-Step Procedure */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-indigo-600" /> गर्नुपर्ने कदमहरू (Step-by-Step Action Plan)
                        </h4>
                        <div className="space-y-1.5 text-slate-700">
                          {item.stepByStep.map((st: string, sIdx: number) => (
                            <div key={sIdx} className="leading-relaxed">{st}</div>
                          ))}
                        </div>
                      </div>

                      {/* Precedents & Fatal Audit Mistakes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                          <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Scale className="w-4 h-4 text-blue-600" /> PPMO राय तथा PPRC पुनरावलोकन नजिर
                          </h4>
                          <p className="text-xs text-blue-950 leading-relaxed">{item.ppmoPprcPrecedent}</p>
                        </div>

                        <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
                          <h4 className="font-bold text-xs text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600" /> कहिल्यै गर्न नहुने गल्ती (Fatal Audit Mistakes)
                          </h4>
                          <p className="text-xs text-rose-950 leading-relaxed">{item.doNotDo}</p>
                        </div>
                      </div>

                      {/* Draft Minute / Note Snippet with Copy Button */}
                      <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-emerald-400" /> टिप्पणी तथा निर्णयको मस्यौदा (Ready Minute Note)
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.minuteSnippet, item.id)}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs flex items-center gap-1.5 transition"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> कपि भयो!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> कपि गर्नुहोस्
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                          {item.minuteSnippet}
                        </pre>
                      </div>

                      {/* Legal Footer */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <div className="flex flex-wrap gap-2">
                          {item.legalClauses.map((clause: string, cIdx: number) => (
                            <span key={cIdx} className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {clause}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NO RESULTS FOUND STATE */}
      {filteredLevelA.length === 0 && filteredLevelB.length === 0 && filteredLevelC.length === 0 && filteredDilemmas.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">कुनै नतिजा फेला परेन</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            तपाईंले खोज्नुभएको शब्द वा छनोट गर्नुभएको समूहमा कुनै प्रश्नोत्तर भेटिएन। कृपया अर्को शब्द खोजी हेर्नुहोस् वा फिल्टर हटाउनुहोस्।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGroup('all');
              setSelectedTopicId(null);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            सबै फिल्टर खाली गर्नुहोस्
          </button>
        </div>
      )}

    </div>
  );
};

export default ProcurementDilemmaSolverView;
