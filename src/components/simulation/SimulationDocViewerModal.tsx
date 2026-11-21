import React from 'react';
import { FileText, Printer, X, AlertCircle } from 'lucide-react';
import { SimulationMockDocument } from '../../types/simulation';

interface SimulationDocViewerModalProps {
  document: SimulationMockDocument | null;
  onClose: () => void;
}

export const SimulationDocViewerModal: React.FC<SimulationDocViewerModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ne">
      <head>
        <meta charset="utf-8" />
        <title>${document.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&display=swap" rel="stylesheet"/>
        <style>
          body { font-family: 'Mukta', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #334155; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 800; color: #0f172a; }
          .meta { font-size: 13px; color: #64748b; margin-top: 6px; }
          .body-content { font-size: 14px; white-space: pre-wrap; font-family: inherit; }
          .footer { margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${document.title}</div>
          <div class="meta">${document.issuer ?? 'सार्वजनिक खरिद नमुना कागजात'} · ${document.date ?? 'मिति: २०८१'}</div>
          ${document.referenceNo ? `<div class="meta">पत्र संख्या / चलानी: ${document.referenceNo}</div>` : ''}
        </div>
        <div class="body-content">${document.content}</div>
        <div class="footer">सार्वजनिक खरिद व्यावहारिक अभ्यासशाला — काल्पनिक शैक्षिक नमुना कागजात</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const getDocBadge = (type: SimulationMockDocument['documentType']) => {
    switch (type) {
      case 'bid-bond': return { label: 'बैंक जमानत (Bid Bond)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'boq-sheet': return { label: 'BOQ / दर विश्लेषण पाना', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'jv-agreement': return { label: 'संयुक्त उपक्रम सम्झौता (JV)', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'office-memo': return { label: 'कार्यालय टिप्पणी तथा आदेश', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'tax-clearance': return { label: 'कर चुक्ता / योग्यता कागजात', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      default: return { label: 'खरिद नमुना कागजात', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const badge = getDocBadge(document.documentType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#123f6d]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-slate-400">काल्पनिक नमुना परीक्षण</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{document.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="प्रिन्ट / PDF सेभ गर्नुहोस्"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" />
              प्रिन्ट
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-6 space-y-4">
          {/* Official Letterhead simulation styling */}
          <div className="rounded-2xl border-2 border-slate-300 bg-amber-50/20 p-6 shadow-inner font-serif">
            <div className="text-center border-b border-slate-300 pb-3 mb-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-sans font-semibold">
                {document.issuer ?? 'काल्पनिक सार्वजनिक निकाय / अधिकृत संस्था'}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1 font-sans">{document.title}</h3>
              <div className="mt-2 flex flex-wrap justify-between text-xs text-slate-600 font-sans">
                <span>{document.referenceNo ? `पत्र संख्या / चलानी: ${document.referenceNo}` : ''}</span>
                <span>{document.date ? `मिति: ${document.date}` : 'मिति: २०८१/०२/१५'}</span>
              </div>
            </div>

            <div className="whitespace-pre-line text-sm leading-relaxed text-slate-800 font-sans font-normal">
              {document.content}
            </div>
          </div>

          {/* Notes or inspection checkpoints */}
          {document.notes && document.notes.length > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <AlertCircle className="h-4 w-4 text-blue-700" />
                कागजात परीक्षण गर्दा ध्यान दिनुपर्ने पक्षहरू (Inspection Checkpoints):
              </div>
              <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-blue-800">
                {document.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <p className="text-xs text-slate-500">
            यो अभ्यासका लागि तयार गरिएको काल्पनिक नमुना कागजात हो।
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#123f6d] px-4 py-2 text-xs font-bold text-white hover:bg-[#174f7e]"
          >
            कागजात बन्द गरी प्रश्नमा फर्कनुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
