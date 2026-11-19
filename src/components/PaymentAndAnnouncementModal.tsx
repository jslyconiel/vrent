import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Room, BookingRequest, PaymentRecord, OwnerAnnouncement } from '../types';
import { processUploadedImage } from '../utils/mediaUtils';

interface PaymentAndAnnouncementModalProps {
  room: Room;
  request?: BookingRequest | null;
  announcements: OwnerAnnouncement[];
  onClose: () => void;
  onSubmitPayment: (payment: Omit<PaymentRecord, 'id' | 'paidDate'>) => void;
}

export const PaymentAndAnnouncementModal: React.FC<PaymentAndAnnouncementModalProps> = ({
  room,
  request,
  announcements,
  onClose,
  onSubmitPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'payment' | 'announcements'>('payment');
  const [amount, setAmount] = useState<number>(room.price);
  const [monthCovered, setMonthCovered] = useState('November 2026 (Advance Deposit)');
  const [method, setMethod] = useState<'GCash' | 'Cash' | 'Bank Transfer'>('GCash');
  const [referenceNo, setReferenceNo] = useState('100984521');
  const [renterName, setRenterName] = useState(request?.renterName || 'Juan Dela Cruz');
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | undefined>(undefined);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await processUploadedImage(file, 1000);
      setReceiptImageUrl(url);
      setReceiptFileName(file.name);
    } catch {
      // Ignore invalid upload
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPayment({
      requestId: request?.id || `req-${Date.now()}`,
      roomId: room.id,
      roomTitle: room.title,
      ownerEmail: room.ownerEmail,
      unitNumber: request?.unitNumber || 'Bedspace C',
      renterName,
      amount: Number(amount),
      monthCovered,
      method,
      referenceNo,
      receiptImageUrl,
      receiptFileName: receiptFileName || undefined,
      status: 'pending',
    });
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0e1615] text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#e05d26]/20 text-[#e05d26] uppercase tracking-wider">
                Tenant Portal
              </span>
              <span className="text-xs sm:text-sm text-stone-400">Boarding House Services</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">{room.title}</h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Landlord: {room.ownerName} • {room.ownerPhone}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'payment'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Rental Payment &amp; Receipt</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Owner Announcements ({announcements.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/50">
          {activeTab === 'payment' ? (
            isSuccess ? (
              <div className="p-6 text-center space-y-4 bg-white rounded-2xl border border-stone-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-stone-900 font-serif">
                  Receipt Sent for Verification!
                </h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your payment of <strong>₱{amount.toLocaleString()}</strong> for{' '}
                  <strong>{monthCovered}</strong> has been submitted to {room.ownerName} (Ref:{' '}
                  <code>{referenceNo}</code>). Once confirmed, it updates in your{' '}
                  <strong>My Bookings</strong> ledger.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Submit Another Payment
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-[#e05d26] text-white text-sm font-bold shadow cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handlePay}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h4 className="text-base font-bold text-stone-900">
                      Record Rent or Advance Deposit
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Attach your GCash screenshot or cash receipt for landlord confirmation
                    </p>
                  </div>
                  <span className="text-sm font-black text-[#e05d26]">
                    ₱{room.price.toLocaleString()} / mo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      Renter / Payee Name
                    </label>
                    <input
                      type="text"
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      Payment Amount (₱)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      Billing Period / Purpose
                    </label>
                    <select
                      value={monthCovered}
                      onChange={(e) => setMonthCovered(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 bg-white"
                    >
                      <option value="November 2026 (Advance Deposit)">
                        November 2026 (Advance Deposit)
                      </option>
                      <option value="December 2026 Rent">December 2026 Rent</option>
                      <option value="January 2027 Rent">January 2027 Rent</option>
                      <option value="Full Semester (5 Months)">Full Semester (5 Months)</option>
                      <option value="Key & Security Deposit">Key &amp; Security Deposit (₱1,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as PaymentRecord['method'])}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800 bg-white"
                    >
                      <option value="GCash">GCash (Mobile Wallet)</option>
                      <option value="Cash">Cash Handover to Owner</option>
                      <option value="Bank Transfer">Online Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    GCash Reference Number / Receipt Code
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. 100984521"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-800"
                    required
                  />
                  <span className="text-xs text-stone-500 mt-1 block">
                    Owner GCash: <strong>{room.ownerPhone}</strong> ({room.ownerName})
                  </span>
                </div>

                {/* Upload GCash Screenshot Proof */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <label className="block text-sm font-bold text-stone-800">
                    Upload GCash / Payment Receipt Screenshot
                  </label>
                  <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-dashed border-stone-300 hover:border-[#e05d26] text-sm font-semibold text-stone-700 cursor-pointer">
                    <Upload className="w-4 h-4 text-[#e05d26]" />
                    <span>
                      {receiptFileName ? `Attached: ${receiptFileName}` : 'Choose Receipt Screenshot'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>
                  {receiptImageUrl && (
                    <img
                      src={receiptImageUrl}
                      alt="Uploaded payment receipt"
                      className="w-full max-h-40 object-contain rounded-xl border border-stone-200 bg-white"
                    />
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by VRENT Receipt Ledger</span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-sm font-bold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Submit Payment Proof</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Official Landlord Notices for {room.title}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">
                  ● Verified Active Boarding House
                </span>
              </div>

              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1.5"
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

                  <div className="pt-2 text-xs text-stone-500 flex items-center gap-1">
                    <span>Posted by:</span>
                    <strong className="text-stone-800">{ann.author}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
