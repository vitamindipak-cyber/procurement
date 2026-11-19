import React from 'react';
import { BookOpen } from 'lucide-react';
import { BeginnerTooltip } from './BeginnerTooltip';

const TERMS = [
  { word: 'लागत अनुमान', meaning: 'खरिद गर्न कति रकम लाग्छ भन्ने प्रमाण र बजारदरमा आधारित स्वीकृत हिसाब हो।' },
  { word: 'आशयपत्र', meaning: 'कसको प्रस्ताव छनोट गर्ने तयारी छ भन्ने सार्वजनिक सूचना हो; सम्झौता भने होइन।' },
  { word: 'Bid Security', meaning: 'बोलपत्रदाता गम्भीर छ भन्ने सुनिश्चित गर्न मागिने बैंक जमानत वा धरौटी हो।' },
  { word: 'Single Stage Two Envelope', meaning: 'प्राविधिक र आर्थिक प्रस्ताव छुट्टाछुट्टै खाममा एकै पटक पेश गर्ने बोलपत्र विधि हो।' },
];

export const CommonTermsBar: React.FC = () => (
  <section aria-label="सामान्य खरिद शब्दको सरल अर्थ" className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-900"><BookOpen className="h-3.5 w-3.5 text-blue-700" /> शब्दको सरल अर्थ</span>
    {TERMS.map((term) => (
      <BeginnerTooltip key={term.word} title={term.word} content={term.meaning} position="bottom">
        <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:border-blue-400">{term.word}</span>
      </BeginnerTooltip>
    ))}
  </section>
);
