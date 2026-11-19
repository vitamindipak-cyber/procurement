import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getPageCoach } from '../data/beginnerJourney';

interface BeginnerCoachBarProps {
  activeTab: string;
  userMode: 'entity' | 'bidder';
  onNavigate: (tab: string) => void;
}

export const BeginnerCoachBar: React.FC<BeginnerCoachBarProps> = ({
  activeTab,
  userMode,
  onNavigate,
}) => {
  const coach = getPageCoach(activeTab, userMode);
  if (!coach) return null;
  const isBidder = userMode === 'bidder';

  return (
    <section
      aria-label="यस पृष्ठमा के गर्ने"
      className={`mb-5 flex flex-col gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
        isBidder ? 'border-emerald-200' : 'border-blue-200'
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isBidder ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${isBidder ? 'text-emerald-700' : 'text-blue-800'}`}>
            सरल मार्ग · {coach.where}
          </p>
          <h2 className="text-sm font-bold text-slate-950">{coach.title}</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{coach.body}</p>
        </div>
      </div>
      {coach.actionLabel && coach.actionTab && (
        <button
          type="button"
          onClick={() => onNavigate(coach.actionTab!)}
          className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white transition-colors ${
            isBidder ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-[#1a4b82] hover:bg-[#15396a]'
          }`}
        >
          {coach.actionLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </section>
  );
};
