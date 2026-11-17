import React from 'react';
import {
  Compass,
  Rotate3d,
  MessageSquare,
  ShieldCheck,
  CalendarCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Building,
  Key,
} from 'lucide-react';
import { AuthMode } from '../types';

interface IntroductionPageProps {
  onEnterApp: () => void;
  onOpenOwnerPortal: () => void;
  onOpenRenterPortal: () => void;
  onExploreCity: (city: string) => void;
}

export const IntroductionPage: React.FC<IntroductionPageProps> = ({
  onEnterApp,
  onOpenOwnerPortal,
  onOpenRenterPortal,
  onExploreCity,
}) => {
  return (
    <div className="min-h-screen bg-[#0a1110] text-stone-100 font-sans selection:bg-[#e05d26] selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0a1110]/90 backdrop-blur-md border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1f2e2d] to-[#121c1b] border border-amber-500/30 flex items-center justify-center shadow-lg shadow-black/40">
              <span className="font-serif font-black text-amber-300 text-xl">V</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tight text-white font-sans">vrent</span>
              <span className="text-2xl font-black text-[#e05d26]">.</span>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-6">
            <a
              href="#how-it-works"
              className="text-stone-300 hover:text-white text-sm font-medium transition-colors hidden md:inline"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-stone-300 hover:text-white text-sm font-medium transition-colors hidden md:inline"
            >
              Features
            </a>
            <a
              href="#campuses"
              className="text-stone-300 hover:text-white text-sm font-medium transition-colors hidden sm:inline"
            >
              Campuses
            </a>

            <button
              onClick={onOpenRenterPortal}
              className="text-stone-300 hover:text-white text-xs sm:text-sm font-medium transition-colors px-2 py-1 cursor-pointer"
            >
              Renter Login
            </button>

            <button
              onClick={onEnterApp}
              className="px-5 py-2.5 rounded-full bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs sm:text-sm font-bold tracking-tight shadow-md shadow-[#e05d26]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Ambient lighting glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#e05d26]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 text-xs text-amber-200 font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Boarding House &amp; Dormitory Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Boarding house hunting, <br />
              <span className="font-serif italic font-normal text-amber-200">reimagined</span> for students.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto">
              Skip exhausting walks under the sun. Preview spaces in true 360° VR, check semester
              availability calendars, and chat directly with verified homeowners before booking.
            </p>

            {/* CTA action buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-base font-bold shadow-xl shadow-[#e05d26]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Find Your Space</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenOwnerPortal}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-400/40 text-base font-bold transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Building className="w-5 h-5 text-amber-300" />
                <span>List Your Property</span>
              </button>
            </div>

            {/* Micro trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Landlords
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> True 360° Photospheres
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Direct Chat
              </span>
            </div>
          </div>

          {/* Large Hero Photography & Interactive Preview Canvas */}
          <div className="mt-14 sm:mt-18 relative rounded-3xl overflow-hidden border border-stone-700/80 shadow-2xl bg-stone-900 group">
            <img
              src="/images/vrent_landing_hero_1793937048221.jpg"
              alt="VRENT curated student room interior with sunlit study desk and comfortable bed"
              className="w-full h-[360px] sm:h-[500px] md:h-[580px] object-cover filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Secondary fallback path to src/assets if running in raw vite mode
                const target = e.currentTarget;
                if (!target.src.includes('src/assets')) {
                  target.src = '/src/assets/images/vrent_landing_hero_1793937048221.jpg';
                }
              }}
            />

            {/* Overlaid Gradient & Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1110] via-transparent to-black/40 pointer-events-none" />

            {/* Floating Live Feature Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-stone-950/85 backdrop-blur-md rounded-2xl p-5 border border-amber-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Featured Room Preview
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  2 Slots Free
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Sunrise Student Residency</h3>
              <p className="text-xs text-stone-300 mt-1">
                350m from La Salle University • High-speed Wi-Fi • Air conditioned
              </p>
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xl font-black text-amber-300">₱2,500</span>
                  <span className="text-xs text-stone-400"> / month</span>
                </div>
                <button
                  onClick={onEnterApp}
                  className="px-4 py-2 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <span>View in App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Bento Grid */}
      <section id="features" className="py-20 bg-[#0e1615] border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#e05d26]">
              Built for Student Life
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
              Everything you need before you move in
            </h2>
            <p className="mt-3 text-sm text-stone-400">
              Modern boarding house search designed around campus proximity, transparent pricing,
              and authentic owner communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: 360 VR Photospheres */}
            <div className="bg-gradient-to-b from-[#162322] to-[#101a19] p-8 rounded-3xl border border-stone-800 hover:border-amber-500/40 transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
                  <Rotate3d className="w-6 h-6 text-[#e05d26]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">True 360° Spherical VR</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Look up at the ceiling, spin around the corners, and feel the room layout. Support
                  for phone gyro motion tracking and stereoscopic VR goggles.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center text-xs font-semibold text-amber-300">
                <span>Gyroscope &amp; VR Ready</span>
              </div>
            </div>

            {/* Bento Card 2: Interactive Campus Map */}
            <div className="bg-gradient-to-b from-[#162322] to-[#101a19] p-8 rounded-3xl border border-stone-800 hover:border-amber-500/40 transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6 text-[#e05d26]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Campus Proximity Map</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Pinpoint rooms by exact walking distance to your college or university gate in Oroquieta City. Jump
                  between Mobod (USTP), Canubay (SJC), Lower Langcangan, and Poblacion with 1km radius rings.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center text-xs font-semibold text-amber-300">
                <span>Interactive Leaflet GPS Pins</span>
              </div>
            </div>

            {/* Bento Card 3: Real-Time Landlord Chat */}
            <div className="bg-gradient-to-b from-[#162322] to-[#101a19] p-8 rounded-3xl border border-stone-800 hover:border-amber-500/40 transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-[#e05d26]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Live Landlord Messaging</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Discuss curfew policies, Wi-Fi speeds, visitor rules, and advance deposits with
                  property owners before filing an official booking request.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center text-xs font-semibold text-amber-300">
                <span>Direct In-App Landlord Chat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Split Showcase: Room Living & Student Community */}
      <section className="py-20 bg-[#0a1110]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image Collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-xl bg-stone-900">
                <img
                  src="/images/vrent_room_tour_1793937048566.jpg"
                  alt="Modern private student studio room with study desk and sunny window"
                  className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('src/assets')) {
                      target.src = '/src/assets/images/vrent_room_tour_1793937048566.jpg';
                    }
                  }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-xl mt-6 bg-stone-900">
                <img
                  src="/images/vrent_student_community_1793937049615.jpg"
                  alt="Filipino university students studying and laughing in a boarding house lounge"
                  className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('src/assets')) {
                      target.src = '/src/assets/images/vrent_student_community_1793937049615.jpg';
                    }
                  }}
                />
              </div>
            </div>

            {/* Right Story Copy */}
            <div className="flex flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300">
                Safe &amp; Verified Spaces
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif leading-tight">
                Designed for peace of mind while you study
              </h2>
              <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed">
                Finding a boarding house shouldn&apos;t feel like a gamble. VRENT connects students
                with verified accommodations vetted for safety, study-friendly atmospheres, and
                fair rental terms.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Semester Availability Calendar</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Check exact vacancy dates aligned with Academic Semesters (1st Sem, 2nd Sem,
                      Summer Term).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Owner Bookings</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      No surprise middleman fees. Submit transparent booking requests that landlords
                      confirm directly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={onEnterApp}
                  className="px-6 py-3 rounded-2xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold transition shadow-lg shadow-[#e05d26]/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Launch Search &amp; Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Section */}
      <section id="how-it-works" className="py-20 bg-[#0e1615] border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#e05d26]">
              Simple &amp; Direct
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
              Three steps to your new room
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#141f1e] p-7 rounded-3xl border border-stone-800 relative">
              <span className="text-4xl font-black text-amber-500/20 font-serif absolute top-6 right-6">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-300 mb-4">
                <Compass className="w-5 h-5 text-[#e05d26]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Search by Campus</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Filter by distance to university gates, maximum monthly rent, room type, and
                amenities like Wi-Fi or aircon.
              </p>
            </div>

            <div className="bg-[#141f1e] p-7 rounded-3xl border border-stone-800 relative">
              <span className="text-4xl font-black text-amber-500/20 font-serif absolute top-6 right-6">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-300 mb-4">
                <Rotate3d className="w-5 h-5 text-[#e05d26]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tour in 360°</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Step inside the room with realistic photosphere panoramas before spending time on an
                in-person inspection trip.
              </p>
            </div>

            <div className="bg-[#141f1e] p-7 rounded-3xl border border-stone-800 relative">
              <span className="text-4xl font-black text-amber-500/20 font-serif absolute top-6 right-6">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-300 mb-4">
                <Key className="w-5 h-5 text-[#e05d26]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Chat &amp; Request</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Message the landlord directly with questions, select your move-in date, and send a
                room reservation request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* University Campus Highlights */}
      <section id="campuses" className="py-20 bg-[#0a1110] border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300">
            Campuses Covered
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-serif">
            Boarding houses near your school
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Click any campus hub to jump straight into nearby boarding houses and dorms.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'USTP Oroquieta Campus', barangay: 'Brgy. Mobod', query: 'Mobod' },
              { name: 'Saint Joseph College (SJC)', barangay: 'Brgy. Canubay', query: 'Canubay' },
              { name: 'Misamis Occ Tech & Capitol', barangay: 'Brgy. Lower Langcangan', query: 'Lower Langcangan' },
              { name: 'Southern Capital Colleges', barangay: 'Brgy. Poblacion', query: 'Poblacion' },
              { name: 'Oroquieta Agro-Industrial School', barangay: 'Brgy. Villaflor', query: 'Villaflor' },
              { name: 'Talic Student Quarter', barangay: 'Brgy. Talic', query: 'Talic' },
            ].map((campus) => (
              <button
                key={campus.name}
                onClick={() => onExploreCity(campus.query)}
                className="px-4 py-2.5 rounded-2xl bg-[#141f1e] hover:bg-[#1f2e2d] border border-stone-800 hover:border-amber-500/40 text-stone-200 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-[#e05d26]" />
                <span>{campus.name}</span>
                <span className="text-[10px] text-amber-300/80 font-medium">({campus.barangay})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#1c2927] to-[#121c1b] border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            Ready to find your student home?
          </h2>
          <p className="mt-3 text-stone-300 text-sm max-w-md mx-auto">
            Browse verified listings, check real-time availability, and message property owners today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow-lg shadow-[#e05d26]/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore All Rooms Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenOwnerPortal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-stone-700 text-sm font-bold transition cursor-pointer"
            >
              Landlord Registration
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0a1110] border-t border-stone-800/80 text-stone-400 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-300">VRENT Platform</span>
            <span>•</span>
            <span>Empowering university boarding house rentals</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={onEnterApp} className="hover:text-white transition">
              Explore Rooms
            </button>
            <button onClick={onOpenOwnerPortal} className="hover:text-white transition">
              Owner Portal
            </button>
            <button onClick={onOpenRenterPortal} className="hover:text-white transition">
              Renter Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
