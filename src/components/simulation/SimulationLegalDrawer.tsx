import React, { useMemo } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { SimulationLegalReference } from '../../types/simulation';
import { formatSourceVersion, getLegalReferenceFullText } from '../../utils/simulationLegalHelper';

interface SimulationLegalDrawerProps {
  reference: SimulationLegalReference | null;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

export const SimulationLegalDrawer: React.FC<SimulationLegalDrawerProps> = ({
  reference,
  onClose,
  onNavigate,
}) => {
  if (!reference) return null;

  const fullText = useMemo(() => getLegalReferenceFullText(reference), [reference]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123f6d] text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#176b70]">
                {reference.lawName}
              </span>
              <h2 className="text-lg font-bold text-slate-900">{reference.clause}</h2>
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

        {/* Content body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Practice Summary */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
              अभ्यास सान्दर्भिकता (Practical Context)
            </h3>
            <p className="text-sm leading-relaxed text-blue-950 font-normal">
              {reference.summary}
            </p>
          </div>

          {/* Full statutory provision text if available */}
          {fullText ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  आधिकारिक कानुनी दफा / नियमको पूर्ण पाठ (Official Statutory Text)
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">सार्वजनिक खरिद एकीकृत कानुन</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line max-h-96 overflow-y-auto shadow-inner">
                {fullText}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
              यो सन्दर्भ स्थानीय संग्रहमा रहेको नजिर/राय वा संक्षिप्त निर्देशिकामा आधारित छ। यसको पूर्ण फैसला वा निर्णय हेर्न आधिकारिक स्रोत वा एपको नजिर ट्याब खोल्नुहोस्।
            </div>
          )}

          {/* Verification & Metadata */}
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-0.5">स्रोत / संस्करण विवरण</span>
              <span className="text-slate-600">{formatSourceVersion(reference.sourceVersion) || reference.lawName}</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-0.5">पुष्टि अवस्था (Verification Status)</span>
              <span className="text-slate-600">
                {reference.lastCheckedAt ? `अन्तिम पुष्टि: ${reference.lastCheckedAt}` : 'स्थानीय शैक्षिक मोड'}
              </span>
            </div>
          </div>

          {reference.verificationNote && (
            <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-900 leading-5">
              <strong>नोट:</strong> {reference.verificationNote}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-3">
            <a
              href={reference.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#123f6d] hover:underline"
            >
              आधिकारिक स्रोत लिङ्क खोल्नुहोस्
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {reference.appTab && onNavigate && (
              <button
                type="button"
                onClick={() => {
                  onNavigate(reference.appTab!);
                  onClose();
                }}
                className="text-xs font-semibold text-[#176b70] hover:underline"
              >
                एपको {reference.appTab === 'law-corpus' ? 'कानुन सङ्ग्रह' : 'PPMO/PPRC सङ्ग्रह'} खोल्नुहोस्
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#123f6d] px-4 py-2 text-xs font-bold text-white hover:bg-[#174f7e]"
          >
            बुझें, बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
