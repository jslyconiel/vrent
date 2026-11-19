import React from 'react';
import { Home } from 'lucide-react';
import { AuthMode } from '../types';

interface NavbarProps {
  currentView: 'intro' | 'search' | 'auth' | 'owner-dashboard' | 'renter-dashboard';
  onNavigateSearch: () => void;
  onNavigateIntro?: () => void;
  onOpenAuth: (mode: AuthMode) => void;
  savedCount: number;
  onOpenSaved: () => void;
  myBookingsCount?: number;
  onOpenMyBookings?: () => void;
  currentUser?: { name: string; role: AuthMode } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateSearch,
  onNavigateIntro,
  onOpenAuth,
  savedCount,
  onOpenSaved,
  myBookingsCount = 0,
  onOpenMyBookings,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="w-full bg-[#0e1615] border-b border-stone-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - Clicking returns to Introduction */}
        <button
          onClick={onNavigateIntro}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none transition-transform hover:scale-[1.03] active:scale-[0.98]"
          title="Return to Introduction page"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1a2b29] to-[#0f1918] border border-amber-500/40 flex items-center justify-center shadow-md shadow-black/50 group-hover:border-amber-400/70 transition-colors">
            <span className="font-serif font-black text-amber-300 text-lg leading-none">
              V
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold tracking-tight text-white font-sans">
              vrent
            </span>
            <span className="text-2xl font-black text-[#e05d26]">.</span>
          </div>
        </button>

        {/* Right side navigation */}
        <nav className="flex items-center gap-3 sm:gap-5">
          {currentView === 'search' ? (
            <>
              <button
                onClick={() => {
                  const el = document.getElementById('listings-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-stone-300 hover:text-white text-sm font-medium transition-colors hidden sm:block cursor-pointer"
              >
                Explore
              </button>

              {currentUser?.role === 'renter' && (
                <>
                  {onOpenMyBookings && (
                    <button
                      onClick={onOpenMyBookings}
                      className="relative text-amber-200 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-800 border border-amber-500/30 cursor-pointer"
                      title="Track your booking requests, receipts & owner notices"
                    >
                      <span>My Bookings</span>
                      {myBookingsCount > 0 && (
                        <span className="bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                          {myBookingsCount}
                        </span>
                      )}
                    </button>
                  )}

                  {/* Saved bookmarks toggle */}
                  <button
                    onClick={onOpenSaved}
                    className="relative text-stone-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/60 hover:bg-stone-800 border border-stone-700/50 cursor-pointer"
                    title="Saved rooms"
                  >
                    <span>Saved</span>
                    {savedCount > 0 && (
                      <span className="bg-[#e05d26] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                        {savedCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-300 hidden md:inline">
                    {currentUser.role === 'owner' ? '🏢 Owner' : '🎒 Renter'}:{' '}
                    <strong className="text-white">{currentUser.name}</strong>
                  </span>
                  {currentUser.role === 'owner' && (
                    <button
                      onClick={() => onOpenAuth(currentUser.role)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700 transition cursor-pointer"
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={onLogout}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-800/80 text-stone-200 hover:text-white hover:bg-stone-700 border border-stone-700/70 transition cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('renter')}
                    className="text-stone-300 hover:text-white text-sm font-medium transition-colors px-2 py-1 cursor-pointer"
                  >
                    Renter log in
                  </button>

                  <button
                    onClick={() => onOpenAuth('owner')}
                    className="bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-[#e05d26]/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Owner portal
                  </button>
                </>
              )}
            </>
          ) : currentView === 'owner-dashboard' ? (
            <div className="flex items-center gap-3">
              {currentUser && (
                <span className="text-xs sm:text-sm text-stone-300 hidden sm:inline">
                  🏢 Owner: <strong className="text-white">{currentUser.name}</strong>
                </span>
              )}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-stone-200 hover:text-white text-sm font-semibold px-4 py-2 rounded-full border border-stone-700 hover:border-stone-500 bg-stone-900/80 hover:bg-stone-800 transition-all cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={onNavigateSearch}
              className="flex items-center gap-2 text-stone-300 hover:text-white text-sm font-medium px-4 py-2 rounded-full border border-stone-700/60 hover:border-stone-500 bg-stone-900/60 hover:bg-stone-900 transition-all cursor-pointer"
            >
              <span>←</span>
              <span>Back to search</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
