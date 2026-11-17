import React from 'react';
import { ArrowRight, Compass, LayoutGrid, Send, Building2 } from 'lucide-react';

interface HowItWorksProps {
  onOpenOwnerPortal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOwnerPortal }) => {
  return (
    <section className="w-full bg-[#f4eee4] py-14 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 01 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#e05d26] tracking-wider uppercase">01</span>
              <Compass className="w-5 h-5 text-stone-400" />
            </div>
            <h4 className="text-base font-bold text-stone-900 mb-2">Search a spot</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your school, workplace or any landmark — we find rooms around you.
            </p>
          </div>

          {/* Card 02 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#e05d26] tracking-wider uppercase">02</span>
              <LayoutGrid className="w-5 h-5 text-stone-400" />
            </div>
            <h4 className="text-base font-bold text-stone-900 mb-2">Compare in a glance</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Monthly rent, distance and amenities on each room card.
            </p>
          </div>

          {/* Card 03 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#e05d26] tracking-wider uppercase">03</span>
              <Send className="w-5 h-5 text-stone-400" />
            </div>
            <h4 className="text-base font-bold text-stone-900 mb-2">Request a room</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Send a request with your move-in date. The owner approves it from their dashboard.
            </p>
          </div>

          {/* Card 04 - Owner CTA */}
          <div className="bg-gradient-to-br from-[#1c2927] to-[#121c1b] text-white p-6 rounded-2xl border border-stone-700 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase bg-stone-800/80 px-2 py-0.5 rounded">
                  PARTNER WITH US
                </span>
                <Building2 className="w-5 h-5 text-[#e05d26]" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Own a boarding house?</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                List rooms for free and manage requests in one place.
              </p>
            </div>
            <button
              onClick={onOpenOwnerPortal}
              className="mt-4 flex items-center justify-between w-full text-xs font-bold text-amber-300 hover:text-white group pt-2 border-t border-stone-700/60 cursor-pointer"
            >
              <span>Open the Owner portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
