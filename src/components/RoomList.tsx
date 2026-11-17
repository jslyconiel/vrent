import React from 'react';
import { Room } from '../types';
import { RoomCard } from './RoomCard';
import { MapView } from './MapView';
import { LayoutGrid, Map as MapIcon, SlidersHorizontal, MapPinOff } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
  withinDistance: number | 'any';
  onChangeDistance: (val: number | 'any') => void;
  maxRent: number | 'any';
  onChangeMaxRent: (val: number | 'any') => void;
  selectedType: string;
  onChangeType: (val: string) => void;
  selectedRoom: Room | null;
  onSelectRoom: (room: Room | null) => void;
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
  viewMode,
  onViewModeChange,
  withinDistance,
  onChangeDistance,
  maxRent,
  onChangeMaxRent,
  selectedType,
  onChangeType,
  selectedRoom,
  onSelectRoom,
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
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#e05d26] uppercase font-sans">
              A place for every plan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1 font-serif">
              All available rooms
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Search a location to see what&apos;s nearby
            </p>
          </div>

          {/* Controls: View Mode Switcher + Filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {/* View Mode Toggle Button Group */}
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-stone-400 mb-1">
                Display View
              </label>
              <div className="flex items-center p-1 bg-white border border-stone-300 rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => onViewModeChange('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#e05d26] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-[#e05d26] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
              </div>
            </div>

            {/* Distance filter */}
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-stone-400 mb-1">Within</label>
              <select
                value={withinDistance}
                onChange={(e) => {
                  const val = e.target.value === 'any' ? 'any' : Number(e.target.value);
                  onChangeDistance(val);
                }}
                className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer"
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
              <label className="text-[10px] uppercase font-bold text-stone-400 mb-1">Max rent</label>
              <select
                value={maxRent}
                onChange={(e) => {
                  const val = e.target.value === 'any' ? 'any' : Number(e.target.value);
                  onChangeMaxRent(val);
                }}
                className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer"
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
              <label className="text-[10px] uppercase font-bold text-stone-400 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => onChangeType(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#e05d26] shadow-sm cursor-pointer"
              >
                <option value="all">All</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Studio">Studio</option>
                <option value="Dormitory Bed">Dormitory Bed</option>
                <option value="Private Room">Private Room</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Count Bar */}
        <div className="py-4 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-stone-800 font-semibold">{rooms.length}</strong>{' '}
              available rooms
            </span>
            {viewMode === 'map' && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Map Active • Click pins to preview
              </span>
            )}
          </div>
          {(withinDistance !== 'any' || maxRent !== 'any' || selectedType !== 'all') && (
            <button
              onClick={onResetFilters}
              className="text-[#e05d26] hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* View Mode Content */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <MapView
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelectRoom={onSelectRoom}
              onOpen360={onOpen360}
              onOpenCalendar={onOpenCalendar}
              onOpenChat={onOpenChat}
              onRequestRoom={onRequestRoom}
              onGetDirections={onGetDirections}
            />

            {/* Quick mini-scroll below map */}
            <div className="pt-2">
              <span className="text-xs font-bold text-stone-700 block mb-2">
                Quick Room Select ({rooms.length} nearby)
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {rooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => onSelectRoom(room)}
                      className={`flex-shrink-0 w-60 p-3 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 border-[#e05d26] shadow-md ring-2 ring-[#e05d26]/30'
                          : 'bg-white border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {room.title}
                        </span>
                        <span className="text-xs font-extrabold text-[#e05d26]">
                          ₱{room.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">{room.location}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
                        <span>{room.distanceKm} km away</span>
                        <span className="font-semibold text-emerald-600">
                          {room.slotsAvailable} slots free
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <h3 className="text-lg font-bold text-stone-800">No rooms found matching your criteria</h3>
            <p className="mt-2 text-xs text-stone-500 max-w-sm mx-auto">
              Try broadening your distance filter or adjusting your price ceiling to find nearby boarding houses.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-semibold shadow transition cursor-pointer"
            >
              View all available rooms
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
