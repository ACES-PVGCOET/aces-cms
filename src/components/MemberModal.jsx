import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Check, 
  Upload, 
  Trash2, 
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import { TEAMS_LIST } from '../data/mockData';

const AVAILABLE_TEAMS = TEAMS_LIST.filter((t) => t !== 'All Teams');

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
];

/**
 * MemberModal Component
 * Multi-Theme dynamic modal for member creation and editing.
 */
export function MemberModal({ isOpen, initialMember, onClose, onSubmit }) {
  const isEditing = Boolean(initialMember);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    position: 'Member',
    email: '',
    team: 'Web Team',
    status: 'ACTIVE',
    profile_photo_url: '',
    instagram: '',
    linkedin: '',
    github: '',
  });

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialMember) {
      setFormData({
        name: initialMember.name || '',
        position: initialMember.position || initialMember.role || 'Member',
        email: initialMember.email || '',
        team: initialMember.team || 'Web Team',
        status: initialMember.status || 'ACTIVE',
        profile_photo_url: initialMember.profile_photo_url || initialMember.avatar || '',
        instagram: initialMember.social_links?.instagram || initialMember.socials?.instagram || '',
        linkedin: initialMember.social_links?.linkedin || initialMember.socials?.linkedin || '',
        github: initialMember.social_links?.github || initialMember.socials?.github || '',
      });
    } else {
      setFormData({
        name: '',
        position: 'Member',
        email: '',
        team: 'Web Team',
        status: 'ACTIVE',
        profile_photo_url: '',
        instagram: '',
        linkedin: '',
        github: '',
      });
    }
    setErrors({});
    setShowUrlInput(false);
    setIsUploading(false);
  }, [initialMember, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Full name is required';
    if (!formData.position.trim()) nextErrors.position = 'Position is required';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profile_photo_url: 'File size must be under 10MB' }));
      return;
    }

    try {
      setIsUploading(true);
      setErrors((prev) => ({ ...prev, profile_photo_url: '' }));
      const cdnUrl = await uploadToCloudinary(file, 'profile_photos', 'image');
      setFormData((prev) => ({ ...prev, profile_photo_url: cdnUrl }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, profile_photo_url: err.message || 'Failed to upload photo to Cloudinary' }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      position: formData.position.trim(),
      email: formData.email.trim(),
      team: formData.team,
      status: formData.status,
      profile_photo_url: formData.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name.trim())}`,
      social_links: {
        instagram: formData.instagram.trim(),
        linkedin: formData.linkedin.trim(),
        github: formData.github.trim(),
      },
    };

    onSubmit(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
    >
      <div className="acrylic-dialog w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between glass-panel-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 id="member-modal-title" className="text-base leading-6 font-extrabold">
                {isEditing ? 'Update Member Profile' : 'Enroll New Member'}
              </h2>
              <p className="text-xs leading-4 opacity-70 font-medium">
                {isEditing ? 'Modify guild credentials & status' : 'Register a new member to ACES database'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Avatar Section */}
          <div className="space-y-3 p-4 rounded-xl glass-panel-subtle">
            <div className="flex items-center justify-between">
              <label className="block text-xs leading-4 font-bold uppercase tracking-wider opacity-80">
                Profile Photo
              </label>
              <span className="text-[10px] font-bold btn-secondary px-2 py-0.5 rounded">
                JPG or PNG
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="hidden"
              id="member-photo-upload"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={
                    formData.profile_photo_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      formData.name || 'Member'
                    )}`
                  }
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/20 bg-black/20"
                />
                {formData.profile_photo_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profile_photo_url: '' })}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm hover:bg-rose-600 cursor-pointer"
                    title="Remove Photo"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showUrlInput ? 'Hide URL' : 'Or Paste URL'}</span>
                  </button>
                </div>

                <p className="text-[11px] leading-4 opacity-60 font-medium">
                  Select a JPG or PNG file (Square aspect ratio, under 5MB).
                </p>
              </div>
            </div>

            {showUrlInput && (
              <div className="pt-2">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.profile_photo_url}
                  onChange={(e) => setFormData({ ...formData, profile_photo_url: e.target.value })}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
            )}

            {errors.profile_photo_url && (
              <p className="text-xs leading-4 text-rose-500 font-bold">{errors.profile_photo_url}</p>
            )}

            {/* Presets */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold opacity-60">Or preset:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, profile_photo_url: preset })}
                    className={`w-7 h-7 rounded-lg overflow-hidden border transition-transform hover:scale-105 shrink-0 cursor-pointer ${
                      formData.profile_photo_url === preset
                        ? 'ring-2 ring-indigo-500 border-transparent'
                        : 'border-white/20'
                    }`}
                  >
                    <img src={preset} alt={`preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name & Position Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Diya Patel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                  errors.name ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.name && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Position <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Head, Joint Head, Member, General Secretary"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                  errors.position ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.position && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.position}</p>}
            </div>
          </div>

          {/* Email & Team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="name@acesclub.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                  errors.email ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.email && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Team Affiliation <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg font-bold focus:outline-none cursor-pointer"
              >
                {AVAILABLE_TEAMS.map((teamName) => (
                  <option key={teamName} value={teamName}>
                    {teamName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Account Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg font-bold focus:outline-none cursor-pointer"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="NOT_ACTIVE">NOT_ACTIVE</option>
            </select>
          </div>

          {/* Social Links */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs leading-4 font-bold uppercase tracking-wider opacity-80">
              Social Links
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold opacity-80">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                  <span>Instagram</span>
                </div>
                <input
                  type="text"
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full text-xs leading-4 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold opacity-80">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>LinkedIn</span>
                </div>
                <input
                  type="text"
                  placeholder="linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full text-xs leading-4 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold opacity-80">
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </div>
                <input
                  type="text"
                  placeholder="github.com/..."
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full text-xs leading-4 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Enroll Member'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default MemberModal;
