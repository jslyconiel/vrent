import React from 'react';
import {
  MapPin,
  RotateCw,
  Heart,
  ArrowRight,
  Calendar,
  MessageSquare,
  ShieldCheck,
  BedDouble,
  Receipt,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { Room } from '../types';
import { RoomIllustration } from './RoomIllustration';

interface RoomCardProps {
  room: Room;
  onOpen360: (room: Room) => void;
  onGetDirections: (room: Room) => void;
  onRequestRoom: (room: Room) => void;
  onOpenCalendar: (room: Room) => void;
  onOpenChat: (room: Room) => void;
  onOpenUnitsDirectory?: (room: Room) => void;
  onOpenPayment?: (room: Room) => void;
  isSaved: boolean;
  onToggleSave: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onOpen360,
  onGetDirections,
  onRequestRoom,
  onOpenCalendar,
  onOpenChat,
  onOpenUnitsDirectory,
  onOpenPayment,
  isSaved,
  onToggleSave,
}) => {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Shared Room':
        return 'bg-emerald-100/90 text-emerald-800 border-emerald-200';
      case 'Studio':
        return 'bg-amber-100/90 text-amber-800 border-amber-200';
      case 'Dormitory Bed':
        return 'bg-rose-100/90 text-rose-800 border-rose-200';
      case 'Private Room':
      default:
        return 'bg-orange-100/90 text-orange-800 border-orange-200';
    }
  };

  const formattedAvailableDate = new Date(room.availableFrom).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Graphic Header */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100 border-b border-stone-100">
        {room.roomMedia?.type === 'panorama' ? (
          <img
            src={room.roomMedia.url}
            alt={room.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <RoomIllustration theme={room.illustrationTheme} />
        )}

        {/* Room Type Tag on top left */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide border shadow-sm backdrop-blur-sm ${getBadgeStyle(
              room.type
            )}`}
          >
            {room.type}
          </span>
        </div>

        {/* 360° / Video Preview Button on top right */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => onOpen360(room)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-900 text-xs sm:text-sm font-bold tracking-tight shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-stone-200"
            title="Open room video or 360° panoramic preview"
          >
            {room.roomMedia?.type === 'video' ? (
              <>
                <Video className="w-4 h-4 text-[#e05d26]" />
                <span>Video &amp; 360°</span>
              </>
            ) : room.roomMedia?.type === 'panorama' ? (
              <>
                <ImageIcon className="w-4 h-4 text-[#e05d26]" />
                <span>Owner 360°</span>
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4 text-[#e05d26] animate-pulse" />
                <span>360° preview</span>
              </>
            )}
          </button>
        </div>

        {/* Distance chip overlay */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="px-3 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-amber-200 text-xs font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#e05d26]" />
            {room.distanceKm < 1
              ? `${Math.round(room.distanceKm * 1000)} m away`
              : `${room.distanceKm.toFixed(1)} km away`}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Verified Landlord */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-stone-900 tracking-tight group-hover:text-[#e05d26] transition-colors font-sans">
              {room.title}
            </h3>
            {room.ownerVerified && (
              <span
                className="shrink-0 p-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200"
                title={room.ownerVerificationBadge || 'Verified Landlord - Anti-Scam Protection'}
              >
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Location, Near School & Walking Time */}
          <p className="mt-1.5 text-sm text-stone-600 flex items-start gap-1.5 font-medium leading-relaxed">
            <span className="text-[#e05d26] font-bold">•</span>
            <span>
              {room.location}
              {room.nearSchool ? ` · Near ${room.nearSchool}` : ''}
              {room.walkingMinutes ? ` (${room.walkingMinutes} mins walk)` : ''}
            </span>
          </p>

          {/* Student Decision Badges (Gender Policy & Utilities) */}
          {(room.genderPolicy || room.utilitiesIncluded) && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {room.genderPolicy && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold">
                  {room.genderPolicy}
                </span>
              )}
              {room.utilitiesIncluded && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  {room.utilitiesIncluded}
                </span>
              )}
            </div>
          )}

          {/* Capacity & Inspect All Rooms trigger */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-stone-700 whitespace-nowrap">
              <span className="font-bold text-emerald-600">
                {room.slotsAvailable} free
              </span>
              <span className="text-stone-400">/</span>
              <span className="text-stone-600 font-medium">
                {room.totalSlots - room.slotsAvailable} availed ({room.totalSlots} total)
              </span>
            </div>

            {onOpenUnitsDirectory && (
              <button
                type="button"
                onClick={() => onOpenUnitsDirectory(room)}
                className="text-xs sm:text-sm font-bold text-[#e05d26] hover:text-[#c94f1c] flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
                title="Inspect all individual rooms & choose your exact unit"
              >
                <BedDouble className="w-4 h-4" />
                <span>See All Rooms</span>
              </button>
            )}
          </div>

          {/* Amenities Chips */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {room.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200/60"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Availability and Directions Links */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm">
            <button
              onClick={() => onOpenCalendar(room)}
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-[#e05d26] font-semibold transition cursor-pointer"
              title="Open availability calendar"
            >
              <Calendar className="w-4 h-4 text-[#e05d26]" />
              <span>Available {formattedAvailableDate}</span>
            </button>

            <button
              onClick={() => onGetDirections(room)}
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group/link cursor-pointer"
            >
              <span>Directions</span>
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Price and Actions */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2.5">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
                ₱{room.price.toLocaleString()}
              </span>
              <span className="text-sm text-stone-500 font-medium">/mo</span>
            </div>
            <span className="text-xs text-stone-500 block">
              {room.slotsAvailable} of {room.totalSlots} slots free
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onToggleSave(room.id)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-600'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save room'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => onOpenChat(room)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-[#e05d26] border border-stone-200 transition cursor-pointer flex items-center justify-center"
              title="Message owner to discuss room details"
            >
              <MessageSquare className="w-4 h-4 text-[#e05d26]" />
            </button>

            {onOpenPayment && (
              <button
                onClick={() => onOpenPayment(room)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer flex items-center justify-center"
                title="View landlord announcements & record rent/deposit payment"
              >
                <Receipt className="w-4 h-4 text-amber-700" />
              </button>
            )}

            <button
              onClick={() => onRequestRoom(room)}
              className="px-4 py-2 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold tracking-wide shadow-sm hover:shadow transition active:scale-95 cursor-pointer"
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
