/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Room,
  BookingRequest,
  AuthMode,
  RoomMedia,
  PaymentRecord,
  OwnerAnnouncement,
  UserProfile,
} from './types';
import { OROQUIETA_CITY_SCHOOLS } from './data/oroquietaSchools';
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
import { RenterBookingsModal } from './components/RenterBookingsModal';

export default function App() {
  // Navigation & View State (defaults to 'intro' for welcoming new users)
  const [currentView, setCurrentView] = useState<'intro' | 'search' | 'auth' | 'owner-dashboard'>('intro');
  const [authMode, setAuthMode] = useState<AuthMode>('owner');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Data State - starts empty for both Owners & Renters until owners list their available rooms
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('vrent_rooms_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read rooms from localStorage', e);
    }
    return [];
  });

  const [requests, setRequests] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('vrent_requests_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read requests from localStorage', e);
    }
    return [];
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vrent_payments_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read payments from localStorage', e);
    }
    return [];
  });

  const [announcements, setAnnouncements] = useState<OwnerAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('vrent_announcements_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read announcements from localStorage', e);
    }
    return [];
  });

  // Tracks the active tenant login session so My Bookings starts empty on every tenant log in
  const [tenantSessionStartMs, setTenantSessionStartMs] = useState<number>(() => Date.now());

  // Clean up legacy localStorage keys once
  useEffect(() => {
    try {
      localStorage.removeItem('vrent_rooms_v2');
      localStorage.removeItem('vrent_requests_v3');
      localStorage.removeItem('vrent_payments_v3');
      localStorage.removeItem('vrent_announcements_v3');
    } catch {
      // Ignore storage cleanup errors
    }
  }, []);

  // Persist rooms, booking requests, payments, and announcements to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vrent_rooms_v4', JSON.stringify(rooms));
    } catch (e) {
      console.warn('Could not save rooms to localStorage', e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem('vrent_requests_v4', JSON.stringify(requests));
    } catch (e) {
      console.warn('Could not save requests to localStorage', e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem('vrent_payments_v4', JSON.stringify(payments));
    } catch (e) {
      console.warn('Could not save payments to localStorage', e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem('vrent_announcements_v4', JSON.stringify(announcements));
    } catch (e) {
      console.warn('Could not save announcements to localStorage', e);
    }
  }, [announcements]);

  // Sync rooms, requests, payments, and announcements live across tabs
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      try {
        if (e.key === 'vrent_rooms_v4' && e.newValue) {
          setRooms(JSON.parse(e.newValue));
        } else if (e.key === 'vrent_requests_v4' && e.newValue) {
          setRequests(JSON.parse(e.newValue));
        } else if (e.key === 'vrent_payments_v4' && e.newValue) {
          setPayments(JSON.parse(e.newValue));
        } else if (e.key === 'vrent_announcements_v4' && e.newValue) {
          setAnnouncements(JSON.parse(e.newValue));
        }
      } catch {
        // Ignore malformed cross-tab payloads
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Saved / Bookmarked Rooms (empty on each session until renter saves rooms)
  const [savedRoomIds, setSavedRoomIds] = useState<string[]>([]);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [withinDistance, setWithinDistance] = useState<number | 'any'>('any');
  const [maxRent, setMaxRent] = useState<number | 'any'>('any');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedUtilities, setSelectedUtilities] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [isLocating, setIsLocating] = useState(false);

  // Active Modals & Selection
  const [active360Room, setActive360Room] = useState<Room | null>(null);
  const [activeDirectionsRoom, setActiveDirectionsRoom] = useState<Room | null>(null);
  const [activeBookingRoom, setActiveBookingRoom] = useState<Room | null>(null);
  const [activeCalendarRoom, setActiveCalendarRoom] = useState<Room | null>(null);
  const [activeChatRoom, setActiveChatRoom] = useState<Room | null>(null);
  const [activeDirectoryRoom, setActiveDirectoryRoom] = useState<Room | null>(null);
  const [activePaymentRoom, setActivePaymentRoom] = useState<Room | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showRenterBookingsModal, setShowRenterBookingsModal] = useState(false);
  const [prefilledUnitNumber, setPrefilledUnitNumber] = useState<string | undefined>(undefined);
  const [pendingUnitBooking, setPendingUnitBooking] = useState<{
    room: Room;
    unitNumber: string;
  } | null>(null);
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

  // Open Auth Portal (or jump straight to owner dashboard if already logged in as owner)
  const handleOpenAuth = (mode: AuthMode) => {
    if (mode === 'owner' && currentUser?.role === 'owner') {
      setCurrentView('owner-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setAuthMode(mode);
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login Success (with optional owner-uploaded room video/panorama media & permit verification)
  const handleLoginSuccess = (
    user: UserProfile,
    uploadedMedia?: { roomId: string; media: RoomMedia },
    ownerVerification?: { idType: string; docUrl: string }
  ) => {
    setCurrentUser(user);
    if (uploadedMedia || ownerVerification) {
      const loginEmail = user.email.trim().toLowerCase();
      setRooms((prev) =>
        prev.map((r) => {
          const isOwnersRoom = (r.ownerEmail || '').trim().toLowerCase() === loginEmail;
          return {
            ...r,
            ...(uploadedMedia && r.id === uploadedMedia.roomId
              ? { roomMedia: uploadedMedia.media }
              : {}),
            ...(ownerVerification && isOwnersRoom
              ? {
                  ownerIdType: ownerVerification.idType,
                  ownerVerificationDocUrl: ownerVerification.docUrl,
                  ownerVerified: true,
                }
              : {}),
          };
        })
      );
    }
    if (user.role === 'owner') {
      setPendingUnitBooking(null);
      setCurrentView('owner-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTenantSessionStartMs(Date.now());
      setSavedRoomIds([]);
      handleResetFilters();
      // Automatically show rental houses near the student's selected Oroquieta City school
      setSelectedSchool(user.school || 'all');
      setCurrentView('search');
      if (pendingUnitBooking) {
        const queued = pendingUnitBooking;
        setPendingUnitBooking(null);
        setPrefilledUnitNumber(queued.unitNumber);
        setActiveBookingRoom(queued.room);
      } else {
        setTimeout(() => {
          const el = document.getElementById('listings-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 60);
      }
    }
  };

  // Handle Log out -> always return user to Log In portal
  const handleLogout = () => {
    const prevRole = currentUser?.role || 'renter';
    setCurrentUser(null);
    setSavedRoomIds([]);
    setSelectedSchool('all');
    setTenantSessionStartMs(Date.now());
    setAuthMode(prevRole);
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Requests & payments scoped to the current tenant login session (empty on each new tenant login)
  const tenantVisibleRequests = useMemo(() => {
    return requests.filter((req) => {
      const tsPart = Number(req.id.replace('req-', ''));
      const inCurrentSession = !Number.isNaN(tsPart) && tsPart >= tenantSessionStartMs;
      if (!inCurrentSession) return false;
      if (currentUser?.role === 'renter') {
        return req.renterEmail.toLowerCase() === currentUser.email.toLowerCase();
      }
      return true;
    });
  }, [requests, tenantSessionStartMs, currentUser]);

  const tenantVisiblePayments = useMemo(() => {
    return payments.filter((pay) => {
      const tsPart = Number(pay.id.replace('pay-', ''));
      return !Number.isNaN(tsPart) && tsPart >= tenantSessionStartMs;
    });
  }, [payments, tenantSessionStartMs]);

  // Scope Owner Dashboard data strictly to the currently logged-in owner
  // so every newly registered owner starts with a completely empty dashboard.
  const currentOwnerEmail =
    currentUser?.role === 'owner' ? currentUser.email.trim().toLowerCase() : '';

  const ownerRooms = useMemo(() => {
    if (!currentOwnerEmail) return [];
    return rooms.filter(
      (r) => (r.ownerEmail || '').trim().toLowerCase() === currentOwnerEmail
    );
  }, [rooms, currentOwnerEmail]);

  const ownerRequests = useMemo(() => {
    if (!currentOwnerEmail) return [];
    const ownerRoomIds = new Set(ownerRooms.map((r) => r.id));
    return requests.filter(
      (req) =>
        ownerRoomIds.has(req.roomId) ||
        (req.ownerEmail || '').trim().toLowerCase() === currentOwnerEmail
    );
  }, [requests, ownerRooms, currentOwnerEmail]);

  const ownerPayments = useMemo(() => {
    if (!currentOwnerEmail) return [];
    const ownerRoomIds = new Set(ownerRooms.map((r) => r.id));
    return payments.filter(
      (pay) =>
        (pay.roomId && ownerRoomIds.has(pay.roomId)) ||
        (pay.ownerEmail || '').trim().toLowerCase() === currentOwnerEmail
    );
  }, [payments, ownerRooms, currentOwnerEmail]);

  const ownerAnnouncements = useMemo(() => {
    if (!currentOwnerEmail) return [];
    return announcements.filter(
      (ann) => (ann.ownerEmail || '').trim().toLowerCase() === currentOwnerEmail
    );
  }, [announcements, currentOwnerEmail]);

  // Filtered rooms (strictly Oroquieta City only + school/filter matching)
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Strictly Oroquieta City only
      if (!room.city.toLowerCase().includes('oroquieta')) {
        return false;
      }

      // Near School filter
      if (selectedSchool !== 'all') {
        const schoolObj = OROQUIETA_CITY_SCHOOLS.find((s) => s.name === selectedSchool);
        if (room.nearSchool) {
          const matchesExplicit =
            room.nearSchool.toLowerCase() === selectedSchool.toLowerCase() ||
            (schoolObj
              ? room.nearSchool.toLowerCase().includes(schoolObj.shortName.toLowerCase())
              : false);
          if (!matchesExplicit) return false;
        } else if (schoolObj) {
          const hay = `${room.landmark} ${room.location} ${room.barangay}`.toLowerCase();
          const matchesArea =
            hay.includes(schoolObj.shortName.toLowerCase()) ||
            hay.includes(schoolObj.name.toLowerCase()) ||
            hay.includes(schoolObj.barangay.toLowerCase());
          if (!matchesArea) return false;
        } else {
          return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          room.title.toLowerCase().includes(q) ||
          room.location.toLowerCase().includes(q) ||
          room.city.toLowerCase().includes(q) ||
          room.landmark.toLowerCase().includes(q) ||
          (room.nearSchool || '').toLowerCase().includes(q) ||
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

      // Gender Policy filter
      if (selectedGender !== 'all' && (room.genderPolicy || 'Mixed') !== selectedGender) {
        return false;
      }

      // Utilities Included filter
      if (
        selectedUtilities !== 'all' &&
        (room.utilitiesIncluded || 'Water Included, Electric Submetered') !== selectedUtilities
      ) {
        return false;
      }

      // Ribbon Tag filter (supports both tags and gender/water badges)
      if (activeTag) {
        const matchesTag = room.tags.includes(activeTag);
        const matchesGender = room.genderPolicy === activeTag;
        const matchesWater =
          activeTag === 'Water Included' &&
          room.utilitiesIncluded !== undefined &&
          room.utilitiesIncluded !== 'Submetered';
        if (!matchesTag && !matchesGender && !matchesWater) {
          return false;
        }
      }

      return true;
    });
  }, [
    rooms,
    selectedSchool,
    searchQuery,
    activeCity,
    withinDistance,
    maxRent,
    selectedType,
    selectedGender,
    selectedUtilities,
    activeTag,
  ]);

  // Saved rooms list
  const savedRooms = useMemo(() => {
    return rooms.filter((r) => savedRoomIds.includes(r.id));
  }, [rooms, savedRoomIds]);

  // Add room handler (for owners)
  const handleAddRoom = (newRoom: Room) => {
    setRooms((prev) => [newRoom, ...prev]);
  };

  // Update room handler (for owners editing existing rooms)
  const handleUpdateRoom = (updatedRoom: Room) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
    );
  };

  // Delete room handler (for owners removing rooms)
  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  // Update Request status + Atomic Slot & Sub-Unit Sync on Approval
  const handleUpdateRequestStatus = (
    requestId: string,
    newStatus: 'approved' | 'declined'
  ) => {
    const targetReq = requests.find((r) => r.id === requestId);
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );

    if (newStatus === 'approved' && targetReq && targetReq.status !== 'approved') {
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id !== targetReq.roomId) return room;

          const nextSlots = Math.max(0, room.slotsAvailable - 1);
          let assignedOne = false;
          const nextSubUnits = room.subUnits?.map((unit) => {
            if (assignedOne) return unit;
            const exactMatch =
              targetReq.unitNumber &&
              unit.unitNumber.toLowerCase() === targetReq.unitNumber.toLowerCase();
            const fallbackAvailable = !targetReq.unitNumber && unit.status === 'available';
            if (exactMatch || fallbackAvailable) {
              assignedOne = true;
              return {
                ...unit,
                status: 'occupied' as const,
                currentTenant: targetReq.renterName,
              };
            }
            return unit;
          });

          return {
            ...room,
            slotsAvailable: nextSlots,
            subUnits: nextSubUnits,
            occupiedPeriods: [
              ...room.occupiedPeriods,
              {
                startDate: targetReq.moveInDate,
                endDate: targetReq.moveOutDate || targetReq.moveInDate,
                label: `Approved: ${targetReq.unitNumber || 'Bedspace'} (${targetReq.renterName})`,
                renterName: targetReq.renterName,
              },
            ],
          };
        })
      );
    }
  };

  // Submit & Verify Payment Receipts
  const handleSubmitPayment = (paymentData: Omit<PaymentRecord, 'id' | 'paidDate'>) => {
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      paidDate: new Date().toISOString().split('T')[0],
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const handleVerifyPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: 'confirmed' } : p))
    );
  };

  // Broadcast Announcement handler
  const handleAddAnnouncement = (ann: Omit<OwnerAnnouncement, 'id' | 'date'>) => {
    const newAnn: OwnerAnnouncement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
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
    setSelectedGender('all');
    setSelectedUtilities('all');
    setSelectedSchool('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e1615] font-sans">
      {/* If on introduction view, show full introductory experience */}
      {currentView === 'intro' ? (
        <IntroductionPage
          onEnterApp={() => {
            setCurrentView('search');
            setTimeout(() => {
              const el = document.getElementById('listings-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }, 60);
          }}
          onOpenOwnerPortal={() => handleOpenAuth('owner')}
          onOpenRenterPortal={() => handleOpenAuth('renter')}
          onExploreCity={(city) => {
            setActiveCity(city);
            setSearchQuery(city);
            setCurrentView('search');
            setTimeout(() => {
              const el = document.getElementById('listings-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 60);
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
            myBookingsCount={tenantVisibleRequests.length}
            onOpenMyBookings={() => setShowRenterBookingsModal(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
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

            {/* All Available Rooms Section */}
            <RoomList
              rooms={filteredRooms}
              currentUser={currentUser}
              withinDistance={withinDistance}
              onChangeDistance={setWithinDistance}
              maxRent={maxRent}
              onChangeMaxRent={setMaxRent}
              selectedType={selectedType}
              onChangeType={setSelectedType}
              selectedGender={selectedGender}
              onChangeGender={setSelectedGender}
              selectedUtilities={selectedUtilities}
              onChangeUtilities={setSelectedUtilities}
              selectedSchool={selectedSchool}
              onChangeSchool={setSelectedSchool}
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
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentView === 'owner-dashboard' && (
          <OwnerDashboard
            rooms={ownerRooms}
            requests={ownerRequests}
            payments={ownerPayments}
            announcements={ownerAnnouncements}
            onAddRoom={handleAddRoom}
            onUpdateRoom={handleUpdateRoom}
            onDeleteRoom={handleDeleteRoom}
            onViewRoomMedia={(room) => setActive360Room(room)}
            onUpdateStatus={handleUpdateRequestStatus}
            onClearRequests={() => {
              const ownerRoomIds = new Set(ownerRooms.map((r) => r.id));
              setRequests((prev) =>
                prev.filter(
                  (req) =>
                    !ownerRoomIds.has(req.roomId) &&
                    (req.ownerEmail || '').trim().toLowerCase() !== currentOwnerEmail
                )
              );
            }}
            onVerifyPayment={handleVerifyPayment}
            onAddAnnouncement={handleAddAnnouncement}
            onLogout={handleLogout}
            ownerName={currentUser?.name || 'Host Landlord'}
            ownerEmail={currentUser?.email || ''}
            ownerIdType={currentUser?.ownerIdType}
            ownerDocUrl={currentUser?.ownerVerificationDocUrl}
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
          defaultAge={currentUser?.age}
          defaultGender={currentUser?.gender}
          defaultSchool={currentUser?.school}
          defaultStudentIdPhotoUrl={currentUser?.studentIdPhotoUrl}
          defaultStudentIdFileName={currentUser?.studentIdFileName}
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
            if (!currentUser) {
              setPendingUnitBooking({ room, unitNumber: unit.unitNumber });
              setAuthMode('renter');
              setCurrentView('auth');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }
            setPrefilledUnitNumber(unit.unitNumber);
            setActiveBookingRoom(room);
          }}
        />
      )}

      {/* Payment & Owner Announcement Modal */}
      {activePaymentRoom && (
        <PaymentAndAnnouncementModal
          room={activePaymentRoom}
          announcements={announcements.filter(
            (a) =>
              !a.ownerEmail ||
              !activePaymentRoom.ownerEmail ||
              a.ownerEmail.toLowerCase() === activePaymentRoom.ownerEmail.toLowerCase()
          )}
          onClose={() => setActivePaymentRoom(null)}
          onSubmitPayment={handleSubmitPayment}
        />
      )}

      {/* Renter My Bookings, Receipts & Notices Modal */}
      {showRenterBookingsModal && (
        <RenterBookingsModal
          requests={tenantVisibleRequests}
          payments={tenantVisiblePayments}
          announcements={announcements}
          currentUserEmail={currentUser?.role === 'renter' ? currentUser.email : undefined}
          onClose={() => setShowRenterBookingsModal(false)}
        />
      )}

      {/* Partner Visit & 360 Capture Request Modal */}
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
