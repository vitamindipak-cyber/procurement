import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

/** A compact legal reminder that expands only when users need the detail. */
export const GuideSourceNotice: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <aside className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-950">
      <button type="button" onClick={() => setIsOpen((value) => !value)} className="flex w-full items-center gap-2 text-left font-semibold">
        <Info className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <span>कानुनी सन्दर्भ जाँच्नुहोस्</span>
        <ChevronDown className={`ml-auto h-4 w-4 text-amber-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-2 border-t border-amber-200 pt-2 leading-relaxed">
          guide.docx मा संकलित सावधानीहरू PPMO का राय र PPRC का निर्णयमा आधारित सहायक मार्गदर्शन हुन्; ती आफैंमा बाध्यकारी नजिर वा कानुनी सल्लाह होइनन्। निर्णयअघि सम्बन्धित मितिमा लागू ऐन/नियम, पछिल्लो SBD तथा संशोधन, e-GP निर्देशिका, दाता र सम्झौताका विशेष सर्तसँग रुजु गर्नुहोस्।
        </p>
      )}
    </aside>
  );
};
