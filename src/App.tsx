/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_ROOMS } from './data/mockRooms';
import { Room, BookingRequest, AuthMode } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterRibbon } from './components/FilterRibbon';
import { RoomList } from './components/RoomList';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { AuthPortal } from './components/AuthPortal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { VirtualTourModal } from './components/VirtualTourModal';
import { DirectionsModal } from './components/DirectionsModal';
import { BookingModal } from './components/BookingModal';
import { SavedRoomsModal } from './components/SavedRoomsModal';
import { AvailabilityCalendarModal } from './components/AvailabilityCalendarModal';
import { ChatModal } from './components/ChatModal';
import { IntroductionPage } from './components/IntroductionPage';
import { RoomUnitsDirectoryModal } from './components/RoomUnitsDirectoryModal';
import { PaymentAndAnnouncementModal } from './components/PaymentAndAnnouncementModal';
import { PartnerProgramModal } from './components/PartnerProgramModal';
import { SubUnit } from './types';

export default function App() {
  // Navigation & View State (defaults to 'intro' for welcoming new users)
  const [currentView, setCurrentView] = useState<'intro' | 'search' | 'auth' | 'owner-dashboard'>('intro');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [authMode, setAuthMode] = useState<AuthMode>('owner');
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: AuthMode;
  } | null>(null);

  // Data State - initialized from localStorage or defaults for Oroquieta City
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('vrent_rooms_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read rooms from localStorage', e);
    }
    return INITIAL_ROOMS;
  });

  const [requests, setRequests] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('vrent_requests_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read requests from localStorage', e);
    }
    return [
      {
        id: 'req-1',
        roomId: 'room-1',
        roomTitle: 'Sunrise Student Haven',
        roomPrice: 2500,
        renterName: 'Mark Angelo Gomez',
        renterEmail: 'm.gomez@student.ustp.edu.ph',
        renterPhone: '+63 929 112 4433',
        moveInDate: '2026-11-15',
        durationMonths: 5,
        notes: 'BS Information Technology sophomore at USTP Oroquieta Campus. Moving in before 2nd sem classes start.',
        status: 'pending',
        createdAt: '2026-11-04',
      },
      {
        id: 'req-2',
        roomId: 'room-1',
        roomTitle: 'Sunrise Student Haven',
        roomPrice: 2500,
        renterName: 'Clarisse Anne Perez',
        renterEmail: 'c.perez@student.ustp.edu.ph',
        renterPhone: '+63 917 882 0019',
        moveInDate: '2026-11-12',
        durationMonths: 10,
        notes: 'BS Agriculture student at USTP Mobod. Assigned to Bedspace A.',
        status: 'approved',
        createdAt: '2026-11-02',
      },
    ];
  });

  // Persist rooms and booking requests to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vrent_rooms_v2', JSON.stringify(rooms));
    } catch (e) {
      console.warn('Could not save rooms to localStorage', e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem('vrent_requests_v2', JSON.stringify(requests));
    } catch (e) {
      console.warn('Could not save requests to localStorage', e);
    }
  }, [requests]);

  // Saved / Bookmarked Rooms (Sunrise Student Haven)
  const [savedRoomIds, setSavedRoomIds] = useState<string[]>(['room-1']);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [withinDistance, setWithinDistance] = useState<number | 'any'>('any');
  const [maxRent, setMaxRent] = useState<number | 'any'>('any');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLocating, setIsLocating] = useState(false);

  // Active Modals & Selection
  const [selectedMapRoom, setSelectedMapRoom] = useState<Room | null>(null);
  const [active360Room, setActive360Room] = useState<Room | null>(null);
  const [activeDirectionsRoom, setActiveDirectionsRoom] = useState<Room | null>(null);
  const [activeBookingRoom, setActiveBookingRoom] = useState<Room | null>(null);
  const [activeCalendarRoom, setActiveCalendarRoom] = useState<Room | null>(null);
  const [activeChatRoom, setActiveChatRoom] = useState<Room | null>(null);
  const [activeDirectoryRoom, setActiveDirectoryRoom] = useState<Room | null>(null);
  const [activePaymentRoom, setActivePaymentRoom] = useState<Room | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [prefilledUnitNumber, setPrefilledUnitNumber] = useState<string | undefined>(undefined);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [bookingPrefilledDates, setBookingPrefilledDates] = useState<{
    startDate: string;
    durationMonths: number;
  } | null>(null);

  // Handle "Near me" location detector
  const handleNearMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setWithinDistance(5); // Filter within 5km of Oroquieta campus centers
      setSearchQuery('Oroquieta');
      setActiveCity('Oroquieta');
      const el = document.getElementById('listings-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  // Toggle Save bookmark
  const handleToggleSave = (roomId: string) => {
    setSavedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  // Open Auth Portal
  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login Success
  const handleLoginSuccess = (user: { name: string; email: string; role: AuthMode }) => {
    setCurrentUser(user);
    if (user.role === 'owner') {
      setCurrentView('owner-dashboard');
    } else {
      setCurrentView('search');
    }
  };

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          room.title.toLowerCase().includes(q) ||
          room.location.toLowerCase().includes(q) ||
          room.city.toLowerCase().includes(q) ||
          room.landmark.toLowerCase().includes(q) ||
          room.type.toLowerCase().includes(q) ||
          room.amenities.some((a) => a.toLowerCase().includes(q));

        if (!matchesQuery) return false;
      }

      // City filter
      if (activeCity && room.city.toLowerCase() !== activeCity.toLowerCase()) {
        return false;
      }

      // Distance filter
      if (withinDistance !== 'any' && room.distanceKm > withinDistance) {
        return false;
      }

      // Max Rent filter
      if (maxRent !== 'any' && room.price > maxRent) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && room.type !== selectedType) {
        return false;
      }

      // Ribbon Tag filter
      if (activeTag && !room.tags.includes(activeTag)) {
        return false;
      }

      return true;
    });
  }, [rooms, searchQuery, activeCity, withinDistance, maxRent, selectedType, activeTag]);

  // Saved rooms list
  const savedRooms = useMemo(() => {
    return rooms.filter((r) => savedRoomIds.includes(r.id));
  }, [rooms, savedRoomIds]);

  // Add room handler (for owners)
  const handleAddRoom = (newRoom: Room) => {
    setRooms((prev) => [newRoom, ...prev]);
  };

  // Update Request status
  const handleUpdateRequestStatus = (
    requestId: string,
    newStatus: 'approved' | 'declined'
  ) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
  };

  // Submit new booking request
  const handleSubmitBookingRequest = (
    reqData: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newReq: BookingRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCity(null);
    setActiveTag(null);
    setWithinDistance('any');
    setMaxRent('any');
    setSelectedType('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e1615] font-sans">
      {/* If on introduction view, show full introductory experience */}
      {currentView === 'intro' ? (
        <IntroductionPage
          onEnterApp={() => {
            setCurrentView('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenOwnerPortal={() => handleOpenAuth('owner')}
          onOpenRenterPortal={() => handleOpenAuth('renter')}
          onExploreCity={(city) => {
            setActiveCity(city);
            setSearchQuery(city);
            setCurrentView('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Navbar
            currentView={currentView}
            onNavigateSearch={() => setCurrentView('search')}
            onNavigateIntro={() => {
              setCurrentView('intro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
            savedCount={savedRoomIds.length}
            onOpenSaved={() => setShowSavedModal(true)}
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentView('search');
            }}
          />

          {/* Main View Router */}
          <main className="flex-1">
            {currentView === 'search' && (
              <>
                {/* Hero Section */}
                <Hero
                  searchQuery={searchQuery}
                  onSearchChange={(q) => {
                    setSearchQuery(q);
                    if (!q) setActiveCity(null);
                  }}
                  onNearMeClick={handleNearMe}
                  isLocating={isLocating}
                  onSelectCity={(city) => {
                    setActiveCity(city || null);
                    setSearchQuery(city);
                  }}
                  activeCity={activeCity}
                />

            {/* Filter Ribbon with Badges */}
            <FilterRibbon
              activeTag={activeTag}
              onTagToggle={(tag) => setActiveTag((prev) => (prev === tag ? null : tag))}
            />

            {/* All Available Rooms Section (Grid + Map View) */}
            <RoomList
              rooms={filteredRooms}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              withinDistance={withinDistance}
              onChangeDistance={setWithinDistance}
              maxRent={maxRent}
              onChangeMaxRent={setMaxRent}
              selectedType={selectedType}
              onChangeType={setSelectedType}
              selectedRoom={selectedMapRoom}
              onSelectRoom={setSelectedMapRoom}
              onOpen360={(room) => setActive360Room(room)}
              onOpenCalendar={(room) => setActiveCalendarRoom(room)}
              onOpenChat={(room) => setActiveChatRoom(room)}
              onOpenUnitsDirectory={(room) => setActiveDirectoryRoom(room)}
              onOpenPayment={(room) => setActivePaymentRoom(room)}
              onGetDirections={(room) => setActiveDirectionsRoom(room)}
              onRequestRoom={(room) => {
                setBookingPrefilledDates(null);
                setPrefilledUnitNumber(undefined);
                setActiveBookingRoom(room);
              }}
              savedRoomIds={savedRoomIds}
              onToggleSave={handleToggleSave}
              onResetFilters={handleResetFilters}
            />

            {/* 3-Step Guide and Owner Promo */}
            <HowItWorks onOpenOwnerPortal={() => handleOpenAuth('owner')} />
          </>
        )}

        {currentView === 'auth' && (
          <AuthPortal
            initialMode={authMode}
            onBackToSearch={() => setCurrentView('search')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentView === 'owner-dashboard' && (
          <OwnerDashboard
            rooms={rooms}
            requests={requests}
            onAddRoom={handleAddRoom}
            onUpdateStatus={handleUpdateRequestStatus}
            onBackToSearch={() => {
              setCurrentView('search');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            ownerName={currentUser?.name || 'Mrs. Remedios Santos'}
            onOpenPartnerVisitModal={() => setShowPartnerModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenOwnerPortal={() => handleOpenAuth('owner')}
        onOpenRenterPortal={() => handleOpenAuth('renter')}
        onSelectCity={(city) => {
          setActiveCity(city);
          setSearchQuery(city);
          setCurrentView('search');
        }}
      />
      </>
      )}

      {/* Real-Time Chat Modal between Renter and Owner */}
      {activeChatRoom && (
        <ChatModal
          room={activeChatRoom}
          currentUser={currentUser}
          onClose={() => setActiveChatRoom(null)}
          onRequestBooking={(room) => {
            setActiveChatRoom(null);
            setBookingPrefilledDates(null);
            setActiveBookingRoom(room);
          }}
        />
      )}

      {/* 360° Virtual Tour Modal */}
      {active360Room && (
        <VirtualTourModal
          room={active360Room}
          onClose={() => setActive360Room(null)}
          onRequestRoom={(room) => setActiveBookingRoom(room)}
        />
      )}

      {/* Directions Modal */}
      {activeDirectionsRoom && (
        <DirectionsModal
          room={activeDirectionsRoom}
          onClose={() => setActiveDirectionsRoom(null)}
        />
      )}

      {/* Availability Calendar Modal */}
      {activeCalendarRoom && (
        <AvailabilityCalendarModal
          room={activeCalendarRoom}
          onClose={() => setActiveCalendarRoom(null)}
          onSelectBookingDates={(startDate, durationMonths) => {
            setBookingPrefilledDates({ startDate, durationMonths });
            setActiveBookingRoom(activeCalendarRoom);
          }}
        />
      )}

      {/* Booking / Room Request Modal */}
      {activeBookingRoom && (
        <BookingModal
          room={activeBookingRoom}
          onClose={() => {
            setActiveBookingRoom(null);
            setBookingPrefilledDates(null);
            setPrefilledUnitNumber(undefined);
          }}
          onSubmitRequest={handleSubmitBookingRequest}
          defaultUserName={currentUser?.name || ''}
          defaultUserEmail={currentUser?.email || ''}
          initialMoveInDate={bookingPrefilledDates?.startDate}
          initialDurationMonths={bookingPrefilledDates?.durationMonths}
          initialUnitNumber={prefilledUnitNumber}
        />
      )}

      {/* Renter Room Units Directory & Exact Unit Inspector Modal (Requirements #3 & #5) */}
      {activeDirectoryRoom && (
        <RoomUnitsDirectoryModal
          room={activeDirectoryRoom}
          onClose={() => setActiveDirectoryRoom(null)}
          onOpen360ForUnit={(room, unit) => {
            setActiveDirectoryRoom(null);
            setActive360Room(room);
          }}
          onRequestUnit={(room, unit) => {
            setActiveDirectoryRoom(null);
            setPrefilledUnitNumber(unit.unitNumber);
            setActiveBookingRoom(room);
          }}
        />
      )}

      {/* Payment & Owner Announcement Modal (Requirement #4) */}
      {activePaymentRoom && (
        <PaymentAndAnnouncementModal
          room={activePaymentRoom}
          onClose={() => setActivePaymentRoom(null)}
          onSubmitPayment={(paymentData) => {
            console.log('Payment registered:', paymentData);
          }}
        />
      )}

      {/* Partner Visit & 360 Capture Request Modal (Requirement #2) */}
      {showPartnerModal && (
        <PartnerProgramModal
          onClose={() => setShowPartnerModal(false)}
          defaultOwnerName={currentUser?.name || ''}
        />
      )}

      {/* Saved Bookmarks Modal */}
      {showSavedModal && (
        <SavedRoomsModal
          savedRooms={savedRooms}
          onClose={() => setShowSavedModal(false)}
          onRemove={handleToggleSave}
          onRequestRoom={(room) => {
            setShowSavedModal(false);
            setActiveBookingRoom(room);
          }}
          onOpen360={(room) => {
            setShowSavedModal(false);
            setActive360Room(room);
          }}
        />
      )}
    </div>
  );
}
