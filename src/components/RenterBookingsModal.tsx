import React, { useState } from 'react';
import {
  X,
  CalendarCheck,
  Bell,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  BedDouble,
} from 'lucide-react';
import { BookingRequest, OwnerAnnouncement, PaymentRecord } from '../types';

interface RenterBookingsModalProps {
  requests: BookingRequest[];
  payments: PaymentRecord[];
  announcements: OwnerAnnouncement[];
  currentUserEmail?: string;
  onClose: () => void;
}

export const RenterBookingsModal: React.FC<RenterBookingsModalProps> = ({
  requests,
  payments,
  announcements,
  currentUserEmail,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'payments' | 'notices'>('bookings');

  const displayRequests = currentUserEmail
    ? requests.filter((r) => r.renterEmail.toLowerCase() === currentUserEmail.toLowerCase())
    : requests;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0e1615] text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#e05d26] uppercase">
              RENTER PORTAL · MY STATUS
            </span>
            <h3 className="text-2xl font-bold font-serif mt-0.5">
              My Bookings, Receipts &amp; Notices
            </h3>
            <p className="text-sm text-stone-400">
              Track reservation approvals, GCash payment verifications, and landlord updates
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Booking Status ({displayRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Payment Ledger ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Landlord Notices ({announcements.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/70 space-y-4">
          {activeTab === 'bookings' && (
            <>
              {displayRequests.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-base">
                  You have not submitted any room booking requests yet.
                </div>
              ) : (
                displayRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-lg font-bold text-stone-900">{req.roomTitle}</h4>
                        {req.unitNumber && (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#e05d26]">
                            <BedDouble className="w-4 h-4" />
                            <span>Assigned Unit: {req.unitNumber}</span>
                          </div>
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status === 'approved' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : req.status === 'declined' ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{req.status.toUpperCase()}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                      <span>Move-in: <strong>{req.moveInDate}</strong></span>
                      <span>Duration: <strong>{req.durationMonths} months</strong></span>
                      <span>Rent: <strong>₱{req.roomPrice.toLocaleString()}/mo</strong></span>
                    </div>

                    {req.studentIdPhotoUrl && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Student ID / COR Attached ({req.studentIdFileName || 'Verified'})</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'payments' && (
            <>
              {payments.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-base">
                  No rent or deposit payments recorded yet. Use the Receipt icon on any room card to upload a GCash proof.
                </div>
              ) : (
                payments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-stone-900">
                          {pay.roomTitle} · {pay.monthCovered}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            pay.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {pay.status === 'confirmed' ? 'VERIFIED BY OWNER' : 'PENDING VERIFICATION'}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600">
                        ₱{pay.amount.toLocaleString()} via <strong>{pay.method}</strong> · Ref:{' '}
                        <code>{pay.referenceNo}</code> · {pay.paidDate}
                      </p>
                    </div>

                    {pay.receiptImageUrl && (
                      <img
                        src={pay.receiptImageUrl}
                        alt="Payment receipt"
                        className="w-20 h-20 object-cover rounded-xl border border-stone-200 shrink-0"
                      />
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'notices' && (
            <>
              {announcements.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-base">
                  No announcements from your landlord yet.
                </div>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-stone-900">{ann.title}</span>
                        {ann.priority === 'important' && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            IMPORTANT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500">{ann.date}</span>
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">{ann.message}</p>
                    <p className="text-xs text-stone-500 pt-1">Posted by: {ann.author}</p>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
