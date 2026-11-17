import React, { useState } from 'react';
import { AuthMode } from '../types';
import { Search, Building, CheckCircle2, CheckSquare, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

interface AuthPortalProps {
  initialMode: AuthMode;
  onBackToSearch: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: AuthMode }) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  initialMode,
  onBackToSearch,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<AuthMode>(initialMode);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMessage('Please enter email and password.');
      return;
    }

    const userName = name || (email.split('@')[0] || (role === 'owner' ? 'Host Landlord' : 'Student Renter'));
    setStatusMessage('Authenticating...');
    setTimeout(() => {
      onLoginSuccess({
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email,
        role,
      });
    }, 400);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#0e1615] text-white py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden">
      {/* Background Watermark Branding */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
        <span className="text-[28vw] font-black text-amber-500 font-serif">V</span>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Clear Back Button (Requirement #6: kailangan syag butangan back buttons para dili malibog) */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToSearch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white text-xs font-bold border border-stone-700 transition cursor-pointer"
          >
            <span>← Back to Room Search</span>
          </button>

          <span className="text-xs text-stone-400">
            {role === 'renter' ? 'Renter Sign In' : 'Property Owner Portal'}
          </span>
        </div>

        {/* Top Role Selector Cards (exactly matching video timestamp 00:03 - 00:08) */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto md:mx-0 mb-8 sm:mb-12">
          {/* Renter Switcher Card */}
          <button
            type="button"
            onClick={() => {
              setRole('renter');
              setStatusMessage(null);
            }}
            className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
              role === 'renter'
                ? 'bg-white text-stone-900 border-white shadow-xl scale-[1.02]'
                : 'bg-[#152220] hover:bg-[#1b2b29] text-stone-300 border-stone-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Search
                className={`w-4 h-4 ${
                  role === 'renter' ? 'text-[#e05d26]' : 'text-stone-400'
                }`}
              />
              <span className="font-bold text-sm sm:text-base">I&apos;m a Renter</span>
            </div>
            <p className={`text-xs ${role === 'renter' ? 'text-stone-500' : 'text-stone-400'}`}>
              Find & reserve a room
            </p>
          </button>

          {/* Owner Switcher Card */}
          <button
            type="button"
            onClick={() => {
              setRole('owner');
              setStatusMessage(null);
            }}
            className={`p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
              role === 'owner'
                ? 'bg-white text-stone-900 border-white shadow-xl scale-[1.02]'
                : 'bg-[#152220] hover:bg-[#1b2b29] text-stone-300 border-stone-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Building
                className={`w-4 h-4 ${
                  role === 'owner' ? 'text-[#e05d26]' : 'text-stone-400'
                }`}
              />
              <span className="font-bold text-sm sm:text-base">I&apos;m an Owner</span>
            </div>
            <p className={`text-xs ${role === 'owner' ? 'text-stone-500' : 'text-stone-400'}`}>
              List & manage my places
            </p>
          </button>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Portal Overview & Checklist */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {role === 'owner' ? (
              <>
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#e05d26] uppercase">
                  OWNER PORTAL
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 font-serif tracking-tight leading-tight">
                  Fill your rooms, <br />
                  <span className="italic font-normal text-amber-200">faster.</span>
                </h2>
                <p className="mt-4 text-stone-300 text-sm leading-relaxed max-w-md">
                  Pin your boarding house on the map so renters nearby can find it, then approve requests from your dashboard.
                </p>

                <div className="mt-6 space-y-3.5 max-w-md">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-stone-200">
                      Show up in &quot;near me&quot; searches
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-stone-200">
                      Set rent, slots & amenities
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-stone-200">
                      Approve or decline requests
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#e05d26] uppercase">
                  RENTER PORTAL
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 font-serif tracking-tight leading-tight">
                  Your next chapter <br />
                  <span className="italic font-normal text-amber-200">is waiting.</span>
                </h2>
                <p className="mt-4 text-stone-300 text-sm leading-relaxed max-w-md">
                  Save time hunting. Search near your school or work, send room requests, and track every reply in one place.
                </p>

                <div className="mt-6 space-y-3.5 max-w-md">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-stone-200">
                      Rooms sorted by distance
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-stone-200">
                      Request with a move-in date
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-stone-200">
                      See approvals instantly
                    </span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Right Column: White Card Form (exact layout from video) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-stone-900 shadow-2xl border border-stone-200/80">
              <span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                {isSignUp ? 'START YOUR JOURNEY' : 'WELCOME BACK'}
              </span>

              <h3 className="text-2xl font-extrabold text-stone-900 mt-1 font-serif">
                {role === 'owner'
                  ? isSignUp
                    ? 'Create owner account'
                    : 'Owner log in'
                  : isSignUp
                  ? 'Create renter account'
                  : 'Renter log in'}
              </h3>

              <p className="text-xs text-stone-500 mt-1 mb-6">
                {role === 'owner'
                  ? 'Log in to manage your listings and requests.'
                  : 'Log in to continue your room search.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'owner' ? 'e.g. Remedios Santos' : 'e.g. Juan Dela Cruz'}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] focus:ring-1 focus:ring-[#e05d26] text-sm text-stone-900"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] focus:ring-1 focus:ring-[#e05d26] text-sm text-stone-900"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] focus:ring-1 focus:ring-[#e05d26] text-sm text-stone-900 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {statusMessage && (
                  <p className="text-xs font-medium text-[#e05d26]">{statusMessage}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white font-bold text-sm tracking-wide shadow-md shadow-[#e05d26]/20 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{isSignUp ? 'Create account' : 'Log in'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!isSignUp && (
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your email (simulated).')}
                      className="text-xs text-stone-500 hover:text-stone-700 underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setStatusMessage(null);
                    }}
                    className="text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                  >
                    {isSignUp ? (
                      <>
                        Already have an account?{' '}
                        <strong className="text-[#e05d26] underline">Log in here</strong>
                      </>
                    ) : (
                      <>
                        New to VRENT?{' '}
                        <strong className="text-[#e05d26] underline">
                          {role === 'owner' ? 'Create an owner account' : 'Create a renter account'}
                        </strong>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
