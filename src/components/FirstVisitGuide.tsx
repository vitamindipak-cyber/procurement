import React from 'react';
import { ArrowRight, Calculator, ClipboardList, FileSearch, FileText, HardHat, X } from 'lucide-react';

export type FirstVisitChoice = 'plan' | 'method' | 'notice' | 'evaluation' | 'bid';

interface FirstVisitGuideProps {
  onChoose: (choice: FirstVisitChoice) => void;
  onDismiss: () => void;
}

const choices: Array<{
  id: FirstVisitChoice;
  title: string;
  description: string;
  icon: typeof ClipboardList;
  tone: string;
}> = [
  { id: 'plan', title: 'खरिद योजना बनाउने', description: 'नयाँ आयोजना र आवश्यक विवरणबाट सुरु गर्नुहोस्।', icon: ClipboardList, tone: 'bg-[#eff5fc] text-[#123f6d] border-[#c9dcef] hover:border-[#8fb4d6]' },
  { id: 'method', title: 'विधि छनोट गर्ने', description: 'रकम र खरिदको प्रकारका आधारमा उपयुक्त विधि खोज्नुहोस्।', icon: Calculator, tone: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:border-indigo-400' },
  { id: 'notice', title: 'बोलपत्र निकाल्ने', description: 'कागजात, सूचना र प्रकाशनअघि गर्नुपर्ने काम हेर्नुहोस्।', icon: FileText, tone: 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400' },
  { id: 'evaluation', title: 'बोलपत्र मूल्याङ्कन गर्ने', description: 'प्रस्ताव जाँच्ने सही क्रम र checklist खोल्नुहोस्।', icon: FileSearch, tone: 'bg-violet-50 text-violet-900 border-violet-200 hover:border-violet-400' },
  { id: 'bid', title: 'बोलपत्र हाल्ने', description: 'बोलपत्रदाताका लागि योग्यता, फाराम र पेश-पूर्व जाँच।', icon: HardHat, tone: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-400' },
];

export const FirstVisitGuide: React.FC<FirstVisitGuideProps> = ({ onChoose, onDismiss }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-2 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-labelledby="first-visit-title">
    <section className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/60 bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl">
      <div className="relative bg-gradient-to-r from-[#0e3359] via-[#123f6d] to-teal-800 px-3 py-2.5 pr-12 text-white sm:px-8 sm:py-3">
        <button type="button" onClick={onDismiss} className="absolute right-2 top-2 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-3" aria-label="अहिलेका लागि बन्द गर्नुहोस्">
          <X className="h-5 w-5" />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200 sm:text-xs sm:tracking-[0.16em]">खरिद सहयोगीमा स्वागत छ</p>
        <h4 id="first-visit-title" className="mt-0.5 text-lg font-extrabold tracking-tight sm:mt-2 sm:text-3xl">म के गर्न चाहन्छु?</h4>
        <p className="mt-1 max-w-2xl text-xs leading-snug text-blue-100 sm:mt-2 sm:text-sm sm:leading-relaxed">एउटा काम छान्नुहोस्। हामी तपाईंलाई सही पृष्ठ र अर्को चरणमा लैजान्छौँ।</p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2.5 sm:grid-cols-2 sm:gap-3 sm:p-6 lg:grid-cols-3">
        {choices.map(({ id, title, description, icon: Icon, tone }) => (
          <button key={id} type="button" onClick={() => onChoose(id)} className={`group flex min-h-24 flex-col rounded-xl border p-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md sm:min-h-36 sm:rounded-2xl sm:p-4 ${id === 'bid' ? 'col-span-2 sm:col-span-1' : ''} ${tone}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 shadow-sm sm:h-10 sm:w-10 sm:rounded-xl"><Icon className="h-4 w-4 sm:h-5 sm:w-5" /></span>
            <span className="mt-1.5 text-xs font-extrabold leading-tight sm:mt-3 sm:text-sm">{title}</span>
            <span className="mt-1 line-clamp-2 text-[10px] leading-snug opacity-80 sm:text-xs sm:leading-relaxed">{description}</span>
            <span className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[10px] font-bold sm:pt-3 sm:text-xs">सुरु गर्नुहोस् <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" /></span>
          </button>
        ))}
      </div>
      <div className="border-t border-slate-100 px-3 py-2 text-right sm:px-6 sm:py-3">
        <button type="button" onClick={onDismiss} className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">अहिले dashboard हेर्नुहोस्</button>
      </div>
    </section>
  </div>
);
