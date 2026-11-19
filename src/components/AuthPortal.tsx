import React, { useState } from 'react';
import { AuthMode, RoomMedia, UserProfile } from '../types';
import { OROQUIETA_CITY_SCHOOLS } from '../data/oroquietaSchools';
import {
  Search,
  Building,
  CheckSquare,
  Eye,
  EyeOff,
  ArrowRight,
  Upload,
  ShieldCheck,
  GraduationCap,
  IdCard,
} from 'lucide-react';
import { processUploadedImage } from '../utils/mediaUtils';

export const PHILIPPINE_VALID_IDS = [
  'Philippine Identification System (PhilSys) ID (PVC card, ePhilID, or Digital National ID via eGovPH app)',
  "Driver's License (issued by the LTO)",
  'Philippine Passport',
  'Unified Multi-Purpose ID (UMID) / SSS Card',
  "Voter's ID / COMELEC Registration Form",
  'Senior Citizen ID / Digital National Senior Citizens ID',
];

const PROFILES_STORAGE_KEY = 'vrent_profiles_v1';

function loadSavedProfile(email: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, UserProfile>;
    return map[email.trim().toLowerCase()] || null;
  } catch {
    return null;
  }
}

function saveUserProfile(profile: UserProfile) {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, UserProfile>) : {};
    map[profile.email.trim().toLowerCase()] = profile;
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore localStorage quota issues
  }
}

interface AuthPortalProps {
  initialMode: AuthMode;
  onLoginSuccess: (
    user: UserProfile,
    uploadedMedia?: { roomId: string; media: RoomMedia },
    ownerVerification?: { idType: string; docUrl: string }
  ) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  initialMode,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<AuthMode>(initialMode);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Shared Sign-Up Demographics (Age & Gender for both new Students & new Owners)
  const [age, setAge] = useState<string>('19');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Prefer not to say'>('Female');

  // Student Sign-Up Only (Oroquieta City Schools + School ID / COR)
  const [studentSchool, setStudentSchool] = useState<string>(OROQUIETA_CITY_SCHOOLS[0].name);
  const [studentDocUrl, setStudentDocUrl] = useState('');
  const [studentDocName, setStudentDocName] = useState('');

  // Owner Sign-Up Only (Philippine Valid ID)
  const [ownerIdType, setOwnerIdType] = useState<string>(PHILIPPINE_VALID_IDS[0]);
  const [ownerDocUrl, setOwnerDocUrl] = useState('');
  const [ownerDocName, setOwnerDocName] = useState('');
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  const handleOwnerDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage(null);
    setIsProcessingDoc(true);
    try {
      const url = await processUploadedImage(file, 1000);
      setOwnerDocUrl(url);
      setOwnerDocName(file.name);
    } catch (err: any) {
      setStatusMessage(err?.message || 'Could not process Valid ID photo.');
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const handleStudentDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage(null);
    setIsProcessingDoc(true);
    try {
      const url = await processUploadedImage(file, 1000);
      setStudentDocUrl(url);
      setStudentDocName(file.name);
    } catch (err: any) {
      setStatusMessage(err?.message || 'Could not process School ID / COR photo.');
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setStatusMessage('Please enter your email and password.');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setStatusMessage('Please enter your full name.');
        return;
      }
      const parsedAge = Number(age);
      const minAge = role === 'owner' ? 18 : 14;
      if (!parsedAge || parsedAge < minAge || parsedAge > 100) {
        setStatusMessage(`Please enter a valid age (${minAge}–100).`);
        return;
      }

      if (role === 'renter') {
        if (!studentSchool) {
          setStatusMessage('Please select your school in Oroquieta City.');
          return;
        }
        if (!studentDocUrl) {
          setStatusMessage(
            'Please upload your School ID, Valid ID, or Certificate of Enrollment (COR) to create your student account.'
          );
          return;
        }
      }

      if (role === 'owner' && !ownerDocUrl) {
        setStatusMessage(
          'Please attach a photo of your Philippine Valid ID to create an owner account.'
        );
        return;
      }

      const cleanName = name.trim();
      const newProfile: UserProfile = {
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        email: email.trim(),
        role,
        age: parsedAge,
        gender,
        ...(role === 'renter'
          ? {
              school: studentSchool,
              studentIdPhotoUrl: studentDocUrl,
              studentIdFileName: studentDocName,
            }
          : {
              ownerIdType,
              ownerVerificationDocUrl: ownerDocUrl,
            }),
      };

      saveUserProfile(newProfile);
      setStatusMessage(
        role === 'owner'
          ? 'Owner account created! Opening your Owner Dashboard...'
          : `Student account created! Showing rooms near ${studentSchool}...`
      );

      setTimeout(() => {
        onLoginSuccess(
          newProfile,
          undefined,
          role === 'owner' && ownerDocUrl
            ? { idType: ownerIdType, docUrl: ownerDocUrl }
            : undefined
        );
      }, 200);
      return;
    }

    // Existing Account Log In (Email + Password only; restores saved profile if registered)
    const saved = loadSavedProfile(email);
    const fallbackName = email.split('@')[0] || (role === 'owner' ? 'Host Landlord' : 'Student Renter');
    const resolvedUser: UserProfile =
      saved && saved.role === role
        ? saved
        : {
            name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
            email: email.trim(),
            role,
          };

    setStatusMessage(
      role === 'owner'
        ? 'Signing in to your Owner Dashboard...'
        : resolvedUser.school
        ? `Welcome back! Showing rooms near ${resolvedUser.school}...`
        : 'Welcome back! Opening Oroquieta City listings...'
    );

    setTimeout(() => {
      onLoginSuccess(
        resolvedUser,
        undefined,
        role === 'owner' && resolvedUser.ownerVerificationDocUrl
          ? {
              idType: resolvedUser.ownerIdType || PHILIPPINE_VALID_IDS[0],
              docUrl: resolvedUser.ownerVerificationDocUrl,
            }
          : undefined
      );
    }, 200);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#0e1615] text-white py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden">
      <div className="w-full max-w-5xl relative z-10">
        {/* Portal Status Label */}
        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          <span className="text-sm text-stone-300 font-medium">
            {role === 'renter'
              ? isSignUp
                ? 'Student Registration · Oroquieta City Only'
                : 'Renter Sign In · Oroquieta City'
              : isSignUp
              ? 'New Property Owner Registration'
              : 'Property Owner Portal'}
          </span>
        </div>

        {/* Top Role Selector Cards */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto md:mx-0 mb-8 sm:mb-10">
          {/* Renter Switcher Card */}
          <button
            type="button"
            onClick={() => {
              setRole('renter');
              setStatusMessage(null);
            }}
            className={`p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
              role === 'renter'
                ? 'bg-white text-stone-900 border-white shadow-xl scale-[1.02]'
                : 'bg-[#152220] hover:bg-[#1b2b29] text-stone-300 border-stone-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Search
                className={`w-5 h-5 ${
                  role === 'renter' ? 'text-[#e05d26]' : 'text-stone-400'
                }`}
              />
              <span className="font-bold text-base sm:text-lg">I&apos;m a Renter</span>
            </div>
            <p className={`text-sm ${role === 'renter' ? 'text-stone-600' : 'text-stone-400'}`}>
              Find &amp; reserve a room
            </p>
          </button>

          {/* Owner Switcher Card */}
          <button
            type="button"
            onClick={() => {
              setRole('owner');
              setStatusMessage(null);
            }}
            className={`p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
              role === 'owner'
                ? 'bg-white text-stone-900 border-white shadow-xl scale-[1.02]'
                : 'bg-[#152220] hover:bg-[#1b2b29] text-stone-300 border-stone-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Building
                className={`w-5 h-5 ${
                  role === 'owner' ? 'text-[#e05d26]' : 'text-stone-400'
                }`}
              />
              <span className="font-bold text-base sm:text-lg">I&apos;m an Owner</span>
            </div>
            <p className={`text-sm ${role === 'owner' ? 'text-stone-600' : 'text-stone-400'}`}>
              List &amp; manage my places
            </p>
          </button>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Portal Overview & Checklist */}
          <div className="lg:col-span-5 flex flex-col justify-center pt-2">
            {role === 'owner' ? (
              <>
                <span className="text-xs font-bold tracking-[0.2em] text-[#e05d26] uppercase">
                  OWNER PORTAL
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 font-serif tracking-tight leading-tight">
                  Fill your rooms, <br />
                  <span className="italic font-normal text-amber-200">faster.</span>
                </h2>
                <p className="mt-4 text-stone-300 text-base leading-relaxed max-w-md">
                  Go straight to your Owner Dashboard upon login. Every new owner starts with a clean dashboard ready for your Oroquieta City rooms.
                </p>

                <div className="mt-6 space-y-4 max-w-md">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-1" />
                    <span className="text-base font-medium text-stone-200">
                      List multiple rooms tagged by specific Oroquieta City school
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-1" />
                    <span className="text-base font-medium text-stone-200">
                      Verified Philippine Valid ID badge builds student trust
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-1" />
                    <span className="text-base font-medium text-stone-200">
                      Inspect verified Student IDs / CORs &amp; approve bookings
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className="text-xs font-bold tracking-[0.2em] text-[#e05d26] uppercase">
                  {isSignUp ? 'NEW STUDENT AUTHORIZATION' : 'RENTER PORTAL'}
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 font-serif tracking-tight leading-tight">
                  Your next chapter <br />
                  <span className="italic font-normal text-amber-200">is waiting.</span>
                </h2>
                <p className="mt-4 text-stone-300 text-base leading-relaxed max-w-md">
                  {isSignUp
                    ? 'Register your name, age, gender, Oroquieta City school, and School ID / Valid ID / COR. Boarding houses near your school will show up automatically.'
                    : 'Sign in with your email and password to view Oroquieta City rooms near your campus and manage your bookings.'}
                </p>

                <div className="mt-6 space-y-4 max-w-md">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-1" />
                    <span className="text-base font-medium text-stone-200">
                      Automatic room listings near your Oroquieta City school
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-1" />
                    <span className="text-base font-medium text-stone-200">
                      School ID / Valid ID / COR verification keeps dorms safe
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-[#e05d26] shrink-0 mt-1" />
                    <span className="text-base font-medium text-stone-200">
                      Watch owner videos, inspect 360° tours &amp; reserve your unit
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: White Card Form */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-stone-900 shadow-2xl border border-stone-200/80">
              <span className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">
                {isSignUp
                  ? role === 'renter'
                    ? 'STUDENT AUTHORIZATION · OROQUIETA CITY ONLY'
                    : 'OWNER VERIFICATION · VALID ID REQUIRED'
                  : 'WELCOME BACK'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 font-serif">
                {role === 'owner'
                  ? isSignUp
                    ? 'Create owner account'
                    : 'Owner log in'
                  : isSignUp
                  ? 'Create student account'
                  : 'Renter log in'}
              </h3>

              <p className="text-sm text-stone-500 mt-1.5 mb-5">
                {role === 'owner'
                  ? isSignUp
                    ? 'Verify your identity with a Philippine Valid ID to start listing rooms.'
                    : 'Log in to manage your Oroquieta City boarding house listings.'
                  : isSignUp
                  ? 'Verify your student details & school in Oroquieta City to see rooms near campus.'
                  : 'Log in to continue your Oroquieta City room search.'}
              </p>

              <form onSubmit={handleSubmitCredentials} className="space-y-4">
                {isSignUp && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'owner' ? 'e.g. Remedios Santos' : 'e.g. Juan Dela Cruz'}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] focus:ring-1 focus:ring-[#e05d26] text-base text-stone-900"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          min={role === 'owner' ? 18 : 14}
                          max={100}
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder={role === 'owner' ? 'e.g. 32' : 'e.g. 19'}
                          className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] text-base text-stone-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) =>
                            setGender(
                              e.target.value as 'Female' | 'Male' | 'Prefer not to say'
                            )
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] text-base text-stone-900"
                          required
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {role === 'renter' && (
                      <div>
                        <label className="flex items-center gap-1.5 text-sm font-bold text-stone-700 mb-1">
                          <GraduationCap className="w-4 h-4 text-[#e05d26]" />
                          <span>School (Oroquieta City Only)</span>
                        </label>
                        <select
                          value={studentSchool}
                          onChange={(e) => setStudentSchool(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] text-sm sm:text-base font-medium text-stone-900"
                          required
                        >
                          {OROQUIETA_CITY_SCHOOLS.map((school) => (
                            <option key={school.id} value={school.name}>
                              {school.name} ({school.barangay})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] focus:ring-1 focus:ring-[#e05d26] text-base text-stone-900"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold text-stone-700">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:outline-none focus:border-[#e05d26] focus:ring-1 focus:ring-[#e05d26] text-base text-stone-900 pr-11"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Required Student Verification Upload ONLY during Student Sign Up */}
                {role === 'renter' && isSignUp && (
                  <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm">
                      <IdCard className="w-4 h-4 text-[#e05d26] shrink-0" />
                      <span>
                        School ID / Valid ID or Certificate of Enrollment (Required)
                      </span>
                    </div>
                    <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-dashed border-orange-400 hover:border-[#e05d26] text-xs sm:text-sm font-bold text-[#c94f1c] cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span className="truncate">
                        {isProcessingDoc
                          ? 'Processing photo...'
                          : studentDocName
                          ? `Uploaded: ${studentDocName}`
                          : 'Upload School ID / Valid ID / COR'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStudentDocChange}
                        className="hidden"
                      />
                    </label>
                    {studentDocUrl && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <img
                          src={studentDocUrl}
                          alt="Student ID or COR preview"
                          className="w-14 h-10 rounded-lg object-cover border border-orange-300"
                        />
                        <span className="text-xs font-semibold text-emerald-700">
                          ✓ Student ID / COR ready for verification
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Required Owner Philippine Valid ID ONLY during Owner Sign Up */}
                {role === 'owner' && isSignUp && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Accepted Philippine Valid ID (Required for Sign Up)</span>
                    </div>
                    <select
                      value={ownerIdType}
                      onChange={(e) => setOwnerIdType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm font-semibold text-stone-800"
                    >
                      {PHILIPPINE_VALID_IDS.map((idOption) => (
                        <option key={idOption} value={idOption}>
                          {idOption}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-dashed border-emerald-400 hover:border-emerald-600 text-xs sm:text-sm font-bold text-emerald-800 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span className="truncate">
                        {isProcessingDoc
                          ? 'Processing photo...'
                          : ownerDocName
                          ? `Attached: ${ownerDocName}`
                          : 'Upload Valid ID Photo (Required)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleOwnerDocChange}
                        className="hidden"
                      />
                    </label>
                    {ownerDocUrl && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <img
                          src={ownerDocUrl}
                          alt="Owner Valid ID preview"
                          className="w-14 h-10 rounded-lg object-cover border border-emerald-300"
                        />
                        <span className="text-xs font-semibold text-emerald-700">
                          ✓ Valid ID attached for owner verification
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {statusMessage && (
                  <p className="text-sm font-medium text-[#e05d26]">{statusMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isProcessingDoc}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] disabled:opacity-50 text-white font-bold text-base tracking-wide shadow-md shadow-[#e05d26]/20 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>
                    {role === 'owner'
                      ? isSignUp
                        ? 'Create Account & Go to Owner Dashboard'
                        : 'Log in'
                      : isSignUp
                      ? 'Create Account & Show Rooms Near My School'
                      : 'Log in'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="pt-3 border-t border-stone-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setStatusMessage(null);
                      if (!isSignUp && role === 'owner' && age === '19') {
                        setAge('30');
                      }
                    }}
                    className="text-sm text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
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
                          {role === 'owner' ? 'Create an owner account' : 'Create a student account'}
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
