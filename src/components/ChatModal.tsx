import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  CheckCheck,
  Building,
  User,
  Shield,
  Sparkles,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Room, ChatMessage, AuthMode } from '../types';

interface ChatModalProps {
  room: Room;
  currentUser: { name: string; email: string; role: AuthMode } | null;
  onClose: () => void;
  onRequestBooking: (room: Room) => void;
}

const QUICK_INQUIRIES = [
  'Is the Wi-Fi stable for online exams?',
  'What is the evening curfew policy?',
  'Can I bring my own rice cooker / electric fan?',
  'Are visitors or group study allowed?',
  'How much is the advance & security deposit?',
  'Can I schedule an in-person viewing this week?',
];

export const ChatModal: React.FC<ChatModalProps> = ({
  room,
  currentUser,
  onClose,
  onRequestBooking,
}) => {
  // Determine current active user in chat (default to renter or logged in role)
  const [activeRole, setActiveRole] = useState<'renter' | 'owner'>(
    currentUser?.role || 'renter'
  );
  const currentUserName =
    activeRole === 'owner'
      ? room.ownerName
      : currentUser?.name || 'Student Renter';
  const currentUserId =
    activeRole === 'owner'
      ? `owner-${room.id}`
      : currentUser?.email || 'renter-guest';

  const recipientName =
    activeRole === 'renter' ? room.ownerName : 'Student Renter';
  const recipientRole = activeRole === 'renter' ? 'owner' : 'renter';

  const conversationKey = `vrent_chat_${room.id}`;

  // Initial starter messages tailored for Oroquieta boarding houses
  const getInitialMessages = (): ChatMessage[] => {
    try {
      const stored = localStorage.getItem(conversationKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read chat history from localStorage', e);
    }

    if (room.id === 'room-1') {
      return [
        {
          id: 'msg-seed-1',
          conversationId: `conv-${room.id}`,
          roomId: room.id,
          senderId: 'renter-seed',
          senderName: 'Mark Angelo Gomez',
          senderRole: 'renter',
          recipientId: `owner-${room.id}`,
          recipientName: room.ownerName,
          recipientRole: 'owner',
          text: "Good day po Ma'am Remedios! I am an incoming 2nd year IT student at USTP Oroquieta Campus. Is the Wi-Fi stable for coding projects in the evening?",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: 'msg-seed-2',
          conversationId: `conv-${room.id}`,
          roomId: room.id,
          senderId: `owner-${room.id}`,
          senderName: room.ownerName,
          senderRole: 'owner',
          recipientId: 'renter-seed',
          recipientName: 'Mark Angelo Gomez',
          recipientRole: 'renter',
          text: 'Hello Mark! Yes, we have 200Mbps PLDT Fiber with mesh repeaters on each floor. Many USTP and SJC students study here with zero lag.',
          createdAt: new Date(Date.now() - 3000000).toISOString(),
          read: true,
        },
        {
          id: 'msg-seed-3',
          conversationId: `conv-${room.id}`,
          roomId: room.id,
          senderId: 'renter-seed',
          senderName: 'Mark Angelo Gomez',
          senderRole: 'renter',
          recipientId: `owner-${room.id}`,
          recipientName: room.ownerName,
          recipientRole: 'owner',
          text: 'That sounds great! Can I also bring my own electric fan or is there an extra electricity fee?',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          read: true,
        },
        {
          id: 'msg-seed-4',
          conversationId: `conv-${room.id}`,
          roomId: room.id,
          senderId: `owner-${room.id}`,
          senderName: room.ownerName,
          senderRole: 'owner',
          recipientId: 'renter-seed',
          recipientName: 'Mark Angelo Gomez',
          recipientRole: 'renter',
          text: "Personal electric fans and laptop chargers are completely included in the monthly rent with no extra charge! You're welcome to submit a booking or visit us anytime.",
          createdAt: new Date(Date.now() - 600000).toISOString(),
          read: true,
        },
      ];
    }

    return [
      {
        id: `msg-welcome-${room.id}`,
        conversationId: `conv-${room.id}`,
        roomId: room.id,
        senderId: `owner-${room.id}`,
        senderName: room.ownerName,
        senderRole: 'owner',
        recipientId: 'renter-guest',
        recipientName: 'Student Renter',
        recipientRole: 'renter',
        text: `Maayong adlaw! Welcome to ${room.title} in ${room.location}, Oroquieta City. Feel free to ask about room rules, study spaces, or tap 'Quick Ask' below to discuss details before booking!`,
        createdAt: new Date(Date.now() - 120000).toISOString(),
        read: true,
      },
    ];
  };

  // Messages & UI State
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [inputText, setInputText] = useState('');
  const [otherUserTyping, setOtherUserTyping] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimerRef = useRef<any>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(conversationKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat to localStorage', e);
    }
  }, [messages, conversationKey]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    };
  }, []);

  // Send Chat Message
  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: `client-${Date.now()}`,
      conversationId: `conv-${room.id}`,
      roomId: room.id,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: activeRole,
      recipientId: activeRole === 'renter' ? `owner-${room.id}` : 'renter-guest',
      recipientName,
      recipientRole,
      text: content.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // If renter sends a message, simulate realistic host reply
    if (activeRole === 'renter') {
      const promptLower = content.toLowerCase();
      let replyText = `Thanks for asking! Everything listed for ${room.title} in Oroquieta is up-to-date. You can submit your official booking request anytime or inspect the units!`;

      if (promptLower.includes('wi-fi') || promptLower.includes('wifi') || promptLower.includes('internet')) {
        replyText = `Yes! We have dedicated fiber internet with strong coverage throughout all rooms and study pods. Speed tests average over 150-200Mbps, perfect for Google Classroom and online exams.`;
      } else if (promptLower.includes('curfew')) {
        replyText = `Our general main gate curfew is 10:00 PM for security. If you have late laboratory or hospital duties at the provincial hospital, just notify us in advance and we provide a security gate fob!`;
      } else if (promptLower.includes('fan') || promptLower.includes('cooker') || promptLower.includes('appliance')) {
        replyText = `Personal desk fans and laptop chargers have no extra charge. We have a shared pantry kitchen with induction cookers and microwave available for all boarding students.`;
      } else if (promptLower.includes('visitor') || promptLower.includes('friend') || promptLower.includes('study')) {
        replyText = `Visitors and classmates are very welcome in our ground floor study lounge and courtyard until 8:00 PM. For security and privacy, dormitory sleeping areas are for registered tenants only.`;
      } else if (promptLower.includes('deposit') || promptLower.includes('advance') || promptLower.includes('pay')) {
        replyText = `Standard terms are 1 month advance and 1 month security deposit. We accept GCash, bank transfer, and cash receipts logged directly in your portal.`;
      } else if (promptLower.includes('view') || promptLower.includes('visit') || promptLower.includes('inspect')) {
        replyText = `You are very welcome to visit! We are located right in ${room.location}. You can also use our 360° VR viewer right now to inspect all available rooms and bedspaces.`;
      }

      // Simulate typing indicator
      replyTimerRef.current = setTimeout(() => {
        setOtherUserTyping(room.ownerName);

        replyTimerRef.current = setTimeout(() => {
          setOtherUserTyping(null);
          const hostReply: ChatMessage = {
            id: `host-reply-${Date.now()}`,
            conversationId: `conv-${room.id}`,
            roomId: room.id,
            senderId: `owner-${room.id}`,
            senderName: room.ownerName,
            senderRole: 'owner',
            recipientId: currentUserId,
            recipientName: currentUserName,
            recipientRole: 'renter',
            text: replyText,
            createdAt: new Date().toISOString(),
            read: true,
          };
          setMessages((prev) => [...prev, hostReply]);
        }, 1500);
      }, 1000);
    }
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[90vh] max-h-[720px]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0e1615] text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
                {activeRole === 'renter' ? (
                  <Building className="w-5 h-5 text-[#e05d26]" />
                ) : (
                  <User className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0e1615]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-1.5">
                  <span>{room.ownerName}</span>
                </h3>
                {room.ownerVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                    <Shield className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Verified Host</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-300 flex items-center gap-2">
                <span>{room.title}</span>
                <span className="text-stone-500">•</span>
                <span className="text-amber-200/90 font-medium">₱{room.price.toLocaleString()}/mo</span>
                <span className="text-stone-500">•</span>
                <span className="text-emerald-400 font-medium text-[11px]">Online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Role switch toggle for testing */}
            <div className="hidden sm:flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveRole('renter')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeRole === 'renter'
                    ? 'bg-[#e05d26] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Renter
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('owner')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeRole === 'owner'
                    ? 'bg-[#e05d26] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Owner
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Room Brief Top Strip */}
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-stone-800">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-stone-900">Oroquieta Location:</span>
            <span className="text-stone-600 truncate">{room.location}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onRequestBooking(room);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white font-semibold text-xs transition cursor-pointer shrink-0 shadow-xs"
          >
            <span>Book Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-100/60">
          {messages.map((msg) => {
            const isMine =
              msg.senderRole === activeRole ||
              msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-stone-400 mb-1 px-1">
                  {msg.senderName} ({msg.senderRole === 'owner' ? 'Host' : 'Renter'})
                </span>

                <div
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs leading-relaxed ${
                    isMine
                      ? 'bg-[#e05d26] text-white rounded-br-none'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                      isMine ? 'text-white/80' : 'text-stone-400'
                    }`}
                  >
                    <span>{formatMessageTime(msg.createdAt)}</span>
                    {isMine && <CheckCheck className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {otherUserTyping && (
            <div className="flex items-center gap-2 text-xs text-stone-500 italic bg-white p-2.5 rounded-xl border border-stone-200 w-fit shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e05d26] animate-ping" />
              <span>{otherUserTyping} is typing a reply...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Student Inquiries Bar */}
        <div className="px-4 py-2 bg-stone-100/90 border-t border-stone-200 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#e05d26]" />
              <span>Quick Ask:</span>
            </span>
            {QUICK_INQUIRIES.map((inquiry, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(inquiry)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-stone-700 hover:text-[#e05d26] border border-stone-200 hover:border-orange-300 text-[11px] font-medium transition cursor-pointer shadow-xs"
              >
                {inquiry}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${recipientName}...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#e05d26] focus:ring-1 focus:ring-[#e05d26]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-[#e05d26] hover:bg-[#c94f1c] disabled:opacity-40 text-white shadow-md shadow-[#e05d26]/20 transition cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
