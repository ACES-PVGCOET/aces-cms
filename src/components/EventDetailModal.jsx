import { 
  X, 
  Edit3, 
  Trash2,
  FileText,
  ClipboardList,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import MediaViewer from './MediaViewer';

/**
 * EventDetailModal Component
 * Strictly adheres to backend Event API model (overview, description, terms, reg_form_id, banner_url, isHighlight).
 */
export function EventDetailModal({ event, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !event) return null;

  const {
    id,
    overview = '',
    description = '',
    terms = '',
    reg_form_id = null,
    banner_url = '',
    isHighlight = false,
    reg_st_dt,
    reg_end_dt
  } = event;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Banner Header with Highlight Badge */}
        <div className="h-52 relative overflow-hidden bg-black/40">
          <MediaViewer
            src={banner_url}
            alt={overview}
            className="w-full h-full object-cover"
            showVideoBadge={true}
            controls={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white z-10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
            {isHighlight && (
              <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold bg-amber-500 text-black shadow-sm inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Highlighted Event</span>
              </span>
            )}
            <h2 className="text-xl leading-7 font-black truncate">
              {overview}
            </h2>
          </div>
        </div>

        {/* Content Body strictly per API Model */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-xs leading-4 font-extrabold uppercase tracking-wider opacity-60">Description</h3>
            <p className="text-xs leading-4 sm:text-sm sm:leading-5 opacity-90 font-medium whitespace-pre-wrap">
              {description}
            </p>
          </div>

          {/* Terms */}
          {terms && (
            <div className="p-3.5 rounded-xl glass-panel-subtle space-y-1.5 text-xs leading-4">
              <div className="flex items-center gap-1.5 opacity-80 font-bold text-[10px] uppercase text-amber-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Terms & Conditions</span>
              </div>
              <p className="opacity-90 font-medium whitespace-pre-wrap">{terms}</p>
            </div>
          )}

          {/* Registration Dates */}
          {(reg_st_dt || reg_end_dt) && (
            <div className="p-3.5 rounded-xl glass-panel-subtle space-y-1.5 text-xs leading-4">
              <div className="flex items-center gap-1.5 opacity-80 font-bold text-[10px] uppercase text-indigo-400">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Registration Timeline</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium">
                <div>
                  <span className="opacity-60 text-[10px] block">Starts:</span>
                  <span>{reg_st_dt ? new Date(reg_st_dt).toLocaleString() : 'Not specified'}</span>
                </div>
                <div>
                  <span className="opacity-60 text-[10px] block">Ends:</span>
                  <span>{reg_end_dt ? new Date(reg_end_dt).toLocaleString() : 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form ID */}
          {reg_form_id && (
            <div className="p-3.5 rounded-xl glass-panel-subtle flex items-center justify-between text-xs leading-4">
              <div className="flex items-center gap-1.5 opacity-80 font-bold">
                <ClipboardList className="w-3.5 h-3.5 opacity-80 text-indigo-400" />
                <span>Registration Form ID</span>
              </div>
              <code className="text-[11px] font-mono bg-black/20 px-2 py-1 rounded text-indigo-400 font-bold select-all">
                {reg_form_id}
              </code>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            {/* Delete Action */}
            {onDelete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(id, overview);
                }}
                className="px-3 py-2 rounded-lg text-xs leading-4 font-bold text-rose-400 hover:text-white hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Delete Event"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Event</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
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
    </div>
  );
}

export default EventDetailModal;


