import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Navigation } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNearMeClick: () => void;
  isLocating: boolean;
  onSelectCity: (city: string) => void;
  activeCity: string | null;
}

const POPULAR_LOCATIONS = [
  { label: 'All Oroquieta Boarding Houses', query: 'Oroquieta' },
  { label: 'Brgy. Lower Langcangan (Near Capitol)', query: 'Lower Langcangan' },
  { label: 'Brgy. Mobod (Near USTP / MUST)', query: 'Mobod' },
  { label: 'Brgy. Canubay (Near Saint Joseph College)', query: 'Canubay' },
  { label: 'Brgy. Poblacion 1 & 2', query: 'Poblacion' },
  { label: 'Brgy. Talic', query: 'Talic' },
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onNearMeClick,
  isLocating,
  onSelectCity,
  activeCity,
}) => {
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localInput);
    const el = document.getElementById('listings-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#0e1615] text-white pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-stone-800">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#e05d26]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Search */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            {/* Rooms open badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 border border-stone-800/80 w-fit mb-5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-amber-200/90 uppercase font-sans">
                Rooms open right now
              </span>
            </div>

            {/* Headline matching video */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
              Find a room <br />
              <span className="font-normal font-sans">that feels like</span>{' '}
              <br />
              <span className="font-serif italic font-normal text-amber-100/90 tracking-wide underline decoration-[#e05d26]/40 underline-offset-8">
                home.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              Type a school, barangay, or landmark in{' '}
              <strong className="text-amber-300 font-semibold">Oroquieta City</strong> — or just tap{' '}
              <strong className="text-amber-300 font-semibold">Near me</strong> — and we&apos;ll
              pop up every available boarding house around you.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSubmit} className="mt-7 max-w-xl">
              <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 sm:p-2 rounded-2xl bg-stone-900/90 border border-stone-700/70 shadow-2xl backdrop-blur-md">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={localInput}
                    onChange={(e) => {
                      setLocalInput(e.target.value);
                      onSearchChange(e.target.value);
                    }}
                    placeholder='Search Oroquieta, e.g. "USTP Mobod" or "Lower Langcangan"'
                    className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-stone-400 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onNearMeClick}
                    disabled={isLocating}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 hover:border-amber-400/40 transition cursor-pointer disabled:opacity-50 shrink-0"
                    title="Sort by proximity to your location"
                  >
                    {isLocating ? (
                      <span className="animate-spin text-amber-400">↻</span>
                    ) : (
                      <Navigation className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                    )}
                    <span>{isLocating ? 'Locating...' : 'Near me'}</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-[#e05d26] hover:bg-[#c94f1c] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#e05d26]/30 transition hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                  >
                    <span>Search</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Popular quick tags including Oroquieta barangays */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-400">
              <span className="text-stone-400 font-medium">Popular Barangays:</span>
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = searchQuery === loc.query || activeCity === loc.query;
                return (
                  <button
                    key={loc.label}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        onSelectCity('');
                        setLocalInput('');
                        onSearchChange('');
                      } else {
                        onSelectCity(loc.query);
                        setLocalInput(loc.query);
                        onSearchChange(loc.query);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs transition border cursor-pointer ${
                      isSelected
                        ? 'bg-[#e05d26] text-white border-[#e05d26]'
                        : 'bg-stone-900/80 text-stone-300 border-stone-700/60 hover:border-stone-500 hover:text-white'
                    }`}
                  >
                    {loc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Golden Luxury VRENT Emblem (exactly matching video!) */}
          <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center pt-4 lg:pt-0">
            <div className="relative group w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3] flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-[#162322]/80 to-[#0e1615]/90 border border-amber-500/20 shadow-2xl shadow-black/80">
              {/* Subtle gold decorative ring */}
              <div className="absolute inset-2 rounded-2xl border border-amber-500/10 pointer-events-none" />

              {/* Gold House & Stylized V emblem */}
              <div className="relative mb-3 flex flex-col items-center">
                <svg
                  width="180"
                  height="130"
                  viewBox="0 0 180 130"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="filter drop-shadow-[0_8px_16px_rgba(212,175,55,0.25)]"
                >
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="35%" stopColor="#d4af37" />
                      <stop offset="70%" stopColor="#b38728" />
                      <stop offset="100%" stopColor="#f9df7b" />
                    </linearGradient>
                    <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>

                  {/* Geometric Gable Roof */}
                  <path
                    d="M 25 65 L 90 20 L 155 65"
                    stroke="url(#roofGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle inner roof trace */}
                  <path
                    d="M 38 65 L 90 29 L 142 65"
                    stroke="url(#goldGrad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.6"
                  />

                  {/* Stylized Serif Letter "V" */}
                  <text
                    x="90"
                    y="108"
                    fontFamily="'Fraunces', Georgia, serif"
                    fontSize="86"
                    fontWeight="700"
                    fill="url(#goldGrad)"
                    textAnchor="middle"
                  >
                    V
                  </text>
                </svg>

                {/* Brand Text Below Logo */}
                <div className="text-center mt-1">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent font-serif">
                      VRENT
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-[#e05d26]">.</span>
                  </div>

                  {/* Subtitle with divider lines */}
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-amber-500/60" />
                    <span className="text-[10px] sm:text-[11px] tracking-[0.28em] font-semibold text-amber-200/80 uppercase font-sans">
                      FIND YOUR SPACE
                    </span>
                    <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-amber-500/60" />
                  </div>
                </div>
              </div>

              {/* Bottom tag / micro-highlight */}
              <div className="mt-2 text-[11px] text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified boarding houses & direct owner chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
