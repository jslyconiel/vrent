import React, { useState } from 'react';
import { X, CheckCircle2, Send, Upload, IdCard } from 'lucide-react';
import { Room, BookingRequest } from '../types';
import { processUploadedImage } from '../utils/mediaUtils';

interface BookingModalProps {
  room: Room;
  onClose: () => void;
  onSubmitRequest: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  defaultUserName?: string;
  defaultUserEmail?: string;
  defaultAge?: number;
  defaultGender?: string;
  defaultSchool?: string;
  defaultStudentIdPhotoUrl?: string;
  defaultStudentIdFileName?: string;
  initialMoveInDate?: string;
  initialDurationMonths?: number;
  initialUnitNumber?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  onClose,
  onSubmitRequest,
  defaultUserName = '',
  defaultUserEmail = '',
  defaultAge,
  defaultGender,
  defaultSchool,
  defaultStudentIdPhotoUrl,
  defaultStudentIdFileName,
  initialMoveInDate,
  initialDurationMonths,
  initialUnitNumber,
}) => {
  const [renterName, setRenterName] = useState(defaultUserName);
  const [renterEmail, setRenterEmail] = useState(defaultUserEmail);
  const [renterPhone, setRenterPhone] = useState('+63 9');
  const [unitNumber, setUnitNumber] = useState(
    initialUnitNumber || (room.subUnits?.find((u) => u.status === 'available')?.unitNumber || room.subUnits?.[0]?.unitNumber || 'Unit 101')
  );
  const [moveInDate, setMoveInDate] = useState(() => {
    if (initialMoveInDate) return initialMoveInDate;
    return room.availableFrom || '2026-11-15';
  });
  const [durationMonths, setDurationMonths] = useState(
    initialDurationMonths || room.minimumStayMonths || 5
  );
  const [notes, setNotes] = useState('');
  const [studentIdPhotoUrl, setStudentIdPhotoUrl] = useState<string | undefined>(defaultStudentIdPhotoUrl);
  const [studentIdFileName, setStudentIdFileName] = useState<string>(defaultStudentIdFileName || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStudentIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await processUploadedImage(file, 1000);
      setStudentIdPhotoUrl(compressed);
      setStudentIdFileName(file.name);
    } catch {
      // Ignore invalid upload
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest({
      roomId: room.id,
      roomTitle: room.title,
      ownerEmail: room.ownerEmail,
      unitNumber,
      roomPrice: room.price,
      renterName,
      renterEmail,
      renterPhone,
      renterAge: defaultAge,
      renterGender: defaultGender,
      renterSchool: defaultSchool,
      studentIdPhotoUrl,
      studentIdFileName: studentIdFileName || undefined,
      moveInDate,
      durationMonths,
      notes,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-5 bg-[#0e1615] text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#e05d26] uppercase">
              ROOM RESERVATION REQUEST
            </span>
            <h3 className="text-xl font-bold text-white font-sans">{room.title}</h3>
            <p className="text-sm text-stone-300">
              ₱{room.price.toLocaleString()} / month • {room.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success State */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-stone-900 font-serif">Request Sent to Owner!</h4>
            <p className="text-base text-stone-600 max-w-sm mx-auto leading-relaxed">
              We&apos;ve sent your booking request for <strong>{unitNumber}</strong> to{' '}
              <strong>{room.ownerName}</strong>. Track approval anytime under{' '}
              <strong>My Bookings</strong> in the top bar.
            </p>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm text-stone-700 text-left space-y-1.5">
              <div>
                <strong>Move-in date:</strong> {moveInDate}
              </div>
              <div>
                <strong>Duration:</strong> {durationMonths} months
              </div>
              <div>
                <strong>Contact owner:</strong> {room.ownerPhone}
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow cursor-pointer"
            >
              Back to listings
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Target Move-in Date
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#e05d26]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Stay Duration</label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#e05d26] bg-white cursor-pointer"
                >
                  <option value={1}>1 month (trial)</option>
                  <option value={2}>2 months (summer term)</option>
                  <option value={5}>5 months (1 academic semester)</option>
                  <option value={10}>10 months (full school year)</option>
                  <option value={12}>12 months (1 year contract)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Assigned Unit / Exact Bedspace
              </label>
              {room.subUnits && room.subUnits.length > 0 ? (
                <select
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 bg-white font-semibold cursor-pointer"
                >
                  {room.subUnits.map((u) => (
                    <option key={u.id} value={u.unitNumber} disabled={u.status === 'occupied'}>
                      {u.unitNumber} ({u.status === 'occupied' ? 'Already Taken' : `Available - ₱${u.price}`})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="e.g. Room 101 or Lower Bunk Bed A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 font-semibold"
                />
              )}
              <span className="text-xs text-stone-500 mt-1 block">
                ✓ Non-random: Your selected bedspace is locked once approved.
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Your Full Name</label>
              <input
                type="text"
                value={renterName}
                onChange={(e) => setRenterName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#e05d26]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={renterEmail}
                  onChange={(e) => setRenterEmail(e.target.value)}
                  placeholder="name@ustp.edu.ph"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#e05d26]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Mobile / GCash Number
                </label>
                <input
                  type="tel"
                  value={renterPhone}
                  onChange={(e) => setRenterPhone(e.target.value)}
                  placeholder="+63 9..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#e05d26]"
                  required
                />
              </div>
            </div>

            {/* Optional School ID / COR Upload */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <IdCard className="w-4 h-4 text-[#e05d26]" />
                  <span>School ID or COR (Optional Verification)</span>
                </span>
                {studentIdPhotoUrl && (
                  <span className="text-xs font-bold text-emerald-700">Attached</span>
                )}
              </div>
              <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-dashed border-stone-300 hover:border-[#e05d26] text-xs sm:text-sm font-semibold text-stone-700 cursor-pointer">
                <Upload className="w-4 h-4 text-[#e05d26]" />
                <span>
                  {studentIdFileName ? `Selected: ${studentIdFileName}` : 'Attach Student ID / COR Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleStudentIdUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Notes for Owner (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. 2nd year BSIT student at USTP Mobod, prefer lower bunk..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#e05d26]"
              />
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-500">
                ⚡ No upfront payment required to request
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow-md shadow-[#e05d26]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send room request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
