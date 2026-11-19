export type RoomType = 'Shared Room' | 'Studio' | 'Dormitory Bed' | 'Private Room';

export interface OccupiedPeriod {
  startDate: string;
  endDate: string;
  label?: string;
  renterName?: string;
}

export interface SubUnit {
  id: string;
  unitNumber: string; // e.g. "Room 101", "Bed A", "Studio Suite"
  unitType: RoomType;
  price: number;
  status: 'available' | 'occupied' | 'reserved';
  currentTenant?: string;
  panoramaTheme: string;
  features: string[];
}

export interface OwnerAnnouncement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'normal' | 'important';
  author: string;
  ownerEmail?: string;
}

export interface PaymentRecord {
  id: string;
  requestId: string;
  roomId?: string;
  roomTitle: string;
  ownerEmail?: string;
  unitNumber?: string;
  renterName: string;
  amount: number;
  monthCovered: string;
  paidDate: string;
  method: 'GCash' | 'Cash' | 'Bank Transfer';
  referenceNo: string;
  receiptImageUrl?: string;
  receiptFileName?: string;
  status: 'confirmed' | 'pending';
}

export interface RoomMedia {
  type: 'video' | 'panorama';
  url: string;
  fileName?: string;
  caption?: string;
  uploadedAt: string;
}

export type GenderPolicy = 'Mixed' | 'Female Only' | 'Male Only';
export type UtilitiesPolicy =
  | 'Water & Electric Included'
  | 'Water Included, Electric Submetered'
  | 'Submetered';

export interface Room {
  id: string;
  title: string;
  type: RoomType;
  location: string;
  city: 'Oroquieta' | string;
  barangay?: string;
  nearSchool?: string;
  landmark: string;
  distanceKm: number;
  walkingMinutes?: number;
  genderPolicy?: GenderPolicy;
  utilitiesIncluded?: UtilitiesPolicy;
  price: number; // in PHP (₱)
  amenities: string[];
  tags: string[];
  illustrationTheme:
    | 'sunrise'
    | 'cozy'
    | 'greenview'
    | 'maple'
    | 'bayanihan'
    | 'harbor'
    | 'hillside'
    | 'capitol'
    | 'falls'
    | 'loft';
  slotsAvailable: number;
  totalSlots: number;
  availableFrom: string; // ISO date 'YYYY-MM-DD'
  minimumStayMonths: number;
  occupiedPeriods: OccupiedPeriod[];
  subUnits?: SubUnit[]; // Individual sub-rooms / bedspaces in this boarding house
  roomMedia?: RoomMedia; // Owner-uploaded video walkthrough or 360° panorama photo
  ownerName: string;
  ownerEmail?: string;
  ownerPhone: string;
  ownerVerified?: boolean;
  ownerIdType?: string;
  ownerVerificationDocUrl?: string;
  ownerVerificationBadge?: string;
  description: string;
  rules: string[];
  coordinates: { lat: number; lng: number };
}

export interface CampusLandmark {
  id: string;
  name: string;
  city: string;
  type: 'university' | 'hospital' | 'port' | 'government';
  coordinates: { lat: number; lng: number };
}

export interface BookingRequest {
  id: string;
  roomId: string;
  roomTitle: string;
  ownerEmail?: string;
  unitNumber?: string;
  roomPrice: number;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  renterAge?: number;
  renterGender?: string;
  renterSchool?: string;
  studentIdPhotoUrl?: string;
  studentIdFileName?: string;
  moveInDate: string;
  moveOutDate?: string;
  durationMonths: number;
  notes?: string;
  status: 'pending' | 'approved' | 'declined';
  paymentStatus?: 'unpaid' | 'paid_deposit' | 'paid_full';
  depositAmount?: number;
  createdAt: string;
}

export type AuthMode = 'renter' | 'owner';

export interface UserProfile {
  name: string;
  email: string;
  role: AuthMode;
  age?: number;
  gender?: 'Female' | 'Male' | 'Prefer not to say';
  school?: string;
  studentIdPhotoUrl?: string;
  studentIdFileName?: string;
  ownerIdType?: string;
  ownerVerificationDocUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: 'renter' | 'owner';
  recipientId: string;
  recipientName: string;
  recipientRole: 'renter' | 'owner';
  text: string;
  createdAt: string;
  read: boolean;
  presetTopic?: string;
}

export interface Conversation {
  id: string;
  roomId: string;
  roomTitle: string;
  roomPrice: number;
  roomLocation: string;
  ownerName: string;
  renterName: string;
  renterEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface FilterState {
  searchQuery: string;
  maxDistance: number | 'any';
  maxRent: number | 'any';
  roomType: string;
  activeTag: string | null;
}
