import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Room, CampusLandmark } from '../types';
import { CAMPUS_LANDMARKS } from '../data/mockRooms';
import {
  MapPin,
  RotateCw,
  Calendar,
  Send,
  Navigation,
  School,
  X,
  Maximize2,
  Minimize2,
  Layers,
  ChevronRight,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { RoomIllustration } from './RoomIllustration';

interface MapViewProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room | null) => void;
  onOpen360: (room: Room) => void;
  onOpenCalendar: (room: Room) => void;
  onOpenChat: (room: Room) => void;
  onRequestRoom: (room: Room) => void;
  onGetDirections: (room: Room) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  onOpen360,
  onOpenCalendar,
  onOpenChat,
  onRequestRoom,
  onGetDirections,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const landmarkMarkersRef = useRef<L.Marker[]>([]);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  const [activeCityFocus, setActiveCityFocus] = useState<string>('Oroquieta');
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // 1. Initialize Map Instance once on mount & clean up on unmount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if container already had a leaflet instance attached to prevent double-init
    const container = mapContainerRef.current as any;
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [8.487, 123.805], // Oroquieta City Center (Capitol & Schools)
      zoom: 15,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      setIsMapReady(false);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      landmarkMarkersRef.current.forEach((m) => m.remove());
      landmarkMarkersRef.current = [];
      if (radiusCircleRef.current) {
        radiusCircleRef.current.remove();
        radiusCircleRef.current = null;
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Invalidate map size when toggling fullscreen
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [isFullScreen]);

  // 3. Update Room and Landmark Markers whenever rooms, selectedRoom or showLandmarks change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapReady) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    landmarkMarkersRef.current.forEach((m) => m.remove());
    landmarkMarkersRef.current = [];

    // Add Campus Landmark Markers
    if (showLandmarks) {
      CAMPUS_LANDMARKS.forEach((landmark) => {
        const landmarkIcon = L.divIcon({
          className: 'custom-landmark-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background: #1e293b;
              color: #fef08a;
              font-family: system-ui, sans-serif;
              font-size: 11px;
              font-weight: 700;
              padding: 4px 8px;
              border-radius: 9999px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              border: 1.5px solid #d4af37;
              white-space: nowrap;
              transform: translate(-50%, -100%);
              cursor: pointer;
            ">
              <span style="font-size: 12px;">🎓</span>
              <span>${landmark.name}</span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const lmMarker = L.marker([landmark.coordinates.lat, landmark.coordinates.lng], {
          icon: landmarkIcon,
          zIndexOffset: 50,
        }).addTo(map);

        lmMarker.on('click', () => {
          map.setView([landmark.coordinates.lat, landmark.coordinates.lng], 16, { animate: true });
        });

        landmarkMarkersRef.current.push(lmMarker);
      });
    }

    // Add Room Markers
    const bounds = L.latLngBounds([]);

    rooms.forEach((room) => {
      const isSelected = selectedRoom?.id === room.id;
      const formattedPrice =
        room.price >= 1000 ? `₱${(room.price / 1000).toFixed(1)}k` : `₱${room.price}`;

      const markerHtml = `
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          background: ${isSelected ? '#e05d26' : '#ffffff'};
          color: ${isSelected ? '#ffffff' : '#0f172a'};
          font-family: system-ui, sans-serif;
          font-size: 12px;
          font-weight: 800;
          padding: ${isSelected ? '6px 12px' : '4px 8px'};
          border-radius: 12px;
          box-shadow: ${isSelected ? '0 8px 20px rgba(224,93,38,0.5)' : '0 4px 12px rgba(0,0,0,0.18)'};
          border: 2px solid ${isSelected ? '#ffffff' : '#e2e8f0'};
          white-space: nowrap;
          cursor: pointer;
          transform: translate(-50%, -50%) ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition: all 0.2s ease;
        ">
          <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${
            isSelected ? '#ffffff' : '#10b981'
          };"></span>
          <span>${formattedPrice}</span>
        </div>
      `;

      const roomIcon = L.divIcon({
        className: 'custom-room-marker',
        html: markerHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([room.coordinates.lat, room.coordinates.lng], {
        icon: roomIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      }).addTo(map);

      marker.on('click', () => {
        onSelectRoom(room);
        map.setView([room.coordinates.lat, room.coordinates.lng], 16, { animate: true });
      });

      bounds.extend([room.coordinates.lat, room.coordinates.lng]);
      markersRef.current.push(marker);
    });

    // Draw 1km radius circle around active center
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    if (rooms.length > 0) {
      const centerCoords: [number, number] = [
        rooms[0].coordinates.lat,
        rooms[0].coordinates.lng,
      ];
      radiusCircleRef.current = L.circle(centerCoords, {
        radius: 1000,
        color: '#e05d26',
        fillColor: '#e05d26',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '6, 6',
      }).addTo(map);
    }
  }, [rooms, selectedRoom, showLandmarks, isMapReady]);

  // Center on specific room when selected
  useEffect(() => {
    if (selectedRoom && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedRoom.coordinates.lat, selectedRoom.coordinates.lng],
        16,
        { animate: true }
      );
    }
  }, [selectedRoom]);

  // Focus city preset
  const handleFocusCity = (city: string, lat: number, lng: number, zoom = 14) => {
    setActiveCityFocus(city);
    mapInstanceRef.current?.setView([lat, lng], zoom, { animate: true });
  };

  // Fit all bounds
  const handleFitAll = () => {
    if (!mapInstanceRef.current || rooms.length === 0) return;
    const bounds = L.latLngBounds(rooms.map((r) => [r.coordinates.lat, r.coordinates.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-stone-300 shadow-xl bg-stone-100 flex flex-col ${
        isFullScreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[620px] sm:h-[680px]'
      }`}
    >
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Oroquieta Barangay Jump Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-stone-200 pointer-events-auto overflow-x-auto max-w-full">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 hidden sm:inline">
            Oroquieta Barangays:
          </span>
          <button
            onClick={() => handleFocusCity('Oroquieta', 8.487, 123.805, 15)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCityFocus === 'Oroquieta'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Oroquieta
          </button>
          <button
            onClick={() => handleFocusCity('Lower Langcangan', 8.487, 123.805, 16)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCityFocus === 'Lower Langcangan'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Lower Langcangan
          </button>
          <button
            onClick={() => handleFocusCity('Mobod', 8.489, 123.803, 16)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCityFocus === 'Mobod'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Mobod (USTP)
          </button>
          <button
            onClick={() => handleFocusCity('Canubay', 8.483, 123.802, 16)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCityFocus === 'Canubay'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Canubay (SJC)
          </button>
          <button
            onClick={handleFitAll}
            className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer border-l border-stone-200"
          >
            Fit All
          </button>
        </div>

        {/* Right Tools (Toggle Universities & Fullscreen) */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md backdrop-blur-md flex items-center gap-1.5 border transition cursor-pointer ${
              showLandmarks
                ? 'bg-slate-900 text-amber-300 border-slate-700'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
            title="Toggle university landmarks"
          >
            <span>🎓</span>
            <span className="hidden sm:inline">Campuses</span>
          </button>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-md cursor-pointer"
            title={isFullScreen ? 'Exit fullscreen' : 'Expand map'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Selected Room Card */}
      {selectedRoom ? (
        <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:max-w-md z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-300 animate-fade-in flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-16 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                <RoomIllustration theme={selectedRoom.illustrationTheme} />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedRoom.type}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-stone-900 mt-1">
                  {selectedRoom.title}
                </h4>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#e05d26]" />
                  <span>{selectedRoom.location}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoom(null)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
            <div>
              <span className="text-base font-extrabold text-stone-900">
                ₱{selectedRoom.price.toLocaleString()}
              </span>
              <span className="text-stone-500"> / mo</span>
              <span className="text-[11px] text-emerald-600 block font-semibold">
                ● {selectedRoom.slotsAvailable} slots free
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpen360(selectedRoom)}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700"
                title="360° virtual tour"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#e05d26]" />
              </button>

              <button
                onClick={() => onOpenCalendar(selectedRoom)}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-[#e05d26] text-stone-700 hover:text-[#e05d26] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="View availability calendar"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </button>

              <button
                onClick={() => onOpenChat(selectedRoom)}
                className="p-2 rounded-xl border border-stone-200 hover:border-orange-300 bg-orange-50/60 hover:bg-orange-100/60 text-[#e05d26] transition cursor-pointer"
                title="Message owner directly"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onRequestRoom(selectedRoom)}
                className="px-3.5 py-1.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow cursor-pointer"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 z-20 bg-stone-900/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium border border-stone-700/80 shadow-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Click any marker to view room rates &amp; open virtual 360 tour</span>
        </div>
      )}
    </div>
  );
};
