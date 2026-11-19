import React from 'react';
import { Room, UserProfile } from '../types';
import { OROQUIETA_CITY_SCHOOLS } from '../data/oroquietaSchools';
import { RoomCard } from './RoomCard';
import { MapPinOff, GraduationCap } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  currentUser?: UserProfile | null;
  withinDistance: number | 'any';
  onChangeDistance: (val: number | 'any') => void;
  maxRent: number | 'any';
  onChangeMaxRent: (val: number | 'any') => void;
  selectedType: string;
  onChangeType: (val: string) => void;
  selectedGender: string;
  onChangeGender: (val: string) => void;
  selectedUtilities: string;
  onChangeUtilities: (val: string) => void;
  selectedSchool: string;
  onChangeSchool: (val: string) => void;
  onOpen360: (room: Room) => void;
  onOpenCalendar: (room: Room) => void;
  onOpenChat: (room: Room) => void;
  onOpenUnitsDirectory?: (room: Room) => void;
  onOpenPayment?: (room: Room) => void;
  onGetDirections: (room: Room) => void;
  onRequestRoom: (room: Room) => void;
  savedRoomIds: string[];
  onToggleSave: (id: string) => void;
  onResetFilters: () => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  currentUser,
  withinDistance,
  onChangeDistance,
  maxRent,
  onChangeMaxRent,
  selectedType,
  onChangeType,
  selectedGender,
  onChangeGender,
  selectedUtilities,
  onChangeUtilities,
  selectedSchool,
  onChangeSchool,
  onOpen360,
  onOpenCalendar,
  onOpenChat,
  onOpenUnitsDirectory,
  onOpenPayment,
  onGetDirections,
  onRequestRoom,
  savedRoomIds,
  onToggleSave,
  onResetFilters,
}) => {
  return (
    <section id="listings-section" className="w-full bg-[#faf7f2] py-10 sm:py-14 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header, View Mode Switcher & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#e05d26] uppercase font-sans">
              {currentUser?.role === 'renter'
                ? `RENTER DASHBOARD · WELCOME, ${currentUser.name.toUpperCase()}`
                : 'A place for every plan'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1 font-serif">
              {currentUser?.role === 'renter'
                ? 'Rooms listed by owners'
                : 'All available rooms'}
            </h2>
            <p className="text-base text-stone-600 mt-1">
              {currentUser?.role === 'renter'
                ? 'Live listings published by Oroquieta boarding house owners — inspect tours, locations & reserve your exact unit.'
                : "Search a location to see what's nearby"}
            </p>
          </div>

          {/* Controls: Filters */}
          <div className="flex flex-wrap items-center gap-3 text-sm">

            {/* Distance filter */}
            <div className="flex flex-col">
              <label className="text-xs uppercase font-bold text-stone-500 mb-1">Within</label>
              <select
                value={withinDistance}
                onChange={(e) => {
                  const val = e.target.value === 'any' ? 'any' : Number(e.target.value);
                  onChangeDistance(val);
                }}
                className="bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer"
              >
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={50}>50 km</option>
                <option value="any">Any distance</option>
              </select>
            </div>

            {/* Max rent filter */}
            <div className="flex flex-col">
              <label className="text-xs uppercase font-bold text-stone-500 mb-1">Max rent</label>
              <select
                value={maxRent}
                onChange={(e) => {
                  const val = e.target.value === 'any' ? 'any' : Number(e.target.value);
                  onChangeMaxRent(val);
                }}
                className="bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer"
              >
                <option value="any">Any</option>
                <option value={2000}>₱2,000</option>
                <option value={3000}>₱3,000</option>
                <option value={4500}>₱4,500</option>
                <option value={6000}>₱6,000</option>
                <option value={10000}>₱10,000</option>
              </select>
            </div>

            {/* Room type filter */}
            <div className="flex flex-col">
              <label className="text-xs uppercase font-bold text-stone-500 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => onChangeType(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer"
              >
                <option value="all">All</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Studio">Studio</option>
                <option value="Dormitory Bed">Dormitory Bed</option>
                <option value="Private Room">Private Room</option>
              </select>
            </div>

            {/* Gender policy filter */}
            <div className="flex flex-col">
              <label className="text-xs uppercase font-bold text-stone-500 mb-1">Policy</label>
              <select
                value={selectedGender}
                onChange={(e) => onChangeGender(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer"
              >
                <option value="all">Any Gender</option>
                <option value="Mixed">Mixed</option>
                <option value="Female Only">Female Only</option>
                <option value="Male Only">Male Only</option>
              </select>
            </div>

            {/* Near School filter (Oroquieta City Only) */}
            <div className="flex flex-col">
              <label className="text-xs uppercase font-bold text-stone-500 mb-1">
                School (Oroquieta)
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => onChangeSchool(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer max-w-[210px]"
              >
                <option value="all">All Oroquieta Schools</option>
                {OROQUIETA_CITY_SCHOOLS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Student School Banner (when student renter is logged in) */}
        {currentUser?.role === 'renter' && currentUser.school && (
          <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm text-stone-800">
              <GraduationCap className="w-5 h-5 text-[#e05d26] shrink-0" />
              <span>
                Showing boarding houses{' '}
                {selectedSchool !== 'all' ? (
                  <>
                    near <strong>{selectedSchool}</strong> (Oroquieta City only)
                  </>
                ) : (
                  <>across all schools in <strong>Oroquieta City</strong></>
                )}
                {currentUser.age || currentUser.gender ? (
                  <span className="text-stone-600">
                    {' '}
                    · Verified Student: {currentUser.name}
                    {currentUser.age ? `, ${currentUser.age} yrs` : ''}
                    {currentUser.gender ? ` · ${currentUser.gender}` : ''}
                  </span>
                ) : null}
              </span>
            </div>
            {selectedSchool !== 'all' ? (
              <button
                type="button"
                onClick={() => onChangeSchool('all')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-orange-300 text-xs font-bold text-[#c94f1c] cursor-pointer"
              >
                View All Oroquieta City Schools
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onChangeSchool(currentUser.school!)}
                className="px-3.5 py-1.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold cursor-pointer"
              >
                Filter Near {currentUser.school}
              </button>
            )}
          </div>
        )}

        {/* Listings Count Bar */}
        <div className="py-4 flex items-center justify-between text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-stone-900 font-semibold">{rooms.length}</strong>{' '}
              available rooms in Oroquieta City
            </span>
          </div>
          {(withinDistance !== 'any' ||
            maxRent !== 'any' ||
            selectedType !== 'all' ||
            selectedGender !== 'all' ||
            selectedUtilities !== 'all' ||
            selectedSchool !== 'all') && (
            <button
              onClick={onResetFilters}
              className="text-[#e05d26] hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Rooms Grid */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onOpen360={onOpen360}
                onOpenCalendar={onOpenCalendar}
                onOpenChat={onOpenChat}
                onOpenUnitsDirectory={onOpenUnitsDirectory}
                onOpenPayment={onOpenPayment}
                onGetDirections={onGetDirections}
                onRequestRoom={onRequestRoom}
                isSaved={savedRoomIds.includes(room.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200/90 shadow-sm max-w-lg mx-auto p-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#e05d26] mb-4">
              <MapPinOff className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-800">
              {withinDistance !== 'any' ||
              maxRent !== 'any' ||
              selectedType !== 'all' ||
              selectedGender !== 'all' ||
              selectedUtilities !== 'all' ||
              selectedSchool !== 'all'
                ? 'No rooms found matching your selected school or filters'
                : 'No rooms listed by owners yet'}
            </h3>
            <p className="mt-2 text-sm text-stone-500 max-w-sm mx-auto">
              {withinDistance !== 'any' ||
              maxRent !== 'any' ||
              selectedType !== 'all' ||
              selectedGender !== 'all' ||
              selectedUtilities !== 'all' ||
              selectedSchool !== 'all'
                ? 'No owner has listed a room matching that exact Oroquieta school/filter yet. You can view all Oroquieta City rooms or reset filters.'
                : 'Boarding house owners haven’t published available rooms yet. Once an owner lists rooms in the Owner Dashboard, they will appear right here.'}
            </p>
            {(withinDistance !== 'any' ||
              maxRent !== 'any' ||
              selectedType !== 'all' ||
              selectedGender !== 'all' ||
              selectedUtilities !== 'all' ||
              selectedSchool !== 'all') && (
              <button
                onClick={onResetFilters}
                className="mt-5 px-6 py-3 rounded-full bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-semibold shadow transition cursor-pointer"
              >
                View all Oroquieta City rooms
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
