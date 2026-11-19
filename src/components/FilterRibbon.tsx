import React from 'react';
import { Star } from 'lucide-react';

interface FilterRibbonProps {
  activeTag: string | null;
  onTagToggle: (tag: string) => void;
}

const BADGES = [
  'Student friendly',
  'Water Included',
  'Near campus',
  'Wi-Fi ready',
  'Mixed',
  'Female Only',
  'Bedspaces',
  'Private rooms',
];

export const FilterRibbon: React.FC<FilterRibbonProps> = ({ activeTag, onTagToggle }) => {
  return (
    <div className="w-full bg-[#c24b1f] border-y border-[#a83d16] py-3.5 px-4 overflow-x-auto no-scrollbar shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2.5 sm:gap-4 min-w-max">
        {BADGES.map((badge) => {
          const isActive = activeTag === badge;
          return (
            <button
              key={badge}
              onClick={() => onTagToggle(badge)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-white text-[#c24b1f] scale-105 shadow-md font-bold'
                  : 'bg-[#9f3b14]/70 hover:bg-[#8d320f] text-white/95 border border-white/20 hover:border-white/40'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isActive ? 'fill-[#c24b1f] text-[#c24b1f]' : 'fill-white/80 text-white/80'
                }`}
              />
              <span>{badge}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
