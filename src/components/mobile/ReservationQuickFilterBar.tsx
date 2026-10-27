import React from 'react';
import { SearchFilterState } from '../../types';
import { Users, Calendar, SlidersHorizontal, Clock } from 'lucide-react';

interface ReservationQuickFilterBarProps {
  filterState: SearchFilterState;
  onOpenPreferences?: () => void;
  className?: string;
}

export const ReservationQuickFilterBar: React.FC<ReservationQuickFilterBarProps> = ({
  filterState,
  onOpenPreferences,
  className = '',
}) => {
  const partySize = filterState.partySize || 2;

  // Format time label (e.g., "19:00" -> "7:00 PM")
  const formatSlotLabel = (timeStr?: string) => {
    if (!timeStr) return '7:00 PM';
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const m = mStr || '00';
    if (isNaN(h)) return timeStr;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  // Format date label (e.g. Today -> "Tonight", Tomorrow -> "Tomorrow")
  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return 'Tonight';
    const today = new Date().toISOString().split('T')[0];
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const tmrwStr = tmrw.toISOString().split('T')[0];

    if (dateStr === today) return 'Tonight';
    if (dateStr === tmrwStr) return 'Tomorrow';

    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const timeText = formatSlotLabel(filterState.timeSlot);
  const dateText = formatDateLabel(filterState.date);
  const hasCustomPrice = filterState.priceTier && filterState.priceTier !== 'all';

  return (
    <div
      onClick={onOpenPreferences}
      className={`p-2.5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:border-[#002b49]/40 hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between text-xs text-neutral-600 group select-none ${className}`}
      role="button"
      tabIndex={0}
      title="Adjust reservation filters (guests, date, time, price)"
    >
      <div className="flex items-center gap-2 pl-1 min-w-0 flex-1 overflow-x-auto no-scrollbar">
        {/* Number of Guests */}
        <span className="inline-flex items-center gap-1.5 font-bold text-neutral-900 shrink-0">
          <Users className="w-3.5 h-3.5 text-[#002b49]" />
          <span>{partySize} {partySize === 1 ? 'Guest' : 'Guests'}</span>
        </span>

        <span className="text-neutral-300 shrink-0">•</span>

        {/* Date and Time */}
        <span className="inline-flex items-center gap-1.5 font-bold text-neutral-900 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#002b49]" />
          <span>{timeText} {dateText}</span>
        </span>

        {/* Price Tier if active */}
        {hasCustomPrice && (
          <>
            <span className="text-neutral-300 shrink-0">•</span>
            <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shrink-0 text-[11px]">
              <span>{filterState.priceTier}</span>
            </span>
          </>
        )}
      </div>

      {/* Adjust Button */}
      <div className="flex items-center gap-1 text-[11px] font-bold text-[#002b49] bg-[#002b49]/8 group-hover:bg-[#002b49] group-hover:text-white px-2.5 py-1 rounded-xl transition-all shrink-0 ml-2">
        <SlidersHorizontal className="w-3 h-3" />
        <span>Adjust</span>
      </div>
    </div>
  );
};
