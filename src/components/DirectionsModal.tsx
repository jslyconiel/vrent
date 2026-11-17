import React, { useState } from 'react';
import { X, MapPin, Navigation, Compass, Footprints, Bus, Car, Copy, Check } from 'lucide-react';
import { Room } from '../types';

interface DirectionsModalProps {
  room: Room;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ room, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTransit, setSelectedTransit] = useState<'walk' | 'trike' | 'jeep'>('walk');

  const handleCopy = () => {
    navigator.clipboard.writeText(`${room.title}, ${room.location}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${room.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-5 bg-[#0e1615] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#e05d26]/20 border border-[#e05d26]/40 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-[#e05d26]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How to get there</h3>
              <p className="text-xs text-stone-400 font-sans">{room.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Destination banner */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#e05d26] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-stone-800">{room.location}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Approx.{' '}
                  {room.distanceKm < 1
                    ? `${Math.round(room.distanceKm * 1000)} meters`
                    : `${room.distanceKm} km`}{' '}
                  from landmark center
                </p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-stone-300 text-stone-500 hover:text-stone-800 hover:bg-white text-xs flex items-center gap-1 cursor-pointer shrink-0"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Commute Mode Selector */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Commute Estimates
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTransit('walk')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  selectedTransit === 'walk'
                    ? 'border-[#e05d26] bg-orange-50/60 text-[#e05d26] font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Footprints className="w-4 h-4 mx-auto mb-1" />
                <span className="block text-xs">Walking</span>
                <span className="text-[11px] text-stone-500 font-normal">
                  ~{Math.max(3, Math.round(room.distanceKm * 12))} mins
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTransit('trike')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  selectedTransit === 'trike'
                    ? 'border-[#e05d26] bg-orange-50/60 text-[#e05d26] font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Car className="w-4 h-4 mx-auto mb-1" />
                <span className="block text-xs">Tricycle</span>
                <span className="text-[11px] text-stone-500 font-normal">
                  ~{Math.max(2, Math.round(room.distanceKm * 3))} mins (₱15-₱25)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTransit('jeep')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  selectedTransit === 'jeep'
                    ? 'border-[#e05d26] bg-orange-50/60 text-[#e05d26] font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Bus className="w-4 h-4 mx-auto mb-1" />
                <span className="block text-xs">Jeepney</span>
                <span className="text-[11px] text-stone-500 font-normal">
                  ~{Math.max(5, Math.round(room.distanceKm * 4))} mins (₱13)
                </span>
              </button>
            </div>
          </div>

          {/* Turn by turn landmark steps */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Landmark Navigation Steps
            </span>
            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  Start from <strong>{room.landmark}</strong> main gates or transport terminal.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  Head towards <strong>{room.location.split(',')[1] || room.location}</strong>. Look for prominent student carenderias or convenience stores.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>
                  Look for the <strong>VRENT verified boarding house placard</strong> at the gate. Ring the buzzer for <strong>{room.ownerName}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={openGoogleMaps}
              className="px-5 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow-md shadow-[#e05d26]/20 flex items-center gap-2 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
