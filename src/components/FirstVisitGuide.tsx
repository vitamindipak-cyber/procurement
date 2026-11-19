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
  { id: 'plan', title: 'खरिद योजना बनाउने', description: 'नयाँ आयोजना र आवश्यक विवरणबाट सुरु गर्नुहोस्।', icon: ClipboardList, tone: 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400' },
  { id: 'method', title: 'विधि छनोट गर्ने', description: 'रकम र खरिदको प्रकारका आधारमा उपयुक्त विधि खोज्नुहोस्।', icon: Calculator, tone: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:border-indigo-400' },
  { id: 'notice', title: 'बोलपत्र निकाल्ने', description: 'कागजात, सूचना र प्रकाशनअघि गर्नुपर्ने काम हेर्नुहोस्।', icon: FileText, tone: 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400' },
  { id: 'evaluation', title: 'बोलपत्र मूल्याङ्कन गर्ने', description: 'प्रस्ताव जाँच्ने सही क्रम र checklist खोल्नुहोस्।', icon: FileSearch, tone: 'bg-violet-50 text-violet-900 border-violet-200 hover:border-violet-400' },
  { id: 'bid', title: 'बोलपत्र हाल्ने', description: 'बोलपत्रदाताका लागि योग्यता, फाराम र पेश-पूर्व जाँच।', icon: HardHat, tone: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-400' },
];

export const FirstVisitGuide: React.FC<FirstVisitGuideProps> = ({ onChoose, onDismiss }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="first-visit-title">
    <section className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl">
      <div className="bg-gradient-to-r from-[#12375f] via-[#1a4b82] to-teal-800 px-6 py-7 text-white sm:px-8">
        <button type="button" onClick={onDismiss} className="absolute right-4 top-4 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="अहिलेका लागि बन्द गर्नुहोस्">
          <X className="h-5 w-5" />
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">खरिद सहयोगीमा स्वागत छ</p>
        <h1 id="first-visit-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">म के गर्न चाहन्छु?</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">एउटा काम छान्नुहोस्। हामी तपाईंलाई सही पृष्ठ र अर्को चरणमा लैजान्छौँ।</p>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        {choices.map(({ id, title, description, icon: Icon, tone }) => (
          <button key={id} type="button" onClick={() => onChoose(id)} className={`group flex min-h-36 flex-col rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${tone}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm"><Icon className="h-5 w-5" /></span>
            <span className="mt-3 text-sm font-extrabold">{title}</span>
            <span className="mt-1 text-xs leading-relaxed opacity-80">{description}</span>
            <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold">सुरु गर्नुहोस् <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
          </button>
        ))}
      </div>
      <div className="border-t border-slate-100 px-5 py-3 text-right sm:px-6">
        <button type="button" onClick={onDismiss} className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">अहिले dashboard हेर्नुहोस्</button>
      </div>
    </section>
  </div>
);
