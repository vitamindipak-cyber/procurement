import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass } from 'lucide-react';
import { BeginnerStep, getBeginnerSteps } from '../data/beginnerJourney';
import { BeginnerTooltip } from './BeginnerTooltip';

interface BeginnerJourneyProps {
  audience: 'entity' | 'bidder';
  highlightStageId?: string | null;
  onOpen: (step: BeginnerStep) => void;
}

function readStoredIds(key: string): string[] {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export const BeginnerJourney: React.FC<BeginnerJourneyProps> = ({
  audience,
  highlightStageId,
  onOpen,
}) => {
  const steps = getBeginnerSteps(audience);
  const isBidder = audience === 'bidder';
  const storageKey = `beginner_read_${audience}`;
  const selectedKey = `beginner_selected_${audience}`;
  const [readIds, setReadIds] = useState<string[]>(() => readStoredIds(storageKey));
  const [selectedId, setSelectedId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(selectedKey);
      if (saved && steps.some((step) => step.id === saved)) return saved;
    } catch {
      // ignore storage errors
    }
    return steps[0].id;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(readIds));
      localStorage.setItem(selectedKey, selectedId);
    } catch {
      // ignore storage errors
    }
  }, [readIds, selectedId, selectedKey, storageKey]);

  const selectedIndex = Math.max(0, steps.findIndex((step) => step.id === selectedId));
  const selected = steps[selectedIndex];
  const projectStep = steps.find((step) => step.stageId && step.stageId === highlightStageId);

  const markRead = (stepId: string) => {
    setReadIds((current) => (current.includes(stepId) ? current : [...current, stepId]));
  };

  const goTo = (index: number) => {
    const next = steps[index];
    if (next) setSelectedId(next.id);
  };

  return (
    <section
      id="beginner-journey"
      aria-labelledby="beginner-journey-title"
      className="rounded-2xl border border-slate-200 bg-white shadow-xs"
    >
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <p className={`text-[11px] font-bold uppercase tracking-wider ${isBidder ? 'text-emerald-700' : 'text-[#123f6d]'}`}>
              {isBidder ? 'बोलपत्रदाताका लागि सरल मार्ग' : 'सार्वजनिक निकायका लागि सरल मार्ग'}
            </p>
            <h2 id="beginner-journey-title" className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              {isBidder ? 'सूचनादेखि बोलपत्र पेश गर्नेसम्म' : 'खरिद प्रक्रिया, एक पटकमा एउटा चरण'}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {isBidder
                ? 'नयाँ हुनुहुन्छ भने चरण १ बाट सुरु गर्नुहोस्। प्रत्येक चरणमा के गर्ने र के नबिर्सने लेखिएको छ।'
                : 'नयाँ हुनुहुन्छ भने चरण १ बाट सुरु गर्नुहोस्। चरण छानेपछि के गर्ने, के नबिर्सने र कुन पृष्ठ खोल्ने देखिन्छ।'}
            </p>
          </div>
          <p className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isBidder ? 'bg-emerald-50 text-emerald-800' : 'bg-[#eff5fc] text-[#123f6d]'}`}>
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            {readIds.length}/{steps.length} चरण पढियो
          </p>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6">
        <ol className="flex gap-2 overflow-x-auto pb-1" aria-label="खरिदका चरण">
          {steps.map((step, index) => {
            const isSelected = step.id === selected.id;
            const isRead = readIds.includes(step.id);
            const isProjectHere = projectStep?.id === step.id;
            return (
              <li key={step.id} className="min-w-[8.5rem] flex-1">
                <button
                  type="button"
                  onClick={() => setSelectedId(step.id)}
                  aria-current={isSelected ? 'step' : undefined}
                  className={`flex h-full w-full flex-col rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? isBidder
                        ? 'border-emerald-700 bg-emerald-800 text-white'
                        : 'border-[#123f6d] bg-[#123f6d] text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-white/80' : isBidder ? 'text-emerald-700' : 'text-[#123f6d]'}`}>
                      चरण {step.number}
                    </span>
                    {isRead && (
                      <Check className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} aria-label="पढिसकिएको" />
                    )}
                  </span>
                  <span className="mt-1 text-xs font-bold leading-snug">{step.title}</span>
                  {isProjectHere && (
                    <span className={`mt-1.5 text-[10px] font-semibold ${isSelected ? 'text-white/80' : 'text-amber-700'}`}>
                      आयोजना अहिले यहाँ
                    </span>
                  )}
                  <span className="sr-only">{index + 1}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className={`mt-4 rounded-2xl border p-4 sm:p-5 ${isBidder ? 'border-emerald-100 bg-emerald-50/40' : 'border-[#dce7f3] bg-[#f6f9fc]'}`}>
          <p className={`text-[11px] font-bold uppercase tracking-wider ${isBidder ? 'text-emerald-800' : 'text-[#123f6d]'}`}>
            चरण {selected.number} · अहिले यो गर्नुहोस्
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{selected.title}</h3>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-700">{selected.plain}</p>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
            <div className="rounded-xl border border-white/80 bg-white p-4">
              <h4 className="text-xs font-bold text-slate-900">के गर्ने</h4>
              <ul className="mt-2 space-y-2">
                {selected.doNow.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${isBidder ? 'bg-emerald-600' : 'bg-[#123f6d]'}`} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h4 className="text-xs font-bold text-amber-950">ध्यान दिनुहोस्</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-amber-950">{selected.watchOut}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-bold text-slate-900">यो चरणपछि</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{selected.result}</p>
              </div>
            </div>
          </div>

          {selected.terms && selected.terms.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">शब्दको अर्थ</span>
              {selected.terms.map((term) => (
                <BeginnerTooltip key={term.word} title={term.word} content={term.meaning} position="top">
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {term.word}
                  </span>
                </BeginnerTooltip>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => goTo(selectedIndex - 1)}
                disabled={selectedIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                अघिल्लो
              </button>
              <button
                type="button"
                onClick={() => goTo(selectedIndex + 1)}
                disabled={selectedIndex === steps.length - 1}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                अर्को चरण
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => markRead(selected.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  readIds.includes(selected.id)
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                {readIds.includes(selected.id) ? 'पढिसकिएको' : 'यो चरण बुझेँ'}
              </button>
              <button
                type="button"
                onClick={() => {
                  markRead(selected.id);
                  onOpen(selected);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-white transition-colors ${
                  isBidder ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-[#123f6d] hover:bg-[#0e3359]'
                }`}
              >
                {selected.actionLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          यो मार्गदर्शनले प्रक्रिया बुझ्न सहयोग गर्छ। अन्तिम निर्णय सार्वजनिक खरिद ऐन, नियमावली र तपाईंको कार्यालयको सूचनाअनुसार लिनुहोस्।
        </p>
      </div>
    </section>
  );
};
