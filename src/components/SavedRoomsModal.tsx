import React from 'react';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { Room } from '../types';
import { RoomIllustration } from './RoomIllustration';

interface SavedRoomsModalProps {
  savedRooms: Room[];
  onClose: () => void;
  onRemove: (roomId: string) => void;
  onRequestRoom: (room: Room) => void;
  onOpen360: (room: Room) => void;
}

export const SavedRoomsModal: React.FC<SavedRoomsModalProps> = ({
  savedRooms,
  onClose,
  onRemove,
  onRequestRoom,
  onOpen360,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]">
        <div className="p-5 bg-[#0e1615] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#e05d26] fill-[#e05d26]" />
            <div>
              <h3 className="text-base font-bold text-white">Your Saved Rooms</h3>
              <p className="text-xs text-stone-400">{savedRooms.length} rooms bookmarked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto divide-y divide-stone-100 flex-1">
          {savedRooms.length > 0 ? (
            savedRooms.map((room) => (
              <div key={room.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <RoomIllustration theme={room.illustrationTheme} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{room.title}</h4>
                    <p className="text-xs text-stone-500">{room.location}</p>
                    <span className="text-xs font-extrabold text-[#e05d26]">
                      ₱{room.price.toLocaleString()} / mo
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpen360(room);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 hover:bg-stone-50"
                  >
                    360° tour
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onRequestRoom(room);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#e05d26] text-white text-xs font-bold shadow-sm hover:bg-[#c94f1c]"
                  >
                    Request
                  </button>
                  <button
                    onClick={() => onRemove(room.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-stone-500 text-xs">
              You haven&apos;t saved any rooms yet. Click the heart icon on any room card to compare!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
