import React from 'react';
import { Restaurant, City, SearchFilterState } from '../../types';
import {
  Star,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Flame,
  Wine,
  Heart,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Users,
} from 'lucide-react';
import { ReservationQuickFilterBar } from './ReservationQuickFilterBar';

interface SectionBySectionHomeProps {
  restaurants: Restaurant[];
  currentCity: City;
  filterState?: SearchFilterState;
  onSelectRestaurant: (restaurant: Restaurant, initialSlotTime?: string) => void;
  onOpenPreferences?: () => void;
  onSeeAllSection?: (sectionKey: string) => void;
}

const DINNER_TIME_PILLS = [
  '18:30',
  '19:00',
  '19:30',
  '20:00',
];

export const SectionBySectionHome: React.FC<SectionBySectionHomeProps> = ({
  restaurants,
  currentCity,
  filterState,
  onSelectRestaurant,
  onOpenPreferences,
  onSeeAllSection,
}) => {
  // Filter helper
  const availableTonight = restaurants.filter(
    (r) => r.branches.some((b) => b.slots.length > 0)
  );

  const romanticSpots = restaurants.filter(
    (r) =>
      r.vibes?.includes('romantic') ||
      r.category.toLowerCase().includes('romantic') ||
      r.tagline.toLowerCase().includes('romantic') ||
      r.rating >= 4.7
  );

  const premiumSpots = restaurants.filter(
    (r) =>
      r.vibes?.includes('premium') ||
      r.priceTier === '$$$' ||
      r.priceTier === '$$$$' ||
      r.rating >= 4.8
  );

  const drinkAndDineSpots = restaurants.filter(
    (r) =>
      r.vibes?.includes('drink_dine') ||
      r.vibes?.includes('party') ||
      r.facilities.includes('Bar') ||
      r.facilities.includes('Cocktails')
  );

  const nearYouSpots = restaurants.filter((r) => r.city === currentCity);

  // Quick slot label formatter
  const formatSlotLabel = (time: string) => {
    const [hStr, mStr] = time.split(':');
    const h = parseInt(hStr, 10);
    const m = mStr || '00';
    if (isNaN(h)) return time;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const renderRestaurantCard = (
    r: Restaurant,
    options?: { showTimeSlots?: boolean; widthClass?: string }
  ) => {
    const isInstant = r.confirmationMethod === 'INSTANT';
    const width = options?.widthClass || 'w-72 sm:w-80';
    const showSlots = options?.showTimeSlots ?? true;

    // Grab up to 4 available slots from first branch
    const slots = (r.branches[0]?.slots || []).slice(0, 4);

    return (
      <div
        key={r.id}
        onClick={() => onSelectRestaurant(r)}
        className={`${width} shrink-0 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group`}
      >
        {/* Hero image with badge */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <img
            src={r.heroImage}
            alt={r.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Confirmation Tag */}
          <div className="absolute top-2.5 left-2.5">
            {isInstant ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-neutral-900 shadow-xs">
                <Zap className="w-3 h-3 fill-neutral-900" />
                Instant Confirm
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-neutral-700 shadow-xs">
                <Clock className="w-3 h-3 text-neutral-500" />
                Manual Confirm
              </span>
            )}
          </div>

          {/* Rating pill on image bottom right */}
          <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white text-xs font-bold">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{r.rating.toFixed(1)}</span>
            <span className="text-[10px] text-neutral-300">({r.reviewCount})</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h4 className="font-bold text-neutral-900 text-sm tracking-tight line-clamp-1 group-hover:text-[#002b49] transition-colors">
                {r.name}
              </h4>
              <span className="text-xs font-semibold text-neutral-400 shrink-0">
                {r.priceTier}
              </span>
            </div>

            <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
              {r.cuisine} • {r.branches[0]?.area || currentCity}
            </p>
          </div>

          {/* Live Time Slots Row (OpenTable inspiration) */}
          {showSlots && (
            <div className="mt-3 pt-2.5 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Select a time
                </span>
                <span className="text-[10px] font-medium text-amber-600">
                  Available tonight
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {(slots.length > 0 ? slots.map((s) => s.time) : DINNER_TIME_PILLS).map(
                  (slotTime) => (
                    <button
                      key={slotTime}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRestaurant(r, slotTime);
                      }}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-[#002b49]/8 hover:bg-[#002b49] text-[#002b49] hover:text-white text-[11px] font-bold transition-all active:scale-95 border border-[#002b49]/15"
                      title={`Book ${formatSlotLabel(slotTime)}`}
                    >
                      {formatSlotLabel(slotTime)}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
      {/* City greeting & quick search filter summary */}
      <div className="px-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Explore Tables
            </p>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Good evening in {currentCity}
            </h2>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700">
            <MapPin className="w-3.5 h-3.5 text-[#002b49]" />
            <span>{currentCity}</span>
          </div>
        </div>

        {/* Quick Filter Capsule Pill */}
        <ReservationQuickFilterBar
          filterState={
            filterState || {
              city: currentCity,
              area: '',
              searchQuery: '',
              cuisine: 'All',
              priceTier: 'all',
              minRating: 0,
              date: new Date().toISOString().split('T')[0],
              timeSlot: '19:00',
              partySize: 2,
              confirmationMethod: 'ALL',
              selectedFacilities: [],
              sortBy: 'recommended',
            }
          }
          onOpenPreferences={onOpenPreferences}
          className="mt-3"
        />
      </div>

      {/* SECTION 1: Available For Dinner Tonight (with direct time pills) */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Available for dinner tonight
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Live seatings ready to reserve instantly
            </p>
          </div>
          {onSeeAllSection && (
            <button
              onClick={() => onSeeAllSection('tonight')}
              className="text-xs font-bold text-[#002b49] flex items-center gap-0.5 hover:underline"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {availableTonight.slice(0, 6).map((r) =>
            renderRestaurantCard(r, { showTimeSlots: true, widthClass: 'w-72 sm:w-80' })
          )}
        </div>
      </section>

      {/* SECTION 2: Romantic Vibes for Date Night */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Romantic vibes for date night
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Intimate candlelight, cozy booths & wine pairings
            </p>
          </div>
          {onSeeAllSection && (
            <button
              onClick={() => onSeeAllSection('romantic')}
              className="text-xs font-bold text-[#002b49] flex items-center gap-0.5 hover:underline"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {romanticSpots.slice(0, 6).map((r) =>
            renderRestaurantCard(r, { showTimeSlots: true, widthClass: 'w-68 sm:w-76' })
          )}
        </div>
      </section>

      {/* SECTION 3: Premium Dining & Top-Rated */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Premium dining & Chef's tables
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Award-winning culinary craft & tasting menus
            </p>
          </div>
          {onSeeAllSection && (
            <button
              onClick={() => onSeeAllSection('premium')}
              className="text-xs font-bold text-[#002b49] flex items-center gap-0.5 hover:underline"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {premiumSpots.slice(0, 6).map((r) =>
            renderRestaurantCard(r, { showTimeSlots: true, widthClass: 'w-68 sm:w-76' })
          )}
        </div>
      </section>

      {/* SECTION 4: Drink & Dine / Happy Hours */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-purple-600" />
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Drink & Dine • Cocktail bars
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Mixology, rooftop views & casual dinner drinks
            </p>
          </div>
          {onSeeAllSection && (
            <button
              onClick={() => onSeeAllSection('drink_dine')}
              className="text-xs font-bold text-[#002b49] flex items-center gap-0.5 hover:underline"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {drinkAndDineSpots.slice(0, 6).map((r) =>
            renderRestaurantCard(r, { showTimeSlots: true, widthClass: 'w-68 sm:w-76' })
          )}
        </div>
      </section>

      {/* SECTION 5: Restaurants Near You */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#002b49]" />
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Restaurants near you
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Within walking and quick drive distance in {currentCity}
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {nearYouSpots.slice(0, 8).map((r) =>
            renderRestaurantCard(r, { showTimeSlots: false, widthClass: 'w-64 sm:w-72' })
          )}
        </div>
      </section>
    </div>
  );
};
