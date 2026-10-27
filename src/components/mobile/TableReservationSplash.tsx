import React, { useEffect, useState } from 'react';
import {
  UtensilsCrossed,
  ShieldCheck,
  ChevronLeft,
  LayoutGrid,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { HomeScreenMode } from '../../types';

interface TableReservationSplashProps {
  onFindTable: (mode?: HomeScreenMode) => void;
  onBackToHub: () => void;
}

export const TableReservationSplash: React.FC<TableReservationSplashProps> = ({
  onFindTable,
  onBackToHub,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 3.5s timer to allow user to pick an entry point or auto-advance
    const startTime = Date.now();
    const duration = 3800;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        onFindTable('SECTION_BY_SECTION');
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onFindTable]);

  return (
    <div className="min-h-full bg-[#f8f9fa] text-neutral-900 flex flex-col justify-between p-5 select-none relative overflow-y-auto">
      {/* Top Bar with gentle Back and Skip controls */}
      <div className="w-full flex items-center justify-between z-10 shrink-0">
        <button
          onClick={onBackToHub}
          className="w-9 h-9 rounded-full bg-white hover:bg-neutral-100 active:scale-95 text-neutral-700 border border-neutral-200/80 shadow-xs flex items-center justify-center transition-all cursor-pointer"
          title="Back to Mini Apps"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => onFindTable('SECTION_BY_SECTION')}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 hover:bg-neutral-100 transition-colors"
        >
          Skip to Home →
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-5">
        {/* App Logo Emblem */}
        <div className="relative group text-center">
          <div className="relative w-16 h-16 mx-auto rounded-2xl bg-[#002b49] text-amber-400 flex items-center justify-center shadow-xl shadow-[#002b49]/20 ring-1 ring-black/5">
            <UtensilsCrossed className="w-8 h-8 stroke-[2.2]" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-2 ring-white" />
          </div>

          <div className="mt-2.5 space-y-0.5">
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">
              Table Reservation
            </h1>
            <p className="text-xs text-neutral-500">
              Select your preferred browsing entry point:
            </p>
          </div>
        </div>

        {/* The 3 Entry Points (User Request) */}
        <div className="w-full max-w-sm space-y-2.5">
          {/* Entry Point 1: Section by Section */}
          <button
            type="button"
            onClick={() => onFindTable('SECTION_BY_SECTION')}
            className="w-full text-left p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-[#002b49] shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[#002b49]/8 text-[#002b49] group-hover:bg-[#002b49] group-hover:text-amber-400 flex items-center justify-center shrink-0 transition-colors">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-neutral-900 group-hover:text-[#002b49] transition-colors">
                  1. Section by Section
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                Horizontal rows, near you, romantic vibes & live dinner slots
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#002b49] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Entry Point 2: Minimized Section */}
          <button
            type="button"
            onClick={() => onFindTable('MINIMIZED')}
            className="w-full text-left p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-[#002b49] shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-neutral-900 group-hover:text-purple-700 transition-colors">
                  2. Minimized Section
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                "What are you looking for?" Party vibes, romantic, buffet & map
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* Entry Point 3: Personalized Taste Match */}
          <button
            type="button"
            onClick={() => onFindTable('PERSONALIZED')}
            className="w-full text-left p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-[#002b49] shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-neutral-900 group-hover:text-rose-600 transition-colors">
                  3. Personalized Match
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                  Pick 3
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                Pick 3 favorite cuisines (Fast food, Mexican, etc.) for custom carousels
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>

        {/* Progress bar timer */}
        <div className="w-44 space-y-1.5 pt-1">
          <div className="h-1.5 w-full bg-neutral-200/90 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#002b49] to-amber-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
            <span>Auto-launching default</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Lockup with ABA Mobile Identity */}
      <div className="z-10 flex flex-col items-center justify-center space-y-1 pt-1 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 tracking-tight">
          <span>ABA</span>
          <span className="text-red-500 font-serif -ml-0.5 mr-0.5">'</span>
          <span>Mini Apps</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Partner Service · No-show protection</span>
        </div>
      </div>
    </div>
  );
};
