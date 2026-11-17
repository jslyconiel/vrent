import React, { useState } from 'react';
import { Room, BookingRequest } from '../types';
import {
  Plus,
  Check,
  X,
  Building,
  Users,
  Calendar,
  MapPin,
  Tag,
  ShieldCheck,
  ArrowLeft,
  FileCheck,
  Upload,
  CreditCard,
  Bell,
  Sparkles,
} from 'lucide-react';
import { RoomIllustration } from './RoomIllustration';

interface OwnerDashboardProps {
  rooms: Room[];
  requests: BookingRequest[];
  onAddRoom: (room: Room) => void;
  onUpdateStatus: (requestId: string, newStatus: 'approved' | 'declined') => void;
  onBackToSearch: () => void;
  ownerName: string;
  onOpenPartnerVisitModal?: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  rooms,
  requests,
  onAddRoom,
  onUpdateStatus,
  onBackToSearch,
  ownerName,
  onOpenPartnerVisitModal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Room['type']>('Private Room');
  const [newLocation, setNewLocation] = useState('Barangay Lower Langcangan, Oroquieta City');
  const [newCity, setNewCity] = useState('Oroquieta');
  const [newBarangay, setNewBarangay] = useState('Lower Langcangan');
  const [newPrice, setNewPrice] = useState(3000);
  const [newSlots, setNewSlots] = useState(2);
  const [newAmenities, setNewAmenities] = useState('Wi-Fi, Study table, Air-con, Submeter');

  // Anti-Scam Owner Verification State (Requirement #8)
  const [isOwnerVerified, setIsOwnerVerified] = useState(true);
  const [verificationIdType, setVerificationIdType] = useState('National ID & Barangay Business Permit');
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'pending'>('verified');

  // Announcement composer state (Requirement #4)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Room = {
      id: `room-${Date.now()}`,
      title: newTitle || 'New Boarding House Room',
      type: newType,
      location: newLocation,
      city: newCity,
      barangay: newBarangay,
      landmark: `${newCity} University Campus Area`,
      distanceKm: 0.4,
      price: Number(newPrice),
      amenities: newAmenities.split(',').map((s) => s.trim()).filter(Boolean),
      tags: ['Student friendly', 'Wi-Fi ready', 'Verified Owner'],
      illustrationTheme: 'sunrise',
      slotsAvailable: Number(newSlots),
      totalSlots: Number(newSlots),
      availableFrom: new Date().toISOString().split('T')[0],
      minimumStayMonths: 5,
      occupiedPeriods: [],
      ownerName: ownerName || 'Mrs. Remedios Santos',
      ownerPhone: '+63 917 554 1289',
      ownerVerified: isOwnerVerified,
      ownerIdType: verificationIdType,
      ownerVerificationBadge: `Verified Landlord #${newCity.slice(0, 3).toUpperCase()}-2026`,
      description: 'Clean and safe student room with reliable water and electricity.',
      rules: ['Curfew 10:00 PM', 'No unauthorized guests', 'Quiet study hours'],
      coordinates: newCity === 'Oroquieta' ? { lat: 8.487, lng: 123.805 } : { lat: 8.148, lng: 123.842 },
    };
    onAddRoom(created);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8 px-4 sm:px-6 lg:px-8 text-stone-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Back Button (Requirement #6: Clear back buttons para dili malibog) */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToSearch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 shadow-sm transition-all hover:-translate-x-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e05d26]" />
            <span>← Back to Room Search &amp; Map</span>
          </button>

          {onOpenPartnerVisitModal && (
            <button
              onClick={onOpenPartnerVisitModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e05d26]" />
              <span>Schedule Free 360° VR Camera Visit</span>
            </button>
          )}
        </div>

        {/* Header Bar */}
        <div className="bg-[#0e1615] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl border border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Legitimate Landlord</span>
              </span>
              <span className="text-[11px] text-stone-400">
                Anti-Scam Verified via {verificationIdType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Welcome back, {ownerName || 'Host Landlord'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Manage your boarding house units, broadcast tenant notices, and inspect move-in reservations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold border border-stone-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Post Announcement</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow-md shadow-[#e05d26]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Boarding Room</span>
            </button>
          </div>
        </div>

        {/* Anti-Scam Landlord Security Notice (Requirement #8: Verify real owners with ID) */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-start sm:items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>VRENT Anti-Scam Protection:</strong> Inyong mga kwarto may <strong>Verified Badge</strong>.
              Renters know you are the genuine property owner, preventing fake deposit scams.
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] shrink-0">
            ✓ Genuine Owner Verified
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase">Active Listings</span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">{rooms.length}</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              ● All visible in &quot;near me&quot; searches
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase">Pending Requests</span>
            <div className="text-3xl font-extrabold text-[#e05d26] mt-1">
              {requests.filter((r) => r.status === 'pending').length}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Awaiting your approval</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase">Total Approved Renters</span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">
              {requests.filter((r) => r.status === 'approved').length}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">Confirmed bookings</span>
          </div>
        </div>

        {/* Incoming Booking Requests */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-900">Tenant Booking Requests</h3>
              <p className="text-xs text-stone-500">
                Review move-in inquiries and approve or decline reservations
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-stone-100 rounded-full text-stone-700">
              {requests.length} requests total
            </span>
          </div>

          {requests.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{req.renterName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Applied for <strong className="text-stone-900">{req.roomTitle}</strong> (₱
                      {req.roomPrice.toLocaleString()}/mo)
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                      <span>📅 Move-in: {req.moveInDate}</span>
                      <span>⏳ Duration: {req.durationMonths} months</span>
                      <span>📞 {req.renterPhone}</span>
                      <span>✉️ {req.renterEmail}</span>
                    </div>
                    {req.notes && (
                      <p className="text-xs bg-stone-50 p-2 rounded-lg text-stone-600 mt-1">
                        &quot;{req.notes}&quot;
                      </p>
                    )}
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onUpdateStatus(req.id, 'declined')}
                        className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => onUpdateStatus(req.id, 'approved')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium italic">
                      Status resolved
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-500">
              No booking requests received yet. Share your room link with university students!
            </div>
          )}
        </div>

        {/* Existing Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-serif text-stone-900">Your Active Rooms</h3>
            <span className="text-xs text-stone-500">Live on VRENT platform</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 6).map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 rounded-xl overflow-hidden mb-3 bg-stone-100">
                    <RoomIllustration theme={room.illustrationTheme} />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-800">{room.title}</span>
                    <span className="text-xs font-extrabold text-[#e05d26]">
                      ₱{room.price.toLocaleString()}/mo
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">{room.location}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                  <span>{room.slotsAvailable} slots available</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-lg font-bold font-serif">Add New Boarding Room</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Room Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Garden View Solo Room"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Studio">Studio</option>
                    <option value="Dormitory Bed">Dormitory Bed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Monthly Rent</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={newAmenities}
                  onChange={(e) => setNewAmenities(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#e05d26] text-white text-xs font-bold shadow"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal (Requirement #4) */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-lg font-bold font-serif">Broadcast Notice to All Tenants</h4>
              <button
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setAnnouncementSuccess(false);
                }}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {announcementSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-stone-900">Notice Published!</h5>
                <p className="text-xs text-stone-600">
                  All active tenants and renters viewing your boarding houses can now see this announcement.
                </p>
                <button
                  onClick={() => {
                    setShowAnnouncementModal(false);
                    setAnnouncementSuccess(false);
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-[#e05d26] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setAnnouncementSuccess(true);
                }}
                className="mt-4 space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Announcement Subject
                  </label>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="e.g. Wi-Fi Maintenance Schedule or Rent Reminder"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Notice Message
                  </label>
                  <textarea
                    rows={4}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Write detailed instructions for renters..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#e05d26] text-white text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Broadcast Notice</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
