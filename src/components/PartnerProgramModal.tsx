import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building,
  Camera,
  Compass,
  FileCheck,
  CheckCircle2,
  Calendar,
  Send,
  Phone,
  Sparkles,
} from 'lucide-react';

interface PartnerProgramModalProps {
  onClose: () => void;
  defaultOwnerName?: string;
}

export const PartnerProgramModal: React.FC<PartnerProgramModalProps> = ({
  onClose,
  defaultOwnerName = '',
}) => {
  const [ownerName, setOwnerName] = useState(defaultOwnerName || 'Mrs. Remedios Santos');
  const [boardingHouseName, setBoardingHouseName] = useState('');
  const [city, setCity] = useState('Oroquieta');
  const [barangay, setBarangay] = useState('Lower Langcangan');
  const [phone, setPhone] = useState('+63 9');
  const [targetRates, setTargetRates] = useState('₱2,000 - ₱3,500 / month');
  const [preferredVisitDate, setPreferredVisitDate] = useState('2026-11-12');
  const [idType, setIdType] = useState('Barangay Clearance / Mayor Permit');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0e1615] text-white flex items-start justify-between border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e05d26]" />
              <span>VRENT Partner Program</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Schedule Free 360° VR Capture &amp; Partner Visit
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Mo-visit mi sa inyong boarding house para ma-virtual reality ang inyong mga kwarto ug magkasinabot sa price rate.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/50">
          {submitted ? (
            <div className="p-6 text-center space-y-4 bg-white rounded-2xl border border-stone-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-stone-900 font-serif">Visit Scheduled!</h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{ownerName}</strong>! Our VRENT field verification team will visit{' '}
                <strong>{boardingHouseName || 'your boarding house'}</strong> in{' '}
                <strong>{barangay}, {city}</strong> on <strong>{preferredVisitDate}</strong> with our 360° VR
                photosphere rig.
              </p>
              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 text-left space-y-1">
                <div>✓ <strong>Free 360° Panorama Capture</strong> of all your available and occupied rooms</div>
                <div>✓ <strong>Fair Student Pricing Consultation</strong> based on location and campus proximity</div>
                <div>✓ <strong>Verified Landlord Badge</strong> to prevent scams &amp; protect tenants</div>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-xl bg-[#e05d26] text-white text-xs font-bold shadow cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Owner / Landlord Full Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Boarding House / Dormitory Name
                </label>
                <input
                  type="text"
                  value={boardingHouseName}
                  onChange={(e) => setBoardingHouseName(e.target.value)}
                  placeholder="e.g. Santos Acacia Student Hall"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-stone-50"
                  >
                    <option value="Oroquieta">Oroquieta City (Exclusive Network)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Barangay</label>
                  <input
                    type="text"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    placeholder="e.g. Lower Langcangan, Mobod, Canubay"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={preferredVisitDate}
                    onChange={(e) => setPreferredVisitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Target Room Rates (Monthly)
                  </label>
                  <input
                    type="text"
                    value={targetRates}
                    onChange={(e) => setTargetRates(e.target.value)}
                    placeholder="e.g. ₱2,000 to ₱3,500 / mo"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Verification ID Prepared
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
                  >
                    <option value="Barangay Clearance / Mayor Permit">Barangay Clearance / Mayor Permit</option>
                    <option value="Land Title / Tax Declaration">Land Title / Tax Declaration</option>
                    <option value="Government ID (Passport, PhilSys)">Government ID (Passport, PhilSys)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  📷 100% Free 360° VR shoot sponsored by VRENT
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Partnership Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
