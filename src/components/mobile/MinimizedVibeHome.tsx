import React, { useState, useMemo } from 'react';
import { Restaurant, RestaurantVibe, City, SearchFilterState } from '../../types';
import {
  Search,
  Sparkles,
  MapPin,
  Star,
  Zap,
  Clock,
  X,
  Compass,
  PartyPopper,
  Heart,
  Crown,
  Wine,
  Users2,
  UtensilsCrossed,
  Tag,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ReservationQuickFilterBar } from './ReservationQuickFilterBar';

interface MinimizedVibeHomeProps {
  restaurants: Restaurant[];
  currentCity: City;
  filterState?: SearchFilterState;
  onSelectRestaurant: (restaurant: Restaurant, initialSlotTime?: string) => void;
  onOpenPreferences?: () => void;
}

interface VibeCardConfig {
  id: RestaurantVibe;
  title: string;
  subtitle: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const VIBE_CATEGORIES: VibeCardConfig[] = [
  {
    id: 'party',
    title: 'Party Vibes',
    subtitle: 'Rooftops, DJs & Cocktails',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=480&q=80',
    icon: PartyPopper,
    tag: 'Lively',
  },
  {
    id: 'romantic',
    title: 'Romantic Dining',
    subtitle: 'Candlelight & Intimate Booths',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=480&q=80',
    icon: Heart,
    tag: 'Date Night',
  },
  {
    id: 'premium',
    title: 'Premium Dining',
    subtitle: 'Chef Tables & Fine Gastronomy',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=480&q=80',
    icon: Crown,
    tag: 'High-End',
  },
  {
    id: 'drink_dine',
    title: 'Drink & Dine',
    subtitle: 'Craft Beer, Wine & Tapas',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=480&q=80',
    icon: Wine,
    tag: 'Happy Hour',
  },
  {
    id: 'family',
    title: 'Family Dining',
    subtitle: 'Spacious Tables & Sharing Platters',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=480&q=80',
    icon: Users2,
    tag: 'Sharing',
  },
  {
    id: 'buffet',
    title: 'Buffet & Feasts',
    subtitle: 'All-You-Can-Eat & Weekend Brunch',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=480&q=80',
    icon: UtensilsCrossed,
    tag: 'Unlimited',
  },
];

export const MinimizedVibeHome: React.FC<MinimizedVibeHomeProps> = ({
  restaurants,
  currentCity,
  filterState,
  onSelectRestaurant,
  onOpenPreferences,
}) => {
  const [selectedVibe, setSelectedVibe] = useState<RestaurantVibe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState<'all' | 'offers' | 'top' | 'instant'>('all');
  const [showMapModal, setShowMapModal] = useState(false);

  // Filter restaurants based on active selections
  const matchingRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // City check
      if (r.city !== currentCity) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.tagline.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Vibe filter
      if (selectedVibe) {
        const hasVibe =
          r.vibes?.includes(selectedVibe) ||
          (selectedVibe === 'romantic' && r.rating >= 4.7) ||
          (selectedVibe === 'premium' && (r.priceTier === '$$$' || r.priceTier === '$$$$')) ||
          (selectedVibe === 'buffet' && r.cuisine.toLowerCase().includes('buffet')) ||
          (selectedVibe === 'party' && r.facilities.includes('Cocktails'));
        if (!hasVibe) return false;
      }

      // Quick chip
      if (activeChip === 'instant' && r.confirmationMethod !== 'INSTANT') return false;
      if (activeChip === 'top' && r.rating < 4.7) return false;

      return true;
    });
  }, [restaurants, currentCity, searchQuery, selectedVibe, activeChip]);

  return (
    <div className="space-y-5 pb-16 animate-in fade-in-50 duration-200">
      {/* Top Search Bar & City badge */}
      <div className="px-4 pt-1 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#002b49] uppercase tracking-wider">
              Minimized Explorer
            </p>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Where would you like to dine?
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 text-xs font-bold text-neutral-700 border border-neutral-200">
            <MapPin className="w-3.5 h-3.5 text-[#002b49]" />
            {currentCity}
          </span>
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

        {/* Search Input (Zomato inspiration) */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Restaurant name, vibe or cuisine..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#002b49] shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips (Zomato inspiration) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveChip(activeChip === 'offers' ? 'all' : 'offers')}
            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeChip === 'offers'
                ? 'bg-[#002b49] text-white border-[#002b49]'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <Tag className="w-3 h-3 text-amber-500" />
            ABA Offers
          </button>

          <button
            onClick={() => setActiveChip(activeChip === 'top' ? 'all' : 'top')}
            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeChip === 'top'
                ? 'bg-[#002b49] text-white border-[#002b49]'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            Near & Top Rated
          </button>

          <button
            onClick={() => setActiveChip(activeChip === 'instant' ? 'all' : 'instant')}
            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeChip === 'instant'
                ? 'bg-[#002b49] text-white border-[#002b49]'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-500" />
            Instant Only
          </button>
        </div>
      </div>

      {/* POPULAR HUB / DINING SPECIALS BANNER (Zomato inspiration) */}
      <div className="px-4">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#002b49] via-[#003860] to-[#014272] p-4 text-white overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-[70%] space-y-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Popular Hub Near You
            </div>
            <h3 className="text-sm font-black tracking-tight leading-snug">
              BKK1 & Bassac Dining Circuit
            </h3>
            <p className="text-[11px] text-neutral-200">
              Reserve with ABA Pay and get instant table seating confirmation.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-32 opacity-30 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=360&q=80"
              alt="Dining Circuit"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* "WHAT ARE YOU LOOKING FOR?" Section (Zomato inspiration from image_266103c2.png) */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
              What are you looking for?
            </h3>
            <p className="text-xs text-neutral-400">
              Tap a vibe to discover matching restaurants
            </p>
          </div>
          {selectedVibe && (
            <button
              onClick={() => setSelectedVibe(null)}
              className="text-xs font-bold text-[#002b49] hover:underline"
            >
              Reset view
            </button>
          )}
        </div>

        {/* 2x3 Grid of Visual Vibe Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {VIBE_CATEGORIES.map((cat) => {
            const isSelected = selectedVibe === cat.id;
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedVibe(isSelected ? null : cat.id)}
                className={`relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer group shadow-xs transition-all duration-200 ${
                  isSelected
                    ? 'ring-3 ring-[#002b49] ring-offset-2 scale-102 shadow-md'
                    : 'hover:shadow-md hover:scale-101 ring-1 ring-black/5'
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

                {/* Top Corner Pill Tag */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/90 backdrop-blur-xs text-neutral-800 uppercase tracking-wider">
                    {cat.tag}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <h4 className="font-bold text-xs tracking-tight leading-tight line-clamp-1">
                      {cat.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-neutral-300 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MATCHING RESTAURANTS LIST (Dynamic based on selected vibe) */}
      <section className="px-4 space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-neutral-900 text-sm tracking-tight">
              {selectedVibe
                ? `${VIBE_CATEGORIES.find((v) => v.id === selectedVibe)?.title} Spots`
                : 'Featured Restaurants'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-bold">
              {matchingRestaurants.length}
            </span>
          </div>
          {selectedVibe && (
            <span className="text-[11px] text-amber-600 font-semibold">
              Filter Active
            </span>
          )}
        </div>

        {matchingRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-neutral-100">
            <UtensilsCrossed className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-neutral-700">
              No matching spots found for this filter.
            </p>
            <button
              onClick={() => {
                setSelectedVibe(null);
                setSearchQuery('');
                setActiveChip('all');
              }}
              className="mt-2 text-xs font-bold text-[#002b49] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {matchingRestaurants.map((r) => {
              const isInstant = r.confirmationMethod === 'INSTANT';
              return (
                <div
                  key={r.id}
                  onClick={() => onSelectRestaurant(r)}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col group"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={r.heroImage}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      {isInstant ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-900 shadow-xs">
                          <Zap className="w-2.5 h-2.5 fill-neutral-900" />
                          Instant
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-neutral-700 shadow-xs">
                          <Clock className="w-2.5 h-2.5 text-neutral-500" />
                          Manual
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {r.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-neutral-900 text-xs tracking-tight group-hover:text-[#002b49] transition-colors line-clamp-1">
                        {r.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-neutral-400">
                        {r.priceTier}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                      {r.cuisine} • {r.branches[0]?.area || currentCity}
                    </p>
                    <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Table booking</span>
                      <span className="font-bold text-[#002b49] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Book table <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Map Button (Zomato inspiration) */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setShowMapModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#002b49] text-white shadow-xl hover:bg-[#003860] active:scale-95 transition-all text-xs font-bold border border-white/20"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          Map View
        </button>
      </div>

      {/* Map Preview Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#002b49]" />
                <h3 className="font-bold text-neutral-900 text-sm">
                  Dining Map • {currentCity}
                </h3>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:text-neutral-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="rounded-2xl overflow-hidden border border-neutral-200 relative aspect-video bg-neutral-100 flex flex-col items-center justify-center text-center p-4">
                <MapPin className="w-8 h-8 text-[#002b49] mb-1 animate-bounce" />
                <p className="text-xs font-bold text-neutral-800">
                  {matchingRestaurants.length} Venues in {currentCity}
                </p>
                <p className="text-[11px] text-neutral-500 max-w-xs mt-1">
                  Bassac Lane, BKK1, Riverside, and Daun Penh clusters.
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {matchingRestaurants.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setShowMapModal(false);
                      onSelectRestaurant(r);
                    }}
                    className="p-2.5 rounded-xl border border-neutral-100 hover:border-[#002b49]/30 bg-neutral-50 hover:bg-neutral-100/60 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-neutral-900">{r.name}</p>
                      <p className="text-[10px] text-neutral-500">
                        {r.branches[0]?.address || currentCity}
                      </p>
                    </div>
                    <span className="font-bold text-[#002b49]">Book</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
