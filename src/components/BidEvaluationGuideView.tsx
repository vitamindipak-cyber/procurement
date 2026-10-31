import React, { useMemo, useState } from 'react';
import evaluationImage from '../../evaluation.png';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileCheck2,
  FileText,
  Gavel,
  Info,
  Plus,
  Scale,
  Search,
  ShieldAlert,
  Target,
  Trash2,
  TrendingDown,
} from 'lucide-react';
import { formatNepaliCurrency } from '../utils/procurementUtils';
import {
  analyzeAdditionalPerformanceSecurity,
  analyzeMinorDeviation,
  parseAmount,
  simulateAverageBidding,
} from '../utils/bidEvaluationCalculators';
import {
  DEVIATION_MATRIX,
  EVALUATION_PRECEDENTS,
  EVALUATION_STEPS,
  type DeviationKind,
} from '../data/bidEvaluationGuideData';

interface BidEvaluationGuideViewProps {
  onNavigateToLaw?: () => void;
  onNavigateToChecklists?: () => void;
}

const evaluationLenses = [
  {
    title: 'प्राविधिक',
    question: 'प्रस्तावले चाहिएको वस्तु, काम वा सेवाको आवश्यकता पूरा गर्छ?',
    examples: 'स्पेसिफिकेसन, परिमाण, गुणस्तर, कार्यसम्पादन र प्रस्तावित प्राविधिक विचलन।',
    legalRef: 'नियम ६२',
    icon: Target,
    color: 'blue',
  },
  {
    title: 'व्यापारिक',
    question: 'प्रस्तावका व्यावसायिक शर्तहरू बोलपत्र कागजातसँग मिल्छन्?',
    examples: 'आपूर्ति/सम्पन्न अवधि, भुक्तानी, वारेन्टी, कार्यसम्पादन र सम्झौताका शर्त।',
    legalRef: 'नियम ६३',
    icon: FileCheck2,
    color: 'violet',
  },
  {
    title: 'आर्थिक',
    question: 'कागजातमा तोकिएको तरिकाले तुलना गर्दा मूल्य कति हुन्छ?',
    examples: 'कबोल रकम, छुट, कर र अनुमति दिइएका लागत समायोजन।',
    legalRef: 'नियम ६४',
    icon: Scale,
    color: 'emerald',
  },
];

const officeChecklist = [
  'मूल्याङ्कनका आधार र विधि बोलपत्र कागजातमै छन् र सबै प्रस्तावमा समान रूपमा प्रयोग गरिएका छन्।',
  'खोल्ने मुचुल्का, दर्ता विवरण र बोलपत्र परीक्षणका प्रमाण सुरक्षित छन्।',
  'प्राविधिक, व्यापारिक र आर्थिक निष्कर्ष तथा मूल्य समायोजनको आधार छुट्टाछुट्टै देखाइएको छ।',
  'अस्वीकृत बोलपत्रको कारण र छानिएको विधि प्रतिवेदनमा स्पष्ट छ।',
  'समितिको प्रतिवेदन, स्वीकृति निर्णय, आशयको सूचना र सम्झौतासम्बन्धी कागजात फाइलमा छन्।',
];

const recordsToKeep = [
  'बोलपत्र आह्वान सूचना, स्वीकृत बोलपत्र कागजात र लागू संशोधन/स्पष्टीकरण',
  'बोलपत्र दर्ता किताब, प्राप्ति समय र खोल्ने मुचुल्का',
  'प्रस्ताव, जमानत, योग्यता तथा पूर्णता परीक्षणका कार्यपत्र',
  'प्राविधिक, व्यापारिक र आर्थिक तुलना तथा मूल्य समायोजनको आधार',
  'मूल्याङ्कन समितिको प्रतिवेदन र अधिकारप्राप्त अधिकारीको निर्णय',
  'आशयको सूचना, प्राप्त उजुरी/पुनरावलोकन र त्यससम्बन्धी निर्णय',
  'सम्झौता, कार्यसम्पादन जमानत र स्वीकृति पछिका पत्राचार',
];

type GuideSection = 'calculators' | 'matrix' | 'stepper' | 'precedents';

function AmountField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-semibold text-slate-700">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
        placeholder="0"
      />
    </label>
  );
}

export const BidEvaluationGuideView: React.FC<BidEvaluationGuideViewProps> = ({
  onNavigateToLaw,
  onNavigateToChecklists,
}) => {
  const [section, setSection] = useState<GuideSection>('calculators');

  const [bidAmount, setBidAmount] = useState('5000000');
  const [deviationAmount, setDeviationAmount] = useState('200000');

  const [estimateAmount, setEstimateAmount] = useState('10000000');
  const [quotedAmount, setQuotedAmount] = useState('7800000');

  const [avgEstimate, setAvgEstimate] = useState('10000000');
  const [avgBids, setAvgBids] = useState([
    { id: 'b1', name: 'बोलपत्रदाता क', amount: '8500000' },
    { id: 'b2', name: 'बोलपत्रदाता ख', amount: '7800000' },
    { id: 'b3', name: 'बोलपत्रदाता ग', amount: '9200000' },
  ]);

  const [matrixQuery, setMatrixQuery] = useState('');
  const [matrixKind, setMatrixKind] = useState<DeviationKind | 'all'>('all');

  const [activeStepId, setActiveStepId] = useState(EVALUATION_STEPS[0].id);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [precedentId, setPrecedentId] = useState(EVALUATION_PRECEDENTS[0].id);

  const minorDeviation = useMemo(
    () => analyzeMinorDeviation(parseAmount(bidAmount), parseAmount(deviationAmount)),
    [bidAmount, deviationAmount]
  );

  const apsResult = useMemo(
    () => analyzeAdditionalPerformanceSecurity(parseAmount(estimateAmount), parseAmount(quotedAmount)),
    [estimateAmount, quotedAmount]
  );

  const averageSim = useMemo(
    () =>
      simulateAverageBidding(
        parseAmount(avgEstimate),
        avgBids.map((row) => ({ ...row, amountNum: parseAmount(row.amount) }))
      ),
    [avgBids, avgEstimate]
  );

  const filteredMatrix = useMemo(() => {
    const q = matrixQuery.trim().toLowerCase();
    return DEVIATION_MATRIX.filter((item) => {
      if (matrixKind !== 'all' && item.kind !== matrixKind) return false;
      if (!q) return true;
      const haystack = `${item.title} ${item.example} ${item.legalOutcome} ${item.legalRef} ${item.keywords}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [matrixKind, matrixQuery]);

  const totalChecklist = EVALUATION_STEPS.reduce((n, step) => n + step.checklist.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const overallProgress = totalChecklist ? Math.round((checkedCount / totalChecklist) * 100) : 0;
  const activeStep = EVALUATION_STEPS.find((step) => step.id === activeStepId) ?? EVALUATION_STEPS[0];
  const activePrecedent = EVALUATION_PRECEDENTS.find((p) => p.id === precedentId) ?? EVALUATION_PRECEDENTS[0];

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  const addBidder = () => {
    const n = avgBids.length + 1;
    setAvgBids((rows) => [
      ...rows,
      { id: `b${Date.now()}`, name: `बोलपत्रदाता ${n}`, amount: '' },
    ]);
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#173b63] to-blue-800 px-5 py-6 text-white sm:px-7">
          {/* Right-side image with smooth left-side blend into the banner gradient */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[48%] md:w-[42%] lg:w-[38%] overflow-hidden select-none"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 18%, rgba(0, 0, 0, 0.85) 55%, black 85%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 18%, rgba(0, 0, 0, 0.85) 55%, black 85%)',
            }}
            aria-hidden="true"
          >
            <img
              src={evaluationImage}
              alt="बोलपत्र मूल्याङ्कन"
              className="h-full w-full object-cover object-right"
            />
            {/* Soft left-edge blend overlay matching banner gradient */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#173b63] via-[#173b63]/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#173b63]/30 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
              <Gavel className="h-4 w-4" />
              <span>ऐन २०६३ · नियम २०६४ (१६औँ संशोधन)</span>
            </div>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">बोलपत्र मूल्याङ्कन गाइड</h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-50">
              मूल्याङ्कन समितिले कागजात जाँच्दा प्रयोग गर्ने कानूनी सूत्र, सारभूत Vs. सामान्य त्रुटि,
              रुजु सूची र PPRC नजिरहरू यहीं पृष्ठबाट प्रयोग गर्न सकिन्छ।
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {onNavigateToLaw && (
                <button
                  onClick={onNavigateToLaw}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-blue-900 shadow-sm transition hover:bg-blue-50"
                >
                  <BookOpen className="h-4 w-4" />
                  ऐन/नियमको पाठ हेर्नुहोस्
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              {onNavigateToChecklists && (
                <button
                  onClick={onNavigateToChecklists}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20"
                >
                  <ClipboardList className="h-4 w-4" />
                  कार्यालय चेकलिस्ट खोल्नुहोस्
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-bold text-blue-900">कानुनी आधार</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">ऐन दफा २२–२७; नियम ५९–६५च र १६औँ संशोधन।</p>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
            <p className="text-xs font-bold text-violet-900">मुख्य सिद्धान्त</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">सबै प्रस्तावलाई पहिले नै प्रकाशित मापदण्ड र समान विधिबाट जाँच्ने।</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
            <p className="text-xs font-bold text-amber-900">याद गर्नुहोस्</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">सबैभन्दा कम कबोल रकमले मात्र स्वतः छनोट सुनिश्चित गर्दैन।</p>
          </div>
        </div>
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="मूल्याङ्कन गाइड खण्ड">
        {(
          [
            { id: 'calculators', label: '१. गतिशील क्याल्कुलेटर', icon: Calculator },
            { id: 'matrix', label: '२. त्रुटि म्याट्रिक्स', icon: Scale },
            { id: 'stepper', label: '३. ९-चरण स्टेपर', icon: CheckCircle2 },
            { id: 'precedents', label: '४. PPRC नजिर', icon: Gavel },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${active
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-700" />
          <h3 className="text-lg font-bold text-slate-900">कानुनी व्यवस्था: दफा/नियम र सरल अर्थ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="px-3 py-2.5 font-bold">विषय</th>
                <th className="px-3 py-2.5 font-bold">कानुनी आधार</th>
                <th className="px-3 py-2.5 font-bold">सरल अर्थ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-3 py-3 font-semibold">खोल्ने र प्रारम्भिक परीक्षण</td>
                <td className="px-3 py-3 font-mono">ऐन दफा २२–२३; नियम ५९–६०</td>
                <td className="px-3 py-3">म्याद, खोल्ने प्रक्रिया, कागजात, जमानत र योग्यता रुजु गर्ने।</td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-semibold">मूल्याङ्कन र तुलना</td>
                <td className="px-3 py-3 font-mono">ऐन दफा २५; नियम ६१–६५</td>
                <td className="px-3 py-3">बोलपत्र कागजातमा तोकिएका आधारमा प्राविधिक, व्यापारिक र आर्थिक पक्ष जाँच्ने।</td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-semibold">संशोधित छनोट व्यवस्था</td>
                <td className="px-3 py-3 font-mono">ऐन दफा २५(५क), (७क), (७ख); नियम ६५च</td>
                <td className="px-3 py-3">निर्माणमा औसत कबोलसँगको निकटता र लागत अनुमानभन्दा ३०% भन्दा बढी कम कबोल हटाउने।</td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-semibold">प्रतिवेदन र निर्णय</td>
                <td className="px-3 py-3 font-mono">ऐन दफा २५(८), २६–२७; नियम ६५ग</td>
                <td className="px-3 py-3">समितिले आधारसहित प्रतिवेदन दिन्छ; अधिकारप्राप्त अधिकारीले स्वीकृति/अन्य निर्णय गर्छ।</td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-semibold">उजुरी तथा पुनरावलोकन</td>
                <td className="px-3 py-3 font-mono">ऐन दफा ४७–५०</td>
                <td className="px-3 py-3">कानूनले तोकेको पक्ष, निकाय र समयसीमाभित्र निर्णय चुनौती दिन सकिन्छ।</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            संशोधनबाट थपिएका छनोट सूत्र सबै खरिदमा एउटै रूपमा लागू हुँदैनन्। सम्बन्धित खरिद विधि,
            पछिल्लो राजपत्रित ऐन/नियम र स्वीकृत बोलपत्र कागजातसँग दफा तथा नियम रुजु गर्नुहोस्।
          </p>
        </div>
      </section>

      {section === 'calculators' && (
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-700" />
            <h3 className="text-lg font-bold text-slate-900">इन्टरएक्टिभ क्याल्कुलेटर तथा सिमुलेटर</h3>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-blue-200 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">१५% सानातिना प्राविधिक विचलन</h4>
                  <p className="mt-1 text-[11px] font-semibold text-blue-800">ऐन दफा २५(२), २५(३)</p>
                </div>
                <Scale className="h-5 w-5 text-blue-700" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                सानातिना फरकको अनुमानित मूल्य कबोल रकमको १५% भित्र भए सच्याएर आर्थिक तुलना गर्न मिल्छ;
                नाघेमा सारभूत रूपमा अप्रतिक्रियाग्राही (बदर) हुन्छ।
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <AmountField label="कबोल रकम (रु.)" value={bidAmount} onChange={setBidAmount} />
                <AmountField label="सानातिना फरकको अनुमानित रकम (रु.)" value={deviationAmount} onChange={setDeviationAmount} />
              </div>
              {minorDeviation && (
                <div className={`mt-4 rounded-xl border p-4 ${minorDeviation.withinLimit ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                  <p className="font-mono text-sm font-bold text-slate-900">
                    {formatNepaliCurrency(minorDeviation.dev)} ÷ {formatNepaliCurrency(minorDeviation.bid)} × १०० = {minorDeviation.percent.toFixed(2)}%
                  </p>
                  <p className={`mt-2 text-sm font-bold ${minorDeviation.withinLimit ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {minorDeviation.withinLimit
                      ? 'सच्याएर आर्थिक मूल्याङ्कनमा तुलना गर्न मिल्ने (१५% भित्र)।'
                      : 'सारभूत रूपमा अप्रतिक्रियाग्राही — बदर हुने (१५% नाघेको)।'}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                    १५% भित्र हुनु मात्र स्वीकृतिको प्रमाण होइन। अन्य सारभूत शर्त पनि पूरा हुनुपर्छ।
                  </p>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-red-200 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">अतिरिक्त कार्यसम्पादन जमानत</h4>
                  <p className="mt-1 text-[11px] font-semibold text-red-800">दफा २५(७ख); नियम ६५च, ६८ · असन्तुलित/घटी कबोल</p>
                </div>
                <TrendingDown className="h-5 w-5 text-red-700" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                १५% भन्दा बढी घटेमा (८५% लागत अनुमान − कबोल) को ५०% अतिरिक्त धरौटी। ३०% भन्दा बढी घटेमा मूल्याङ्कनबाटै हट्छ।
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <AmountField label="स्वीकृत लागत अनुमान (रु.)" value={estimateAmount} onChange={setEstimateAmount} />
                <AmountField label="कबोल रकम (रु.)" value={quotedAmount} onChange={setQuotedAmount} />
              </div>
              {apsResult && (
                <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span>लागत अनुमानभन्दा फरक</span>
                    <span className="font-mono font-bold">
                      {apsResult.diffPercent.toFixed(2)}% {apsResult.isBelow ? 'घटेको' : 'बढेको'}
                    </span>
                  </div>
                  {apsResult.over30 ? (
                    <div className="flex gap-2 rounded-lg bg-red-100 p-2.5 font-bold text-red-950">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      ३०% भन्दा बढी घटेको हुँदा ऐन दफा २५(७ख) बमोजिम मूल्याङ्कनबाट स्वतः हट्ने। अतिरिक्त धरौटीको प्रश्न नै आउँदैन।
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-slate-700">
                        <span>सामान्य कार्यसम्पादन जमानत (५%)</span>
                        <span className="font-mono">{formatNepaliCurrency(apsResult.basePerfSec)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-red-800">
                        <span>अतिरिक्त कार्यसम्पादन जमानत</span>
                        <span className="font-mono">{formatNepaliCurrency(apsResult.additionalPerfSec)}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                        <span>कुल जमानत</span>
                        <span className="font-mono">{formatNepaliCurrency(apsResult.totalPerfSec)}</span>
                      </div>
                      {apsResult.over15 ? (
                        <p className="rounded-lg bg-amber-50 p-2 text-[11px] text-amber-950">
                          सूत्र: अतिरिक्त जमानत = (लागत अनुमानको ८५% − कबोल) × ५०%
                        </p>
                      ) : (
                        <p className="text-[11px] text-emerald-800">१५% भित्र घटेको/बढेको हुँदा अतिरिक्त धरौटी लाग्दैन।</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </article>
          </div>

          <article className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">औसत कबोल अङ्कको निकटता सिमुलेटर</h4>
                <p className="mt-1 text-[11px] font-semibold text-indigo-800">ऐन दफा २५(५क)/(७क); नियम ६५च · निर्माण कार्य</p>
              </div>
              <button
                type="button"
                onClick={addBidder}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-100"
              >
                <Plus className="h-3.5 w-3.5" />
                बोलपत्रदाता थप्नुहोस्
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              तीन वा सोभन्दा बढी कबोल राख्नुहोस्। ३०% भन्दा बढी घटेको हटाइन्छ। बाँकीको औसतसँग सबैभन्दा नजिक परेको पहिलो प्राथमिकतामा पर्छ।
            </p>
            <div className="mt-4 max-w-md">
              <AmountField label="स्वीकृत लागत अनुमान (रु.)" value={avgEstimate} onChange={setAvgEstimate} />
            </div>
            <div className="mt-4 space-y-2">
              {avgBids.map((row, index) => (
                <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={row.name}
                    onChange={(e) =>
                      setAvgBids((rows) => rows.map((item) => (item.id === row.id ? { ...item, name: e.target.value } : item)))
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                    placeholder={`बोलपत्रदाता ${index + 1}`}
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    value={row.amount}
                    onChange={(e) =>
                      setAvgBids((rows) =>
                        rows.map((item) =>
                          item.id === row.id ? { ...item, amount: e.target.value.replace(/[^\d.]/g, '') } : item
                        )
                      )
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs font-bold text-slate-900"
                    placeholder="कबोल रकम"
                  />
                  <button
                    type="button"
                    disabled={avgBids.length <= 3}
                    onClick={() => setAvgBids((rows) => (rows.length > 3 ? rows.filter((item) => item.id !== row.id) : rows))}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-2.5 py-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                    aria-label="हटाउनुहोस्"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[560px] text-left text-xs">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2">बोलपत्रदाता</th>
                    <th className="px-3 py-2">कबोल</th>
                    <th className="px-3 py-2">औसतबाट अन्तर</th>
                    <th className="px-3 py-2">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {averageSim.disqualified.map((row) => (
                    <tr key={row.id} className="bg-rose-50/70 text-rose-900">
                      <td className="px-3 py-2 font-semibold">{row.name}</td>
                      <td className="px-3 py-2 font-mono">{formatNepaliCurrency(row.amountNum)}</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2 font-bold">३०% भन्दा बढी घटेको — अयोग्य</td>
                    </tr>
                  ))}
                  {averageSim.ranked.map((row) => {
                    const isWinner = averageSim.winners.some((w) => w.id === row.id);
                    return (
                      <tr key={row.id} className={isWinner ? 'bg-emerald-50 text-emerald-950' : 'text-slate-700'}>
                        <td className="px-3 py-2 font-semibold">{row.name}</td>
                        <td className="px-3 py-2 font-mono">{formatNepaliCurrency(row.amountNum)}</td>
                        <td className="px-3 py-2 font-mono">{formatNepaliCurrency(row.gap)}</td>
                        <td className="px-3 py-2 font-bold">{isWinner ? 'औसतको सबैभन्दा नजिक — पहिलो प्राथमिकता' : 'प्रतिक्रियाग्राही (तुलनामा)'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-indigo-50 p-3 text-xs">
                <p className="text-indigo-800">बाँकी कबोलको औसत</p>
                <p className="mt-1 font-mono font-bold text-indigo-950">
                  {averageSim.remaining.length ? formatNepaliCurrency(averageSim.average) : '—'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-xs">
                <p className="text-slate-600">३०% कट-अफ (७०% अनुमान)</p>
                <p className="mt-1 font-mono font-bold text-slate-900">
                  {averageSim.estimate > 0 ? formatNepaliCurrency(averageSim.cutoff) : '—'}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 text-xs">
                <p className="text-emerald-800">छनोट</p>
                <p className="mt-1 font-bold text-emerald-950">
                  {averageSim.winners.map((w) => w.name).join(', ') || 'पर्याप्त कबोल छैन'}
                </p>
              </div>
            </div>
            {averageSim.needsThree && (
              <p className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                औसत विधि सिमुलेट गर्न प्रतिक्रियाग्राही (३०% भित्रका) कम्तीमा तीन कबोल चाहिन्छ। अहिले {averageSim.remaining.length} वटा मात्र बाँकी छन्।
              </p>
            )}
            {averageSim.winners.length > 1 && (
              <p className="mt-2 text-xs text-slate-600">
                दुई वा बढी समान अन्तर भए नियम ६५(४क) बमोजिम अनुभव, औसत वार्षिक कारोबार र अन्तिममा गोला प्रथा हेर्नुहोस्। मूल्य वार्ता गर्न पाइँदैन।
              </p>
            )}
          </article>
        </section>
      )}

      {section === 'matrix' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">सारभूत त्रुटि Vs. सामान्य त्रुटि</h3>
              <p className="mt-1 text-xs text-slate-600">PPRC/अदालतमा सबैभन्दा धेरै विवाद पर्ने विषय: कुन बदर हुने, कुन सच्याउन मिल्ने।</p>
            </div>
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={matrixQuery}
                onChange={(e) => setMatrixQuery(e.target.value)}
                placeholder="जमानत, जेभी, अंक-अक्षर..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: 'सबै' },
                { id: 'non-responsive', label: 'स्वतः बदर (अप्रतिक्रियाग्राही)' },
                { id: 'clarifiable', label: 'स्पष्टीकरण/सामान्य' },
                { id: 'red-flag', label: 'गर्न नमिल्ने (रेड फ्ल्याग)' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMatrixKind(item.id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${matrixKind === item.id
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="px-3 py-2.5 font-bold">वर्ग</th>
                  <th className="px-3 py-2.5 font-bold">विषय</th>
                  <th className="px-3 py-2.5 font-bold">उदाहरण</th>
                  <th className="px-3 py-2.5 font-bold">कानूनी निकास</th>
                  <th className="px-3 py-2.5 font-bold">आधार</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMatrix.map((item) => {
                  const kindLabel =
                    item.kind === 'non-responsive'
                      ? 'बदर'
                      : item.kind === 'clarifiable'
                        ? 'सच्याउन मिल्ने'
                        : 'निषेध';
                  const kindClass =
                    item.kind === 'non-responsive'
                      ? 'bg-rose-100 text-rose-900'
                      : item.kind === 'clarifiable'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-950';
                  return (
                    <tr key={item.id} className="align-top text-slate-700">
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${kindClass}`}>{kindLabel}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-900">{item.title}</td>
                      <td className="px-3 py-3 leading-relaxed">{item.example}</td>
                      <td className="px-3 py-3 leading-relaxed">{item.legalOutcome}</td>
                      <td className="px-3 py-3 font-mono text-[11px] text-blue-800">{item.legalRef}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredMatrix.length === 0 && (
              <p className="p-4 text-center text-xs text-slate-500">खोजसँग मिल्ने त्रुटि भेटिएन।</p>
            )}
          </div>
        </section>
      )}

      {section === 'stepper' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">इन्टरएक्टिभ ९-चरण मूल्याङ्कन स्टेपर</h3>
              <p className="mt-1 text-xs text-slate-600">चरण थिचेर रुजु सूची, बन्देज र मुचुल्काको नमुना हेर्नुहोस्।</p>
            </div>
            <div className="min-w-[180px]">
              <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-600">
                <span>समग्र प्रगति</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-600" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <ol className="space-y-1.5">
              {EVALUATION_STEPS.map((step) => {
                const done = step.checklist.filter((item) => checkedItems[item.id]).length;
                const active = step.id === activeStepId;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActiveStepId(step.id)}
                      className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left ${active ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
                        }`}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${active ? 'bg-white/20' : 'bg-white text-blue-800'}`}>
                        {step.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold leading-snug">{step.title}</span>
                        <span className={`mt-0.5 block text-[10px] ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                          रुजु {done}/{step.checklist.length}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
              <p className="text-[11px] font-semibold text-blue-800">{activeStep.legalRef}</p>
              <h4 className="mt-1 text-base font-bold text-slate-900">
                {activeStep.number}. {activeStep.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{activeStep.summary}</p>

              <div className="mt-4">
                <p className="text-xs font-bold text-slate-900">समितिले अनिवार्य रुजु गर्नुपर्ने</p>
                <ul className="mt-2 space-y-2">
                  {activeStep.checklist.map((item) => (
                    <li key={item.id}>
                      <label className="flex cursor-pointer gap-2.5 text-xs leading-relaxed text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(checkedItems[item.id])}
                          onChange={() =>
                            setCheckedItems((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                          }
                          className="mt-0.5 h-4 w-4 rounded border-slate-300"
                        />
                        {item.label}
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] font-semibold text-emerald-800">
                  यस चरणको प्रगति:{' '}
                  {Math.round(
                    (activeStep.checklist.filter((item) => checkedItems[item.id]).length / activeStep.checklist.length) * 100
                  )}
                  %
                </p>
              </div>

              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                  <ShieldAlert className="h-4 w-4" />
                  कानूनले निषेध गरेका बन्देज
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-rose-950">
                  {activeStep.prohibitions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900">{activeStep.minuteSample.title}</p>
                  <button
                    type="button"
                    onClick={() => copyText(activeStep.id, activeStep.minuteSample.body)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 hover:text-blue-950"
                  >
                    {copiedKey === activeStep.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === activeStep.id ? 'कपी भयो' : 'कपी गर्नुहोस्'}
                  </button>
                </div>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-slate-700">
                  {activeStep.minuteSample.body}
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}

      {section === 'precedents' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <h3 className="text-lg font-bold text-slate-900">मूल्याङ्कन सम्बन्धी PPRC नजिर र सिकाइ</h3>
          <p className="mt-1 text-xs text-slate-600">
            सार्वजनिक खरिद पुनरावलोकन समितिले मूल्याङ्कन समितिका निर्णय बदर गर्ने प्रमुख कारणहरू।
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {EVALUATION_PRECEDENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPrecedentId(item.id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${precedentId === item.id
                  ? 'border-indigo-800 bg-indigo-800 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
              >
                {item.tab}
              </button>
            ))}
          </div>
          <article className="mt-4 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <h4 className="text-sm font-bold text-slate-900">{activePrecedent.title}</h4>
            <p className="text-[11px] font-semibold text-indigo-800">{activePrecedent.legalRef}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-white p-3 text-xs">
                <p className="font-bold text-rose-800">समितिले गरेको गल्ती</p>
                <p className="mt-1 leading-relaxed text-slate-700">{activePrecedent.typicalError}</p>
              </div>
              <div className="rounded-lg bg-white p-3 text-xs">
                <p className="font-bold text-indigo-800">PPRC को सिकाइ</p>
                <p className="mt-1 leading-relaxed text-slate-700">{activePrecedent.pprcLesson}</p>
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 text-xs">
              <p className="font-bold text-emerald-900">के गर्ने</p>
              <p className="mt-1 leading-relaxed text-slate-700">{activePrecedent.doInstead}</p>
            </div>
            <p className="text-[11px] text-slate-500">सन्दर्भ: {activePrecedent.relatedDecisions}</p>
          </article>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <h3 className="text-lg font-bold text-slate-900">तीन मूल्याङ्कनबीचको फरक</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {evaluationLenses.map((lens) => {
            const Icon = lens.icon;
            const colorClasses = {
              blue: 'border-blue-200 bg-blue-50 text-blue-800',
              violet: 'border-violet-200 bg-violet-50 text-violet-800',
              emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
            }[lens.color];
            return (
              <article key={lens.title} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <span className={`rounded-lg border p-2 ${colorClasses}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{lens.title}</h4>
                  <span className="ml-auto text-[10px] font-semibold text-slate-500">{lens.legalRef}</span>
                </div>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-800">{lens.question}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{lens.examples}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-900">निर्माण कार्यमा थप जाँच</h4>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            कार्ययोजना, कार्यतालिका, BOQ का परिमाण/एकाइ दर, असन्तुलित वा सुरुका काममा बढी केन्द्रित
            दर र कार्यसम्पादन क्षमताको परीक्षण गर्नुहोस्। दर असन्तुलित देखिनु मात्रै अस्वीकृतिको
            आधार होइन; सम्बन्धित नियम र बोलपत्र कागजातअनुसार कारणसहित विश्लेषण गर्नुहोस्।
          </p>
          <p className="mt-2 text-[11px] font-semibold text-blue-800">नियम ६५ तथा लागू SBD</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-700" />
            <h3 className="text-lg font-bold text-slate-900">उदाहरण: कम कबोल सधैँ छनोट हुँदैन</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            १०० कम्प्युटर खरिद गर्दा प्राविधिक आवश्यकता पूरा गरेको हो वा होइन मूल्यसँगै हेर्नुहोस्।
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-3">बोलपत्रदाता</th>
                  <th className="py-2 pr-3">कबोल</th>
                  <th className="py-2 pr-3">आवश्यक स्पेसिफिकेसन</th>
                  <th className="py-2">अर्को कदम</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="py-2 pr-3 font-semibold">क</td><td className="py-2 pr-3">रु. ४५ लाख</td><td className="py-2 pr-3">पूरा</td><td className="py-2">तुलनामा समावेश</td></tr>
                <tr><td className="py-2 pr-3 font-semibold">ख</td><td className="py-2 pr-3">रु. ४२ लाख</td><td className="py-2 pr-3">पूरा</td><td className="py-2">तोकिएको विधिबाट तुलना</td></tr>
                <tr><td className="py-2 pr-3 font-semibold">ग</td><td className="py-2 pr-3">रु. ४० लाख</td><td className="py-2 pr-3">पूरा छैन</td><td className="py-2">कानुन/कागजातअनुसार निर्णय</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-700">
            ग को रकम सबैभन्दा कम भए पनि आधारभूत प्राविधिक आवश्यकता नपुगेको कारण त्यसलाई स्वतः
            छनोट गर्न मिल्दैन। क र ख मध्ये सिफारिस गर्दा पनि लागू मूल्याङ्कन विधि र योग्यता जाँच
            पूरा हुनुपर्छ।
          </p>
        </article>

        <article className="rounded-2xl border border-blue-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-indigo-700" />
            <h3 className="text-lg font-bold text-slate-900">समिति र निर्णय अधिकारीको भूमिका</h3>
          </div>
          <div className="mt-4 space-y-3 text-xs leading-relaxed">
            <div className="rounded-lg bg-indigo-50 p-3">
              <p className="font-bold text-indigo-950">मूल्याङ्कन समिति</p>
              <p className="mt-1 text-slate-700">परीक्षण, समान आधारमा तुलना, कारण अभिलेख, राय/सिफारिस र प्रतिवेदन तयार गर्छ।</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-bold text-slate-900">अधिकारप्राप्त अधिकारी</p>
              <p className="mt-1 text-slate-700">समितिको प्रतिवेदन र कानुनी प्रक्रिया जाँच गरी स्वीकृति वा अन्य निर्णय गर्छ र त्यसपछि सम्झौता प्रक्रिया अघि बढाउँछ।</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-600">कानुनी आधार: ऐन दफा २५(८), २६–२७; नियम १४७</p>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-rose-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-700" />
            <h3 className="text-lg font-bold text-slate-900">अस्वीकृति र पुनरावलोकन</h3>
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-slate-700">
            <li>अयोग्यता, सारभूत रूपमा प्रतिक्रियाग्राही नहुनु वा आवश्यक शर्त नपुग्नु जस्ता कारण कानून र बोलपत्र कागजातसँग जोडेर खुलाउनुहोस्।</li>
            <li>प्रत्येक सानो त्रुटि स्वतः अस्वीकृतिको कारण हुँदैन; सुधार/स्पष्टीकरणको सीमा ऐन, नियम र SBD ले निर्धारण गर्छ।</li>
            <li>चित्त नबुझेमा बोलपत्रदाताले दफा ४७–५० बमोजिम तोकिएको निकाय, आधार र समयसीमाभित्र पुनरावलोकन माग्न सक्छ।</li>
          </ul>
          <p className="mt-3 text-[11px] font-semibold text-rose-800">समयसीमा, निकाय र प्रक्रिया सम्बन्धित अद्यावधिक कानूनबाट रुजु गर्नुहोस्।</p>
        </article>

        <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-900">कार्यालय चेकलिस्ट</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {officeChecklist.map((item) => (
              <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                {item}
              </li>
            ))}
          </ul>
          {onNavigateToChecklists && (
            <button
              onClick={onNavigateToChecklists}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
            >
              एकीकृत चेकलिस्टमा जानुहोस् <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </article>
      </section>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900">फाइलमा राख्ने मुख्य कागजात</h3>
        </div>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {recordsToKeep.map((item) => (
            <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-slate-700">
              <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              {item}
            </li>
          ))}
        </ul>
      </article>

      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
        यो पृष्ठ सामान्य बुझाइ र कार्यालय अभ्यासका लागि तयार गरिएको सारांश हो, कानुनी सल्लाह वा बोलपत्र कागजातको
        विकल्प होइन। संशोधित ऐन/नियम, लागू SBD र सम्बन्धित खरिदको स्वीकृत कागजातलाई अन्तिम आधार
        मान्नुहोस्। क्याल्कुलेटरका नतिजा सम्बन्धित फाइलका अंकसँग रुजु गर्नुहोस्।
      </aside>
    </div>
  );
};
