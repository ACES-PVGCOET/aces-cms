import { 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles,
  FileText,
  ClipboardList
} from 'lucide-react';
import MediaViewer from './MediaViewer';

/**
 * EventCard Component
 * Multi-Theme dynamic event lineup card.
 * Strictly adheres to backend Event API model (overview, description, terms, reg_form_id, banner_url, isHighlight).
 */
export function EventCard({ event, onView, onEdit, onDelete }) {
  const {
    id,
    overview = '',
    description = '',
    terms = '',
    reg_form_id = null,
    banner_url = '',
    isHighlight = false,
  } = event;

  return (
    <div
      className="glass-card glass-card-hover rounded-2xl overflow-hidden relative transition-all duration-300 group flex flex-col justify-between h-full"
      role="article"
      aria-label={`Event card: ${overview}`}
    >
      {/* Top Banner Media */}
      <div className="relative h-44 overflow-hidden bg-black/40">
        <MediaViewer
          src={banner_url}
          alt={overview}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          showVideoBadge={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Highlight Tag */}
        {isHighlight && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold btn-primary flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Highlighted</span>
            </span>
          </div>
        )}

        {/* Overview Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-base leading-6 font-black truncate mt-0.5">
            {overview}
          </h3>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-3">
          <p className="text-xs leading-4 sm:text-sm sm:leading-5 opacity-80 line-clamp-3 font-medium">
            {description}
          </p>

          {/* Terms & Form Metadata strictly as per API */}
          {terms && (
            <div className="space-y-1 text-xs leading-4 glass-panel-subtle p-3 rounded-xl">
              <div className="flex items-center gap-1.5 opacity-70 font-bold text-[10px] uppercase">
                <FileText className="w-3 h-3 shrink-0" />
                <span>Terms</span>
              </div>
              <p className="opacity-80 line-clamp-2 font-medium">{terms}</p>
            </div>
          )}

          {reg_form_id && (
            <div className="flex items-center justify-between text-xs leading-4 glass-panel-subtle p-2.5 rounded-xl">
              <div className="flex items-center gap-1.5 opacity-70 font-bold text-[10px] uppercase">
                <ClipboardList className="w-3 h-3 shrink-0" />
                <span>Form Linked</span>
              </div>
              <code className="text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded text-indigo-400 font-bold truncate max-w-[140px]">
                {reg_form_id}
              </code>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
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
            onClick={() => onDelete(id, overview)}
            className="p-2 rounded-lg btn-secondary hover:text-rose-500 transition-colors cursor-pointer"
            title="Delete Event"
            aria-label="Delete event"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}

export default EventCard;

