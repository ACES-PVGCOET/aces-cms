import { 
  Calendar, 
  Clock, 
  MapPin, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Radio 
} from 'lucide-react';
import MediaViewer from './MediaViewer';

/**
 * EventCard Component
 * Multi-Theme dynamic event lineup card.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm.
 */
export function EventCard({ event, onView, onEdit, onDelete }) {
  const {
    id,
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
      className="glass-card glass-card-hover rounded-2xl overflow-hidden relative transition-all duration-300 group flex flex-col justify-between h-full"
      role="article"
      aria-label={`Event card: ${title}`}
    >
      {/* Top Banner Media */}
      <div className="relative h-40 overflow-hidden bg-black/40">
        <MediaViewer
          src={banner}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          showVideoBadge={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Badges Over Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-extrabold btn-primary shadow-xs"
          >
            {status === 'Live' && <Radio className="w-3 h-3 inline mr-1 animate-spin" />}
            {status}
          </span>
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-extrabold btn-secondary"
          >
            {mode}
          </span>
        </div>

        {/* Featured Tag */}
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold btn-primary flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Spotlight</span>
            </span>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
            {organizerTeam || 'ACES Guild'}
          </div>
          <h3 className="text-base leading-6 font-black truncate mt-0.5">
            {title}
          </h3>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-3">
          <p className="text-xs leading-4 sm:text-sm sm:leading-5 opacity-80 line-clamp-2 font-medium">
            {description}
          </p>

          {/* Timestamps & Venue */}
          <div className="space-y-1 text-xs leading-4 glass-panel-subtle p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 opacity-80 shrink-0" />
              <span className="font-bold">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 opacity-60 shrink-0" />
              <span className="opacity-80 font-medium">{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 opacity-60 shrink-0" />
              <span className="truncate opacity-80 font-medium">{venue}</span>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-bold btn-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RSVP Progress Bar & Actions */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          
          {/* Capacity Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs leading-4">
              <span className="opacity-70 font-semibold">Registrations</span>
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

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              onClick={() => onView(event)}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs leading-4 font-bold btn-secondary flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
            >
              <Eye className="w-3.5 h-3.5 opacity-80" />
              <span>Details</span>
            </button>

            <button
              onClick={() => onEdit(event)}
              className="p-2 rounded-lg btn-secondary transition-colors cursor-pointer"
              title="Edit Event"
              aria-label="Edit event"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(id, title)}
              className="p-2 rounded-lg btn-secondary hover:text-rose-500 transition-colors cursor-pointer"
              title="Delete Event"
              aria-label="Delete event"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default EventCard;
