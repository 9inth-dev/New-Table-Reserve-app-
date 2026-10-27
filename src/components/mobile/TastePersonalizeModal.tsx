import React, { useState } from 'react';
import { Check, X, Sparkles, Utensils } from 'lucide-react';

export interface TasteOption {
  id: string;
  label: string;
  subtitle: string;
  image: string;
}

export const TASTE_OPTIONS: TasteOption[] = [
  {
    id: 'Fast Food',
    label: 'Fast Food',
    subtitle: 'Burgers & Fries',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Mexican',
    label: 'Mexican',
    subtitle: 'Tacos & Birria',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Japanese',
    label: 'Japanese',
    subtitle: 'Sushi & Ramen',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'American',
    label: 'American',
    subtitle: 'Steaks & BBQ',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Italian',
    label: 'Italian',
    subtitle: 'Pasta & Pizza',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Indian',
    label: 'Indian',
    subtitle: 'Curries & Naan',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Chinese',
    label: 'Chinese',
    subtitle: 'Dim Sum & Wok',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Greek',
    label: 'Greek',
    subtitle: 'Mediterranean & Souvlaki',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Thai',
    label: 'Thai',
    subtitle: 'Tom Yum & Pad Thai',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'African',
    label: 'African',
    subtitle: 'Braai, Suya & Jollof',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Khmer',
    label: 'Khmer',
    subtitle: 'Authentic Local',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'Dessert',
    label: 'Café & Sweets',
    subtitle: 'Pastries & Gelato',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=360&q=80',
  },
];

interface TastePersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTastes: string[];
  onSaveTastes: (tastes: string[]) => void;
}

export const TastePersonalizeModal: React.FC<TastePersonalizeModalProps> = ({
  isOpen,
  onClose,
  selectedTastes,
  onSaveTastes,
}) => {
  const [selected, setSelected] = useState<string[]>(
    selectedTastes.length ? selectedTastes : ['Fast Food', 'Mexican', 'Japanese']
  );

  if (!isOpen) return null;

  const toggleTaste = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      if (selected.length >= 3) {
        // Replace the oldest item if already 3 selected, or append
        setSelected([...selected.slice(1), id]);
      } else {
        setSelected([...selected, id]);
      }
    }
  };

  const handleContinue = () => {
    onSaveTastes(selected.length > 0 ? selected : ['Fast Food', 'Mexican', 'Japanese']);
    onClose();
  };

  const handleSkip = () => {
    if (selected.length === 0) {
      onSaveTastes(['Fast Food', 'Mexican', 'Japanese']);
    } else {
      onSaveTastes(selected);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Top Header */}
        <div className="p-5 pb-3 border-b border-neutral-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Tailor Your Experience
            </div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Choose 3 that you like
            </h2>
            <p className="text-xs text-neutral-500">
              This helps personalize recommendations on your TableCraft home screen.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Counter Pill */}
        <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-600">
            Selected: <span className="font-bold text-[#002b49]">{selected.length} of 3</span>
          </span>
          <span className="text-[11px] text-neutral-400">
            {selected.length === 3 ? 'Perfect! Tap Continue below' : 'Tap any circular dish to select'}
          </span>
        </div>

        {/* 3x4 Grid of Circular Dish Plates */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-3 gap-4">
          {TASTE_OPTIONS.map((taste) => {
            const isSelected = selected.includes(taste.id);
            return (
              <button
                key={taste.id}
                type="button"
                onClick={() => toggleTaste(taste.id)}
                className="group flex flex-col items-center text-center cursor-pointer focus:outline-none transition-all active:scale-95"
              >
                {/* Circular Plate */}
                <div
                  className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden transition-all duration-200 p-0.5 ${
                    isSelected
                      ? 'ring-3 ring-[#002b49] ring-offset-2 shadow-lg shadow-[#002b49]/20 scale-105'
                      : 'ring-1 ring-neutral-200 hover:ring-neutral-300 hover:scale-102 shadow-xs'
                  }`}
                >
                  <img
                    src={taste.image}
                    alt={taste.label}
                    className="w-full h-full object-cover rounded-full group-hover:brightness-105 transition-all"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#002b49]/35 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-6 h-6 rounded-full bg-white text-[#002b49] flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Label & Subtitle */}
                <span
                  className={`mt-2 text-xs font-semibold leading-tight transition-colors ${
                    isSelected ? 'text-[#002b49] font-bold' : 'text-neutral-800'
                  }`}
                >
                  {taste.label}
                </span>
                <span className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                  {taste.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 bg-white border-t border-neutral-100 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 py-3 px-4 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold text-xs transition-colors"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-2 py-3 px-4 rounded-xl bg-[#002b49] text-white hover:bg-[#003860] active:scale-98 font-bold text-xs shadow-md shadow-[#002b49]/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            Continue ({selected.length}/3)
          </button>
        </div>
      </div>
    </div>
  );
};
