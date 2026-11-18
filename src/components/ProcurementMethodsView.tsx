import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Scale, 
  X,
  ExternalLink,
  ChevronDown,
  Building,
  HelpCircle,
  Globe,
  Ban
} from 'lucide-react';
import { PROCUREMENT_METHODS } from '../data/procurementData';
import { ProcurementMethod, ProcurementType } from '../types/procurement';
import { GuideSourceNotice } from './GuideSourceNotice';
import {
  getProhibitionsForProvision,
  getExceptionsForProvision,
} from '../data/restrictionsExceptionsData';

interface ProcurementMethodsViewProps {
  initialSelectedMethodId?: string | null;
  onClearInitialMethod?: () => void;
  onNavigateToIcb?: () => void;
}

export const ProcurementMethodsView: React.FC<ProcurementMethodsViewProps> = ({
  initialSelectedMethodId,
  onClearInitialMethod,
  onNavigateToIcb,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProcurementType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMethodId, setExpandedMethodId] = useState<string | null>(() => {
    return initialSelectedMethodId ?? null;
  });

  // If initial prop changes
  React.useEffect(() => {
    if (initialSelectedMethodId) {
      setExpandedMethodId(initialSelectedMethodId);
    }
  }, [initialSelectedMethodId]);

  const filteredMethods = PROCUREMENT_METHODS.filter((m) => {
    if (selectedCategory !== 'all' && !m.category.includes(selectedCategory)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.nameNepali.toLowerCase().includes(q) ||
        m.nameEnglish.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.legalActSection.toLowerCase().includes(q) ||
        m.legalRuleSection.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleMethod = (method: ProcurementMethod) => {
    if (method.id === 'icb-goods' || method.id === 'icb-works') {
      onNavigateToIcb?.();
      return;
    }
    setExpandedMethodId((prev) => (prev === method.id ? null : method.id));
    if (onClearInitialMethod) onClearInitialMethod();
  };

  return (
    <div className="space-y-6">
      {/* ── Sticky Inline Search Bar ───────────────────────────────── */}
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 bg-[#f0f4fa]/95 backdrop-blur-sm border-b border-slate-200">
        <div className="relative max-w-2xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="खरिद विधि, दफा वा विषय खोज्नुहोस्... (उदा: NCB, सोझै खरिद, दफा ११)"
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-slate-900 placeholder:text-slate-400"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="खोज मेटाउनुहोस्"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-slate-500 mt-1 ml-1">
            {filteredMethods.length === 0
              ? '— कुनै विधि भेटिएन'
              : `${filteredMethods.length} वटा विधि भेटियो`}
          </p>
        )}
      </div>

      {/* Title & Introduction */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-700 uppercase tracking-wide">
            <Layers className="w-4 h-4" />
            <span>सार्वजनिक खरिद ऐन दफा ८ र नियमावली</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            खरिदका सम्पूर्ण कानूनी विधिहरू तथा प्रक्रियागत विवरण
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            सार्वजनिक निकायले निर्माण, मालसामान वा सेवा खरिद गर्दा मूल्य, जटिलता र आवश्यकताका आधारमा अवलम्बन गर्नुपर्ने आधिकारिक खरिद विधिहरूको विस्तृत विवरण, सीमा, चरणहरू र कागजातहरू।
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          सबै खरिद विधिहरू ({PROCUREMENT_METHODS.length})
        </button>
        <button
          onClick={() => setSelectedCategory('works')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'works'
              ? 'bg-blue-700 text-white font-semibold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          निर्माण कार्य (Works)
        </button>
        <button
          onClick={() => setSelectedCategory('goods')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'goods'
              ? 'bg-blue-700 text-white font-semibold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          मालसामान आपूर्ति (Goods)
        </button>
        <button
          onClick={() => setSelectedCategory('consulting')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'consulting'
              ? 'bg-blue-700 text-white font-semibold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          परामर्श सेवा (Consulting)
        </button>
        <button
          onClick={() => setSelectedCategory('services')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'services'
              ? 'bg-blue-700 text-white font-semibold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          गैर-परामर्श सेवाहरू (Services)
        </button>
      </div>

      {/* Grid of Methods */}
      {/* ── Accordion Method Cards ──────────────────────────────────── */}
      <div className="space-y-3">
        {filteredMethods.map((method) => {
          const isExpanded = expandedMethodId === method.id;
          const isIcb = method.id === 'icb-goods' || method.id === 'icb-works';
          const methodProhibitions = [
            ...getProhibitionsForProvision(method.legalActSection, 'act'),
            ...getProhibitionsForProvision(method.legalRuleSection, 'rules'),
          ];
          const methodExceptions = [
            ...getExceptionsForProvision(method.legalActSection, 'act'),
            ...getExceptionsForProvision(method.legalRuleSection, 'rules'),
          ];
          const uniqueProhibitions = Array.from(new Map(methodProhibitions.map((p) => [p.id, p])).values());
          const uniqueExceptions = Array.from(new Map(methodExceptions.map((e) => [e.id, e])).values());

          return (
            <div
              key={method.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-blue-300 shadow-md'
                  : 'border-slate-200 hover:border-red-300 hover:shadow-sm'
              }`}
            >
              {/* ── Card Header (always visible, click to toggle) ── */}
              <button
                type="button"
                onClick={() => toggleMethod(method)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 group cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-sm shrink-0">
                      {method.badgeTag}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {method.legalActSection}
                    </span>
                    {isIcb && (
                      <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-sm">
                        ICB Hub →
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold transition-colors ${isExpanded ? 'text-blue-800' : 'text-slate-900 group-hover:text-red-700'}`}>
                    {method.nameNepali}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{method.nameEnglish}</p>

                  {/* Summary — always visible, no clamp when expanded */}
                  <p className={`text-xs text-slate-600 leading-relaxed mt-1.5 ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {method.summary}
                  </p>

                  {/* Quick stats row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-600">
                    <span><span className="text-slate-400">सीमा:</span> <span className="font-medium text-slate-800">{method.thresholdText}</span></span>
                    <span><span className="text-slate-400">म्याद:</span> <span className="font-medium text-slate-800">{method.noticePeriodDays}</span></span>
                    <span><span className="text-slate-400">जमानत:</span> <span className="font-medium text-slate-800">{method.performanceSecurityRate}</span></span>
                  </div>
                </div>

                {/* Expand/collapse chevron */}
                <div className={`shrink-0 mt-1 p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-600'}`}>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* ── Expanded detail body ───────────────────────────── */}
              {isExpanded && !isIcb && (
                <div className="border-t border-slate-200 px-4 sm:px-5 pb-5 pt-4 space-y-5 text-xs sm:text-sm">
                  <GuideSourceNotice />

                  {/* Summary & metrics */}
                  <div className="bg-red-50/40 p-4 rounded-xl border border-red-100">
                    <p className="text-slate-800 leading-relaxed font-medium">{method.summary}</p>
                    <div className="mt-3 pt-3 border-t border-red-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">लागू हुने आर्थिक सीमा</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{method.thresholdText}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">सूचना प्रकाशन म्याद</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{method.noticePeriodDays}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">स्वीकृत गर्ने अख्तियारी</span>
                        <span className="font-bold text-slate-900 block mt-0.5">{method.approvalAuthority}</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Conditions */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <span>प्रमुख कानूनी व्यवस्थाहरू:</span>
                    </h4>
                    <div className="space-y-2">
                      {method.keyConditions.map((cond, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 text-slate-700">
                          <span className="text-red-600 font-bold shrink-0">✓</span>
                          <span>{cond}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prohibitions & Exceptions */}
                  {(uniqueProhibitions.length > 0 || uniqueExceptions.length > 0) && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-600" />
                        <span>यस विधिसँग सम्बन्धित कानूनी बन्देज तथा अपवादहरू:</span>
                      </h4>
                      {uniqueProhibitions.length > 0 && (
                        <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-red-800">
                            <Ban className="w-3.5 h-3.5 text-red-600" />
                            <span>कानूनी बन्देजहरू:</span>
                          </div>
                          {uniqueProhibitions.map((p) => (
                            <div key={p.id} className="text-xs text-red-950 pl-3">• {p.prohibitionText}</div>
                          ))}
                        </div>
                      )}
                      {uniqueExceptions.length > 0 && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                            <Scale className="w-3.5 h-3.5 text-blue-600" />
                            <span>विशेष अपवाद तथा छुटहरू:</span>
                          </div>
                          {uniqueExceptions.map((exc) => (
                            <div key={exc.id} className="flex items-start justify-between gap-2 text-xs pl-3">
                              <span className="text-slate-800">• <strong>{exc.subjectOrSection}:</strong> {exc.exceptionText}</span>
                              <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${exc.outcome === 'मिल्ने' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{exc.outcomeLabel}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Steps */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-700" />
                      <span>अपनाउनुपर्ने पूर्ण प्रक्रियागत चरणहरू:</span>
                    </h4>
                    <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                      {method.steps.map((st) => (
                        <div key={st.stepNo} className="flex items-start gap-3 relative">
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 z-10">
                            {st.stepNo}
                          </div>
                          <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{st.title}</h5>
                              <span className="text-[11px] font-mono text-red-700 font-semibold bg-red-50 px-1.5 py-0.5 rounded-sm">{st.legalRef}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{st.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>आवश्यक कागजातहरूको चेकलिस्ट:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {method.requiredDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 text-slate-800 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cautions */}
                  {method.cautions.length > 0 && (
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>विशेष ध्यान दिनुपर्ने कानूनी बन्देजहरू:</span>
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        {method.cautions.map((c, idx) => <li key={idx}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Collapse button */}
                  <button
                    type="button"
                    onClick={() => setExpandedMethodId(null)}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                    <span>संक्षिप्त गर्नुहोस्</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMethods.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800">कुनै विधि भेटिएन</h4>
          <p className="text-xs text-slate-500 mt-1">खोज शब्द वा फिल्टर परिवर्तन गर्नुहोस्।</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg transition-colors">
            फिल्टर रिसेट गर्नुहोस्
          </button>
        </div>
      )}
    </div>
  );
};

