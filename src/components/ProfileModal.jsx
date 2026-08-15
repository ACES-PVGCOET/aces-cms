import { useState, useEffect } from 'react';
import { UserCheck, Mail, Layers, Briefcase, Camera, Lock, Save, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../services/api';
import { LinkedinIcon, InstagramIcon, GithubIcon } from './SocialIcons';

export function ProfileModal({ isOpen, user, isAdmin, onClose, onSaveProfile }) {
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [github, setGithub] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setPhotoUrl(user.profile_photo_url || '');
      setPhotoFile(null);
      setLinkedin(user.social_links?.linkedin || '');
      setInstagram(user.social_links?.instagram || '');
      setGithub(user.social_links?.github || '');
      setNewPassword('');
      setSuccessMsg('');
      setError('');
      setIsUploading(false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Selected photo exceeds 10MB limit.');
        return;
      }
      try {
        setIsUploading(true);
        setError('');
        const cdnUrl = await uploadToCloudinary(file, 'profile_photos', 'image');
        setPhotoUrl(cdnUrl);
        setPhotoFile(null);
      } catch (err) {
        setError(err.message || 'Failed to upload photo to Cloudinary.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMsg('');

      let payload;

      if (photoFile) {
        const formData = new FormData();
        formData.append('profile_photo', photoFile);
        formData.append('name', name.trim());
        formData.append(
          'social_links',
          JSON.stringify({
            linkedin: linkedin.trim(),
            instagram: instagram.trim(),
            github: github.trim(),
          })
        );
        if (newPassword.trim()) {
          if (newPassword.trim().length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsSubmitting(false);
            return;
          }
          formData.append('password', newPassword.trim());
        }
        payload = formData;
      } else {
        const updates = {
          name: name.trim(),
          profile_photo_url: photoUrl.trim(),
          social_links: {
            linkedin: linkedin.trim(),
            instagram: instagram.trim(),
            github: github.trim(),
          },
        };

        if (newPassword.trim()) {
          if (newPassword.trim().length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsSubmitting(false);
            return;
          }
          updates.password = newPassword.trim();
        }
        payload = updates;
      }

      await onSaveProfile(payload);
      setSuccessMsg('Your profile has been successfully updated!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl acrylic-dialog rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Avatar & Identity Summary */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/10">
          <label htmlFor="avatar-file-upload" className="relative group cursor-pointer">
            <img
              src={photoUrl || user.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 text-white flex items-center justify-center shadow transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <input
              id="avatar-file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{user.name || 'Member Profile'}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs opacity-70 font-medium mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-400 mt-1">
              <span>{user.team || 'Member Guild'}</span>
              <span>•</span>
              <span>{user.position || 'Member'}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Section: Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 opacity-80">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>Email Address (Read-only)</span>
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium opacity-60 cursor-not-allowed bg-white/5"
              />
            </div>
          </div>

          {/* Section: Read-Only Guild & Role Info (unless Admin) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>Team / Guild</span>
              </label>
              <input
                type="text"
                disabled
                value={user.team}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium opacity-70 bg-white/5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 opacity-80 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-amber-400" />
                <span>Position / Designation</span>
              </label>
              <input
                type="text"
                disabled
                value={user.position}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium opacity-70 bg-white/5"
              />
            </div>
          </div>

          {/* Profile Photo URL */}
          <div>
            <label className="block text-xs font-bold mb-1.5 opacity-80">
              Profile Photo URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Section: Social Links */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2.5">
              Social Links & Portfolios
            </h4>
            <div className="space-y-2.5">
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* Section: Password Update */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Password (Leave blank to keep existing)</span>
            </h4>
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default ProfileModal;
