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
 * Theme-adaptive event lineup card.
 * Switches seamlessly between Sky-White light theme and Deep Midnight dark theme.
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
      className="glass-card glass-card-hover rounded-2xl overflow-hidden relative transition-all duration-300 group flex flex-col justify-between h-full shadow-xs"
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
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold btn-primary flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Highlighted</span>
            </span>
          </div>
        )}

        {/* Overview Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-base leading-6 font-black truncate">
            {overview}
          </h3>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-black dark:text-white">
        
        <div className="space-y-3">
          <p className="text-xs leading-4 sm:text-sm sm:leading-5 text-black dark:text-white opacity-90 font-semibold line-clamp-3">
            {description}
          </p>

          {/* Terms & Form Metadata */}
          {terms && (
            <div className="space-y-1 text-xs leading-4 glass-panel-subtle p-3 rounded-xl text-black dark:text-white border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-1.5 opacity-80 font-black text-[10px] uppercase text-black dark:text-white">
                <FileText className="w-3 h-3 shrink-0" />
                <span>Terms</span>
              </div>
              <p className="text-black dark:text-white opacity-90 line-clamp-2 font-medium">{terms}</p>
            </div>
          )}

          {reg_form_id && (
            <div className="flex items-center justify-between text-xs leading-4 glass-panel-subtle p-2.5 rounded-xl text-black dark:text-white border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-1.5 opacity-80 font-black text-[10px] uppercase text-black dark:text-white">
                <ClipboardList className="w-3 h-3 shrink-0" />
                <span>Form Linked</span>
              </div>
              <code className="text-[10px] font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded font-black text-black dark:text-white truncate max-w-[140px]">
                {reg_form_id}
              </code>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 dark:border-[var(--panel-border)] flex items-center justify-between gap-2">
          <button
            onClick={() => onView(event)}
            className="flex-1 py-1.5 px-3 rounded-xl text-xs leading-4 font-black btn-secondary text-black dark:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 opacity-80" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onEdit(event)}
            className="p-2 rounded-xl btn-secondary text-black dark:text-white transition-colors cursor-pointer active:scale-95 shadow-2xs"
            title="Edit Event"
            aria-label="Edit event"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(id, overview)}
            className="p-2 rounded-xl btn-secondary text-black dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer active:scale-95 shadow-2xs"
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
