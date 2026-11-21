import React, { useState, useMemo } from 'react';
import { Calculator, X, ShieldAlert, CheckCircle2, Calendar } from 'lucide-react';

interface SimulationCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationCalculatorModal: React.FC<SimulationCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'security' | 'arithmetic' | 'timeline'>('security');

  // Performance Security inputs
  const [estimateStr, setEstimateStr] = useState<string>('10000000'); // 1 crore
  const [bidStr, setBidStr] = useState<string>('8000000'); // 80 lakh

  // Arithmetic inputs
  const [quantityStr, setQuantityStr] = useState<string>('150');
  const [unitRateStr, setUnitRateStr] = useState<string>('2400');
  const [quotedTotalStr, setQuotedTotalStr] = useState<string>('340000');

  // Timeline inputs
  const [noticeType, setNoticeType] = useState<'ncb-30' | 'ncb-15' | 'sq-15' | 'icb-45'>('ncb-30');
  const [procurementCostTier, setProcurementCostTier] = useState<'below10cr' | 'above10cr'>('below10cr');

  const securityAnalysis = useMemo(() => {
    const est = Number(estimateStr.replace(/,/g, '')) || 0;
    const bid = Number(bidStr.replace(/,/g, '')) || 0;
    if (est <= 0 || bid <= 0) return null;

    const diffPercent = ((est - bid) / est) * 100;
    const isBelow = diffPercent > 0;
    const regularSecurity = bid * 0.05;

    // Pre-2nd amendment calculation (for educational comparison):
    // If >15% below estimate: 0.85 * est - bid, then 50% of that
    const threshold = 0.85 * est;
    const preAmendmentAdditional = bid < threshold ? (threshold - bid) * 0.5 : 0;
    const preAmendmentTotal = regularSecurity + preAmendmentAdditional;

    // Current Law (PPA 2nd Amendment 2080 - Section 27(4)):
    // Only 5% of bid amount!
    const currentLawTotal = regularSecurity;

    return {
      est,
      bid,
      diffPercent,
      isBelow,
      regularSecurity,
      preAmendmentAdditional,
      preAmendmentTotal,
      currentLawTotal,
      isDeepDiscount: diffPercent > 15,
    };
  }, [estimateStr, bidStr]);

  const arithmeticAnalysis = useMemo(() => {
    const qty = Number(quantityStr.replace(/,/g, '')) || 0;
    const rate = Number(unitRateStr.replace(/,/g, '')) || 0;
    const quoted = Number(quotedTotalStr.replace(/,/g, '')) || 0;

    const correctTotal = qty * rate;
    const diff = quoted - correctTotal;
    const hasError = Math.abs(diff) > 0.01;

    return {
      qty,
      rate,
      quoted,
      correctTotal,
      diff,
      hasError,
    };
  }, [quantityStr, unitRateStr, quotedTotalStr]);

  const timelineAnalysis = useMemo(() => {
    let submissionDays = 30;
    let label = 'राष्ट्रिय खुला बोलपत्र (पहिलो पटक)';
    if (noticeType === 'ncb-15') {
      submissionDays = 15;
      label = 'राष्ट्रिय खुला बोलपत्र (पुनः आह्वान - दोस्रो पटक)';
    } else if (noticeType === 'sq-15') {
      submissionDays = 15;
      label = 'सिलबन्दी दरभाउपत्र (Sealed Quotation)';
    } else if (noticeType === 'icb-45') {
      submissionDays = 45;
      label = 'अन्तर्राष्ट्रिय खुला बोलपत्र (ICB)';
    }

    const validityDays = procurementCostTier === 'below10cr' ? 90 : 120;
    const guaranteeDays = validityDays + 30; // नियम ४२(३) अनुसार बोलपत्रको वैधता अवधिभन्दा ३० दिन बढी

    return {
      label,
      submissionDays,
      validityDays,
      guaranteeDays,
      intentionNoticeDays: 7, // ७ दिने आशयको सूचना
      reviewApplicationDays: 7, // ७ दिनभित्र पुनरावलोकन निवेदन
    };
  }, [noticeType, procurementCostTier]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">सार्वजनिक खरिद द्रुत क्याल्कुलेटर</h2>
              <p className="text-xs text-slate-500">अभ्यास तथा मूल्याङ्कन प्रयोजनका लागि हिसाब औजार</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            कार्यसम्पादन जमानत (Performance Security)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('arithmetic')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'arithmetic'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            अङ्कगणितीय त्रुटि (Arithmetic Correction)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'timeline'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            म्याद र दिन गणना (Procurement Days)
          </button>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    लागत अनुमान रकम (रुपैयाँमा)
                  </label>
                  <input
                    type="number"
                    value={estimateStr}
                    onChange={(e) => setEstimateStr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">उदा: रु. १,००,००,००० (१ करोड)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    कबोल रकम (रुपैयाँमा)
                  </label>
                  <input
                    type="number"
                    value={bidStr}
                    onChange={(e) => setBidStr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">उदा: रु. ८०,००,००० (८० लाख)</p>
                </div>
              </div>

              {securityAnalysis && (
                <div className="space-y-4">
                  {/* Summary Metrics */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                      <p className="text-[11px] text-slate-500">लागत अनुमानभन्दा फरक</p>
                      <p className={`text-base font-bold mt-1 ${securityAnalysis.diffPercent > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                        {securityAnalysis.diffPercent.toFixed(2)}% {securityAnalysis.isBelow ? 'घटी (Below)' : 'बढी (Above)'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-200">
                      <p className="text-[11px] text-emerald-800 font-semibold">हाल लागू जमानत (PPA २७(४))</p>
                      <p className="text-base font-bold text-emerald-900 mt-1">
                        रु. {securityAnalysis.currentLawTotal.toLocaleString('ne-NP')}
                      </p>
                      <p className="text-[10px] text-emerald-700 mt-0.5">कबोल अङ्कको ५%</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
                      <p className="text-[11px] text-slate-500">साविक व्यवस्था (दोस्रो संशोधनअघि)</p>
                      <p className="text-base font-bold text-slate-700 mt-1">
                        रु. {securityAnalysis.preAmendmentTotal.toLocaleString('ne-NP')}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {securityAnalysis.isDeepDiscount ? '५% + अतिरिक्त धरौटी' : '५% मात्र'}
                      </p>
                    </div>
                  </div>

                  {/* Educational Legal Note */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs leading-relaxed text-blue-950">
                    <p className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-blue-700" />
                      कानुनी तथ्य (सार्वजनिक खरिद ऐन दोस्रो संशोधन, २०८०):
                    </p>
                    सार्वजनिक खरिद (दोस्रो संशोधन) ऐन, २०८० मार्फत ऐनको दफा २७ को उपदफा (४) संशोधन भई
                    <strong> १५ प्रतिशतभन्दा बढी घटी कबोल गरेबापत लिइने अतिरिक्त कार्यसम्पादन जमानतको व्यवस्था हटाइएको छ।</strong> त्यसैले हाल जुनसुकै दरमा कबोल भए पनि केवल कबोल अङ्कको ५% मात्र कार्यसम्पादन जमानत माग गर्नुपर्दछ।
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'arithmetic' && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    परिमाण (Quantity)
                  </label>
                  <input
                    type="number"
                    value={quantityStr}
                    onChange={(e) => setQuantityStr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    एकाइ दर (Unit Rate)
                  </label>
                  <input
                    type="number"
                    value={unitRateStr}
                    onChange={(e) => setUnitRateStr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    फर्मले चढाएको जम्मा रकम (Quoted Total)
                  </label>
                  <input
                    type="number"
                    value={quotedTotalStr}
                    onChange={(e) => setQuotedTotalStr(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {arithmeticAnalysis && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <p className="text-xs text-slate-500">फर्मले लेखेको जम्मा रकम:</p>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        रु. {arithmeticAnalysis.quoted.toLocaleString('ne-NP')}
                      </p>
                    </div>
                    <div className={`rounded-xl p-4 border ${arithmeticAnalysis.hasError ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
                      <p className="text-xs font-semibold text-slate-700">हिसाब गर्दा हुनुपर्ने सही रकम (Qty × Rate):</p>
                      <p className="text-lg font-bold text-emerald-800 mt-1">
                        रु. {arithmeticAnalysis.correctTotal.toLocaleString('ne-NP')}
                      </p>
                      {arithmeticAnalysis.hasError && (
                        <p className="text-xs font-bold text-amber-800 mt-1">
                          अङ्कगणितीय त्रुटि: रु. {Math.abs(arithmeticAnalysis.diff).toLocaleString('ne-NP')} {arithmeticAnalysis.diff > 0 ? 'बढी लेखिएको' : 'घटी लेखिएको'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800">
                    <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      नियम ६३ अनुसार अङ्कगणितीय त्रुटि सच्याउने सिद्धान्त:
                    </p>
                    यदि एकाइ दर (Unit Rate) र परिमाण (Quantity) गुणन गर्दा आउने रकम र कुल अङ्कमा भिन्नता भएमा,
                    <strong> एकाइ दरलाई नै आधिकारिक मानिनेछ र कुल रकम सोहीबमोजिम सच्याइनेछ।</strong> (अक्षर र अङ्कमा दर फरक भएमा अक्षरमा लेखिएको दर ग्राह्य हुन्छ)।
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    खरिद विधि / सूचना प्रकार
                  </label>
                  <select
                    value={noticeType}
                    onChange={(e) => setNoticeType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="ncb-30">राष्ट्रिय खुला बोलपत्र (NCB - ३० दिन)</option>
                    <option value="ncb-15">राष्ट्रिय खुला बोलपत्र पुनः आह्वान (NCB - १५ दिन)</option>
                    <option value="sq-15">सिलबन्दी दरभाउपत्र (Sealed Quotation - १५ दिन)</option>
                    <option value="icb-45">अन्तर्राष्ट्रिय खुला बोलपत्र (ICB - ४५ दिन)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    लागत अनुमान सीमा (बोलपत्र मान्यता अवधि)
                  </label>
                  <select
                    value={procurementCostTier}
                    onChange={(e) => setProcurementCostTier(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="below10cr">रु. १० करोडसम्म (९० दिनको बोलपत्र वैधता)</option>
                    <option value="above10cr">रु. १० करोडभन्दा माथि (१२० दिनको बोलपत्र वैधता)</option>
                  </select>
                </div>
              </div>

              {timelineAnalysis && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3 text-center">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                      <Calendar className="h-5 w-5 mx-auto text-[#123f6d] mb-1" />
                      <p className="text-[11px] text-slate-500">बोलपत्र दाखिला म्याद</p>
                      <p className="text-xl font-bold text-slate-900 mt-0.5">{timelineAnalysis.submissionDays} दिन</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                      <ShieldAlert className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                      <p className="text-[11px] text-slate-500">बोलपत्र वैधता अवधि</p>
                      <p className="text-xl font-bold text-slate-900 mt-0.5">{timelineAnalysis.validityDays} दिन</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                      <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                      <p className="text-[11px] text-emerald-800 font-semibold">बोलपत्र जमानत न्यूनतम म्याद</p>
                      <p className="text-xl font-bold text-emerald-900 mt-0.5">{timelineAnalysis.guaranteeDays} दिन</p>
                      <p className="text-[10px] text-emerald-700 mt-0.5">{timelineAnalysis.validityDays} + ३० दिन</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 space-y-1">
                    <p><strong>आशयको सूचना (Notice of Intention):</strong> नियम ७४ अनुसार ७ दिनको सूचना दिनुपर्नेछ।</p>
                    <p><strong>पुनरावलोकन निवेदन (Review Request):</strong> ऐन दफा ४७ अनुसार आशयको सूचना प्रकाशित भएको ७ दिनभित्र कार्यालय प्रमुखसमक्ष उजुरी दिनुपर्दछ।</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#123f6d] px-4 py-2 text-xs font-bold text-white hover:bg-[#174f7e]"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
