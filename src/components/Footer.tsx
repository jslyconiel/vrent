import React from 'react';
import { Home, Shield, Heart, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenOwnerPortal: () => void;
  onOpenRenterPortal: () => void;
  onSelectCity: (city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOwnerPortal,
  onOpenRenterPortal,
  onSelectCity,
}) => {
  return (
    <footer className="w-full bg-[#0a100f] text-white border-t border-stone-800 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800/80">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center">
                <Home className="w-4 h-4 text-[#e05d26]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                vrent<span className="text-[#e05d26]">.</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Find a room that feels like home. Connecting students and young professionals with
              verified boarding houses across Northern Mindanao and Visayas.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-300">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Boarding House Network</span>
            </div>
          </div>

          {/* Popular Oroquieta Barangays */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 font-sans">
              Oroquieta Barangays
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              {[
                { name: 'Brgy. Lower Langcangan', query: 'Lower Langcangan' },
                { name: 'Brgy. Mobod (USTP Campus)', query: 'Mobod' },
                { name: 'Brgy. Canubay (SJC Campus)', query: 'Canubay' },
                { name: 'Brgy. Poblacion 1 & 2', query: 'Poblacion' },
                { name: 'Brgy. Talic', query: 'Talic' },
                { name: 'Brgy. Villaflor (Agro-Tech)', query: 'Villaflor' },
              ].map((b) => (
                <li key={b.query}>
                  <button
                    onClick={() => {
                      onSelectCity(b.query);
                      const el = document.getElementById('listings-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition cursor-pointer"
                  >
                    Boarding houses in {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 font-sans">
              Portals & Services
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={onOpenRenterPortal}
                  className="hover:text-white transition cursor-pointer"
                >
                  Renter Login & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOwnerPortal}
                  className="hover:text-white transition cursor-pointer"
                >
                  Owner Portal & Listings
                </button>
              </li>
              <li>
                <span className="text-stone-500">Virtual 360° Tours</span>
              </li>
              <li>
                <span className="text-stone-500">Campus Proximity Radar</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 font-sans">
              Student Helpdesk
            </h5>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#e05d26]" />
                <span>+63 (88) 531-ROOM (Oroquieta City)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#e05d26]" />
                <span>support@vrent.ph</span>
              </p>
              <p className="text-[11px] text-stone-500 pt-2">
                Available Monday - Saturday, 8:00 AM - 6:00 PM PHT.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} VRENT. Find Your Space. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-400">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-stone-400">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
