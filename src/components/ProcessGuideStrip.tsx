import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
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
  icon: React.ComponentType<{ className?: string }>;
}

const ENTITY_PATH: ProcessGuideItem[] = [
  {
    id: 'advisor',
    step: '१',
    title: 'विधि छान्नुहोस्',
    description: 'रकम र कामको प्रकारअनुसार कानुनी खरिद विधि।',
    icon: Sparkles,
  },
  {
    id: 'stages',
    step: '२',
    title: '७ चरण पालना',
    description: 'योजनादेखि सम्झौतासम्मको अनिवार्य कार्यविधि।',
    icon: ClipboardList,
  },
  {
    id: 'bid-evaluation',
    step: '३',
    title: 'मूल्याङ्कन गर्नुहोस्',
    description: 'क्याल्कुलेटर, त्रुटि म्याट्रिक्स र समिति रुजु।',
    icon: Gavel,
  },
  {
    id: 'checklists',
    step: '४',
    title: 'चेकलिस्ट पूरा',
    description: 'अनुपालन कागजात र फाइल जाँच।',
    icon: ShieldCheck,
  },
  {
    id: 'law-corpus',
    step: '५',
    title: 'ऐन/नियम रुजु',
    description: 'दफा, नियम र १६औँ संशोधनको स्रोत पाठ।',
    icon: BookOpen,
  },
  {
    id: 'dilemma-solver',
    step: '६',
    title: 'अन्योल समाधान',
    description: 'कार्यक्षेत्रका वास्तविक प्रश्न र नजिर।',
    icon: HelpCircle,
  },
];

const BIDDER_PATH: ProcessGuideItem[] = [
  {
    id: 'eligibility',
    step: '१',
    title: 'योग्यता जाँच्नुहोस्',
    description: 'AACT, अनुभव, बिड क्षमता र ५ ठेक्का सीमा।',
    icon: Calculator,
  },
  {
    id: 'bid-no-bid',
    step: '२',
    title: 'हाल्ने/नहाल्ने',
    description: 'जोखिम, नाफा र क्षमताको रणनीतिक विश्लेषण।',
    icon: Target,
  },
  {
    id: 'checklist',
    step: '३',
    title: '३०-बुँदे रुजु',
    description: 'दाखिला अघि घातक गल्तीबाट बच्ने चेकलिस्ट।',
    icon: FileCheck2,
  },
  {
    id: 'forms',
    step: '४',
    title: 'फाराम तयार',
    description: 'SBD का अनिवार्य फाराम र ढाँचा।',
    icon: FileText,
  },
  {
    id: 'egp-guide',
    step: '५',
    title: 'e-GP मा पेस',
    description: 'अनलाइन दाखिला, जमानत र समयसीमा।',
    icon: Layers,
  },
  {
    id: 'review',
    step: '६',
    title: 'उजुरी बाटो',
    description: 'दफा ४७–५० बमोजिम पुनरावलोकन प्रक्रिया।',
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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-wider ${isBidder ? 'text-emerald-700' : 'text-blue-800'}`}>
            {isBidder ? 'बोलपत्रदाता यात्रा' : 'सार्वजनिक निकाय यात्रा'}
          </p>
          <h2 id="process-guide-heading" className="mt-0.5 text-lg font-bold text-slate-900">
            कहाँबाट सुरु गर्ने?
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
            {isBidder
              ? 'योग्यतादेखि e-GP दाखिला र उजुरीसम्म — बोलपत्र हाल्ने पूरा बाटो क्रमशः खोल्नुहोस्।'
              : 'विधि छनोटदेखि मूल्याङ्कन र कानुनी रुजुसम्म — खरिद अधिकृतले अपनाउने पूरा बाटो।'}
          </p>
        </div>
        {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
          <Bot className="h-3.5 w-3.5" />
          द्विभाषिक गाइड · ऐन २०६३ / नियम २०६४
        </span> */}
      </div>

      <ol className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`group flex h-full w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${isBidder
                    ? 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isBidder ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">चरण {item.step}</span>
                    <ArrowRight className="h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900">{item.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">{item.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
