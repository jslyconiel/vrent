import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  Smartphone,
  Receipt,
  FileCheck,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Room, BookingRequest, PaymentRecord } from '../types';

interface PaymentAndAnnouncementModalProps {
  room: Room;
  request?: BookingRequest | null;
  onClose: () => void;
  onSubmitPayment: (payment: Omit<PaymentRecord, 'id' | 'paidDate'>) => void;
}

export const PaymentAndAnnouncementModal: React.FC<PaymentAndAnnouncementModalProps> = ({
  room,
  request,
  onClose,
  onSubmitPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'payment' | 'announcements'>('payment');
  const [amount, setAmount] = useState<number>(room.price);
  const [monthCovered, setMonthCovered] = useState('November 2026 (Advance Deposit)');
  const [method, setMethod] = useState<'GCash' | 'Cash' | 'Bank Transfer'>('GCash');
  const [referenceNo, setReferenceNo] = useState('100984521');
  const [renterName, setRenterName] = useState(request?.renterName || 'Juan Dela Cruz');
  const [isSuccess, setIsSuccess] = useState(false);

  // Landlord announcements feed for this boarding house
  const announcements = [
    {
      id: 'ann-1',
      title: 'Water Cistern Cleaning & Maintenance Schedule',
      date: 'Nov 06, 2026',
      priority: 'important',
      message:
        'Please be advised that the overhead water tank will undergo scheduled cleaning this Saturday from 1:00 PM to 4:00 PM. Please store backup water in your buckets.',
      author: room.ownerName,
    },
    {
      id: 'ann-2',
      title: 'Midterm Examination Quiet Study Hours',
      date: 'Nov 02, 2026',
      priority: 'normal',
      message:
        'To support all students studying for university midterms, quiet study hours will be strictly enforced starting 8:00 PM daily. High-speed study lounge Wi-Fi will remain prioritized.',
      author: room.ownerName,
    },
    {
      id: 'ann-3',
      title: 'Monthly Rent Payment Reminders',
      date: 'Oct 28, 2026',
      priority: 'normal',
      message:
        'Rent dues are settled every 5th of the month via GCash or direct cash handover. Please upload or input your transaction reference number to update your ledger.',
      author: room.ownerName,
    },
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPayment({
      requestId: request?.id || `req-${Date.now()}`,
      roomTitle: room.title,
      unitNumber: request?.unitNumber || 'Unit 101',
      renterName,
      amount: Number(amount),
      monthCovered,
      method,
      referenceNo,
      status: 'confirmed',
    });
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0e1615] text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e05d26]/20 text-[#e05d26] uppercase tracking-wider">
                Tenant Portal
              </span>
              <span className="text-xs text-stone-400">Boarding House Services</span>
            </div>
            <h3 className="text-xl font-bold font-serif">{room.title}</h3>
            <p className="text-xs text-stone-400">Landlord: {room.ownerName} • {room.ownerPhone}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Payments vs Announcements (Requirement #4) */}
        <div className="px-6 py-2 bg-stone-100 border-b border-stone-200 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'payment'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Rental Payment &amp; Deposit</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#e05d26] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
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
                <h4 className="text-xl font-bold text-stone-900 font-serif">Payment Recorded!</h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your payment of <strong>₱{amount.toLocaleString()}</strong> for{' '}
                  <strong>{monthCovered}</strong> has been logged to {room.ownerName}&apos;s ledger.
                  Reference: <code>{referenceNo}</code>.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Submit Another Payment
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-[#e05d26] text-white text-xs font-bold shadow cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePay} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Record Rent or Advance Deposit</h4>
                    <p className="text-[11px] text-stone-500">
                      Submit GCash or cash receipt for landlord ledger confirmation
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#e05d26]">
                    ₱{room.price.toLocaleString()} / mo rate
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Renter / Payee Name
                    </label>
                    <input
                      type="text"
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Payment Amount (₱)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 font-bold text-stone-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Billing Period / Purpose
                    </label>
                    <select
                      value={monthCovered}
                      onChange={(e) => setMonthCovered(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
                    >
                      <option value="November 2026 (Advance Deposit)">November 2026 (Advance Deposit)</option>
                      <option value="December 2026 Rent">December 2026 Rent</option>
                      <option value="January 2027 Rent">January 2027 Rent</option>
                      <option value="Full Semester (5 Months)">Full Semester (5 Months)</option>
                      <option value="Key & Security Deposit">Key &amp; Security Deposit (₱1,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
                    >
                      <option value="GCash">GCash (Mobile Wallet)</option>
                      <option value="Cash">Cash Handover to Owner</option>
                      <option value="Bank Transfer">Online Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    GCash Reference Number / Receipt Code
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. 100984521"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
                    required
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Owner GCash: <strong>{room.ownerPhone}</strong> ({room.ownerName})
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by VRENT Receipt Ledger</span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Confirm Payment Entry</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Official Landlord Notices for {room.title}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  ● Verified Active Boarding House
                </span>
              </div>

              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{ann.title}</span>
                      {ann.priority === 'important' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          IMPORTANT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400">{ann.date}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{ann.message}</p>

                  <div className="pt-2 text-[10px] text-stone-400 flex items-center gap-1">
                    <span>Posted by:</span>
                    <strong className="text-stone-700">{ann.author}</strong>
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
