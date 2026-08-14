import { 
  X, 
  Calendar, 
  MapPin, 
  Edit3, 
  Users 
} from 'lucide-react';
import MediaViewer from './MediaViewer';

/**
 * EventDetailModal Component
 * Multi-Theme dynamic event detail view modal.
 */
export function EventDetailModal({ event, isOpen, onClose, onEdit }) {
  if (!isOpen || !event) return null;

  const {
    title,
    description,
    date,
    time,
    mode,
    status,
    venue,
    attendeesCount = 0,
    capacity = 100,
    banner,
    organizerTeam,
    tags = [],
    featured = false,
  } = event;

  const rsvpPercentage = Math.min(100, Math.round((attendeesCount / capacity) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Banner with Badges */}
        <div className="h-48 relative overflow-hidden bg-black/40">
          <MediaViewer
            src={banner}
            alt={title}
            className="w-full h-full object-cover"
            showVideoBadge={true}
            controls={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary shadow-sm">
                {status}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs leading-4 font-bold btn-secondary">
                {mode}
              </span>
              {featured && (
                <span className="px-2 py-0.5 rounded-md text-xs leading-4 font-bold bg-amber-500 text-black shadow-sm">
                  Spotlight
                </span>
              )}
            </div>
            <h2 className="text-xl leading-7 font-black truncate mt-1">
              {title}
            </h2>
            <div className="text-xs leading-4 opacity-80 mt-0.5 font-bold">
              Organized by {organizerTeam || 'ACES Central'}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          <p className="text-xs leading-4 sm:text-sm sm:leading-5 opacity-80 font-medium">
            {description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-4">
            <div className="p-3 rounded-xl glass-panel-subtle space-y-0.5">
              <div className="flex items-center gap-1.5 opacity-60 font-bold text-[10px] uppercase">
                <Calendar className="w-3.5 h-3.5 opacity-80" />
                <span>Date & Time</span>
              </div>
              <div className="font-extrabold">
                {date} ({time})
              </div>
            </div>

            <div className="p-3 rounded-xl glass-panel-subtle space-y-0.5">
              <div className="flex items-center gap-1.5 opacity-60 font-bold text-[10px] uppercase">
                <MapPin className="w-3.5 h-3.5 opacity-80" />
                <span>Venue Location</span>
              </div>
              <div className="font-extrabold truncate">
                {venue}
              </div>
            </div>
          </div>

          {/* Attendance Capacity */}
          <div className="space-y-2 p-3 rounded-xl glass-panel-subtle">
            <div className="flex items-center justify-between text-xs leading-4">
              <div className="flex items-center gap-1.5 font-bold">
                <Users className="w-3.5 h-3.5 opacity-80" />
                <span>RSVP Capacity Metrics</span>
              </div>
              <span className="font-extrabold">
                {attendeesCount} / {capacity} ({rsvpPercentage}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full btn-primary rounded-full transition-all duration-300"
                style={{ width: `${rsvpPercentage}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold btn-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-secondary cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(event);
              }}
              className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Event</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default EventDetailModal;
