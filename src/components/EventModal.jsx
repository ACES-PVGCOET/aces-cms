import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CalendarDays, 
  Check, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  Film, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';
import { isVideoMedia } from '../utils/mediaUtils';
import MediaViewer from './MediaViewer';

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
];

/**
 * EventModal Component
 * Strictly manages fields according to backend Event API model:
 * overview, description, terms, reg_form_id, banner_url, isHighlight.
 */
export function EventModal({ isOpen, initialEvent, onClose, onSubmit }) {
  const isEditing = Boolean(initialEvent);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    overview: '',
    description: '',
    terms: '',
    reg_form_id: '',
    reg_st_dt: '',
    reg_end_dt: '',
    banner_url: '',
    isHighlight: false,
  });

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        overview: initialEvent.overview || initialEvent.title || '',
        description: initialEvent.description || '',
        terms: initialEvent.terms || '',
        reg_form_id: initialEvent.reg_form_id || '',
        reg_st_dt: initialEvent.reg_st_dt ? new Date(initialEvent.reg_st_dt).toISOString().slice(0, 16) : '',
        reg_end_dt: initialEvent.reg_end_dt ? new Date(initialEvent.reg_end_dt).toISOString().slice(0, 16) : '',
        banner_url: initialEvent.banner_url || initialEvent.banner || '',
        isHighlight: Boolean(initialEvent.isHighlight !== undefined ? initialEvent.isHighlight : initialEvent.featured),
      });
    } else {
      setFormData({
        overview: '',
        description: '',
        terms: 'All attendees must present valid student ID. Code of Conduct applies.',
        reg_form_id: '',
        reg_st_dt: '',
        reg_end_dt: '',
        banner_url: '',
        isHighlight: false,
      });
    }
    setErrors({});
    setShowUrlInput(false);
    setIsUploading(false);
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};
    if (!formData.overview.trim()) nextErrors.overview = 'Event overview is required';
    if (!formData.description.trim()) nextErrors.description = 'Event description is required';
    if (!formData.terms.trim()) nextErrors.terms = 'Event terms & conditions are required';
    if (formData.reg_st_dt && formData.reg_end_dt && new Date(formData.reg_end_dt) < new Date(formData.reg_st_dt)) {
      nextErrors.reg_end_dt = 'Registration end date cannot be earlier than start date';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleMediaFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, banner_url: 'File size must be under 25MB' }));
      return;
    }

    const isVideo = file.type.startsWith('video/');
    try {
      setIsUploading(true);
      setErrors((prev) => ({ ...prev, banner_url: '' }));
      const cdnUrl = await uploadToCloudinary(file, 'events', isVideo ? 'video' : 'image');
      setFormData((prev) => ({ ...prev, banner_url: cdnUrl }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, banner_url: err.message || 'Failed to upload image to Cloudinary' }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      overview: formData.overview.trim(),
      description: formData.description.trim(),
      terms: formData.terms.trim(),
      reg_form_id: formData.reg_form_id.trim() || null,
      reg_st_dt: formData.reg_st_dt ? new Date(formData.reg_st_dt).toISOString() : null,
      reg_end_dt: formData.reg_end_dt ? new Date(formData.reg_end_dt).toISOString() : null,
      banner_url: formData.banner_url.trim() || PRESET_BANNERS[0],
      isHighlight: Boolean(formData.isHighlight),
    };

    onSubmit(payload);
  };

  const isCurrentVideo = isVideoMedia(formData.banner_url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div className="acrylic-dialog w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between glass-panel-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h2 id="event-modal-title" className="text-base leading-6 font-extrabold">
                {isEditing ? 'Update Event (API Schema)' : 'Create Event (API Schema)'}
              </h2>
              <p className="text-xs leading-4 opacity-70 font-medium">
                Manage overview, description, terms, form reference, and banner URL
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
          
          {/* Overview */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Overview (Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ACES Flagship Hackathon 2026"
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                errors.overview ? 'border-rose-500 ring-1 ring-rose-500' : ''
              }`}
            />
            {errors.overview && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.overview}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Full detailed event description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : ''
              }`}
            />
            {errors.description && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.description}</p>}
          </div>

          {/* Terms */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Terms & Conditions <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Event participation rules, prerequisites, code of conduct..."
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                errors.terms ? 'border-rose-500 ring-1 ring-rose-500' : ''
              }`}
            />
            {errors.terms && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.terms}</p>}
          </div>

          {/* Registration Form ID */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Registration Form ID <span className="opacity-60 font-medium">(Optional MongoDB Form ID)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 66bf43a1290f111000000001"
              value={formData.reg_form_id}
              onChange={(e) => setFormData({ ...formData, reg_form_id: e.target.value })}
              className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-mono"
            />
          </div>

          {/* Registration Start & End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Registration Start Date <span className="opacity-60 font-medium">(reg_st_dt)</span>
              </label>
              <input
                type="datetime-local"
                value={formData.reg_st_dt}
                onChange={(e) => setFormData({ ...formData, reg_st_dt: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Registration End Date <span className="opacity-60 font-medium">(reg_end_dt)</span>
              </label>
              <input
                type="datetime-local"
                value={formData.reg_end_dt}
                onChange={(e) => setFormData({ ...formData, reg_end_dt: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                  errors.reg_end_dt ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.reg_end_dt && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.reg_end_dt}</p>}
            </div>
          </div>

          {/* Media / Banner Dropzone */}
          <div className="space-y-3 p-4 rounded-xl glass-panel-subtle">
            <div className="flex items-center justify-between">
              <label className="block text-xs leading-4 font-bold uppercase tracking-wider opacity-80">
                Banner URL (Media)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold btn-secondary px-2 py-0.5 rounded flex items-center gap-1">
                  <ImageIcon className="w-2.5 h-2.5" />
                  <span>Images</span>
                </span>
                <span className="text-[10px] font-bold btn-secondary px-2 py-0.5 rounded flex items-center gap-1">
                  <Film className="w-2.5 h-2.5" />
                  <span>Videos</span>
                </span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*, video/*"
              onChange={handleMediaFileChange}
              className="hidden"
              id="event-banner-upload"
            />

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video max-h-44 w-full flex items-center justify-center group">
              <MediaViewer
                src={formData.banner_url}
                alt="Event cover preview"
                className="w-full h-full object-cover"
                showVideoBadge={true}
                controls={isCurrentVideo}
              />

              {formData.banner_url && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, banner_url: '' })}
                  className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 cursor-pointer"
                  title="Remove media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Media</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{showUrlInput ? 'Hide URL' : 'Or URL'}</span>
                </button>
              </div>

              <span className="text-[11px] leading-4 opacity-60 font-medium">
                JPG, PNG, MP4, WebM (Max 25MB)
              </span>
            </div>

            {showUrlInput && (
              <div className="pt-1">
                <input
                  type="url"
                  placeholder="https://example.com/banner.jpg"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
            )}

            {errors.banner_url && (
              <p className="text-xs leading-4 text-rose-500 font-bold">{errors.banner_url}</p>
            )}

            {/* Presets */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold opacity-60">Presets:</span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {PRESET_BANNERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, banner_url: preset })}
                    className={`w-14 h-8 rounded-lg overflow-hidden border shrink-0 transition-transform hover:scale-105 cursor-pointer ${
                      formData.banner_url === preset ? 'ring-2 ring-indigo-500 border-transparent' : 'border-white/20'
                    }`}
                  >
                    <img src={preset} alt={`banner ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Highlight Toggle */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isHighlight}
                onChange={(e) => setFormData({ ...formData, isHighlight: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20"
              />
              <span className="text-xs leading-4 font-bold opacity-90">
                Mark as Highlighted Event (Featured on homepage showcase, max 4)
              </span>
            </label>
          </div>

          {/* Actions */}
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
              <span>{isEditing ? 'Save Event Changes' : 'Create Event'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default EventModal;

