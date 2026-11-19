import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Calculator, 
  ClipboardList, 
  Search,
  Scale,
  FileCheck,
  Building2
} from 'lucide-react';

interface FlowStep {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const flowSteps: FlowStep[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'पूर्वतयारी',
    description: 'खरिद योजना तयार, बजेट सुनिश्चित, र कार्यालय स्वीकृति',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 'step-2',
    number: 2,
    title: 'लागत अनुमान',
    description: 'विस्तृत लागत अनुमान तयार र अनुमोदन',
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    id: 'step-3',
    number: 3,
    title: 'सूचना जारी',
    description: 'बोलपत्र/दरभाउपत्र आह्वानको सार्वजनिक सूचना',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    id: 'step-4',
    number: 4,
    title: 'प्रस्ताव प्राप्त',
    description: 'बोलपत्र/दरभाउपत्र दर्ता र खोल्ने',
    icon: <Search className="w-5 h-5" />,
  },
  {
    id: 'step-5',
    number: 5,
    title: 'मूल्याङ्कन',
    description: 'प्राविधिक र आर्थिक मूल्याङ्कन गरी छनोट',
    icon: <Scale className="w-5 h-5" />,
  },
  {
    id: 'step-6',
    number: 6,
    title: 'सम्झौता',
    description: 'आशयको सूचना, जमानत, र सम्झौता हस्ताक्षर',
    icon: <FileCheck className="w-5 h-5" />,
  },
  {
    id: 'step-7',
    number: 7,
    title: 'कार्यान्वयन',
    description: 'काम/आपूर्ति सुरु, अनुगमन, र अन्तिम भुक्तानी',
    icon: <Building2 className="w-5 h-5" />,
  },
];

interface ProcurementFlowchartProps {
  className?: string;
  interactive?: boolean;
}

export const ProcurementFlowchart: React.FC<ProcurementFlowchartProps> = ({
  className = '',
  interactive = false,
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">सार्वजनिक खरिद प्रक्रियाको ७ चरण</h2>
        <p className="text-xs text-slate-600">
          यो फ्लोचार्टले सार्वजनिक खरिद प्रक्रियाको समग्र चरणहरू देखाउँछ। प्रत्येक चरणमा क्लिक गरी विस्तृत जानकारी प्राप्त गर्नुहोस्।
        </p>
      </div>

      {/* Desktop: Horizontal Flowchart */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between gap-2">
          {flowSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  interactive ? 'hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer' : ''
                } bg-slate-50 border-slate-200`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{step.title}</h3>
                    <p className="text-[10px] text-slate-600 truncate">{step.description}</p>
                  </div>
                  <div className="text-blue-600 shrink-0">{step.icon}</div>
                </div>
              </div>
              {index < flowSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet: Vertical Flowchart */}
      <div className="lg:hidden space-y-3">
        {flowSteps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
              interactive ? 'hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer' : ''
            } bg-slate-50 border-slate-200`}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {step.number}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
            </div>
            <div className="text-blue-600 shrink-0 mt-1">{step.icon}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span className="text-slate-600">चरण सम्पन्न</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-200 border-2 border-slate-300"></div>
            <span className="text-slate-600">चरण बाँकी</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">हालको चरण</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified mini flowchart for dashboard
export const MiniProcurementFlowchart: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 ${className}`}>
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-blue-600" />
        <span>खरिद प्रक्रिया सारांश</span>
      </h3>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {flowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-1 shrink-0">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-blue-300 flex items-center justify-center text-[10px] font-bold text-blue-700">
                {step.number}
              </div>
              <span className="text-[10px] text-slate-700 max-w-20 truncate hidden sm:block">{step.title}</span>
            </div>
            {index < flowSteps.length - 1 && (
              <ArrowRight className="w-3 h-3 text-blue-400 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
