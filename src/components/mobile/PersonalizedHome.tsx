import React, { useState } from 'react';
import { Restaurant, City, SearchFilterState } from '../../types';
import {
  Sparkles,
  Star,
  Zap,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  MapPin,
  UtensilsCrossed,
  Heart,
} from 'lucide-react';
import { TASTE_OPTIONS, TasteOption } from './TastePersonalizeModal';
import { ReservationQuickFilterBar } from './ReservationQuickFilterBar';

interface PersonalizedHomeProps {
  restaurants: Restaurant[];
  currentCity: City;
  filterState?: SearchFilterState;
  userTastes: string[];
  onOpenTastePicker: () => void;
  onOpenPreferences?: () => void;
  onSelectRestaurant: (restaurant: Restaurant, initialSlotTime?: string) => void;
}

export const PersonalizedHome: React.FC<PersonalizedHomeProps> = ({
  restaurants,
  currentCity,
  filterState,
  userTastes,
  onOpenTastePicker,
  onOpenPreferences,
  onSelectRestaurant,
}) => {
  // If no tastes selected yet, default to first 3
  const activeTastes = userTastes.length > 0 ? userTastes : ['Fast Food', 'Mexican', 'Japanese'];

  // Helper to get taste metadata
  const getTasteConfig = (tasteId: string): TasteOption | undefined => {
    return TASTE_OPTIONS.find(
      (t) => t.id.toLowerCase() === tasteId.toLowerCase() || t.label.toLowerCase() === tasteId.toLowerCase()
    );
  };

  // Helper to filter restaurants for a specific taste/cuisine
  const getRestaurantsForTaste = (tasteId: string) => {
    const q = tasteId.toLowerCase();
    const matches = restaurants.filter((r) => {
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      const matchName = r.name.toLowerCase().includes(q);
      const matchTag = r.tagline.toLowerCase().includes(q);
      return matchCuisine || matchCat || matchName || matchTag;
    });

    if (matches.length > 0) return matches;

    // Fallback: Return top rated if specific cuisine has only 1 or 2
    return restaurants.slice(0, 5);
  };

  const renderCard = (r: Restaurant) => {
    const isInstant = r.confirmationMethod === 'INSTANT';
    return (
      <div
        key={r.id}
        onClick={() => onSelectRestaurant(r)}
        className="w-68 sm:w-76 shrink-0 bg-white rounded-2xl border border-neutral-100 shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <img
            src={r.heroImage}
            alt={r.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5">
            {isInstant ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-900 shadow-xs">
                <Zap className="w-2.5 h-2.5 fill-neutral-900" />
                Instant Confirm
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-neutral-700 shadow-xs">
                <Clock className="w-2.5 h-2.5 text-neutral-500" />
                Manual Confirm
              </span>
            )}
          </div>
          <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {r.rating.toFixed(1)}
            <span className="text-[10px] text-neutral-300">({r.reviewCount})</span>
          </div>
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h4 className="font-bold text-neutral-900 text-xs tracking-tight group-hover:text-[#002b49] transition-colors line-clamp-1">
                {r.name}
              </h4>
              <span className="text-[11px] font-semibold text-neutral-400 shrink-0">
                {r.priceTier}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
              {r.cuisine} • {r.branches[0]?.area || currentCity}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              High Taste Match
            </span>
            <span className="text-xs font-bold text-[#002b49] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Book table <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in-50 duration-200">
      {/* Top Header & Selected Taste Badges (Uber Eats inspiration from image_7d902a80.png) */}
      <div className="px-4 pt-1 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored For You
            </div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Personalized Recommendations
            </h2>
          </div>
          <button
            onClick={onOpenTastePicker}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#002b49] text-white text-xs font-bold shadow-xs hover:bg-[#003860] active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-3 h-3" />
            Customize
          </button>
        </div>

        {/* Quick Filter Capsule Bar */}
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
        />

        {/* Selected 3 Circular Taste Chips Row (Uber Eats inspired circular avatar row) */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {activeTastes.map((tasteId) => {
            const config = getTasteConfig(tasteId);
            return (
              <div
                key={tasteId}
                onClick={onOpenTastePicker}
                className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs hover:border-[#002b49] transition-all cursor-pointer"
              >
                {config?.image && (
                  <img
                    src={config.image}
                    alt={tasteId}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span className="text-xs font-bold text-neutral-800">{tasteId}</span>
              </div>
            );
          })}
          <button
            onClick={onOpenTastePicker}
            className="shrink-0 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-semibold transition-colors"
          >
            + Add more
          </button>
        </div>
      </div>

      {/* FEATURED STANDOUT HERO (Uber Eats inspiration from image_7d902a80.png) */}
      <section className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Featured on TableCraft
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Hand-picked dining experiences matching your taste profile
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {restaurants.slice(0, 5).map((r) => renderCard(r))}
        </div>
      </section>

      {/* CAROUSEL 1: Top 10 for Taste 1 (Uber Eats inspiration from image_a2c49bd2.png) */}
      {activeTastes[0] && (
        <section className="space-y-3">
          <div className="px-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Top 10 {activeTastes[0]} spots
              </h3>
              <p className="text-xs text-neutral-500">
                Highest customer rated {activeTastes[0]} tables in {currentCity}
              </p>
            </div>
            <span className="text-xs font-bold text-[#002b49] flex items-center gap-0.5">
              Top 10 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
            {getRestaurantsForTaste(activeTastes[0]).map((r) => renderCard(r))}
          </div>
        </section>
      )}

      {/* CAROUSEL 2: Top 10 for Taste 2 */}
      {activeTastes[1] && (
        <section className="space-y-3">
          <div className="px-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Top 10 {activeTastes[1]} spots
              </h3>
              <p className="text-xs text-neutral-500">
                Curated dining for {activeTastes[1]} lovers
              </p>
            </div>
            <span className="text-xs font-bold text-[#002b49] flex items-center gap-0.5">
              Top 10 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
            {getRestaurantsForTaste(activeTastes[1]).map((r) => renderCard(r))}
          </div>
        </section>
      )}

      {/* CAROUSEL 3: Top 10 for Taste 3 */}
      {activeTastes[2] && (
        <section className="space-y-3">
          <div className="px-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-neutral-900 text-base tracking-tight">
                Top 10 {activeTastes[2]} spots
              </h3>
              <p className="text-xs text-neutral-500">
                Top rated {activeTastes[2]} dining in town
              </p>
            </div>
            <span className="text-xs font-bold text-[#002b49] flex items-center gap-0.5">
              Top 10 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
            {getRestaurantsForTaste(activeTastes[2]).map((r) => renderCard(r))}
          </div>
        </section>
      )}

      {/* SECTION 4: Restaurants Near You */}
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
              Closest spots in {currentCity}
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar">
          {restaurants
            .filter((r) => r.city === currentCity)
            .slice(0, 6)
            .map((r) => renderCard(r))}
        </div>
      </section>
    </div>
  );
};
