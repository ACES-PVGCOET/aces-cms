import { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  Layers, 
  Briefcase, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  X,
  Send,
  Upload,
  Loader2
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';

const TEAMS = [
  'Web Team',
  'Design Team',
  'Event Team',
  'Editorial Team',
  'Production Team',
  'Technical Team',
  'Media Team',
  'Marketing Team',
  'Treasury Team',
  'Leaders',
  'Faculty'
];

const POSITIONS = [
  'Member',
  'Head',
  'Joint Head',
  'General Secretary',
  'Joint General Secretary',
  'Faculty',
];

export function RegisterMemberModal({ isOpen, onClose, onRegister, onStartOnboarding, currentUser = null }) {
  const fileInputRef = useRef(null);
  const isTeamAdmin = currentUser?.roles?.includes('team_admin') && !currentUser?.roles?.includes('admin');
  const defaultTeam = (isTeamAdmin && currentUser?.team) ? currentUser.team : 'Web Team';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [team, setTeam] = useState(defaultTeam);
  const [position, setPosition] = useState('Member');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Registration Result state
  const [createdResult, setCreatedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setName('');
      setTeam(defaultTeam);
      setPosition('Member');
      setPhotoUrl('');
      setError('');
      setCreatedResult(null);
      setCopied(false);
      setIsUploading(false);
    }
  }, [isOpen, defaultTeam]);

  if (!isOpen) return null;

  const handlePhotoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Selected photo must be under 10MB.');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      const cdnUrl = await uploadToCloudinary(file, 'profile_photos', 'image');
      setPhotoUrl(cdnUrl);
    } catch (err) {
      setError(err.message || 'Failed to upload photo to Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const result = await onRegister({
        email: email.trim(),
        name: name.trim(),
        team,
        position,
        profile_photo_url: photoUrl.trim(),
      });
      setCreatedResult(result);
    } catch (err) {
      setError(err.message || 'Failed to register new member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (createdResult?.onboardingUrl) {
      navigator.clipboard.writeText(createdResult.onboardingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTestOnboard = () => {
    if (createdResult?.onboardingToken) {
      const token = createdResult.onboardingToken;
      onClose();
      if (onStartOnboarding) {
        onStartOnboarding(token);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg acrylic-dialog rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Registration Form */}
        {!createdResult ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/40">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Register New Member</h3>
                <p className="text-xs opacity-70 font-medium mt-0.5">
                  Admin privilege — Generates member onboarding activation link
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Member Email */}
              <div>
                <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Member Email Address <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. member@acesclub.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold mb-1.5 opacity-80">
                  Full Name (Optional - Member can also set during onboarding)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              {/* Team & Position Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Assigned Guild / Team</span>
                  </label>
                  <select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    disabled={isTeamAdmin}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none bg-slate-900/80 text-white disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {TEAMS.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>Position / Role</span>
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none bg-slate-900/80 text-white"
                  >
                    {POSITIONS.map((p) => (
                      <option key={p} value={p} className="bg-slate-900 text-white">{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Profile Photo Upload / URL */}
              <div className="space-y-2 p-3 rounded-2xl glass-panel-subtle">
                <label className="block text-xs font-bold opacity-80 flex items-center justify-between">
                  <span>Profile Photo</span>
                  <span className="text-[10px] font-semibold text-indigo-300 opacity-80">Cloudinary Powered</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </button>

                  <input
                    type="url"
                    placeholder="Or paste Cloudinary/Image URL..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Register & Generate Link</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Step 2: Onboarding Link Generated Result */
          <div className="py-2 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-500/40">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-center">Member Registered!</h3>
            <p className="text-xs text-center opacity-70 font-medium mt-1 mb-6">
              Account created with status <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">NOT_ACTIVE</span>. Send this onboarding link to the member so they can activate their account.
            </p>

            {/* Registered Details Summary Card */}
            <div className="p-4 glass-panel-subtle rounded-2xl mb-5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="opacity-60 font-semibold">Email:</span>
                <span className="font-bold">{createdResult.member.email}</span>
              </div>
              {createdResult.member.name && (
                <div className="flex justify-between">
                  <span className="opacity-60 font-semibold">Name:</span>
                  <span className="font-bold">{createdResult.member.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="opacity-60 font-semibold">Team & Role:</span>
                <span className="font-bold text-indigo-300">
                  {createdResult.member.team} — {createdResult.member.position}
                </span>
              </div>
            </div>

            {/* Generated Link Input Box */}
            <div className="mb-6">
              <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Onboarding Activation Link</span>
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-input">
                <input
                  type="text"
                  readOnly
                  value={createdResult.onboardingUrl}
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-transparent outline-none opacity-90 truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulation & Done Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleTestOnboard}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Test Activation Now</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-primary text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default RegisterMemberModal;
