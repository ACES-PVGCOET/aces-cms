import { 
  X, 
  Heart, 
  Calendar, 
  User, 
  ExternalLink 
} from 'lucide-react';

/**
 * MediaDetailModal Component
 * Classic Modern Lightbox in Sunset Rose Theme with high-contrast text.
 */
export function MediaDetailModal({ media, isOpen, onClose, onToggleLike, isLiked }) {
  if (!isOpen || !media) return null;

  const {
    id,
    type,
    title,
    category,
    src,
    videoUrl,
    thumbnail,
    author,
    date,
    likes,
    tags = [],
    description,
    duration,
  } = media;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="acrylic-dialog w-full max-w-4xl rounded-2xl shadow-xl border border-rose-200/90 dark:border-slate-800 overflow-hidden relative my-auto animate-in zoom-in-95 duration-150 flex flex-col md:flex-row max-h-[85vh]">
        
        {/* Media Preview */}
        <div className="md:w-3/5 bg-slate-950 flex items-center justify-center relative min-h-[300px] md:min-h-[440px]">
          {type === 'video' ? (
            <video
              src={videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
              poster={thumbnail}
              controls
              autoPlay
              className="w-full h-full max-h-[440px] object-contain"
            />
          ) : (
            <img
              src={src || thumbnail}
              alt={title}
              className="w-full h-full max-h-[440px] object-contain"
            />
          )}

          {/* Type Badge */}
          <div className="absolute top-3.5 left-3.5">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-600 text-white shadow-xs">
              {type === 'video' ? `Video (${duration || '0:45'})` : 'High-Res Photo'}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white dark:bg-slate-900 space-y-4">
          
          <div className="space-y-3.5">
            {/* Header: Category & Close */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-indigo-950 dark:text-indigo-300 border border-rose-200">
                {category}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-rose-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white leading-snug">
                {title}
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                {description}
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-400 pt-2 border-t border-rose-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-rose-600 dark:text-indigo-400" />
                <span>Captured by <strong className="text-slate-950 dark:text-white font-bold">{author}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-rose-600 dark:text-indigo-400" />
                <span className="font-semibold">{date}</span>
              </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100/80 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-rose-200 dark:border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions: Likes & Sharing */}
          <div className="pt-3 border-t border-rose-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
            <button
              onClick={() => onToggleLike(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                isLiked
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-rose-50/60 hover:bg-rose-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-rose-200/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <a
              href={src || thumbnail}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 border border-rose-200/80 cursor-pointer"
              title="Open full resolution"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MediaDetailModal;
