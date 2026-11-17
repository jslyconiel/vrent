import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Room } from '../types';

interface AvailabilityCalendarModalProps {
  room: Room;
  onClose: () => void;
  onSelectBookingDates: (startDate: string, durationMonths: number) => void;
}

export const AvailabilityCalendarModal: React.FC<AvailabilityCalendarModalProps> = ({
  room,
  onClose,
  onSelectBookingDates,
}) => {
  // Current viewing month (default to November 2026 based on system time)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026
  const [selectedStartDate, setSelectedStartDate] = useState<string>(room.availableFrom);
  const [selectedEndDate, setSelectedEndDate] = useState<string>(() => {
    // Default 5 months (1 academic semester)
    const d = new Date(room.availableFrom);
    d.setMonth(d.getMonth() + (room.minimumStayMonths || 5));
    return d.toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper to format ISO YYYY-MM-DD
  const formatDayISO = (d: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Check status of a day
  const getDayStatus = (isoDate: string) => {
    // If before availableFrom
    const availableDate = new Date(room.availableFrom);
    const thisDate = new Date(isoDate);

    // Check occupied periods
    const isOccupied = room.occupiedPeriods.some((p) => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return thisDate >= start && thisDate <= end;
    });

    if (thisDate < availableDate) {
      return { type: 'past', label: 'Unavailable' };
    }

    if (room.slotsAvailable === 0) {
      return { type: 'full', label: 'Fully booked' };
    }

    if (room.slotsAvailable === 1) {
      return { type: 'limited', label: '1 slot left' };
    }

    return { type: 'available', label: `${room.slotsAvailable} slots open` };
  };

  // Academic semester presets
  const applySemesterPreset = (months: number, label: string) => {
    const start = room.availableFrom;
    const d = new Date(start);
    d.setMonth(d.getMonth() + months);
    setSelectedStartDate(start);
    setSelectedEndDate(d.toISOString().split('T')[0]);
  };

  // Calculate duration in months
  const durationInMonths = Math.max(
    1,
    Math.round(
      (new Date(selectedEndDate).getTime() - new Date(selectedStartDate).getTime()) /
        (1000 * 60 * 60 * 24 * 30.4)
    )
  );

  const estimatedTotal = durationInMonths * room.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-[#0e1615] text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e05d26]/20 border border-[#e05d26]/40 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-[#e05d26]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white font-sans">
                  Availability Calendar
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {room.slotsAvailable} of {room.totalSlots} Slots Free
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {room.title} • ₱{room.price.toLocaleString()}/mo • Available from{' '}
                {new Date(room.availableFrom).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Academic Semester Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Academic Semester Quick Select
              </span>
              <span className="text-[11px] text-stone-500">
                Min. stay: {room.minimumStayMonths} months
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applySemesterPreset(5, '2nd Semester 2026-2027')}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:border-[#e05d26] bg-stone-50 hover:bg-orange-50/50 text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-stone-800">2nd Sem 2026-27</div>
                <div className="text-[11px] text-stone-500">5 Months (Nov - Apr)</div>
              </button>

              <button
                type="button"
                onClick={() => applySemesterPreset(2, 'Summer Term 2027')}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:border-[#e05d26] bg-stone-50 hover:bg-orange-50/50 text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-stone-800">Summer Term</div>
                <div className="text-[11px] text-stone-500">2 Months (Apr - Jun)</div>
              </button>

              <button
                type="button"
                onClick={() => applySemesterPreset(10, 'Full School Year')}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:border-[#e05d26] bg-stone-50 hover:bg-orange-50/50 text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-stone-800">Full Academic Year</div>
                <div className="text-[11px] text-stone-500">10 Months Contract</div>
              </button>
            </div>
          </div>

          {/* Month Header & Controls */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-stone-900 font-serif text-lg">
                  {monthNames[month]} {year}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-medium">
                  {room.city} Area
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 transition cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 transition cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-stone-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading offset */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isoDate = formatDayISO(dayNum);
                const status = getDayStatus(isoDate);

                const isStart = selectedStartDate === isoDate;
                const isEnd = selectedEndDate === isoDate;
                const isInRange =
                  new Date(isoDate) >= new Date(selectedStartDate) &&
                  new Date(isoDate) <= new Date(selectedEndDate);

                let cellBg = 'bg-white hover:border-[#e05d26]';
                let textColor = 'text-stone-800';
                let dotColor = 'bg-emerald-500';

                if (status.type === 'past') {
                  cellBg = 'bg-stone-100/70 opacity-40 cursor-not-allowed';
                  textColor = 'text-stone-400';
                  dotColor = 'bg-stone-300';
                } else if (status.type === 'full') {
                  cellBg = 'bg-rose-50 border-rose-200';
                  textColor = 'text-rose-900';
                  dotColor = 'bg-rose-500';
                } else if (status.type === 'limited') {
                  cellBg = 'bg-amber-50/70 border-amber-200';
                  textColor = 'text-amber-900';
                  dotColor = 'bg-amber-500';
                }

                if (isInRange && status.type !== 'past') {
                  cellBg = 'bg-[#e05d26]/15 border-[#e05d26]';
                }
                if (isStart || isEnd) {
                  cellBg = 'bg-[#e05d26] text-white shadow-md scale-105';
                  textColor = 'text-white font-bold';
                  dotColor = 'bg-white';
                }

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={status.type === 'past'}
                    onClick={() => {
                      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                        setSelectedStartDate(isoDate);
                        const d = new Date(isoDate);
                        d.setMonth(d.getMonth() + room.minimumStayMonths);
                        setSelectedEndDate(d.toISOString().split('T')[0]);
                      } else {
                        if (new Date(isoDate) < new Date(selectedStartDate)) {
                          setSelectedStartDate(isoDate);
                        } else {
                          setSelectedEndDate(isoDate);
                        }
                      }
                    }}
                    className={`h-11 sm:h-12 rounded-xl p-1 border text-left flex flex-col justify-between transition cursor-pointer relative group ${cellBg}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-semibold ${textColor}`}>{dayNum}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    </div>

                    <div className="text-[9px] leading-tight truncate">
                      {isStart ? (
                        <span className="font-bold text-white">Move-in</span>
                      ) : isEnd ? (
                        <span className="font-bold text-white">Move-out</span>
                      ) : status.type === 'limited' ? (
                        <span className="text-amber-700 font-semibold hidden sm:inline">1 left</span>
                      ) : status.type === 'available' ? (
                        <span className="text-emerald-700 hidden sm:inline">Open</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Available Slots</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>1 Slot Left</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Fully Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e05d26]" />
                <span>Selected Term</span>
              </div>
            </div>
          </div>

          {/* Occupied periods breakdown (transparency for students) */}
          {room.occupiedPeriods.length > 0 && (
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <UserCheck className="w-4 h-4 text-[#e05d26]" />
                <span>Current Occupancy Information</span>
              </div>
              <div className="space-y-1.5 text-xs text-stone-600">
                {room.occupiedPeriods.map((period, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span>• {period.label || 'Occupied bed'}</span>
                    <span className="text-stone-400 font-mono">
                      Through {period.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Price Summary and Booking CTA */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto text-xs">
            <span className="text-stone-500 uppercase text-[10px] font-bold block">
              Calculated Stay
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-stone-900 text-base">
                {durationInMonths} {durationInMonths === 1 ? 'Month' : 'Months'}
              </span>
              <span className="text-stone-500">
                (Est. Total: ₱{estimatedTotal.toLocaleString()})
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              {selectedStartDate} to {selectedEndDate}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectBookingDates(selectedStartDate, durationInMonths);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow-md shadow-[#e05d26]/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Book Selected Dates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
