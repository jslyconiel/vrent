import React, { useState } from 'react';
import {
  Room,
  BookingRequest,
  RoomMedia,
  PaymentRecord,
  OwnerAnnouncement,
  GenderPolicy,
  UtilitiesPolicy,
} from '../types';
import {
  Plus,
  Check,
  X,
  ShieldCheck,
  Bell,
  Sparkles,
  Pencil,
  Eye,
  Video,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Receipt,
  Clock,
  IdCard,
  LogOut,
  MapPin,
} from 'lucide-react';
import { RoomIllustration } from './RoomIllustration';
import { OROQUIETA_CITY_SCHOOLS } from '../data/oroquietaSchools';
import {
  processUploadedPanorama,
  processUploadedVideo,
  createRoomMediaObject,
} from '../utils/mediaUtils';

interface OwnerDashboardProps {
  rooms: Room[];
  requests: BookingRequest[];
  payments: PaymentRecord[];
  announcements: OwnerAnnouncement[];
  onAddRoom: (room: Room) => void;
  onUpdateRoom: (room: Room) => void;
  onDeleteRoom?: (roomId: string) => void;
  onViewRoomMedia: (room: Room) => void;
  onUpdateStatus: (requestId: string, newStatus: 'approved' | 'declined') => void;
  onClearRequests?: () => void;
  onVerifyPayment: (paymentId: string) => void;
  onAddAnnouncement: (announcement: Omit<OwnerAnnouncement, 'id' | 'date'>) => void;
  onLogout: () => void;
  ownerName: string;
  ownerEmail: string;
  ownerIdType?: string;
  ownerDocUrl?: string;
  onOpenPartnerVisitModal?: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  rooms,
  requests,
  payments,
  announcements,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onViewRoomMedia,
  onUpdateStatus,
  onClearRequests,
  onVerifyPayment,
  onAddAnnouncement,
  onLogout,
  ownerName,
  ownerEmail,
  ownerIdType,
  ownerDocUrl,
  onOpenPartnerVisitModal,
}) => {
  // Add Room Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Room['type']>('Private Room');
  const [newLocation, setNewLocation] = useState(OROQUIETA_CITY_SCHOOLS[0].defaultAddress);
  const [newBarangay, setNewBarangay] = useState(OROQUIETA_CITY_SCHOOLS[0].barangay);
  const [newNearSchool, setNewNearSchool] = useState(OROQUIETA_CITY_SCHOOLS[0].name);
  const [newLandmark, setNewLandmark] = useState(`Near ${OROQUIETA_CITY_SCHOOLS[0].shortName}`);
  const [newDistanceKm, setNewDistanceKm] = useState(0.3);
  const [newCoordinates, setNewCoordinates] = useState<{ lat: number; lng: number }>(
    OROQUIETA_CITY_SCHOOLS[0].coordinates
  );
  const [newPrice, setNewPrice] = useState(3000);
  const [newSlots, setNewSlots] = useState(2);
  const [newTotalSlots, setNewTotalSlots] = useState(4);
  const [newAmenities, setNewAmenities] = useState('Wi-Fi, Study table, Air-con, Submeter');
  const [newGenderPolicy, setNewGenderPolicy] = useState<GenderPolicy>('Mixed');
  const [newUtilitiesIncluded, setNewUtilitiesIncluded] = useState<UtilitiesPolicy>(
    'Water Included, Electric Submetered'
  );
  const [newWalkingMinutes, setNewWalkingMinutes] = useState(5);
  const [newDescription, setNewDescription] = useState(
    'Clean and safe student room in Oroquieta City with reliable water and electricity.'
  );
  const [newMedia, setNewMedia] = useState<RoomMedia | undefined>(undefined);
  const [addMediaUrlInput, setAddMediaUrlInput] = useState('');
  const [addMediaProcessing, setAddMediaProcessing] = useState(false);
  const [addMediaError, setAddMediaError] = useState<string | null>(null);

  // Edit Room Modal State
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<Room['type']>('Private Room');
  const [editPrice, setEditPrice] = useState(2500);
  const [editSlotsAvailable, setEditSlotsAvailable] = useState(2);
  const [editTotalSlots, setEditTotalSlots] = useState(6);
  const [editLocation, setEditLocation] = useState('');
  const [editBarangay, setEditBarangay] = useState('');
  const [editNearSchool, setEditNearSchool] = useState('');
  const [editLandmark, setEditLandmark] = useState('');
  const [editCoordinates, setEditCoordinates] = useState<{ lat: number; lng: number } | undefined>(
    undefined
  );
  const [editGenderPolicy, setEditGenderPolicy] = useState<GenderPolicy>('Mixed');
  const [editUtilitiesIncluded, setEditUtilitiesIncluded] = useState<UtilitiesPolicy>(
    'Water Included, Electric Submetered'
  );
  const [editWalkingMinutes, setEditWalkingMinutes] = useState(3);
  const [editAmenities, setEditAmenities] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRules, setEditRules] = useState('');
  const [editMedia, setEditMedia] = useState<RoomMedia | undefined>(undefined);
  const [editMediaType, setEditMediaType] = useState<'panorama' | 'video'>('panorama');
  const [editMediaCaption, setEditMediaCaption] = useState('');
  const [editMediaUrlInput, setEditMediaUrlInput] = useState('');
  const [editMediaProcessing, setEditMediaProcessing] = useState(false);
  const [editMediaError, setEditMediaError] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string } | null>(null);

  // Anti-Scam Owner Verification State
  const [isOwnerVerified] = useState(true);
  const uploadedVerificationRoom = rooms.find((r) => Boolean(r.ownerVerificationDocUrl));
  const resolvedOwnerDocUrl = ownerDocUrl || uploadedVerificationRoom?.ownerVerificationDocUrl;
  const verificationIdType =
    ownerIdType || uploadedVerificationRoom?.ownerIdType || 'Philippine Valid ID';

  // Announcement composer state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<'normal' | 'important'>(
    'important'
  );
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setEditTitle(room.title);
    setEditType(room.type);
    setEditPrice(room.price);
    setEditSlotsAvailable(room.slotsAvailable);
    setEditTotalSlots(room.totalSlots);
    setEditLocation(room.location);
    setEditBarangay(room.barangay || '');
    setEditNearSchool(room.nearSchool || OROQUIETA_CITY_SCHOOLS[0].name);
    setEditLandmark(room.landmark || '');
    setEditCoordinates(room.coordinates);
    setEditGenderPolicy(room.genderPolicy || 'Mixed');
    setEditUtilitiesIncluded(room.utilitiesIncluded || 'Water Included, Electric Submetered');
    setEditWalkingMinutes(room.walkingMinutes || 3);
    setEditAmenities(room.amenities.join(', '));
    setEditDescription(room.description);
    setEditRules(room.rules.join(', '));
    setEditMedia(room.roomMedia);
    setEditMediaType(room.roomMedia?.type || 'panorama');
    setEditMediaCaption(room.roomMedia?.caption || '');
    setEditMediaUrlInput('');
    setEditMediaError(null);
  };

  const handleEditMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditMediaError(null);
    setEditMediaProcessing(true);
    try {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      if (!isVideo && !isImage) {
        setEditMediaError('Please select a valid video (.mp4, .mov, .webm) or image (.jpg, .png).');
        return;
      }
      const nextType: 'video' | 'panorama' = isVideo ? 'video' : 'panorama';
      const url = isVideo
        ? await processUploadedVideo(file)
        : await processUploadedPanorama(file);
      setEditMediaType(nextType);
      setEditMedia(createRoomMediaObject(nextType, url, file.name, editMediaCaption));
    } catch (err: any) {
      setEditMediaError(err?.message || 'Unable to process media file.');
    } finally {
      setEditMediaProcessing(false);
    }
  };

  const handleApplyEditMediaUrl = () => {
    setEditMediaError(null);
    const trimmed = editMediaUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      setEditMediaError('Please enter a valid URL starting with https:// or http://');
      return;
    }
    setEditMedia(
      createRoomMediaObject(editMediaType, trimmed, 'External Media Link', editMediaCaption)
    );
    setEditMediaUrlInput('');
  };

  const handleSaveRoomEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    const total = Math.max(1, Number(editTotalSlots));
    const available = Math.min(total, Math.max(0, Number(editSlotsAvailable)));

    const finalMedia = editMedia
      ? {
          ...editMedia,
          caption: editMediaCaption.trim() || editMedia.caption,
        }
      : undefined;

    const updated: Room = {
      ...editingRoom,
      title: editTitle.trim() || editingRoom.title,
      type: editType,
      price: Math.max(500, Number(editPrice)),
      slotsAvailable: available,
      totalSlots: total,
      location: editLocation.trim() || editingRoom.location,
      city: 'Oroquieta',
      barangay: editBarangay.trim() || editingRoom.barangay,
      nearSchool: editNearSchool || editingRoom.nearSchool,
      landmark: editLandmark.trim() || editingRoom.landmark,
      coordinates: editCoordinates || editingRoom.coordinates,
      genderPolicy: editGenderPolicy,
      utilitiesIncluded: editUtilitiesIncluded,
      walkingMinutes: Math.max(1, Number(editWalkingMinutes)),
      amenities: editAmenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description: editDescription.trim() || editingRoom.description,
      rules: editRules
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      roomMedia: finalMedia,
    };

    onUpdateRoom(updated);
    setEditingRoom(null);
    setSaveFeedback(`Saved updates to "${updated.title}".`);
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  const handleAddMediaFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    preferredType: 'video' | 'panorama'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddMediaError(null);
    setAddMediaProcessing(true);
    try {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      if (!isVideo && !isImage) {
        setAddMediaError('Please select a valid video or panorama photo.');
        return;
      }
      const resolvedType = isVideo ? 'video' : preferredType === 'video' && isImage ? 'panorama' : 'panorama';
      const url = isVideo
        ? await processUploadedVideo(file)
        : await processUploadedPanorama(file);
      setNewMedia(createRoomMediaObject(resolvedType, url, file.name));
    } catch (err: any) {
      setAddMediaError(err?.message || 'Unable to process media file.');
    } finally {
      setAddMediaProcessing(false);
    }
  };

  const handleCreateRoom = (e: React.FormEvent, keepOpenForAnother = false) => {
    e.preventDefault();
    const total = Math.max(1, Number(newTotalSlots));
    const available = Math.min(total, Math.max(0, Number(newSlots)));
    const roomId = `room-${Date.now()}`;
    const isSharedType = newType === 'Shared Room' || newType === 'Dormitory Bed';
    const generatedSubUnits = Array.from({ length: total }, (_, idx) => {
      const unitNumber = isSharedType
        ? `Bedspace ${String.fromCharCode(65 + idx)}`
        : `Unit ${101 + idx}`;
      const isAvailable = idx < available;
      return {
        id: `${roomId}-unit-${idx + 1}`,
        unitNumber,
        unitType: newType,
        price: Number(newPrice),
        status: (isAvailable ? 'available' : 'occupied') as 'available' | 'occupied',
        panoramaTheme: 'sunrise' as const,
        features: newAmenities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 4),
      };
    });

    const created: Room = {
      id: roomId,
      title: newTitle.trim() || 'New Boarding House Room',
      type: newType,
      location: newLocation.trim() || `Brgy. ${newBarangay}, Oroquieta City`,
      city: 'Oroquieta',
      barangay: newBarangay.trim() || 'Mobod',
      nearSchool: newNearSchool,
      landmark: newLandmark.trim() || `Near ${newNearSchool}`,
      distanceKm: newDistanceKm,
      walkingMinutes: Math.max(1, Number(newWalkingMinutes)),
      genderPolicy: newGenderPolicy,
      utilitiesIncluded: newUtilitiesIncluded,
      price: Number(newPrice),
      amenities: newAmenities.split(',').map((s) => s.trim()).filter(Boolean),
      tags: [
        'Student friendly',
        'Wi-Fi ready',
        'Verified Owner',
        newGenderPolicy,
        ...(newUtilitiesIncluded !== 'Submetered' ? ['Water Included'] : []),
      ],
      illustrationTheme: 'sunrise',
      slotsAvailable: available,
      totalSlots: total,
      availableFrom: new Date().toISOString().split('T')[0],
      minimumStayMonths: 5,
      occupiedPeriods: [],
      subUnits: generatedSubUnits,
      roomMedia: newMedia,
      ownerName: ownerName || 'Host Landlord',
      ownerEmail: ownerEmail.trim().toLowerCase(),
      ownerPhone: '+63 917 554 1289',
      ownerVerified: isOwnerVerified,
      ownerIdType: verificationIdType,
      ownerVerificationDocUrl: resolvedOwnerDocUrl,
      ownerVerificationBadge: 'Verified Landlord #ORQ-2026',
      description: newDescription,
      rules: ['Curfew 10:00 PM', 'No unauthorized guests', 'Quiet study hours'],
      coordinates: newCoordinates,
    };
    onAddRoom(created);
    setNewTitle('');
    setNewMedia(undefined);
    setAddMediaUrlInput('');
    if (!keepOpenForAnother) {
      setShowAddModal(false);
    }
    setSaveFeedback(
      `Published "${created.title}" in Brgy. ${created.barangay}! Renters can now see this room immediately.`
    );
    setTimeout(() => setSaveFeedback(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8 px-4 sm:px-6 lg:px-8 text-stone-900">
      <div className="max-w-6xl mx-auto space-y-7">
        {/* Top Utility Row */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {onOpenPartnerVisitModal && (
            <button
              onClick={onOpenPartnerVisitModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-bold border border-amber-300 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#e05d26]" />
              <span>Schedule Free 360° VR Camera Visit</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 text-sm font-bold border border-stone-300 shadow-sm transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#e05d26]" />
            <span>Log out</span>
          </button>
        </div>

        {/* Save confirmation banner */}
        {saveFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>{saveFeedback}</span>
            </div>
            <button onClick={() => setSaveFeedback(null)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-[#0e1615] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl border border-stone-800">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Legitimate Landlord</span>
              </span>
              <span className="text-xs sm:text-sm text-stone-400">
                Anti-Scam Verified via {verificationIdType}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">
              Welcome back, {ownerName || 'Host Landlord'}
            </h1>
            <p className="text-sm sm:text-base text-stone-300 mt-1.5">
              Edit your rooms, view your uploaded room videos &amp; 360° panoramas, and approve student bookings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-sm font-bold border border-stone-700 flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Post Announcement</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow-md shadow-[#e05d26]/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Boarding Room</span>
            </button>
          </div>
        </div>

        {/* Anti-Scam Landlord Security Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-emerald-900">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>VRENT Anti-Scam Protection:</strong> Your Oroquieta City listings display a{' '}
              <strong>Verified Badge</strong> so students trust that they are booking directly with the real owner.
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {resolvedOwnerDocUrl && (
              <button
                type="button"
                onClick={() =>
                  setPreviewDoc({
                    title: verificationIdType,
                    url: resolvedOwnerDocUrl,
                  })
                }
                className="px-3 py-1.5 rounded-full bg-white text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
              >
                View Uploaded Valid ID
              </button>
            )}
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs sm:text-sm">
              ✓ Genuine Owner Verified
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-stone-500 uppercase">Active Listings</span>
            <div className="text-4xl font-extrabold text-stone-900 mt-1">{rooms.length}</div>
            <span className="text-sm text-emerald-600 font-semibold mt-1.5 block">
              ● Visible in Oroquieta City search
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-stone-500 uppercase">Pending Requests</span>
            <div className="text-4xl font-extrabold text-[#e05d26] mt-1">
              {requests.filter((r) => r.status === 'pending').length}
            </div>
            <span className="text-sm text-stone-500 mt-1.5 block">Awaiting your approval</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-stone-500 uppercase">Total Approved Renters</span>
            <div className="text-4xl font-extrabold text-stone-900 mt-1">
              {requests.filter((r) => r.status === 'approved').length}
            </div>
            <span className="text-sm text-stone-500 mt-1.5 block">Confirmed bookings</span>
          </div>
        </div>

        {/* Existing Listings Grid — Placed prominently so owners immediately see where to View & Edit */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-900">Your Active Rooms</h3>
              <p className="text-sm text-stone-600">
                Click <strong>View Room Tour</strong> to inspect your uploaded video/panorama, or <strong>Edit Room</strong> to update details.
              </p>
            </div>
            <span className="text-sm font-medium text-stone-500">Live on VRENT platform</span>
          </div>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-stone-100 border border-stone-200/70">
                      {room.roomMedia?.type === 'panorama' ? (
                        <img
                          src={room.roomMedia.url}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <RoomIllustration theme={room.illustrationTheme} />
                      )}

                      {/* Media Status Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        {room.roomMedia ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 text-emerald-300 text-xs font-bold shadow">
                            {room.roomMedia.type === 'video' ? (
                              <Video className="w-3.5 h-3.5 text-[#e05d26]" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-[#e05d26]" />
                            )}
                            <span>
                              {room.roomMedia.type === 'video' ? 'Video Uploaded' : '360° Panorama'}
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-stone-700 text-xs font-semibold shadow">
                            <span>360° Model</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-lg font-bold text-stone-900 leading-snug">{room.title}</span>
                      <span className="text-base font-extrabold text-[#e05d26] shrink-0">
                        ₱{room.price.toLocaleString()}/mo
                      </span>
                    </div>

                    <p className="text-sm text-stone-600">
                      {room.location}
                      {room.walkingMinutes ? ` · ${room.walkingMinutes} mins walk` : ''}
                    </p>
                    {room.nearSchool && (
                      <p className="text-xs font-bold text-[#c94f1c] mt-1">
                        Near {room.nearSchool}
                      </p>
                    )}

                    {(room.genderPolicy || room.utilitiesIncluded) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {room.genderPolicy && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold">
                            {room.genderPolicy}
                          </span>
                        )}
                        {room.utilitiesIncluded && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                            {room.utilitiesIncluded}
                          </span>
                        )}
                      </div>
                    )}

                    {room.roomMedia?.caption && (
                      <p className="mt-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/70">
                        &quot;{room.roomMedia.caption}&quot;
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-sm text-stone-700">
                      <span className="font-medium">
                        <strong className="text-emerald-700">{room.slotsAvailable}</strong> of {room.totalSlots} slots free
                      </span>
                      <span className="font-bold text-emerald-600">Active</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewRoomMedia(room)}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-[#0e1615] hover:bg-stone-800 text-white text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#e05d26]" />
                        <span>
                          {room.roomMedia?.type === 'video'
                            ? 'View Video'
                            : room.roomMedia?.type === 'panorama'
                            ? 'View 360°'
                            : 'View Tour'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(room)}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#e05d26] border border-orange-200 text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit Room</span>
                      </button>

                      {onDeleteRoom && (
                        <button
                          type="button"
                          onClick={() => onDeleteRoom(room.id)}
                          title="Remove room listing"
                          className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-stone-300 p-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#e05d26]">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold font-serif text-stone-900">
                  No rooms listed yet
                </h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Start listing your available boarding house rooms with their exact Oroquieta City barangay, landmark, and price. Renters will see them immediately on their dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow-md shadow-[#e05d26]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Boarding Room</span>
              </button>
            </div>
          )}
        </div>

        {/* Incoming Booking Requests */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-900">Tenant Booking Requests</h3>
              <p className="text-sm text-stone-500">
                Review move-in inquiries and approve or decline reservations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold px-3.5 py-1.5 bg-stone-100 rounded-full text-stone-700">
                {requests.length} requests total
              </span>
              {onClearRequests && requests.length > 0 && (
                <button
                  type="button"
                  onClick={onClearRequests}
                  className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {requests.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-base text-stone-900">{req.renterName}</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
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
                    <p className="text-sm text-stone-700">
                      Applied for <strong className="text-stone-900">{req.roomTitle}</strong> (₱
                      {req.roomPrice.toLocaleString()}/mo)
                      {req.unitNumber && (
                        <span className="ml-2 inline-block px-2.5 py-0.5 rounded-md bg-orange-50 text-[#e05d26] border border-orange-200 text-xs font-bold">
                          {req.unitNumber}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-stone-500">
                      <span>Move-in: {req.moveInDate}</span>
                      <span>Duration: {req.durationMonths} months</span>
                      <span>Phone: {req.renterPhone}</span>
                      <span>Email: {req.renterEmail}</span>
                      {req.renterAge && <span>Age: {req.renterAge}</span>}
                      {req.renterGender && <span>Gender: {req.renterGender}</span>}
                      {req.renterSchool && (
                        <span className="font-semibold text-stone-700">School: {req.renterSchool}</span>
                      )}
                    </div>
                    {req.studentIdPhotoUrl && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              title: `Student ID / COR — ${req.renterName}`,
                              url: req.studentIdPhotoUrl!,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold cursor-pointer"
                        >
                          <IdCard className="w-4 h-4" />
                          <span>Inspect Student ID / COR ({req.studentIdFileName || 'Photo'})</span>
                        </button>
                      </div>
                    )}
                    {req.notes && (
                      <p className="text-sm bg-stone-50 p-3 rounded-xl text-stone-700 mt-1.5 border border-stone-200/70">
                        &quot;{req.notes}&quot;
                      </p>
                    )}
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => onUpdateStatus(req.id, 'declined')}
                        className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-4 h-4 text-rose-600" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => onUpdateStatus(req.id, 'approved')}
                        title="Approving automatically reserves the unit and reduces free slots by 1"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve &amp; Reserve Slot</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-stone-400 font-medium italic">
                      Status resolved
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-stone-500">
              No booking requests received yet. Share your room link with university students!
            </div>
          )}
        </div>

        {/* Rent & Deposit Payment Receipts Verification Ledger */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-[#e05d26]" />
                <span>Rent &amp; Deposit Payment Receipts</span>
              </h3>
              <p className="text-sm text-stone-500">
                Verify student GCash / bank transfer screenshots and mark payments as confirmed
              </p>
            </div>
            <span className="text-sm font-bold px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              {payments.filter((p) => p.status === 'pending').length} pending verification
            </span>
          </div>

          {payments.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {payments.map((pay) => (
                <div
                  key={pay.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-stone-900">{pay.renterName}</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          pay.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pay.status === 'confirmed' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {pay.status === 'confirmed' ? 'CONFIRMED' : 'PENDING VERIFICATION'}
                        </span>
                      </span>
                    </div>
                    <p className="text-sm text-stone-700">
                      <strong>₱{pay.amount.toLocaleString()}</strong> · {pay.roomTitle}
                      {pay.unitNumber ? ` (${pay.unitNumber})` : ''} · {pay.monthCovered}
                    </p>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Method: <strong>{pay.method}</strong> · Ref:{' '}
                      <span className="font-mono">{pay.referenceNo}</span> · Paid {pay.paidDate}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {pay.receiptImageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc({
                            title: `Payment Receipt — ${pay.renterName} (Ref: ${pay.referenceNo})`,
                            url: pay.receiptImageUrl!,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-bold border border-stone-200 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4 text-[#e05d26]" />
                        <span>View Receipt</span>
                      </button>
                    )}
                    {pay.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => onVerifyPayment(pay.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verify &amp; Confirm</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-stone-500">
              No payment receipts submitted yet.
            </div>
          )}
        </div>

        {/* Live Owner Announcements Feed */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#e05d26]" />
                <span>Published Tenant Announcements</span>
              </h3>
              <p className="text-sm text-stone-500">
                Visible immediately to renters inside My Bookings &amp; Notice Board
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 py-2 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold cursor-pointer"
            >
              + New Notice
            </button>
          </div>

          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-2xl border ${
                    ann.priority === 'important'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-base text-stone-900">{ann.title}</span>
                    <span className="text-xs font-semibold text-stone-500">{ann.date}</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">{ann.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-stone-500">
              No announcements published yet. Click &quot;+ New Notice&quot; to broadcast an update to renters.
            </div>
          )}
        </div>
      </div>

      {/* EDIT ROOM MODAL */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h4 className="text-2xl font-bold font-serif text-stone-900">Edit Room Details</h4>
                <p className="text-sm text-stone-500">
                  Update pricing, available slots, description, or upload a new video / 360° panorama.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoomEdit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Room Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Room Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as Room['type'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base bg-white text-stone-900"
                  >
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Studio">Studio</option>
                    <option value="Dormitory Bed">Dormitory Bed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Monthly Rent (₱)</label>
                  <input
                    type="number"
                    min={500}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Available Slots</label>
                  <input
                    type="number"
                    min={0}
                    value={editSlotsAvailable}
                    onChange={(e) => setEditSlotsAvailable(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Total Slots</label>
                  <input
                    type="number"
                    min={1}
                    value={editTotalSlots}
                    onChange={(e) => setEditTotalSlots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-stone-800">
                  <MapPin className="w-4 h-4 text-[#e05d26]" />
                  <span>Near Specific School (Oroquieta City Only)</span>
                </label>
                <select
                  value={editNearSchool}
                  onChange={(e) => {
                    const school = OROQUIETA_CITY_SCHOOLS.find((s) => s.name === e.target.value);
                    setEditNearSchool(e.target.value);
                    if (school) {
                      setEditBarangay(school.barangay);
                      setEditLandmark(`Near ${school.shortName}`);
                      setEditLocation(school.defaultAddress);
                      setEditCoordinates(school.coordinates);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-orange-300 bg-white text-sm font-semibold text-stone-800 cursor-pointer"
                >
                  {OROQUIETA_CITY_SCHOOLS.map((school) => (
                    <option key={school.id} value={school.name}>
                      {school.name} (Brgy. {school.barangay})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Barangay (Oroquieta City)</label>
                  <input
                    type="text"
                    value={editBarangay}
                    onChange={(e) => setEditBarangay(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Asa Dapita / Landmark</label>
                  <input
                    type="text"
                    value={editLandmark}
                    onChange={(e) => setEditLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Full Address</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Gender Policy</label>
                  <select
                    value={editGenderPolicy}
                    onChange={(e) => setEditGenderPolicy(e.target.value as GenderPolicy)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base bg-white text-stone-900"
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Female Only">Female Only</option>
                    <option value="Male Only">Male Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">Utilities Policy</label>
                  <select
                    value={editUtilitiesIncluded}
                    onChange={(e) => setEditUtilitiesIncluded(e.target.value as UtilitiesPolicy)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base bg-white text-stone-900"
                  >
                    <option value="Water & Electric Included">Water &amp; Electric Included</option>
                    <option value="Water Included, Electric Submetered">
                      Water Included, Submetered
                    </option>
                    <option value="Submetered">Submetered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    Walk to Campus (mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={editWalkingMinutes}
                    onChange={(e) => setEditWalkingMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={editAmenities}
                  onChange={(e) => setEditAmenities(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Room Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">
                  House Rules (comma separated)
                </label>
                <input
                  type="text"
                  value={editRules}
                  onChange={(e) => setEditRules(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-900"
                />
              </div>

              {/* Video or 360 Panorama Section */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-stone-900">
                    Room Video or 360° Panorama
                  </span>
                  {editMedia && (
                    <button
                      type="button"
                      onClick={() => setEditMedia(undefined)}
                      className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Media</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditMediaType('panorama')}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                      editMediaType === 'panorama'
                        ? 'bg-[#e05d26] text-white border-[#e05d26]'
                        : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>360° Panorama</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMediaType('video')}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                      editMediaType === 'video'
                        ? 'bg-[#e05d26] text-white border-[#e05d26]'
                        : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Walkthrough Video</span>
                  </button>
                </div>

                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#e05d26] bg-white cursor-pointer text-sm font-bold text-stone-800">
                  <Upload className="w-4 h-4 text-[#e05d26]" />
                  <span>
                    {editMediaProcessing
                      ? 'Processing file...'
                      : `Upload New ${editMediaType === 'video' ? 'Video' : 'Panorama Photo'}`}
                  </span>
                  <input
                    type="file"
                    accept={editMediaType === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleEditMediaFile}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={editMediaUrlInput}
                      onChange={(e) => setEditMediaUrlInput(e.target.value)}
                      placeholder="Or paste direct video / panorama URL"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyEditMediaUrl}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-sm font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {editMedia && (
                  <div className="rounded-xl overflow-hidden bg-stone-900 p-2">
                    {editMedia.type === 'video' ? (
                      <video
                        src={editMedia.url}
                        controls
                        playsInline
                        className="w-full max-h-48 rounded-lg bg-black object-contain"
                      />
                    ) : (
                      <img
                        src={editMedia.url}
                        alt="Room panorama"
                        className="w-full max-h-48 rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}

                <input
                  type="text"
                  value={editMediaCaption}
                  onChange={(e) => setEditMediaCaption(e.target.value)}
                  placeholder="Optional caption (e.g. Freshly painted Room 102 tour)"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-sm text-stone-900"
                />

                {editMediaError && (
                  <p className="text-sm text-rose-600 font-semibold">{editMediaError}</p>
                )}
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editMediaProcessing}
                  className="px-6 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow cursor-pointer"
                >
                  Save Room Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-xl font-bold font-serif">Add New Boarding Room (Oroquieta City)</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Room Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Garden View Solo Room"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Room['type'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base bg-white"
                  >
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Studio">Studio</option>
                    <option value="Dormitory Bed">Dormitory Bed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Monthly Rent (₱)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Available Slots</label>
                  <input
                    type="number"
                    min={0}
                    value={newSlots}
                    onChange={(e) => setNewSlots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Total Slots</label>
                  <input
                    type="number"
                    min={1}
                    value={newTotalSlots}
                    onChange={(e) => setNewTotalSlots(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                    required
                  />
                </div>
              </div>

              {/* Near Specific School in Oroquieta City ("Asa dapita") */}
              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2.5">
                <label className="flex items-center gap-1.5 text-sm font-bold text-stone-800">
                  <MapPin className="w-4 h-4 text-[#e05d26]" />
                  <span>Near Specific School in Oroquieta City (Asa dapita)</span>
                </label>
                <select
                  value={newNearSchool}
                  onChange={(e) => {
                    const school = OROQUIETA_CITY_SCHOOLS.find((s) => s.name === e.target.value);
                    setNewNearSchool(e.target.value);
                    if (school) {
                      setNewBarangay(school.barangay);
                      setNewLandmark(`Near ${school.shortName}`);
                      setNewLocation(school.defaultAddress);
                      setNewDistanceKm(0.3);
                      setNewCoordinates(school.coordinates);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-orange-300 bg-white text-sm font-semibold text-stone-800 cursor-pointer"
                  required
                >
                  {OROQUIETA_CITY_SCHOOLS.map((school) => (
                    <option key={school.id} value={school.name}>
                      {school.name} (Brgy. {school.barangay})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-stone-600 block">
                  Includes Oroquieta City schools only — auto-fills Barangay &amp; address below.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Barangay</label>
                  <input
                    type="text"
                    value={newBarangay}
                    onChange={(e) => setNewBarangay(e.target.value)}
                    placeholder="e.g. Mobod, Canubay, Poblacion"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Asa Dapita / Landmark
                  </label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="e.g. Near USTP Gate 1 or SJC"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Exact Street / Purok / House Location (Oroquieta City)
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Purok 2, Brgy. Mobod, near highway"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Gender Policy</label>
                  <select
                    value={newGenderPolicy}
                    onChange={(e) => setNewGenderPolicy(e.target.value as GenderPolicy)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Female Only">Female Only</option>
                    <option value="Male Only">Male Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Utilities</label>
                  <select
                    value={newUtilitiesIncluded}
                    onChange={(e) => setNewUtilitiesIncluded(e.target.value as UtilitiesPolicy)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="Water & Electric Included">Water &amp; Electric</option>
                    <option value="Water Included, Electric Submetered">
                      Water Free, Submetered
                    </option>
                    <option value="Submetered">Submetered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Walk (mins)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={newWalkingMinutes}
                    onChange={(e) => setNewWalkingMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={newAmenities}
                  onChange={(e) => setNewAmenities(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base"
                />
              </div>

              {/* Optional Video / Panorama Upload */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <span className="block text-sm font-bold text-stone-800">
                  Attach Video or 360° Panorama (Optional)
                </span>
                <div className="flex flex-wrap gap-2">
                  <label className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-300 hover:border-[#e05d26] text-xs sm:text-sm font-bold text-stone-800 flex items-center justify-center gap-1.5 cursor-pointer">
                    <ImageIcon className="w-4 h-4 text-[#e05d26]" />
                    <span>Upload Panorama</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAddMediaFile(e, 'panorama')}
                      className="hidden"
                    />
                  </label>
                  <label className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-300 hover:border-[#e05d26] text-xs sm:text-sm font-bold text-stone-800 flex items-center justify-center gap-1.5 cursor-pointer">
                    <Video className="w-4 h-4 text-[#e05d26]" />
                    <span>Upload Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleAddMediaFile(e, 'video')}
                      className="hidden"
                    />
                  </label>
                </div>
                {addMediaProcessing && (
                  <p className="text-xs text-stone-500">Processing media...</p>
                )}
                {newMedia && (
                  <p className="text-xs font-bold text-emerald-700">
                    ✓ Attached {newMedia.type === 'video' ? 'Walkthrough Video' : '360° Panorama'}:{' '}
                    {newMedia.fileName || 'Ready'}
                  </p>
                )}
                {addMediaError && <p className="text-xs text-rose-600">{addMediaError}</p>}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={addMediaUrlInput}
                    onChange={(e) => setAddMediaUrlInput(e.target.value)}
                    placeholder="Or paste panorama/video URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = addMediaUrlInput.trim();
                      if (!trimmed) return;
                      const looksLikeVideo = /\.(mp4|webm|mov)(\?|$)/i.test(trimmed);
                      setNewMedia(
                        createRoomMediaObject(
                          looksLikeVideo ? 'video' : 'panorama',
                          trimmed,
                          'External Link'
                        )
                      );
                      setAddMediaUrlInput('');
                    }}
                    className="px-3 py-2 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    Use URL
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreateRoom(e, true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold shadow cursor-pointer"
                >
                  Publish &amp; Add Another
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-xl font-bold font-serif">Broadcast Notice to All Tenants</h4>
              <button
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setAnnouncementSuccess(false);
                }}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {announcementSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h5 className="text-lg font-bold text-stone-900">Notice Published!</h5>
                <p className="text-sm text-stone-600">
                  All active tenants and renters viewing your boarding houses can now see this announcement.
                </p>
                <button
                  onClick={() => {
                    setShowAnnouncementModal(false);
                    setAnnouncementSuccess(false);
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#e05d26] text-white text-sm font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddAnnouncement({
                    title: announcementTitle.trim(),
                    message: announcementText.trim(),
                    priority: announcementPriority,
                    author: ownerName || 'Host Landlord',
                    ownerEmail: ownerEmail.trim().toLowerCase(),
                  });
                  setAnnouncementTitle('');
                  setAnnouncementText('');
                  setAnnouncementSuccess(true);
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Announcement Subject
                  </label>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="e.g. Wi-Fi Maintenance Schedule or Rent Reminder"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={announcementPriority}
                    onChange={(e) =>
                      setAnnouncementPriority(e.target.value as 'normal' | 'important')
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base bg-white text-stone-800"
                  >
                    <option value="important">Important Notice (Highlighted)</option>
                    <option value="normal">General Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Notice Message
                  </label>
                  <textarea
                    rows={4}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Write detailed instructions for renters..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base text-stone-800"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#e05d26] text-white text-sm font-bold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Broadcast Notice</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Document / Receipt Preview Lightbox */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-lg font-bold text-stone-900 truncate pr-4">{previewDoc.title}</h4>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewDoc.url}
              alt={previewDoc.title}
              className="w-full max-h-[65vh] object-contain rounded-2xl bg-stone-900"
            />
          </div>
        </div>
      )}
    </div>
  );
};
