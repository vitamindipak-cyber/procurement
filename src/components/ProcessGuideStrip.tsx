import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ClipboardList,
  FileCheck2,
  FileText,
  Gavel,
  HelpCircle,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

export interface ProcessGuideItem {
  id: string;
  step: string;
  title: string;
  description: string;
  checkItems?: string[];
  outcome?: string;
  nextStep?: string;
  actionLabel?: string;
  caution?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ENTITY_PATH: ProcessGuideItem[] = [
  {
    id: 'advisor',
    step: '१',
    title: 'आवश्यकता बुझेर विधि छान्नुहोस्',
    description: 'आफूले के खरिद गर्न लागेको हो, अनुमानित रकम कति हो र बजेट सुनिश्चित छ कि छैन भन्नेबाट सुरु गर्नुहोस्।',
    checkItems: [
      'निर्माण, मालसामान, परामर्श वा अन्य सेवा छुट्याउनुहोस्',
      'आवश्यकता र अनुमानित रकम तयार राख्नुहोस्',
    ],
    outcome: 'लागू हुन सक्ने खरिद विधि र त्यसको आधार पहिचान गर्न सजिलो हुन्छ।',
    nextStep: 'चरण २: खरिदका ७ चरण बुझ्नुहोस्',
    actionLabel: 'खरिद विधि सल्लाहकार खोल्नुहोस्',
    icon: Sparkles,
  },
  {
    id: 'stages',
    step: '२',
    title: 'खरिदका ७ चरण बुझ्नुहोस्',
    description: 'पूर्वतयारी र लागत अनुमानबाट सुरु गरी बोलपत्र, मूल्याङ्कन, सम्झौता र कार्यान्वयनसम्मको क्रम हेर्नुहोस्।',
    checkItems: [
      'हालको काम कुन चरणमा छ भन्ने पहिचान गर्नुहोस्',
      'त्यो चरणका जिम्मेवारी र आवश्यक कागजात हेर्नुहोस्',
    ],
    outcome: 'प्रक्रियाको क्रम र प्रत्येक चरणमा गर्नुपर्ने मुख्य कामको नक्सा स्पष्ट हुन्छ।',
    nextStep: 'चरण ३: प्राप्त बोलपत्र मूल्याङ्कन गर्नुहोस्',
    actionLabel: '७ चरण मार्गदर्शन खोल्नुहोस्',
    icon: ClipboardList,
  },
  {
    id: 'bid-evaluation',
    step: '३',
    title: 'बोलपत्र मूल्याङ्कन गर्नुहोस्',
    description: 'बोलपत्र कागजातमा पहिल्यै तोकिएका आधारअनुसार प्रस्ताव जाँच्ने क्रम हेर्नुहोस्।',
    checkItems: [
      'प्राविधिक र व्यावसायिक योग्यता जाँच्नुहोस्',
      'आर्थिक प्रस्ताव र मूल्याङ्कन प्रतिवेदन रुजु गर्नुहोस्',
    ],
    outcome: 'मूल्याङ्कनका मुख्य जाँच र निर्णय अभिलेख गर्ने आधार थाहा हुन्छ।',
    nextStep: 'चरण ४: सम्बन्धित चेकलिस्ट पूरा गर्नुहोस्',
    actionLabel: 'मूल्याङ्कन मार्गदर्शन खोल्नुहोस्',
    icon: Gavel,
  },
  {
    id: 'checklists',
    step: '४',
    title: 'कागजात र अनुपालन जाँच्नुहोस्',
    description: 'खरिदको प्रकार र हालको चरणसँग मिल्ने सूचीबाट कागजात तथा स्वीकृति रुजु गर्नुहोस्।',
    checkItems: [
      'बुँदा पूरा भए/नभएको अभिलेख राख्नुहोस्',
      'नपुगेको कागजात वा स्वीकृतिको जिम्मेवार व्यक्ति तोक्नुहोस्',
    ],
    outcome: 'छुटेका काम र आवश्यक कागजात पहिचान गर्न सजिलो हुन्छ।',
    nextStep: 'चरण ५: सम्बन्धित कानुनी व्यवस्था रुजु गर्नुहोस्',
    actionLabel: 'खरिद चेकलिस्ट खोल्नुहोस्',
    icon: ShieldCheck,
  },
  {
    id: 'law-corpus',
    step: '५',
    title: 'ऐन, नियम र संशोधन रुजु गर्नुहोस्',
    description: 'निर्णय लिनुअघि सम्बन्धित दफा वा नियमको मूल पाठ र लागू संशोधन जाँच्नुहोस्।',
    checkItems: [
      'मार्गदर्शनमा उल्लेख भएको दफा वा नियम खोल्नुहोस्',
      'आफ्नो खरिदको अवस्था र लागू मितिसँग मिलाउनुहोस्',
    ],
    outcome: 'निर्णयको कानुनी आधार प्राथमिक स्रोतबाट पुष्टि गर्न सकिन्छ।',
    nextStep: 'चरण ६: बाँकी अन्योलको उत्तर खोज्नुहोस्',
    actionLabel: 'ऐन तथा नियमावली खोल्नुहोस्',
    icon: BookOpen,
  },
  {
    id: 'dilemma-solver',
    step: '६',
    title: 'अन्योल समाधान गर्नुहोस्',
    description: 'व्यवहारिक प्रश्न वा उस्तै अवस्थाका उदाहरण खोज्नुहोस् र आवश्यक परे सम्बन्धित स्रोतबाट पुष्टि गर्नुहोस्।',
    checkItems: [
      'मुख्य शब्द वा आफ्नो अवस्थासँग मिल्ने प्रश्न खोज्नुहोस्',
      'उत्तरमा दिइएको ऐन, नियम वा स्रोत फेरि रुजु गर्नुहोस्',
    ],
    outcome: 'अर्को कदम र थप जाँच्नुपर्ने विषय छुट्याउन सकिन्छ।',
    nextStep: 'आफ्नो निर्णयलाई मूल स्रोतसँग अन्तिम पटक रुजु गर्नुहोस्',
    actionLabel: 'प्रश्न तथा उदाहरण खोज्नुहोस्',
    icon: HelpCircle,
  },
];

const BIDDER_PATH: ProcessGuideItem[] = [
  {
    id: 'sbd-hub',
    step: '१',
    title: 'सूचना र बोलपत्र कागजात पढ्नुहोस्',
    description: 'आफ्नो ठेक्काको मूल सूचना र मानक बोलपत्र कागजात (SBD) ध्यानपूर्वक पढी सबै संशोधनसमेत प्राप्त गर्नुहोस्।',
    checkItems: [
      'पेश गर्ने अन्तिम मिति, समय र पेश गर्ने तरिका',
      'योग्यता, अनुभव र आवश्यक कागजातका सर्त',
      'प्राविधिक मापदण्ड तथा मूल्याङ्कन आधार',
      'बोलपत्र जमानत, मान्य अवधि र पछि आएका संशोधन',
    ],
    outcome: 'ठेक्काको म्याद, योग्यता र पेश गर्नुपर्ने कागजातको आफ्नै छोटो सूची तयार हुन्छ।',
    nextStep: 'चरण २: योग्यता जाँच्नुहोस्',
    actionLabel: 'SBD कागजात भण्डार खोल्नुहोस्',
    caution: 'भण्डारमा तपाईंको खास ठेक्काको सूचना नहुन सक्छ। e-GP मा प्रकाशित मूल सूचना र संशोधनसँगै अन्तिम सर्त रुजु गर्नुहोस्।',
    icon: BookOpen,
  },
  {
    id: 'eligibility',
    step: '२',
    title: 'योग्यता जाँच्नुहोस्',
    description: 'अनुभव, कारोबार र चालू ठेक्काको सर्त मिल्छ कि मिल्दैन जाँच्नुहोस्।',
    icon: Calculator,
  },
  {
    id: 'bid-no-bid',
    step: '३',
    title: 'बिड हाल्ने निर्णय',
    description: 'आफ्नो क्षमता, लागत र जोखिमसँग तुलना गरेर निर्णय लिनुहोस्।',
    icon: Target,
  },
  {
    id: 'forms',
    step: '४',
    title: 'फाराम तयार गर्नुहोस्',
    description: 'सम्बन्धित SBD फाराम भरी डाउनलोड वा प्रिन्ट गर्नुहोस्।',
    icon: FileText,
  },
  {
    id: 'checklist',
    step: '५',
    title: 'पेश गर्नुअघि अन्तिम जाँच गर्नुहोस्',
    description: 'फाराम, जमानत, हस्ताक्षर र फाइलहरू ठेक्काको सूचनासँग मिलाउनुहोस्।',
    icon: FileCheck2,
  },
  {
    id: 'egp-guide',
    step: '६',
    title: 'e-GP बाट पेश गर्नुहोस्',
    description: 'फाइल अपलोड, अन्तिम पेश र समयसीमाको क्रम बुझ्नुहोस्।',
    icon: Layers,
  },
  {
    id: 'review',
    step: '७',
    title: 'उजुरी / पुनरावलोकन',
    description: 'निर्णयमा चित्त नबुझेमा अपनाउने औपचारिक बाटो हेर्नुहोस्।',
    icon: Scale,
  },
];

interface ProcessGuideStripProps {
  audience: 'entity' | 'bidder';
  onSelect: (id: string) => void;
}

export const ProcessGuideStrip: React.FC<ProcessGuideStripProps> = ({ audience, onSelect }) => {
  const items = audience === 'bidder' ? BIDDER_PATH : ENTITY_PATH;
  const isBidder = audience === 'bidder';

  return (
    <section
      aria-labelledby="process-guide-heading"
      className={`rounded-2xl border bg-gradient-to-b from-white to-slate-50/80 p-5 shadow-xs sm:p-6 ${isBidder ? 'border-emerald-200' : 'border-blue-200'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-wider ${isBidder ? 'text-emerald-700' : 'text-blue-800'}`}>
            {isBidder ? 'बोलपत्रदाताका लागि सुरु गर्ने मार्ग' : 'सार्वजनिक निकायका लागि सुरु गर्ने मार्ग'}
          </p>
          <h2 id="process-guide-heading" className="mt-0.5 text-lg font-bold text-slate-900">
            {isBidder ? 'बोलपत्रदेखि पेश गर्नेसम्म' : 'खरिद योजना बनाएदेखि सम्झौतासम्म'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
            {isBidder
              ? 'पहिले ठेक्काको सूचना पढ्नुहोस्, त्यसपछि योग्यता, निर्णय, फाराम र पेशका चरणहरू क्रमशः पूरा गर्नुहोस्।'
              : 'पहिलो पटक हुनुहुन्छ भने चरण १ बाट सुरु गर्नुहोस्। आफ्नो कामअनुसार कुनै पनि कार्ड खोलेर सम्बन्धित मार्गदर्शन हेर्न सक्नुहुन्छ।'}
          </p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${isBidder ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>
          {items.length} वटा चरण · छान्न मिल्ने मार्गदर्शन
        </span>
      </div>

      <ol className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isDetailedBidderStep = isBidder && item.id === 'sbd-hub';
          return (
            <li key={item.id} className={isDetailedBidderStep ? 'sm:col-span-2 xl:col-span-3' : ''}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-label={`चरण ${item.step}: ${item.title} — ${item.actionLabel || 'मार्गदर्शन खोल्नुहोस्'}`}
                className={`group block h-full w-full rounded-xl border bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline focus-visible:outline-2 ${isDetailedBidderStep ? 'p-4 sm:p-5' : 'min-h-[132px] p-3.5'} ${isBidder
                    ? 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-emerald-600'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-blue-700'
                  }`}
              >
                {isDetailedBidderStep ? (
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)] lg:gap-5">
                    <div className="flex items-start gap-3.5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-900">चरण {item.step} · बोलपत्र तयारी</span>
                          <span className="text-[10px] font-semibold text-slate-500">पहिले यहीबाट सुरु गर्नुहोस्</span>
                        </div>
                        <h3 className="mt-2 text-base font-bold leading-snug text-slate-950 sm:text-lg">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700"><strong className="text-slate-900">के गर्ने:</strong> {item.description}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                        <h4 className="text-xs font-bold text-slate-900">सूचनामा यी कुरा जाँच्नुहोस्</h4>
                        <ul className="mt-2 space-y-2">
                          {item.checkItems?.map((checkItem) => (
                            <li key={checkItem} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                              <span>{checkItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                        <h4 className="text-xs font-bold text-emerald-950">यो चरणपछि</h4>
                        <p className="mt-2 text-xs leading-relaxed text-emerald-950">{item.outcome}</p>
                        <div className="mt-auto border-t border-emerald-200 pt-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">अर्को कदम</p>
                          <p className="mt-0.5 text-xs font-bold text-emerald-950">{item.nextStep}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
                      <p className="max-w-3xl text-[11px] leading-relaxed text-amber-900"><strong>ध्यान दिनुहोस्:</strong> {item.caution}</p>
                      <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white transition-colors group-hover:bg-emerald-900">
                        {item.actionLabel}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-start gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isBidder ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${isBidder ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>चरण {item.step}</span>
                      <span className="mt-1 block text-sm font-bold leading-snug text-slate-900">{item.title}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.description}</span>
                      {item.checkItems && (
                        <span className="mt-3 block rounded-lg bg-slate-50 p-2.5">
                          <span className="block text-[10px] font-bold text-slate-700">के गर्नुहोस्?</span>
                          {item.checkItems.map((checkItem) => (
                            <span key={checkItem} className="mt-1 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-600">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                              <span>{checkItem}</span>
                            </span>
                          ))}
                        </span>
                      )}
                      {item.outcome && (
                        <span className="mt-2 block text-[11px] leading-relaxed text-slate-700">
                          <span className="font-bold text-slate-800">यसपछि: </span>{item.outcome}
                        </span>
                      )}
                      {item.nextStep && (
                        <span className="mt-2 block border-t border-slate-100 pt-2 text-[11px] leading-relaxed text-slate-700">
                          <span className="font-bold text-slate-800">अर्को चरण: </span>{item.nextStep}
                        </span>
                      )}
                      <span className={`mt-3 inline-flex items-center gap-1 text-[11px] font-bold ${isBidder ? 'text-emerald-800' : 'text-blue-800'}`}>
                        {item.actionLabel || 'मार्गदर्शन खोल्नुहोस्'} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
