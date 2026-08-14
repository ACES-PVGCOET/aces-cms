import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CalendarDays, 
  Check, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  Film, 
  Image as ImageIcon 
} from 'lucide-react';
import { TEAMS_LIST } from '../data/mockData';
import { isVideoMedia } from '../utils/mediaUtils';
import MediaViewer from './MediaViewer';

const AVAILABLE_ORGANIZERS = TEAMS_LIST.filter((t) => t !== 'All Teams');

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
];

/**
 * EventModal Component
 * Multi-Theme dynamic modal for scheduling and updating events.
 */
export function EventModal({ isOpen, initialEvent, onClose, onSubmit }) {
  const isEditing = Boolean(initialEvent);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '4:00 PM - 7:00 PM',
    mode: 'Offline',
    status: 'Scheduled',
    venue: 'ACES Main Innovation Hall',
    attendeesCount: 0,
    capacity: 150,
    banner: '',
    organizerTeam: 'Web Team',
    tags: 'Networking, Workshop',
    featured: false,
  });

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title || '',
        description: initialEvent.description || '',
        date: initialEvent.date || '',
        time: initialEvent.time || '',
        mode: initialEvent.mode || 'Offline',
        status: initialEvent.status || 'Scheduled',
        venue: initialEvent.venue || '',
        attendeesCount: initialEvent.attendeesCount || 0,
        capacity: initialEvent.capacity || 100,
        banner: initialEvent.banner || '',
        organizerTeam: initialEvent.organizerTeam || 'Web Team',
        tags: Array.isArray(initialEvent.tags) ? initialEvent.tags.join(', ') : '',
        featured: Boolean(initialEvent.featured),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '4:30 PM - 7:30 PM',
        mode: 'Offline',
        status: 'Scheduled',
        venue: 'ACES Main Innovation Hall',
        attendeesCount: 0,
        capacity: 120,
        banner: '',
        organizerTeam: 'Web Team',
        tags: 'Workshop, Guild Meeting',
        featured: false,
      });
    }
    setErrors({});
    setShowUrlInput(false);
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = 'Event title is required';
    if (!formData.description.trim()) nextErrors.description = 'Description is required';
    if (!formData.date) nextErrors.date = 'Date is required';
    if (!formData.venue.trim()) nextErrors.venue = 'Venue/Link is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleMediaFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, banner: 'File size must be under 25MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, banner: event.target?.result }));
      setErrors((prev) => ({ ...prev, banner: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      time: formData.time.trim() || '4:00 PM - 7:00 PM',
      mode: formData.mode,
      status: formData.status,
      venue: formData.venue.trim(),
      banner: formData.banner || PRESET_BANNERS[0],
      organizerTeam: formData.organizerTeam,
      featured: formData.featured,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      capacity: Number(formData.capacity) || 100,
      attendeesCount: Number(formData.attendeesCount) || 0,
    };

    onSubmit(payload);
  };

  const isCurrentVideo = isVideoMedia(formData.banner);

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
                {isEditing ? 'Update Scheduled Event' : 'Schedule New Event'}
              </h2>
              <p className="text-xs leading-4 opacity-70 font-medium">
                {isEditing ? 'Modify schedule and capacity metrics' : 'Broadcast a new workshop, hackathon, or mixer'}
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
          
          {/* Event Title */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dino's Leaf Party & Tech Mixer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                errors.title ? 'border-rose-500 ring-1 ring-rose-500' : ''
              }`}
            />
            {errors.title && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs leading-4 font-bold opacity-80">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Comprehensive summary of keynote, agenda, target attendees..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : ''
              }`}
            />
            {errors.description && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.description}</p>}
          </div>

          {/* Date, Time, Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg focus:outline-none font-medium ${
                  errors.date ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.date && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.date}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Time Interval
              </label>
              <input
                type="text"
                placeholder="4:00 PM - 7:00 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg focus:outline-none font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Delivery Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg font-bold focus:outline-none cursor-pointer"
              >
                <option value="Offline">Offline (Campus)</option>
                <option value="Online">Online (Discord/Meet)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Status & Organizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Event Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg font-bold focus:outline-none cursor-pointer"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live Now</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Host Guild / Department
              </label>
              <select
                value={formData.organizerTeam}
                onChange={(e) => setFormData({ ...formData, organizerTeam: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg font-bold focus:outline-none cursor-pointer"
              >
                {AVAILABLE_ORGANIZERS.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Venue Location / Stream Link <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Auditorium West / meet.google.com/xyz"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className={`w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium ${
                  errors.venue ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
              {errors.venue && <p className="text-xs leading-4 text-rose-500 font-bold">{errors.venue}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Max Capacity
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* Media / Banner Dropzone */}
          <div className="space-y-3 p-4 rounded-xl glass-panel-subtle">
            <div className="flex items-center justify-between">
              <label className="block text-xs leading-4 font-bold uppercase tracking-wider opacity-80">
                Event Banner & Media
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
                src={formData.banner}
                alt="Event cover preview"
                className="w-full h-full object-cover"
                showVideoBadge={true}
                controls={isCurrentVideo}
              />

              {formData.banner && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, banner: '' })}
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold btn-secondary cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Media</span>
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
                  placeholder="https://example.com/banner.mp4 or https://..."
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
            )}

            {errors.banner && (
              <p className="text-xs leading-4 text-rose-500 font-bold">{errors.banner}</p>
            )}

            {/* Presets */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold opacity-60">Presets:</span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {PRESET_BANNERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, banner: preset })}
                    className={`w-14 h-8 rounded-lg overflow-hidden border shrink-0 transition-transform hover:scale-105 cursor-pointer ${
                      formData.banner === preset ? 'ring-2 ring-indigo-500 border-transparent' : 'border-white/20'
                    }`}
                  >
                    <img src={preset} alt={`banner ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags & Featured */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="space-y-1">
              <label className="block text-xs leading-4 font-bold opacity-80">
                Tags <span className="opacity-60 font-medium">(Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. React, Hackathon, Networking"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full text-sm leading-5 glass-input px-3 py-2 rounded-lg placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-white/20"
              />
              <span className="text-xs leading-4 font-bold opacity-90">
                Pin as "Spotlight Session" on Dashboard Launchpad
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
              <span>{isEditing ? 'Save Event Changes' : 'Schedule Event'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default EventModal;
