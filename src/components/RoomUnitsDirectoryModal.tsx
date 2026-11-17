import React, { useState } from 'react';
import {
  X,
  RotateCw,
  Eye,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BedDouble,
  Building,
  Key,
} from 'lucide-react';
import { Room, SubUnit } from '../types';

interface RoomUnitsDirectoryModalProps {
  room: Room;
  onClose: () => void;
  onOpen360ForUnit: (room: Room, unit: SubUnit) => void;
  onRequestUnit: (room: Room, unit: SubUnit) => void;
}

export const RoomUnitsDirectoryModal: React.FC<RoomUnitsDirectoryModalProps> = ({
  room,
  onClose,
  onOpen360ForUnit,
  onRequestUnit,
}) => {
  // Generate units if none exist on room
  const units: SubUnit[] = room.subUnits && room.subUnits.length > 0
    ? room.subUnits
    : Array.from({ length: room.totalSlots }).map((_, idx) => {
        const isOccupied = idx >= room.slotsAvailable;
        return {
          id: `${room.id}-unit-${idx + 1}`,
          unitNumber: room.type === 'Private Room' ? `Room ${101 + idx}` : `Slot ${idx + 1} (${idx % 2 === 0 ? 'Lower Bunk' : 'Upper Bunk'})`,
          unitType: room.type,
          price: room.price,
          status: isOccupied ? 'occupied' : 'available',
          currentTenant: isOccupied ? (room.occupiedPeriods[idx]?.renterName || 'Student tenant') : undefined,
          panoramaTheme: room.illustrationTheme,
          features: ['Study lamp', 'Wall power socket', 'Locker access'],
        };
      });

  const [selectedUnit, setSelectedUnit] = useState<SubUnit>(units[0]);

  const availableCount = units.filter((u) => u.status === 'available').length;
  const occupiedCount = units.filter((u) => u.status === 'occupied').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0e1615] text-white flex items-start justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e05d26]/20 text-[#e05d26] border border-[#e05d26]/30 uppercase tracking-widest">
                Unit Inspection &amp; 360 Selector
              </span>
              {room.ownerVerified && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Landlord</span>
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">{room.title}</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {room.location} • {room.landmark}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Occupancy Indicator Bar (Requirement #3) */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-stone-600 font-medium">
              Boarding House Capacity: <strong className="text-stone-900">{room.totalSlots} Total Slots</strong>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{availableCount} Available Rooms / Beds</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-stone-600 bg-stone-200/80 px-2.5 py-0.5 rounded-full">
              <span>{occupiedCount} Currently Occupied / Avail Na</span>
            </span>
          </div>

          <span className="text-[11px] text-stone-500 italic">
            Renters can pick exact room or bedspace before booking
          </span>
        </div>

        {/* Content Body: Left Unit Selector List + Right 360 Preview Card */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-50/50">
          {/* Units List (Left 7 Cols) */}
          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Inspect Each Room / Bed ({units.length} units listed)
            </span>

            <div className="space-y-2.5">
              {units.map((unit) => {
                const isSelected = selectedUnit.id === unit.id;
                const isAvailable = unit.status === 'available';

                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-orange-50/80 border-[#e05d26] shadow-md ring-2 ring-[#e05d26]/20'
                        : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <BedDouble className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{unit.unitNumber}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {isAvailable ? 'AVAILABLE NOW' : 'OCCUPIED'}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 mt-0.5">
                          {unit.unitType} • ₱{unit.price.toLocaleString()}/month
                        </p>

                        {!isAvailable && unit.currentTenant && (
                          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Occupied by: {unit.currentTenant}</span>
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1 mt-2">
                          {unit.features.map((feat) => (
                            <span
                              key={feat}
                              className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200/60"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-sm font-extrabold text-[#e05d26]">
                        ₱{unit.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-400">/ mo</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Detailed Inspector & 360 CTA (Right 5 Cols) */}
          <div className="md:col-span-5 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Unit Specification
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedUnit.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {selectedUnit.status === 'available' ? 'Open for Rent' : 'Occupied'}
                </span>
              </div>

              <h4 className="text-lg font-bold text-stone-900">{selectedUnit.unitNumber}</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {room.title} • {room.city}
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60">
                <span className="text-xs font-bold text-stone-700 block mb-1">
                  Monthly Rate: ₱{selectedUnit.price.toLocaleString()} / month
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Includes submetered utilities, high-speed Wi-Fi, and 24/7 security. Non-random
                  room assignment guarantees you get this exact spot upon move-in.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold text-stone-700 block">Features Included:</span>
                <ul className="text-xs text-stone-600 space-y-1">
                  {selectedUnit.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons for this exact unit */}
            <div className="mt-6 pt-4 border-t border-stone-100 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpen360ForUnit(room, selectedUnit);
                }}
                className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
              >
                <RotateCw className="w-4 h-4 text-[#e05d26]" />
                <span>Open 360° VR for {selectedUnit.unitNumber}</span>
              </button>

              {selectedUnit.status === 'available' ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestUnit(room, selectedUnit);
                  }}
                  className="w-full py-3 rounded-2xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow-md shadow-[#e05d26]/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Key className="w-4 h-4" />
                  <span>Reserve This Exact Unit Now</span>
                </button>
              ) : (
                <div className="py-2.5 px-3 bg-stone-100 rounded-xl text-center text-xs text-stone-500 font-medium">
                  Unit is currently taken by tenant.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="text-[#e05d26] font-bold">● VRENT Fair Allocation:</span>
            <span>Hindi random hatag sa room; you pick the exact room or bed you tour.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-stone-300 hover:bg-white text-stone-700 font-semibold cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
