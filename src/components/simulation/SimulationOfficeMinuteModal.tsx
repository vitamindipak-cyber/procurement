import React, { useState } from 'react';
import { Copy, Check, Printer, X, FileText } from 'lucide-react';
import { SimulationAttempt, SimulationCaseVersion } from '../../types/simulation';

interface SimulationOfficeMinuteModalProps {
  simulationCase: SimulationCaseVersion | null;
  attempt: SimulationAttempt | null;
  displayName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationOfficeMinuteModal: React.FC<SimulationOfficeMinuteModalProps> = ({
  simulationCase,
  attempt,
  displayName,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !simulationCase || !attempt || !attempt.result) return null;

  const result = attempt.result;
  const todayNepali = new Date().toLocaleDateString('ne-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const minuteContent = `नेपाल सरकार / सार्वजनिक निकाय
खरिद एकाइ / मूल्याङ्कन समिति
शाखा: प्रशासन तथा खरिद शाखा

विषय: ${simulationCase.content.title} सम्बन्धमा मूल्याङ्कन तथा निर्णय टिप्पणी।

श्रीमान् कार्यालय प्रमुख ज्यू,

उपर्युक्त विषयमा यस कार्यालयको स्वीकृत वार्षिक खरिद कार्यक्रमअनुसार सञ्चालित खरिद प्रक्रियाको मूल्याङ्कन तथा परीक्षण कार्य सम्पन्न भई देहायबमोजिमको व्यहोरा निर्णयार्थ पेश गर्दछु:

१. खरिद परिदृश्य तथा आवश्यकता:
${simulationCase.content.scenario}

२. मूल्याङ्कन तथा परीक्षणका मुख्य निष्कर्षहरू:
${result.breakdown.map((row, idx) => `  (${idx + 1}) प्रश्न/चरण: ${row.stepId}
      - प्राप्ताङ्क: ${row.pointsEarned}/${row.pointsAvailable} (${row.isCorrect ? 'कानुनसम्मत' : 'त्रुटिपूर्ण'})
      - कानुनी ठहर: ${row.explanation}
      - निष्कर्ष: ${row.correctAnswer}`).join('\n\n')}

३. आकर्षित कानुनी आधार तथा कार्यविधि:
  - सार्वजनिक खरिद ऐन, २०६३ तथा सार्वजनिक खरिद नियमावली, २०६४ (पन्ध्रौँ संशोधनसहित)
  - सार्वजनिक खरिद अनुगमन कार्यालय (PPMO) को निर्देशिका तथा बोलपत्र कागजातका शर्तहरू
  - सम्बन्धित नजिर तथा ऐतिहासिक पुनरावलोकन निर्णयहरू

४. पेश भएको राय तथा निर्णय प्रस्ताव:
उपर्युक्त मूल्याङ्कन विश्लेषणका आधारमा खरिद प्रक्रियालाई मितव्ययी, पारदर्शी, प्रतिस्पर्धी र प्रचलित सार्वजनिक खरिद कानुनबमोजिम अगाडि बढाउन मूल्याङ्कन समितिको सिफारिसअनुसार निर्णयका लागि सादर पेश गर्दछु।

पेश गर्ने अधिकृत / अभ्यासकर्ता: ${displayName || 'अधिकृत'}
प्राप्त मूल्याङ्कन अङ्क: ${result.score}/100
मिति: ${todayNepali}
--------------------------------------------------
आदेश / निर्णय:
"पेश भएबमोजिम प्रचलित कानुन र कार्यविधिका आधारमा कारबाही अगाडि बढाउन स्वीकृति प्रदान गरिएको छ।"

कार्यालय प्रमुख / अख्तियारप्राप्त अधिकारी`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(minuteContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ne">
      <head>
        <meta charset="utf-8" />
        <title>टिप्पणी तथा आदेश — ${simulationCase.content.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&display=swap" rel="stylesheet"/>
        <style>
          body { font-family: 'Mukta', sans-serif; padding: 40px 50px; color: #1e293b; line-height: 1.7; font-size: 14px; }
          .office-header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px; }
          .office-title { font-size: 18px; font-weight: 800; }
          .office-sub { font-size: 13px; color: #475569; }
          .memo-subject { font-size: 16px; font-weight: 700; margin: 18px 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
          .memo-body { white-space: pre-line; margin-bottom: 30px; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .sign-box { border-top: 1px dotted #64748b; padding-top: 6px; width: 220px; text-align: center; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="office-header">
          <div class="office-title">नेपाल सरकार / सार्वजनिक निकाय</div>
          <div class="office-sub">सार्वजनिक खरिद मूल्याङ्कन टिप्पणी तथा आदेश मस्यौदा</div>
        </div>
        <div class="memo-body">${minuteContent}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123f6d] text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">कार्यालय टिप्पणी तथा निर्णय मस्यौदा</h2>
              <p className="text-xs text-slate-500">
                अभ्यासका आधारमा तयार भएको औपचारिक नेपाली टिप्पणी मस्यौदा
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'कपि भयो!' : 'कपि गर्नुहोस्'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
        <div className="overflow-y-auto p-6 font-serif">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 whitespace-pre-line text-sm leading-relaxed text-slate-800 shadow-inner">
            {minuteContent}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-xs text-slate-500">
            यो मस्यौदालाई वास्तविक कार्यालयको फाइल वा टिप्पणी उठाउँदा सन्दर्भ सामग्रीका रूपमा प्रयोग गर्न सकिन्छ।
          </span>
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
